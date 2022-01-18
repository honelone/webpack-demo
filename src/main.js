// 以 Vue 项目中的 main.js 为例子（因为目前对Vue框架比较熟悉）
// 当前这个 main.js 文件 就相当于 Vue 中的 main.js 文件
// 在这里引入的所有东西，都会被打包到最终的 js 文件中
// 样式也会打包到 js 文件中，只是在后面会通过 js 添加到 <style> 标签中
import '../assets/index.css'

console.log('====== hello webpack ======')

// 再 DefinePlugin 中定义的常量
console.log('============')
console.log('API_BASE_URL：', API_BASE_URL)
console.log('============')
