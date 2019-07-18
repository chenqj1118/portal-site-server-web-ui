"use strict";

/**
 * CMS 的多语言支持模块
 */
const env = require("./utils/env");

const cmsDI18n = require('./di18n/cms-di18n');

module.exports = {
		setOptions: env.setOptions,
		getOptions: env.getOptions,
		getLocale: env.getLocale,
		setLocale: env.setLocale,
		buildDI18n: function(options){
			options.locale = options.locale || env.getLocale();
			return cmsDI18n.buildDI18n(options);
		}
}