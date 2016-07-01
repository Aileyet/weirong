define(['text!magicbox/PhotoDetail.html',"../base/templates/template"],
	function(viewTemplate,_TU) {
		return Piece.View.extend({
			id: 'magicbox_PhotoDetail',
			events:{
			},
			render: function() {
				$(this.el).html(viewTemplate);

				Piece.View.prototype.render.call(this);
				return this;
			},
			onLoadTemplate:function(){
				_TU._U.setHeader(_TU._T.magicbox_PhotoDetail);//加载头部导航
				var me = this;
				var photoDetailIconTemplate = $(me.el).find("#photoDetailIconTemplate").html();
				var photoDetailIconHtml= _.template(photoDetailIconTemplate, _TU._T.magicbox_PhotoDetail.data);
				$("#content").append(photoDetailIconHtml);
			},
			onShow: function() {
				this.onLoadTemplate();
			}
		}); //view define

	});