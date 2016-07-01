define(['text!home/InUserInfoL.html','../base/validate', "../base/openapi", '../base/util', '../base/templates/template'],
	function(viewTemplate,validate, OpenAPI, Util,_TU) {
		var phoneType;
		if (navigator.userAgent.indexOf("iPhone") > -1) {
				phoneType ="IOS";
            }else{
            	phoneType ="Android";
            }
            
		return Piece.View.extend({
			id: 'home_InUserInfoL',
			events: {
				"touchstart #btnRegister"    :     "onToRegister",
				"touchstart #loginSubmitBtn":     "login",
				"touchstart #qqLoginBtn":     "qqLogin",
				"touchstart #wbLoginBtn":     "wbLogin",
				"touchstart #wxLoginBtn":     "wxLogin",
				"touchstart #eye"   : "onShowAndHide"
			},
			onToRegister:function(e){
				Backbone.history.navigate("home/InUserInfoReg", {
            		trigger: true
            	});
			},
			render: function() {
				$(this.el).html(viewTemplate);
				Piece.View.prototype.render.call(this);
				return this;
			},
			onShowAndHide:function(){
				var passtype = $("#loginPassword").attr("type");
				if(passtype=="text"){
					$("#loginPassword").attr("type","password");
				}else if(passtype=="password"){
					$("#loginPassword").attr("type","text");
				}
			},
			onLoadTemplate:function(){
				_TU._U.setHeader(_TU._T.home_InUserInfoL);//替换头部导航
				var userInfoTemplate = $(this.el).find("#LoginTemplate").html();
				var userInfoHtml = _.template(userInfoTemplate, _TU._T.home_InUserInfoL.data);
				$(".content").html("");
				$(".content").append(userInfoHtml);
			},
			onShow: function() {
				this.onLoadTemplate();
				_TU._U.goBack(function(){
					Backbone.history.navigate("home/MeIndex", {trigger: true});
					return;		    
				});
			},
			qqLogin: function() {
				if(phoneType=="IOS"){
					 cordova.exec(function(msg){
                                             // 识别成果回调
                                             console.log(msg);
                                             new Piece.Toast(msg);
                                             
                                             
                                             },function(msg){
                                             new Piece.Toast(msg);
                                             // 识别失败回调
                                             console.log(msg);
                                             
                                             
                                             },"QQAuthLogin","authLogin",[]);
				}else if(phoneType=="Android"){
					var qqLogin =window.QQLogin;
					if(qqLogin){
						qqLogin.ssoLogin(function(res) {
				        	new Piece.Toast('uid:'+res.uid+' token:'+res.token+"---"+res);
					    }, function() {
					        new Piece.Toast(_TU.I18n.Common.AuthorizationFailed);
					    });
					}else{
						new Piece.Toast(_TU.I18n.Common.AuthorizationFailed);
					}
				}
				
				
			},
			wbLogin: function() {
				if(phoneType=="IOS"){
					 cordova.exec(function(msg){
                                             // 识别成果回调
                                             console.log(msg);
                                             new Piece.Toast(msg);
                                             
                                             
                                             },function(msg){
                                             
                                             // 识别失败回调
                                             console.log(msg);
                                             new Piece.Toast(msg);
                                             
                                             },"WeiBoAuthLogin","authLogin",[]);
				}else if(phoneType=="Android"){
					var weiboLogin =window.WeiboLogin;
					if(weiboLogin){
						weiboLogin.ssoLogin(function(res) {
				        	new Piece.Toast(res);
					    }, function() {
					        new Piece.Toast(_TU.I18n.Common.AuthorizationFailed);
					    });
					}else{
						new Piece.Toast(_TU.I18n.Common.AuthorizationFailed);
					}
				}

				
			},
			wxLogin:function(){
				if(phoneType=="IOS"){
					cordova.exec(function(msg){
                                             // 识别成果回调
                                             console.log(msg);
                                             
                                             new Piece.Toast(msg);
                                             
                                             },function(msg){
                                             
                                             // 识别失败回调
                                             console.log(msg);
                                             new Piece.Toast(msg);
                                             
                                             },"WeChatAuthLogin","sendAuthRequest",[]);
				}else if(phoneType=="Android"){
					var weixionLogin =Wechat;
					if(weixionLogin){
						weixionLogin.isInstalled(function(res) {
							console.log(res);
				        	new Piece.Toast(res);
					    }, function() {
					        new Piece.Toast(_TU.I18n.Common.wxClientNotInstalled);
					        return;
					    });

					    weixionLogin.auth('test','test',function(res) {
							console.log(res);
				        	new Piece.Toast(res);
					    }, function() {
					        new Piece.Toast(_TU.I18n.Common.AuthorizationFailed);

					    });
					}else{
						new Piece.Toast(_TU.I18n.Common.AuthorizationFailed);
					}
				}	
			},
			login:function(){

					var u = $("#loginUserName").val();
					var p = $("#loginPassword").val();
					if (u === null || u === undefined || u === "") {
						//todo
						new Piece.Toast(_TU.I18n.Common.accounMsg);

					} else if (p === null || p === undefined || p === "") {
						new Piece.Toast(_TU.I18n.Common.enterPasswordMsg);
					} else {
						 if(!validate.emailV($("#loginUserName"))&&!validate.phoneV($("#loginUserName"))){
						 	new Piece.Toast(_TU.I18n.Common.accounMsg);
						 	return;
						 }

						 if(p.length>12||p.length<6){
							new Piece.Toast(_TU.I18n.Common.passwordLength);
							return;
						}
						//检查网络
						if (pieceConfig.enablePhoneGap == true && Util.checkConnection() == 'No network connection') {
							new Piece.Toast(_TU.I18n.Common.connectNetFailed);
							return;
						}
						Util.Ajax(OpenAPI.access_token, "GET", {
							clientId: OpenAPI.clientId,
							clientSecret: OpenAPI.clientSecret,
							grantType: "refresh_token",
							username: u,
							password: p,
							dataType: 'jsonp'
						}, 'jsonp', function(data, textStatus, jqXHR) {
							
							if (data.responseCode != 0) {
								new Piece.Toast(_TU.I18n.Common.signInError);
								return;
							}
							// 判断是否保存密码
							var isCheckd = $('.rememberPassword').is(":checked");
							if (isCheckd) {
								$('.rememberPassword').attr("checked", "true");
							} else {
								$('.rememberPassword').attr("checked", "false");
							}
							var user_info = {
								username: u,
								password: p,
								isCheckd: isCheckd,
								nickName : data.nickName								
							};
							Piece.Store.deleteObject("user_info", true);
							Piece.Store.deleteObject("user_token", true);
							Piece.Store.saveObject("user_info", user_info, true);
							Piece.Store.saveObject("loginId", data.userLoginId, true);
							Piece.TempStage.loginId(data.userLoginId);
							Piece.TempStage.loginUser(user_info);
							data.addTime = new Date().getTime();
							Piece.Store.saveObject("user_token", data, true);
							new Piece.Toast(_TU.I18n.Common.signInSuccess);

							Backbone.history.navigate("home/MeIndex", {
            					trigger: true
            				});						


						}, function(e, xhr, type) {
							new Piece.Toast(_TU.I18n.Common.signInError);
						});

					}
			}
		}); 
	});