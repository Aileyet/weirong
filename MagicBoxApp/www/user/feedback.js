define(['text!user/feedback.html', "zepto", "../base/openapi", '../base/util'],
	function(viewTemplate, $, OpenAPI, Util) {
		return Piece.View.extend({
			id: 'user_feedback',
			initialize: function() {
				this.render();
			},
			render: function() {
				//解决重复的登陆框
				if ($("#loginContent").size() > 0) {
					$("#loginContent").remove();
				}
				// 添加依赖
				var me =this;
				this.el = viewTemplate;
				$("body").append(this.el);

				$(window).unbind("resize", me.checkLoginContent);
				this.resetPosition();

				//定义屏幕伸缩重新计算宽度
				$(window).resize(function() {
					me.checkLoginContent();
				});
				//点击 X 图标才可以跳出 登陆
				$(".removeImg").click(function() {
					me.hide();
				});
				$("#feedbackBtn").click(function(){
					var feedbackText = $("#feedbackText").val();
					if (feedbackText != "") {
						cordova.exec(function(obj) {
								console.log("Success>>" + obj);
							},
							function(e) {
								console.log("Error: " + e);
							}, "SendMail", "SendMail", [feedbackText]);
							me.hide();

					}else{
						new Piece.Toast('反馈信息不能为空');
					}
				})

			},
			onShow: function() {
			},
			show: function(maxHeight) {
				$("#loginContent").show();
				$("#loginContentMasker").height(maxHeight);
				$("#loginContentMasker").show();
			},
			hide: function() {
				$("#loginContent").hide();
				$("#loginContentMasker").hide();
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
				var left = (document.body.clientWidth - $("#loginContent").width()) / 2;
				var top = ( document.body.clientHeight - $("#loginContent").height()) / 2;
				$("#loginContent").css({
					"position": "fixed",
					"top": "25%",
					"left": "20%",
					"display": 'none'
				});
				$("#loginContent").hide();
			},
		}); //view define

	});