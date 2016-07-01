define([ 'text!magicbox/PhoneticFunction.html', "../base/templates/template" ],
		function(viewTemplate, _TU) {
			return Piece.View.extend({
				id : 'magicbox_PhoneticFunction',
				events : {
				},
				render : function() {
					$(this.el).html(viewTemplate);

					Piece.View.prototype.render.call(this);
					return this;
				},
				onLoadTemplate : function() {
					_TU._U.setHeader(_TU._T.magicbox_PhoneticFunction);
					var me = this;
					// 页面布局共通化管理

					var phoneticFunctionTemplate = $(me.el).find(
							"#PhoneticFunctionTemplate").html();
					var phoneticFunctionHtml = _.template(
							phoneticFunctionTemplate,
							_TU._T.magicbox_PhoneticFunction.data);
					$(".content").html(phoneticFunctionHtml);
				},
				onShow : function() {
					this.onLoadTemplate();// 加载配置模板
				}
			}); 

		});