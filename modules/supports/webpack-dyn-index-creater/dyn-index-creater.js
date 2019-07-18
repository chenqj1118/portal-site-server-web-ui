/**
 * Build index.js, define `window._require` to make modules require dynamicly.
 */
var fs = require('fs');
var path = require('path');

var mkdirs = function(dirpath, mode, callback) {
    fs.exists(dirpath, function(exists) {
        if(exists) {
            callback(dirpath);
        } else {
            //try to make parent first, the current level
            mkdirs(path.dirname(dirpath), mode, function(){
                fs.mkdir(dirpath, mode, callback);
            });
        }
    });
};

var splitNameFromPath = function(pathStr){
    var lastSP = pathStr.lastIndexOf("/");
    if (lastSP<0){
        //only name
        return pathStr;
    }else if (lastSP==module.length-1){
        //the last is "/"
        pathStr = pathStr.substring(0, pathStr.length-1);
        return splitNameFromPath(pathStr);
    }else{
        return pathStr.substring(lastSP+1, pathStr.length);
    }
};

var splitFullNameFromPath = function(pathStr){
	if (! pathStr.startsWith("../")){
		//不是相对目录指定的模块, 没有 fullName
		return null;
	}
	//去掉最后面的 "/"
    var lastSP = pathStr.lastIndexOf("/");
    if (lastSP==module.length-1){
    	//the last is "/"
        pathStr = pathStr.substring(0, pathStr.length-1);
    }
	//去掉最前面的多个 "../"
    pathStr = pathStr.replace(/^(\.\.\/)+/g, "");
    //如果发现是以 ”modules/“ 开头, 那么就可以看作一个全名的模块
    if (pathStr.startsWith("modules/")){
        return pathStr.substring("modules/".length);    	
    }else{
    	return null;
    }
};

var _require = function(requires, callback){
    var MAX_REQUIRES_LENGTH=20; //Can require more then 20 modules in one statement
    if (! requires) requires="";

    //Check isArray, compatible with IE8
    var isArray = false;
    if (Array.isArray){
        isArray = Array.isArray(requires);
    }else{
        isArray = (Object.prototype.toString.call(requires) == "[object Array]");
    }

    if (isArray){
        var length = requires.length;
        if (length > MAX_REQUIRES_LENGTH){
            throw "Can't require more then "+MAX_REQUIRES_LENGTH+" modules in one '_require(...)' statement";
        }
        var moduleArray = [];
        _do_require(requires, moduleArray, callback);
    }else{
        _require_raw(requires, callback);
    }
};

var _do_require = function(requires, moduleArray, callback){
    if (moduleArray.length == requires.length){
        var m = moduleArray;
        callback(m[0], m[1], m[2], m[3], m[4], m[5], m[6], m[7], m[8], m[9],
                 m[10],m[11],m[12],m[13],m[14],m[15],m[16],m[17],m[18],m[19]);
    }else{
        _require_raw(requires[moduleArray.length], function(module){
            moduleArray[moduleArray.length] = module;
            _do_require(requires, moduleArray, callback);
        });
    }
};

module.exports = {
    /**
     * 创建一个支持动态(_require(...)方式)引用 javascript 模块的 javascript 文件;
     * @param: cfg - 配置项
     *      - indexJsPath: 创建的 javascript 文件名, 默认是 "src/index.js"
     *      - chunkArrays: String[] 的数组, 按照代码的 “chunk” 进行组织;
     *                     例如:
     *                         [
     *                             ["jquery", "file:../../modules/error-msg"],
     *                             [...],
     *                             [...]
     *                         ];
     *                     注意: 相对路径是以 `indexJsPath` 为基准的.
     */
    build: function(cfg) {
        //The dir of main js file
        var mainDir = path.dirname(require.main.filename);

        if (! cfg){
            cfg = {};
        }

        var indexJsPath = cfg.indexJsPath || "src/index.js";
        var chunkArrays = cfg.chunkArrays || [];

        var dir2mk = path.dirname(mainDir + "/" + indexJsPath);
        mkdirs(dir2mk, 0777, function(folder){
            console.log(">>> Folder created: "+dir2mk);
            var allDeps = [];   //Store all dependencies for modify package.json on the fly

            var buffer = '"use strict";\n'
                       + '\n'
                       + '/*Created by `webpack-dyn-index-creater*/\n'
                       + 'var _require_raw = function(moduleName, callback){\n';
            for (var i=0; i<chunkArrays.length; i++){
                var chunk = chunkArrays[i];
                
                //Make "file:../" the same as "../"
                for (var j=0; j<chunk.length; j++){
                	var module = chunk[j];
                    if (module.startsWith("file:../")){
                    	chunk[j] = module.substring("file:".length);
                    }
                }
                
                //Because index.js was created in "src" folder, so the relative path must add ".."
                var srcChunks = [];
                for (var j=0; j<chunk.length; j++){
                    var module = chunk[j];
                    if (module.startsWith("../")){
                        module = "../" + module;
                    }
                    srcChunks[srcChunks.length] = module;
                }
                var chunkStr = JSON.stringify(srcChunks);

                //Create code to refer every module
                for (var j=0; j<chunk.length; j++){
                    var module = chunk[j];
                    allDeps[allDeps.length] = module;
                    console.log("  >> Chunk: "+chunkStr+", Module="+module);
                    var moduleName = splitNameFromPath(module);
                    var fullModuleName = splitFullNameFromPath(module);
                    //由于 index.js 始终产生在当前目录的 "src" 子目录下, 所以对于 "../" 开头的相对路径, 需要再增加一层父目录
                    if (module.startsWith("../")){
                        module = "../" + module;
                    }
                    buffer = buffer + "\n"
                           + '    if ("'+moduleName+'"==moduleName){\n'
                           + '        require.ensure('+chunkStr+', function(require) {\n'
                           + '            if(callback) callback(require("'+module+'"));\n'
                           + '        });\n'
                           + '        return;\n'
                           + '    }'
                   if (fullModuleName && fullModuleName!=moduleName){
                       buffer = buffer + "\n"
                       + '    if ("'+fullModuleName+'"==moduleName){\n'
                       + '        require.ensure('+chunkStr+', function(require) {\n'
                       + '            if(callback) callback(require("'+module+'"));\n'
                       + '        });\n'
                       + '        return;\n'
                       + '    }'
                   }
                }
            }
            buffer = buffer + "\n";

            buffer = buffer + "\n"
                   + '    throw "Unknown module name: "+moduleName;\n';
		    buffer = buffer + '\n}\n';
		    buffer = buffer + "\n" + "var _do_require=" + _do_require.toString() + "\n";
		    buffer = buffer + "\n" + "window._require = " + _require.toString() + "\n";
		    fs.writeFile(indexJsPath, buffer, function(e){
		        if(e) {
		            throw e;
		        }else{
		            console.log(">>> Index created: "+indexJsPath);
		        }
		    });

	        //Check dependencies in package.json
	        var json = fs.readFileSync('package.json', 'utf-8');
	        var packageObj = JSON.parse(json);
	        var dependencies = packageObj.dependencies;
	        if (!dependencies){
	            dependencies = {};
	            packageObj.dependencies = dependencies;
	        }
	        for (var i=0; i<allDeps.length; i++){
	            var dep = allDeps[i];
	            if (dep.startsWith("../")||dep.startsWith("file:../")){
	                //The module from relative path
	                //Do nothing
	            }else{
	                //The module from npm repo - must defined in package.json
	                if (! dependencies[dep]){
	                    throw "Module '"+dep+"' MUST define in package.json as 'dependencies'";
	                }
	            }
	        }
	        console.log(">>> package.json checking passed.");

        });
    }
};
