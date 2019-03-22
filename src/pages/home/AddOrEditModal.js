// 第三方组件
import React , { Component } from 'react';
import { Button , Form , Input , Select , Drawer } from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;
const {TextArea} = Input;

@Form.create()
class AddOrEditModal extends Component {
    // 保存
    onSave = () => {
        this.props.form.validateFieldsAndScroll((err , values) => {
            if (!err) {
                values._id = this.props.rowData && this.props.rowData._id;
                this.props.onSave(values);
            }
        });
    };
    
    render() {
        const {rowData} = this.props;
        const {getFieldDecorator} = this.props.form;
        
        // 模态框结构
        const formItemLayout = {
            labelCol: {
                xs: {span: 7} ,
                sm: {span: 7}
            } ,
            wrapperCol: {
                xs: {span: 15} ,
                sm: {span: 15}
            }
        };
        
        const i18nKey = rowData ? rowData.i18nKey : null;
        const zhCN = rowData ? rowData.zhCN : null;
        const enUS = rowData ? rowData.enUS : null;
        
        return (
            <Drawer
                title={rowData ? '编辑' : '新增'}
                width="40%"
                placement="right"
                visible={this.props.visible}
                onClose={this.props.onClose}
                destroyOnClose={true}
            >
                <Form>
                    <FormItem {...formItemLayout} label={'i18nKey' + '：'}>
                        {getFieldDecorator('i18nKey' , {
                            rules: [
                                {
                                    required: true ,
                                    message: 'i18nKey不能为空'
                                }
                            ] ,
                            initialValue: i18nKey
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label={'中文' + '：'}>
                        {getFieldDecorator('zhCN' , {
                            initialValue: zhCN
                        })(<Input />)}
                    </FormItem>
                    <FormItem {...formItemLayout} label={'英文' + '：'}>
                        {getFieldDecorator('enUS' , {
                            initialValue: enUS
                        })(<Input />)}
                    </FormItem>
                </Form>
                <div
                    style={{
                        position: 'absolute' ,
                        left: 0 ,
                        bottom: 0 ,
                        width: '100%' ,
                        borderTop: '1px solid #e9e9e9' ,
                        padding: '10px 16px' ,
                        background: '#fff' ,
                        textAlign: 'right'
                    }}
                >
                    <Button type="primary" onClick={this.onSave}>
                        确定
                    </Button>
                </div>
            </Drawer>
        );
    }
}

export default AddOrEditModal;
