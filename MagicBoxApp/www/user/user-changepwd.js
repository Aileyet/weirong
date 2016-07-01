define(['text!user/user-changepwd.html', "../base/openapi", '../base/util' ,'../base/constant'],
	function(viewTemplate, OpenAPI, Util , Cons) {
		return Piece.View.extend({
			id: 'user_user—changepwd',
			events: {
				"tap #save-password": "changePwd",
			},
			changePwd: function(){
				var user_info = Piece.ZTake.loginUser();
				var password = $('#userPwd_password').val();
				var newPassword = $('#userPwd_current_password').val();
				var repeatPassword = $('#userPwd_repeat_password').val();
				if(newPassword=="" || newPassword != repeatPassword){
					new Piece.Toast(Cons.CHANGEPWD_STRING_ERROR);
				}else{
					Util.Ajax(OpenAPI.changePwd, "GET", {					
						username: user_info.username,
						password: password,
						currentPwd : newPassword,
						dataType: 'jsonp'
					}, 'jsonp', function(data, textStatus, jqXHR) {						
						if(data != null){
							new Piece.Toast(data);							
						}else{
							new Piece.Toast(Cons.CHANGEPWD_SUCCESS);
							setTimeout("Backbone.history.navigate('#user/systemSettings', {trigger: true})",1300);							
						}
						
					}, function(e, xhr, type) {
						new Piece.Toast(Cons.CHANGEPWD_FAILED);
					});
				}

			},
			render: function() {
				
				$(this.el).html(viewTemplate);
				Piece.View.prototype.render.call(this);
				
				return this;
			},			
			onShow: function() {
				
			}
			
		});
});