import React from "react";
import {PageContainer} from "@ant-design/pro-layout";
import {Button, Card, Popconfirm, Spin, Tooltip} from "antd";
import {PlusCircleOutlined, DeleteOutlined, EditOutlined} from '@ant-design/icons';
import {PageState} from "@/pages/data";
import {Permission} from "@/data";
import {response} from "@/utils/response";
import {search, deleteById, orderById} from "@/pages/system/menu/service";
import IconFont from "@/components/Icon";
import {FormInstance} from "antd/lib/form";
import MenuDrawer from "@/pages/system/menu/MenuDrawer";
import DropTable from "@/components/Table/DropTable";
import PermissionTreeConverter from "@/pages/system/components/PermissionTree/Converter";

export interface MenuManagerState extends PageState<Permission>{
}

export default class MenuManager extends React.Component<any, MenuManagerState> {

  form = React.createRef<FormInstance>();

  state = {
    loading: true,
    editing: false,
    current: {} as Permission,
    list: [] as Permission[],
  }

  columns = [
    {title: '唯一标识', dataIndex: 'key'},
    {title: '名称', dataIndex: 'name'},
    {title: '路径', dataIndex: 'path'},
    {title: '图标', dataIndex: 'icon', render: (icon: string) => <IconFont style={{fontSize: 24}} type={icon} />},
    {title: '操作', dataIndex: 'id', render: (id: string, menu: Permission) => <div>
        <Tooltip title="修改菜单">
          <Button
            type="primary"
            style={{marginRight: 16}}
            icon={<EditOutlined />}
            onClick={() => this.setState({editing: true, current: menu})}
          />
        </Tooltip>
        <Tooltip title="删除菜单">
          <Popconfirm
            title="菜单删除后无法恢复, 是否删除?"
            onConfirm={() => this.deleteById(id)}
          >
            <Button
              danger
              icon={<DeleteOutlined />}
            />
          </Popconfirm>
        </Tooltip>
        {
          !menu.parent ? <Tooltip title="添加下级菜单">
            <Button
              style={{marginLeft: 16}}
              icon={<PlusCircleOutlined />}
              onClick={() => this.setState({editing: true, current: {parent: menu.path} as Permission})}
            />
          </Tooltip> : null
        }
      </div>},
  ]

  componentDidMount() {
    this.fetch();
  }

  deleteById = (id: string) => {
    response({
      request: deleteById(id),
      current: this
    }).then(() => this.fetch())
  }

  fetch = () => {
    response({
      request: search(),
      current: this
    }).then(resp => {
      const list = PermissionTreeConverter(resp.filter(item => item.menu));
      this.setState({list})
    })
  }

  onDrop = (current: Permission, target: Permission) => {
    response({
      request: orderById({currentId: current.id, targetId: target.id}),
      current: this
    }).then(() => this.fetch())
  }

  render() {
    return <PageContainer>
      <Spin spinning={this.state.loading}>
        <Card
          bordered
          title="菜单列表"
          bodyStyle={{padding: 0}}
          extra={<Button
            icon={<PlusCircleOutlined />}
            onClick={() => this.setState({editing: true})}
          >
            添加顶级菜单
          </Button>}
        >
          <DropTable
            onDrop={this.onDrop}
            pagination={false}
            columns={this.columns}
            dataSource={this.state.list}
          />
        </Card>
      </Spin>
      <MenuDrawer
        show={this.state.editing}
        current={this.state.current}
        onClose={() => this.setState({editing: false, current: {} as Permission})}
        onSuccess={() => this.setState({editing: false, current: {} as Permission}, () => this.fetch())}
      />
    </PageContainer>
  }
}
