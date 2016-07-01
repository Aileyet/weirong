define(['text!magicbox/InUserInfoE.html',"../base/openapi", '../base/util'],
	function(viewTemplate, OpenAPI, Util) {
		return Piece.View.extend({
			id: 'magicbox_InUserInfoE',
			events:{
				"touchstart .save"    :     "onToSave"
			},
			onToSave:function(e){
				Backbone.history.navigate("magicbox/InUserInfoV", {
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
					$("#name").val(data.nickName);
					if(data.sex=="M"){
						$("#mam").attr("checked",true);
					}else if(data.sex=="W"){
						$("#woman").attr("checked",true);
					}
					$("#birthday").val(data.birthday);
					//$("#height").text(data.createdStamp);
					//$("#weight").text(data.createdStamp);
					//$("#location").text(data.createdStamp);
					$("#mobilePhone").text(data.userLogin.mobilePhone);
				}, function(e, xhr, type) {
					
				});
				return this;
			},
			onShow: function() {
				// var url = OpenAPI['access_user'];
				// Util.Ajax(url, "GET", {
				// 	accessToken:Piece.Store.loadObject("user_token").accessToken,
				// 	dataType:'jsonp'
				// }, 'jsonp', function(data, textStatus, jqXHR) {						
				// 	$("#name").val(data.nickName);
				// 	if(data.sex=="M"){
				// 		$("#mam").attr("checked",true);
				// 	}else if(data.sex=="W"){
				// 		$("#woman").attr("checked",true);
				// 	}
				// 	$("#birthday").val(data.birthday);
				// 	//$("#height").text(data.createdStamp);
				// 	//$("#weight").text(data.createdStamp);
				// 	//$("#location").text(data.createdStamp);
				// 	$("#mobilePhone").text(data.userLogin.mobilePhone);
				// }, function(e, xhr, type) {
					
				// });
			}
		}); //view define

	});