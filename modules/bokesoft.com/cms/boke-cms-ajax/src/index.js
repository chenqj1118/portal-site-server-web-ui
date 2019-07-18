"use strict";

/* The implementations */
var $ = require("jquery");
var JSON = require("JSON2");

//解决 IE8 跨域访问 No Transport 错误( REF: http://stackoverflow.com/questions/9160123/no-transport-error-w-jquery-ajax-call-in-ie )
$.support.cors = true;

//记录访问过的 url, 避免同一个 url 重复的提交
var postedUrls = [];
//默认的 loading 指示器(支持各类 jQuery 选择器)
var loadingSelector_default = ".boke-cms-ajax-loading";
//默认的错误显示效果
var errorStyle_default = "alert";
//默认返回数据类型
var dataType_default = "json";
/**
 * 提交 json 数据到服务器并在请求成功返回后执行回调；
 * 如果使用 option.loadingSelector 指定了 loading 指示器，在执行时 AJAX 调用时会显示相应的元素.
 * @param url 规定把请求发送到哪个 URL
 * @param method HTTP Method: POST/GET
 * @param data 规定连同请求发送到服务器的数据(json格式)
 * @param successCallback 请求成功时执行的回调函数
 * @param options 其它选项
 *   - loadingSelector: loading 指示器(支持各类 jQuery 选择器), 默认为 'class="boke-cms-ajax-loading"'
 *   - errorStyle: 错误显示风格 - alert: 使用 alert 方法弹出错误; notify: 简单的 notification 效果; none: 不显示错误。
 *   - dataType : json/text
 */
var _Ajax = function(url, method, dataObj, successCallback, options){
    if (postedUrls.indexOf(url) > -1) {
    	console.warn("url '"+url+"' duplication found: skip current request.");
        return;
    } else {
        postedUrls.push(url);
    }	
	var options = options || {};
    var loadingSelector = ( options.loadingSelector || loadingSelector_default );
    var errorStyle = ( options.errorStyle || errorStyle_default );
	var dataType = ( options.dataType || dataType_default );

    //准备显示效果
    var _alert = function(msg){
        if ("notify"==errorStyle){
        	var $toast = require("jquery-toast-plugin-wrapper");
        	$toast.toast({
        	    heading: '程序运行错误',
        	    text: msg,
        	    showHideTransition: 'fade',
        	    hideAfter: 5000,	//5秒后自动隐藏
        	    stack : 2,			//最多同时显示两个错误
        	    icon: 'error'
        	});
        }else if ("none"==errorStyle){
        	//Do nothing
        }else{
        	alert(msg);
        }
    }
    
    //页面加载效果
    var $loadingSelector = $(loadingSelector);
    if($loadingSelector.length) $loadingSelector.show();
    $.ajax({
        type: method,
        url: url,
        data: dataObj,
        dataType: dataType,
        success: function(data){
            postedUrls.pop(url);
            successCallback(data);
            if($loadingSelector.length) $loadingSelector.hide();
        },
        error: function(xhr/*XMLHttpRequest对象*/, err/*错误信息*/, errStatus/*（可选）捕获的异常对象*/){
            postedUrls.pop(url);
            if($loadingSelector.length) $loadingSelector.hide();
            var msg = "数据访问错误";
            //检查请求被取消的情况并保持沉默
            if (xhr){
                if (0==xhr.status && "rejected"==xhr.state()){
                    return;
                }
            }

            //处理和显示错误
            var fail;
            if ( xhr && xhr.status && xhr.status>=400 ){
                var status = xhr.status;
                var statusText = xhr.statusText;
                msg += "("+status+"/"+statusText+")";
                var respObj = xhr.responseJSON;
                if (respObj){
                    fail = msg + "\n\n" + JSON.stringify(respObj, null, 4);
                }
                var respTxt = xhr.responseText;
                if (respTxt){
                    fail = msg + "\n\n" + respTxt;
                    try{
                        //处理 CMS 后台抛出的错误对象(com.bokesoft.cms.core.acl.ErrorMessage)
                        var errObj = JSON.parse(respTxt);
                        var errMsg = errObj.message;
                        if (errMsg){
                            if (errMsg.indexOf("ACLException: ")==0){
                                //如果以 ACLException 开头, 那么就说明是权限错误
                                msg = "权限错误: " + errMsg.substr("ACLException: ".length);
                            }else{
                                msg += "\n"+errMsg;
                            }
                        }
                    }catch(ex){
                        //Ignore it
                    }
                }
            }else{
                if (err) {
                    msg += "("+err+")";
                }
                if (errStatus) {
                    msg += ": " + errStatus;
                }
                fail = msg;
            }

            _alert(msg);
            throw fail;
        }
    });
};

var _post = function(url, dataObj, successCallback, options){
	_Ajax(url, "POST", dataObj, successCallback, options);
}
var _get = function(url, dataObj, successCallback, options){
	_Ajax(url, "GET", dataObj, successCallback, options);
}

/** Define the export point for module */
module.exports = {
    post: _post,
    get: _get
}
