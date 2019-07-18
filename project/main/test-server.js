var app = require("webpack-dev-web-test");

app.start({
	webpackCfg: require("./webpack.config.js"),	//此处不需要 	target:"vue" , 因为在 webpack.config.js 会定义这个 target
	apiProxys: [{
		ctxPath: "/estore",
		url: "http://localhost:8080/estore"
	}],
	testPubPath: 'test-static'
}, function(app){
	

	//app.post('/index_floors_data.json', function(req, resp) {
	//	resp.send(require("./test-static/index/index_floors_data.json"));
	//});

});
