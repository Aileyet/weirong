define(['text!home/home-controlPanel.html'],
	function(viewTemplate) {
		return Piece.View.extend({
			id: 'home_home-controlPanel',
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