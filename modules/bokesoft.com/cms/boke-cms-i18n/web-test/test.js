var i18n = require("../index");
var $ = require("jquery");

var defaultOptions = i18n.getOptions();
var testOptions = {
		cookieName: "COOKIE_TEST_LOCALE",
		globalVarName: "VAR_TEST_LOCALE"
}

var di18nMsgs = {
	en_US: {
		"简单的字符串": "A simple example String",
		"嗨，{1}{2}, 早上好": "Hi, {2}.{1}, Good morning",
		"嗨，{lastname}{firstname}, 早上好": "Hi, {firstname}.{lastname}, Good morning"
	},
	zh_TW: {
		"简单的字符串": "簡單的字符串",
		"嗨，{1}{2}, 早上好": "嗨，{1}{2}, 皁仩恏",
		"嗨，{lastname}{firstname}, 早上好": "嗨，{lastname}{firstname}, 皁仩恏"
	},
	zh_CN: {
		"Source": "源消息",
		"Translated": "翻译结果"
	}
}
//全局 di18n 对象
var di18n = i18n.buildDI18n({
	messages: di18nMsgs
});

var showTestResult = function(){
	
	//$t 调用的例子 - 因为在 $html 中的 "$t()" 不支持参数
	var sampleMorning1 = di18n.$t("嗨，{1}{2}, 早上好", "张", "三丰");
	var sampleMorning2 = di18n.$t("嗨，{lastname}{firstname}, 早上好", {"lastname":"张", "firstname":"三丰"});
	
	var di18nTmpl = `
		<table width="100%" border="1" cellspacing="0" bordercolor="#CCCCCC">
		  <tr>
		    <th>$t("Source")</th>
		    <th>$t("Translated") - <code>\${locale}</code></th>
		  </tr>
		  <tr>
		    <td>简单的字符串</td>
		    <td>$t("简单的字符串")</td>
		  </tr>
		  <tr>
		    <td>嗨，{1}{2}, 早上好</td>
		    <td>${sampleMorning1}</td>
		  </tr>
		  <tr>
		    <td>嗨，{lastname}{firstname}, 早上好</td>
		    <td>${sampleMorning2}</td>
		  </tr>
		  <tr>
		    <td>后来增加的消息</td>
		    <td>$t("后来增加的消息")</td>
		  </tr>
		</table>
	`;
	var result = di18n.$html(di18nTmpl);
	$(".resultArea").html(result);
}

window.testGetLocale = function(){
	var loc = i18n.getLocale();
	alert(loc);
}

window.testSetLocaleEN = function(){
	i18n.setLocale("en-us");
	di18n.setLocale(i18n.getLocale(), function(){
		showTestResult();
	});
}

window.testSetLocaleZH = function(){
	i18n.setLocale("zh_CN");
	di18n.setLocale(i18n.getLocale(), function(){
		showTestResult();
	});
}

window.testSetLocaleTW = function(){
	i18n.setLocale("zh_tw");
	di18n.setLocale(i18n.getLocale(), function(){
		showTestResult();
	});
}

window.testSetLocaleGB = function(){
	i18n.setLocale("en-GB");
	di18n.setLocale(i18n.getLocale(), function(){
		showTestResult();
	});
}

window.testSetOptions = function(){
	i18n.setOptions(testOptions);
	di18n.setLocale(i18n.getLocale(), function(){
		showTestResult();
	});
}

window.testResetOptions = function(){
	i18n.setOptions(defaultOptions);
	di18n.setLocale(i18n.getLocale(), function(){
		showTestResult();
	});
}

window.testAppendMessages = function(megs){
	di18n.append({
		en_US: {
			"后来增加的消息": "The appended testing message",
			"简单的字符串": "The First Example String",
		},
		zh_TW: {
			"后来增加的消息": "後來增加的消息"
		},
		en_GB: {
			"后来增加的消息": "THE APPENDED TESTING MESSAGE",
			"嗨，{lastname}{firstname}, 早上好": "HI, {firstname}.{lastname}, GOOD MORNING"
		}
	});
	showTestResult();
}

window.onload = showTestResult;