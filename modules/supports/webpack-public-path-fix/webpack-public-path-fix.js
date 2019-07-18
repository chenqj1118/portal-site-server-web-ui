/**
 * Detect '__webpack_public_path__' dynamiclly in web browser .
 */
module.exports = {
    /**
     * Detect webpack "publicPath" dynamiclly from "<script/>" tag in current html document.
     * 
     * Example: __webpack_public_path__ = require("webpack-public-path-fix").detect("/dist/");
     * 
     * @param publicPath The "sample" publicPath to detect, default is "/dist/"
     */
    detect: function(publicPath) {
    	publicPath = publicPath || "/dist/";	// 默认情况下 publicPath 一般是 "/dist/"
    	
    	if (! window || ! window.document){
    		throw "'webpack-public-path-fix' could only use in browser";
    	}
    	var scripts = document.getElementsByTagName('script');
        var len = scripts.length
        for(var i =0; i < len; i++) {
        	var src = scripts[i].src;
            if(src.indexOf(publicPath) > 0) {
                var result = src.substring(0, src.indexOf(publicPath)+publicPath.length);
                return result;
            }
        }
        return publicPath;
    }
};
