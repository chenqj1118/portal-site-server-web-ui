require("..");
window.$ = window.jQuery = require("jquery");

window.doTest = function () {
    var areaData = './data.js';
    /*test0 options所有值-----------------------------------------------*/
/*    var options0{
         url: null,            //获取省市县区域数据的 URL, 与 data 二者必须设置一个
         data: null,           //省市县数据对象, 与 url 二者必须设置一个
         defaultValue: -1,     //默认选中的地区的 ID, 或者可以使用各层级 ID 的数组
         disabled: [false,false,false],   //设置 省/市/县 3 个级别中哪些级别不显示  true 不显示
         _name_: "省市县多层选择联动插件"
    };*/
/* test1: 没默认值选择---------------------------------------*/
    var options = {
        url: areaData
    };
    $('#addrRegst').areaSelect(options);
/*test2:有默认值选择---------------------------------------*/
    var EArea = [87539, 87539, 523808];//默认值参数
    var options1 = {
        url: areaData,
        //disabled: [false,true,true],
        defaultValue: EArea
    }
    $('#addrE').areaSelect(options1);
/*test3:data数据模型---------------------------------------------------*/
    var dataTest = [{
        "children": [{
            "children": [{"children": [], "id": 523815, "level": 3, "name": "平谷区", "parentID": 87539}, {
                "children": [],
                "id": 523817,
                "level": 3,
                "name": "密云县",
                "parentID": 87539
            }, {"children": [], "id": 523818, "level": 3, "name": "延庆县", "parentID": 87539}],
            "id": 87539,
            "level": 2,
            "name": "北京市",
            "parentID": 87539
        }], "id": 87539, "level": 1, "name": "北京市", "parentID": -1
    }];
    var options2 = {
        data: dataTest
    };
    $('#dataTest').areaSelect(options2);
};












