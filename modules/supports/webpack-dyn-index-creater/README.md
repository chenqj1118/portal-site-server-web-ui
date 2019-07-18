# 动态引用构建工具

## 概述

用于根据 javascript 模块(package) 的分组定义 (chunk) 创建包含“模块动态引用”的定义代码(默认产生在当前目录下的 `src/index.js` 文件中，通过 `window._require` 函数使直接写在 HTML 文件中的 javascript 脚本(没有被 webpack 打包进去)也可以引用模块化的 javascript package;

此功能通常用于将 npm/webpack 模块化机制与 CMS 系统动态创建的内容中的 javascript 脚本结合起来。

例如，在 HTML 代码中可以这样动态去引用打包好的模块:
```html
<script>
var doTestBizUtils = function(){
    _require("biz-utils", function(util){
        alert("stdDate2String="+util.stdDate2String(new Date()));
    });
}
... ...
</script>
```



## 使用方法

在 Javascript 代码中, 调用 `webpack-dyn-index-creater` 模块的 `build` 方法(参考 [./dyn-index-creater.js](./dyn-index-creater.js) ), 创建一个 "Index" Javascript 文件(默认是 `src/index.js`), 在 webpack 构建中包含这个 Javascript 文件即可。



## END