var json = require("JSON2");

var app = require("webpack-dev-web-test");

var testdata = json.stringify([
	{title:"js深入学习与放弃",price:"￥45",publishtime:"2012-12-3"},
	{title:"Learn yourself!",price:"￥178",publishtime:"2015-11-3"},
	{title:"java框架深入讲解",price:"￥38",publishtime:"2014-12-3"},
	{title:"前端的发展趋势与展望",price:"￥98",publishtime:"2015-12-23"},
]);

var sleep = function(milliSecond) {
    var startTime = new Date().getTime();
    while(new Date().getTime() <= milliSecond + startTime) {
        //Yes, do nothing
    }
}

app.start({}, function(app){
    /** The response for ajax post testing */
    app.post('/test-data.json', function(req, resp) {
    	var data = json.parse(testdata);

    	var pn = req.body.pageNo;
    	if (pn){
        	for (var i=0; i<data.length; i++){
        		data[i].title += "(第"+(parseInt(pn)+1)+"页)";
        	}
    	}
		sleep(1000);	//Sleep 5 seconds
    	var result={
			pageNo: parseInt(pn)||0,
			pageSize: 4,
			pageCount: 50,
			totalRecords: 200,
			data: data
		};
        resp.send(result);
    });
});
