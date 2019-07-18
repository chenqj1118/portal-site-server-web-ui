var app = require("webpack-dev-web-test");

var fs = require('fs');
var Busboy = require('busboy');
var URL = require('url');

app.start({}, function(app){
	app.post('/upload.action', function(req, resp) {
		var busboy = new Busboy({ headers: req.headers });
		
		var fileName;
		var filePath;
		var downloadUrl;
		var viewUrl;
		var reqUrl = URL.parse(req.url,true).query;
		var testcase = reqUrl.testcase;
		var timestamp = reqUrl.timestamp;
		var fileList = [];
		
		//接受fast-upload的data参数
		busboy.on('field', function (fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
			console.log('Field [' + fieldname + ']: value: ' + val+",mimetype:"+mimetype);
			if("testcase" == fieldname){
				testcase = val;
			}
			if("timestamp" == fieldname){
				timestamp = val;
			}
		});
		
	    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
	    	console.log('Upload File [' + fieldname + ']: filename: ' + filename + ' ...');
			var saveToDir = __dirname + '/web-test/tmp';
	        try{
	        	fs.accessSync(saveToDir, fs.R_OK | fs.W_OK);
	        }catch(ex){
		    	fs.mkdirSync(saveToDir);
	        }
			fileName = filename;
			storefileName = testcase+"-"+(timestamp || '')+"-"+filename;
			filePath = saveToDir+"/"+storefileName;
			downloadUrl = "/web-test/tmp/"+storefileName;
			viewUrl = downloadUrl;			
	        file.pipe(fs.createWriteStream(filePath));
			var file = {
				fileName:fileName,
				filePath:filePath,
				downloadUrl:downloadUrl,
				viewUrl:viewUrl
			};
			fileList.push(file);
	    });
		
	    busboy.on('finish', function() {
			var jsonStr = JSON.stringify(fileList);
	    	resp.send(jsonStr);
	        resp.end();
	    });
	    return req.pipe(busboy);
    });
});

