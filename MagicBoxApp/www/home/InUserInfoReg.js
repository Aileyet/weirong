var animating;
define(['text!home/InUserInfoReg.html',"../base/openapi", '../base/util', '../base/constant', '../base/templates/template', '../base/validate'],
	function(viewTemplate, OpenAPI, Util,Cons,_TU,V) {
		return Piece.View.extend({
			id: 'home_InUserInfoReg',
			events: {
				"blur .validatebox" :"onValidateFn",
				"touchstart #time_CAPTCHA": "submitPhone",
				"click #submit_register_info":"goRegister"
			},
			onValidateFn:function(el){
				console.log(this.id);
			},
			render: function() {
				$(this.el).html(viewTemplate);

				Piece.View.prototype.render.call(this);
				return this;
			},
			onLoadTemplate:function(){
				_TU._U.setHeader(_TU._T.home_InUserInfoReg);//替换头部导航
				var userInfoTemplate = $(this.el).find("#regTemplate").html();
				var userInfoHtml = _.template(userInfoTemplate, _TU._T.home_InUserInfoReg.data);
				$(".content").html("");
				$(".content").append(userInfoHtml);
			},
			onShow: function() {
				 this.onLoadTemplate();
			},
			submitPhone: function(){
				var phoneNO = $('#register_phoneNO').val();	
				if(phoneNO != undefined && phoneNO != null && phoneNO != ""){
					if(!V.phoneV($("#register_phoneNO"))){
						new Piece.Toast(_TU.I18n.Common.phoneNoRrror);
						return;
					}
					Util.Ajax(OpenAPI.sendCaptcha, "GET", {					
						"appForm.phone":phoneNO,
						dataType: 'jsonp'
					}, 'jsonp', function(data, textStatus, jqXHR) {						
						console.log(data);
						if(data == "-1"){
							new Piece.Toast(_TU.I18n.Common.registerUserloginRepeat);
							return;
						}else if(data == "0"){
							new Piece.Toast(_TU.I18n.Common.registerSendMsgFailed);
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
				
						current_fs.animate({opacity: 0}, {
							step: function(now, mx) {						
								scale = 1 - (1 - now) * 0.2;						
								left = (now * 50)+"%";						
								opacity = 1 - now;
								current_fs.css({'transform': 'scale('+scale+')'});

							}, 
							duration: 200, 
							complete: function(){
								current_fs.hide();
								$("#time_CAPTCHA").html(_TU.I18n.Common.surplus+'60'+_TU.I18n.Common.second);
								$("#submit_CAPTCHA").css('background',"#18B9F5");							
								$("#submit_CAPTCHA").removeAttr('flag');
								animating = false;
							}, 					
						});
							
						//设置验证码超时操作，一分钟后超时

						new Piece.Toast(_TU.I18n.Common.shortMessageSending+phoneNO);
						$("#register_captcha").val("");
						//倒计时
						var elCount=$("#time_CAPTCHA");				
						var i=59;
						interval=setInterval(function(){
							console.log(current_fs.css('display'));
							elCount.html(_TU.I18n.Common.surplus+i+_TU.I18n.Common.second);					
							i--;
							if(i<0){						
								elCount.html(_TU.I18n.Common.registerCaptchaOuttime);	
								$("#submit_CAPTCHA").css('background',"grey");
								$("#submit_CAPTCHA").attr('flag',"1");
								clearInterval(interval);	
							}
							if(current_fs.css('display')=='block'){
								clearInterval(interval);
							}
						},1000);
					
						
					}, function(e, xhr, type) {
						new Piece.Toast(_TU.I18n.Common.registerSendMsgFailed);
					});
				}else{
					new Piece.Toast(_TU.I18n.Common.phoneNoNotnull);
				}
				
			},
			goRegister:function(){
				if($("#submit_register_info").attr('flag') == "1"){
					new Piece.Toast(_TU.I18n.Common.registerCaptchaOuttime);
					return;
				}
				var inputCode = $("#register_captcha").val();
				if(inputCode == ""){
					new Piece.Toast(_TU.I18n.Common.registerCaptchaNotnull);
					return;
				}
				if(!V.emailV($("#account"))&&!V.phoneV($("#account"))){
					new Piece.Toast(_TU.I18n.Common.accounMsg);
					return;
				}
				var password = $("#register_password").val();
				var passwordConfirm = $("#register_password_confirm").val();
				if(password.length>12||password.length<6){
					new Piece.Toast(_TU.I18n.Common.passwordLength);
					return;
				}
				if(passwordConfirm.length>12||passwordConfirm.length<6){
					new Piece.Toast(_TU.I18n.Common.passwordLength);
					return;
				}

				var code = Piece.Cache.get("CAPTCHA");
				if(inputCode==code){
					var phone = Piece.Cache.get("register_phone");
					
					if(password!=null && password != "" && password==passwordConfirm){
						Util.Ajax(OpenAPI.addUserLogin, "GET", {					
							"appForm.phone":$("#account").val(),
							"appForm.password":password,
							dataType: 'jsonp'
						}, 'jsonp', function(data, textStatus, jqXHR) {						
							console.log(data);
							if(data=="0"){
								new Piece.Toast(_TU.I18n.Common.registerSuccess);
								Backbone.history.navigate("home/InUserInfoL", {
            					trigger: true
            				});		
							}else{
								new Piece.Toast(_TU.I18n.Common.registerFailed);
							}
						}, function(e, xhr, type) {
							new Piece.Toast(_TU.I18n.Common.registerFailed);
						});
					}else{
						new Piece.Toast(_TU.I18n.Common.registerPasswordUnmatched);
					}

				}else{
					new Piece.Toast(_TU.I18n.Common.registerCaptchaUnmatched);
				}
			}
		}); //view define

	});