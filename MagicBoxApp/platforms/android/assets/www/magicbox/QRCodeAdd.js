define(['text!magicbox/QRCodeAdd.html'],
	function(viewTemplate) {
		return Piece.View.extend({
			id: 'magicbox_QRCodeAdd',
			events:{
			},
			render: function() {
				$(this.el).html(viewTemplate);

				Piece.View.prototype.render.call(this);
				return this;
			},
			onShow: function() {
				//write your business logic here :)
			}
		}); //view define

	});