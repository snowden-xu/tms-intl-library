import React, { Component } from "react";
import {
  Input,
  Button,
  Table,
  Divider,
  Row,
  Col,
  Popconfirm,
  Upload,
  message,
  Dropdown,
  Menu,
  Icon,
  Select,
} from "antd";
import axios from "axios";

const Search = Input.Search;
const Option = Select.Option;

import "./index.css";
import AddOrEditModal from "./AddOrEditModal";
import { menuCategroy, AppNameEnum } from "utils/enum";

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataList: [],
      loading: false,
      visible: false,
      rowData: null,
      category: undefined,
      keyword: "",
    };
    this.colums = [
      {
        title: "应用名称",
        dataIndex: "appName",
        key: "appName",
        width: 150,
      },
      {
        title: "分类",
        dataIndex: "category",
        key: "category",
        width: 100,
        render: (text) => {
          const category = menuCategroy.find((item) => {
            return item.value === text;
          });
          return (category && category.name) || "";
        },
      },
      {
        title: "i18nKey",
        dataIndex: "i18nKey",
        key: "i18nKey",
        width: 150,
      },
      {
        title: "中文",
        dataIndex: "zhCN",
        key: "zhCN",
        width: 200,
        render: (text) => {
          return text;
        },
      },
      {
        title: "英文",
        dataIndex: "enUS",
        key: "enUS",
        width: 200,
        render: (text) => {
          return text;
        },
      },
      {
        title: "操作",
        dataIndex: "action",
        key: "action",
        width: 120,
        render: (text, record) => {
          return (
            <span>
              <a href="#" onClick={(e) => this.onEdit(e, record)}>
                修改
              </a>
              <Divider type="vertical" />
              <Popconfirm
                title="确定要删除该记录嘛？"
                onConfirm={() => this.onDelete(record._id)}
              >
                <a href="#" onClick={(e) => e.preventDefault()}>
                  删除
                </a>
              </Popconfirm>
            </span>
          );
        },
      },
    ];
  }

  componentDidMount() {
    this.getList();
  }

  componentWillReceiveProps(nextProps) {
    // Any time props.email changes, update state.
    if (nextProps.current !== this.props.current) {
      this.setState({ category: undefined, keyword: "" }, () => {
        this.getList("", "", nextProps.current);
      });
    }
  }

  // 查询
  onSearch = (value) => {
    this.setState({ keyword: value }, () => {
      this.getList(value, this.state.category);
    });
  };

  // 改变分类
  onChangeCategory = (value) => {
    this.setState({ category: value }, () => {
      this.getList(this.state.keyword, value);
    });
  };

  // 新增
  onAdd = () => {
    this.setState({ visible: true });
  };

  // 获取列表
  getList = (
    keyword = this.state.keyword,
    category = this.state.category || "",
    appId = this.props.current || "ccp"
  ) => {
    this.setState({ loading: true });
    axios({
      method: "GET",
      url: "/intl/list",
      params: {
        keyword,
        category,
        appId,
      },
    }).then((res) => {
      this.setState({ loading: false });
      const dataList = res.data.data;
      this.setState({ dataList });
    });
  };

  // 关闭模态框
  onClose = () => {
    this.setState({ visible: false, rowData: null });
  };

  // 保存
  onSave = (data) => {
    const method = data._id ? "PUT" : "POST";
    const url = data._id ? "/intl/updata" : "/intl/add";
    const { current } = this.props;

    axios({
      method,
      url,
      data: {
        appId: current,
        appName: AppNameEnum[current],
        ...data,
      },
    }).then((res) => {
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
      method: "DELETE",
      url: `/intl/delete/`,
      params: {
        _id: id,
      },
    }).then(() => {
      this.getList();
      this.onClose();
    });
  };

  // 编辑
  onEdit = (e, rowData) => {
    e.preventDefault();
    this.setState({ rowData: rowData, visible: true });
  };

  // 导出excel
  onExport = () => {
    window.open(`/intl/export?category=${this.state.category || ""}`);
  };

  // 导出中文语言包
  onExportProCN = () => {
    window.open(`/int/exportProCN?category=${this.state.category || ""}`);
  };

  // 导出英文语言包
  onExportProEN = () => {
    window.open(`/int/exportProEN?category=${this.state.category || ""}`);
  };

  render() {
    const { dataList, loading, visible, rowData, category } = this.state;
    const { current } = this.props;

    let that = this;
    const props = {
      name: "file",
      action: "/intl/import",
      showUploadList: false,
      onChange(info) {
        if (info.file.status === "done") {
          if (info.file.response.success) {
            message.success("上传成功");
            that.getList();
          } else {
            message.success(info.file.response.errorMessage);
          }
        } else if (info.file.status === "error") {
          message.success("上传失败");
        }
      },
    };

    const menu = (
      <Menu>
        <Menu.Item key="1" onClick={this.onExport}>
          Excel
        </Menu.Item>
        <Menu.Item key="2" onClick={this.onExportProCN}>
          中文语言包
        </Menu.Item>
        <Menu.Item key="3" onClick={this.onExportProEN}>
          英文语言包
        </Menu.Item>
      </Menu>
    );

    return (
      <React.Fragment>
        <div style={{ height: 10 }} />
        <div
          style={{
            width: "100%",
            margin: "0 auto",
            background: "#fff",
            padding: 10,
            paddingBottom: 0,
          }}
        >
          <Row style={{ marginBottom: 10 }} gutter={16}>
            <Col span={3}>
              <Select
                style={{ width: "100%" }}
                placeholder="分类"
                allowClear
                value={category}
                onChange={this.onChangeCategory}
              >
                {menuCategroy.map((item) => (
                  <Option value={item.value} title={item.name} key={item.value}>
                    {item.name}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col span={10}>
              <Search
                placeholder="请输入关键词"
                enterButton="查询"
                onSearch={this.onSearch}
              />
            </Col>
            <Col span={8} offset={3} style={{ textAlign: "right" }}>
              <Button
                type="primary"
                icon="plus"
                style={{ marginRight: 10 }}
                onClick={this.onAdd}
              >
                新增
              </Button>
              <Upload {...props}>
                <Button icon="upload" style={{ marginRight: 10 }}>
                  导入
                </Button>
              </Upload>
              <Dropdown overlay={menu}>
                <Button icon="download">
                  导出
                  <Icon type="down" />
                </Button>
              </Dropdown>
            </Col>
          </Row>
          <Table
            loading={loading}
            size="middle"
            rowKey="_id"
            columns={this.colums}
            dataSource={dataList}
            scroll={{ y: "calc(100vh - 400px)" }}
            pagination={{ size: "small", defaultPageSize: 100 }}
          />
          <AddOrEditModal
            rowData={rowData}
            visible={visible}
            appId={current}
            onClose={this.onClose}
            onSave={this.onSave}
          />
        </div>
      </React.Fragment>
    );
  }
}

export default Index;
