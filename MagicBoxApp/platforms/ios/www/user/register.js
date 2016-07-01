var current_fs, next_fs, previous_fs; //fieldsets
var left, opacity, scale; //fieldset properties which we will animate
var animating//flag to prevent quick multi-click glitches
define(['text!../user/register.html', "../base/openapi", '../base/util', '../base/constant'],
	function(viewTemplate, OpenAPI, Util ,Cons) {
		return Piece.View.extend({
			id: 'user_register',
			events: {
				"click #submit_phone": "submitPhone",
				"click #submit_CAPTCHA": "checkCAPTCHA",
				"click #back_phone": "backPhone",
				"click #back_CAPTCHA": "backCAPTCHA",
				"click #submit_register_info":"goRegister"
			},
			goRegister: function(){
				var phone = Piece.Cache.get("register_phone");
				var password = $("#register_password").val();
				var passwordConfirm = $("#register_password_confirm").val();
				if(password!=null && password != "" && password==passwordConfirm){
					Util.Ajax(OpenAPI.addUserLogin, "GET", {					
						"appForm.phone":phone,
						"appForm.password":password,
						dataType: 'jsonp'
					}, 'jsonp', function(data, textStatus, jqXHR) {						
						console.log(data);
						if(data=="0"){
							new Piece.Toast(Cons.REGISTER_SUCCESS);
							setTimeout("Backbone.history.navigate('#user/systemSettings', {trigger: true})", 100);
						}else{
							new Piece.Toast(Cons.REGISTER_FAILED);
						}
						
					}, function(e, xhr, type) {
						new Piece.Toast(Cons.REGISTER_FAILED);
					});
				}else{
					new Piece.Toast(Cons.REGISTER_PASSWORD_UNMATCHED);
				}

			},
			submitPhone: function(){
				var phoneNO = $('#register_phoneNO').val();	
				if(phoneNO != undefined && phoneNO != null && phoneNO != ""){
					Util.Ajax(OpenAPI.sendCaptcha, "GET", {					
						"appForm.phone":phoneNO,
						dataType: 'jsonp'
					}, 'jsonp', function(data, textStatus, jqXHR) {						
						console.log(data);
						if(data == "-1"){
							new Piece.Toast(Cons.REGISTER_USERLOGIN_REPEAT);
							return;
						}else if(data == "0"){
							new Piece.Toast(Cons.REGISTER_SEND_MSG_FAILED);
							return;
						}
						//存储验证码及手机号
						Piece.Cache.put("CAPTCHA",data);
						Piece.Cache.put("register_phone",phoneNO);
						//隐藏当前fieldset，显示下一个fieldset
						var interval;
						if(animating) return false;
						animating = true;
						current_fs = $('#submit_phone').parent();
						next_fs = current_fs.next();
						$('#progressbar li').eq($('fieldset').index(next_fs)).addClass('active');				
						next_fs.show(); 				
						current_fs.animate({opacity: 0}, {
							step: function(now, mx) {						
								scale = 1 - (1 - now) * 0.2;						
								left = (now * 50)+"%";						
								opacity = 1 - now;
								current_fs.css({'transform': 'scale('+scale+')'});
								next_fs.css({'left': left, 'opacity': opacity});
							}, 
							duration: 200, 
							complete: function(){
								current_fs.hide();
								next_fs.css({'opacity': 1});
								$("#time_CAPTCHA").html('剩余60秒');
								$("#submit_CAPTCHA").css('background',"#18B9F5");							
								$("#submit_CAPTCHA").removeAttr('flag');
								animating = false;
							}, 					
						});
							
						//设置验证码超时操作，一分钟后超时
						var subtitleObj = next_fs.children('h3')[0];
						$(subtitleObj).html("验证码短信已经发送至"+phoneNO);
						$("#register_captcha").val("");
						//倒计时
						var elCount=$("#time_CAPTCHA");				
						var i=59;
						interval=setInterval(function(){
							console.log(current_fs.css('display'));
							elCount.html("剩余"+i+"秒");					
							i--;
							if(i<0){						
								elCount.html("验证超时");	
								$("#submit_CAPTCHA").css('background',"grey");
								$("#submit_CAPTCHA").attr('flag',"1");
								clearInterval(interval);	
							}
							if(current_fs.css('display')=='block'){
								clearInterval(interval);
							}
						},1000);
					
						
					}, function(e, xhr, type) {
						new Piece.Toast(Cons.REGISTER_SEND_MSG_FAILED);
					});
				}

				
			},
			checkCAPTCHA:function(){
				if($("#submit_CAPTCHA").attr('flag') == "1"){
					new Piece.Toast(Cons.REGISTER_CAPTCHA_OUTTIME);
					return;
				}
				var inputCode = $("#register_captcha").val();
				if(inputCode == ""){
					new Piece.Toast(Cons.REGISTER_CAPTCHA_NOTNULL);
					return;
				}
				
				var code = Piece.Cache.get("CAPTCHA");
				//验证码验证通过后显示下一个fieldset
				if(inputCode==code){
					if(animating) return false;
					animating = true;
					current_fs = $('#submit_CAPTCHA').parent();
					next_fs = current_fs.next();
					$('#progressbar li').eq($('fieldset').index(next_fs)).addClass('active');				
					next_fs.show(); 				
					current_fs.animate({opacity: 0}, {
						step: function(now, mx) {						
							scale = 1 - (1 - now) * 0.2;						
							left = (now * 50)+"%";						
							opacity = 1 - now;
							current_fs.css({'transform': 'scale('+scale+')'});
							next_fs.css({'left': left, 'opacity': opacity});
						}, 
						duration: 200, 
						complete: function(){
							current_fs.hide();
							next_fs.css({'opacity': 1});
							animating = false;
						}, 					
					});
				}else{
					new Piece.Toast(Cons.REGISTER_CAPTCHA_UNMATCHED);
				}
			},
			backPhone:function(){				
				if(animating) return false;
				animating = true;				
				current_fs = $('#back_phone').parent();
				previous_fs = current_fs.prev();
				showFieldset(current_fs,previous_fs);				
			},
			backCAPTCHA:function(){
				if(animating) return false;
				animating = true;				
				current_fs = $('#back_CAPTCHA').parent();
				previous_fs = current_fs.prev();
				showFieldset(current_fs,previous_fs);				
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
function showFieldset(current_fs,previous_fs){
	$("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");				
	previous_fs.show(); 			
	current_fs.animate({opacity: 0}, {
		step: function(now, mx) {						
			scale = 0.8 + (1 - now) * 0.2;						
			left = ((1-now) * 50)+"%";						
			opacity = 1 - now;
			current_fs.css({'left': left});
			previous_fs.css({'transform': 'scale('+scale+')', 'opacity': opacity});
		}, 
		duration: 200, 
		complete: function(){
			current_fs.hide();
			previous_fs.css({'opacity': 1});
			animating = false;	
		}
	});
}


