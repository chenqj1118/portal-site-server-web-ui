"use strict";

/* The implementations */
var $ = require("jquery");
if (! window.jQuery) window.jQuery = $;
require("ztree");
require("./ztree-multiselect.js");
require("./ztree-radioselect.js");
require("ztree/css/zTreeStyle/zTreeStyle.css");


/** Define the export point for module */
module.exports = {
    zTree: $.zTree,
	multiselect: $.multiselect
}
