define(["text!../../base/login/login.html", "zepto", "../../base/openapi", '../../base/util'],
	function(LoginHtml, $, OpenAPI, Util) {
		var Login = Backbone.View.extend({

			id: 'loginContent',

			initialize: function(options) {
				this.render();
			},

			render: function() {
				//解决重复的登陆框
				if ($("#loginContent").size() > 0) {
					$("#loginContent").remove();
				}
				var me = this;

				$(window).unbind("resize", me.checkLoginContent);

				//定义屏幕伸缩重新计算宽度
				$(window).resize(function() {
					me.checkLoginContent();

				});

				this.el = LoginHtml;
				$("body").append(this.el);

				this.resetPosition();
				//点击 X 图标才可以跳出 登陆
				$(".removeImg").click(function() {
					me.hide();
					// simona
					if (typeof $('#footer-more-detail').get(0) !== 'undefined') {
						if ($('#footer-more-detail').get(0).style.display == "block") {
							$("#more-detail-mask").show();
						}

					}

				});

				var user_info = Piece.Store.loadObject("user_info", true);
				//判断登陆时是否记住密码
				if (user_info != null) {
					var rememberPassword = user_info.isCheckd;
					if (user_info !== null && rememberPassword) {
						$("#loginUserName").val(user_info.username);
						$("#loginPassword").val(user_info.password);
						$('.rememberPassword').attr("checked", true);
					}
				}
				$("#loginRegisterBtn").click(function(){	
					me.hide();
//					Backbone.history.navigate('#user/register', {trigger: true});
					Backbone.history.navigate('/home/home-registered', {trigger: true});
				});

				$("#loginSubmitBtn").click(function() {
					var u = $("#loginUserName").val();
					var p = $("#loginPassword").val();
					if (u === null || u === undefined || u === "") {
						//todo
						new Piece.Toast('请输入账号/邮箱');

					} else if (p === null || p === undefined || p === "") {
						new Piece.Toast('请输入密码');

					} else {
						//检查网络
						if (pieceConfig.enablePhoneGap == true && Util.checkConnection() == 'No network connection') {
							new Piece.Toast("网络连接失败，请检查网络设置");
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
								new Piece.Toast("登录失败用户名或密码错误！");
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
							//access_token: "5be41c87-c4f6-46ab-bedf-21ec47cad2a9", token_type: "bearer", expires_in: 42846
							Piece.Store.saveObject("user_info", user_info, true);
							Piece.Store.saveObject("loginId", data.userLoginId, true);
							Piece.TempStage.loginId(data.userLoginId);
							Piece.TempStage.loginUser(user_info);
							data.addTime = new Date().getTime();
							Piece.Store.saveObject("user_token", data, true);
							me.hide();
							new Piece.Toast('登陆成功');

//							me.loadUserInfo();
							// 启动WebSocket  add by wjl
							//Util.sockConnect();

							var localHref = window.location.href;
							// var fromLocalHrefLoad = localHref.search(/index.html#/);
							// var fromLocalHref = localHref.substring(fromLocalHrefLoad);
							var localHrefMy = localHref.split("#");
							var mylocalHref = localHrefMy[1].split("/");
							//user-syssetting页面调用
							if (localHrefMy[1] === "user/systemSettings") {
								$('.UserLogin').html("<span class='icon-remove-sign icon-2x'></span><div>用户注销</div>");
							}
							//登陆成功后收回更多模块弹窗
							$('#footer-more-detail').hide();

							Util.reloadPage(Util.requestView());


						}, function(e, xhr, type) {
							new Piece.Toast("登录失败用户名或密码错误！");
						});

					}

				});



			},
			reMyList: function() {
				var user_message = Piece.Store.loadObject('user_message');
				var user_token = Piece.Store.loadObject('user_token', true);
				/*
				Util.loadList(this.parentEl, 'my-my-list', OpenAPI.my_list, {
					'catalog': 1,
					'access_token': user_token.access_token,
					'user': user_message.id,
					'pageSize': OpenAPI.pageSize,
					'page': 1,
					'dataType': OpenAPI.dataType
				});
				*/
			},

			loadUserInfo: function() {
				var me = this;
				var token = Piece.Store.loadObject("user_token", true);
				var accesstoken = token.accessToken;
				
				Util.loadObj(OpenAPI.access_user, "GET", {
					accessToken: accesstoken,
					dataType: 'jsonp'
				}, 'jsonp', function(data, textStatus, jqXHR) {
					//TODO 以后放到消息那层中
					Piece.Store.saveObject("user_message", data, true);
					// 因为我的空间登录成功时，需要重新LOAD整个列表，因为用户ID只有在此方法中才能拿到，所以写到这里。
					var localHref = window.location.href;
					var fromLocalHref = localHref.substr(-7);
					if (fromLocalHref === "my-list") {
						me.reMyList();
					}
				}, null);

				

			},


			checkLoginContent: function() {
				var me = this;
				if ($("#loginContent").css("display") === "block") {
					me.resetPosition();
					$("#loginContent").show();
				}
			},

			resetPosition: function() {
				$("#loginContent").show();
				var left = ($(window).width() - $("#loginContent").width()) / 5;
				var top = ($(window).height() - $("#loginContent").height()) / 3;
				$("#loginContent").css({
					"position": "absolute",
					"top": top,
					"left": left,
					"display": 'none'
				});
				$("#loginContent").hide();
			},

			show: function() {
				var me = this;
				me.resetPosition();
				$("#loginContent").show();
				$("#loginContentMasker").show();

			},
			hide: function() {
				$("#loginContent").hide();
				$("#loginContentMasker").hide();
			}

		});
		return Login;
	});