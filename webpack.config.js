const path = require('path')

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
}
