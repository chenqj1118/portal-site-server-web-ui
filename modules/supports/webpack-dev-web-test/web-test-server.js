/**
 * REF: http://www.boiajs.com/2015/08/25/webpack-dev-server-and-express-server/
 */
 //The dir of main js file
var MAIN_DIR = require('path').dirname(require.main.filename);

var colors = require('colors')
console.log("node version: ".green + process.version);
console.log("  MAIN_DIR  : ".green.bold + MAIN_DIR);
console.log("  __filename: ".green + __filename);
console.log("  __dirname : ".green + __dirname);
console.log("");

/* NOTE: Because the webpack config file (webpack.web-test-config.js) was not loaded at this
         point, so we must require mudules with absolute path.
 */
var webpack = require('webpack'),
	WebpackDevServer = require('webpack-dev-server'),
	proxy = require('proxy-middleware'),
	url = require('url'),
	express = require('express'),
	bodyParser = require('body-parser');

var getWebpackConfig = function(target){
	var config;
	
	//在运行目录下的 “webpack.web-test-config.js” 可以替换默认的 webpack 配置定义
	var mainTestCfgFile = MAIN_DIR+"/webpack.web-test-config.js";
	try{
		var config = require(mainTestCfgFile);
		console.log("Webpack config:\n    ".green.bold + mainTestCfgFile);
		return config;
	}catch(e){
		console.log("Try webpack config failure:\n    ".green.bold + mainTestCfgFile);
		console.log(">>> " + (e+"").yellow );
	}
	
	//默认采用系统内建的配置
	config = require("./webpack/webpack-config.js").testConfig(target);
	return config;
}

var proxyApp = function(app, port, ctxPath){
	var _ctxPath = '/'+ctxPath;
	var _url = 'http://localhost:'+port+'/'+ctxPath;
	console.log(">>> Proxy: "+ _ctxPath + " => " + _url);
	app.use(_ctxPath, proxy(url.parse(_url)));
}

module.exports = {
    /** 启动一个包含测试的 Web 服务器的 webpack-dev-server, 包括对 webpack "auto-refresh" 的支持;
     * 测试的 Web 服务器基于 express 框架, 主要目的是为了配合前端开发实时提供后端服务的模拟实现.
     * 
     * 参数:
     *  - cfg: 配置参数
     *  - appCallback: 启动 express 应用前的回调, 以 "express()" 对象为参数, 可以用于定制 express 应用
     * 
     * cfg 配置参数项及默认值:
     *  - httpPort   : HTTP 端口, 默认会自动检测 8080 之上的可用端口, 也可以使用环境变量 "WEB_TEST_SERVER_PORT" 指定;
	 *  - target     : 项目针对的 js 环境(例如 'vue'、'IE8' 等等), 支持字符串或者字符串数组(多个环境, 比如即支持 vue 又支持 IE8); 可选参数;
     *  - testPubPath: 测试代码(Web 页面)的发布路径, 默认为 "web-test";
     *  - wdsPort    : webpack-dev-server 的 HTTP 端口, 默认从 httpPort+1 开始自动检测可用端口(此端口一般不想要直接访问);
     *  - webpackCfg : Webpack 配置对象;
     *                + 默认情况下首先会搜索当前项目, 即 webpackCfg = require("./webpack.web-test-config.js");
     *                + 如果当前项目下没有 webpack.web-test-config.js, 则直接使用系统默认计算的 webpack 配置(会与 target 相关);
     *  - wdsCfg     : webpack-dev-server 选项, 参考:
     *                + https://github.com/webpack/docs/wiki/webpack-dev-server#api
     *                + https://webpack.js.org/configuration/dev-server/#devserver
	 *  - apiProxys  : Web 请求转发规则, 一般用于开发时解决 API 调用的跨域问题;
	 *                + 格式为 ctxPath~url 属性的对象数组, 例如:
	 *                 - [{
	 *                       ctxPath: "/api/",
	 *                       url: "http://localhost:8080/yigo/cms/"
	 *                   }, {
	 *                       ...
	 *                   }, {
	 *                       ...
	 *                   }]
    */
    start: function(cfg, appCallback) {

        if (! cfg){
            cfg = {};
        }
		var net = require('net');
		/** Start the http and webpack server*/
		var startServer = function (httpPort, wdsPort) {
			var target = cfg.target;
			var testPubPath = cfg.testPubPath || "web-test";
			
            var webpackCfg = cfg.webpackCfg;
            if (! webpackCfg){
                webpackCfg = getWebpackConfig(target);
            }
            
			var wdsPubPath = webpackCfg.output.publicPath;
            if (wdsPubPath.startsWith("/")){
                wdsPubPath = wdsPubPath.substring(1);
            }
            if (wdsPubPath.endsWith("/")){
                wdsPubPath = wdsPubPath.substring(0, wdsPubPath.length-1);
            }

			var app = express();
			
			app.use(bodyParser.urlencoded({ extended: true }));
            
			app.get('/', function (req, resp) {
                resp.send('[webpack-dev-support] It works!')
            });
			proxyApp(app, wdsPort, wdsPubPath);
			if (wdsPubPath != testPubPath){
				proxyApp(app, wdsPort, testPubPath);
			}

			var apiProxys = cfg.apiProxys || [];
			apiProxys.forEach(function(data){
				app.use(data.ctxPath, proxy(url.parse(data.url)));
			});
			
			if (appCallback) {
                appCallback(app);
            }
			
            app.listen(httpPort);
            console.log('>>> Http WebServer listen: ' + httpPort);
			
            var wdsCfg = cfg.wdsCfg || {
                contentBase: MAIN_DIR,
                hot: true,
                quiet: false,
                noInfo: false,
                publicPath: '/'+wdsPubPath+'/',
                stats: { colors: true }
            };
            console.log("ℹ ｢wds｣ Configuration".green.bold+":\n", wdsCfg);
            var server = new WebpackDevServer(webpack(webpackCfg), wdsCfg)
                .listen(wdsPort, 'localhost', function() {
                    console.log('>>> WebpackDevServer socketio listen: ' + wdsPort)

                    var httpPortStr = (""+httpPort);
                    var spaceCount = 12-httpPortStr.length;
                    var space = "";
                    for (var i=0; i<spaceCount; i++){
                    	space += " ";
                    }
                    console.log("\n  ################################################################".green.bold);
                    console.log("  ###                                                          ###".green.bold);
                    console.log("  ###     ".green.bold,
                    		    "Access test html page from ",
                    		    "HTTP Port ".bold.green + httpPortStr.bold.underline.yellow,
                    		    space, "###".green.bold);
                    console.log("  ###                                                          ###".green.bold);
                    console.log("  ################################################################\n".green.bold);
                });
            
        };

		var allocPort = function(from, to, callback){
			var port = from;
			if(port <= to){
				var server = net.createServer().listen(from);
				server.on('listening', function(){
					server.close();
					console.log(">>> Available port '"+port+"' found.");
					callback(port);
				});
				server.on('error', function(err){
					if(err.code === 'EADDRINUSE'){
						allocPort(port+1, to, callback);
					}
				});
			}else{
				//Max port number reached, can't allocate port ...
				throw new Error("No available port .");
			}
		};
		
		if (!cfg.httpPort){
			//Detect port number from environment variable "WEB_TEST_SERVER_PORT"
			if(process.env.WEB_TEST_SERVER_PORT && Number(process.env.WEB_TEST_SERVER_PORT) <= 65535){
				cfg.httpPort = Number(process.env.WEB_TEST_SERVER_PORT);
			}
		}
		
        if(cfg.httpPort){
        	allocPort(cfg.httpPort+1, 65535, function(wdsPort){
        		startServer(cfg.httpPort, wdsPort);
        	});
        }else {
        	allocPort(8080, 65535, function(httpPort){	/*find available HTTP port from 8080*/
        		allocPort(httpPort+1, 65535, function(wdsPort){
        			startServer(httpPort, wdsPort);
            	});
        	});
        }
    }
};
