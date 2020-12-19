import React, {useEffect, useState} from "react";
import {Button, Drawer, Form, Spin} from "antd";
import FormBuilder from "@/components/Form/FormBuilder";
import {EditDrawerProps} from "@/components/Form/FormBuilder/data";
import {response} from "@/utils/response";

const EditDrawer = (props: EditDrawerProps) => {

  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    form.resetFields();
    form.setFieldsValue(props.dataSource)
  },[props.dataSource])

  const onSubmit = () => {
    form.validateFields()
      .then(values => {
        response({
          request: props.onSubmit({...props.dataSource,...values}),
          onLoadingChange: setLoading
        }).then(() => {
          form.resetFields();
          props.onSuccess();
        })
      })
  }

  const prefix = props.dataSource.id ? (props.editPrefix || '修改'):(props.addPrefix || '添加');
  return <Drawer
    {...props}
    onClose={(e) => {
      if (props.onClose){
        form.resetFields();
        props.onClose(e);
      }
    }}
    title={props.renderTitle ? props.renderTitle(prefix) : prefix}
  >
    <Spin spinning={props.bodyLoading}>
      <FormBuilder
        form={form}
        labelCol={props.labelCol || {xs: 6}}
        items={props.fields.filter(field => field.filter ? field.filter(props.dataSource) : true)}
      >
        <div>
          <Button
            style={{width: '100%'}}
            type="primary"
            onClick={onSubmit}
            loading={loading}
          >提交</Button>
        </div>
      </FormBuilder>
    </Spin>
  </Drawer>
}

export default EditDrawer;
