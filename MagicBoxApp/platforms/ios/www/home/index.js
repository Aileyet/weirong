define(['text!home/index.html',"zepto","../base/openapi",'../base/util'],
	function(viewTemplate, $, OpenAPI, Util) {
		return Piece.View.extend({
			id: 'home-index',
			render: function() {
				$(this.el).html(viewTemplate);

				Piece.View.prototype.render.call(this);
				return this;
			},
			onShow: function() {

			}
		}); //view define

	});