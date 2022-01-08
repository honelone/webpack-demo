### 01. 最基本配置

#### 第一步：初始化

```js
npm init -y
```

---



#### 第二步：安装 `npm` 包

```shell
npm i -D webpack webpack-cli
```

> 注：
>
> - `npm i -D`为 `npm install --save-dev`的缩写，会将依赖添加到`devDependencies`中，即开发依赖
> - `npm i -S`为`npm install --save`的缩写，会将依赖添加到`dependencies`中，即

- 执行之后，会在当前目录下生成一个 `node_modules`目录，这个目录就是我们的项目的依赖包

---



#### 第三步：配置 `script`

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



#### 第四步：自定义配置文件

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



#### 第五步：配置插件`plugin`

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



#### 第六步：配置加载器`loader`

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



### 02. `Webpack`基本概念

#### 第一点：五个核心概念

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

- 打包命令配置是这样的

  ```json
  {
      "scripts": {
          "dev": "webpack"
      }
  }
  ```

#### 第二点：环境变量

- 







---







---



第三点：区分不同环境

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



### 03. 常用插件和加载器

#### 第一个：打包HTML文件

- `html-webpack-plugin`

  - 作用：用于自动引入打包后的`.js`文件

  - 使用：

    ```js
    const HtmlWebpackPlugin = require('html-webpack-plugin')
    module.exports = {
        plugins: [
            new HtmlWebpackPlugin({
                template: path.resolve(__dirname,'../public/index.html')
            }),
        ]
    }
    
    ```

- `clean-webpack-plugin`

  - 作用：在进行下次打包之前清空上次打包的残留文件

  - 使用：

    ```js
    const {CleanWebpackPlugin} = require('clean-webpack-plugin')
    module.exports = {
        plugins: [
            new CleanWebpackPlugin(),
        ]
    }
    
    ```

#### 第二个：打包CSS文件

- `style-loader`

  - 作用：将`css-loader`处理后的文件处理到`js`文件中，启动项目后将会以`style`标签的形式添加到页面上

- `css-loader`

  - 作用：处理`css`文件，并将结果传给`style-loader`进一步处理

- `postcss-loader`

  - 作用：对`css`文件进行处理，自动添加浏览器前缀，结果会传给`css-loader`进行处理

    - 还需要`autoprefixer`来进行辅助，否则不生效

  - 使用：

    - 创建一个`postcss.config.js`文件，配置

      ```js
      module.exports = {
          plugins: [require('autoprefixer')]
      }
      ```

    - 或者直接在`webpack.config.js`中配置

      ```js
      module.exports = {
          module: {
              rules: [{
                  test: /\.css$/,
                  use: [
                      'style-loader',
                      'css-loader', 
                      {
                          loader: 'postcss-loader',
                          options: {
                              plugins: [require('autoprefixer')]
                          }
                      }
                  ]
      
              }]
          }
      }
      ```

- `less-loader`

  - 作用：将`less`文件处理成`css`文件

- `sass-loader`

  - 作用：将`scss`文件处理成`css`文件

    - 还需要安装`node-sass`来辅助

  - 使用：

    ```js
    module.exports = {
        module: {
            rules:[{
                // test: /\.less$/, // 匹配 less 文锦啊
                test: /\.(s[ac]|c)ss$/i, //匹配所有的 sass/scss/css 文件
                use: [
                    'style-laoder',
                    'css-laoder',
                    'postcss-laoder',
                    // 'less-loader',
                    'sass-loader'
                ]
            }]
        }
    }
    ```

- `mini-css-extract-plugin`

  - 作用：

    - 分离样式：可以将样式从`js`文件中提取到单独的`css`文件

      > 用了这个插件就不需要`style-loader`了

  - 使用：

    ```js
    const MiniCssExtractPlugin = require('mini-css-extract-plugin')
    moudle.exports = {
        module: {
            rules: [{
                test: /\.css$/,
                use: [
                    // 'style-loader', // 用插件的 loader 代替
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    
                ]
            }]
        },
        plugins: [
            new MiniCssExtractPlugin({
               filename: '[name].[hash:8].css', // 提取后的 css 文件名
            }),
        ]
    }
    
    ```

#### 第三个：打包静态资源

#### 第四个：打包JS文件

#### 第五个：打包Vue文件







---



### 04. `webpack`优化

> 接下来，我们来看一下`webpack`的优化



#### 第一条：配置自动服务

> 目前，我们的每一次更改操作，都需要去重新打包，才能获取到最新结果。这样作时很麻烦的
>
> 所以，我们需要`webpack`能够自动的来帮我们处理这些操作，即自动化

##### （1）`wacth`参数

- `webpack`自带了一个参数——`watch`，可以在文件更新后自动重新打包编译

  ```js
  // 可以在 script 脚本中配置
  "scripts": {
      "dev": "webpack --watch"
  }
  
  ----------------------------------
  
  // 也可以在配置文件中去配置
  moule.exports = {
      watch: true,
  }
  ```

  > 这种方式只能实现简单的自编译，我们更多的还是使用第二种方式

##### （2）`webpack-dev-server`

- 这是一个插件，可以帮助`webpack`处理更多的自动任务，如：自编译、自刷新等等

- 我们先安装这个插件

  ```shell
  npm i -D webpack-dev-server
  ```

- 然后配置打包命令

  ```json
  {
      "scripts": {
          "server1": "webpack-dev-server",
          "server2": "webpack -server"
      }
  }
  ```

  > 上面两种命令都可以

- `webpack-dev-server`有默认配置，但如果我们想自定义，就需要在`devServer`选项中进行配置

  ```js
  const Webpack = require('webpack')
  
  module.exports = {
      devServer: {
          port: 9527, // 端口号，默认为 8080
          open: true, // 是否自动打开浏览器
          hot: true, // 是否启用 热更新
          compress: true, // 是否开启 gzip压缩
          contentBase: path.resolve(__dirname, 'public'),
      },
      plugins: [
          new Webpack.HotModuleReplacementPlugin() // 这个是为上面的 热更新 服务的
      ]
  }
  ```

- 接下来，详细简单说说这个`devServer`选项的两个配置项

  - 对静态资源的配置项

    - **contentBase**：配置静态文件的目录**（version < 4）**
    - **static**：配置静态文件的目录**（version >= 4）**，默认为`public`文件夹

    > 这个配置项的作用是：
    >
    > - 在`webpack`打包时，会将项目中的静态文件都**直接复制**到`dist`目录下，而这个过程对本地开发来说是没有必要的
    > - 所以，我们设置一个目录，让打包后的文件直接**到我们设置的目录下去读取静态文件**，以减少不必要的处理

    ```js
    module.exports = {
        devServer: {
            contentBase: path.resolve(__dirname, 'public'),
            static: path.resolve(__dirname, 'public')
        },
    }
    ```

  - 配置代理服务器

    > 对于前后端的跨域请求的处理，一种方式是在服务端配置接口支持`CORS`，另一种方式就是配置代理服务器
    >
    > 在`webpack-dev-server`中可以通过`proxy`选项来支持实现代理服务器

    - `proxy`：配置代理

    ```js
    module.exports = {
        devServer: {
            proxy: {
                // 这里表示 以`/api`开头的接口，都会被代理到指定的地址
                '/api': {
                    // 例如，我们请求 http://localhost:8080/api/users
                    // -- 就会被代理到 https://api.github.com/api/users
                    target: 'https://api.github.com',
                    // 如果我们真正的请求地址是 https://api.github.com/users
                    // -- 那么我们需要通过 pathRewrite 这个配置项对路径进行重写
                    // -- 这里标识将 '/api' 替换为 '' 空字符串
                    pathRewrite: { '^/api': '' },
                    // 默认情况下，在代理时会保留主机头的来源
                    // -- 这里可以将 changeOrigin 设置为 true 以覆盖此行为
                    changeOrigin: true,
                },
            }
        }
    }
    ```

- 最后，这里要注意一下

  - `webpack-dev-derver`打包后的文件是存储在内存中的（所以它才这么快），它并不会在当前目录下生成一个`dist`文件夹

---



#### 第二条：配置源码映射

> 我们运行打包后的项目，引用的文件也是打包后的文件，如果我们的代码有错误，`webpack`也是会正常运行并打包的
>
> 并且，控制台报的错，找到的也是打包后的文件的错误，并不是我们想要的源文件的错误
>
> 这时候，我们就需要建立一个打包文件和源码文件的映射关系

##### （1）`SourceMap`

- 上面说的映射关系叫做：`SourceMap`，即源码映射

  - 配置`SourceMap`打包后的项目，在项目发生错误时，可以将错误映射到源码里，从而让我们快速定位到错误代码的位置

- 我们可以通过`devtool`配置项来开启`SourceMap`

  ```js
  module.exports = {
      devtool: 'source-map',
  }
  ```

  > 配置之后，执行打包命令，会在`dist`目录下生成一个`.map`文件，这个文件就是我们的映射文件

- 这里的可选项很多，这里就不一一介绍了，主要来看看这几个关键字

  - **inline**：在代码内通过`dataUrl`的形式引入`SourceMap`
  - **eval**：使用`eval()`的形式去执行代码，通过`dataUrl`的形式去引入`SrouceMap`
  - **cheap**：定位到行信息，不定位到列信息
  - **module**：显示源代码中的错误位置
  - **hidden**：会生成`SourceMap`文件，但不会使用
  - **nosources**：不会生成`SourceMap`

- 推荐的配置项

  - 开发环境：`eval-cheap-module-source-map`
  - 生产环境：`none`
    - 或者`nosources-source-map`，可以定位报错信息，但不会暴露源代码







第一条：优化构建速度

第二条：优化运行体验

第三条：优化打包结果
