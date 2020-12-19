import React from "react";
import {Checkbox, Col, Divider, Row} from "antd";
import {Permission} from "@/data";

export interface MenuTreeProps {
  dataSource: Permission[];
  selectedKeys: string[];
  onSelect: (selectedKeys: string[]) => void;
}

const MenuTree = (props: MenuTreeProps) => {

  const onCheck = (checked: boolean,menu: Permission) => {
    let keys = [...props.selectedKeys];
    if (menu.parent){
      const parent = props.dataSource.filter(item => item.path === menu.parent)[0];
      if (checked){
        keys = [...keys, menu.id, parent.id]
      }else {
        keys = keys.filter(key => key !== menu.id);
        const childrenKeys = parent.children.map(child => child.id);
        const removeParent = keys.filter(key => childrenKeys.indexOf(key) !== -1).length === 0;
        if (removeParent){
          keys = keys.filter(key => key !== parent.id);
        }
      }
    }else if (checked){
        keys = [...keys, menu.id]
    } else {
        keys = keys.filter(key => key !== menu.id);
    }
    props.onSelect(keys);
  }

  return <div>
    {
      props.dataSource.map(item => <Row>
        <Col span={24}>
          {
            (item.children || []).length > 0 ?
              <span style={{fontWeight: 'bold'}}>{item.name}</span> :
              <div>
                <Checkbox
                  checked={props.selectedKeys.indexOf(item.id) !== -1}
                  onChange={e => onCheck(e.target.checked, item)}
                />
                <span style={{marginLeft: 16}}>{item.name}</span>
              </div>
          }
        </Col>
        <Col span={24}>
          <Row>
            {
              (item.children || []).map(child => <Col span={8} style={{paddingTop: 16}}>
                <Checkbox
                  checked={props.selectedKeys.indexOf(child.id) !== -1}
                  onChange={e => onCheck(e.target.checked, child)}
                />
                <span style={{marginLeft: 16}}>{child.name}</span>
              </Col>)
            }
          </Row>
        </Col>
        <Col span={24}><Divider /></Col>
      </Row>)
    }
  </div>

  // return <Tabs activeKey={tab} onChange={setTab}>
  //   <Tabs.TabPane tab="权限" key="permission">
  //     <Tree
  //       checkable
  //       defaultExpandAll
  //       // @ts-ignore
  //       onCheck={(keys,e) => props.onSelect(false,e.checkedNodes)}
  //       checkedKeys={props.selected.filter(item => !item.menu).map(item => item.key)}
  //       treeData={props.permissions}
  //     />
  //   </Tabs.TabPane>
  //   <Tabs.TabPane tab="菜单" key="menus">
  //     <Tree
  //       checkable
  //       defaultExpandAll
  //       // @ts-ignore
  //       onCheck={(keys,e) => props.onSelect(true,e.checkedNodes)}
  //       checkedKeys={props.selected.filter(item => item.menu).map(item => item.key)}
  //       treeData={props.menus}
  //     />
  //   </Tabs.TabPane>
  // </Tabs>
}

export default MenuTree;
