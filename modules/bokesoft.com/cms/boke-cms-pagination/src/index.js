"use strict";

/* The implementations */
//window.jQuery=window.$=require("jquery");
var $ = require("jquery");
require("lodash");
require("./css/style.css");

$["fn"]["paging"] = function(number, opts) {

    var self = this,
        Paging = {

            "setOptions": function(opts) {

                var parseFormat = function(format) {

                    var gndx = 0, group = 0, num = 1, res = {
                        fstack:         [], // format stack
                        asterisk:       0, // asterisk?
                        inactive:       0, // fill empty pages with inactives up to w?
                        blockwide:      5, // width of number block
                        current:        3, // position of current element in number block
                        rights:         0, // num of rights
                        lefts:          0 // num of lefts
                    }, tok, pattern = /[*<>pq\[\]().-]|[nc]+!?/g;

                    var known = {
                        "[": "first",
                        "]": "last",
                        "<": "prev",
                        ">": "next",
                        "q": "left",
                        "p": "right",
                        "-": "fill",
                        ".": "leap"
                    }, count = {};

                    while ((tok = pattern["exec"](format))) {

                        tok = "" + (tok);

                        if (undefined === known[tok]) {

                            if ("(" === tok) {
                                group = ++gndx;
                            } else if (")" === tok) {
                                group = 0;
                            } else if (num) {

                                if ("*" === tok) {
                                    res.asterisk = 1;
                                    res.inactive = 0;
                                } else {
                                    // number block is the only thing left here
                                    res.asterisk = 0;
                                    res.inactive = "!" === tok.charAt(tok.length - 1);
                                    res.blockwide = tok["length"] - res.inactive;
                                    if (!(res.current = 1 + tok.indexOf("c"))) {
                                        res.current = (1 + res.blockwide) >> 1;
                                    }
                                }

                                res.fstack[res.fstack.length] = ({
                                    ftype: "block",	// type
                                    fgroup: 0,		// group
                                    fpos: 0		// pos
                                });
                                num = 0;
                            }

                        } else {

                            res.fstack[res.fstack.length] = ({
                                ftype: known[tok], // type
                                fgroup: group,      // group
                                fpos: undefined === count[tok] ? count[tok] = 1 : ++count[tok] // pos
                            });

                            if ("q" === tok)
                                ++res.lefts;
                            else if ("p" === tok)
                                ++res.rights;
                        }
                    }
                    return res;
                };

                Paging.opts = $.extend(Paging.opts || {
                        "lapping"		: 0,	// number of elements overlap
                        "perpage"           : 10,	// number of elements per page
                        "page"              : 1,	// current page
                        "refresh"		: {
                            "interval": 10,
                            "url": null
                        },	// refresh callback information

                        "format"		: "",	// visual format string

                        "lock"              : false, // set to true, if you want to disable the pagination for a while.

                        "onFormat"		: function (type) {	// callback for every format element

                            /** EXAMPLE **

                             switch (type) {

							case 'block':

								if (!this.active)
									return '<span class="disabled">' + this.value + '</span>';
								else if (this.value != this.page)
									return '<em><a href="#' + this.value + '">' + this.value + '</a></em>';
								return '<span class="current">' + this.value + '</span>';

							case 'right':
							case 'left':

								if (!this.active) {
									return "";
								}
								return '<a href="#' + this.value + '">' + this.value + '</a>';

							case 'next':

								if (this.active) {
									return '<a href="#' + this.value + '" class="next">Next &raquo;</a>';
								}
								return '<span class="disabled">Next &raquo;</span>';

							case 'prev':

								if (this.active) {
									return '<a href="#' + this.value + '" class="prev">&laquo; Previous</a>';
								}
								return '<span class="disabled">&laquo; Previous</span>';

							case 'first':

								if (this.active) {
									return '<a href="#' + this.value + '" class="first">|&lt;</a>';
								}
								return '<span class="disabled">|&lt;</span>';

							case 'last':

								if (this.active) {
									return '<a href="#' + this.value + '" class="prev">&gt;|</a>';
								}
								return '<span class="disabled">&gt;|</span>';

							case 'fill':
								if (this.active) {
									return "...";
								}
						}
                             return ""; // return nothing for missing branches

                             **/
                        },
                        "onSelect"		: function (page){	// callback for page selection

                            /** EXAMPLE SLICE **

                             var data = this.slice;

                             content.slice(prev[0], prev[1]).css('display', 'none');
                             content.slice(data[0], data[1]).css('display', 'block');

                             prev = data;

                             **/


                            /** EXAMPLE AJAX **

                             $.ajax({
							"url": '/data.php?start=' + this.slice[0] + '&end=' + this.slice[1] + '&page=' + page,
							"success": function(data) {
								// content replace
							}
						});

                             **/

                            // Return code indicates if the link of the clicked format element should be followed (otherwise only the click-event is used)
                            return true;
                        },
                        "onRefresh"		: function (json) {// callback for new data of refresh api

                            /** EXAMPLE **
                             if (json.number) {
							Paging.setNumber(json.number);
						}

                             if (json.options) {
							Paging.setOptions(json.options);
						}

                             Paging.setPage(); // Call with empty params to reload the paginator
                             **/
                        }
                    }, opts || {});

                Paging.opts["lapping"]|= 0;
                Paging.opts["perpage"]|= 0;
                if (Paging.opts["page"] !== null)
                    Paging.opts["page"]   |= 0;

                // If the number of elements per page is less then 1, set it to default
                if (Paging.opts["perpage"] < 1) {
                    Paging.opts["perpage"] = 10;
                }

                if (Paging.interval) window.clearInterval(Paging.interval);

                if (Paging.opts["refresh"]["url"]) {

                    Paging.interval = window.setInterval(function() {

                        $["ajax"]({
                            "url": Paging.opts["refresh"]["url"],
                            "success": function(data) {

                                if (typeof(data) === "string") {

                                    try {
                                        data = $["parseJSON"](data);
                                    } catch (o) {
                                        return;
                                    }
                                }
                                Paging.opts["onRefresh"](data);
                            }
                        });

                    }, 1000 * Paging.opts["refresh"]["interval"]);
                }

                Paging.format = parseFormat(Paging.opts["format"]);
                return Paging;
            },

            "setNumber": function(number) {
                Paging.number = (undefined === number || number < 0) ? -1 : number;
                return Paging;
            },

            "setPage": function(page) {

                if (Paging.opts["lock"]) {
                    Paging.opts["onSelect"](0, self);
                    return Paging;
                }

                if (undefined === page) {

                    page = Paging.opts["page"];

                    if (null === page) {
                        return Paging;
                    }

                } else if (Paging.opts["page"] == page) { // Necessary to be ==, not ===
                    return Paging;
                }

                Paging.opts["page"] = (page|= 0);

                var number = Paging.number;
                var opts = Paging.opts;

                var rStart, rStop;

                var pages, buffer;

                var groups = 1, format = Paging.format;

                var data, tmp, node, lapping;

                var count = format.fstack["length"], i = count;


                // If the lapping is greater than perpage, reduce it to perpage - 1 to avoid endless loops
                if (opts["perpage"] <= opts["lapping"]) {
                    opts["lapping"] = opts["perpage"] - 1;
                }

                lapping = number <= opts["lapping"] ? 0 : opts["lapping"]|0;


                // If the number is negative, the value doesn"t matter, we loop endlessly with a constant width
                if (number < 0) {

                    number = -1;
                    pages = -1;

                    rStart = Math.max(1, page - format.current + 1 - lapping);
                    rStop  = rStart + format.blockwide;

                } else {

                    /* Calculate the number of pages
                     *
                     * Variables:
                     * - n: Number of elements
                     * - p: Elements per page
                     * - o: Offset (lapping)
                     * - x: Position of last n (aka virtual number of elements)
                     * - m: Height aka number of pages
                     *
                     * Condition: o < p
                     *
                     * Page             Last element of page
                     * =====================================
                     * 1                p
                     * 2                2p - o
                     * 3                3p - 2o
                     * ...
                     * k                kp - (k - 1)o
                     * k + 1            (k + 1)p - ko
                     *
                     *  => kp - (k - 1)o < n <= (k + 1)p - ko       (n is on page k+1)
                     * <=> k(p - o) + o < n <= k(p - o) + p
                     * <=> (n - p) / (p - o) <= k < (n - o) / (p - o)
                     *  => k = ceil((n - p) / (p - o))
                     *
                     * We know that kp - ko + i = n
                     *  => i = n - k(p - o)
                     *
                     *  => m = k + 1
                     *     x = kp + i
                     */
                    pages = 1 + Math.ceil((number - opts["perpage"]) / (opts["perpage"] - lapping));

                    // If current page is negative, start at the end and
                    // Set the current page into a valid range, includes 0, which is set to 1
                    page = Math.max(1, Math.min(page < 0 ? 1 + pages + page : page, pages));

                    // Do we need to print all numbers?
                    if (format.asterisk) {
                        rStart = 1;
                        rStop  = 1 + pages;

                        // Disable :first and :last for asterisk mode as we see all buttons
                        format.current   = page;
                        format.blockwide = pages;

                    } else {

                        // If no, start at the best position and stop at max width or at num of pages
                        rStart = Math.max(1, Math.min(page - format.current, pages - format.blockwide) + 1);
                        rStop = format.inactive ? rStart + format.blockwide : Math.min(rStart + format.blockwide, 1 + pages);
                    }
                }

                while (i--) {

                    tmp = 0; // default everything is visible
                    node = format.fstack[i];

                    switch (node.ftype) {

                        case "left":
                            tmp = (node.fpos < rStart);
                            break;
                        case "right":
                            tmp = (rStop <= pages - format.rights + node.fpos);
                            break;

                        case "first":
                            tmp = (format.current < page);
                            break;
                        case "last":
                            tmp = (format.blockwide < format.current + pages - page);
                            break;

                        case "prev":
                            tmp = (1 < page);
                            break;
                        case "next":
                            tmp = (page < pages);
                            break;
                    }
                    groups|= tmp << node.fgroup; // group visible?
                }

                data = {
                    "number"	: number,	// number of elements
                    "lapping"	: lapping,	// overlapping
                    "pages"		: pages,	// number of pages
                    "perpage"	: opts["perpage"], // number of elements per page
                    "page"		: page,		// current page
                    "slice"		: [			// two element array with bounds of the current page selection
                        (tmp = page * (opts["perpage"] - lapping) + lapping) - opts["perpage"], // Lower bound
                        Math.min(tmp, number) // Upper bound
                    ]
                };

                buffer = "";

                function buffer_append(opts, data, type) {

                    type = "" + (opts["onFormat"].call(data, type));

                    if (data["value"])
                        buffer+= type.replace(/<a/i, '<a data-page="' + data["value"] + '"');
                    else
                        buffer+= type;
                }

                while (++i < count) {

                    node = format.fstack[i];

                    tmp = (groups >> node.fgroup & 1);

                    switch (node.ftype) {
                        case "block":
                            for (; rStart < rStop; ++rStart) {

                                data["value"]      = rStart;
                                data["pos"]	       = 1 + format.blockwide - rStop + rStart;

                                data["active"]     = rStart <= pages || number < 0;     // true if infinity series and rStart <= pages
                                data["first"]      = 1 === rStart;                      // check if it is the first page
                                data["last"]       = rStart === pages && 0 < number;    // false if infinity series or rStart != pages

                                buffer_append(opts, data, node.ftype);
                            }
                            continue;

                        case "left":
                            data["value"]      = node.fpos;
                            data["active"]     = node.fpos < rStart; // Don't take group-visibility into account!
                            break;

                        case "right":
                            data["value"]      = pages - format.rights + node.fpos;
                            data["active"]     = rStop <= data["value"]; // Don't take group-visibility into account!
                            break;

                        case "first":
                            data["value"]      = 1;
                            data["active"]     = tmp && 1 < page;
                            break;

                        case "prev":
                            data["value"]      = Math.max(1, page - 1);
                            data["active"]     = tmp && 1 < page;
                            break;

                        case "last":
                            if ((data["active"]	   = (number < 0))) {
                                data["value"]      = 1 + page;
                            } else {
                                data["value"]      = pages;
                                data["active"]     = tmp && page < pages;
                            }
                            break;

                        case "next":
                            if ((data["active"]	   = (number < 0))) {
                                data["value"]      = 1 + page;
                            } else {
                                data["value"]      = Math.min(1 + page, pages);
                                data["active"]     = tmp && page < pages;
                            }
                            break;

                        case "leap":
                        case "fill":
                            data["pos"]        = node.fpos;
                            data["active"]     = tmp; // tmp is true by default and changes only for group behaviour
                            buffer_append(opts, data, node.ftype);
                            continue;
                    }

                    data["pos"]   = node.fpos;
                    data["last"]  = /* void */
                        data["first"] = undefined;

                    buffer_append(opts, data, node.ftype);
                }

                if (self.length) {

                    $("a", self["html"](buffer)).click(function(ev) {
                        ev["preventDefault"]();

                        var obj = this;

                        do {

                            if ('a' === obj["nodeName"].toLowerCase()) {
                                break;
                            }

                        } while ((obj = obj["parentNode"]));

                        Paging["setPage"]($(obj).data("page"));

                        if (Paging.locate) {
                            window.location = obj["href"];
                        }
                    });

                    Paging.locate = opts["onSelect"].call({
                        "number"	: number,
                        "lapping"	: lapping,
                        "pages"		: pages,
                        "slice"		: data["slice"]
                    }, page, self, Paging);
                }
                return Paging;
            }
        };

    return Paging
        ["setNumber"](number)
        ["setOptions"](opts)
        ["setPage"]();
};

/**
 * 与后台 PagingSearchResult 对象配合实现的分页显示数据功能；
 * <ul>
 *  <li>依赖：jQuery、lodash、jQuery-Paging</li>
 * </ul>
 * @param options 分页显示参数
 * <ul>
 *  <li>pager：用于显示分页组件的页面元素选择器, 与 selectorGroup 其一必填</li>
 *  <li>render：用于显示数据的页面元素选择器, 与 selectorGroup 其一必填</li>
 *  <li>tmpl：用于存放 lodash 模板的页面元素选择器, 与 selectorGroup 其一必填</li>
 *  <li>selectorGroup：用于统一定义 -pager、-render、-tmpl 3 个选择器, 与 pager/render/tmpl 其一必填</li>
 *  <li>format：分页组件的显示样式, 可选，默认为 '[< ncnnn! >]' </li>
 *  <li>pagingData：分页查询数据对象，包含 totalCount、pageNo、pageSize 以及 data 等属性，可选</li>
 *  <li>dataCallback：在多页跳转时由 Pager 回调的获取数据代码，必填，包含两个参数:
 *   <ul>
 *    <li>pageNo: 跳转到的页码(从0开始)</li>
 *    <li>callback: 传入当前页 分页查询结果数据对象 的回调，供 pager 刷新数据显示</li>
 *   </ul>
 *  </li>
 *  <li>afterRender：模板渲染完成事件，一般用于对模板进行事件绑定, this 对象为 render 页面元素选择器，可选</li>
 * </ul>
 */
var pagingShow = function(options){
    //基本选项
    if (options.selectorGroup){
        if (! options.pager) options.pager=options.selectorGroup+"-pager";
        if (! options.render) options.render=options.selectorGroup+"-render";
        if (! options.tmpl) options.tmpl=options.selectorGroup+"-tmpl";
    }
    var pagerSelector = options.pager;
    var renderSelector = options.render;

    //跳转页数
    var gotoSelector = options.goToPage || "";
    //
    var needRender = (options.needRender===false)?false:true;
    //默认页数
    var defaultPage = options.defaultPageNo || 1;
    //显示格式
    var pagerFormat = options.format || '[< ncnnn >]';
	
	//与显示相关的页面元素
    var $pager = $(pagerSelector),
		$render = $(renderSelector),
		loadingIcon = options.loadingIconUrl || require("./images/loading.gif");
	$render.css("position","relative").empty()
		   .append("<div class='boke-cms-ajax-loading'><img src='"+loadingIcon+"'/></div>"
				  +"<div class='boke-cms-ajax-content'></div>");
	var $renderContent = $render.find(".boke-cms-ajax-content");	
	
	
    $pager.find(".PagerViewMain").length || $pager.addClass("PagerView clearfix").empty()
		  .append("<div class='PagerViewLeft totalRecords'></div>"
			     +"<div class='PagerViewMain pagerContent'></div>"
			     +"<div class='PagerViewRight'></div>");
	var $pagerContent = $pager.find(".PagerViewMain");
	
    //获取数据方法
    var dataCallback = function(pageNo, callback){
        var pager = this;
        var ajax = require("boke-cms-ajax");
		var jsonData = options.data;
		jsonData[options.pageNoFieldName] = pageNo;
        ajax.post(
            options.url,jsonData,
            function(pageData){
                callback.call(pager, pageData);
            },{loadingSelector: ".boke-cms-ajax-loading"}
        );
    };

    //初始数据及分页选项
    var firstPagingData = options.pagingData;
    var $gotoSelector = $(gotoSelector);

    //模板
    var resultTmpl = options.tmplStr || $(options.tmpl).html();
    var tmplCache = _.template(resultTmpl);
    var afterRender = options.afterRender;
    var renderTmpl = function(pagingData){
        $renderContent.find("*").unbind();	//unbind 所有模板内容的事件
        $renderContent.empty();
        $renderContent.append(tmplCache({items:pagingData.data}));
		$pager.find('.PagerViewLeft').html("<span>共</span><i class='num'>"+pagingData.totalRecords+"</i><span>条记录</span>");
        if($gotoSelector.length && $pagerContent.html().indexOf($gotoSelector.html()) < 0){
            $pager.find(".PagerViewRight").html($gotoSelector.html());
			$pager.find('[name=pageNum]').attr("max",pagingData.pageCount);
        }
        if (afterRender){
            afterRender.call($renderContent,pagingData);
        }
    }
    //分页
    var createPager = function($pager, firstPagingData, pagerFormat, dataCallback){
        //FIXME: 暂时只能把初始数据记录到 pager 节点上
        $pager.data("firstPagingData", firstPagingData);
        //数据刷新的回调
        var dataReceiver = function(pagingData,setpage){
            renderTmpl(pagingData);
            var pager = this;
            pager.setNumber(pagingData.totalRecords);
            pager.setOptions({perpage:pagingData.pageSize});
            if(true === setpage) pager.setPage(pagingData.pageNo+1);
        };
        var totalRecords = firstPagingData.totalRecords;
        var pageSize = firstPagingData.pageSize;
        var x = $pager.paging(totalRecords, {
            format: pagerFormat,
            perpage: pageSize,
            lapping: 0,
            page: firstPagingData.pageNo+1,
            onSelect: function (page,self,paging) {
                //var pager = $(this).paging(); //pager对象
                var pager = paging;
                var firstPagingData = $pager.data("firstPagingData");
                if (firstPagingData){
                    $pager.data("firstPagingData", null);
                    dataReceiver.call(pager, firstPagingData,true);
                }
                else if(needRender){
                    var pageNo = page-1;
                    var callback = dataReceiver;
                    dataCallback.call(pager, pageNo, callback);
                }
                else {
                    dataCallback.call({},page-1);
                }
            },
            onFormat: function (type) {
                var render = function(txt, active, isCurrent){
                    if (active){
                        return '<a class="pager-active" href="javascript:void(0)">' + txt + '</a>';
                    }else{
                        if(isCurrent) return '<span class="pager-inactive cur-page">'+txt+'</span>'
                        else return '<span class="pager-inactive">'+txt+'</span>'
                    }
                }
                switch (type) {
                    case 'block': // n and c
                        if(this.value > this.pages) return "";
                        return render(this.value, (this.active)&&(this.value!=this.page), true);
                    case 'next': // >
                        return render("下一页", this.active);
                    case 'prev': // <
                        return render("上一页", this.active);
                    case 'first': // [
                        return render("首页", this.active);
                    case 'last': // ]
                        return render("末页", this.active);
                    case 'left':
                    case 'right':
                        if (!this.active) return '';
                        return render(this.value, this.active);
                    case "leap":
                        if (this.active)
                            return "   ";
                        return "";
                    case 'fill':
                        if (this.active)
                            return "...";
                        return "";
                }
            }
        });
    };
    if (firstPagingData){
        createPager($pagerContent, firstPagingData, pagerFormat, dataCallback);
    }else{
        dataCallback.call({}/*获取初始数据时this为空对象*/, defaultPage-1, function(pagingData){
            createPager($pagerContent, pagingData, pagerFormat, dataCallback);
        });
    }
};

/** Define the export point for module */
module.exports = {
    pagingShow: pagingShow
}

