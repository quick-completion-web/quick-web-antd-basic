import React, {useEffect, useState} from "react";
import {Button, Checkbox, Drawer} from "antd";
import {Group} from "@/data";
import {response} from "@/utils/response";
import {getGroupById, groups as getGroups, setGroups as grant} from "./service";

export interface AdminGroupProps {
  visible: boolean;
  admin: string | undefined;
  onSuccess: () => void;
  onClose: () => void;
}

const AdminGroup = (props: AdminGroupProps) => {

  const [loading, setLoading] = useState(true);
  const [groups, setGroups] = useState([] as Group[])
  const [selectedKeys, setSelectedKeys] = useState([] as string[]);

  useEffect(() => {
    if (!props.admin){
      return;
    }

    response({
      request: getGroups(),
      onLoadingChange: setLoading
    }).then(setGroups)

    response({
      request: getGroupById(props.admin),
      onLoadingChange: setLoading
    }).then(gs => setSelectedKeys(gs.map(group => group.id)))

  },[props.admin])

  const onSelect = (checked: boolean, group: Group) => {
    if (checked){
      setSelectedKeys([...selectedKeys, group.id])
    }else{
      setSelectedKeys(selectedKeys.filter(key => key !== group.id))
    }
  }

  const onSubmit = () => {
    response({
      request: grant(props.admin || '', selectedKeys),
      onLoadingChange: setLoading
    }).then(props.onSuccess)
  }

  return <Drawer
    width={300}
    title="分配管理员组"
    visible={props.visible}
    onClose={props.onClose}
  >
    {
      groups.map(group => <div style={{paddingBottom: 16}}>
        <Checkbox
          onChange={e => onSelect(e.target.checked, group)}
          checked={selectedKeys.indexOf(group.id) !== -1}
        />
        <span style={{marginLeft: 16}}>{group.name}</span>
      </div>)
    }

    <Button
      type="primary"
      loading={loading}
      style={{width: '100%'}}
      onClick={onSubmit}
    >
      提交
    </Button>
  </Drawer>
}

export default AdminGroup;
