/**
 * Created by hao.cheng on 2017/4/16.
 */
import React from 'react';
import { Table, Button, Row, Col, Card, Modal, Form, Input } from 'antd';
import { getArticleList, saveArticle } from '../../axios';
import BreadcrumbCustom from '../BreadcrumbCustom';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, ContentState } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';



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
    console.log(props.editorState);
    return {
      title: Form.createFormField({
        ...props.formData.title,
        value: props.formData.title,
      }),
      article_label: Form.createFormField({
        ...props.formData.article_label,
        value: props.formData.article_label,
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
        visible, onCancel, onCreate, onChange, formData, editorState, onEditorStateChange, onContentStateChange, form
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
          editorState={editorState}
          onEditorStateChange={onEditorStateChange}
          onContentStateChange={onContentStateChange}
          width={720}
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
              })(<Input type="email" />)}
            </Form.Item>

            <Form.Item label="类别" {...formItemLayout}>
              {getFieldDecorator('article_type',{
                rules: [{ required: true, message: 'Please input the Nick of Admin!' }],
              })(<Input />)}
            </Form.Item>

            <Form.Item label="描述" {...formItemLayout}>
              {getFieldDecorator('description',{
                rules: [{ required: true, message: 'Please input the Password of Admin!' }],
              })(<Input.TextArea rows={4} />)}
            </Form.Item>
            {getFieldDecorator('id')(<Input type="hidden" />)}
          </Form>
          <Form.Item label="内容" {...formItemLayout}>
              {getFieldDecorator('content',{
                rules: [{ message: 'Please input the Password of Admin!' }],
              })(<Editor
                editorState={editorState}
                onEditorStateChange={onEditorStateChange}
                onContentStateChange={onContentStateChange}
                toolbarClassName="home-toolbar"
                wrapperClassName="home-wrapper"
                editorClassName="home-editor"
                toolbar={{
                    history: { inDropdown: true },
                    inline: { inDropdown: false },
                    list: { inDropdown: true },
                    textAlign: { inDropdown: true },
                    image: { uploadCallback: this.imageUploadCallBack },
                }}
                placeholder="请输入正文~~尝试@哦，有惊喜"
                spellCheck
                localization={{ locale: 'zh', translations: {'generic.add': 'Test-Add'} }}
                mention={{
                    separator: ' ',
                    trigger: '@',
                    caseSensitive: true,
                    suggestions: [
                        { text: 'A', value: 'AB', url: 'href-a' },
                        { text: 'AB', value: 'ABC', url: 'href-ab' },
                        { text: 'ABC', value: 'ABCD', url: 'href-abc' },
                        { text: 'ABCD', value: 'ABCDDDD', url: 'href-abcd' },
                        { text: 'ABCDE', value: 'ABCDE', url: 'href-abcde' },
                        { text: 'ABCDEF', value: 'ABCDEF', url: 'href-abcdef' },
                        { text: 'ABCDEFG', value: 'ABCDEFG', url: 'href-abcdefg' },
                    ],
                }}
            />)}
            </Form.Item>
        </Modal>
      );
    }
  }
)

const initAdminModel = {title:'',article_label:'', description: '', article_type: '', content: ''}
const rawContentState = {"entityMap":{"0":{"type":"IMAGE","mutability":"MUTABLE","data":{"src":"http://i.imgur.com/aMtBIep.png","height":"auto","width":"100%"}}},"blocks":[{"key":"9unl6","text":"","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"95kn","text":" ","type":"atomic","depth":0,"inlineStyleRanges":[],"entityRanges":[{"offset":0,"length":1,"key":0}],"data":{}},{"key":"7rjes","text":"","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}]}

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
      width: 80,
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
    editorState: '',
    editorContent: undefined,
    contentState: rawContentState
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
    const contentBlock = htmlToDraft(record.content)
    if(contentBlock){
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
      const editorState = EditorState.createWithContent(contentState);
      this.setState({ editorState: editorState })
    }
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
    const content = draftToHtml(this.state.editorContent)
    form.validateFields((err, values) => {
      console.log(values);
      if (err) {
        return;
      }
      if(this.state.editingType === 'add') {
      }
      if(this.state.editingType === 'edit'){
        let data = {...values}
        data.content = content
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
    // console.log(changedFields);
    // const changedField = (Object.keys(changedFields)).pop();
    // const changedValue = ((Object.values(changedFields)).pop()).value;
    // changedFields[changedField] = changedValue
    // const editingData = Object.assign({},this.state.editingData, changedFields)
    // this.setState({editingData: editingData});
  }

  handleEditorStateChange = (editorState) => {
    console.log(this.state.editingData)
    this.setState({editorState: editorState});
  }

  handleContentStateChange = (editorContent) => {
    console.log(this.state.editingData)
    this.setState({editorContent: editorContent});
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
        editorState={this.state.editorState}
        onEditorStateChange={this.handleEditorStateChange}
        onContentStateChange={this.handleContentStateChange}
        />
      </div>
    );
  }
}

export default AsynchronousArticleList;