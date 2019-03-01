/**
 * Created by hao.cheng on 2017/4/16.
 */
import React from 'react';
import { Table, Button, Row, Col, Card, Modal, Form, Input, Select } from 'antd';
import { getArticleList, saveArticle, getAllLabels, getAllTypes } from '../../axios';
import BreadcrumbCustom from '../BreadcrumbCustom';
import ReactQuill from 'react-quill'; // ES6
import 'react-quill/dist/quill.snow.css'; 


const formItemLayout = {
  labelCol: {
    xs: { span: 2 },
    sm: { span: 2 },
  },
  wrapperCol: {
    xs: { span: 2 },
    sm: { span: 16 },
  },
};

const reactQuillStyle = {minHeight: '100px !important',maxHeight: '300px',overflow: 'hidden',overflowY: 'scroll',overflowX: 'scroll'}

const modules = {
  toolbar: [
    ['bold', 'italic', 'underline','strike', 'blockquote'],
    [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
    ['link', 'image'],
    ['clean']
  ],
}

const formats = [
  'bold', 'italic', 'underline', 'strike', 'blockquote',
  'list', 'bullet', 'indent',
  'link', 'image'
]

const Option = Select.Option
const CollectionCreateForm = Form.create({ 
  name: 'form_in_modal',
  onFieldsChange: (props, changedFields) => {
    props.onChange(changedFields);
  },
  mapPropsToFields: (props) => {
    console.log(props.editorState);
    return {
      title: Form.createFormField({
        ...props.formData.title,
        value: props.formData.title,
      }),
      article_label: Form.createFormField({
        ...props.formData.article_label,
        value: props.formData.article_label === "" ?[]:(props.formData.article_label).split(",")
      }),
      description: Form.createFormField({
        ...props.formData.description,
        value: props.formData.description,
      }),
      article_type: Form.createFormField({
        ...props.formData.article_type,
        value: props.formData.article_type,
      }),
      id: Form.createFormField({
        ...props.formData.id,
        value: props.formData.id,
      }),
      content: Form.createFormField({
        ...props.formData.content,
        value: props.formData.content
      })
    }
  },
  onValuesChange(_, values) {
    // console.log(values);
  }
 })(
  // eslint-disable-next-line
  class extends React.Component {
    render() {
      const {
        visible, onCancel, onCreate, onChange, formData, formLabels, formTypes, editingType, form
      } = this.props;

      const title = editingType === 'add'? '新增':'修改';
      const labelOptions = formLabels.map(d => <Option key={d.label_name}>{d.label_name}</Option>);
      // const typeOptions = formTypes.map(d => <Option key={d.type_id}>{d.type_name}</Option>);
      const typeOptions = [];
      for(let i in formTypes){
        typeOptions.push(<Option key={i}>{formTypes[i]}</Option>)
      }
      const { getFieldDecorator } = form;
      return (
        <Modal
          visible={visible}
          title={title}
          okText="提交"
          cancelText="取消"
          onCancel={onCancel}
          onOk={onCreate}
          onChange={onChange}
          formData={formData}
          formLabels={formLabels}
          formTypes={formTypes}
          editingType={editingType}
          bodyStyle={{textAlign:"center"}}
          width={800}
        >
          <Form layout="vertical">
            <Form.Item label="标题" {...formItemLayout}>
              {getFieldDecorator('title', {
                rules: [{ required: true, message: 'Please input the Name of Admin!' }],
              })(
                <Input />
              )}
            </Form.Item>

            <Form.Item label="标签" {...formItemLayout}>
              {getFieldDecorator('article_label',{
                rules: [{ required: true, message: 'Please input the Email of Admin!' }],
              })(<Select mode="tags" placeholder="Please select favourite colors" tokenSeparators={[',']}>{labelOptions}</Select>)}
            </Form.Item>

            <Form.Item label="类别" {...formItemLayout}>
              {getFieldDecorator('article_type',{
                rules: [{ required: true, message: 'Please input the Nick of Admin!' }],
              })(<Select placeholder="文章类别">{typeOptions}</Select>)}
            </Form.Item>

            <Form.Item label="描述" {...formItemLayout}>
              {getFieldDecorator('description',{
                rules: [{ required: true, message: 'Please input the Password of Admin!' }],
              })(<Input.TextArea rows={4} />)}
            </Form.Item>
            
            <Form.Item label="内容" {...formItemLayout}>
              {getFieldDecorator('content',{
                rules: [{ message: 'Please input the Password of Admin!' }],
              })(<ReactQuill modules={modules} formats={formats} style={reactQuillStyle} />)}
            </Form.Item>
            
            {getFieldDecorator('id')(<Input type="hidden" />)}
          </Form>
        </Modal>
      );
    }
  }
)

const initAdminModel = {title:'',article_label:'', description: '', article_type: [], content: ''}

class AsynchronousArticleList extends React.Component {
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
      title: '标题',
      dataIndex: 'title',
      width: 120,
      align: 'center'
    }, {
      title: '标签',
      dataIndex: 'article_label',
      width: 80,
      align: 'center'
    }, {
      title: '描述',
      dataIndex: 'description',
      width: 80,
      align: 'center'
    }, {
      title: '类别',
      dataIndex: 'article_type',
      width: 50,
      align: 'center',
      render: (text, record) => this.state.types[text],
    }, {
      title: '操作',
      dataIndex: 'Operation',
      width: 50,
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
    labels:[],
    types:[]
  };
  componentDidMount() {
    getAllLabels().then(({data})=>{
      this.setState({labels : data})
    })
    getAllTypes().then(({data})=>{
      this.setState({types : data})
    })
    this.start();
  }

  /**
   * 加载表格内容
   */
  start = (page,pageSize) => {
    page = page || this.state.current
    pageSize = pageSize || this.state.pageSize
    getArticleList(page,pageSize).then(({ admins, total, current}) => {
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

  /**
   * 取消编辑
   */
  handleCancel = () => {
    this.setState({ editing: false });
  }

  /**
   * 保存
   */
  handleSave = () => {
    const form = this.formRef.props.form;
    form.validateFields((err, values) => {
      console.log(values);
      if (err) {
        return;
      }
      if(this.state.editingType === 'add') {
      }
      if(this.state.editingType === 'edit'){
        let data = {...values}
        data.article_label = (values.article_label).join(",")||''
        saveArticle(data).then(({status,message}) => {
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

  /**
   *  编辑监听
   */
  handleChange = (changedFields) => {
    console.log(changedFields);
  }
  add = () => {
    this.setState({ editing: true,editingData: initAdminModel, editingType: 'add'});
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
              <Card title="文章列表" bordered={false}>
                <div style={{ marginBottom: 16 }}>
                  <Button type="primary" onClick={() => this.start(this.state.current, this.state.pageSize)}
                    disabled={loading} loading={loading}
                  >Reload</Button>
                  <Button type="primary" onClick={() => this.add()}
                    disabled={loading} loading={loading}
                  >Add</Button>
                  <span style={{ marginLeft: 8 }}>{hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}</span>
                </div>
                <Table bordered expandedRowRender={(record) => <p>{record.content}</p>} pagination={this.state} size="small" rowKey="id" rowSelection={rowSelection} columns={this.columns} dataSource={this.state.data} />
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
        formLabels={this.state.labels}
        formTypes={this.state.types}
        editingType={this.state.editingType}
        />
      </div>
    );
  }
}

export default AsynchronousArticleList;