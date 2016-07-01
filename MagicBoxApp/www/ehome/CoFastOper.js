define(['text!ehome/CoFastOper.html', '../base/util'],
	function(viewTemplate,Util) {
		return Piece.View.extend({
			id: 'ehome_CoFastOper',
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