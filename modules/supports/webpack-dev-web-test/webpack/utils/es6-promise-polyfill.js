/**
 * Promise polyfill to support IE11, The chunk loading function need Promise.
 */
if (!window.Promise){
	require('es6-promise').polyfill();
}
