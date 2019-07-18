/**
 * Detect "publicPath" dynamiclly
 */
//TODO 确定对 <img src="${require('../../images/vue-filterbuilder.png')}" width="640px"/> 这类写法没有作用
__webpack_public_path__ = require("webpack-public-path-fix").detect("/dist/");


import $ from 'jquery'
window.$ = $
window.jQuery = $
export default $