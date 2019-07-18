/**
 * 根据Yigo字典行政区划所写的省市县地区选择, 要求的数据格式参考 `estore.common.Area.getAreaTree()`
 */
(function($){
    $.fn.areaSelect = function(options){ 
        if(this.length < 1) return;
        //Area构造函数
        var Area = function(elem, child, disabled, array){
            this.elem = elem;
            this.child = child;
            this.disabled = disabled;
            this.array = array;
            this.updateOptions();
        }
        //更显界面选项
        Area.prototype.updateOptions = function(){
            var a = this;
            var el = a.elem;
            el.empty();
            if(a.array.length == 0) return;
            el.append("<option value='-1'>请选择</option>");
            
			for(var i=0;i<a.array.length;i++){
				var item = a.array[i];
                el.append("<option value="+item.id+">"+item.name+"</option>");
            };
            el.trigger('change');
        }
        //设置不可编辑
        Area.prototype.setDisabled = function(forced){
            if(forced || this.disabled){
                var el = this.elem;
                el.attr('disabled','disabled');
                el.css('display','none');
                if(this.child != null) this.child.setDisabled(true);
            }
            else if(this.child != null){
                this.child.setDisabled();
            }
            else return;
        }
        //设置可编辑
        Area.prototype.setEnabled = function(){
            if(this.disabled) return;
            var el = this.elem;
            el.attr('disabled',false);
            el.css('display','inline-block');
        }
        //设置选项数组
        Area.prototype.setOptionsArray = function(array){
            if(this.disabled) return;
            this.array = array;
            if(array.length > 0) this.setEnabled();
            else this.setDisabled(true);
            this.updateOptions();
        }
        //设置child
        Area.prototype.setChild = function(child){
            this.child = child;
        }
        //设置变化事件包装
        Area.prototype.initChangeEvent = function(setLast){
            if(this == null || this.disabled) return;
            if(this.child == null){
                var el = this.elem;
                el.change(function(){
                    var idx = el.get(0).selectedIndex - 1;
                    if(idx < 0) {
                        setLast.call(null,false,-1);
                    }
                    else {
                        setLast.call(null,true,el.val());
                    }
                });
                return;
            }
            
            var a = this;
            var el = a.elem;
            var child = a.child;
            el.change(function(){
                var idx = el.get(0).selectedIndex - 1;
                if(idx < 0 || a.array[idx].children.length == 0){
                    child.setOptionsArray([]);
                    child.setDisabled(true);

                    if(idx >= 0) setLast.call(null,true,el.val());
                    else setLast.call(null,false,-1);

                    return;
                }
                child.setOptionsArray(a.array[idx].children);

                setLast.call(null,false,-1);
            });
            child.initChangeEvent(setLast);
        }
        //选项赋值Post处理
        Area.prototype.setValue = function(value){
            this.elem.val(value);
            this.elem.trigger('change');
        }
        //初始化
        var init = function(data){
            var container = this;
            var $p = container.find('.prov');
            var $c = container.find('.city');
            var $d = container.find('.dist');
            var prov = new Area($p,null,options.disabled[0],data);
            var city = new Area($c,null,options.disabled[1],[]);
            var dist = new Area($d,null,options.disabled[2],[]);
            prov.setChild(city);
            city.setChild(dist);
            prov.setDisabled();

            /***注册在DOM元素上的方法，目前用于确定是否选到最后一级****/
            var lastArea = false;
            var lastAreaID  = -1;
            var area = {};
            var isLastArea = function(){
                return lastArea;
            }
            var setLastArea = function(last){
                lastArea = last;
            }
            var getLastAreaID = function(){
                return lastAreaID;
            }
            var setLastAreaID = function(areaID){
                lastAreaID = areaID;
            }
            var setLast = function(lastFlag,areaID){
                setLastArea.call(null,lastFlag);
                setLastAreaID.call(null,areaID);
            }
            area.isLastArea = isLastArea;
            area.getLastAreaID = getLastAreaID;
            //area.setLastArea = setLastArea;
            $(this)[0].area = area;
            /*********************************************************/
            prov.initChangeEvent(setLast);
            
            var defVals = [-1, -1, -1];
            var curId = options.defaultValue;
            
            if (curId && curId.constructor && curId.constructor.name=="Array"){
            	//处理直接指定各层级 ID 的情况
            	defVals = curId;
            }else if(Object.prototype.toString.call(curId) === '[object Array]'){
				defVals = curId;
			}
			else if (curId && curId > 0){
                //构造 level/ID 与 Area 数据的对应关系, 以最终实现选中默认值
                var areaDicList = [];
                var buildAreaDicList = function(data, dicList, level){
                	var dic = dicList[level];
                	if (! dic){
                		dic = {};
                		dicList[level] = dic;
                	}
                    for (var i=0; i<data.length; i++){
                        var area = data[i];
                        dic[area.id] = area;
                        if (area.children && area.children.length>0){
                        	buildAreaDicList(area.children, dicList, level+1);
                        }
                    }
                };
                buildAreaDicList(data, areaDicList, 0);
                //获得各层的默认值
                var findDefVals = function(id, dicList, vals, level){
                	for(var i=level; i>=0; i--){
                		var dic = dicList[i];
                		if (!dic) continue;
                		var curArea = dic[id];
                		if (curArea){
                			vals[i] = id;
                			var parentId = curArea.parentID;
                			if (parentId && parentId>0 && i>0){
                				findDefVals(parentId, dicList, vals, i-1);
                			}
                			break;
                		}
                	}
                };
                findDefVals(curId, areaDicList, defVals, areaDicList.length-1);
            }
            
            prov.setValue(defVals[0]);
            city.setValue(defVals[1]);
            dist.setValue(defVals[2]);


           
        }
        
        options = $.extend({
            url: null,            //获取省市县区域数据的 URL, 与 data 二者必须设置一个
            data: null,           //省市县数据对象, 与 url 二者必须设置一个
            defaultValue: -1,     //默认选中的地区的 ID, 或者可以使用各层级 ID 的数组
            disabled: [false,false,false],   //设置 省/市/县 3 个级别中哪些级别不显示
            _name_: "省市县多层选择联动插件"
        }, options);
        var selectors = this;
        if (options.data){
            var data = options.data;
            selectors.each(function(){
            	var a = $(this);
            	init.call(a,data);
            });
        } else if (options.url){
            $.ajax({
                type:'GET',
                url:options.url,
                dataType:'json',
                success:function(data){
                    selectors.each(function(){
                        var a = $(this);
                        init.call(a, data);
                    });
                },
                error:function(){
                    selectors.each(function(){
                        var a = $(this);
                        init.call(a, {});
                    });
                }
            });
        }else{
            alert(options._name_ + ": 必须指定 url 或者 data");
        }

    }
})(jQuery);