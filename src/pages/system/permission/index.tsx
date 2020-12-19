import React from "react";
import {PageContainer} from "@ant-design/pro-layout";
import {Button, Card, Popconfirm, Spin, Table, Tooltip} from "antd";
import {PlusCircleOutlined, DeleteOutlined, EditOutlined} from '@ant-design/icons';
import {PageState} from "@/pages/data";
import {Permission} from "@/data";
import {response} from "@/utils/response";
import {FormInstance} from "antd/lib/form";
import PermissionDrawer from "./PermissionDrawer";
import {search, deleteById} from "./service";
import PermissionTreeConverter from "@/pages/system/components/PermissionTree/Converter";

export interface PermissionManagerState extends PageState<Permission>{
}

export default class PermissionManager extends React.Component<any, PermissionManagerState> {

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
    {title: '操作', dataIndex: 'id', render: (id: string, menu: Permission) => <div>
        <Tooltip title="添加下级权限">
          <Button
            icon={<PlusCircleOutlined />}
            onClick={() => this.setState({editing: true, current: {parent: menu.path} as Permission})}
          />
        </Tooltip>
        <Tooltip title="修改权限">
          <Button
            type="primary"
            style={{marginLeft: 16}}
            icon={<EditOutlined />}
            onClick={() => this.setState({editing: true, current: menu})}
          />
        </Tooltip>
        <Tooltip title="删除权限">
          <Popconfirm
            title="权限删除后无法恢复, 是否删除?"
            onConfirm={() => this.deleteById(id)}
          >
            <Button
              danger
              style={{marginLeft: 16}}
              icon={<DeleteOutlined />}
            />
          </Popconfirm>
        </Tooltip>
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
      const list = PermissionTreeConverter(resp.filter(item => !item.menu));
      this.setState({list});
    })
  }

  render() {
    return <PageContainer>
      <Spin spinning={this.state.loading}>
        <Card
          bordered
          title="权限列表"
          bodyStyle={{padding: 0}}
          extra={<Button
            icon={<PlusCircleOutlined />}
            onClick={() => this.setState({editing: true})}
          >
            添加顶级权限
          </Button>}
        >
          <Table
            pagination={false}
            columns={this.columns}
            dataSource={this.state.list}
          />
        </Card>
      </Spin>
      <PermissionDrawer
        show={this.state.editing}
        current={this.state.current}
        onClose={() => this.setState({editing: false, current: {} as Permission})}
        onSuccess={() => this.setState({editing: false, current: {} as Permission}, () => this.fetch())}
      />
    </PageContainer>
  }
}
