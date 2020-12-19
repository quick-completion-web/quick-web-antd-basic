import React, {useEffect, useState} from "react";
import {Button, Drawer, Form, Input, notification} from "antd";
import {response} from "@/utils/response";
import {changePassword} from "@/pages/system/admin/service";

export interface AdminPasswordProps {
  visible: boolean;
  adminId: string | undefined;
  onSuccess: () => void;
  onClose: () => void;
}

const AdminPassword = (props: AdminPasswordProps) => {

  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    form.resetFields();
  },[props.adminId])

  const onSubmit = () => {
    form.validateFields()
      .then(values => {
        if (values.check !== values.password){
          notification.error({
            message: '两次输入的密码不相同'
          });
          return;
        }
        response({
          request: changePassword({password: values.password, adminId: props.adminId || ''}),
          onLoadingChange: setLoading
        }).then(() => {
          notification.success({
            message: '管理员密码重置成功'
          })
          form.resetFields();
          props.onSuccess();
        })
      })
  }

  return <Drawer
    width={400}
    visible={props.visible}
    title="重置管理员密码"
    onClose={() => {
      form.resetFields();
      props.onClose();
    }}
  >
    <Form form={form} labelCol={{xs: 6}}>
      <Form.Item
        name="password"
        label="新的密码"
        rules={[{required: true, message: '请输入新的密码'}]}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item
        name="check"
        label="确认密码"
        rules={[{required: true, message: '请再次输入新密码'}]}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item>
        <Button
          type="primary"
          loading={loading}
          style={{width: '100%'}}
          onClick={onSubmit}
        >
          提交
        </Button>
      </Form.Item>
    </Form>
  </Drawer>
}

export default AdminPassword;
