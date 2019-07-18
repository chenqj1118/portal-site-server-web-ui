/*
 * 用于支持 IE8 的 webpack 配置文件
 */
module.exports = function(config){
	/**
	 * 默认 webpack 自带的 Live Reload (Hot Module Replacement - HMR) 不兼容 IE8 
	 */
	config.devServer = {
	    hot: false,
	    inline: false,
	}

	/**
	 * 定制 webpack 的代码压缩以支持 IE8;
	 */
	var UglifyJsPlugin=require('uglifyjs-webpack-plugin');
	var uglifyjs = new UglifyJsPlugin({
        sourceMap: true,
        uglifyOptions:{
            ie8: true,
            compress: {
                properties: false,
                warnings: false
            },
            output: {
                beautify: ('production'!=config.mode),
                quote_keys: true
            }
        }
    });
	if ("production"==config.mode){
		config.optimization = config.optimization || {};
		config.optimization.minimizer = config.optimization.minimizer || [];
		config.optimization.minimizer.push(uglifyjs);
	}else{
		//在 development 模式下 minimizer 不起作用, 所以作为普通 plugin 处理
		config.plugins.push(uglifyjs);
	}

	/**
	 * es5-shim/sham 用于在旧版 js 引擎中模拟实现 ES5 的方法.
	 * 这两个 js 不能直接被 webpack 打包，所以使用 CopyWebpackPlugin 复制到默认输出目录下, 在 HTML 中需要显示引用;
	 * 建议写法:
		<!--[if lt IE 9]>
		<script src="../dist/es5-shim.js"></script>
		<script src="../dist/es5-sham.js"></script>
		<![endif]-->
	 */
	const CopyWebpackPlugin = require('copy-webpack-plugin');
	const copyES5Shim = new CopyWebpackPlugin([
	        { from: __dirname + "/../../node_modules/es5-shim/es5-shim.js" },
	        { from: __dirname + "/../../node_modules/es5-shim/es5-sham.js" }
	    ],
	    {}
	);
	config.plugins.push(copyES5Shim);

	return config;
}
