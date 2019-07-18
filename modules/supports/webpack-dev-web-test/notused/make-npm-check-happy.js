/**
 * npm-check should say some packages like 'webpack-cli' are "NOTUSED", so 'npm-check -u' should ignore then.
 * make it happy.
 */
if ((new Date()).getTime() == 0){ //Yes, it's always FALSE
	require("@babel/core");
	require("@babel/preset-env");
	require("blueimp-tmpl");
	require("blueimp-tmpl-loader");
	require("es5-shim");
	require("file-loader");
	require("html-loader");
	require("html-webpack-plugin");
	require("html-withimg-loader");
	require("imports-loader");
	require("less");
	require("less-loader");
	require("node-sass");
	require("sass-loader");
	require("style-loader");
	require("url-loader");
	require("vue-template-compiler");
	require("webpack-cleanup-plugin");
	require("webpack-cli");
}
