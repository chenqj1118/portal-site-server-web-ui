var upload= require("..");
var $ = require("jquery");
var uploadUrl = '/upload.action';

function afterDo(fileData){
	console.log(fileData);//可以在此处定制文件名称 和 文件路径的显示位置；
}
var uploadOptions1 = {
		$uploadFileShow:$("#testcase1 .upload-file-show"),
		$uploadBtn:$("#testcase1 .upload-button"),
		uploadAction: uploadUrl,
		uploadType: 'image',  //image or file
		multiple: true,     //是否支持多文件上传。默认为 false。
		showFileName: true,  //是否显示文件名称
		showlocalPath: true,  //是否显示文件本地路径 
		parameters:{testcase:1,fileSizeLimit:'1G',storageArea:'',entityId:''},
		successCallBack:afterDo
};
upload.defaultInit(uploadOptions1);


var uploadOptions2 = {
		$uploadArea: $("#testcase2 .upload-area"),
		uploadAction: uploadUrl,
		uploadType: 'file',
		multiple: true,
		showlocalPath:true
};
upload.defaultInit(uploadOptions2);



var img_custom_successCallBack = function(){
	var newUpArea = $($("#img-upload-tmpl").html());
	$("#testcase5").append(newUpArea);
	var timestamp = new Date().getTime();
	var addUploadOptions = {
		$uploadArea: newUpArea,
		uploadAction: uploadUrl,
		uploadType: 'image',
		successCallBack:img_custom_successCallBack,
		parameters:{testcase:5,timestamp:timestamp}
	};
	upload.defaultInit(addUploadOptions);
}
img_custom_successCallBack();








