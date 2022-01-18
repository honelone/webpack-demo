const path = require('path')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const Webpack = require('webpack')
const { DefinePlugin } = require('webpack')

console.log('-----', process.env)
console.log('当前环境', process.env.NODE_ENV)

/**
 * 在原来的基础上，module.exports 可以导出为一个函数
 * @param {*} env 表示当前模式，可以在命令行中通过 --env 来设置这个参数
 * @param {*} argv 命令行中的其他参数
 */
module.exports = (env, argv) => {
  console.log('>>>>>>', env)
  // 正常的，我们可以按开发环境配置 config
  const config = {
    mode: 'development',
    entry: path.resolve(__dirname, 'src', 'main.js'),
    output: {
      filename: '[name].[hash:8].js',
      path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, './public/index.html'),
      }),
      // 定义常量
      new DefinePlugin({
        API_BASE_URL: JSON.stringify('https://yourapi.com'),
      }),
    ],
    module: {
      rules: [
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
      ],
    },
    devServer: {
      port: 9527,
      hot: true,
      open: true,
    },
  }
  // 我们可以通过 env 来判断当前模式，从而对不同环境进行不同的打包配置
  // -- 如果为生产环境，则改变其中的一些配置
  if (env == 'production') {
    config.mode = 'production'
    config.devtool = false
    config.plugin = []
  }

  // 最后返回配置
  return config
}

/**
 * 现在抛开下面所有
 * module.exports = {
 * // mode 用于设置开发模式
 * mode: 'development',
 * // entry 用于设置打包的入口文件，默认会去找 index.js 文件
 * entry: path.resolve(__dirname, 'src', 'main.js'),
 * // output 用于设置打包后的输出文件
 * output: {
 *   // filename: 'output.js', // 输出文件名
 *   // 事实上，输出文件名，我们一般用原来的文件名，再加上 hash值
 *   // -- 而在 html 中也会自动引入这个文件
 *   filename: '[name].[hash:8].js',
 *   path: path.resolve(__dirname, 'dist'), // 输出目录
 * },
 * // plugins 用于设置插件 -- 主要用来扩展 webpack 的功能
 * plugins: [
 *   // 自动在 HTML 中引入 JS
 *   new HtmlWebpackPlugin({
 *     template: path.resolve(__dirname, './public/index.html'),
 *   }),
 * ],
 * // module 用于设置加载器 -- 主要用来处理那些 webpack 不能识别的文件
 * module: {
 *   rules: [
 *     {
 *       test: /\.css$/, // 用正则匹配所有 .css 文件
 *       use: ['style-loader', 'css-loader'], // 从后往前依次使用 Loader 去处理匹配的文件
 *     },
 *   ],
 * },
 * // 配置自动服务
 * devServer: {
 *   port: 9527, // 端口号
 *   hot: true, // 热更新，需要配合 webpack 的热更新插件使用
 *   open: true, // 自动打开浏览器
 * },
 *
 */
