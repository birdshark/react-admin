/**
 * Created by hao.cheng on 2017/4/16.
 */
import React from 'react';
import { Table, Button, Row, Col, Card, Modal, Form, Input } from 'antd';
import { getAdminList, saveAdmin } from '../../axios';
import BreadcrumbCustom from '../BreadcrumbCustom';



const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 5 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
  },
};

const CollectionCreateForm = Form.create({ 
  name: 'form_in_modal',
  onFieldsChange: (props, changedFields) => {
    props.onChange(changedFields);
  },
  mapPropsToFields: (props) => {
    return {
      name: Form.createFormField({
        ...props.formData.name,
        value: props.formData.name,
      }),
      email: Form.createFormField({
        ...props.formData.email,
        value: props.formData.email,
      }),
      id: Form.createFormField({
        ...props.formData.id,
        value: props.formData.id,
      }),
      nick: Form.createFormField({
        ...props.formData.nick,
        value: props.formData.nick,
      }),
      password: Form.createFormField({
        ...props.formData.password,
        value: '',
      })
    }
  },
  onValuesChange(_, values) {
    console.log(values);
  }
 })(
  // eslint-disable-next-line
  class extends React.Component {
    render() {
      const {
        visible, onCancel, onCreate, onChange, formData, form
      } = this.props;
      const { getFieldDecorator } = form;
      return (
        <Modal
          visible={visible}
          title="Create a new collection"
          okText="Create"
          onCancel={onCancel}
          onOk={onCreate}
          onChange={onChange}
          formData={formData}
        >
          <Form layout="vertical">
            <Form.Item label="姓名" {...formItemLayout}>
              {getFieldDecorator('name', {
                rules: [{ required: true, message: 'Please input the Name of Admin!' }],
              })(
                <Input />
              )}
            </Form.Item>

            <Form.Item label="邮箱" {...formItemLayout}>
              {getFieldDecorator('email',{
                rules: [{ type: 'email', required: true, message: 'Please input the Email of Admin!' }],
              })(<Input type="email" />)}
            </Form.Item>

            <Form.Item label="昵称" {...formItemLayout}>
              {getFieldDecorator('nick',{
                rules: [{ required: true, message: 'Please input the Nick of Admin!' }],
              })(<Input />)}
            </Form.Item>

            <Form.Item label="密码" {...formItemLayout}>
              {getFieldDecorator('password',{
                rules: [{ required: true, message: 'Please input the Password of Admin!' }],
              })(<Input type="password" />)}
            </Form.Item>

            {getFieldDecorator('id')(<Input type="hidden" />)}
          </Form>
        </Modal>
      );
    }
  }
)

const initAdminModel = {name:'',email:'', id: '', password: ''}

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
      title: '昵称',
      dataIndex: 'nick',
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
    position: 'bottom',
    selectedRowKeys: [], // Check here to configure the default column
    loading: false,
    data: [],
    editing: false,
    pageSizeOptions: ['10', '20', '30', '40'],
    total: 2,
    pageSize: 10,
    current: 1,
    onChange: (page, pageSize) => {this.start(page, pageSize)},
    editingData: initAdminModel,
    editingType: 'add',
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
    this.setState({ editing: true, editingData:record, editingType: 'edit'});
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

  handleSave = () => {
    const form = this.formRef.props.form;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      if(this.state.editingType === 'add') {
        console.log('add action')
      }
      if(this.state.editingType === 'edit'){
        saveAdmin(values).then(({status,message}) => {
           if(status === 'ok'){
             this.start(this.state.current, this.state.pageSize)
           }
        })
      }
      console.log('Received values of form: ', values);
      form.resetFields();
      this.setState({ editing: false });
    });
  }
  handleChange = (changedFields) => {
    // console.log(changedFields)
  }
  add = () => {
    this.setState({ editing: true,editingData: initAdminModel});
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
                  <Button type="primary" onClick={() => this.add()}
                    disabled={loading} loading={loading}
                  >Add</Button>
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
        onCreate={this.handleSave}
        onChange={this.handleChange}
        formData={this.state.editingData}
        />
      </div>
    );
  }
}

export default AsynchronousAdminList;