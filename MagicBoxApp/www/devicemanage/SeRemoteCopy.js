define(['text!devicemanage/SeRemoteCopy.html',"../base/templates/template"],
	function(viewTemplate,_TU) {
		return Piece.View.extend({
			id: 'devicemanage_SeRemoteCopy',
			render: function() {
				$(this.el).html(viewTemplate);

				Piece.View.prototype.render.call(this);
				return this;
			},
			onLoadTemplate:function(){
				_TU._U.setHeader(_TU._T.remotecopy);
			},
			onShow: function() {
				this.onLoadTemplate();//加载配置模板
				//write your business logic here :)
			}
		}); //view define

	});