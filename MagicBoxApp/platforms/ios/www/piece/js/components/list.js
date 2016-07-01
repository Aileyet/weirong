/*
 * 列表组件，最终转换出html5
 * <div id="passenger-list">
 *  <div class="contentScroller">
 *  </div>
 * </div>
 *
 */
define(['zepto', 'underscore', 'components/loader', 'components/cache', 'components/store', 'components/toast', 'iScroll', 'backbone', "components/menu"],
    function($, _, Loader, Cache, Store, Toast, iScroll, Backbone, Menu) {
		
		var myScroll;
        var List = Backbone.View.extend({

            // 渲染组件时，此组件所在上下文，可能未attach到document，所以一些元素查找，
            // 需要在上下文内查找，例如itemTemplate
            elContext: document,

            events: {
                // "": "reload"
                "click .cube-list-item": "onItemSelect"
            },

            requestParams: {},

            config: {
                /*提取到父类*/
                observers: [],
                pageParam: 'page',
                pageSizeParam: 'pageSize',
                topOffset: 51,
                page: 1,
                pageSize: 10,
                pullDownEnable: false,
                isPullDownRefresh: false,
                sizeLimit: false,
                iScroll: false,
                height:false,
                method: 'GET',
                filterStr: null,
                momentum: true
            },

            request: null,

            initialize: function() {
                this.requestParams = {};
                var me = this;
                //获取传入参数
                if (arguments && arguments.length > 0) {
                    var config = arguments[0];
                    //这样取得的config将会被几个list共享
                    // this.config = _.extend(this.config, object);

                    var key;
                    for (key in config) {
                        if (key in this) this[key] = config[key];
                    }

                    var obj = {};
                    for (var configKey in this.config) {
                        obj[configKey] = this.config[configKey];
                    }
                    for (var argkey in config) {
                        obj[argkey] = config[argkey];
                    }
                    this.config = obj;
                }
                
                //iScroll
                if (this.config.iScroll != 'false') {
                	var pullDownEl = this.el.querySelector("#pullDown");
                	var pullUpEl = this.el.querySelector("#pullUp");
                	var pullDownOffset = this.config.topOffset;
                	var pullUpOffset = this.config.topOffset;
                	
                	myScroll = new iScroll(me.config.el, {
                		scrollbarClass: 'myScrollbar', /* 重要样式 */
                		useTransition: false, /* 此属性不知用意，本人从true改为false */
                		topOffset: pullDownOffset,
                		vScrollbar:true,
                		onRefresh: function () {
                			if (pullDownEl.className.match('loading')) {
                				pullDownEl.className = '';
                				pullDownEl.querySelector('.pullDownLabel').innerHTML = '下拉刷新...';
                			} else if (pullUpEl.className.match('loading')) {
                				pullUpEl.className = '';
                				pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉加载更多...';
                			}
                		},
                		onScrollMove: function () {
                			if (this.y > 5 && this.dirY==-1 &&  !pullDownEl.className.match('flip')) {
                				pullDownEl.className = 'flip';
                				pullDownEl.querySelector('.pullDownLabel').innerHTML = '松手开始更新...';
                				this.minScrollY = 0;
                			} else if (this.y < 5 && pullDownEl.className.match('flip')) {
                				pullDownEl.className = '';
                				pullDownEl.querySelector('.pullDownLabel').innerHTML = '下拉刷新...';
                				this.minScrollY = -pullDownOffset;
                			} else if (this.y < (this.maxScrollY - 5) && this.dirY==1 && !pullUpEl.className.match('flip') 
                					&& !pullUpEl.className.match('no-more-record')) {
                				pullUpEl.className = 'flip';
                				pullUpEl.querySelector('.pullUpLabel').innerHTML = '松手开始更新...';
                				this.maxScrollY = this.maxScrollY
                			} else if (this.y > (this.maxScrollY + 5) && pullUpEl.className.match('flip')) {
                				pullUpEl.className = '';
                				pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉加载更多...';
                				this.maxScrollY = pullUpOffset;
                			}
                			return false;
                		},
                		onScrollEnd: function () {
                			if (pullDownEl.className.match('flip')) {
                				pullDownEl.className = 'loading';
                				pullDownEl.querySelector('.pullDownLabel').innerHTML = '加载中...';				
                				me.pullDownAction(this);	// Execute custom function (ajax call?)
                			} else if (pullUpEl.className.match('flip')) {
                				pullUpEl.className = 'loading';
                				pullUpEl.querySelector('.pullUpLabel').innerHTML = '加载中...';				
                				me.pullUpAction(this);	// Execute custom function (ajax call?)
                			}
                		}
                	});
                	
                	this.config.scroller = myScroll;
                } else {
                	if (this.config.sizeLimit != true || this.config.sizeLimit != "true") {
                		me.config.pageSize = 100;
                	}
                }
            },
            
            /**
             * 重写加载
             */
            reload: function() {
            	this.config.page = 1;
                this.cleanStoreListData();
                this.request();
            },
            
            /**
             * 服务器请求方法调用
             */
            setRequestParams: function() {
            	this.requestParams = _.extend(this.requestParams, this.reqObj.params || {});
                this.reload();
            },
            
            /**
             * 请求本地
             */
            loadListByStoreData : function() {
            	this.requestParams = _.extend(this.requestParams, this.reqObj.params || {});
            	this.appendHtml();
            },
            
            createMenu : function() {
            	var menuId = this.config.id;
            	if ($("#menu_" + menuId).length == 0) {
            		this.menu = new Menu({
            			id : menuId,
            			selector : ".cube-list-item",
            			items : this.reqObj.items || ""
            		});
            	}
            },
            /**
             * 下拉刷新 （自定义实现此方法）
             * myScroll.refresh();		// 数据加载完成后，调用界面更新方法
             */
            pullDownAction :function () {
            	this.reload();
            },

            /**
             * 滚动翻页 （自定义实现此方法）
             * myScroll.refresh();		// 数据加载完成后，调用界面更新方法
             */
            pullUpAction : function() {
            	this.config.page++;
        		this.request();
            },
            
            /**
             * 到服务器请求数据
             */
            request: function(){
            	var me = this;
            	me.requestParams[me.config.pageParam] = this.config['page'];
                me.requestParams['pageSize'] = me.config['pageSize'];
                
                $.ajax({
                    timeout: 20 * 1000,
                    traditional: true,
                    url: me.config['url'],
                    type: me.config['method'],
                    cache:false,
                    data: me.requestParams,
                    dataType: "jsonp",
                    complete: function() {
                        if (me.reqObj.callback) {
                        	me.reqObj.callback();
                        }
                    }, success: function(data, textStatus, jqXHR) {
    				    var dataList = data.dataList;
    				    me.storeListData(dataList);
    				    me.appendHtml();
                    	
                    }, error: function(e, xhr, type) {
                        me.config.page = me.config.page - 1;
                        new Toast("服务器出错，请重试！");
                    }
                });
            },
            appendHtml : function() {
            	var me = this;
                var listHtml ="";
			    var itemTemplateName = me.config['_itemTemplate'];
			    var itemTemplate = itemTemplateName ? $(me.elContext).find("#" + itemTemplateName).html() : "";
				var dataList = me.getDataList();
				
				if (!dataList || dataList.length === 0) {
					$(me.config.el).find("#pullUp").addClass("no-more-record");
				} else {
				   	for (var i = 0; i < dataList.length; i++) {
						listHtml += "<li class='cube-list-item'>" + _.template(itemTemplate, dataList[i]) + "</li>";
					}
				   	me.checkRecord(dataList)
				}
            	$(me.config.el).find("ul").html(listHtml);
            	me.createMenu();
            	me.refresh();
            },
            refresh: function() {
        	    if (this.config.scroller && this.config.scroller != "false") {
                    $(this.config.el).height(this.config.height || document.body.clientHeight - $(this.config.el).offset().top - 
                     		($("footer.footer-menu").height() || 0));
			    	//数据加载完成后，调用界面更新方法   
	    	    	this.config.scroller.refresh();	
				}
            },
            checkRecord : function(dataList) {
            	var me = this;
    		    if (dataList.length% me.config.pageSize != 0 && me.config.scroller != "false") {
            		$(me.config.el).find("#pullUp").addClass("no-more-record");
            	} else {
            		$(me.config.el).find("#pullUp").removeClass("no-more-record");
            	}
            },
            /**
             * 存入数据
             */
            storeListData: function(dataList) {
            	if (!dataList || dataList.length === 0) {
				    return;
				}
                var CACHE_ID = 'cube-list-' + this.config['id'];
                var tempConfig = this.config;
//                tempConfig['el'] = null;
//                tempConfig['elContext'] = null;

                Store.saveObject(CACHE_ID + "-params", this.requestParams);
                
                var listStore =  Store.loadObject(CACHE_ID) || [];
                // 把当前list的数据保存起来，方便以后直接拿出来。
            	for (var i = 0; i < dataList.length; i++) {
            		listStore.push(dataList[i]);
				}
                Store.saveObject(CACHE_ID, listStore);
            },
            
            isExistStoreData: function(obj) {
            	var listName = "cube-list-" + obj.listName;
            	if (Piece.Store.loadObject(listName) != "null" && Piece.Store.loadObject(listName)) {
                	var listParams = Piece.Store.loadObject(listName + "-params") || "{}";
                	for (var p in obj.params) {
                		if (obj.params[p] != listParams[p]){
                			return false;
                		}
                	}
                	return true;
                } 
                return false;
            },
            
            getDataList: function() {
                return Store.loadObject( 'cube-list-' + this.config['id']);   
           },
           
            cleanStoreListData: function() {
                var CACHE_ID = 'cube-list-' + this.config['id'];
                Store.deleteObject(CACHE_ID);
                Store.deleteObject(CACHE_ID + "-params");
            },

            clearList: function() {
            }
        }, {
            parseConfig: function(element, attNameList) {

                var jqObject = $(element);

                var config = {};
                for (var i = 0; i < attNameList.length; i++) {
                    var key = attNameList[i];
                    var value = jqObject.attr(key);
                    if (value) config[key] = value;
                }

                return config;
            },

            compile: function(elContext) {
                var me = this;
                return _.map($(elContext).find("list"), function(tag) {
                    var config = me.parseConfig(tag, ['id', 'itemTemplate', '_itemTemplate', 'moreItemElement', 'url', 'method', 'jsonRoot', 'class', 'sizeLimit', 'iScroll', 'isPullDownRefresh', 'autoLoad', 'pageParam', 'searching', 'searchkeys', 'filterStr', 'pageSize', 'skin', 'loaderText', 'searchText', 'width', 'height', 'additionHeight']);
                    // list 列表节点
                    var list_el = document.createElement('div');
                    list_el.setAttribute('id', config.id);
                    list_el.setAttribute('data-component', 'list');
                    $(list_el).css("position", "relative");
                    
                    //整体滚动容器
                    var scroller_el = document.createElement('div');
                    $(scroller_el).addClass('contentScroller');
                    list_el.appendChild(scroller_el);
                    
                    // 添加下拉文字层
                    var pullDownHtml = "";
                    pullDownHtml += 
                    		"<div class='pullDown' id='pullDown'>"
                    			+ "<span class='pullDownIcon'></span><span class='pullDownLabel'>下拉刷新...</span>"
                    		+ "</div>" 
                    
                    var ulHtml = "<ul></ul>";
                    var pullUpHtml =
                    	"<div id='pullUp' class='pullUp'>"
                    			+ "<span class='pullUpIcon'></span><span class='pullUpLabel'>上拉加载更多...</span>"
                    			+ "<div class='more-record-text'>无更多相关记录</div>"
                    	 +"</div>"
                    var html = config.iScroll != "false"  ?  pullDownHtml+ulHtml + pullUpHtml : ulHtml;
                    $(list_el).find(".contentScroller").append(html);
                    config['el'] = list_el;
                    config.elContext = elContext;
                    
                    var list = new List(config);
                    
                    this.$(tag).replaceWith(list_el);
                    
                    // header 50 navicat 20 margin 20 = 90 
                    return list;
                });
            }
        });

        return List;
    });