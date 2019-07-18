var pagination= require("..");
var $= require("jquery");
var tpl = require("./tpl.html");




window.doTest = function(){
	var afterDo = function(obj){
	$(".PagerView").find('.goToPageBtn').off('click').click(function(){
			var $unmInput = $('[name=pageNum]');
			var num = Number($unmInput.val());
			var max = Number($unmInput.attr("max"));
			//var max = obj.pageCount;
			if(num > max) return;
			query(num);
		});
	}	
	var query = function(defaultPageNo){
		var options = {
			pager: ".announcement-pager",
			render: ".announcementlist",
			tmplStr: tpl,
			tmpl: "",
			format: "[<(qq-) ncnnn (-pp)>]",	
			url: "/test-data.json",
			pageNoFieldName:"pageNo",
			goToPage:"#PagerGoto",
			defaultPageNo: defaultPageNo,	
			data: {},	
			afterRender: afterDo

		};	
		pagination.pagingShow(options);
	}
	query();
}






