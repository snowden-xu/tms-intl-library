// node路径模块
const path = require("path");
// 合并配置插件
const merge = require("webpack-merge");
// 通用配置
const common = require("./webpack.common.js");
// 清除dist文件夹
const CleanWebpackPlugin = require("clean-webpack-plugin");
// 打包分析
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = merge(common, {
  // 模式 开发环境 development  正式环境 production
  mode: "production",
  // 插件
  plugins: [
    // 清除dist文件夹
    new CleanWebpackPlugin(),
    // 打包分析插件
    // new BundleAnalyzerPlugin()
  ],
  // 代码分割
  optimization: {
    splitChunks: { chunks: "all" }
  }
});
