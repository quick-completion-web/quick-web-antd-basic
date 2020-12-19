import React from "react";
import {Permission} from "@/data";
import {createOrUpdateMenu} from "@/pages/system/menu/service";
import EditDrawer from "@/components/Drawer/EditDrawer";
import {Select} from "antd";

export interface MenuDrawerProps {
  show: boolean;
  current: Permission;
  onClose: () => void;
  onSuccess: () => void;
}

const PermissionDrawer = (props: MenuDrawerProps) => {

  const onSubmit = (values: Permission) => {
    return createOrUpdateMenu({...props.current, ...values, menu: false} as Permission);
  }

  return <EditDrawer
    width={400}
    visible={props.show}
    bodyLoading={false}
    dataSource={props.current}
    fields={[
      {name: 'key', label: '唯一标识',required: true},
      {name: 'name', label: '权限名称',required: true},
      {name: 'path', label: '访问路径',required: true},
      {name: 'method', label: '请求方式',dom: <Select>
          <Select.Option value="*">*</Select.Option>
          <Select.Option value="get">get</Select.Option>
          <Select.Option value="post">post</Select.Option>
          <Select.Option value="delete">delete</Select.Option>
          <Select.Option value="option">option</Select.Option>
          <Select.Option value="patch">patch</Select.Option>
        </Select>},
    ]}
    onClose={props.onClose}
    onSubmit={menu => onSubmit(menu as Permission)}
    onSuccess={props.onSuccess}
    renderTitle={prefix => `${prefix}${props.current.parent ? '子':'顶级'}权限`}
  />
}

export default PermissionDrawer;
