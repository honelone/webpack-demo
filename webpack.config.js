const path = require('path')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const Webpack = require('webpack')

module.exports = {
  // mode 用于设置开发模式
  mode: 'development',
  // entry 用于设置打包的入口文件
  entry: path.resolve(__dirname, './src/main.js'),
  // output 用于设置打包后的输出文件
  output: {
    filename: 'output.js', // 输出文件名
    path: path.resolve(__dirname, './dist'), // 输出目录
  },
  // plugins 用于设置插件
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './public/index.html'),
    }),
    new Webpack.HotModuleReplacementPlugin(),
  ],
  // module 用于设置加载器
  module: {
    rules: [
      {
        test: /\.css$/, // 这里表示匹配所有 .css 文件
        use: ['style-loader', 'css-loader'], // 这里表示使用 css-loader 解析 css 文件
      },
    ],
  },
  // 配置自动服务
  devServer: {
    port: 9527,
    hot: true,
    open: true,
  },
}
