var ajax = require("../src/index");
var $ = require("jquery");
window.doTest = function(){
    ajax.post("/test-data.json", {}, function(json){
        $("#console").text("Name: "+json.name+"; timestamp: "+json.timestamp);
    });
}

window.doLongTest = function(){
    ajax.post("/test-long-data.json", {}, function(json){
        $("#console").text("Name: "+json.name+"; timestamp: "+json.timestamp);
    });
}
window.doLongTest2 = function(){
    ajax.post("/test-long-data.json", {}, function(json){
        $("#console").text("Name: "+json.name+"; timestamp: "+json.timestamp);
    }, {loadingSelector: ".loading2"});
}
window.doLongTestNone = function(){
    ajax.post("/test-long-data.json", {}, function(json){
        $("#console").text("Name: "+json.name+"; timestamp: "+json.timestamp);
    }, {loadingSelector: ".none-loading"});
}

window.do500Error = function(){
    ajax.post("/test-500.html", {}, function(json){
        $("#console").text("Error NOT raised!");
    });
}
window.do404Error = function(){
    ajax.post("/test-404.html", {}, function(json){
        $("#console").text("Error NOT raised!");
    });
}

window.do500ErrorNotify = function(){
    ajax.post("/test-500.html", {}, function(json){
        $("#console").text("Error NOT raised!");
    }, {errorStyle: "notify"});
}
window.do404ErrorNotify = function(){
    ajax.post("/test-404.html", {}, function(json){
        $("#console").text("Error NOT raised!");
    }, {errorStyle: "notify"});
}
window.do500ErrorNone = function(){
    ajax.post("/test-500.html", {}, function(json){
        $("#console").text("Error NOT raised!");
    }, {errorStyle: "none"});
}
window.do404ErrorNone = function(){
    ajax.post("/test-404.html", {}, function(json){
        $("#console").text("Error NOT raised!");
    }, {errorStyle: "none"});
}


window.doTextTest = function(){
    ajax.post("/test-data.json", {}, function(data){
        $("#console").text("返回值数据类型:"+typeof(data)+"; / text:'"+data+"'");
    },{dataType:"text"});
}
window.doJsonTest = function(){
    ajax.post("/test-data.json", {}, function(data){
        $("#console").text("返回值数据类型:"+typeof(data)+"; / json:"+data);
    });
}
