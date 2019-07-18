"use strict";
/* The implementations */
var $ = require("jquery");
if (! window.jQuery) window.jQuery = $;

var json = require("JSON2");
require("cxselect");


/** Define the export point for module */
module.exports = {
    cxSelect: $.cxSelect
}
