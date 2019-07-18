/*
 * 用于典型的 VUE 开发的默认 webpack 配置文件
 */
module.exports = function(config){
	/* alias 和 extension 调整
	    resolve: {
	    	modules: MODULE_DIRS,
	        alias: {
				'vue':'vue/dist/vue.js'
			},
	        extensions: ['.js', '.css', '.less', '.html', '.png', '.jpg', '.vue']
	    },
	 */
	config.resolve.alias['vue'] = 'vue/dist/vue.js';
	config.resolve.extensions.push('.vue');

	/* 增加 .vue 的 loader(在 loaders 的最前面)
		{
			test: /\.vue$/,
			loader: 'vue-loader',
			options: {
				loaders: {
					scss: 'vue-style-loader!css-loader!scss-loader', // <style lang="scss">
					less: 'vue-style-loader!css-loader!less-loader', // <style lang="less">
					sass: 'vue-style-loader!css-loader!sass-loader?indentedSyntax' // <style lang="sass">
				}
			}
		},
	 */
	config.module.rules.splice(0/*要插入的位置,这里是最前面*/, 0/*要删除多少个元素, 0表示不用删除*/,{
		test: /\.vue$/,
		loader: 'vue-loader',
		options: {
// 实测如果定义了 less/scss/sass 的 laoder 后, 此处不再需要额外的 loaders option
//			loaders: {
//				less: ['vue-style-loader', 'css-loader', 'less-loader'], // <style lang="less">
//				scss: ['vue-style-loader', 'css-loader', 'sass-loader'], // <style lang="scss">
//				sass: ['vue-style-loader', 'css-loader', 'sass-loader?indentedSyntax'] // <style lang="sass">
//			}
		}
	});

	/* https://vue-loader.vuejs.org/guide/#manual-configuration
	 * In addition to a rule that applies vue-loader to any files with extension .vue,
	 * make sure to add Vue Loader's plugin to your webpack config.
	 */
	const VueLoaderPlugin = require('vue-loader/lib/plugin');
	config.plugins.push(new VueLoaderPlugin());

	return config;
}
