var config = require("webpack-dev-web-test/webpack/webpack-config.js").testConfig();

/**
 * 在默认 webpack 配置上增加 bootstrap 的内容
 */
require("./.webpack/config.js").configWebpack(config);

module.exports = config;
