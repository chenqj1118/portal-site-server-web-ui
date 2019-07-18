require("..");
var $ = require("jquery");
if (! window.jQuery) window.jQuery = window.jQuery = $;

window.doTest = function(){
	//test1(以id,pid的形式存储数据)
	var setting1 = {
		view: {
			dblClickExpand: false,     //双击节点切换(true)/不切换(false)展开状态,默认为true
			showLine: true,            //设置 zTree 是否显示节点之间的连线,默认为true
			selectedMulti: false       /*设置是否支持同时选中多个节点，默认为true
										1、设置为 true时，按下 Ctrl 或 Cmd 键可以选中多个节点
										2、设置为 true / false 都不影响按下 Ctrl 或 Cmd 键可以让已选中的节点取消选中状态
										（ 取消选中状态可以参考 setting.view.autoCancelSelected ）*/
		},
		data: {
			simpleData: {
				enable:true,           //确定zTree初始化时的节点数据、异步加载时的节点数据、addNodes 方法中输入的newNodes是否采用简单数据模式，默认为false
				idKey: "id",           //节点数据中保存唯一标识的属性名称。默认值：id"
				pIdKey: "pId",         //节点数据中保存其父节点唯一标识的属性名称。默认值："pId"
				rootPId: ""            //用于修正根节点父节点数据，即 pIdKey 指定的属性值。默认值：null
			}
		},
		callback: {
			beforeClick: function(treeId, treeNode) {        //用于捕获单击节点之前的事件回调函数，并且根据返回值确定是否允许单击操作。默认值：null
				var zTree = $.fn.zTree.getZTreeObj("tree");
				if (treeNode.isParent) {
					zTree.expandNode(treeNode);
					return false;
				} else {
					demoIframe.attr("src",treeNode.file + ".html");
					return true;
				}
			}
		}
	};

	var zNodes1 =[
		{id:1, pId:0, name:"[core] test1", open:true},
		{id:101, pId:1, name:"test1子项"/*,url("http://www.baidu.com")此处可添加超链接*/},
		{id:102, pId:1, name:"test1子项"},
		{id:103, pId:1, name:"test1子项"},
		{id:2, pId:0, name:"test2", open:false},
		{id:201, pId:2, name:"test2子项"},
		{id:202, pId:2, name:"test2子项"},
		{id:203, pId:2, name:"test2子项"}
	];
	
	$.fn.zTree.init($("#treeDemo1"), setting1, zNodes1);    //zTree 初始化方法，创建 zTree 必须使用此方法  
	
	//test2(以name,children的形式存储数据)
	var setting2 = {};
	var zNodes2 =[
		{ name:"父节点1 - 展开", open:true,
			children: [
				{ name:"父节点11 - 折叠",
					children: [
						{ name:"叶子节点111"},
						{ name:"叶子节点112"},
						{ name:"叶子节点113"},
						{ name:"叶子节点114"}
					]},
				{ name:"父节点12 - 折叠",
					children: [
						{ name:"叶子节点121"},
						{ name:"叶子节点122"},
						{ name:"叶子节点123"},
						{ name:"叶子节点124"}
					]},
				{ name:"父节点13 - 没有子节点", isParent:true}
			]},
		{ name:"父节点2 - 折叠",
			children: [
				{ name:"父节点21 - 展开", open:true,
					children: [
						{ name:"叶子节点211"},
						{ name:"叶子节点212"},
						{ name:"叶子节点213"},
						{ name:"叶子节点214"}
					]},
				{ name:"父节点22 - 折叠",
					children: [
						{ name:"叶子节点221"},
						{ name:"叶子节点222"},
						{ name:"叶子节点223"},
						{ name:"叶子节点224"}
					]},
				{ name:"父节点23 - 折叠",
					children: [
						{ name:"叶子节点231"},
						{ name:"叶子节点232"},
						{ name:"叶子节点233"},
						{ name:"叶子节点234"}
					]}
			]},
		{ name:"父节点3 - 没有子节点", isParent:true}

	];
	$.fn.zTree.init($("#treeDemo2"), setting2, zNodes2);

	

	
	//test3(隐藏/显示当前选中节点的复选框)
	var setting3 = {
		check: {                                        //以复选框的形式存在必须使用check
			enable: true,
			nocheckInherit: true
		},
		data: {
			simpleData: {
				enable:true
			}
		},
		callback: {
			beforeCheck: zTreeBeforeCheck               //用于捕获勾选或取消勾选之前的事件回调函数，并且根据返回值确定是否允许勾选或取消勾选。默认值：null
	}
	};
	function nocheckNode(e) {
			var zTree = $.fn.zTree.getZTreeObj("treeDemo3"),
			nocheck = e.data.nocheck,
			nodes = zTree.getSelectedNodes();
			if (nodes.length == 0) {
				alert("请先选择一个节点");
			}

			for (var i=0, l=nodes.length; i<l; i++) {
				nodes[i].nocheck = nocheck;
				zTree.updateNode(nodes[i]);
			}
		}
	$.fn.zTree.init($("#treeDemo3"), setting3, zNodes1);
	$("#nocheckTrue").bind("click", {nocheck: true}, nocheckNode);     //设置选中项为隐藏
	$("#nocheckFalse").bind("click", {nocheck: false}, nocheckNode);   //设置选中项为显示
	
	function zTreeBeforeCheck(treeId, treeNode) {
		return true;                                    //默认为TRUE  设为false 禁止所有勾选操作，保持初始化的勾选状态
	};

	


	//test4(checkbox与radio组合使用)
	var IDMark_A = "_a";
	var setting4 = {
		view: {
			addDiyDom: addDiyDom                    /*用于在节点上固定显示用户自定义控件。默认值：null
													  在 addDiyDom 中针对每个节点 查找 DOM 对象并且添加新 DOM 控件；*/
		},
		data: {
			simpleData: {
				enable: true
			}
		}
	};

	var zNodes4 =[
		{ id:1, pId:0, name:"父节点 1", open:true},
		{ id:11, pId:1, name:"叶子节点 1-1"},
		{ id:12, pId:1, name:"叶子节点 1-2"},
		{ id:13, pId:1, name:"叶子节点 1-3"},
		{ id:2, pId:0, name:"父节点 2", open:true},
		{ id:21, pId:2, name:"叶子节点 2-1"},
		{ id:22, pId:2, name:"叶子节点 2-2"},
		{ id:23, pId:2, name:"叶子节点 2-3"},
		{ id:3, pId:0, name:"父节点 3", open:true},
		{ id:31, pId:3, name:"叶子节点 3-1"},
		{ id:32, pId:3, name:"叶子节点 3-2"},
		{ id:33, pId:3, name:"叶子节点 3-3"}
	];

	function addDiyDom(treeId, treeNode) {
		var aObj = $("#" + treeNode.tId + IDMark_A);
		if (treeNode.level == 0) {
			var editStr = "<input type='checkbox' class='checkboxBtn' id='checkbox_" +treeNode.id+ "' onfocus='this.blur();'></input>";
			aObj.before(editStr);
			var btn = $("#checkbox_"+treeNode.id);
		if (btn) btn.bind("change", function() {checkAccessories(treeNode, btn);});
		} else if (treeNode.level == 1) {
			var editStr = "<input type='radio' class='radioBtn' id='radio_" +treeNode.id+ "' name='radio_"+treeNode.getParentNode().id+"' onfocus='this.blur();'></input>";
			aObj.before(editStr);
			var btn = $("#radio_"+treeNode.id);
			if (btn) btn.bind("click", function() {checkBrand(treeNode, btn);});
		}
	}

	function checkAccessories(treeNode, btn) {
		var checkedRadio = getCheckedRadio("radio_"+treeNode.id);
		if (btn.attr("checked")) {
			if (!checkedRadio) {
				$("#radio_" + treeNode.children[0].id).attr("checked", true);
			}
		} else {
			checkedRadio.attr("checked", false);
		}
	}

	function checkBrand(treeNode, btn) {
		if (btn.attr("checked")) {
			var pObj = $("#checkbox_" + treeNode.getParentNode().id);
			if (!pObj.attr("checked")) {
				pObj.attr("checked", true);
			}
		}
	}

	function getCheckedRadio(radioName) {
		var r = document.getElementsByName(radioName);
		for(var i=0; i<r.length; i++)    {
			if(r[i].checked)    {
				return $(r[i]);
			}
		}
		return null;
	}
	$.fn.zTree.init($("#treeDemo4"), setting4, zNodes4);
	

	

	//test5(修改/删除节点)
	var setting5 = {
		edit: {
			enable: true
		},
		data: {
			simpleData: {
				enable: true
			}
		},
		callback: {
			beforeDrag: beforeDrag                //用于捕获节点被拖拽之前的事件回调函数，并且根据返回值确定是否允许开启拖拽操作。默认值：null
		}
	};

	var zNodes5 =[
		{ id:1, pId:0, name:"父节点 1", open:true},
		{ id:11, pId:1, name:"叶子节点 1-1"},
		{ id:12, pId:1, name:"叶子节点 1-2"},
		{ id:13, pId:1, name:"叶子节点 1-3"},
		{ id:2, pId:0, name:"父节点 2", open:true},
		{ id:21, pId:2, name:"叶子节点 2-1"},
		{ id:22, pId:2, name:"叶子节点 2-2"},
		{ id:23, pId:2, name:"叶子节点 2-3"},
		{ id:3, pId:0, name:"父节点 3", open:true},
		{ id:31, pId:3, name:"叶子节点 3-1"},
		{ id:32, pId:3, name:"叶子节点 3-2"},
		{ id:33, pId:3, name:"叶子节点 3-3"}
	];

	function beforeDrag(treeId, treeNodes) {
		return false;
	}
	
	function setEdit() {
		var zTree = $.fn.zTree.getZTreeObj("treeDemo5"),
		remove = $("#remove").attr("checked"),
		rename = $("#rename").attr("checked"),
		removeTitle = $.trim($("#removeTitle").get(0).value),
		renameTitle = $.trim($("#renameTitle").get(0).value);
		zTree.setting.edit.showRemoveBtn = remove;
		zTree.setting.edit.showRenameBtn = rename;
		zTree.setting.edit.removeTitle = removeTitle;
		zTree.setting.edit.renameTitle = renameTitle;
	}
	
	$.fn.zTree.init($("#treeDemo5"), setting5, zNodes5);
	setEdit();
	$("#remove").bind("change", setEdit);
	$("#rename").bind("change", setEdit);
	$("#removeTitle").bind("propertychange", setEdit)
	.bind("input", setEdit);
	$("#renameTitle").bind("propertychange", setEdit)
	.bind("input", setEdit);
	

	
	
	//test6(拖拽节点)
	var setting6 = {
		edit: {
			enable: true,
			showRemoveBtn: false,                 /*设置是否显示删除按钮。默认值为true
													当点击某节点的删除按钮时：
													1、首先触发 setting.callback.beforeRemove 回调函数，用户可判定是否进行删除操作。
													2、如果未设置 beforeRemove 或 beforeRemove 返回 true，
													   则删除节点并触发 setting.callback.onRemove 回调函数。*/
			showRenameBtn: false                  /*设置是否显示编辑名称按钮。默认值为true
													当点击某节点的编辑名称按钮时：
													1、进入节点编辑名称状态。
													2、编辑名称完毕，会触发 setting.callback.beforeRename 回调函数，用户可根据自己的规则判定是否允许修改名称。
													3、如果 beforeRename 返回 false，则继续保持编辑名称状态，直到名称符合规则位置 （按下 ESC 键可取消编辑名称状态，恢复原名称）。
													4、如果未设置 beforeRename 或 beforeRename 返回 true，则结束节点编辑名称状态，更新节点名称，并触发 setting.callback.onRename 回调函数。*/
		},
		data: {
			simpleData: {
				enable: true
			}
		},
		callback: {
			beforeDrag: beforeDrag,
			beforeDrop: beforeDrop                //用于捕获节点拖拽操作结束之前的事件回调函数，并且根据返回值确定是否允许此拖拽操作。默认值：null
		}
	};

	var zNodes6 =[
		{ id:1, pId:0, name:"随意拖拽 1", open:true},
		{ id:11, pId:1, name:"随意拖拽 1-1"},
		{ id:12, pId:1, name:"随意拖拽 1-2", open:true},
		{ id:121, pId:12, name:"随意拖拽 1-2-1"},
		{ id:122, pId:12, name:"随意拖拽 1-2-2"},
		{ id:123, pId:12, name:"随意拖拽 1-2-3"},
		{ id:13, pId:1, name:"禁止拖拽 1-3", open:true, drag:false},
		{ id:131, pId:13, name:"禁止拖拽 1-3-1", drag:false},
		{ id:132, pId:13, name:"禁止拖拽 1-3-2", drag:false},
		{ id:133, pId:13, name:"随意拖拽 1-3-3"},
		{ id:2, pId:0, name:"随意拖拽 2", open:true},
		{ id:21, pId:2, name:"随意拖拽 2-1"},
		{ id:22, pId:2, name:"禁止拖拽到我身上 2-2", open:true, drop:false},
		{ id:221, pId:22, name:"随意拖拽 2-2-1"},
		{ id:222, pId:22, name:"随意拖拽 2-2-2"},
		{ id:223, pId:22, name:"随意拖拽 2-2-3"},
		{ id:23, pId:2, name:"随意拖拽 2-3"}
	];

	function beforeDrag(treeId, treeNodes) {
		for (var i=0,l=treeNodes.length; i<l; i++) {
			if (treeNodes[i].drag === false) {
				return false;
			}
		}
		return true;
	}
	function beforeDrop(treeId, treeNodes, targetNode, moveType) {
		return targetNode ? targetNode.drop !== false : true;
	}
	
	function setCheck() {
		var zTree = $.fn.zTree.getZTreeObj("treeDemo6"),
		isCopy = $("#copy").attr("checked"),
		isMove = $("#move").attr("checked"),
		prev = $("#prev").attr("checked"),
		inner = $("#inner").attr("checked"),
		next = $("#next").attr("checked");
		zTree.setting.edit.drag.isCopy = isCopy;
		zTree.setting.edit.drag.isMove = isMove;

		zTree.setting.edit.drag.prev = prev;
		zTree.setting.edit.drag.inner = inner;
		zTree.setting.edit.drag.next = next;
	}
	
	$.fn.zTree.init($("#treeDemo6"), setting6, zNodes6);
	setCheck();
	$("#copy").bind("change", setCheck);
	$("#move").bind("change", setCheck);
	$("#prev").bind("change", setCheck);
	$("#inner").bind("change", setCheck);
	$("#next").bind("change", setCheck);

	


	//test7(一次性加载大量数据)
	var setting = {
		check: {
			enable: true
		},
		data: {
			simpleData: {
				enable: true
			}
		},
		callback: {
			onNodeCreated: onNodeCreated             //用于捕获节点生成 DOM 后的事件回调函数。默认值：null
		}
	};

	var dataMaker = function(count) {
		var nodes = [], pId = -1,
		min = 10, max = 90, level = 0, curLevel = [], prevLevel = [], levelCount,
		i = 0,j,k,l,m;

		while (i<count) {
			if (level == 0) {
				pId = -1;
				levelCount = Math.round(Math.random() * max) + min;
				for (j=0; j<levelCount && i<count; j++, i++) {
					var n = {id:i, pId:pId, name:"Big-" +i};
					nodes.push(n);
					curLevel.push(n);
				}
			} else {
				for (l=0, m=prevLevel.length; l<m && i<count; l++) {
					pId = prevLevel[l].id;
					levelCount = Math.round(Math.random() * max) + min;
					for (j=0; j<levelCount && i<count; j++, i++) {
						var n = {id:i, pId:pId, name:"Big-" +i};
						nodes.push(n);
						curLevel.push(n);
					}
				}
			}
			prevLevel = curLevel;
			curLevel = [];
			level++;
		}
		return nodes;
	}

	var ruler = {
		doc: null,
		ruler: null,
		cursor: null,
		minCount: 5000,
		count: 5000,
		stepCount:500,
		minWidth: 30,
		maxWidth: 215,
		init: function() {
			ruler.doc = $(document);
			ruler.ruler = $("#ruler");
			ruler.cursor = $("#cursor");
			if (ruler.ruler) {
				ruler.ruler.bind("mousedown", ruler.onMouseDown);
				
			}
		},
		onMouseDown: function(e) {
			ruler.drawRuler(e, true);
			ruler.doc.bind("mousemove", ruler.onMouseMove);
			ruler.doc.bind("mouseup", ruler.onMouseUp);
			ruler.doc.bind("selectstart", ruler.onSelect);
			$("body").css("cursor", "pointer");
		},
		onMouseMove: function(e) {
			ruler.drawRuler(e);
			return false;
		},
		onMouseUp: function(e) {
			$("body").css("cursor", "auto");
			ruler.doc.unbind("mousemove", ruler.onMouseMove);
			ruler.doc.unbind("mouseup", ruler.onMouseUp);
			ruler.doc.unbind("selectstart", ruler.onSelect);
			ruler.drawRuler(e);
		},
		onSelect: function (e) {
			return false;
		},
		getCount: function(end) {
			var start = ruler.ruler.offset().left+1;
			var c = Math.max((end - start), ruler.minWidth);
			c = Math.min(c, ruler.maxWidth);
			return {width:c, count:(c - ruler.minWidth)*ruler.stepCount + ruler.minCount};
		},
		drawRuler: function(e, animate) {
			var c = ruler.getCount(e.clientX);
			ruler.cursor.stop();
			if ($.support.msie || !animate) {
				ruler.cursor.css({width:c.width});
			} else {
				ruler.cursor.animate({width:c.width}, {duration: "fast",easing: "swing", complete:null});
			}
			ruler.count = c.count;
			ruler.cursor.text(c.count);
		}
	}
	
	var showNodeCount = 0;
	function onNodeCreated(event, treeId, treeNode) {
		showNodeCount++;
	}

	function createTree () {
		var zNodes = dataMaker(ruler.count);
		showNodeCount = 0;
		$("#treeDemo7").empty();
		setting.check.enable = $("#showChk").attr("checked");
		var time1 = new Date();
		$.fn.zTree.init($("#treeDemo7"), setting, zNodes);
		var time2 = new Date();

		alert("节点共 " + zNodes.length + " 个, 初始化生成 DOM 的节点共 " + showNodeCount + " 个"
			+ "\n\n 初始化 zTree 共耗时: " + (time2.getTime() - time1.getTime()) + " ms");
	}
	
	ruler.init("ruler");
	$("#createTree").bind("click", createTree);

	
	
	
	//test8(下拉菜单)
	$.fn.multiselect({zNodes:zNodes6,treeSel:"carsClassifySel",treeVal:"carsClassify",treeMenu:"menuContent",menuBtn:"selBtn",treeArea:"treedataarea"});
	
}