require("..");
var $ = require("jquery");
if (! window.jQuery) window.jQuery = $;
require("./style.css");

window.doTest = function(){	
   
   //test1 通过标签里data-xx设置表单验证属性
     $(".test1-btn").click(function(){
	   $('.form1').on('valid.form', function(e, form){  //验证失败的回调用"invalid.form"
			alert("验证成功啦");
		});
   });

	
	//test2
	//_require("",function(){});
	//_require("nice-validator");
	
	var options = {
		timely:2,  //3个值可取，0:false 关闭验证,只在提交时验证；1:true 在字段失去焦点时验证；2:输入时实时验证
		display: function(el) {   //自定义消息中{0}的显示替换名称
			return $(el).prev('.label').text();
		},
		theme: "yellow_right", /*中文模式下 设置表单验证的主题方式,默认为“default”,可选主题有："simple_right","simple_bottom",
								"yellow_top","yellow_right","yellow_right_effect"*/
		stopOnError: false,    //是否在验证出错时停止继续验证，默认不停止	
		focusInvalid: true,    //是否自动让第一个出错的输入框获得的焦点，默认获得
		focusCleanup: false,   //是否在输入框获得焦点的时候清除消息，默认不清除
		ignore: "#other-name", //指定需要忽略验证的元素的jQuery选择器
		//rules: 
		messages: {            //自定义用于当前实例的规则消息
			//required: "XX不能为空",
			email: "请检查邮箱格式"
		},
		fields: {     //待验证的字段集合，键为字段的name值或者"#"+字段id
			//name字段使用了所有支持的参数
			'againPwd': {
				rule: "确认密码: required; match(password);rule3",
				msg: {
					required: "请确认密码",
					rule3: "[/^[\w\d]{3,12}$"
				},
				tip: "密码输入不一致",
				ok: "密码输入一致了",
				timely: 2,
				target: ".form2",
				valid: function(){},  //字段验证成功的回调
				invalid: function(){}   //字段验证失败的回调
			},
			//email和mobile字段用最简单的方式传递字段规则
			email: "required; email",
			mobile: "mobile"
				}
	}
	$('.form2').validator(options);
}
	
	








