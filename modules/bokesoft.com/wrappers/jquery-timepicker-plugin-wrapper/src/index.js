"use strict";
/* The implementations */
var $ = require("jquery");
if (! window.jQuery) window.jQuery = $;

require("jquery-ui");
require("jquery-ui/ui/widgets/datepicker.js");
require("jquery-ui/ui/widgets/slider.js");

require("jquery-ui/themes/base/datepicker.css");
require("jquery-ui/themes/base/theme.css");
require("jquery-ui/themes/base/slider.css");

require("jquery-ui-timepicker-addon");
require("jquery-ui-timepicker-addon/dist/jquery-ui-timepicker-addon.min.css");



/** Define the export point for module */
module.exports = {
    timepicker: $.timepicker,
	datetimepicker: $.datetimepicker
}

