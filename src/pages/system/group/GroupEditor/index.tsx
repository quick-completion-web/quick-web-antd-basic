import React from "react";
import {Group} from "@/data";
import EditDrawer from "@/components/Drawer/EditDrawer";
import {saveGroup} from "@/pages/system/group/service";
import FormSwitch from "@/components/Form/FormSwitch";

export interface GroupEditorProps {
  visible: boolean;
  dataSource: Group;
  onClose: () => void;
  onSuccess: () => void;
}

const GroupEditor = (props: GroupEditorProps) => {

  const save = (group: Group) => {
    return saveGroup(group);
  }

  return <EditDrawer
    width={400}
    bodyLoading={false}
    renderTitle={prefix => `${prefix}管理员组`}
    visible={props.visible}
    dataSource={props.dataSource}
    onClose={props.onClose}
    onSuccess={props.onSuccess}
    fields={[
      {name: 'name', label: '名称', required: true},
      {name: 'defaults', label: '默认组', dom: <FormSwitch /> },
    ]}
    onSubmit={group => save(group as Group)}
  />
}

export default GroupEditor;
