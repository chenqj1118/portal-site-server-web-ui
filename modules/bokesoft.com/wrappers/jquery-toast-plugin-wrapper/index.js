var $ = require("jquery");

//jquery-toast-plugin is an old style jquery plugin and depends on window.jQuery directly.
if (! window.jQuery) window.jQuery = $;
require("jquery-toast-plugin");
//MUST load the css manually
require("jquery-toast-plugin/src/jquery.toast.css");

/** Define the export point for module */
module.exports = {
	toast: $.toast
}
