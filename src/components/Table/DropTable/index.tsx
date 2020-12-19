import React, {useCallback, useRef} from "react";
import { DndProvider, createDndContext } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import DropBodyRow from "@/components/Table/DropTable/DropBodyRow";
import {Table} from "antd";
import {TableProps} from "antd/lib/table";
import {Permission} from "@/data";

export interface DropTableProps extends TableProps<any> {
  onDrop: (current: Permission, target: Permission) => void;
}

const RNDContext = createDndContext(HTML5Backend);

const DropTable = (props: DropTableProps) => {

  const manager = useRef(RNDContext);

  const moveRow = useCallback(
    (hover, target,) => {
      if (props.onDrop) {
        props.onDrop(hover.dataSource, target.dataSource);
      }
    },
    [props.dataSource],
  );

  return (
    // @ts-ignore
    <DndProvider manager={manager.current.dragDropManager}>
      <Table
        {...props}
        components={{
          body: {
            row: DropBodyRow,
          },
        }}
        keyIndex="id"
        // @ts-ignore
        onRow={(record, index) => ({
          record,
          index,
          moveRow,
        })}
      />
    </DndProvider>
  );
}

export default DropTable;
