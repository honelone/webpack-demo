##### 第一步：初始化

```js
npm init
```

##### 第二步：安装 `npm` 包

```shell
npm i -D webpack webpack-cli
```

> 注：`npm i -D`为 `npm install --save-dev`的缩写
> `npm i -S`为`npm install --save`的缩写

- 执行之后，会在当前目录下生成一个 `node_modules`目录，这个目录就是我们的项目的依赖

##### 第三步：配置 `script`

- 在 `package.json`文件的`script`中新增一条代码
  ```json
  "script": {
      "build": "webpack src/main.js"
  }
  ```
  > 这句话的意思就是：通过 `webpack` 启动 `src` 文件夹下的 `main.js`这个文件
- 然后在终端中执行命令
  ```shell
  npm run build
  ```

##### 第四步：自定义配置文件

- 要实现更多的自定义，我们需要创建一个自定义的配置文件 `webpack.config.js`

  - 在这个文件中，我们将实现更丰富的个性化配置

- **最基本的配置**

  ```js
  const path = require('path')
  
  module.exports = {
    // mode 用于设置开发模式
    mode: 'development',
    // entry 用于设置打包的入口文件
    entry: path.resolve(__dirname, '../src/main.js'),
    // output 用于设置打包后的输出文件
    output: {
      filename: 'output.js', // 输出文件名
      path: path.resolve(__dirname, '../dist'), // 输出目录
    },
  }
  
  ```

  - **mode配置项**
    -  `production`：开发模式，默认值，打包速度快，省去了代码优化步骤
    - `development`：生产模式，打包比较慢，会开启`tree-shaking`和**代码压缩**
    - `none`：不使用任何优化选项

  - **关于path**

    - `path`是`node`内置的路径工具
    - 其中`__dirname`表示的是当前配置文件所在的路径

    

- 现在，我们需要改变一下`build`打包命令

  ```json
  "script": {
      "build": "webpack --config webpack.config.js"
  }
  ```

  > 这句话的意思是：通过`webpack.config.js`这个配置文件来进行打包操作
  >
  > - 注：`webpack.config.js`配置在根路径下则不需要前缀，如果在其它文件夹下，则要加上前缀，如`test/webpack.config.js`
  >
  > 当然，这里实际上也可以直接写`webpack`



---

