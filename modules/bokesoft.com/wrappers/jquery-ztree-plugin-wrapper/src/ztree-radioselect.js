/**
 * 使用ztree自定义radioselect控件。zNodes树数据，treeSel选择输入框控件ID值，treeVal保存选择值控件ID，
 *  treebtn下拉按钮ID，treemenu 树menu的ID，treeArea数据显示区域ID，同步方式。
 *  ex:<input type="text" id="storeGtypeSel" class="txt" style="width:300px;" readonly=readonly />
 *	   <a toggle="false" id="selBtn" onclick="showMenu()"><span>下拉</span></a>
 *	   <input type="hidden" name="storeGtype" id="storeGtype"/>
 *	   <div id="menuContent" class="menuContent" style="display:none;">
 *	   <ul id="treedataarea" class="ztree"></ul> 
 * $.fn.radioselect({zNodes:'$StoregTypeTree',treeSel:"storeGtypeSel",treeVal:"storeGtype",treeMenu:"menuContent",menuBtn:"selBtn",treeArea:"treedataarea"});
 */
(function($){
    $.fn.radioselect = function(options){
		var setting = {
			data: {
				simpleData: {
					enable: true
				}
			},
			callback: {
				beforeClick: beforeClick,
				onClick: onClick
			},
			view :{  
				showIcon: false,
				fontCss : getFontCss
			} 
		};
		
		var zNodes = $.parseJSON(options.zNodes) || options.zNodes,
			treeSel = options.treeSel,
			treeVal = options.treeVal,
			treeMenu = options.treeMenu,
			menuBtn = options.menuBtn,
			treeArea = options.treeArea,
			branchCanSelect = options.branchCanSelect || false,
			showFullPath = options.showFullPath || true,
			treeObj = null;
			
		function getFontCss(treeId, treeNode) {
			return (!!treeNode.highlight) ? {color:"A60000", "font-weight":"bold"} : {"font-weight":"normal"};
		}
		
		function beforeClick(treeId, treeNode) {
			var check = (treeNode && (!treeNode.isParent || branchCanSelect));
			return check;
		}
		
		function getWholeNodeName (node) {
			var treeNodeName = node.name;
			if (!showFullPath) {
				return treeNodeName;
			}
			if ( !node.getParentNode ) {
				return treeNodeName;
			}
			var parentNode = node.getParentNode();
			while (parentNode != null) {
				treeNodeName = parentNode.name + '\\' + treeNodeName;
				parentNode = parentNode.getParentNode();
			}
			return treeNodeName;
		}
		
		function onClick(e, treeId, treeNode) {
			var zTree = $.fn.zTree.getZTreeObj(treeArea);
			$("#"+treeSel).val(getWholeNodeName(treeNode));
			$("#"+treeVal).val(treeNode.id);
			$("#"+treeVal).trigger('change');
			hideMenu();
			return true;
		}
		
		function showMenu() {
			var $treeSel = $("#"+treeSel),
				$treeVal = $("#"+treeVal),
				treeSelWidth = $treeSel.css('width'),
				treeSelHeight = $treeSel.css('height');
			if (!($('#'+treeMenu).css('display') == 'none')) {
				return;
			}
			var treeNodes = treeObj.transformToArray(treeObj.getNodes());
			for (var i = 0; i < treeNodes.length; i++) {
				treeNodes[i].highlight = false;
				treeObj.updateNode(treeNodes[i]);
			}
			var selectNode = treeObj.getNodeByParam('id',$treeVal.val());
			if (selectNode) {
				treeObj.selectNode(selectNode);
			}
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
			_.each(zNodes,function(node){
				if ( node.id == $('#'+treeVal).val() ) {
					$('#' + treeSel).val(getWholeNodeName(node));
				}
			});
		}
		
		var comboSearch = {
			onKeyUp : function(event) {
				var _dm = event.target;
				switch(event.keyCode){
					case 13 : comboSearch.onSearch(this, (_dm.value||'').toUpperCase());
					default : comboSearch.onSearch(this, (_dm.value||'').toUpperCase());
					return;
				}
			},
			onBlur : function(event) {
				var inputVal = $("#"+treeSel).val();
					selectNode = treeObj.getNodeByParam('name',inputVal);
				if ($('#'+treeVal).val() > 0){
					var node = treeObj.getNodeByParam('id',$('#'+treeVal).val());
					if (selectNode &&( !selectNode.isParent || (selectNode.isParent && branchCanSelect) ) ) {
						if ( selectNode.id != node.id ) {
							$("#"+treeSel).val(getWholeNodeName(selectNode));
							$('#'+treeVal).val(selectNode.id);
						}
					} else {
						$("#"+treeSel).val(getWholeNodeName(node));
						$('#'+treeVal).val(node.id);
					}
					
				} else if (selectNode && (!selectNode.isParent || (selectNode.isParent && branchCanSelect))) {
					$('#'+treeSel).val(getWholeNodeName(selectNode));
					$('#'+treeVal).val(selectNode.id);
				} else {
					$("#"+treeSel).val('');
					$('#'+treeVal).val(-1);
				}
			},
			onSearch : function(dom, condition) {
				var highlightNodes = new Array();
				if (condition != "") {
					highlightNodes = treeObj.getNodesByParamFuzzy("name", condition, null);
				}
				comboSearch.updateNodes(highlightNodes, true, true);
			},
			updateNodes : function(nodeList, highlight, expand) {
				var treeNodes = treeObj.transformToArray(treeObj.getNodes());
				for (var i = 0; i < treeNodes.length; i++) {
					treeNodes[i].highlight = false;
					treeObj.updateNode(treeNodes[i]);
				}
				treeObj.expandAll(false);
				treeObj.cancelSelectedNode();
				$.each(nodeList,function(index,node){
					node.highlight = highlight;
					treeObj.updateNode(node);
					treeObj.expandNode(comboSearch.getRootParentNode(node), expand, true, false);
				});
			},
			getRootParentNode : function(node) {
				if (node.getParentNode() != null && node.getParentNode().id >= 0) {
					var parentNode =  node.getParentNode();
					return comboSearch.getRootParentNode(parentNode);
				} else {
					return node;
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
			$('#'+treeSel).bind('keyup',comboSearch.onKeyUp);
			$('#'+treeSel).bind('blur',comboSearch.onBlur);
		}
		init();
	}
})(jQuery);