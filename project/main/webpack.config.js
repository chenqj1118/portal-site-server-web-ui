/** Webpack configuration for distribution */
var config = require("webpack-dev-web-test/webpack/webpack-config.js").prodConfig('vue', './src/main.js');
var webpack = require('webpack-dev-web-test/node_modules/webpack');
config.mode = 'development';

var path = require('path');
var glob = require('glob');

const pagesPath = './src/pages';

//自动获取入口js文件
var getEntries = function (pagesPath){
    var jsDir = path.resolve(__dirname,pagesPath);
    var entryFiles = glob.sync(jsDir + '/**/*.js');  //获取pages目录下所有js文件
    var entries = {};
    entryFiles.forEach(function (file,index){
        var fileName = file.substring(file.lastIndexOf('\/') + 1, file.lastIndexOf('.'));
        var fileDir =  file.substring(0, file.lastIndexOf('\/'));

        //并非pages下所有的.js都是入口文件，比如可能route.js等，需要进一步遍历当前目录下是否有同名的html文件，否则不是入口文件；
        var htmlList = glob.sync(fileDir + '/*.html');  //当前目录下所有html文件
        htmlList.forEach(function (html,index){
            var htmlName = html.substring(html.lastIndexOf('\/') + 1, html.lastIndexOf('.'));
            if(htmlName == fileName){
                entries[fileName] = file;
            }
        });
    });
    return entries;
};
config.entry = getEntries(pagesPath);

//config.output.filename = 'js/[name].[hash:8].js';   //输出名称后面跟哈希值，解决缓存问题
const rootPath = process.cwd();
config.output = {
    path: rootPath + "/dist",
    publicPath: "/dist/",
    filename: 'js/[name].[hash:8].js'
};

const HtmlWebpackPlugin = require('webpack-dev-web-test/node_modules/html-webpack-plugin');

let plugins = config.plugins;

//设置webpack config.plugins 用于处理.html文件
var setHtmlWebpackPlugins = function(pagesPath){
    var htmlDir = path.resolve(__dirname, pagesPath);
    var htmls = glob.sync(htmlDir + '/**/*.html');  //获取pages目录下所有html文件
    htmls.forEach(function (file,index){
        var filename_no_extension = file.substring(file.lastIndexOf('\/') + 1, file.lastIndexOf('.'));
        var filename = filename_no_extension.concat('.html');
        plugins.push(new HtmlWebpackPlugin({
            filename: filename,
            template: 'blueimp-tmpl-loader!'+file,
            inject: 'head',
            chunks: [filename_no_extension],
        }))
    });
};
setHtmlWebpackPlugins(pagesPath);

plugins.push(
    new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery"
      })
);

let rules = config.module.rules;
for(let i=0; i<rules.length; i++){
	let rule = rules[i];
	let loader = rule.loader;
	if ("html-loader"===loader || (Array.isArray(loader) && loader.indexOf("html-loader")>=0)){
		if (rule.exclude){
			let src = rule.exclude.source;
			rule.exclude = new RegExp("/(src(\\/|\\\\)pages|("+src+"))/");
			console.warn(rule, "exclude changed from: ", src, "to", rule.exclude);
		}else{
			rule.exclude = /src(\/|\\)pages/;
		}
	}
}
//config.output.publicPath='/estore/';
module.exports = config;
