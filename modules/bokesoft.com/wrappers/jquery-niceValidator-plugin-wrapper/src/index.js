"use strict";
/* The implementations */
var $ = require("jquery");
if (! window.jQuery) window.jQuery = $;

require("nice-validator");
require("nice-validator/dist/local/zh-CN.js");     //默认英文
require("nice-validator/dist/jquery.validator.css");

/** Define the export point for module */
module.exports = {
    validator: $.validator
}

