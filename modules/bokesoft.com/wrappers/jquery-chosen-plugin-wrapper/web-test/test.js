require("..");
var $ = require("jquery");
if (! window.jQuery) window.jQuery = $;

window.doTest = function(){	
	
	//test1  汇集所有的属性
	option1 = {
		allow_single_deselect : false,  //false：单选必填项，true：单选非必填项目
		disable_search : false,  //单选时不显示搜索框
		disable_search_threshold: 0,  //单选时选项大于指定数字时才显示搜索，可为任意数字，默认是0
		enable_split_word_search: false, //为false时只匹配整个文本的选择标记---待测试
		inherit_select_classes : false,
		max_selected_options : Infinity,  //多选时限制最多可选多少项，可为任意数字,默认为无穷大
		no_results_text : "No results match",  //搜索不到结果时显示的内容,要求第一个选项为空
		placeholder_text_multiple : "Select Some Options",  //多选默认内容,要求第一个选项为空
		placeholder_text_single : "Select an Option",  //单选默认内容,要求第一个选项为空
		search_contains : false ,  //默认为false，只能从头开始匹配单词，为true时允许从任何位置开始匹配
		single_backstroke_delete : true,
		width : "50%", //设置选择框的长度
		display_disabled_options : true,//默认为true,搜索结果中有"disabled"选项也会显示,为false时不出现在搜索结果中
		display_selected_options : true,//同"display_disabled_options"
		include_group_label_in_selected : false,//默认false,只展示选中项不展示分组名,为true时带分组名一起展示
		max_shown_results : Infinity,//选项很多时可以限制只显示指定的前几项,可为任意数字,默认为无穷大
		case_sensitive_search : false
	}
	//$(".chosen-test1 select").chosen(option1);
	$(".chosen-test1 select").chosen();	
	
	
	// test2  选项展开和收起触发事件的测试
	$(".chosen-test2 select").chosen()
	.on("chosen:showing_dropdown", function () {
		console.log("我展开了");
	})
	.bind("chosen:hiding_dropdown", function () {
		console.log("我收起了");
	});

	 /*可触发事件
	     chosen:ready  选择实例化之后才触发的
	     chosen:maxselected  配合"max_selected_options"使用,超出最多可选项时触发的方法
		 chosen:showing_dropdown  选项展开时触发的方法
		 chosen:hiding_dropdown  选项收起时触发的方法
		 chosen:no_results  搜索无结果时触发
		 chosen:updated   触发事件最初的调用方式
	*/
	//test3 
	var options3 = {
		allow_single_deselect: true,
		no_results_text: 'Nothing found!',
		max_selected_options: 5 ,
	}
	$(".chosen-test3 select").chosen(options3).bind("chosen:maxselected", function () {
		alert("你不能再选了");
	}); 
   
	//test4
	var options4 = {
		allow_single_deselect: true,
		include_group_label_in_selected : true
	}
	$(".chosen-test4 select").chosen(options4).change(function(){
		alert("当前选项已改变！");
	});
	
	
	//test5	 单选非必填项目(可删)
	option5 = {
		allow_single_deselect : true ,
		disable_search_threshold: 2,
		enable_split_word_search: false,
		inherit_select_classes: false,
		search_contains:true
	}	
	$(".chosen-test5 select").chosen(option5).bind("chosen:no_results", function () {
		alert("你搜索的东西不存在！");
	});
	
	 
	//test6 指定最大搜索结果数
	option6 = {
		disable_search_threshold : 1, 
		single_backstroke_delete : true,
		display_selected_options : false,
		max_shown_results : 3
	}
	$(".chosen-test6 select").chosen(option6);
	
	
	//test7 让指定的select不被chosen渲染，原始输出
	$(".chosen-test7 select").trigger("chosen:updated");
}








