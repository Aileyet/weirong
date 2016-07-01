define(['text!home/home-wirelessDoorbell.html'],
	function(viewTemplate) {
		return Piece.View.extend({
			id: 'home_home-wirelessDoorbell',
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