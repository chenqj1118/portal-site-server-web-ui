/**
 * IE8 support;
 * see also:
 *     - https://github.com/webpack/style-loader/issues/42
 *     - https://github.com/coderwin/ES5Shim4Webpack
 *     - https://github.com/es-shims/es5-shim
 */
require('es5-shim');

/**
 * Import bootstrap
 */
var bootstrap = require("..");
