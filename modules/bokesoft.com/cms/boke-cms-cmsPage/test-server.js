var app = require("webpack-dev-web-test");

var sleep = function(milliSecond) {
    var startTime = new Date().getTime();
    while(new Date().getTime() <= milliSecond + startTime) {
        //Yes, do nothing
    }
}

app.start({}, function(app){
    /** The response for ajax post testing */
    app.post('/test-data.action', function(req, resp) {
		sleep(1000);	//Sleep 5 seconds
        resp.send('这是后台返回的字符串！这是后台返回的字符串！<button class="popup-btn-new">弹出新窗口</button>');
    });	
});