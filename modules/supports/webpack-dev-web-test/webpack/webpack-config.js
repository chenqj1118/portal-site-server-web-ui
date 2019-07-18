var Path=require('path');
var colors = require('colors');
var webpack = require('webpack');

/** The resolve path list to find modules */
var MODULE_DIRS=[
	'node_modules',
	Path.join(__dirname, '../node_modules'),    /*目前 webpack-config.js 源码在 webpack 子目录下*/
	process.cwd(), Path.join(process.cwd(),'src'), Path.join(process.cwd(),'node_modules')
];
console.log("MODULE_DIRS:\n    ".green.bold + MODULE_DIRS.join("\n    "));
/** The resolve path list to find loaders */
var LOADER_DIRS=MODULE_DIRS;
console.log("LOADER_DIRS:\n    ".green.bold + LOADER_DIRS.join("\n    "));

var _getFormattedEntries = function(entries){
	if (entries){
		if (typeof entries == 'string'){
			entries = {main: entries};
		}else if (Array.isArray(entries)){
			entries = {main: entries};
		}
		/* So, 如果即不是字符串也不是数组, 那么就认为 entries 已经是一个符合 webpack 格式的对象, 通常像这样:
		 * {
		 *     main: ['./src/main.js', './src/patch.js'],
		 *     bootstrap: './src/bootstrap.js'
		 * }
		 */
	}
	
	//将所有的 entry 内容全部设置为数组格式
	for (var name in entries){
		var entry = entries[name];
		if (! Array.isArray(entry)){
			entries[name] = [entry];
		}
	}
	
	return entries;
}
var _applyTargets = function(config, target){
	//整理 target 参数
	var targets = [];
	if (target){
		if (Array.isArray(target)){
			targets = targets.concat(target);  //采用数组支持多个 target 联合使用
		}else{
			targets.push(target);
		}
	}
	//针对不同 target 的附加控制
	for (var i=0; i<targets.length; i++){
		var _target = targets[i];
		if (_target){
			//target 的处理参数
			var targetParams = {
					targets: targets,        //目前 webpack 执行过程中全部的多个 target
					currentTargetIndex: i    //当前处理到哪个 target —— 如果不同 target 之间有影响的话, 这个参数可供实现一些判断逻辑
			}
			//特定 target 的附加处理
			var targetPath = "./targets/target-"+ _target +".js";
			console.log("Target ".green.bold + (""+_target).white.bold + ": " + (targetPath).blue.bold + " ...");
			config = require(targetPath)(config, targetParams);
		}
	}
	//补丁 - IE11 Promise - Chunk 文件加载需要
	if (config.entry.main && Array.isArray(config.entry.main)){
		config.entry.main.splice(
				0/*要插入的位置,这里是最前面*/, 0/*要删除多少个元素, 0表示不用删除*/,
				__dirname + "/utils/es6-promise-polyfill.js"
		);
	}else{
		throw "Webpack configuration 'entry' MUST has 'main' item and it's value MUST be an Array!"
	}
}

/**
 * 构建默认的 webpack 配置
 */
var getDefaultConfig = function(){
	var defaultConfig = {
	    devtool: "source-map",  //Force create source map file
	    mode: 'development',
	    entry: './web-test/test.js',
	    output: {
	        path: __dirname,
	        publicPath: "/web-test/",
	        filename: 'test-bundle.js'
	    },
	    resolve: {
	    	modules: MODULE_DIRS,
	        alias: {},
	        extensions: ['.js', '.css', '.less', '.html', '.png', '.jpg', '.swf']
	    },
		resolveLoader:{
			modules: LOADER_DIRS,
		},
	    module: {
	    	rules: [{
	    		    test: /\.js$/,
	    		    exclude: /(node_modules|bower_components)/,
	    		    use: {
	    		        loader: 'babel-loader',
	    		        options: {
	    		            presets: [
	    		            	/*
	    		            	 * 这里使用绝对路径指定 preset-env(目前 webpack-config.js 源码在 webpack 子目录下), 这样具体项目
	    		            	 * 就不需要再次申明对 babel-preset-env 的依赖了。
	    		            	 */
	    		            	__dirname+'/../node_modules/@babel/preset-env'
	    		            ]
	    		        }
	    		    }
	    		},{
	    			test: /\.css$/, loader: 'style-loader!css-loader'
	    		},{
	    			test: /\.less$/, loader: ['style-loader', 'css-loader', 'less-loader']
	    		},{
	    			test: /\.scss$/, loader: ['style-loader', 'css-loader', 'sass-loader']
	    		},{
	    			test: /\.sass$/, loader: ['style-loader', 'css-loader', 'sass-loader?indentedSyntax']
                },{
    	            // inline base64 URLs for <=256bytes images, direct URLs for the rest
                	test: /\.(png|jpg|gif|svg)$/, loader: 'url-loader?limit=256&name=img/[name].[ext]'
                },{
    	            // loader for html templates
                	test: /\.html$/, loader: 'html-loader'
                },{
    	            // loader for flash
                	test: /\.swf$/, loader: 'file-loader?name=img/flash/[name].[ext]'
                },{
    	            // loader for fonts
					test: /\.(ttf|eot|otf)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader?name=fonts/[name].[ext]"
                },{
                	// loader for fonts - woff/woff2
                	test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, 
                	loader: 'url-loader?importLoaders=1&limit=10000&mimetype=application/font-woff&name=fonts/[name].[ext]'
                }
			]
	    },
	    plugins: []
	};
	
	return defaultConfig;
}

/**
 * 创建测试环境的 webpack 配置
 * @param target Webpack 配置的目标环境(比如 'vue', 也支持数组格式, 比如 ['vue', 'IE8'] ), 默认为 null;
 */
var testConfig = function(target){
	var config = getDefaultConfig();

	//在处理 target 之前, 格式化 entry 设置, 统一规范为 “对象-数组” 格式, 这样在具体 target 处理中比较方便
	config.entry = _getFormattedEntries(config.entry);
	//针对不同 target 的附加控制
	_applyTargets(config, target);
	
	return config;
}

/**
 * 创建生产环境的 webpack 配置.
 * @param target Webpack 配置的目标环境(比如 'vue', 也支持数组格式, 比如 ['vue', 'IE8'] ), 默认为 null;
 * @param entries 入口, 可以是字符串或者数组(例如: './src/index.js', 此时 entry 的名称固定为 "main"),
 *         也可以是 [名称]-[文件] 对应表(例如: {main: './src/main.js', bootstrap: './src/bootstrap.js'});
 */
var prodConfig = function(target, entries){
	var config = getDefaultConfig();
	
	const rootPath = process.cwd();
	
	/* mode = production */
	config.mode = 'production';
	
	/* 生产环境的 entry 和 output 控制如下
	    entry: {
	        main: './src/main.js',
	        bootstrap: './src/bootstrap.js'
	    },
	    output: {
	        path: __dirname + "/dist",
	        publicPath: "/dist/",
	        filename: 'bundle.[name].js'
	    },
	 */
	if (entries){
		config.entry = _getFormattedEntries(entries);
	}else{
		config.entry = _getFormattedEntries(config.entry);
	}
	config.output = {
        path: rootPath + "/dist",
        publicPath: "/dist/",
        filename: 'bundle.[name].js'
    };
	
	/* 通过 webpack-cleanup-plugin 清除 dist 目录 - FIXME:由于实际执行是在具体项目下, 所以需要使用绝对路径引用, 视 npm 不同版本可能存在差异 */
	const CleanWebpackPlugin = require('webpack-cleanup-plugin');
	config.plugins.push(new CleanWebpackPlugin(
        ['dist'] /*paths*/, {
            root: rootPath,        　　　　　　　　　　//根目录
            verbose:  true,        　　　　　　　　　　//开启在控制台输出信息
            dry:      false        　　　　　　　　　　//启用删除文件
        }
    ));
	
	//针对不同 target 的附加控制
	_applyTargets(config, target);

	return config;
}

module.exports = {
		testConfig: testConfig,
		prodConfig: prodConfig
}
