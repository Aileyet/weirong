define(['zepto', 'underscore', 'backbone', 'text!base/components/footer-menu.html', '../login/login', '../util', "../openapi","../templates/template","../schema"],
	function($, _, Backbone, MenuHtml, Login, Util, OpenAPI,_TU,Schema) {

	var Menu = Backbone.View.extend({
		login: null,

		initialize: function() {
			this.render();
		},
		onLoadTemplate:function(){
			var obj=_TU._T.footer_menu;
			var TemplateHtml = $(this.el).find("#footer_menu_Template").html();
			var TemplateObj = _.template(TemplateHtml, obj);
			$("footer .bar-tab").html("").append(TemplateObj);
		},
		render: function() {
			
			$(this.el).addClass("bar-tab");
			$(this.el).html(MenuHtml);
			$(this.el).find("li").removeClass("active");
			

			this.onLoadTemplate();
			
			//更改改背景颜色
			var bgcolor = $(this.el).attr("bgcolor");
			if(bgcolor=="white"){
				$(this.el).find(".tab-item").eq(2).removeClass("bgStyle_gray").addClass("chang_white");
			}else if(bgcolor=="gray"){
				$(this.el).find(".bar-tab").css("background-color","#fff");
				$(this.el).find(".tab-item").css("background-color","#eef0f3");
				$(this.el).find(".tab-item-3").css("background-color","#eef0f3");
				$(this.el).find(".tab-item").eq(2).removeClass("chang_white").addClass("bgStyle_gray");
			}
			
			var module = window.location.hash.replace("#","");
			if(module=="")module="home/MeIndex";
			$(this.el).find("li[data-value='" + module + "']").addClass("active");
			
			//轮循切换Menu时BUG。
			var me = this;
			var MenuPrompt = Piece.Session.loadObject('Prompt');
			if (MenuPrompt != null) {
				var userPromptNum = MenuPrompt.replyCount + MenuPrompt.msgCount + MenuPrompt.referCount;
				if (userPromptNum != 0) {
					$(me.el).find('.userPrompt').css("display", "block");
					$(me.el).find('.userPromptNum').html(userPromptNum);
				}
			}

			
			$(".tab-item").live('tap', function() {
				//判断更多操作是否show，如果show，先收起来
				if ($(this).attr("data-module") !== "more") {
					 if ($('#footer-more-detail').get(0).style.display == "block") {
						 $('#footer-more-detail').hide();
						 $("#more-detail-mask").hide();
						 return;
				    }
				 }
				 //判断是否已经登录，未登录跳转到登录页面
				 var checkLogin = Util.checkLogin()
				 if(checkLogin === false || Piece.TempStage.loginId() == null){
				 	new Piece.Toast("请先登录!");
					Backbone.history.navigate("home/InUserInfoL", {
	            		trigger: true
	            	});
					 return;
			      }

			    //语音识别
                if ($(this).attr("data-module") == "voice") {
			       cordova.plugins.ExtraInfo.getExtra(function(msg){
					   for(var i=0;i<Schema.VoiceNavigate.length;i++){
					     var islike=true;
					     var txts=Schema.VoiceNavigate[i].txt.split('|');
					     for(var j=0;j<txts.length;j++){
						     if(msg.indexOf(txts[j])>-1)continue;
						     else islike=false;
					     }
					     if(islike==true){
						     Backbone.history.navigate(Schema.VoiceNavigate[i].url, {trigger: true});
					     }else{
						      Piece.Toast("请说出正确命令，如：打开设备列表");
					     }
				        }
				   },function(msg){
				     //Piece.Toast("请说出正确命令，如：打开设备列表");
				   });
			       return;
			    }
				
				var url = $(this).attr("data-value");
				if (url) {
					Piece.Store.saveObject("footer-menu-index", url);
					if ($("#id_bmapdetail_footer_menu").find("li.active").attr("data-module") == "bankmap"){
						bMap_map_this.onLeave();
					}

					Backbone.history.navigate(url, {
						trigger: true
					});
				}
			});
			
			//我的空间，未读信息
			var user_token = Piece.Store.loadObject("user_token");
			var user_message = Piece.Store.loadObject("user_message");
			// simona--add mask
			// modi by wjl websocket start 
			$(".dummyBody").append('<div id="more-detail-mask" ></div>');
			// modi by wjl websocket end
			/*更多模块的事件*/
			/*切换登陆状态*/
			$(this.el).find("#footer-more").click(function() {
				//记录返回页面
				var fulUrl = window.location.href;
				url = fulUrl.split("#");
				if(typeof url[1] == "undefined") {
					url[1] = "news/news-list";
				}
				Piece.Session.saveObject("osLastPage",url[1]);

                //判断是否是ios，如果是的话，就隐藏“退出程序”
				if (navigator.userAgent.indexOf("iPhone") > -1) {
						$("#footSignout").hide();

					}
				Util.toggleFoot();

				$(".first_row div").click(function() {
					$("#more-detail-mask").hide();
				});
			});
            if (navigator.userAgent.indexOf("Android") > -1) {
//            	$("body").addClass("iPhone");
            }
			/* 我的预约 */
			$(this.el).find("#footMySubscribe").click(function() {
				Backbone.history.navigate("subscribes/subscribe-list", {
					trigger: true
				});
			});
			/* 评价 */
			$(this.el).find("#footComments").click(function() {
				Backbone.history.navigate("appraises/appraise-list", {
					trigger: true
				});
			});
			// 系统设置
			$(this.el).find('#footSysSetting').click(function() {
				Backbone.history.navigate("user/systemSettings", {
					trigger: true
				});
			})
			/*退出程序*/
			$(this.el).find("#footSignout").click(function() {
				// navigator.app.exitApp()
				// simona--modify--confirm退出程序
				var onConfirm = function(buttonIndex) {
					if (buttonIndex == 2) {
						navigator.app.exitApp();
					}
				};
				
				navigator.notification.confirm(
					'确定退出程序吗？', // message
					onConfirm, // callback to invoke with index of button pressed
					'提示', // title
					['取消', '确定'] // buttonLabels
				);
				
			});
			/*注销或登录*/
			$(this.el).find(".footSign").click(function() {
				var dataSign = $(".footSign").attr("data-sign");
				/*注销*/
				if (dataSign === "signout") {
					Piece.Store.deleteObject("user_token");
					Piece.Store.deleteObject("user_message");
					$('#footer-more-detail').hide();
					// 注销时清除我的空间所有列表的缓存
					Util.cleanStoreListData("my-atme-list");
					Util.cleanStoreListData("my-my-comment-list");
					Util.cleanStoreListData("my-critic-list");
					Util.cleanStoreListData("my-my-list");
					Util.cleanStoreListData("my-myself-list");
					new Piece.Toast("已退出登录");
					// 取消取消轮循 且清除轮循的缓存
					Util.roundRobin();
					Piece.Session.deleteObject('Prompt');
				}
				/*登录*/
				else {
					login = new Login();
					login.show();
				}
			});

		}
	}, {
		compile: function(contentEl) {
			var me = this;
			return _.map($(contentEl).find("footer.footer-menu"), function(tag) {
				var menu = new Menu({
					el: tag
				});
				return menu;
			});
		}
	});

	return Menu;

});