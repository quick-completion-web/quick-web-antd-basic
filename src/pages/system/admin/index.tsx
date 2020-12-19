import React from "react";
import {PageState} from "@/pages/data";
import {Admin} from "@/data";
import {PageContainer} from "@ant-design/pro-layout";
import {Avatar, Button, Card, Pagination, Popconfirm, Table, Tooltip} from "antd";
import {PageResponse, response} from "@/utils/response";
import {query, deleteById} from "@/pages/system/admin/service";
import {DeleteOutlined, EditOutlined, PlusCircleOutlined, LockOutlined, BranchesOutlined, TeamOutlined} from "@ant-design/icons";
import {getInitialState} from "@/app";
import {CurrentUser} from "@/services/user";
import AdminEditor from "@/pages/system/admin/AdminEditor";
import AdminPassword from "@/pages/system/admin/AdminPassword";
import PermissionTreeDrawer from "@/pages/system/components/PermissionTreeDrawer";
import AdminGroup from "@/pages/system/admin/AdminGroup";

export interface AdminManagerState extends PageState<Admin> {
  params: any;
  currentUser: CurrentUser;
  passwordShow: boolean;
  currentId: string | undefined;
  showPermission: boolean;
  showGroup: boolean;
}

export default class AdminManager extends React.Component<any, AdminManagerState> {

  state = {
    currentUser: {} as CurrentUser,
    loading: true,
    dataSource: {} as PageResponse<Admin>,
    page: {page: 0, size: 30},
    params: {},
    editing: false,
    current: {} as Admin,
    passwordShow: false,
    currentId: undefined,
    showPermission: false,
    showGroup: false
  }

  columns = [
    {title: '头像', dataIndex: 'avatar', render: (avatar: string) => <Avatar src={avatar} />},
    {title: '名称', dataIndex: 'name'},
    {title: '登录名称', dataIndex: 'loginName'},
    {title: '操作', dataIndex: 'id', render: (id: string, admin: Admin) => <div>
        <Tooltip title="分配管理员组">
          <Button
            style={{marginRight: 16}}
            icon={<TeamOutlined />}
            onClick={() => this.setState({showGroup: true, currentId: id})}
          />
        </Tooltip>
        <Tooltip title="访问权限授权">
          <Button
            style={{marginRight: 16}}
            icon={<BranchesOutlined />}
            onClick={() => this.setState({showPermission: true, currentId: id})}
          />
        </Tooltip>
        <Tooltip title="重置管理员密码">
          <Button
            style={{marginRight: 16}}
            icon={<LockOutlined />}
            onClick={() => this.setState({passwordShow: true, currentId: id})}
          />
        </Tooltip>
        <Tooltip title="修改管理员信息">
          <Button
            type="primary"
            style={{marginRight: 16}}
            icon={<EditOutlined />}
            onClick={() => this.setState({editing: true, current: admin})}
            />
        </Tooltip>
        <Tooltip title="删除管理员">
          <Popconfirm title="管理员删除后无法恢复,是否继续?" onConfirm={() => this.deleteById(id)}>
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
    getInitialState()
      .then(state => {
        if (state.currentUser){
          this.setState({currentUser: state.currentUser})
        }
      })
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
        title="管理员列表"
        bodyStyle={{padding: 0}}
        extra={<Button
          icon={<PlusCircleOutlined />}
          onClick={() => this.setState({editing: true})}
        >
          添加管理员
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
      <AdminEditor
        visible={this.state.editing}
        dataSource={this.state.current}
        currentUser={this.state.currentUser}
        onClose={() => this.setState({editing: false,current: {} as Admin})}
        onSuccess={() => this.setState({editing: false,current: {} as Admin}, () => this.fetch())}
      />
      <AdminPassword
        visible={this.state.passwordShow}
        adminId={this.state.currentId}
        onClose={() => this.setState({passwordShow: false, current: {} as Admin})}
        onSuccess={() => this.setState({passwordShow: false, current: {} as Admin})}
      />
      <PermissionTreeDrawer
        visible={this.state.showPermission}
        onClose={() => this.setState({showPermission: false, currentId: undefined})}
        onSuccess={() => this.setState({showPermission: false, currentId: undefined})}
        type="admin"
        current={{id: this.state.currentId}}
      />
      <AdminGroup
        onSuccess={() => this.setState({showGroup: false, currentId: undefined})}
        onClose={() => this.setState({showGroup: false, currentId: undefined})}
        visible={this.state.showGroup}
        admin={this.state.currentId}
      />
    </PageContainer>
  }

}
