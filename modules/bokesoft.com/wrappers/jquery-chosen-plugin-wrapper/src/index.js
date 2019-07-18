"use strict";
/* The implementations */
var $ = require("jquery");
if (! window.jQuery) window.jQuery = window.$ = $;

require("chosen-js");
require("chosen-js/chosen.css");
require("./chosen.selectAll.plugin.js");


/** Define the export point for module */
module.exports = {
    chosen: $.chosen
}

