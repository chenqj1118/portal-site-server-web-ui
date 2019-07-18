# Webpack 开发基础配置

## 概述

实现了一个统一的基于 Webpack 的前端开发架构基础 “`webpack-dev-web-test`”，包括：

- 通用于开发环境和生产发布的 webpack 公共配置：[./webpack/webpack-config.js](./webpack/webpack-config.js) ;
  - *包含针对不同目标环境的扩展，例如 VUE支持([./webpack/targets/target-vue.js](./webpack/targets/target-vue.js)) 、IE8支持([./webpack/targets/target-IE8.js](./webpack/targets/target-IE8.js)) ;*
- 大部分需要使用到的 webpack loader、plugin 等: 参见 [./package.json](./package.json) ;
  - *(可以被继承到引用当前 package 的项目, 不需要项目单独通过 `npm install` 安装);*
- 一个包含测试的 Web 服务器的 webpack-dev-server: [./web-test-server.js](./web-test-server.js) ;



## 使用说明
### 在`package.json`中引用本项目

类似下面这样, 在`devDependencies`中引用本项目, 可以使用相对路径。

```js
{
  "name": "XXX",
  ... ...
  "dependencies": {
    ... ...
  },
  "devDependencies": {
    ... ...
    "webpack-dev-web-test": "file:../../../supports/webpack-dev-web-test"
  }
}
```
### 针对模块和项目的不同处理

针对`模块开发`和`前端项目`两个不同的场景，可以采用不同的处理方法。

- **模块开发** - 专注于模块功能的**实现**和**测试**(单元测试和模块功能测试)，通常不是特别关注最终的打包和发布;
  - 所以在这种模式下，*不要求精细调整的webpack配置*，*不要求发布时的动态加载chunk调整*，*不要求代码压缩和混淆*，而是更关注如何**标准化**的实现模块功能和模块测试代码，最好能够保持模块核心功能之外的其他内容尽可能**简洁**;
- **前端项目** - 专注于将不同模块组合以完成各类业务功能需求，在具体模块功能完备的前提下，更关注如何**打包**、**发布**、**优化**和浏览器兼容性;



#### 模块开发：通过 js 文件启动测试服务器

一般情况下, 这个启动测试服务器的 js 文件命名为`test-server.js`(在项目目录下使用如下命令启动: `node test-server.js`);

一个典型的`test-server.js`文件如下（具体使用方法，可以参考 [./web-test-server.js](./web-test-server.js) 中的注释 ）：

```js
/** 引入 webpack-dev-web-test 模块 */
var app = require("webpack-dev-web-test");

/** 启动测试服务器, 包括内置的 webpack-dev-server, 以及模拟测试用的 Web 服务器 */
app.start({
    /** 具体设置参考 webpack-dev-web-test/web-test-server.js 中的注释 */
    target: ["IE8"] //示例 - 一个或者多个目标环境的定义
}, function(app){
    /** 遵循“模块需要包括自己的测试用例”的原则，可以在测试服务器中实现测试需要的后端模拟 API 请求 */
    app.post('/test-data.json', function(req, resp) {
        resp.send('Hello, World!');
    });
});
```

一些注意事项：

- `test-server` 默认启动在 8080 端口，默认情况下, 配合人工编写`web-test/test.html`等测试文件，功能测试的 Web 页面访问地址是 `http://localhost:8080/web-test/test.html` ;
- 如果本机的 8080 端口已经被占用，`test-server` 会自动查找 8080 端口之后的可用端口，运行时注意观察命令行的输出;
- 默认作为`entry`被webpack打包的测试代码是`./web-test/test.js`，打包结果被输出在 `/test-bundle.js`（请参考[./webpack/webpack-config.js](./webpack/webpack-config.js)`#testConfig(target)`的实现）;
- 在整个开发-测试过程中，作为一个“模块”，上述体系不会实际把 js 打包的结果保存到磁盘上，所以模块目录下只会包含打包前的核心代码和测试代码，目录结构保持简洁。



#### 前端项目：编写`webpack.config.js`

作为最终需要打包发布的前端项目，为了与webpack工具链(`webpack-dev-config`、`webpack-cli`等)保持一致，一般情况下，是需要编写`webpack.config.js`文件的，在当前项目(`webpack-dev-web-test`)的基础上, 一般情况可以比较简洁的写出一个 `webpack.config.js` 文件，例如：

```javascript
var config = require("webpack-dev-web-test/webpack/webpack-config.js").prodConfig(null, {
    main: './src/main.js',
    bootstrap: './src/bootstrap.js'
});

/** 在默认 webpack 配置上增加 bootstrap 的内容 */
require("bootstrap3-wrapper/.webpack/config.js").configWebpack(config);

module.exports = config;
```

相关说明：

- 建议通过命令 `npm install -g webpack webpack-cli webpack-dev-server` **全局安装** webpack 相关命令：
- 可以通过命令行 `webpack-cli -p` 完成项目的打包，打包输出目录默认为 `./dist` 目录;
- 通过命令行 `webpack-dev-server` 可以运行本地测试环境，这种情况一样支持人工编写`web-test/test.html`等测试文件，参考[./webpack/webpack-config.js](./webpack/webpack-config.js)`#prodConfig(target, entries)`的实现, 默认情况下, 测试页面引用打包后的 js 文件采用的地址是 `<script src="../dist/bundle.main.js"></script>` .



## END