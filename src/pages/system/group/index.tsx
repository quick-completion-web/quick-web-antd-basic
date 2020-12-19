import React from "react";
import {PageState} from "@/pages/data";
import {Group} from "@/data";
import {PageContainer} from "@ant-design/pro-layout";
import {Button, Card, Pagination, Popconfirm, Table, Tooltip} from "antd";
import {PageResponse, response} from "@/utils/response";
import {DeleteOutlined, EditOutlined, PlusCircleOutlined, BranchesOutlined, CheckCircleOutlined, CloseCircleOutlined} from "@ant-design/icons";
import PermissionTreeDrawer from "@/pages/system/components/PermissionTreeDrawer";
import GroupEditor from "./GroupEditor";
import {query, deleteById} from "./service";

export interface GroupManagerState extends PageState<Group> {
  params: any;
  showPermission: boolean;
}

export default class GroupManager extends React.Component<any, GroupManagerState> {

  state = {
    loading: true,
    dataSource: {} as PageResponse<Group>,
    page: {page: 0, size: 30},
    params: {},
    editing: false,
    current: {} as Group,
    showPermission: false,
  }

  columns = [
    {title: '名称', dataIndex: 'name'},
    {title: '默认组', dataIndex: 'defaults', render: (defaults: boolean) => <div>
        {
          defaults ? <CheckCircleOutlined style={{color: 'green'}} /> :
            <CloseCircleOutlined style={{color: 'red'}} />
        }
      </div>},
    {title: '操作', dataIndex: 'id', render: (id: string, group: Group) => <div>
        <Tooltip title="访问权限授权">
          <Button
            style={{marginRight: 16}}
            icon={<BranchesOutlined />}
            onClick={() => this.setState({showPermission: true, current: group})}
          />
        </Tooltip>
        <Tooltip title="修改管理员组信息">
          <Button
            type="primary"
            style={{marginRight: 16}}
            icon={<EditOutlined />}
            onClick={() => this.setState({editing: true, current: group})}
            />
        </Tooltip>
        <Tooltip title="删除管理员组">
          <Popconfirm title="管理员组删除后无法恢复,是否继续?" onConfirm={() => this.deleteById(id)}>
            <Button
              danger
              style={{marginRight: 16}}
              icon={<DeleteOutlined />}
            />
          </Popconfirm>
        </Tooltip>
      </div>},
  ]

  componentDidMount() {
    this.fetch();
  }

  fetch = () => {
    response({
      request: query(this.state.page,this.state.params),
      current: this
    }).then(dataSource => this.setState({dataSource}))
  }

  onPageChange = (page: number, size: number | undefined) => {
    const pageParams = {page: page - 1, size: size || 30};
    this.setState({page: pageParams}, () => this.fetch())
  }

  deleteById = (adminId: string) => {
    response({
      request: deleteById(adminId),
      current: this
    }).then(() => this.fetch())
  }

  render() {
    return <PageContainer>
      <Card
        title="管理员组列表"
        bodyStyle={{padding: 0}}
        extra={<Button
          icon={<PlusCircleOutlined />}
          onClick={() => this.setState({editing: true})}
        >
          添加管理员组
        </Button>}
      >
        <Table
          pagination={false}
          loading={this.state.loading}
          columns={this.columns}
          dataSource={this.state.dataSource.content}
        />
        <div style={{padding: 16, textAlign: 'right'}}>
          <Pagination
            showSizeChanger
            total={this.state.dataSource.totalElements}
            current={this.state.page.page + 1}
            pageSize={this.state.page.size}
            onChange={this.onPageChange}
          />
        </div>
      </Card>
      <GroupEditor
        visible={this.state.editing}
        dataSource={this.state.current}
        onClose={() => this.setState({editing: false,current: {} as Group})}
        onSuccess={() => this.setState({editing: false,current: {} as Group}, () => this.fetch())}
      />
      <PermissionTreeDrawer
        visible={this.state.showPermission}
        onClose={() => this.setState({showPermission: false, current: {} as Group})}
        onSuccess={() => this.setState({showPermission: false, current: {} as Group})}
        type="group"
        current={this.state.current}
      />
    </PageContainer>
  }

}
