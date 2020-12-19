import React, {useState} from "react";
import {Permission} from "@/data";
import IconSelector from "@/components/Icon/IconSelector";
import {response} from "@/utils/response";
import {createOrUpdateMenu} from "@/pages/system/menu/service";
import EditDrawer from "@/components/Drawer/EditDrawer";

export interface MenuDrawerProps {
  show: boolean;
  current: Permission;
  onClose: () => void;
  onSuccess: () => void;
}

const MenuDrawer = (props: MenuDrawerProps) => {

  const [loading, setLoading] = useState(false);

  const onSubmit = (values: Permission) => {
    return response({
      request: createOrUpdateMenu({...props.current, ...values, menu: true} as Permission),
      onLoadingChange: setLoading
    })
  }

  return <EditDrawer
    width={400}
    visible={props.show}
    bodyLoading={loading}
    dataSource={props.current}
    fields={[
      {name: 'key', label: '唯一标识',required: true},
      {name: 'name', label: '菜单名称',required: true},
      {name: 'path', label: '访问路径',required: true},
      {name: 'icon', label: '图标', dom: <IconSelector />, filter: item => !(item as Permission).parent },
    ]}
    onClose={props.onClose}
    onSubmit={menu => onSubmit(menu as Permission)}
    onSuccess={props.onSuccess}
    renderTitle={prefix => `${prefix}${props.current.parent ? '子':'顶级'}菜单`}
  />
}

export default MenuDrawer;
