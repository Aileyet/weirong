define(
		[ 'text!magicbox/InAboutMB.html', "zepto", "../base/openapi",
				'../base/util', '../base/socketutil',
				"../base/templates/template","../base/i18nMain"],
		function(viewTemplate, $, OpenAPI, Util, SocketUtil, _TU,I18n) {
			var outTimer=null;
			var loader=null;
			
			var initView = function() {
				$(".content").html("");// 初始化
				var MBConfig = Piece.Store.loadObject("MBConfig", true);
				if (MBConfig != null) {
					for (var i = 0; i < MBConfig.length; i++) {
						var s1 = $("<span>").html(MBConfig[i].time);
						var s2 = $("<span>").html("备份");
						var s3 = $("<span>").attr("data-options",
								MBConfig[i].time).html("还原配置").bind("tap",
								function() {// 还原配置
									var time = $(this).attr("data-options");
									
									socketRspnCallBack.func0045=function(obj){//定义回调函数
				                          window.clearTimeout(outTimer);
										  loader.hideAll();
				                          Piece.Toast(I18n.magicbox_InAboutMB.loadConfigSucess);
			                        }
									SocketUtil.MBConfLoad(time);
									loader=new Piece.Loader({autoshow:true,target:'.content'});
									outTimer=window.setTimeout(function(){
										  loader.hideAll();
					                      Piece.Toast(I18n.magicbox_InAboutMB.loadConfigTimeOut);
				                    },1000*10);
								});
						var s4 = $("<span>")
								.attr("data-options", MBConfig[i].time)
								.html("删除")
								.bind(
										"tap",
										function() {
											var time = $(this).attr(
													"data-options");
											var editMBConfig = Piece.Store
													.loadObject("MBConfig",
															true);
											if (editMBConfig != null) {
												for (var i = 0; i < editMBConfig.length; i++) {
													if (editMBConfig[i].time == time) {
														editMBConfig.splice(i,
																1);// 删除
													}
												}
											}
											Piece.Store.saveObject("MBConfig",
													editMBConfig, true);
											initView();
										});
						$("<div>").attr("class", "div-box").append(s1).append(
								s2).append(s3).append(s4).appendTo(".content");
					}
				}
			};

			return Piece.View.extend({
				id : 'magicbox_InAboutMB',
				events : {
					"touchstart .nav-wrap-right" : "onGotoFn"
				},
				onGotoFn : function(e) {
					Backbone.history.navigate("magicbox/InConfBackup", {
						trigger : true
					});
				},
				render : function() {
					$(this.el).html(viewTemplate);

					Piece.View.prototype.render.call(this);
					return this;
				},
				onLoadTemplate : function() {
					_TU._U.setHeader(_TU._T.magicbox_InAboutMB);
				},
				onShow : function() {
					this.onLoadTemplate();// 加载配置模板
					initView();
					Piece.Cache.put("serial","0000");
				}
			}); 

		});