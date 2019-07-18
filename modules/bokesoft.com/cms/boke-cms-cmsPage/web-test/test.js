var cmsPage= require("..");
var $= require("jquery");

window.replaceTxtFromLoc = function(){
	var options={
		selector: ".date-list-area",
		htmlstr : $("#htmlStrTpl").html(),
		callback: function(){
			$(".date-list-area .popup-btn-new").click(function(){openDialog();});
		}
	};
	cmsPage.replaceRegion(options);
};

window.replaceTxtFromSer = function(){
	var options={
		selector: ".date-list-area",
		url: "/test-data.action",
		callback: function(text){
			$(".date-list-area .popup-btn-new").click(function(){openDialog();});
		}
	};
	cmsPage.replaceRegion(options);
};

window.openDialog = function(){
	var options={
		popupWidth: 800,
		popupWidth: 600,
		popupTitle: "弹窗标题",
		callback: function(dialog){
			$(dialog.contentSelector).html(
				"<a class='new-dialog-btn' href='javascript:void(0)'>点击再弹出的一层 :)</a>"
				+" | <a class='doClose' href='javascript:void(0)'>关闭</a>");
			$(".new-dialog-btn",dialog.contentSelector).click(function(){
				cmsPage.popupDialog();
			});	
			$(".doClose",dialog.contentSelector).click(function(){
				alert("即将关闭当前对话框 ...");
				dialog.close();
			});				
		}
	};
	cmsPage.popupDialog(options);
};

window.openDialog2 = function(){
	var options={
		popupWidth: 800,
		popupWidth: 600,
		popupTitle: "弹窗标题2",
		callback: function(dialog){
			var options={
				selector: dialog.contentSelector,
				url: "/test-data.action",
				callback: function(text){
					$(".popup-btn-new",dialog.contentSelector).click(function(){
						openDialog();
					});
				}
			};
			cmsPage.replaceRegion(options);		
		}
	};
	cmsPage.popupDialog(options);
	
};
