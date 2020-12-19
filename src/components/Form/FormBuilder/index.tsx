import React from "react";
import {FormProps} from "antd/lib/form";
import {Form, Input} from "antd";
import {Rule} from "rc-field-form/lib/interface";

export interface FormItemData {
  name: string;
  label: string;
  required?: boolean;
  dom?: React.ReactNode;
  rules?: Rule[];
}

export interface FormBuilderProps extends FormProps {
  items: FormItemData[];
}

const getItemConfig = (item: FormItemData) => {
  const conf = {...item};
  if (conf.required){
    conf.rules = [...(conf.rules || []),{required: true, message: `${conf.label}不能为空`}]
  }
  return conf;
}

const FormBuilder = (props: FormBuilderProps) => {
  return <Form {...props}>
    {
      props.items.map(item => <Form.Item
        {...getItemConfig(item)}
      >
        {item.dom || <Input />}
      </Form.Item>)
    }
    <Form.Item>
      {props.children}
    </Form.Item>
  </Form>
}

export default FormBuilder;
