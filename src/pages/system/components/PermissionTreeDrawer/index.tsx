import React, {useEffect, useState} from "react";
import {Button, Drawer, Spin, Tabs} from "antd";
import PermissionTreeConverter from "@/pages/system/components/PermissionTree/Converter";
import {Permission} from "@/data";
import {response} from "@/utils/response";
import MenuTree from "@/pages/system/components/PermissionTreeDrawer/MenuTree";
import PermissionTree from "@/pages/system/components/PermissionTreeDrawer/PermissionTree";
import {getSelected, grant, permissions as getPermissions} from "./service";

export interface PermissionDrawerProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  current: {
    id: string | undefined
  };
  type: 'group' | 'admin';
}

const PermissionTreeDrawer = (props: PermissionDrawerProps) => {

  const [loading, setLoading] = useState(true);
  const [permissions, setPermissions] = useState([] as Permission[]);
  const [permissionList, setPermissionList] = useState([] as Permission[]);
  const [menus, setMenus] = useState([] as Permission[]);
  const [selectedKeys, setSelectedKeys] = useState([] as string[])
  const [menuSelectedKeys, setMenuSelectedKeys] = useState([] as string[])

  const [tab, setTab] = useState('permission');

  const fetch = () => {
    response({
      request: getPermissions(),
      onLoadingChange: setLoading
    }).then(resp => {
      setPermissions(PermissionTreeConverter(resp.filter(item => !item.menu)));
      setPermissionList(resp.filter(item => !item.menu));
      setMenus(PermissionTreeConverter(resp.filter(item => item.menu)))
    })
  }

  const fetchSelected = () => {
    response({
      request: getSelected(`/api/${props.type}/permissions`, props.current.id || ''),
      onLoadingChange: setLoading
    }).then(selected => {
      setSelectedKeys(selected.filter(item => !item.menu).map(item => item.id));
      setMenuSelectedKeys(selected.filter(item => item.menu).map(item => item.id));
    })
  }

  const onSubmit = () => {
    response({
      request: grant(`/api/${props.type}/grant`, props.current.id || '', [...menuSelectedKeys, ...selectedKeys]),
      onLoadingChange: setLoading
    }).then(() => {
      fetchSelected();
      props.onSuccess();
    })
  }

  useEffect(() => fetch(),[])

  useEffect(() => {
    if (props.current.id) {
      fetchSelected();
    }
  },[props.current])

  if (!props.current.id){
    return null;
  }

  const onSelected = (menu: boolean, keys: string[]) => {
    if (menu){
      setMenuSelectedKeys(keys);
    }else{
      setSelectedKeys(keys)
    }
  }

  return <Drawer
    width={400}
    visible={props.visible}
    title="访问权限授权"
    onClose={props.onClose}
  >
    <Spin spinning={loading}>
      <Tabs activeKey={tab} onChange={setTab}>
        <Tabs.TabPane tab="权限" key="permission">
          <PermissionTree
            dataSource={permissions}
            permissions={permissionList}
            selectedKeys={selectedKeys}
            onSelect={keys => onSelected(false,keys)}
          />
        </Tabs.TabPane>
        <Tabs.TabPane tab="菜单" key="menus">
          <MenuTree
            dataSource={menus}
            selectedKeys={menuSelectedKeys}
            onSelect={keys => onSelected(true,keys)}
          />
        </Tabs.TabPane>
      </Tabs>
      <Button
        type="primary"
        style={{width: '100%'}}
        onClick={onSubmit}
      >
        提交
      </Button>
    </Spin>
  </Drawer>
}

export default PermissionTreeDrawer;
