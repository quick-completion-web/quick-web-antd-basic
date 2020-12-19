import React, {useEffect, useState} from "react";
import {Button, Modal} from "antd";
import IconFont from "@/components/Icon";
import icons from './IconNames';

export interface IconSelectorProps {
  value?: string;
  onChange?: (value: string) => void;
}

const IconSelector = (props: IconSelectorProps) => {

  const [select, setSelect] = useState(false);
  const [selected, setSelected] = useState('');

  useEffect(() => setSelected(props.value || ''), [props.value])

  return <div>
    <div>
      {
        props.value ?
          <IconFont type={props.value} style={{fontSize: 24, marginRight: 16}} /> : null
      }
      <Button onClick={() => setSelect(true)}>选择图标</Button>
    </div>
    <Modal
      visible={select}
      title="选择图标"
      onCancel={() => setSelect(false)}
      onOk={() => {
        if (props.onChange){
          props.onChange(selected);
        }
        setSelect(false)
      }}
    >
      <div style={{height: 400, overflowY: 'scroll'}}>
        {
          icons.map(icon =>
            <span
              onClick={() => setSelected(icon)}
              style={{padding: 5, fontSize: 18, color: icon === selected ? '#1890ff': undefined}}
            >
              <IconFont type={icon} />
            </span>)
        }
      </div>
    </Modal>
  </div>
}

export default IconSelector;
