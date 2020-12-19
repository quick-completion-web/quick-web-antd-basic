import React from "react";
import {Switch} from "antd";
import {SwitchProps} from "antd/lib/switch";

export interface FormSwitchProps extends SwitchProps {
  value?: boolean;
}

const FormSwitch = (props: FormSwitchProps) => {

  return <Switch
    {...props}
    checked={props.value}
  />
}

export default FormSwitch;
