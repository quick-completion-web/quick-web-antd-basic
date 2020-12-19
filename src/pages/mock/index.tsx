import React from "react";
import {PageContainer} from "@ant-design/pro-layout";
import {Button, Card, Form, Input, Modal, Table, Tooltip} from "antd";
import {IssuesCloseOutlined, DeleteOutlined} from '@ant-design/icons';
import {PageState} from "@/pages/data";
import {response} from "@/utils/response";
import {add, deleteById, fetchAll} from "@/pages/mock/service";
import {Mock} from "@/pages/mock/data";
import ReactJson from "react-json-view";
import {FormInstance} from "antd/lib/form";



export default class MockManager extends React.Component<any, PageState<Mock>> {

  form = React.createRef<FormInstance>();

  state = {
    list: [],
    loading: true,
    current: {} as Mock,
    editing: false
  }

  componentDidMount() {
    this.fetch()
  }

  fetch = () => {
    response({
      request: fetchAll(),
      current: this
    }).then(resp => {
      const list = resp.map(item => ({...item, content: JSON.parse(item.content)}))
      this.setState({list})
    })
  }

  onSubmit = () => {
    // @ts-ignore
    this.form.current.validateFields()
      .then(values => {
        response({
          request: add(values as Mock),
          current: this
        }).then(() => {
          this.setState({editing: false}, () => this.fetch())
        })
      })
  }

  onDelete = (id: string) => {
    response({
      request: deleteById(id),
      current: this
    }).then(() => this.fetch())
  }

  render() {
    return <PageContainer>
      <Card
        title="数据列表"
        bodyStyle={{padding: 0}}
        extra={<Button onClick={() => this.setState({editing: true})}>添加模拟数据</Button>}
      >
        <Table
          loading={this.state.loading}
          dataSource={this.state.list}
          pagination={false}
          columns={[
            {title: '请求路径', dataIndex: 'path'},
            {title: '说明', dataIndex: 'info'},
            {title: '操作', dataIndex: 'id', render: (id: string,mock: Mock) => <div>
                <Tooltip title="查看响应">
                  <Button
                    type="primary"
                    icon={<IssuesCloseOutlined />}
                    onClick={() => this.setState({current: mock})}
                  />
                </Tooltip>
                <Tooltip title="删除">
                  <Button
                    danger
                    style={{marginLeft: 16}}
                    icon={<DeleteOutlined />}
                    onClick={() => this.onDelete(id)}
                  />
                </Tooltip>
              </div>},
          ]}
        />
      </Card>

      {
        this.state.current.id ?
          <Card
            title={this.state.current.path}
            style={{marginTop: 24}}
            extra={<span style={{color: '#999999'}}>响应内容</span>}
          >
            <ReactJson
              // @ts-ignore
              src={this.state.current.content}
            />
          </Card> : null
      }

      <Modal
        title="添加模拟数据"
        width={600}
        visible={this.state.editing}
        onCancel={() => this.setState({editing: false})}
        onOk={this.onSubmit}
      >
        <Form ref={this.form} labelCol={{xs: 6}}>
          <Form.Item
            name="path"
            label="路径"
            rules={[{required: true, message: '请求路径不能为空'}]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="info"
            label="说明"
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="content"
            label="响应内容"
            rules={[{required: true, message: '响应内容不能为空'}]}
          >
            <Input.TextArea style={{height: 300}} />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>;
  }

}
