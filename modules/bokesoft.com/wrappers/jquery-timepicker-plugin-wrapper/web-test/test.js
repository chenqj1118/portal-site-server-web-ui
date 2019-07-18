require("..");
var $ = require("jquery");

window.doTest = function(){	

	//test1 日期
	$(".txtDatetime1").datepicker();
	
	//test2 时间
	$(".txtDatetime2").timepicker();	

	//test3 日期时间
	$(".txtDatetime3").datetimepicker();
	
	//test4 多属性
	var option4 = {
		timeInput: true, //默认为false不允许编辑时间，true为允许
		//showHour: false, //是否显示时
		//showMinute: false, //是否显示分
		
		showOn : 'button',  //外部trigger触发
		buttonImage: './calendar.png', //button图片
		
		dateFormat : 'yy-mm-dd',  //显示格式
		timeFormat : 'HH:mm:ss tt',
		
		stepHour: 2,  //位移
		stepMinute: 10,
		stepSecond: 10,
		
		hourGrid: 4, //进度条下显示数字位移
		minuteGrid: 10,
		
		numberOfMonths: 2 //显示2个月
	};
	$(".txtDatetime4").datetimepicker(option4);	
	
	//test5 时间下拉
	var option5 = {
		controlType: 'select',
		oneLine: true,
		timeFormat: 'hh:mm tt'
	};
	$(".txtDatetime5").datetimepicker(option5);		
	
	//test6 默认日期
	$(".txtDatetime6").datetimepicker();	
	
	//test7 默认日期+时间
	var option7 = {
		altField: ".txtDatetime7_alt"
	};	
	$(".txtDatetime7").datetimepicker(option7);		
	
	//test8 日期+时间(不显示进度条)
	var option8 = {
		timeInput: true,
		timeFormat: "hh:mm tt",
		showHour: false,
		showMinute: false
	};	
	$(".txtDatetime8").datetimepicker(option8);	

	//test9 限制日期时间
	var option9 = {
	minDate: new Date(2017, 1, 20, 8, 30),
	maxDate: new Date(2017, 1, 25, 17, 30)
	};	
	$(".txtDatetime9").datetimepicker(option9);		
	
}








