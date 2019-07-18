var app = require("webpack-dev-web-test");

var sleep = function(milliSecond) {
    var startTime = new Date().getTime();
    while(new Date().getTime() <= milliSecond + startTime) {
        //Yes, do nothing
    }
}

app.start({
    /** The default configuration parameters
      httpPort: 8080,
      wdsPort: 8081,
      wdsPubPath: "web-test",
      webpackCfg: require("./webpack.web-test-config.js")
    */
	target: (process.argv.indexOf("--ie8")>=0)?"IE8":null
}, function(app){
    /** The response for ajax post testing */
    app.post('/test-data.json', function(req, resp) {
        resp.send('{"name": "boke-cms-ajax", "timestamp": '+ (new Date()).getTime() + '}');
    });
    app.post('/test-long-data.json', function(req, resp) {
    	sleep(5000);	//Sleep 5 seconds
        resp.send('{"name": "boke-cms-ajax", "timestamp": '+ (new Date()).getTime() + '}');
    });
    app.post('/test-500.html', function(req, resp) {
    	sleep(500);	//Sleep 0.5 seconds
        throw "500 error for testing";
    });
});
