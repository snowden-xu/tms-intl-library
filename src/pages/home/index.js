import React , { Component } from 'react';
import { Input , Button , Table , Divider , Row , Col } from 'antd';

const Search = Input.Search;

import './index.css';

class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataList: []
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
            dataIndex: 'zh_CN' ,
            key: 'zh_CN' ,
            // width: 100,
            render: (text , record) => {
                return record.values.zh_CN;
            }
        } , {
            title: '英文' ,
            dataIndex: 'en_US' ,
            key: 'en_US' ,
            render: (text , record) => {
                return record.values.en_US;
            }
        } , {
            title: '操作' ,
            dataIndex: 'action' ,
            key: 'action' ,
            width: 120 ,
            render: () => {
                return (
                    <span>
                      <a href="javascript:void(0);">修改</a>
                      <Divider type="vertical" />
                      <a href="javascript:void(0);">删除</a>
                    </span>
                );
            }
        } ];
    }
    
    
    componentDidMount() {
        const arr = [];
        for (let i = 0; i < 1000; i++) {
            arr.push({
                key: i ,
                appId: 'ccp' ,
                appName: 'eCooperate™' ,
                i18nKey: 'CCP_F_01002' + i ,
                values: {
                    en_US: 'Project' ,
                    zh_CN: '项目' ,
                }
            });
        }
        this.setState({dataList: arr});
    }
    
    render() {
        const {dataList} = this.state;
        
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
                                onSearch={value => console.log(value)}
                            /></Col>
                        <Col span={8} offset={6} style={{textAlign: 'right'}}>
                            <Button type="primary" icon="plus" style={{marginRight: 10}}>新增</Button>
                            <Button icon="upload" style={{marginRight: 10}}>导入</Button>
                            <Button icon="download">导出</Button>
                        </Col>
                    </Row>
                    <Table size="middle" rowkey="key" columns={this.colums} dataSource={dataList} />
                </div>
                <div style={{
                    textAlign: 'center' ,
                    paddingTop: 10 ,
                    paddingBottom: 10
                }}>TaiMei &copy; 2019 Created by snowden
                </div>
            </React.Fragment>
        );
    }
}

export default Index;