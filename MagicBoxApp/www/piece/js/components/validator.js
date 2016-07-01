define(['zepto', 'components/toast', 'backbone'], function($, Toast, Backbone) {
	
	var Validator = function(cond) {
		var model = Backbone.Model.extend({

			 validation : cond
		});
	}
	

	return Validator;
});