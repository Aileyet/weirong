define(['text!base/tooltip/tooltip.html',"../templates/template"],
	function(viewTemplate,_TU) {
		var tooltip = Backbone.View.extend({
			id: 'tooltip_tooltip',
			initialize: function(options) {
				this.render();
			},
			render: function() {
				
				//解决重复加载的问题
				if ($(".covering-layer-tooltip").size() > 0) {
					$(".covering-layer-tooltip").remove();
				}
				$("body").append(viewTemplate);
				this.closeCovering();//关闭遮盖层
			},
			onLoadTemplate:function(){
				var me = this;
				// 页面布局共通化管理
				var tooltipTemplate = $("#TooltipTemplate").html();
				var tooltipHtml = _.template(tooltipTemplate,_TU._T.tooltip_tooltip);
				$(".covering-layer-tooltip").html(tooltipHtml);
			},
			show:function(ppage){
				this.onLoadTemplate();
				
				var me=this;
				$("#covering-btn-cancle-tooltip").on("tap",function(){
					me.hide();
				});
				
				//如果不需要弹出提示，则直接改变界面样式
				if(Piece.Cache.get("messagShow")==0){
					 $("#editTitle").attr("style","");
					 $("#controlTitle").attr("style","display:none"); 
					 $("#save").attr("style","");
					 $(".nav-wrap-right ul").removeClass("disp");//移除下拉菜单事件
					 $("#study").attr("style","display:none");
					 Piece.Cache.put("study",1);
					
				}
				
				$("#covering-btn-determine-tooltip").on("tap",function(){
					 me.hide();
					 $("#editTitle").attr("style","");
					 $("#controlTitle").attr("style","display:none"); 
					 $("#save").attr("style","");
					  $(".nav-wrap-right ul").removeClass("disp");//移除下拉菜单事件
					 $("#study").attr("style","display:none");
					 Piece.Cache.put("study",1);
				});
				
				//是否提示
				$(".covering-content div").eq(2).on("touchend",function(e){
					var i = $(this).find("i");
					if(i.attr("checked")=="true"){
						$(this).find("i").html("&#xe68d;").attr("checked",false);
						 Piece.Cache.put("messagShow",1);
					}else{
						$(this).find("i").html("&#xe68e;").attr("checked",true);
						 Piece.Cache.put("messagShow",0);
					}
				});
				
				Piece.Cache.put("tooltip-tooltip-parent",ppage);
				if(Piece.Cache.get("messagShow")!=0){
					$(".covering-layer-tooltip").show();
					$(".over-mag").show();
				}
			},
			hide:function(){
				$(".covering-layer-tooltip").hide();
				$(".over-mag").hide();
			},
			showConn:function(){
				$(".covering-layer-tooltip").show();
				$(".bluetooth-connectioning").show();
			},
			hideConn:function(){
				$(".covering-layer-tooltip").hide();
				$(".bluetooth-connectioning").hide();
			},
			setCovering:function(num){
				$(".covering").css("bottom",num+"px");
			},
			closeCovering:function(){
				var me=this;
				$(".close-btConn i").on("tap",function(e){
					me.hideConn();
				});
			},
			
			//组合菜单
			showMenu:function(){
				$(".covering").css("opacity",0.9);
				$(".covering-layer-tooltip").show();
				$(".misc-menu").show();
				
				var me = this;
			},
			hideMenu:function(){
				$(".covering-layer-tooltip").hide();
				$(".misc-menu").hide();
			},
			setMenu:function(title,datas,order,_Drag){
				var me = this;
				$(".misc-menu").attr("order",order);
				$("#misc-menu-title").val(title);
				$(".misc-menu .menu-container").html("").attr("order",order);
				for(var i=0;i<datas.length;i++){
					var data = datas[i];
					if(_Drag==undefined){
						var h = '<div class="menu-view" order="'+data.order+'">'+
							'<div class="menu-icon equip '+data.bgcolor+'" data-serial="'+data.serial+'" data-device="'+data.device+'" data-gatewayId="'+data.gatewayId+'" data-module="'+data.module+'" data-view="'+data.view+'">'+
							'<i class="icon iconfont">'+data.icon+'</i></div>'+
							'<div class="menu-text">'+data.title+'</div></div>';
						$(".misc-menu .menu-container").append(h);
					}else{
						var _isvd = _Drag.isViewDevice(data);
						if(_isvd.bool){
							var h = '<div class="menu-view" order="'+data.order+'">'+
								'<div class="menu-icon equip '+data.bgcolor+'" data-serial="'+data.serial+'" data-device="'+data.device+'" data-gatewayId="'+data.gatewayId+'" data-module="'+data.module+'" data-view="'+data.view+'">'+
								'<i class="icon iconfont">'+_isvd.icon+'</i></div>'+
								'<div class="menu-text">'+data.title+'</div></div>';
							$(".misc-menu .menu-container").append(h);
						}
					}
				}
				
				//计算、设置高度
				var eles = $(".misc-menu .menu-container").find(".menu-view");
				var toutal = eles.length;
				var rows = toutal%3==0?toutal/3:parseInt(toutal/3) + 1;
				var height = $(eles[0]).height()+25;
				$(".misc-menu .menu-container").css("height",(height*rows)+"px");
				
			},
			
			//WiFi信息输入
			showWifi:function(name){
				$(".covering").css("opacity",0.7);
				$(".covering-layer-tooltip").show();
				$(".WIFI-Info-seting-tooltip").show();
				$(".WIFI-Info-seting-tooltip .wifi-info-label div").eq(1).text(name);
			},
			hideWifi:function(){
				$(".covering").css("opacity",0);
				$(".covering-layer-tooltip").hide();
				$(".WIFI-Info-seting-tooltip").hide();
			}
		});
		return tooltip;
	});