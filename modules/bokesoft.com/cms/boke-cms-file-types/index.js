"use strict";

var types = require("./data/data.js");

var endsWith = function(str, postfix){
	if (str && postfix){
		var idx = str.indexOf(postfix);
		if (idx>=0){
			return idx == str.length-postfix.length;
		}else{
			return false;
		}
	}else{
		return false;
	}
}

var _getFileIcon = function(fileName, defIcon){
	if (fileName && fileName.indexOf(".")>=0){
		fileName = fileName.toLowerCase();
		for (var ext in types){
			if (endsWith(fileName, ext)){
				return types[ext];
			}
		}
	}
	//Can't find, so give the default value
	return defIcon;
}

var getFileIcon = function(fileName){
	return _getFileIcon(fileName, types["*"]);
}

var getImageIcon = function(fileName){
	return _getFileIcon(fileName, types["*image*"]);
}

module.exports = {
	getFileIcon: getFileIcon,
	getImageIcon: getImageIcon
}