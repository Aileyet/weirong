define(['zepto'], function($) {
	var pageName;
	var Drag={
			initView:function(pageN){
				pageName = pageN;
				var wid=$(".menu-box").width();
				var hei=$(".menu-box").height();
				var jsonstr=null,orderStr=null;
				if(window.localStorage){
					jsonstr=localStorage.getItem(pageName+"_menuDragOrder");
					orderStr=localStorage.getItem(pageName+"_menuDragInfo");
				}
				if(jsonstr==null || orderStr==null){
					Drag.initMenu(wid,hei);
				}else{
					Drag.initMenuOfJson(wid,hei,jsonstr,orderStr);
				}
			
				if(pageN == "home_MeIndex"){
					Drag.initFun(wid,hei);
				}
				
				//删除图标
				$(".close-icon").on("tap",function(e){
					$(e.target).parent().remove();
					var order = $(e.target).parent().find(".menu-view").attr("order");
					orderStr=localStorage.getItem(pageName+"_menuDragInfo");
					var orderArray=JSON.parse(orderStr);
					var newOrderArray = new Array(),deleteArray,
						deleteStr=localStorage.getItem(pageName+"_deleteMenuInfo");
					if(deleteStr == null){
						deleteArray = new Array()
					}else{
						deleteArray = JSON.parse(deleteStr);
					}
					var count = 0;
					for(var i=0;i<orderArray.length;i++){
						var orderObj =  orderArray[i];
						if(orderObj.order != order){
							newOrderArray[count] = orderObj;
							count++;
						}else{
							deleteArray[deleteArray.length] = orderObj;
						}
					}
					//删除的菜单
					localStorage.setItem(pageName+"_deleteMenuInfo",JSON.stringify(deleteArray));
					if(jsonstr==null || orderStr==null){
						Drag.initMenu(wid,hei);
					}else{
						Drag.initMenuOfJson(wid,hei,jsonstr,JSON.stringify(newOrderArray));
					}
				});
				
			},
			/*
			 * 初始化事件
			 * */
			initFun:function(wid,hei){
				//长按删除，移动
				var nn=0;
				$(".menu-view").longTap(function(e){
					if(nn==0){
						nn++;
						$(".menu-view").off("touchend");//解除绑定的事件
						$(".menu-box").find(".close-icon").css("display","block");
						$(".nav-wrap-right a").html('<i class="icon iconfont">&#xe69a;</i>');
						Drag.isDeleteDrop(wid,hei);
					}
				});
				
				//绑定点击跳转页面事件
				$(".menu-view").on("touchend",
			    	function(e) {
						var module=$(e.target).attr("data-module");
			            var view  =$(e.target).attr("data-view");
						var gatewayId=$(e.target).parent().attr("data-gatewayId");
			            if(module!=null && view!=null){ 
						
						if(module=="magicbox"&&view=="StMBMain"){
						   Piece.Cache.put("gatewayId",gatewayId);
						}
						
						   Backbone.history.navigate(module+"/"+view, {trigger: true});
			            }else{
			            	new Piece.Toast("此功能还未完成");
			            }
				});
			},
			/*
			 * 初始化菜单坐标
			 * 初始化删除按钮坐标
			 * 把菜单坐标存入localStorage中
			 * */
			initMenu:function(wid,hei){
				$(".menu-box .menu-view").css({
					"top":"",
					"left":""
				});
				
				var drags=new Array();
				var menus=new Array();
				$(".menu-box .menu-view").each(function(ev,ex){
					var _this=$(ex);
					var t = _this.position().top;
					var l = _this.position().left;
					_this.css({
						"width":wid+"px",
						"height":hei+"px",
						"top": t+'px',
						"left": l+'px'
					});//.attr("order",ev);
					
					_this.parent().find(".close-icon").css({
						"top": (t+hei*0.1)+'px',
						"left": (l+wid*0.1)+'px'
					}); 
					
					var menuInfo={
							"order":_this.attr("order"),
							"text":_this.find("div").eq(1).text()
					};
					menus[ev]=menuInfo;
					
					var m={
							"top": t,
							"left": l
						};
					drags[ev]=m;
				});
				localStorage.setItem(pageName+"_menuDragOrder",JSON.stringify(drags));
				localStorage.setItem(pageName+"_menuDragInfo",JSON.stringify(menus));
			},
			/**
			 * 根据localStorage 中的菜单坐标数据
			 * 初始菜单
			 */
			initMenuOfJson:function(wid,hei,sortStr,orderStr){
				var jsonArray=JSON.parse(sortStr);
				jsonArray.sort(function(a,b){
					if((a.top - b.top)>0){
						return a.top - b.top;
					}else if((a.top - b.top)==0){
						return a.left - b.left;
					}
		        });
				var orderArray=JSON.parse(orderStr);
				for(var i=0;i<orderArray.length;i++){
					var orderObj = orderArray[i];
					var jsonObj = jsonArray[i];
					var _this = $(".menu-box .menu-view[order='"+orderObj.order+"']")
					
					_this.css({
						"width":wid+"px",
						"height":hei+"px",
						"top": jsonObj.top,
						"left": jsonObj.left
					});
					
					_this.parent().find(".close-icon").css({
						"top": (jsonObj.top+hei*0.1)+'px',
						"left": (jsonObj.left+wid*0.1)+'px'
					}); 
				}
				
				localStorage.setItem(pageName+"_menuDragInfo",orderStr);
			},
			/*
			 * 修改删除图标的坐标位置
			 * */
			nodifyDeleteIcon:function(_this,obj){
				var fs = _this.offset();
				_this.parent().find(".close-icon").css({
					"top":(obj.top+fs.height*0.1)+"px",
					"left":(obj.left+fs.width*0.1)+"px"
				});
			},
			
			/*
			 * 修改菜单的坐标
			 * 把拖动后的菜单坐标存入localStorage
			 * */
			setMenuDragOrder:function(oldOrder,newOrder){
				var oldObj,newObj,oldN,newN;
				var jsonstr=localStorage.getItem(pageName+"_menuDragInfo");
				var json=JSON.parse(jsonstr);
				for(var i=0;i<json.length;i++){
					var jsonObj = json[i]; 
					if(jsonObj.order == oldOrder){
						oldObj = jsonObj;
						oldN=i;
					}
					
					if(jsonObj.order == newOrder){
						newObj = jsonObj;
						newN=i;
					}
				}
				
				json[oldN] = newObj;
				json[newN] = oldObj;
				
				localStorage.setItem(pageName+"_menuDragInfo",JSON.stringify(json));
			},
			/*
			 * 菜单拖拽逻辑
			 * */
			isDeleteDrop:function(){
				var me=this;
				var origin,startZB, is_moving = false;
				$(".menu-view").on("touchend",
		    		function(e) {
						if(!is_moving){
		    				origin=null;
		    				startZB=null;
		    				is_moving = false;
		    				return;
		    			}
						var scrollTop = $(".content").scrollTop();
				    	$(e.target).addClass("events");
			            var target_pos = $(e.target).position();
			            var ele = document.elementFromPoint(target_pos.left,(target_pos.top+scrollTop));
			            var tagname = ele.tagName;
			            if($(ele).attr("draggable") && is_moving && tagname=="DIV"){
			            	var top=$(ele).position().top;
			            	var left=$(ele).position().left;
			            	target_pos={top:(top+scrollTop),left:left};
			            	
			            	var address1=$(e.target).attr("order");
			            	var address2=$(ele).attr("order");
			            	
			            	$(ele).addClass("move").animate(startZB,500,'fast',
			            		function(){
			            			$(this).removeClass("move");
			            			Drag.nodifyDeleteIcon($(this),startZB);
			            	});
			            	$(e.target).addClass("move").animate(target_pos,500,'fast',
			            		function(){
			            		  $(this).removeClass("move events bg");
			            		  Drag.nodifyDeleteIcon($(this),target_pos);
			            	});
			            	Drag.setMenuDragOrder(address2,address1);
			            	is_moving = false;
			            }else if(is_moving){
			            	var bl=true;
			            	$(e.target).addClass("move").animate(startZB,500,'fast',
			            		function(){
			            		  $(this).removeClass("move events bg");
			            		  bl=false;
			            	});
			            	if(bl){
			            		$(e.target).removeClass("move events bg");
			            	}
			            	
			            	var offset = $(e.target).offset(); 
			            	$(e.target).parent().find(".close-icon").css({
								"top":(startZB.top+offset.height*0.1)+"px",
								"left":(startZB.left+offset.width*0.1)+"px"
							});
			            	
			            	is_moving=false;
			            }
		    		}).on("touchstart",function(e){//longTap
		    			var top = $(e.target).position().top;
		    			var left = $(e.target).position().left;
		    			var scrollTop = $(".content").scrollTop();
		    			startZB={top:(top+scrollTop),left:left};
		    			
		    			$(e.target).addClass("bg");
		    			$(e.target).parent().find(".close-icon").css("z-index","200")
			            if (is_moving) {
			                return false;
			            }
			            is_moving = true;
			            origin = this;
		    		}).on("touchmove",function(e){
		    			if(is_moving){
		    				var offset = $(e.target).offset();
		    				
		    				var mx=e.changedTouches[0].pageX;
				        	var my=e.changedTouches[0].pageY;
				        	$(this).css({
								"top": (my - offset.height/2)+'px',
								"left": mx+'px'
							});
		    				
				        	$(this).parent().find(".close-icon").css({
								"top":((my - offset.height/2)+offset.height*0.1)+"px",
								"left":(mx+offset.width*0.1)+"px"
							});
				        	
				        	if (e.stopPropagation()) e.stopPropagation();
				            if (e.preventDefault) e.preventDefault(); // allows us to drop
		    			}
		    		});
			},
			isDrop:function(){
				var me=this;
				var origin,startZB, is_moving = false;
				$(".menu-view").on("touchend",
		    		function(e) {
						var scrollTop = $(".content").scrollTop();
				    	$(e.target).addClass("events");
			            var target_pos = $(e.target).position();
			            var ele = document.elementFromPoint(target_pos.left,(target_pos.top+scrollTop));
			            var tagname = ele.tagName;
			            if($(ele).attr("draggable") && is_moving && tagname=="DIV"){
			            	var top=$(ele).position().top;
			            	var left=$(ele).position().left;
			            	target_pos={top:(top+scrollTop),left:left};
			            	
			            	var address1=$(e.target).attr("order");
			            	var address2=$(ele).attr("order");
			            	
			            	$(ele).addClass("move").animate(startZB,500,'fast',
			            		function(){
			            			$(this).removeClass("move");
			            	});
			            	$(e.target).addClass("move").animate(target_pos,500,'fast',
			            		function(){
			            		  $(this).removeClass("move events bg");
			            	});
			            	Drag.setMenuDragOrder(address2,address1);
			            	is_moving = false;
			            }else if(is_moving){
			            	var bl=true;
			            	$(e.target).addClass("move").animate(startZB,500,'fast',
			            		function(){
			            		  $(this).removeClass("move events bg");
			            		  bl=false;
			            	});
			            	if(bl){
			            		$(e.target).removeClass("move events bg");
			            	}
			            	is_moving=false;
			            }else{
			            	var module=$(e.target).attr("data-module");
				            var view  =$(e.target).attr("data-view");
				            if(module!=null && view!=null){ 
				            	Backbone.history.navigate(module+"/"+view, {
				            		trigger: true
				            	});
				            }else{
				            	new Piece.Toast("此功能还未完成");
				            } 
			            }
		    		}).longTap(function(e){//longTap
		    			var top = $(e.target).position().top;
		    			var left = $(e.target).position().left;
		    			var scrollTop = $(".content").scrollTop();
		    			startZB={top:(top+scrollTop),left:left};
		    			
		    			$(e.target).addClass("bg");
			            if (is_moving) {
			                return false;
			            }
			            is_moving = true;
			            origin = this;
		    		}).on("touchmove",function(e){
		    			if(is_moving){
		    				var offset = $(e.target).offset();
		    				
		    				var mx=e.changedTouches[0].pageX;
				        	var my=e.changedTouches[0].pageY;
				        	$(this).css({
								"top": (my - offset.height/2)+'px',
								"left": mx+'px'
							});
				        	
				        	if (e.stopPropagation()) e.stopPropagation();
				            if (e.preventDefault) e.preventDefault(); // allows us to drop
		    			}
		    		});
			}
			
	};
	return Drag;
});