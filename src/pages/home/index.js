import React , { Component } from 'react';
import { Input , Button , Table , Divider , Row , Col , Popconfirm , Upload , message } from 'antd';
import axios from 'axios';

const Search = Input.Search;

import './index.css';
import AddOrEditModal from './AddOrEditModal';

class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataList: [] ,
            loading: false ,
            visible: false ,
            rowData: null
        };
        this.colums = [ {
            title: '应用名称' ,
            dataIndex: 'appName' ,
            key: 'appName' ,
            // width: 100
        } , {
            title: 'i18nKey' ,
            dataIndex: 'i18nKey' ,
            key: 'i18nKey' ,
            // width: 100
        } , {
            title: '中文' ,
            dataIndex: 'zhCN' ,
            key: 'zhCN' ,
            // width: 100,
            render: (text , record) => {
                return text;
            }
        } , {
            title: '英文' ,
            dataIndex: 'enUS' ,
            key: 'enUS' ,
            render: (text , record) => {
                return text;
            }
        } , {
            title: '操作' ,
            dataIndex: 'action' ,
            key: 'action' ,
            width: 120 ,
            render: (text , record) => {
                return (
                    <span>
                      <a href="javascript:void(0);" onClick={() => this.onEdit(record)}>修改</a>
                      <Divider type="vertical" />
                         <Popconfirm title="确定要删除该记录嘛？" onConfirm={() => this.onDelete(record._id)}>
                             <a href="javascript:void(0);">删除</a>
                         </Popconfirm>
                    </span>
                );
            }
        } ];
    }
    
    
    componentDidMount() {
        this.getList();
    }
    
    // 查询
    onSearch = (value) => {
        this.getList(value);
    };
    
    // 新增
    onAdd = () => {
        this.setState({visible: true});
    };
    
    // 获取列表
    getList = (i18nKey = '') => {
        this.setState({loading: true});
        axios({
            method: 'GET' ,
            url: '/intl/list' ,
            params: {
                i18nKey
            }
        }).then(res => {
            this.setState({loading: false});
            const dataList = res.data.data;
            this.setState({dataList});
        });
    };
    
    // 关闭模态框
    onClose = () => {
        this.setState({visible: false , rowData: null});
    };
    
    // 保存
    onSave = (data) => {
        const method = data._id ? 'PUT' : 'POST';
        const url = data._id ? '/intl/updata' : '/intl/add';
        axios({
            method ,
            url ,
            data: {
                appId: 'ccp' ,
                appName: 'eCooperate™' ,
                ...data
            }
        }).then(res => {
            if (res.data.success) {
                this.getList();
                this.onClose();
            } else {
                message.error(res.data.errorMessage);
            }
        });
    };
    
    // 删除
    onDelete = (id) => {
        axios({
            method: 'DELETE' ,
            url: `/intl/delete/` ,
            params: {
                _id: id
            }
        }).then(() => {
            this.getList();
            this.onClose();
        });
    };
    
    // 编辑
    onEdit = (rowData) => {
        this.setState({rowData: rowData , visible: true});
    };
    
    // 导出
    onExport = () => {
        window.open(`/intl/export`);
    };
    
    render() {
        const {dataList , loading , visible , rowData} = this.state;
        console.log('dataList' , dataList);
        let that = this;
        const props = {
            name: 'file' ,
            action: '/intl/import' ,
            showUploadList: false ,
            onChange(info) {
                if (info.file.status === 'done') {
                    message.success('上传成功');
                    that.getList();
                } else if (info.file.status === 'error') {
                    message.success('上传失败');
                }
            } ,
        };
        
        return (
            <React.Fragment>
                <div style={{
                    width: '80%' ,
                    margin: '0 auto' ,
                    background: '#fff' ,
                    padding: 10 ,
                    // border: '1px solid #ebedf0',
                    // boxShadow:'rgb(241, 241, 241) 1px 2px 3px 4px'
                }}>
                    <Row style={{marginBottom: 10}} gutter={16}>
                        <Col span={10}>
                            <Search
                                placeholder="请输入关键词"
                                enterButton="查询"
                                onSearch={this.onSearch}
                            /></Col>
                        <Col span={8} offset={6} style={{textAlign: 'right'}}>
                            <Button type="primary" icon="plus" style={{marginRight: 10}}
                                    onClick={this.onAdd}>新增</Button>
                            <Upload {...props}>
                                <Button icon="upload" style={{marginRight: 10}}>导入</Button>
                            </Upload>
                            <Button icon="download" onClick={this.onExport}>导出</Button>
                        </Col>
                    </Row>
                    <Table loading={loading} size="middle" rowKey="_id" columns={this.colums} dataSource={dataList} />
                    <AddOrEditModal rowData={rowData} visible={visible} onClose={this.onClose} onSave={this.onSave} />
                </div>
                <div style={{
                    textAlign: 'center' ,
                    paddingTop: 10 ,
                    paddingBottom: 10
                }}>
                    TaiMei &copy; 2019
                </div>
            </React.Fragment>
        );
    }
}

export default Index;