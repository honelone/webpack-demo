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

#### 第一点：webpack

- 定义：webpack是一个【静态的】【模块化】【打包工具】，为现代的JavaScript应用程序
  - 静态的(`static`)：表示最终可以将代码打包成**静态资源**
  - 模块化(`module`)：表示支持各种模块化开发，`ES MOdule`、`CommonJS`、`AMD`等
  - 打包工具(`bundler`)：表示可以进行打包，是一个打包工具

- `webpack`是一个流行的前端项目构建工具（**打包工具**），一个静态模块打包器，可以解决当前web开发中所面临的困境
  - 将所有资源文件都作为模块处理，然后根据模块的依赖关系进行静态分析，打包成对应的**静态资源（bundle）**
- `webpack`提供了友好的模块化支持，以及代码压缩混淆、处理JS兼容问题、性能优化等强大的功能，提高了开发效率和项目的可维护性

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



#### 第三点：加载资源

- `webpack`中
  - 支持`ES Module`规范引入资源
  - 支持`Common JS`规范
  - 支持`AMD`规范
  - 使用`@import`引入
  - 使用`url()`函数
  - 使用`src`标签属性引入



#### 第四点：构建流程

- 初始化

  - `entry-options`启动
    - 从`shell`命令和配置文件中读取并合并参数

  - `run`实例化
    - 用上一步得到的参数初始化`Compiler`对象，加载所有配置的插件，执行对象的`run`方法，开始执行编译

- 编译构建
  - `entry`入口
    - 根据配置中的`entry`找到所有的打包入口文件
  - `make`编译模块
    - 从入口文件出发，调用所有配置的`Loader`对模块进行翻译
    - 再找出模块依赖的另一个模块，进行递归处理
    - 知道所有入口依赖的文件都经过了编译处理
  - `build module`完成模块编译
    - 经过上一步，使用`Loader`完成了所有模块的翻译，得到了每个模块被翻译后的最终内容。以及它们之间的依赖关系
  - `seal`输出资源
    - 根据入口和模块之间的依赖关系，组装成一个个的包含多个模块的`Chunk`，再吧每个`Chunk`转换成一个单独的文件加入到输出列表中
  - `emit`输出完成
    - 在确定好输出内容后，根据配置确定输出的路径和文件名，把文件内容写入到文件系统

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
      rules: [
          {
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
          }
      ]
      ```
  
- `less-loader`

  - 作用：将`less`文件处理成`css`文件

- `sass-loader`

  - 作用：将`scss`文件处理成`css`文件

    - 还需要安装`node-sass`来辅助

  - 使用：

    ```js
    rules:[
        {
            // test: /\.less$/, // 匹配 less 文锦啊
            test: /\.(s[ac]|c)ss$/i, //匹配所有的 sass/scss/css 文件
            use: [
                'style-laoder',
                'css-laoder',
                'postcss-laoder',
                // 'less-loader',
                'sass-loader'
            ]
        }
    ]
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

- `file-loader`

  - 作用：将一些文件处理后复制到输出目录下

  - 使用：

    ```js
    rules: [
        {
            test: /\.(jpe?g|png|gif)$/i, // 匹配图片文件
            use: [
                'file-loader' // 使用 file-loader ，默认是直接复制
            ]
        }
    ]
    
    ```

    - 可以通过`options`选项自定义

    ```js
    rules: [
        {
            test: /\.(jpe?g|png|gif)$/i, // 匹配图片文件
            use: [
                {
                    loader: 'file-loader',
                    options: {
                        // 复制到输出目录下的 img 文件夹下
                        // -- 并修改名称为  原来的文件名称 + hash值
                        name: 'img/[name].[hash:8].[ext]'
                    }
                }
            ]
        }
    ]
    
    ```

    

- `url-loader`

  - 作用：可以让文件在小于设置的大小时，返回一个`DataURL`，或者说`base64`编码，否则，使用`file-loader`来进行处理
    - 对于小文件，我们可以使用`DataURL`，从而减少请求次数
    - 对于大文件我们可以单独进行存在，提高加载速度
  - 使用：

  ```js
  rules: [
      {
          test: /\.(jpe?g|png|gif)$/i, // 匹配图片文件
          use: [
              {
                  loader: 'url-loader',
                  options: {
                      // 限定大小，小于 100kb 时，会转换为 base64编码，超过时则使用 file-loader 处理
                      limit: 100 * 1024,
                      // 超过大小时会使用 file-loader 的默认配置，即直接复制
                      // -- 但也可以通过 fallback 选项进行自定义设置
                      fallback: {
                          loader: 'file-loader',
                          options: {
                              name: 'img/[name].[hash:8].[ext]' // 移动到输出目录下 img 文件夹中，并命名
                          }
                      }
                  }
              }
          ]
      }
  ]
  
  ```

  - 匹配字体

    ```js
    {    
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,  // 匹配字体文件
    }
    ```

  - 匹配媒体

    ```js
    {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/, // 匹配媒体文件
    }
    ```

#### 第四个：打包JS文件

- `babel-loader`

  - 作用：将`ES6 | ES7 | ES8`语法转换为`ES5`语法

    - 需要安装

      ```shell
      npm i -D babel-loader @babel/core @babel/preset-env
      ```

      > 注意版本：
      >
      > - `babel-loader` 8.x 对应`babel-core` 7.x
      >
      > - `babel-loader` 7.x 对应`babel-core` 6.x

  - 使用：

    ```js
    // webpack.config.js
    module.exports = {
        module: {
            rules: [
                {
                    test: /\.js$/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env']
                        }
                    },
                    exclude: /node_modules/, // 排除 node_modules 文件夹
                }
            ]
        }
    }
    
    ```

- `babel-polyfill`

  - 作用：将一些`babel-loader`不支持转换的语法进行转换，如`Promise`、`Generate`、`Set`、`Maps`、`Proxy`等

    - 需要安装

      ```shell
      npm i @babel/polyfill
      ```

  - 使用：

    ```js
    // webpack.config.js
    const path = require('path')
    module.exports = {
        entry: ['@babel/polyfill', path.resolve(__dirname, 'src', 'index.js')],
    }
    ```

---

- 通常我们会将`Babel`配置单独提取出来`.babelrc.js`

  ```js
  // .babelrc.js
  
  module.exports = {
      presets: [
          "@babel/preset-env",
          {
              // false | entry | usage
              // -- false: 始终引入所有 polyfill
              // -- entry: 根据配置的浏览器兼容，引入浏览器不兼容的 polyfill
              // -- usage: 根据配置的浏览器兼容，和代码中用到的 API 来引入 polyfill， 即按需引入
              useBuiltIns: 'entry',
              corejs: '3.9.1',
              targets: {
                  chrome: '58',
                  ie: '11'
              }
          }
      ],
      // 如果是还未引入 ECMA规范的新特性，则需要新增一些插件来处理
      plugins: [
          ["@babel/plugin-proposal-decorators", { legacy: true }],
          ["@babel/plugin-proposal-class-properties", { loose: true }],
      ]
  }
  ```

#### 第五个：打包Vue文件

- `vue-loader`

  - 作用：用于解析`.vue`文件

    - 还需要安装
      - `vue-template-compiler`：用于编译Vue模板
      - `vue-style-loader`：

  - 使用：

    ```js
    const vueLoaderPlugin = require('vue-loader/lib/plugin')
    
    module.exports = {
        module: {
            rules: [{
                test: /\.vue$/,
                use: 'vue-loader'
            }]
        },
        resolve: {
            alias: {
                'vue$': 'vue/dist/vue.runtime.esm.js',
                '@': path.resolve(__dirname, 'src')
            },
            extensions: ['*', '.js', '.json', '.vue']
        },
        plugins: [
            new vueLoaderPlugin()
        ]
    }
    ```

#### 第六个：资源模块化

- `webpack5`新增了资源模块（`asset module`），允许我们使用资源文件而不要配置额外的`loader`

  - `asset/resource`：将资源分割为单独的文件，并导出`url`，作用同`file-loader`
  - `asset/inline`：将资源导出为`dataUrl`的形式，作用同`url-laoder`
  - `asset/source`：将资源你到处为源码`source code`，作用同`raw-loader`
  - `asset`：自动根据文件大小选择配置，默认小于`8kb`时，使用`asset/inline`，其它情况使用`asset/resource`

  ```js
  module.exports = {
      module: {
          rules: [
              {
                  test: /\.(jpe?g|png|gif)$/i, // 匹配图片文件
                  type: 'asset',
                  generatae: {
                      // 设置输出目录即输出文件
                      filename: '[name][hash:8][ext]'
                  },
                  parser: {
                      dataUrlCondition: {
                          maxSize: 100 * 1024 // 设置文件大小，同 limit
                      }
                  }
              }
          ]
      }
  }
  ```

  

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

---



#### 第三条：优化构建速度

##### （1）`speed-meature-webpack-plugin`

- 这个插件可以帮助我们获取打包**构建的时间**

- 首先安装这个插件

  ```shell
  npm i -D speed-measure-webpack-plugin
  ```

- 然后进行配置

  ```js
  const SpeedMeaturePlugin = require('speed-meature-webpack-plugin')
  const smp = new SpeedMeaturePlugin()
  module.exports = smp.warp({
      ...
  })
  ```

> 这个插件对一些新版本的`Plugin`和`Loader`会不兼容，所以并不推荐使用



##### （2）多进程打包

- 配置了`thread-loader`之后的`loader`都会在一个单独的`worker`中运行

  ```js
  rules:[
      {
          test: /\.js$/,
          use: [
              {
                  loader: 'thread-loader',
                  options: {
                      worker: 3,
                  }
              }
          ]
      }
  ]
  ```

##### （3）缓存

- `babel`在处理过程中时间开销比较大，将 `babel-loader` 的执行结果缓存起来，重新打包的时候，直接读取缓存

  ```js
  use: [
      {
          loader: 'babel-loader',
          ooptions: {
              cacheDirectory: true,
          }
      }
  ]
  ```

- 其它的`loader`需要借助`cache-loader`来处理

- `webpack5`中已经内置了更好的`cache`方法，通过配置即可缓存`webpack`模块和`chunk`，改善构建速度

  ```js
  module.exports = {
      cache: {
          type: 'filesystem',
      }
  }
  ```

#### 

#### 第四条：优化`resolve`配置

##### （1）alias别名

- `alias`用来创建`import`或`require`的别名，从而简化模块的引用

  ```js
  const path = require('path')
  
  // resolve 方法就是对 join 方法的封装
  function resolve(dir) {
      return path.join(__dirname, dir)
  }
  
  module.exports = {
      resolve: {
          alias: {
              '~': resolve('src'),
              '@': resolve('src'),
              'components': resolve('src/components'),
          }
      }
  }
  ```

##### （2）extensions扩展名

- `extensions`用来省略扩展名

  - 如果在引入模块时没有带上后缀，则`webpack`会按照`extensions`数组中配置的扩展名，从左到右的顺序去解析模块

  ```js
  module.exports = {
      resolve: {
          // 手动配置会覆盖默认配置
          // -- 但可以通过 `...` 来保留默认配置
          extensions: ['.js', '.json', '.wasm', '...']
      }
  }
  ```

##### （3）modules模块

- `modules`用来设置被解析模块的目录，它会告诉`webpack`到哪个文件夹下去搜索模块

  ```js
  module.exports = {
      resolve: {
          modules: [resolve('src'), 'node_modules']
      }
  }
  ```

---

#### 第五条：优化依赖包引入

##### （1）CDN引入

##### （2）externals排除

- `externals`配置项可以将配置的依赖包从打包文件中移除，即不对这些依赖进行打包处理，而是通过上面的`CDN`形式引入，这样可以减小打包文件的大小，节省打包构建的时间

  ```js
  module.exports = {
      externals: {
          
      }
  }
  ```

##### （3）include和exclude包含与排除

- 可以在配置加载器`loader`时，精确的去指定需要引入的目录和排除的目录

  - `iclude`：符合条件的模块
  - `exclude`：排除符合条件的模块

  ```js
  rules: [
      {
          test: /\.js$/i,
          include: resolve('src'),
          exclude: /node_modules/,
          use: ['babel-loader'],
      }
  ]
  ```

##### （4）noParse不解析

- `noParse`可以对配置了的模块文件，不解析里面的`import`、`require`等高级语法

  ```js
  modul: {
      noParse: /lodash/,
      rules: []
  }
  ```

#### 第六条：打包结果

##### （1）`webpack-bundle-analyzer`

- 引入这个插件可以生成一个打包结果分析，用于分析依赖包的大小

  ```js
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  module.exports = {
      plugins: [
          new BundleAnalyzerPlugin()
      ]
  }
  ```

##### （2）压缩CSS

- 安装插件

  ```shell
  npm i -D optimize-css-assets-webpack-plugin
  ```

- 使用

  ```js
  const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
  module.exports = {
      optimization: {
          minimize: true,
          minimizer: [
              new OptimizeCssAssetsPlugin()
          ]
      }
  }
  ```

##### （3）压缩JS

- 手动配置了`optimization`选项后，默认JS 压缩失效，需要重新配置

- `webpack5`内置的`terser-webpack-plugin`插件

  ```js
  const TerserPlugin = require('terser-webpack-plugin')
  module.exports = {
      optimization: {
          minimize: true,
          minimizer: [
              new TerserPlugin()
          ]
      }
  }
  ```

##### （4）Tree-Shaking

- `tree-shaking`可以清除没有使用的代码， 降低打包体积，即按需导入

- 在`.babelrc.js`文件中配置

  ```js
  // .babelrc.js
  
  module.exports = {
      presets: [
          [
              '@babel/preset-env',
              {
                  module: false, // 配置 module 即可在生产环境下开启
              }
          ]
      ]
  }
  ```
  
  > 这是因为：`tree-shaking`只能用于`ES6`模块，不能使用其它类型的模块如`CommonJS`，而`Babel`的配置会将任何模块类型都转译成`CommonJS`类型，这样就会导致`tree-shaking`失效，所以要配置`module`为`false`进行修正

##### （5）Scope-Hoisting

- `scope hoisting`即作用域提升，将多个模块放在同一作用域下，并重命名防止命名冲突。可以减少函数声明和内存开销
- 默认开启

---



#### 第七条：优化运行体验

> 提高首屏加载速度，降低首屏加载文件体积

##### （1）配置多个打包入口

- 在`entry`配置项中进行处理

  - 配置为对象形式，每一个属性表示一个入口

  ```js
  module.exports = {
      entry: {
          index: './src/index.js',
          main: './src/main.js'
      },
      output: {
          // [name] 表示 entry 中的属性，即最终会输出 两个文件
          filename: '[name].[hash:8].js'
      }
  }
  
  ```

- 默认的，打包后的文件`HTML`文件中会引入所有的`JS`文件，如果要指定只引入某一个文件，需要配置`chunks`

  ```js
  new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
      chunks: ['index'], // 表示只引入上面的 index.js 文件
  })
  ```

  

##### （2）分包处理

- 在 `optimization`配置项中处理

  - 默认配置

  ```js
  module.exports = {
      optimization: {
          splitChunks: {
              chunks: 'async', // 有效值为 `all`，`async` 和 `initial`
              minSize: 20000, // 生成 chunk 的最小体积（≈ 20kb)
              minRemainingSize: 0, // 确保拆分后剩余的最小 chunk 体积超过限制来避免大小为零的模块
              minChunks: 1, // 拆分前必须共享模块的最小 chunks 数
              maxAsyncRequests: 30, // 最大的按需(异步)加载次数
              maxInitialRequests: 30, // 打包后的入口文件加载时，还能同时加载js文件的数量（包括入口文件）
              enforceSizeThreshold: 50000,
              cacheGroups: { // 配置提取模块的方案
                  defaultVendors: {
                      test: /[\/]node_modules[\/]/,
                      priority: -10,
                      reuseExistingChunk: true,
                  },
                  default: {
                      minChunks: 2,
                      priority: -20,
                      reuseExistingChunk: true,
                  },
              }
          }
      }
  ```

  - 开发配置

  ```js
  const config = {
      //...
      optimization: {
          splitChunks: {
              cacheGroups: { // 配置提取模块的方案
                  default: false,
                  styles: {
                      name: 'styles',
                      test: /\.(s?css|less|sass)$/,
                      chunks: 'all',
                      enforce: true,
                      priority: 10,
                  },
                  common: {
                      name: 'chunk-common',
                      chunks: 'all',
                      minChunks: 2,
                      maxInitialRequests: 5,
                      minSize: 0,
                      priority: 1,
                      enforce: true,
                      reuseExistingChunk: true,
                  },
                  vendors: {
                      name: 'chunk-vendors',
                      test: /[\\/]node_modules[\\/]/,
                      chunks: 'all',
                      priority: 2,
                      enforce: true,
                      reuseExistingChunk: true,
                  },
                  // ... 根据不同项目再细化拆分内容
              },
          },
      },
  }
  
  ```

##### （3）懒加载

- 通过异步加载实现

  ```js
  import('./img/logo.png').then()
  ```

- 通过魔法注释实现

  ```js
  import(/* webpackChunkName: 'component1' */'./img/logo1.png').then()
  import(/* webpackChunkName: 'component2' */'./img/logo2.png').then()
  ```

  > 会自动分包为两个文件，魔法注释名称相同的模块会被打包进同一个页面

- `prefetch`预获取和`preload`预加载

  - 预获取会在浏览器空闲的时候才进行资源的拉取
  - 预加载会提前加载后面会用到的关键资源

  ```js
  import(/* webpackPrefetch: true */'./img/logo1.png').then()
  
  import(/* webpackPreload: true */'./img/logo2.png').then()
  ```

  





### 05.`webpack`深入

> 
>
> 这里什么都没有
>
> 

#### 第一幕：手写Loader

- `Loader`从本质上来说就是一个`node`模块，它可以将传入的代码进行一系列加工处理后，再返回出去

- `Loader`的编写遵循以下原则：

  - 单一原则，每一个`Loader`只做一件事情
  - 链式调用：按照规定，`webpack`会按照从右到左的顺序去链式调用每一个`Loader`
  - 统一原则：遵循`webpack`指定的设计规则和结构，`Loader`的输入与输出都是字符串，且每一个`Loader`都相互独立，互不影响

  ```js
  module.exports = function(source) {
      // ...
      return output.code
  }
  ```

  

#### 第二幕：手写Plugin

- `Webpack`在运行的生命周期中会广播出许多时间，`Plugin`可以监听这些事件，并对其中的一些事件做处理

  ```js
  class MyPlugin {
      constructor(options) {
          console.log('my-plugin-constructor')
      }
      apply(compiler) {
          compiler.plugin('done', compilation => {
              console.log('my-plugin-apply')
          })
      }
  }
  
  module.exports = MyPlugin
  ```

  
