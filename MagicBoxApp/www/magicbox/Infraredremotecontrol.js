define(
		[ 'text!magicbox/Infraredremotecontrol.html', 'zepto',
				"../base/templates/template", '../base/drag' ],
		function(viewTemplate, $, _TU, Drag) {
			var timeOutEvent = 0;
			return Piece.View
					.extend({
						id : 'magicbox_Infraredremotecontrol',
						events : {
						},
						onEHomeMenuFn : function(e) {
							$(".div-box")
									.on(
											{
												touchend : function(e) {
													var module = $(e.target)
															.attr("data-module");
													var view = $(e.target)
															.attr("data-view");
													if (module != null
															&& view != null) {
														Backbone.history
																.navigate(
																		module
																				+ "/"
																				+ view,
																		{
																			trigger : true
																		});
													} else {
														new Piece.Toast("此功能还未完成");
													}
													return false;
												}
											})
						},
						render : function() {
							$(this.el).html(viewTemplate);
							Piece.View.prototype.render.call(this);
							return this;
						},
						onLoadTemplate : function() {
							_TU._U
									.setHeader(_TU._T.magicbox_Infraredremotecontrol);
							var me = this;
							// 页面布局共通化管理
							$("#content").html("");
							for (var i = 0; i < _TU._T.magicbox_Infraredremotecontrol.data.menus.length; i++) {
								var inTemplate = $(me.el).find("#iNTemplate")
										.html();
								var inHtml = _
										.template(
												inTemplate,
												_TU._T.magicbox_Infraredremotecontrol.data.menus[i]);
								$("#content").append(inHtml);
							}
						},
						onShow : function() {
							this.onLoadTemplate();// 加载配置模板
							// write your business logic here :)
							var me = this;

							Drag.initView(this.id);// 加载菜单js,传入页面唯一标识
							Drag.isDrop();// 加载菜单拖拽js

							this.onEHomeMenuFn();
						}
					}); // view define

		});