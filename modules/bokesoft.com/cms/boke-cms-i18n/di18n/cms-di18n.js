"use strict";

/**
 * 对 di18n-translate ( https://www.npmjs.com/package/di18n-translate ) 的扩展支持
 */

const DI18n = require('di18n-translate');

//扩展 DI18n
class CmsDI18n extends DI18n {
	constructor(options = {}) {
		super(options);
	}
	
	$t(key, ...args) {
		//PATCH - 避免没有定义的 Locale 造成的 super.$t() 执行错误: Cannot read property 'XXXXXX' of undefined
		if (! this.messages[this.locale]){
			this.messages[this.locale] = {};
		}
		//PATCH - 找不到就返回 key
		if (! this.messages[this.locale][key]){
			this.messages[this.locale][key] = key;
		}
		
		var data = {};
		//首先将多个 args 处理成为 {1:X, 2:Y, ...} 这样的对象, 以支持在消息中的 X{1}Y{2}ZZZ 占位符方式
		if (args.length === 1 && typeof args[0] === 'object') {
			//这里是原来 di18n 处理的 ...
			data = args[0];
		}else {
			for (var i=0; i<args.length; i++){
				data[i+1] = args[i];		//data[i+1] - 因为 {} 中的数字是从 1 开始的 ...
			}
		}
		return super.$t(key, data);
	}
	
	/**
	 * 增加消息对应表信息.
	 * @param messages
	 * @returns
	 */
	append(messages){
		if (messages && typeof messages === 'object'){
			for (var locale in messages){
				var msgTable = messages[locale];
				if (! this.messages[locale]){
					this.messages[locale] = {};
				}
				for (var key in msgTable){
					var msg = msgTable[key];
					this.messages[locale][key] = msg;
				}
			}
		}
	}
}

module.exports = {
	buildDI18n: function(options){
		return new CmsDI18n(options);
	}
}