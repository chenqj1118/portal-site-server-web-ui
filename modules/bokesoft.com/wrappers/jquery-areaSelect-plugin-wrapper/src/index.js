/**
 * 基于 ;
 */

"use strict";

window.$ = window.jQuery = require("jquery");
var json = require("JSON2");
require("./areaSelect");


function defaultInit(options){
	this.areaSelect(options);
}


/** Define the export point for module */
module.exports = {
        defaultInit: defaultInit
}

