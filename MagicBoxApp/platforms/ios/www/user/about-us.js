define(['text!user/about-us.html',  '../base/util', "../base/openapi"],
	function(viewTemplate, Util, OpenAPI) {
		return Piece.View.extend({
			id: 'user_about-us',
			events: {
				"click .imgContainer" : "goBackToHome",
			},
			
			goBackToHome: function() {
				window.history.back();
			},
			render: function() {
				$(this.el).html(viewTemplate);

				Piece.View.prototype.render.call(this);
				return this;
			},
			onShow: function() {
				var me =this ;
				$('#user_about-us').css("height","100%");
				var version =  window.localStorage["vBankAppVersion"];
				$(this.el).find("#version").html(version);

				var platformVer = navigator.userAgent;
				
				if(platformVer.indexOf("iPhone")>-1){
					$('body').append("<header class='bar-title'></header>")
					$('.bar-title').append("<div class='left-banner'></div>")
					$('.bar-title').append("<h1 class='title'>关于我们</h1>")
					$('.left-banner').append("<span class='backBtn icon-reply imgsize'></span>")
					$('.backBtn').live("click",function(){
						window.history.back();
					})
				}
			}
	
		
		}); //view define

	});