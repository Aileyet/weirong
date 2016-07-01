define(['zepto', 'underscore', 'backbone', 'text!base/components/footer-menu-detail.html', '../login/login', '../util', "../openapi"],
	function($, _, Backbone, MenuDetailHtml, Login, Util, OpenAPI) {

		var MenuDetail = Backbone.View.extend({
			login: null,
			// 传detail值 
			parentEl: null,
			commentListId: null,
			apiName: null,
			initialize: function(options) {
				this.parentEl = options.parentEl;
				this.commentListId = options.commentListId;
				this.apiName = options.apiName;
				this.render();
			},

			render: function() {
				var me = this;
				login = new Login();

				$(".footer-menu-detail").addClass("bar-tab");
				$(".footer-menu-detail").html(MenuDetailHtml);
				$('#commentNew').click(function() {
					//判断内容是否为空再检查登陆
					var commentCont = $("#commentCont").val();
					commentCont = commentCont.replace(/(\s*$)/g, ""); //去掉右边空格
					if (commentCont === "" || commentCont === " ") {
						new Piece.Toast('请输入评论内容');
					} else {
						me.checkLogin();
					}

				});
				$('.footcomment').click(function() {
					$('.tab-inner').find('.tab-item').hide();
					$('.tab-inner').find('.commentFoot').show();
					$('.footcomment').attr("placeholder", "");
					$('.footcomment').addClass("Onfootcomment");
					//如果是小米1系统，按钮样式
					if (navigator.userAgent.indexOf("MI-ONE") > -1) {
						$("#commentNew").attr('style', 'height:40px !important;margin-top:4px;');

					}
					if ($('.footcomment').hasClass("Onfootcomment") || navigate.app) {
						document.addEventListener("backbutton", this.onBackKeyDown, false);
					}
				});
				// 评论数提示信息框大小
				var commentCount = $('.promptInformation').html();
				if (commentCount >= 10) {
					$('.promptInformation').css("width", "16px")
				}
				if (commentCount >= 100) {
					$('.promptInformation').css("width", "22px")
				}

				var id = $(".footer-menu-detail").attr("data-id");
				// collect
				$(".collect").click(function() {
					Util.checkLogin();
					var checkLogin = Util.checkLogin();
					if (checkLogin === false) {
						login.show();
					} else {

						var noFavorite = $(".collect").hasClass("icon-star-empty");
						// 判断此用户是否以收藏此页面
						if (noFavorite) {
							var token = Piece.Store.loadObject("user_token");
							var user_message = Piece.Store.loadObject("user_message");
							var accesstoken = token.accessToken;
							var favoriteType = Util.request("fromType");
							Util.Ajax(OpenAPI.favorite_add, "GET", {
								id: id,
								type: favoriteType,
								access_token: accesstoken,
								dataType: 'jsonp'
							}, 'json', function(data, textStatus, jqXHR) {
								var yesORno = data.error;
								console.info(yesORno + "====eeror")
								if (yesORno == 200) {
									new Piece.Toast('添加收藏成功');
									$(".tab-item").find('.collect').removeClass("icon-star-empty").addClass("icon-star");
									$('.icon-star').css("color", "#0882f0");

									// 当添加收藏时，更新session的收藏状态，重新保存一份session
									var detailID = Util.request("id");
									var SessionDetail = Piece.Session.loadObject("L" + detailID)
									SessionDetail.favorite = 1;
									var LandingCache = "L" + detailID;
									Piece.Session.saveObject(LandingCache, SessionDetail);
								} else {
									new Piece.Toast('添加收藏失败');
								}

							}, null);
						} else {
							var token = Piece.Store.loadObject("user_token");
							var user_message = Piece.Store.loadObject("user_message");
							var accesstoken = token.accessToken;
							var favoriteType = Util.request("fromType");
							Util.Ajax(OpenAPI.favorite_remove, "GET", {
								id: id,
								type: favoriteType,
								accessToken: accesstoken,
								dataType: 'jsonp'
							}, 'json', function(data, textStatus, jqXHR) {
								var yesORno = data.error;
								if (yesORno == 200) {
									new Piece.Toast('取消收藏成功');
									$(".tab-item").find('.collect').removeClass("icon-star").addClass("icon-star-empty");
									$('.collect').css("color", "white");

									// 当添加收藏时，更新session的收藏状态，重新保存一份session
									var detailID = Util.request("id");
									var SessionDetail = Piece.Session.loadObject("L" + detailID)
									SessionDetail.favorite = 0;
									var LandingCache = "L" + detailID;
									Piece.Session.saveObject(LandingCache, SessionDetail);

								} else {
									new Piece.Toast('取消收藏失败');
								}

							}, null);
						}



					}
				});

				

				$("#gotoCommon").click(function() {
					$(".footer-menu-detail").find("li").removeClass("active").eq(2).addClass("active");
					$('.newsList').hide();
					$('#' + me.commentListId).parent().show();

					setTimeout(function() {
						me.parentEl.listIscroll.refresh();
					}, 2000)
				})

				$(".detail").click(function() {
					$(".footer-menu-detail").find("li").removeClass("active").eq(1).addClass("active");
					$('#' + me.commentListId).parent().hide();
					$('.newsList').show();
				})

				var shareBoolen = "true";
				$('.moreShare').click(function(el) {
					var detailTit = $('.detailTitle').html();
					var detailID = Util.request("id");
					var detailUrlCache = Piece.Session.loadObject("L" + detailID);
					var detailUrlCacheLoadingSta = Piece.Session.loadObject(detailID);
					if (detailUrlCache != null) {
						var detailURL = detailUrlCache.url;
					}
					if (detailUrlCacheLoadingSta != null) {
						var detailURL = detailUrlCacheLoadingSta.url;
					}
					var detailURLcontent = detailTit + ":" + detailURL;
					console.info(el)

					var shareContent = {
						text: detailURLcontent
					};
					if (shareBoolen == "true") {
						shareBoolen = "false";
						setTimeout(function() {
							shareBoolen = "true";
						}, 1000)
						cordova.exec(function(obj) {
								//console.log("Success>>" + obj);
							},
							function(e) {
								console.log("Error: " + e);
							}, "ShareSDK", "showSharePanel", [shareContent]);
					}


				})

			},
			onShow: function() {},

			comment: function() {
				// $('.tab-inner').find('.tab-item').hide();
				// $('.tab-inner').find('.active').show();

			},
			checkLogin: function() {
				Util.checkLogin();
				var checkLogin = Util.checkLogin();
				if (checkLogin === false) {
					login.show();
				} else {
					this.commentPub();
				}
			},
			commentPub: function() {
				me = this;
				var commentCont = $("#commentCont").val();
				commentCont = commentCont.replace(/(\s*$)/g, ""); //去掉右边空格
				if (commentCont === "" || commentCont === " ") {
					new Piece.Toast('请输入评论内容');
				} else {

					var userToken = Piece.Store.loadObject("user_token");
					var accessToken = userToken.access_token;
					var id = Util.request("id");
					var fromType = Util.request("fromType");
					var catalog = null;
					var urlRource = null;
					var options = null;
					switch (fromType) {
						case "4":
							{
								catalog = 1;
								urlRource = "comment_pub";
								options = {
									access_token: accessToken,
									id: id,
									catalog: catalog,
									content: commentCont,
									dataType: 'jsonp'
								};
								break;
							}
						case "3":
							{
								catalog = 1;
								urlRource = "blog_comment_pub";
								options = {
									access_token: accessToken,
									blog: id,
									content: commentCont,
									dataType: 'jsonp'
								};
								break;
							}
						case "2":
							{
								catalog = 2;
								urlRource = "comment_pub";
								options = {
									access_token: accessToken,
									id: id,
									catalog: catalog,
									content: commentCont,
									dataType: 'jsonp'
								};
								break;
							}
					}

					Util.Ajax(OpenAPI[urlRource], "GET", options, 'json', function(data, textStatus, jqXHR) {
						//评论之后的一些评论框页面效果及刷新动态数据
						if (data.error === "200") {

							new Piece.Toast("评论成功");
							$("#commentCont").val('');
							//simona---modify--触发刷新事件
							// $(".refreshBtn").trigger("click");
							//simona---modify--到评论页面，并刷新数目
							// $("#gotoCommon").trigger("click");
							setTimeout(function() {
								$(".footer-menu-detail").find("li").removeClass("active").eq(2).addClass("active");
								$('.newsList').hide();
								$('#' + me.commentListId).parent().show();
								console.info($(".refreshBtn"));
								$(".refreshBtn").trigger("click");

							}, 500);

						} else {
							console.info("=========data.error_description============" + data.error);
							console.info(data);
							console.info(textStatus);
							console.info(jqXHR);

							if (data.error_description !== "" && data.error_description !== 'undefined' && typeof(data.error_description) !== "undefined") {
								new Piece.Toast(data.error_description);
							} else {
								new Piece.Toast("请求出错，请稍后再试！");
							}


						}
					}, null, null);

				}
			},
			onBackKeyDown: function() {
				$('.tab-inner').find('.tab-item').show();
				$('.tab-inner').find('.commentBtn').hide();
				$('.footcomment').blur();
				$('.footcomment').attr("placeholder", "发表评论");
			}


		});

		return MenuDetail;

	});