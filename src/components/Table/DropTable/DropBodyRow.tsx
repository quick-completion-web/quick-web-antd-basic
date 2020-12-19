import React from "react";
import {useDrag, useDrop} from 'react-dnd';

export interface DropBodyRowProps {
  isOver: boolean;
  className: string;
  connectDragSource: (node: React.ReactNode) => React.ReactNode;
  connectDropTarget: (node: React.ReactNode) => React.ReactNode;
  moveRow: (hover: {index: number, dataSource: any}, target: {index: number, dataSource: any}) => void;
  style: object;
  index: number;
  record: any;
}

const type = 'DragableBodyRow';

const DropBodyRow = (props: DropBodyRowProps) => {
  const { record, index, moveRow, className, style, ...restProps } = props;
  const ref = React.useRef();
  const [{ isOver, dropClassName }, drop] = useDrop<{index: number, type: any, dataSource: any},any, any>({
    accept: type,
    collect: monitor => {
      const { index: dragIndex } = monitor.getItem() || {};
      if (dragIndex === index) {
        return {};
      }
      return {
        isOver: monitor.isOver(),
        dropClassName: dragIndex < index ? ' drop-over-downward' : ' drop-over-upward',
      };
    },
    drop: (item) => {
      moveRow(
        {index: item.index, dataSource: item.dataSource},
        {index, dataSource: record}
      );
    },
  });
  const [, drag] = useDrag({
    item: { type, index, dataSource:  record},
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  });
  drop(drag(ref));
  return (
    <tr
      // @ts-ignore
      ref={ref}
      className={`${className}${isOver ? dropClassName : ''}`}
      style={{ cursor: 'move', ...style }}
      {...restProps}
    />
  );
};

export default DropBodyRow;
