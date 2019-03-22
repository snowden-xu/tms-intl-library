// node路径模块
const path = require("path");
// html模板引用插件
const HtmlWebpackPlugin = require("html-webpack-plugin");

// 导出webpack配置
module.exports = {
  // 入口文件
  entry: "./src/index.js",
  // 出口文件
  output: {
    // 打包后的文件地址
    path: path.resolve(__dirname, "../dist"),
    // 打包后的文件名
    filename: "[name].[hash].js"
  },
  // 配置loader
  module: {
    rules: [
      // 配置js
      {
        test: /\.(js|jsx)$/,
        use: ["babel-loader"],
        exclude: /node_modules/
      },
      // 配置css
      { test: /\.css$/, use: ["style-loader", "css-loader"] },
      // 配置图片
      { test: /\.(png|svg|jpg|gif)$/, use: ["file-loader"] },
      // 配置字体
      { test: /\.(woff|woff2|eot|ttf|otf)$/, use: ["file-loader"] }
    ]
  },
  resolve: {
    alias: {
      "react-dom": "@hot-loader/react-dom"
    }
  },
  // 插件
  plugins: [
    // html模板引用插件
    new HtmlWebpackPlugin({
      // 标题
      title: "webpack-demo",
      // 模板地址
      template: "src/index.html"
    })
  ]
};
