/**
 * 基于 fast-upload 的文件上传功能封装, 包括对图片上传后显示、文件类型图标、上传进度等的支持;
 */

"use strict";

var $ = require("jquery");
require("es5-shim");
require("./style.css");
var json = require("JSON2");
var FastUpload = require('fast-upload');
var fileTypes = require("../boke-cms-file-types");


/**
 * 上传页面对象初始化, 包含默认的 error, success, progress 处理.
 * 
 * 显示结构以及使用的 CSS 元素包括:
 *  - Class
 *   * .upload-progress 用于定位上传进度区域
 *   * .upload-img 上传成功后显示图片的 IMG 标签
 *   * .file-content 上传成功后显示文件信息的区域
 * 
 * 要求后台上传的服务支持如下特性：
 *  - 上传成功后返回的数据是 json 格式，包括如下内容：
 *   * List<File>: {[File],[File],...}
 *     * File属性
 *           - fileName: 文件名，不带路径，一般是上传的文件原名，与后台存储文件名无关;
 *           - fileSize: 上传文件的大小;
 *           - filePath: 文件上传后存储的路径(取决于后台实现，一般是相对路径)，通常，业务代码存储附件位置使用这个值;
 *           - fileUrl: 文件从服务器下载的 URL & 文件网页显示的 URL, 是基于当前 Web 上下文路径的相对路径;
 *
 * @param options - 选项
 *  - uploadAction 文件上传 URL, 注意, 此 URL 不需要考虑拼接上 ctxPath，甚至可以是一个与 ctxPath 无关的绝对路径
 *  - uploadType 控制是否只能上传图片,默认file
 *    -- image 上传图片,只能上传图片格式的文件;
 *    -- file 上传文件,可以上传所有格式的文件;
 *  - parameters uploadUrl 的附加参数, js 对象(Map), 可以为空;
 *        例如 {token: '0dd1c613231416da0157f095ae747ff2ac7558dd', storgeArea: 'GP_ROLE'}
 *  - $uploadArea 处理上传文件的区域(DOM 元素), 其中可以包含内部 $uploadFileShow、$uploadBtn、$localPath、$nameElm 等元素
 *  - $uploadFileShow 上传结果显示区域(DOM 元素), 同时也用于显示上传的进度条, 需要指定，或者使用默认值 $($uploadArea).find(".show-div");
 *        如果上传的是文件, 此处显示类型图标及文件名(链接), 并可以通过链接下载;
 *        如果上传的是图片, 此时显示图片，也支持点击图片打开新窗口显示大图;
 *  - $uploadBtn 上传按钮(DOM 元素), fast-upload 要求必须使用 “A” 标签，其他元素暂不支持;
 *        需要指定，或者使用默认值 $($uploadArea).find(".upload-button");
 *  - $localPath 记录上传结果中 filePath 的 DOM 元素;
 *        可选, 支持使用默认值 $($uploadArea).find(".local-path");
 *  - $nameElm 成功后, 显示文件名的区域(DOM 元素), 通常用于图片上传后显示图片文件名(因为此时 $uploadFileShow 只显示图片);
 *        可选, 支持使用默认值 $($uploadArea).find(".file-name");
 *  - ctxPath 前 Web 上下文路径, 用于和后台返回结果中的 fileUrl 合成一个绝对路径
 *  - successCallBack 自定义上传 success 的处理, 参数为后台返回的上传成功 json 对象, 可选;
 *        返回 true 代表忽略后续的默认处理
 *  - errorCallBack 自定义上传 error 的处理, 参数为错误数据, 可选;
 *        返回 true 代表忽略后续的默认处理
 */
var defaultInit = function(options){
    //从options中获取必要的参数
    var $uploadArea = options.$uploadArea,
		$uploadFileShow = options.$uploadFileShow || $($uploadArea).find(".upload-file-show"),
		$uploadBtn = $(options.$uploadBtn || $($uploadArea).find(".upload-button")),
		acceptType = (options.uploadType || 'file') == "image" ? "image/jpg,image/jpeg,image/png,image/gif,image/bmp":"*";
	
	var parameters = options.parameters || {};
	parameters.storageArea = parameters.storageArea || ''; 
	parameters.entityId =  parameters.entityId || '';

	/**
	*  显示进度条的封装方法
	*  @param $uploadFileShow         上传结果显示区域(DOM 元素)
	*  @param percent                 当前进度百分比
	*/
	var _showProgress = function($box, percent){
		var circleR = 30; //半径
		var _renderTextNumPercent = function (uploadPercent) {
			var percentFloatNum = uploadPercent / 100,
				perimeter =  Math.PI * 2 *circleR;
			$("#circle2").attr("stroke-dasharray", perimeter * percentFloatNum + " " + perimeter * (1- percentFloatNum));
		}	
		if ($box.find(".upload-progress").length == 0){  
			var svgTpl =
				"<text class='percentNum' x='28' y='44'>"+percent+"%</text>" +
				"<circle cx='40' cy='40' r='"+circleR+"' stroke-width='3' stroke='#C9CACA' fill='none'></circle>" +
				"<circle id='circle2' cx='40' cy='40' r='"+circleR+"' stroke-width='3' stroke='#E73468' fill='none'></circle>";
			var str = '<div class="upload-progress"><svg class="precent">'+svgTpl+'</svg></div>'
			$box.html(str);
			_renderTextNumPercent(percent);
		}else{
			$box.find(".percentNum").text(percent+'%');
			_renderTextNumPercent(percent);
		}
	}	
	
		
    var uploader = new FastUpload({
        trigger: $uploadBtn,
        name: "uploadBtn",
        action: options.uploadAction,
        accept: acceptType,
        multiple: options.multiple || false,
        data: parameters,
        error: function(errData) {
            if (options.errorCallBack){
                var skip = options.errorCallBack(errData);    //callback 返回 true 代表忽略后续默认处理
                if (skip) return;
            }
            alert("上传错误: \n" + json.stringify(errData));
        },
        success: function(response) {
			var returnData = null;
            if (typeof(response)=="string"){
                //在 IE8 下返回的字符串类似 "<PRE>{"fileName":"XXX.png","url":"/XXXXX-XXXX-XXXXX.XXX.png"}</PRE>"
                response = response.replace(/^<PRE>/i, "").replace(/<\/PRE>$/i, "");
				returnData = json.parse(response);
			}else{
                returnData = response;
            }
			
            if (options.successCallBack){
                var skip = options.successCallBack(returnData);    //callback 返回 true 代表忽略后续默认处理
                if (skip) return;
            }
            //默认行为
            $($uploadFileShow).empty();
            var reImg = new RegExp(/.*(bmp|gif|jpeg|jpg|png|svg|tiff|tif|icon|ico)$/i);
			
            //因为非多文件上传(multiple:false),所以去list[0],第一个返回值就好
			for(var i = 0; i < returnData.length; i++){
				var file = returnData[i],
					fileName = file.fileName,
					fileSize = file.fileSize,
					fileUrl = file.downloadUrl;
				var _isImage = reImg.test(fileName);
				
				var str = "";
				if (options.uploadType == "image"){
					if(!_isImage){
						alert("请上传图片类型！");
						return;
					}
					//如果是图片
					$uploadFileShow.addClass("image-list");
					str = '<a target="_blank" class="image-item" href="'+fileUrl+'">'
								+'<img src="'+fileUrl+'" title="'+fileName+'" data-fileSize="'+fileSize+'" />'
							  +'</a>'
				}else{
					//附件
					$uploadFileShow.addClass("file-list");
					var fileIcon = fileTypes.getFileIcon(fileName);
					str = "<a href='"+fileUrl+"' target='_blank'>"
								+"<img class='file-icon' src='"+fileIcon+"'/>"
								+"<span>"+fileName+"</span>"
							   +"</a><span class='fileSize'> ("+fileSize+") </span>";
				}
				if(options.showFileName){
					str = str + '<div class="upload-file-name"><a href="'+fileUrl+'" target="_blank">'+(options.fileName || fileName)+'</a></div>';
				}
				if(options.showlocalPath){
					str = str + '<div class="upload-local-path">'+file.filePath+'</div>';
				}
				str = '<div class="file-item">'+str+'</div>';			
				$($uploadFileShow).append(str);				
			}
        },        
        progress: function(event, position, total, percent, files) {
            //uploadprogress先获取一次没有就创建,因为progress第一次是是没有的,而后面监听时,upload-progress(DOM)是存在的
            _showProgress($uploadFileShow, percent);
            if (percent>=100){
                //如果已经到了 100%, 那么需要删除这个对象
                setTimeout(function(){                        
                    $(".upload-progress", $uploadFileShow).remove();
                }, 200);
            }
        }
    });
}

/** Define the export point for module */
module.exports = {
        defaultInit: defaultInit
}

