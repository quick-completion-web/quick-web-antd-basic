import React, {useState} from "react";
import {Form, Input, Modal, notification} from "antd";
import {response} from "@/utils/response";
import {request, history} from "umi";
import {outLogin} from "@/services/login";

const changePassword = async (password: string) => {
  const form = new FormData();
  form.append("password", password);
  return request('/api/admin/password/change',{
    method: 'POST',
    body: form
  });
}

export interface ChangePasswordModalProps {
  show: boolean;
  onClose: () => void;
}

const ChangePasswordModal = (props: ChangePasswordModalProps) => {

  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);

  return <Modal
    visible={props.show}
    title="修改密码"
    okButtonProps={{loading}}
    cancelButtonProps={{disabled: loading}}
    onCancel={() => props.onClose()}
    onOk={() => {
      form.validateFields()
        .then(values => {
          if (values.password !== values.check){
            notification.error({
              message: '两次输入的密码不相同'
            })
            return;
          }
          response({
            request: changePassword(values.password),
            onLoadingChange: setLoading
          }).then(resp => {
            if (resp){
              notification.success({
                message: '密码修改成功, 请重新登录'
              })
              props.onClose();
              outLogin()
                .then(() => {
                  history.replace('/user/login')
                })
            }
          })
        })
    }}
  >
    <Form form={form} labelCol={{xs: 6}}>
      <Form.Item
        name="password"
        label="新密码"
        rules={[{required: true, message: '请输入新密码'}]}
       >
        <Input.Password />
      </Form.Item>
      <Form.Item
        name="check"
        label="确认密码"
        rules={[{required: true, message: '请再次输入密码'}]}
      >
        <Input.Password />
      </Form.Item>
    </Form>
  </Modal>
}

export default ChangePasswordModal;
