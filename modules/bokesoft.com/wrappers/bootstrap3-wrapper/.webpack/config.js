module.exports = {
	configWebpack: function(config){
		/**
		 * 在默认 webpack 配置上增加 bootstrap 的内容
		 */
		config.module.rules.splice(0/*要插入的位置,这里是最前面*/, 0/*要删除多少个元素, 0表示不用删除*/,
		        // **IMPORTANT** This is needed so that each bootstrap js file has access to the jQuery object
		        //               "/bootstrap(\/|\\)js(\/|\\)/" -- "bootstrap/js/" on linux or "bootstrap\js\" in windows
				{ test: /bootstrap(\/|\\)js(\/|\\)/, loader: 'imports-loader?jQuery=jquery' }
		);
	}
}