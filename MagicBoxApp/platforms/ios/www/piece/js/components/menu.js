/*
 * 
 */
define(['zepto', 'underscore', ''], function($, _){

//    this.config = {
//    	id : "_default",
//     selector:"",
//    	showIcon:false
//    	items : [{
//    		iconCls : "", 图标样式
//    		text : "", 显示文本
//    		click : function(event) {
//    			//点击监听的方法
//    		},{}
//    	]}
//    }
    //暂时最多只支持两个按钮
    var Menu = function(config){
        this.config = config;
        
        var items = this.config.items;
        for (var i = 0; i < items.length && !this.config.showIcon; i++) {
			 if (items[i].iconCls) {
				 this.config.showIcon = true;
				 break;
			 }
		}
        
        this.render(items);
        this.addEvents();
    };
    
    function preventDefault(e) {
        e = e || window.event;
        if (e.preventDefault)
            e.preventDefault();
        e.returnValue = false;  
    };
    
    Menu.prototype = {
    		render : function(items) {
    			var html = 
			        '<div class="menu" id="menu_' + this.config.id + '">'
			        	+ '<div class="menu-inner" >'
				    		+ '<ul class="nav nav-list">';
		        
		        html += this.getItemsHtml(items);
		        html += '</ul></div></div>'  
		        	   + '<div class="modal" id="modal_' + this.config.id + '"></div>';
		        $("body").append(html);
		        this.config.menu = $("#menu_" + this.config.id);
		        // 调整好位置
		        this.goodPostion();
		        this.hide();
    		},
    		refreshItems : function(items) {
    			var html = this.getItemsHtml();
    			this.config.menu.find("ul").html(html);
    		},
    		getItemsHtml : function(items) {
    		    var html = "";
    		    for (var i = 0; i < items.length; i++) {
  		        	var iconCls = "";
  		        	if (!items[i].iconCls && this.config.showIcon) {
  		        		iconCls = "blank";
  		        	}
  					html += '<li class="' + iconCls +'"> <a href="#"><i class="'+ items[i].iconCls +'"></i>' + items[i].text + '</a></li>';
  				}
    		    return html;
    		},
    		addEvents : function() {
    			this.touchEvents();
    			this.menuEvents();
    		},
    		touchEvents : function() {
    			var me = this;
    			var clickNode = $(this.config.selector);
    			this.menuTimer = null; 
    			this.config.preventDefault = false;
    			this.config.postion = {};
    			
    			clickNode.live({
    				"touchstart" : function(event) {  
	    				me.config.target = me.getParentNode(event, ".cube-list-item");
	    				// 不做判断否则会出现 先touchend出发在出发start定时器的bug
	    				if (!this.menuTimer) {
	    					this.menuTimer = setTimeout(function() {  
		    			        me.show();
		    			    }, 1000);  
	    				}
	    				return false;
    				},"touchmove" : function(event) {
    					clearTimeout(this.menuTimer); 
    				}, "touchend" : function(even) {
//    					console.info("clickNode---touchend"+this.menuTimer);
    					clearTimeout(this.menuTimer); 
    				}, "mouseout" : function() {
    					clearTimeout(this.menuTimer);
    					return false;
    				}
    			});  
    			  
    		},
    		menuEvents : function() {
    			var me = this;
    			this.config.menu.bind("mousedown",function(event){
    	    		var item = me.getParentNode(event, "li");
    	    		item.addClass("active").removeClass("active");
    	    	})
    	    	
    	    	// 触发的事件
    	    	this.config.menu.live("click",function(event){
    	    		var index = me.getParentNode(event, "li").index();
    	    		me.config.items[index].click.call(me, event);
    	    		me.hide();
    	    	})
    	    	
    	    	$("#modal_" + this.config.id).live("click",function(){
    	    		me.hide();
    	    	});
    		},
    	    hide : function() {
    	        var id = this.config.id;
    	        $("#menu_" + id).hide();
    	        $("#modal_" + id).hide();
    	    },
    	    show : function() {
    	        var id = this.config.id;
    	        console.info("id ------" + id);
    	        $("#menu_" + id).show();
    	        $("#modal_" + id).show();
    	    },
    	    goodPostion : function() {
    	    	var menu = this.config.menu;
    	    	menu.css("margin-top", (-menu.height()) + "px");
    	    },
    		/**
    		 * 获取冒泡父类的节点对象
    		 * 
    		 * @event 事件event
    		 * @param 选择匹配参数 
    		 * 
    		 *  @example getParentNode(event, ".star");
    		 *  获取样式为star的父节点
    		 */
    		getParentNode : function(event, param) {
    			var target = $(event.target);
    			return target.is(param) ? target : target.parents(param);
    		}
    }

    return Menu;
});