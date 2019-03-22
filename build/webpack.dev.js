// node路径模块
const path = require("path");
// 合并配置插件
const merge = require("webpack-merge");
// 通用配置
const common = require("./webpack.common.js");
// webpack
const webpack = require("webpack");

module.exports = merge(common, {
  // 模式  'development' | 'production'
  mode: "development",
  // 原始源代码（仅限行）
  devtool: "cheap-module-eval-source-map",
  // 开发服务器
  devServer: {
    // 入口
    contentBase: path.join(__dirname, "dist"),
    // 端口
    port: 8888,
    // 新开页面
    open: false,
    // 热更新
    hot: true,
    // 在没有页面刷新的情况下启用热模块替换作为构建失败时的后备
    hotOnly: false,
    // idea控制太不显示具体信息
    noInfo: false,
    // 浏览器控制台将显示消息  'none' | 'info' | 'error' | 'warning'
    clientLogLevel: "none",
  },
  // 插件
  plugins: [
    // 热模块更新插件
    new webpack.HotModuleReplacementPlugin()
  ]
});
