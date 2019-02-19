/**
 * Created by hao.cheng on 2017/4/16.
 */
import React from 'react';
import { Table, Button, Row, Col, Card, Modal, Form, Input, Radio } from 'antd';
import { getAdminList } from '../../axios';
import BreadcrumbCustom from '../BreadcrumbCustom';

const CollectionCreateForm = Form.create({ 
  name: 'form_in_modal',
  onFieldsChange: () => {},
  mapPropsToFields: () => {}
 })(
  // eslint-disable-next-line
  class extends React.Component {
    render() {
      const {
        visible, onCancel, onCreate, form, formData
      } = this.props;
      const { getFieldDecorator } = form;
      return (
        <Modal
          visible={visible}
          title="Create a new collection"
          okText="Create"
          onCancel={onCancel}
          onOk={onCreate}
          formData={formData}
        >
          <Form layout="vertical">
            <Form.Item label="Name">
              {getFieldDecorator('name', {
                rules: [{ required: true, message: 'Please input the title of collection!' }],
              })(
                <Input />
              )}
            </Form.Item>
            <Form.Item label="Email">
              {getFieldDecorator('email',{
                rules: [{ required: true, message: 'Please input the email of collection!' }],
              })(<Input type="email" />)}
            </Form.Item>
          </Form>
        </Modal>
      );
    }
  }
);



class AsynchronousAdminList extends React.Component {
  constructor(props) {
    super(props);
    /**
     * 表头数据
     */
    this.columns = [{
      title: 'ID',
      dataIndex: 'id',
      width: 20,
      // render: (text, record) => <a href={record.url} target="_blank" rel="noopener noreferrer">{text}</a>,
      align: 'center'
    }, {
      title: '姓名',
      dataIndex: 'name',
      width: 80,
      align: 'center'
    }, {
      title: '邮箱',
      dataIndex: 'email',
      width: 80,
      align: 'center'
    }, {
      title: '头像',
      dataIndex: 'avatar',
      width: 200,
      align: 'center'
    }, {
      title: '操作',
      dataIndex: 'Operation',
      width: 80,
      align: 'center',
      render: (text, record) => <Button type="primary" icon="edit" size="small" onClick={() => this.edit(text, record)} />,
    }]
  }

  state = {
    position: 'both',
    selectedRowKeys: [], // Check here to configure the default column
    loading: false,
    data: [],
    editing: false,
    pageSizeOptions: ['10', '20', '30', '40'],
    total: 2,
    pageSize: 1,
    current: 1,
    onChange: (page, pageSize) => {this.start(page, pageSize)},
    editingData:{},
  };
  componentDidMount() {
    this.start();
  }

  /**
   * 加载表格内容
   */
  start = (page,pageSize) => {
    page = page || this.state.current
    pageSize = pageSize || this.state.pageSize
    getAdminList(page,pageSize).then(({ admins, total, current}) => {
      this.setState({
        data: admins,
        loading: false,
        total: total,
        current: current 
      })
    })
  }
  /**
   * 编辑
   */
  edit = (text, record) => {
    console.log(text,record);
    this.setState({ editing: true, editingData:record});
  }

  /**
   * 复选框监听
   */
  onSelectChange = (selectedRowKeys) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  }
  saveFormRef = (formRef) => {
    this.formRef = formRef
  }

  handleCancel = () => {
    this.setState({ editing: false });
  }

  handleCreate = () => {
    const form = this.formRef.props.form;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }

      console.log('Received values of form: ', values);
      form.resetFields();
      this.setState({ editing: false });
    });
  }
  render() {
    const { loading, selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const hasSelected = selectedRowKeys.length > 0;
    return (
      <div className="gutter-example">
        <BreadcrumbCustom first="表格" second="异步表格" />
        <Row gutter={16}>
          <Col className="gutter-row" md={24}>
            <div className="gutter-box">
              <Card title="异步表格--BBC新闻今日热门" bordered={false}>
                <div style={{ marginBottom: 16 }}>
                  <Button type="primary" onClick={() => this.start(this.state.current, this.state.pageSize)}
                    disabled={loading} loading={loading}
                  >Reload</Button>
                  <span style={{ marginLeft: 8 }}>{hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}</span>
                </div>
                <Table bordered pagination={this.state} size="small" rowKey="id" rowSelection={rowSelection} columns={this.columns} dataSource={this.state.data} />
              </Card>
            </div>
          </Col>
        </Row>
        <CollectionCreateForm
        wrappedComponentRef={this.saveFormRef}
        visible={this.state.editing}
        onCancel={this.handleCancel}
        onCreate={this.handleCreate}
        formData={this.state.formData}
        />
      </div>
    );
  }
}

export default AsynchronousAdminList;