import React, { Component } from "react";
import { hot } from "react-hot-loader/root";
import Home from "./pages/home";
import { Layout, Menu, Breadcrumb } from "antd";
const { Header, Content, Footer } = Layout;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: "ccp",
    };
  }

  handleClick = (e) => {
    this.setState({ current: e.key });
  };

  render() {
    const { current } = this.state;
    return (
      <Layout className="layout">
        <Header>
          <div className="logo" />
          <Menu
            theme="dark"
            mode="horizontal"
            selectedKeys={[current]}
            style={{ lineHeight: "64px" }}
            onClick={this.handleClick}
          >
            <Menu.Item key="ccp">CCP(eCooperate)</Menu.Item>
            <Menu.Item key="etime">eTime(工时)</Menu.Item>
            <Menu.Item key="qm">eQuality(稽查)</Menu.Item>
          </Menu>
        </Header>
        <Content style={{ padding: "0 50px" }}>
          <Breadcrumb style={{ margin: "16px 0" }}>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>List</Breadcrumb.Item>
            <Breadcrumb.Item>{current}</Breadcrumb.Item>
          </Breadcrumb>
          <div style={{ background: "#fff", padding: 10, minHeight: 280 }}>
            <Home current={current} />
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>TaiMei © 2020</Footer>
      </Layout>
    );
  }
}

export default hot(App);
