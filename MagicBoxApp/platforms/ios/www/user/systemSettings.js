define(['text!user/systemSettings.html', '../base/login/login', '../base/util', "../base/openapi", "../user/feedback"],
	function(viewTemplate, Login, Util, OpenAPI, Feedback) {
		var loginBarHtml = "<span class='icon-user icon-1_5x'></span><div>用户登录</div>";
		var logOffBarHtml = "<span class='icon-remove-sign icon-1_5x'></span><div>用户注销</div>";
		return Piece.View.extend({
			id: 'user_systemSettings',
			events: {
				"click .backBtn": "goBackToHome",
				"click .clearCache": "clearCache",
				"click .UserLogin": "UserLogin",
				"click .myData": "goMyData",
				"click .feedback": "goFeedback",
				"click .aboutUs": "goAboutUs",
				"click #loadImg": "loadImg",
				"click #changePwd": "goChangePwd",
				"tap #checkVersion": "checkVersion"
			},
			goChangePwd:function(){	
				var checkLogin = Util.checkLogin();
				if (checkLogin === false) {
					login = new Login();
					login.show();
				} else {
					Backbone.history.navigate("user/user-changepwd", {
						trigger: true
					});	
				}
				
			},
			loadImg:function() {
				var isCheckd = $('#loadImg').is(":checked");
				if (isCheckd) {
					$('#loadImg').attr("checked", "true");
					Piece.Session.saveObject("loadImg",1);
				} else {
					$('#loadImg').attr("checked", "false");
					Piece.Session.saveObject("loadImg",0);
				}
			},
			goFeedback: function() {
				var maxHeigth = $(window).height() >= $(this.el).find("#scrollContent").height()? $(window).height():$(this.el).find("#scrollContent").height();
				var feedback = new Feedback()
				feedback.show(maxHeigth);
			},
			goMyData: function() {
				var checkLogin = Util.checkLogin();
				if (checkLogin === false) {
					login = new Login();
					login.show();
				} else {
					Backbone.history.navigate("user/user-info", {
						trigger: true
					});
				}
			},
			goBackToHome: function() {
				window.history.back();
			},
			goAboutUs:function() {
				Backbone.history.navigate("user/about-us", {
						trigger: true
					});
			},
			render: function() {
				$(this.el).html(viewTemplate);

				Piece.View.prototype.render.call(this);
				return this;
			},
			onShow: function() {
				Piece.View.prototype.onShow.call(this);
				var me = this;
				me.goDlg = new Piece.Dialog(
						{
							autoshow:false, // 是否初始化时就弹出加载控件
							target:"#user_systemSettings", //页面目标组件标识  
							title: "是否确认注销？",//弹出框标题  
							content:"",//弹出框提示文字
						},{
							configs:[{title:"是", eventName:"yes"},
							         {title:"否", eventName:"no"}],
							yes:function(){
								me.Logout();							
							},
							no:function(){
								
							}
					});
				// 判断是否登录
				var user_token = Piece.Store.loadObject("user_token", true);
				if (!user_token || user_token === null) {
					$(".UserLogin").html("");
					$(".UserLogin").html(loginBarHtml);
				} else {
					$(".UserLogin").html("");
					$(".UserLogin").html(logOffBarHtml);
				}
				//判断是否加载图片
				var loadImg = Piece.Session.loadObject("loadImg");
				if(loadImg == "1") {
					$('#loadImg').attr("checked", "true");
				}

			},
			clearCache: function() {
				var userInformationToken = Piece.Store.loadObject("user_token", true);
				var userInformationMessage = Piece.Store.loadObject("user_message", true);
				var userInformationInfo = Piece.Store.loadObject("user_info", true);
				Piece.Store.deleteObject(Piece.ZTake.loginId(), true);
				new Piece.Toast('清除缓存成功');
			},
			checkVersion : function() {
				var dialog = new Piece.Dialog({
					title: '编辑 证件号码',
					confirm: function(e, value) {
		        		target.text(value);
		        	
		        		me.form["appForm.certNO"] = value;
					},
					content: '<input class="dialog-input"  value="'+target.text()+'" autocomplete="on" placeholder="例如：33035484895415">'
				});
			},
			UserLogin: function() {
				var loginInfor = $('.UserLogin').html();
				var me = this;
				if (loginInfor.length == loginBarHtml.length) {
					login = new Login();
					login.show();
				} else {
					me.goDlg.show();
					
				}
				
			},
			Logout:function(){
				Util.Ajax(OpenAPI.logout, "GET", {
					"userLoginData.userLoginId" : Piece.ZTake.loginId()
				}, 'jsonp', function(data, textStatus, jqXHR) {
					
				});
				// 停止WebSocket
				Util.sockDisconnect();
				Piece.Store.deleteObject("user_token", true);
				Piece.Store.deleteObject("loginId", true);
				 
				$('#footer-more-detail').hide();
				// 注销时清除我的空间所有列表的缓存
				$('.UserLogin').html(loginBarHtml);
				
				new Piece.Toast("已注销登录");
			}
			
		}); //view define

	});