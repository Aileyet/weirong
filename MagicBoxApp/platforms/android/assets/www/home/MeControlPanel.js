define(['text!home/MeControlPanel.html','../base/templates/template'],
	function(viewTemplate,_TU) {
		return Piece.View.extend({
			id: 'home_MeControlPanel',
			events:{
			},
			render: function() {
				$(this.el).html(viewTemplate);

				Piece.View.prototype.render.call(this);
				return this;
			},
			onLoadTemplate:function(){
				_TU._U.setHeader(_TU._T.home_MeControlPanel);//替换头部导航
				var userInfoTemplate = $(this.el).find("#home_MeControlPanel_Template").html();
				var userInfoHtml = _.template(userInfoTemplate, _TU._T.home_MeControlPanel.data);
				$(".content").html("");
				$(".content").append(userInfoHtml);
			},
			onShow: function() {
				 this.onLoadTemplate();
			}
		}); //view define

	});