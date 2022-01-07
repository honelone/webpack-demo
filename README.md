#### 01. 最基本配置

##### 第一步：初始化

```js
npm init -y
```

---



##### 第二步：安装 `npm` 包

```shell
npm i -D webpack webpack-cli
```

> 注：
>
> - `npm i -D`为 `npm install --save-dev`的缩写，会将依赖添加到`devDependencies`中，即开发依赖
> - `npm i -S`为`npm install --save`的缩写，会将依赖添加到`dependencies`中，即

- 执行之后，会在当前目录下生成一个 `node_modules`目录，这个目录就是我们的项目的依赖包

---



##### 第三步：配置 `script`

- 在 `package.json`文件的`script`中新增一条代码
  ```json
  "script": {
      "build": "webpack src/main.js"
  }
  ```
  > 这句话的意思就是：通过 `webpack` 启动 `src` 文件夹下的 `main.js`这个文件
  >
  > ```js
  > // main.js
  > console.log('hello webpack')
  > ```
  >
  > - 实际上，这里也可以直接写`webpack`，并且默认的打包文件是`index.js`
- 然后在终端中执行命令
  ```shell
  npm run build
  ```

---



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

    - `path`是`node`内置的一个路径工具
    - 其中`__dirname`表示的是当前配置文件所在的路径，`resolve`是`path`的一个拼接路径的方法

    

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
  
  > 在运行后，我们可以看到在当前目录下生成了一个`dist`文件夹，并生成了一个`output.js`文件
  
- 然后，我们需要在`html`文件中引入这个`js`文件，才能获取到它的执行结果

  - 但我们不能每次都去`dist`文件夹下去引用这个文件
  - 并且这个文件名并不是固定不变的

- 在开发中，我们通常这样配置输出文件名

  - 会在原文件名的基础上，再加上8位的`hash`值，这样，每次打包生成的文件名就会不一样

  ```js
  module.exports = {
      output: {
          filename: '[name].[hash:8].js',
          path: path.resolve(__dirname,'../dist')
      },
  }
  
  ```

- 因此，我们需要一个插件来帮助我们引入打包后的`js`文件

---



##### 第五步：配置插件`plugin`

- 我们先正常创建一个`html`文件，放在`public`文件夹下

- 然后，我们需要安装一个插件

  ```shell
  npm i -D html-webpack-plugin
  ```

- 在`webpack.config.js`中，我们需要在`plugins`选项中引入上面的插件

  ```js
  const HtmlWebpackPlugin = require('html-webpack-plugin')
  
  module.exports = {
      plugins: [
          new HtmlWebpackPlugin({
              template: path.resolve(__dirname, './public/index.html')
          })
      ]
  }
  
  ```

  > `template`：表示要解析的`html`文件的路径，或者按意思来理解，就是以哪个文件作为打包的**模板文件**

- 以上，在打包时，就会自动引入打包后的`js`文件

  ```html
  <script defer src="output.js"></script>
  ```

---



##### 第六步：配置加载器`loader`

- `webpack`默认只支持处理`JS`与`JSON`文件，其它类型的文件都无法处理，需要借助加载器`loader`来进行处理
  - 如果我们想引入`css`文件，我们需要借助一些`loader`来进行处理

- 我们先创建一个样式文件`assets/index.css`

  ```css
  body {
      background-color: #f0f2f5;
  }
  ```

- 这里我们要

  - 安装一个`css-loader`，用于处理`css`文件
  - 安装一个`style-loader`，用于将`css-loader`处理好的`css`文件以`style`标签的形式添加到页面上

  > 如果只有`css-loader`是无法将`css`文件添加到页面上的

  ```shell
  npn i -D css-loader style-loader
  ```

- 然后我们需要在`modules`选项中去配置`loader`

  ```js
  module.exports = {
      module: {
          rules: [
              {
                  test: /\.css$/, // 这里表示匹配所有 .css 文件
                  use: ['style-loader', 'css-loader'], // 这里表示先使用 css-loader 解析 css 文件，然后将处理结果交给 style-loader 解析
              },
          ]
      }
  }
  ```

  > `rules`：表示当前的规则
  >
  > `test`：表示当前需要匹配的文件，用正则来进行匹配
  >
  > `use`：表示对当前匹配的文件使用哪些`loader`来进行解析
  >
  > - `use`可以是一个字符串，也可以是一个数组
  > - 如果是一个数组，则其加载器`loader`会从右向左进行解析

- 最后，我们要在`js`文件中引入我们的`css`文件

  ```js
  import '../assets/index.css'
  ```

  - 这样，样式文件就会以`<style>`标签的形式被添加到`html`文件中
    - 不过，它是在运行`html`文件时，从`js`文件中添加到`html`文件的
    - 并不是添加到打包后的`html`文件中

---



#### 02. `Webpack`入门

##### 第一点：五个核心概念

- 前面，我们简单介绍了`webapck`最基本的配置，它主要包括了五个核心的概念
  - **mode配置项**
    - 用于设置当前的构建模式，开发模式或者生产模式
  - **entry配置项**
    - 用于设置打包的入口文件
  - **output配置项**
    - 用于设置打包的输出文件
  - **plugins配置项**
    - 用于拓展`webpack`的功能，执行更多的任务，如优化、压缩等
  - **loader配置项**
    - 用于帮助`webpack`处理非`JS | JSON`文件

- 所以，一般来说，`webpack.config.js`配置文件的结构是这样的

  ```js
  
  const path = require('path') // 用于处理路径，__dirname 表示当前配置文件目录的绝对路径
  
  module.exports = {
      mode: '', // 指定构建模式 —— development:开发模式；production:上线模式
      entry: '', // 指定打包入口文件的路径
      output: {
          // 指定打包后的输出文件
          path: '', // 输出文件的存放路径
          filename: '', // 输出文件的名称
      },
      module: {
          // 处理非js文件 —— loader
          rules: [
              // 每种文件的 loader 配置
              {
                  test: /\$/, // 匹配的文件
                  use: [], // 要调用的loader
              },
          ],
      },
      plugins: [
          // 拓展 webpack 的功能
      ],
  }
  
  ```

- 脚本配置是这样的

  ```json
  {
      "scripts": {
          "dev": "webpack"
      }
  }
  ```

##### 第二点：配置自动服务

- 前面，当我们每改动一次代码，我们都要去重新打包一次，才能获取到最新的结果

- 所以，为了解决这个问题，我们需要引入一个插件来让我们的项目能热更新

- 我们先安装一个插件

  ```shell
  npm i -D webpack-dev-server
  ```

- 然后我们引入这个插件，并在`devServer`选项中进行插件的相关配置

  ```js
  const Webpack = require('webpack')
  
  module.exports = {
      devServer: {
          port: 9527,
          hot: true,
          contentBase: '../dist/static',
      },
      plugins: [
          new Webpack.HotModuleReplacementPlugin()
      ]
  }
  ```

- 现在，我们来简单聊聊这个`devServer`选项

  - `port`：端口

  - `open`：是否自动打开

  - `hot`：是否热更新

  - `compress`：是否启动`gzip`压缩

  - `contentBase`：配置静态文件的目录**（version < 4）**

  - `static`：配置静态文件的目录**（version >= 4）**

    > 这个静态文件目录的作用是：
    >
    > - 在`webpack`打包时，会将项目中的静态文件都直接复制到`dist`目录下
    > - 这个过程对本地开发来说是没有必要的
    > - 所以我们设置一个目录，让打包后的文件直接到我们设置的目录下去读取静态文件
    > - 可以节省时间和性能

- 到这里，基本配置可以了，但我们还需要再配置一下启动脚本

  ```json
  {
      "scripts": {
          "dev": "webpack",
          "server": "webpack-dev-server"
      }
  }
  
  ```

  > 其实，我们也可以在`scripts`中去配置参数：
  >
  > ```json
  > {
  >     "scripts": {
  >         "dev": "webpack --mode development",
  >         "server": "webpack-dev-server --open --host 127.0.0.1 --port 9527"
  >     }
  > }
  > 
  > ```
  >
  > - 这里
  >   - `--mode`：设置构建模式
  >   - `--open`：表示自动打开
  >   - `--host`：配置IP地址
  >   - `--port`：配置端口号

- 最后，这里要注意一下
  - `webpack-dev-derver`打包后的文件是存储在内存中的（所以它才这么快）

---



##### 第三点：区分不同环境

> - 事实上，我们在正式项目中是会有多个环境的，如开发环境、测试环境、正式环境等
> - 在不同环境中，对于项目的打包要求也是不一样的
> - 所以我们要针对不同环境进行不同的`webpack`打包处理

- 这里，我们先明确一个概念，关于`mode`模式

- `mode`有两种模式

  - `development`：开发模式，会自动将`process.env.NODE_ENV`设置为`development`
  - `production`：生产模式，会自动将`process.env.NODE_ENV`设置为`production`

- 这个`process.env.NODE_ENV`就是我们的环境变量

- 我们现在要做的就是修改这个环境变量，然后根据不同的环境变量来进行不同的打包处理

  ---

- 这里，我们需要安装一个插件，这个插件不作用于`webpack.config.js`，而是作用于`package.json`文件

  ```shell
  npm i -D cross-env
  ```

- 然后进行配置

  ```json
  "scripts": {
      "dev": "cross-env NODE_ENV=dev webpack serve --mode development", 
      "test": "cross-env NODE_ENV=test webpack --mode production",
      "build": "cross-env NODE_ENV=prod webpack --mode production"
  }
  ```

  - 在执行脚本的时候，就会去设置环境变量`NODE_ENV`，从而执行不同的打包操作
  
  ```js
  // webpack.config.js
  
  console.log(process.env.NODE_ENV)
  ```

##### 第四点：配置源码映射

> - 在我们启动的项目中，引用的文件是打包后的文件
> - 事实上，如果我们的文件有错误，`webpack`也是会正常运行并打包的
> - 这时候，我们得到的实际上是打包文件的错误，而不是我们的源文件的错误
> - 所以，我们需要建立一个打包文件和源码文件的映射关系

- 这种映射关系叫做：`SourceMap`，即源码映射

  - 当项目运行后发生错误，可以利用`SourceMap`将错误反向定位到源码里

- 配置这种映射关系，我们需要用到`devtool`选项

  ```js
  module.exports = {
      devtool: 'source-map',
  }
  ```

  - 配置之后，执行打包命令，会在`dist`目录下生成一个`.map`文件，这个文件就是我们的映射文件

- 下面，我们来简单看看这个`devtool`选项的几个关键字

  - **inline**：代码内通过`dataUrl`形式引入`SourceMap`
  - **hidden**：会生成`SourceMap`文件，但不会使用
  - **eval**：使用`eval()`的形式去执行代码，通过`dataUrl`的形式去引入`SrouceMap`
  - **nosource**：不生产`SourceMap`
  - **cheap**：定位到行信息，不定位到列信息
  - **module**：显示源代码中的错误位置

- 推荐的配置项

  ```js
  module.exports = {
      mode: 'development',
      devtool: 'eval-cheap-module-source-map',
  }
  
  module.exports = {
      mode: 'production',
      // 线上也可以定位错误位置  
      devtool: 'cheap-module-source-map',
      // 或者不配置
  }
  ```

  
