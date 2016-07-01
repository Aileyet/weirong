define([ 'text!magicbox/InMBSetup.html', '../base/i18nMain' ,"../base/templates/template"], function(viewTemplate,I18n,_TU) {
	return Piece.View.extend({
		id : 'magicbox_Setup',
		events : {
			"touchstart .add"              : "onAdd",
			"touchstart .BTsetup"          : "onBTsetup"
		},
		onAdd : function(e) {
			Backbone.history.navigate("magicbox/QRCodeAdd", {
				trigger : true
			});
		},
		onBTsetup : function(e) {
			Backbone.history.navigate("magicbox/CoBTSetup", {
				trigger : true
			});
		},
		onEHomeMenuFn : function(e) {
			var me = this;
			$(".table-rg .div-list").on("touchend",function(e) {
					var module = $(e.target).attr("data-module");
					var view = $(e.target).attr("data-view");
					if (module != null && view != null) {
						Backbone.history.navigate(module + "/" + view, {
							trigger : true
						});
					} else {
						new Piece.Toast("此功能还未完成");
					}
					return false;
			});
		},
		render : function() {
			$(this.el).html(viewTemplate);

			Piece.View.prototype.render.call(this);
			return this;
		},
		onLoadTemplate:function(){
				_TU._U.setHeader(_TU._T.magicbox_InMBSetup);//加载头部导航
				var me = this;
				var inMBSetupTemplate = $(me.el).find("#inMBSetupTemplate").html();
				var inMBSetupTemplate = _.template(inMBSetupTemplate,  _TU._T.magicbox_InMBSetup.data);
				$("#content").append(inMBSetupTemplate);
		},
		onShow : function() {
			this.onLoadTemplate();
			
			this.onEHomeMenuFn();
		}
	}); //view define

});