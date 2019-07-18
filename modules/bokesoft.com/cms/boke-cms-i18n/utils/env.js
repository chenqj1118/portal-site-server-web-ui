"use strict";

/**
 * 目前只支持浏览器环境
 */
const GLOBAL = window;
if (! GLOBAL){
	throw "boke-cms-i18n supports Javascript Runtime in Web Browser Only";
}

/**
 * 全局默认的 Locale
 */
const DEFAULT_LOCALE = "zh_CN";

/**
 * 默认的当前 Locale 检测选项
 */
const DETECT_OPTIONS = {
		/** 从哪个 Cookie 中取得当前的 Locale */
		cookieName: "BOKE_CMS_LOCALE",
		/** (仅在设置时需要)定义当前 Locale 的 Cookie 的 Path */
		cookiePath: "/",
		/** (仅在设置时需要)定义当前 Locale 的 Cookie 的 生存期, 默认是 null (仅当前浏览器会话) */
		cookieExpires: null,
		/** 从当前哪个全局变量(一般情况就是 window.XXX)取得当前的 Locale */
		globalVarName: "BOKE_CMS_LOCALE"
}

/** 检测浏览器的 Language 设置, 一般类似 en-US、zh-CN */
var browser_language =
	(navigator.languages && navigator.languages[0]) ? navigator.languages[0] : (navigator.language || navigator.userLanguage);

//一些内部变量
var Cookies = require("js-cookie");
//一些私有方法	
var _normalizeLocale = function(loc){
	if (loc){
		loc = loc + "";    //强制变为字符串
		loc = loc.replace(/-/g, "_");    //统一使用 "_", zh-CN ==》zh_CN
		//"_"之后的部分变为大写
		var tmp = loc.split(/_/g);
		if (tmp && tmp[1]){
			tmp[1] = tmp[1].toUpperCase();
			loc = tmp.join("_");
		}
		return loc;
	}else{
		return DEFAULT_LOCALE;
	}
}

/**
 * 设置 Locale 的检测选项
 * @param options 检测选项, 参考 DETECT_OPTIONS
 */
var setOptions = function(options){
	var _copyOption = function (optName){
		if(options && options[optName]) {
			DETECT_OPTIONS[optName] = options[optName];
		}
	}
	if (options.cookieName){
		Cookies.remove(DETECT_OPTIONS.cookieName);
	}
	_copyOption("cookieName");
	_copyOption("cookiePath");
	_copyOption("cookieExpires");
	
	if (options.globalVarName){
		GLOBAL[DETECT_OPTIONS.globalVarName] = null;
	}
	_copyOption("globalVarName");
}

/**
 * 获取 Locale 的检测选项
 */
var getOptions = function(){
	return DETECT_OPTIONS;
}

/**
 * 检测当前的 Locale, 返回标准的 Locale 字符串例如: en_US、zh_CN 等.
 * 检测的原则：globalVar 大于 cookie 大于 browser_language
 */
var getLocale = function(){
	var loc = null;
	if(!loc) {
		loc = GLOBAL[DETECT_OPTIONS.globalVarName];
	}
	if(!loc) {
		loc = Cookies.get(DETECT_OPTIONS.cookieName);
	}
	if (!loc){
		loc = browser_language;
	}
	return _normalizeLocale(loc);
}

/**
 * 设置当前的 Locale(同时改变 globalVar 和 cookie)
 */
var setLocale = function(loc){
	var locale = _normalizeLocale(loc);
	GLOBAL[DETECT_OPTIONS.globalVarName] = locale;
	Cookies.set(DETECT_OPTIONS.cookieName, locale, {
		path: DETECT_OPTIONS.cookiePath, expires: DETECT_OPTIONS.cookieExpires
	});
}

module.exports = {
		setOptions: setOptions,
		getOptions: getOptions,
		getLocale: getLocale,
		setLocale: setLocale
}