define(['text!magicbox/CameraSetup.html', '../base/i18nMain',"../base/templates/template"],
	function(viewTemplate,I18n,_TU) {
		return Piece.View.extend({
			id: 'magicbox_CameraSetup',
			events:{
				"touchstart .jump"    :     "onJumpNext"
			},
			onJumpNext:function(e){
				Backbone.history.navigate("magicbox/PlCaptureRec", {
            		trigger: true
            	});
			},
			render: function() {
				$(this.el).html(viewTemplate);

				Piece.View.prototype.render.call(this);
				return this;
			},
			onLoadTemplate:function(){
				_TU._U.setHeader(_TU._T.magicbox_CameraSetup);//加载头部导航
				var me = this;
				var cameraSetupTemplate = $(me.el).find("#cameraSetupTemplate").html();
				var cameraSetupHtml= _.template(cameraSetupTemplate, _TU._T.magicbox_CameraSetup.data.menus);
				$("#content").html(cameraSetupHtml);
			},
			onShow: function() {
				this.onLoadTemplate();
				
			}
		}); 

	});