/**
 * 使用ztree自定义radioselect控件。zNodes树数据，treeSel选择输入框控件ID值，treeVal保存选择值控件ID，
 *  treebtn下拉按钮ID，treemenu 树menu的ID，treeArea数据显示区域ID，同步方式。
 *  ex: <div class="p_relative fl_left">
 *			<input type="text" id="carsClassifySel" class="txt" style="width:300px;" readonly=readonly />
 *			<span toggle="false" id="selBtn">▼</span>
 *		</div>
 *		<input type="hidden" name="carsClassify" id="carsClassify"/>
 *		<div id="menuContent" class="menuContent" style="display:none;">
 *			<ul id="treedataarea" class="ztree"></ul>
 *		</div> *$.fn.multiselect({zNodes:'$carsClassifyTree',treeSel:"carsClassifySel",treeVal:"carsClassify",treeMenu:"menuContent",menuBtn:"selBtn",treeArea:"treedataarea"});
 */
(function($){
    $.fn.multiselect = function(options){
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
				beforeCheck: beforeCheck,
				onCheck: onCheck
			}
		};
		
		var zNodes = options.zNodes,
			treeSel = options.treeSel,
			treeVal = options.treeVal,
			treeMenu = options.treeMenu,
			menuBtn = options.menuBtn,
			treeArea = options.treeArea,
			showCount = options.showCount ? options.showCount : 2,
			treeObj = null;
			
		function beforeCheck(treeId, treeNode) {
			return true;
		}
		
		function getParentsNodeName (node) {
			var treeNodeName = node.name;
			if ( !node.getParentNode ) {
				return treeNodeName;
			}
			var parentNode = node.getParentNode();
			while (parentNode != null) {
				treeNodeName = parentNode.name + '\\' + treeNodeName;
				parentNode = parentNode.getParentNode();
			}
			return treeNodeName
		}
		
		function onCheck(e, treeId, treeNode) {
			var treeObj = $.fn.zTree.getZTreeObj(treeArea),
				nodes = treeObj.getCheckedNodes(true),
				treeNodeName = '',
				treeNodeId = '',
				cnodesCount = 0;
			for ( var i = 0; i < nodes.length; i++ ) {
				var node = nodes[i];
				if (node.id == 0 && !node.getCheckStatus().half) {
					$("#"+treeSel).val(node.name);
					$("#"+treeVal).val(node.id);
					return false;
				}
				if (node.isParent && !node.getCheckStatus().half 
					&& ((node.getParentNode() && node.getParentNode().getCheckStatus().half ) || 
						 null == node.getParentNode() ) 
				   ) {
					treeNodeName += getParentsNodeName(node) + ',';
					treeNodeId += node.id + ',';
					cnodesCount ++;
				} else if (!node.isParent && node.getParentNode().getCheckStatus().half) {
					treeNodeName += getParentsNodeName(node) + ',';
					treeNodeId += node.id + ',';
					cnodesCount ++;
				}
			}
			if (cnodesCount > showCount) {
				$("#"+treeSel).val("已选【"+cnodesCount+"】项");
			} else {
				$("#"+treeSel).val(treeNodeName.substring(0, treeNodeName.length-1));
			}
			$("#"+treeVal).val(treeNodeId.substring(0,treeNodeId.length-1));
		}
		
		function showMenu() {
			var $treeSel = $("#"+treeSel),
				treeSelWidth = $treeSel.css('width'),
				treeSelHeight = $treeSel.css('height');
			$("#"+treeMenu).parent().css({position:"relative"});
			$("#"+treeMenu).css({position:"absolute",top:treeSelHeight,left:"5px;",width:treeSelWidth,height:'350',overflow:'auto'}).slideDown("fast").addClass('treeMenu');
			$('#'+treeArea).css({width:treeSelWidth,padding:"0px"});
			$("body").bind("mousedown", onBodyDown);
		}
		
		function hideMenu() {
			$("#"+treeMenu).fadeOut("fast");
		}
		
		function onBodyDown(event) {
			if (!(event.target.id == menuBtn || event.target.id == treeSel || event.target.id == treeMenu || $(event.target).parents("#"+treeMenu).length>0)) {
				hideMenu();
			}
		}
		
		function setDefault() {
			var treeObj = $.fn.zTree.getZTreeObj(treeArea),
				treeDefaultVal = $('#'+treeVal).val(),
				treeDefaultValList = treeDefaultVal.split(','),
				treeSelVal = ""; 
			if (treeDefaultVal.length > 0) {
				for (var i =0; i < treeDefaultValList.length; i++) {
					var node = treeObj.getNodesByParam('id',treeDefaultValList[i]);
					if (node.length > 0) {
						treeSelVal += getParentsNodeName(node[0]) + ',';
						treeObj.checkNode(node[0], true, true);
					}
				}
				
				if (treeSelVal.length > 0) {
					treeSelVal = treeSelVal.substring(0, treeSelVal.length - 1);
				}
				
				if (treeDefaultValList.length > showCount) {
					$("#"+treeSel).val("已选【"+treeDefaultValList.length+"】项");
				} else {
					$('#'+treeSel).val(treeSelVal);
				}
			}
		}
		
		var init = function() {
			treeObj = $.fn.zTree.init($("#"+treeArea), setting, zNodes);
			setDefault();
			$('#'+treeSel).bind('click',function(){
				showMenu();
			});
			$('#'+menuBtn).bind('click',function(){
				showMenu();
			});
		}
		
		init();
	}
})(jQuery);