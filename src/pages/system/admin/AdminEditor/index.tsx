import React, {useEffect, useState} from "react";
import {Input} from "antd";
import {Admin} from "@/data";
import FormSwitch from "@/components/Form/FormSwitch";
import EditDrawer from "@/components/Drawer/EditDrawer";
import {response} from "@/utils/response";
import {getEntry, saveAdminEntry} from "@/pages/system/admin/service";
import {CurrentUser} from "@/services/user";

export interface AdminEditorProps {
  visible: boolean;
  dataSource: Admin;
  currentUser: CurrentUser;
  onClose: () => void;
  onSuccess: () => void;
}

const AdminEditor = (props: AdminEditorProps) => {

  const [loading, setLoading] = useState(true);
  const [dataSource, setDataSource] = useState({} as CurrentUser);

  const saveAdmin = (admin: Admin) => {
    return saveAdminEntry(admin as Admin);
  }

  useEffect(() => {
    if (props.dataSource.id){
      response({
        request: getEntry(props.dataSource.id),
        onLoadingChange: setLoading
      }).then(setDataSource)
    }else{
      setLoading(false);
    }
  },[props.dataSource])

  return <EditDrawer
    width={400}
    bodyLoading={loading}
    renderTitle={prefix => `${prefix}管理员`}
    visible={props.visible}
    dataSource={dataSource.id ? dataSource : props.dataSource}
    onClose={() => {
      setDataSource({} as CurrentUser);
      props.onClose();
    }}
    onSuccess={() => {
      setDataSource({} as CurrentUser);
      props.onSuccess();
    }}
    fields={[
      {name: 'name', label: '名称', required: true},
      {name: 'loginName', label: '登录名称', required: true},
      {name: 'password', label: '初始密码', required: true, filter: current => !current.id, dom: <Input.Password />},
      {
        name: 'superAdmin',
        label: '超级管理员',
        filter: () => (props.currentUser.id !== undefined && props.currentUser.superAdmin), dom: <FormSwitch />
      },
    ]}
    onSubmit={admin => saveAdmin(admin as Admin)}
  />
}

export default AdminEditor;
