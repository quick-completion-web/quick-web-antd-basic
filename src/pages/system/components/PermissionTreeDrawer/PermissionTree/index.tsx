import React from "react";
import {Divider, Tree} from "antd";
import {Permission} from "@/data";

export interface PermissionTreeProps {
  dataSource: Permission[];
  permissions: Permission[];
  selectedKeys: string[];
  onSelect: (selectedKeys: string[]) => void;
}

const PermissionTree = (props: PermissionTreeProps) => {
  return <div>
    <Tree
      checkable
      defaultExpandAll
      // @ts-ignore
      onCheck={(keys,e) => props.onSelect(e.checkedNodes.map(item => item.id))}
      checkedKeys={props.selectedKeys.map(id => props.permissions.filter(item => item.id === id)[0].key)}
      treeData={props.dataSource}
    />
    <Divider />
  </div>
}

export default PermissionTree;
