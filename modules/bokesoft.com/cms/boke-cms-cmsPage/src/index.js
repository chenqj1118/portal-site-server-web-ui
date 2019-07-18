"use strict";
/* The implementations */
var $ = require("jquery");
require("./css/style.css")

var popupSequence = 0;  //用于产生不重复的弹出对话框序号，从而支持在一个页面产生多个弹出对话框
var popupZIndex = 9000;    //第一层弹出对话框的 z-index
/**
 * 使用从服务器端获取的内容替换当前页面的某个区域
 * @param options 
 *   - selector: CSS 选择符, 用于指定一个待刷新的区域(注意：该节点本身并不会被替换掉)；
 *   - htmlstr: 当前页面的html片段,可选，htmlstr || url；
 *   - url : ajax 后台处理程序(url),可选，htmlstr || url；
 *   - data : url 的条件参数, JSON 格式；
 *   - callback : 回调函数, 定义为 function(htmlText), 可选;
 */
var replaceRegion = function(options){	
    var $selector = $(options.selector);
	var data = options.data || {};
	var htmlstr = options.htmlstr;
	var loadingIcon = options.loadingIconUrl || require("./images/loading.gif");
	
	$selector.css("position","relative").empty()
			 .append("<div class='boke-cms-ajax-loading'><img src='"+loadingIcon+"'/></div>"
					+"<div class='boke-cms-ajax-content'></div>");
	var $selectorContent = $selector.find(".boke-cms-ajax-content");
	
	if(!htmlstr){
		var ajax = require("boke-cms-ajax");
		ajax.post(
			options.url,data,
			function(htmlText){			
				$selectorContent.html(htmlText);
				options.callback && options.callback(htmlText);					
			},{dataType:"text",loadingSelector: ".boke-cms-ajax-loading"}
		);
	}else{
		$selectorContent.html(htmlstr);
		options.callback && options.callback(htmlstr);
	}


}

 
/**
 * 弹出指定大小的对话框区域, 返回可用于显示区域的 selector 字符串
 * @param options 
 *   - popupWidth: 弹出层宽，可选，默认500px；
 *   - popupHeight: 弹出层高，可选，默认500px；
 *   - popupTitle: 弹窗标题；
 *   - notClose:  关闭:实质为隐藏弹出层，默认是false,remove弹出层；
 *   - callback : 回调函数, 定义为 function(dialogObject), 可选;
 */ 
//var popupDialog = function(popupWidth, popupHeight, callback, notClose){
var popupDialog = function(options){	
	popupSequence = popupSequence + 1;
	var popupContentId = "popupContent_" + popupSequence,
		grayLayerId = "grayLayer_" + popupSequence,
		popupLayerId = "popupLayer_" + popupSequence;
		
	var options = options || {};
	var popupWidth = options.popupWidth || 500,
		popupHeight = options.popupHeight || 500,
		notClose = options.notClose || false;
		
	var titleStr = options.popupTitle ? "<h3 class='popupTitle'><span>"+options.popupTitle+"</span></h3>" : "";
	var str = "<div class='grayLayer' id='"+grayLayerId+"' style='z-index:"+popupZIndex+"'></div>"
			+ "<div class='popupLayer' id='"+popupLayerId+"' style='z-index:"+(popupZIndex+1)+"'>"
			+ titleStr
			+ "    <a class='close'></a>"
			+ "    <div class='popupContent' id='"+popupContentId+"'></div>"
			+ "</div>"; //在页面body后面添加html片段
	$("body").append(str);
	popupZIndex = popupZIndex+2;    //一次弹出消耗两个 z-index, 分别对应 grayLayer 和 popupLayer
	
	var $dialogMain = $("#" + popupLayerId),
		$dialogAll = $("#" + grayLayerId+",#" + popupLayerId);
	$dialogMain.width(popupWidth).height(popupHeight);
	$dialogAll.fadeIn("slow");	

	var resetPositon = function(){
		var difHeight = $(window).height() - popupHeight, 
			difWidth = $(window).width() - popupWidth, 
			popupLayerTop = (difHeight <= 0) ? 0 : difHeight/2,  
			popupLayerLeft = (difWidth <= 0) ? 0 : difWidth/2;  
		$dialogMain.css({top:popupLayerTop, left:popupLayerLeft});//将弹出层居中显示        
	}
	var popupLayer_close = function(){//关闭弹出窗口即移除 body后面添加的html代码
		$dialogAll.remove();
		popupZIndex = popupZIndex - 2;
	}
	var popupLayer_hide = function(){
		$dialogAll.fadeOut("slow");
	}
	var popupLayer_show = function(){
		$dialogAll.fadeIn("slow");
	}

	resetPositon();//设置弹出层位置
	
	var movedTo=function($dialogMain){
		var _move = false, _x, _y;
		$dialogMain.find(".popupTitle").mousedown(function(e){
			_move=true;
			_x=e.screenX-parseInt($dialogMain.css("left"));
			_y=e.screenY-parseInt($dialogMain.css("top"));
			$dialogMain.addClass("moving");   //加一个“移动中...”的标记
		});
		$(document).mousemove(function(e){
			if(_move){
				var x=e.screenX-_x,//移动时根据鼠标位置计算控件左上角的绝对位置
					y=e.screenY-_y,
					w_x=$(window).width(),
					w_h=$(window).height(),
					minL=0,minT=0,
					maxL=w_x-$dialogMain.width()+minL,
					maxT=w_h-$dialogMain.height()+minL;
				if(x < minL){x = minL;}else if(x > maxL){x = maxL;}
				if(y < minT){y = minT;}else if(y > maxT){y = maxT;}			
				$dialogMain.css({top:y, left:x});//控件新位置
			}
		}).mouseup(function(){
			_move=false;
			$dialogMain.removeClass("moving");
		});
	};
	
	options.popupTitle && movedTo($dialogMain);
	
	var dialogObject = {
		contentSelector: "#"+popupContentId, 
		close: popupLayer_close, 
		hide: popupLayer_hide, 
		show: popupLayer_show
	};
	options.callback && options.callback.apply(window, [dialogObject]);
	
	$(window).resize(function(){
		resetPositon();
	})//自适应浏览器窗口大小        
	
	$dialogMain.find("a.close").click(function(){//点击关闭按钮关闭弹出层
		if(true === notClose){
			popupLayer_hide();
		}else{
			popupLayer_close();
		} 
	})

	return {
		getGrayLayerSelector:function(){
			return "#"+grayLayerId;
		},
		getPopupLayerSelector:function(){
			return $dialogMain;
		},
		getDialog:function(){
			return dialogObject;
		}
	}
}


/** Define the export point for module */
module.exports = {
    replaceRegion: replaceRegion,
	popupDialog: popupDialog
}

