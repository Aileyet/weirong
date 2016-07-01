define(
		[ 'text!magicbox/InProfileSet.html', 'zepto',
				"../base/templates/template", '../base/util' ],
		function(viewTemplate, $, _TU,Util) {
			var timeOutEvent = 0;
			return Piece.View
					.extend({
						id : 'magicbox_InProfileSet',
						events : {
							"touchstart .menu-box" :"onCheck"
						},
						onCheck:function(e){
							var templateID = $(e.target).find("i").eq(0).attr("templateID");
							if(templateID==0){
								return;
							}
							var templateID2 = localStorage.getItem("templateID");
							if(!templateID2){
								templateID2 = 1;
							}
							var path = "../base/templates/templateCss_"+templateID2+".css";

							var status = $(e.target).find("i").attr("checked");
							if(status==0){
								$($("link[href$='"+path+"']")[0]).remove();
								this.removeJs();
								$(".valign i").attr("checked","0");
								$(e.target).find("i").attr("checked","1");
								$(".valign i").removeClass("golden");
								$(e.target).find("i").addClass("golden");
								var iconHtml="<div class='checkcss'><i class='icon iconfont golden' style='font-size: 20px;'>"+_TU._T.magicbox_InProfileSet.data.checkIcon+"</i></div>";
								$(".checkcss").remove();
								$(e.target).find(".events").append(iconHtml);
								
								localStorage.setItem("templateID",templateID);
								this.setCss();
								//this.reloadJs(templateID);
								var conHtml = $("#content").html();
								$("#content").html(conHtml);
							}
						},
						reloadJs:function(templateID){
							//return;
							
							var timestamp=new Date().getTime();
							//$("script[data-requiremodule$='base/templates/templateIcon']").remove();
		
							var scriptObj = document.createElement("script"); 
							scriptObj.src = "../base/templates/templateIcon_"+templateID+".js?bust="+timestamp; 
							scriptObj.type = "text/javascript"; 
							scriptObj.setAttribute("data-requiremodule","base/templates/templateIcon_"+templateID); 
							scriptObj.setAttribute("data-requirecontext","_"); 
							scriptObj.charset="utf-8";
							document.getElementsByTagName("head")[0].appendChild(scriptObj);
							alert(getIcon().magicbox_CoStageSet.BackHomeIcon);
							//_TU._T.setIcon();
						},
						removeJs:function(){
							var templateID = localStorage.getItem("templateID");
							$("script[data-requiremodule$='base/templates/templateIcon_"+templateID+"']").remove();
						},
						setCss:function(){
							if($("#tempID").length > 0){
								return;
							}
							//var templateID = Piece.Store.loadObject("templateID");
							var templateID = localStorage.getItem("templateID");
							var path = "";
							if(templateID){
							  path = "../base/templates/templateCss_"+templateID+".css";
							}else{
							  path = "../base/templates/templateCss_1.css";
							}
							var head = document.getElementsByTagName('head')[0];
					        var link = document.createElement('link');
					        link.href = path;
					        link.rel = 'stylesheet';
					        link.type = 'text/css';
					        link.id = 'tempID';
					        head.appendChild(link);
						},
						render : function() {
							this.setCss();
							$(this.el).html(viewTemplate);
							Piece.View.prototype.render.call(this);
							 return this;
						},
						onLoadTemplate : function() {
							_TU._U.setHeader(_TU._T.magicbox_InProfileSet);

							var me = this;
							// 页面布局共通化管理
							$("#content").html("");
							for (var i = 0; i < _TU._T.magicbox_InProfileSet.data.menus.length; i++) {
								var inProfileSetTemplate = $(me.el).find(
										"#inProfileSetTemplate").html();
								var inProfileSetHtml = _
										.template(
												inProfileSetTemplate,
												_TU._T.magicbox_InProfileSet.data.menus[i]);
								$("#content").append(inProfileSetHtml);
							}
							//var templateID = Piece.Store.loadObject("templateID");
							var templateID = localStorage.getItem("templateID");
							if(!templateID){
								templateID =1;
							}
							var iconHtml="<div class='checkcss'><i class='icon iconfont golden' style='font-size: 20px;'>"+_TU._T.magicbox_InProfileSet.data.checkIcon+"</i></div>";
							$(".events i").each(function(){
								if($(this).attr("templateID")==templateID){
									$(this).parent().parent().append(iconHtml);
									$(this).addClass("golden");
								}
							});
						},
						onShow : function() {
							this.onLoadTemplate();// 加载配置模板
							
							var wid=$(".menu-box").width();
							var hei=$(".menu-box").height();
							$(".menu-box .menu-view").each(function(ev,ex){
								var _this=$(ex);
								var t = _this.position().top;
								var l = _this.position().left;
								_this.css({
									"width":wid+"px",
									"height":hei+"px"
								});
							});
							
							_TU._U.goBack(function(){
							     Backbone.history.navigate("home/MeIndex", {trigger: true});
							     location.reload();
						    });
						}
					}); 

		});