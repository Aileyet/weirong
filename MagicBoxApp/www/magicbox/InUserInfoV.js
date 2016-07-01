define(['text!magicbox/InUserInfoV.html',"../base/openapi", '../base/util'],
	function(viewTemplate, OpenAPI, Util) {
		return Piece.View.extend({
			id: 'magicbox_InUserInfoV',
			events:{
				"touchstart .edit"    :     "onToEdit"
			},
			onToEdit:function(e){
				Backbone.history.navigate("magicbox/InUserInfoE", {
            		trigger: true
            	});
			},
			render: function() {
				$(this.el).html(viewTemplate);

				Piece.View.prototype.render.call(this);
				var url = OpenAPI['access_user'];
				Util.Ajax(url, "GET", {
					accessToken:Piece.Store.loadObject("user_token").accessToken,
					dataType:'jsonp'
				}, 'jsonp', function(data, textStatus, jqXHR) {						
					$("#name").text(data.nickName);
					var sex ="";
					if(data.sex=="M"){
						sex = "男";
					}else if(data.sex=="W"){
						sex ="女";
					}
					$("#sex").text(sex);
					$("#birthday").text(data.birthday);
					//$("#height").text(data.createdStamp);
					//$("#weight").text(data.createdStamp);
					//$("#location").text(data.createdStamp);
					$("#mobilePhone").text(data.userLogin.mobilePhone);
				}, function(e, xhr, type) {
					
				});
				return this;
			},
			onShow: function() {
		

			}
		}); //view define

	});