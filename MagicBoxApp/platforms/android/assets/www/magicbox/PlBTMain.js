define(
		[ 'text!magicbox/PlBTMain.html', "../base/templates/template" ],
		function(viewTemplate, _TU) {
			var musicScroll=0;
			return Piece.View
					.extend({
						id : 'magicbox_PlBTMain',
						events : {
							"touchstart .switch" : "onSwitch",
							"touchstart .custom" : "onCustom",
							"touchstart .addVol" : "onAddVol",
							"touchstart .subVol" : "onSubVol",
							"touchstart .BTset" : "onBTset",
							"touchstart .readCard" : "onReadCard",
							"touchstart .song" : "onSong",
							"touchstart .sleep" : "onSleep"
						},
						onSwitch : function(e) {
						},
						onCustom : function(e) {
						},
						onAddVol : function(e) {
							if (null == Piece.Cache
									.get("PlBTSongList-Play-Src")
									|| "" == Piece.Cache
											.get("PlBTSongList-Play-Src")) {
								return;
							}
							this.addVol();
						},
						onSubVol : function(e) {
							if (null == Piece.Cache
									.get("PlBTSongList-Play-Src")
									|| "" == Piece.Cache
											.get("PlBTSongList-Play-Src")) {
								return;
							}
							this.subVol();
						},
						onBTset : function(e) {
							Backbone.history.navigate("magicbox/CoBTSetup", {
								trigger : true
							});
						},
						onReadCard : function(e) {
							new Piece.Toast(_TU._T.magicbox_PlBTMain.data.msg1);
							return;
						},
						onSong : function(e) {
							Backbone.history.navigate("magicbox/PlBTSongList",
									{
										trigger : true
									});
						},
						onSleep : function(e) {
							new Piece.Toast(_TU._T.magicbox_PlBTMain.data.msg2);
							return;
						},
						render : function() {
							$(this.el).html(viewTemplate);

							Piece.View.prototype.render.call(this);
							return this;
						},
						// 播放音频
						playAudio : function(src) {
							// 音频播放器
							var my_media = null;
							var mediaTimer = null;
							// 从目标文件创建Media对象
							my_media = new Media(src, this.onSuccess,
									this.onError);
							// 播放音频
							my_media.play();
							// 每秒更新一次媒体播放到的位置
							if (mediaTimer == null) {
								mediaTimer = setInterval(function() {
									// 获取媒体播放到的位置
									my_media.getCurrentPosition(
									// 获取成功后调用的回调函数
									function(position) {
										if (position > -1) {
											setAudioPosition((position / 1000)
													+ " sec");
										}
									},
									// 发生错误后调用的回调函数
									function(e) {
										console.log("Error getting pos=" + e);
										setAudioPosition("Error: " + e);
									});
								}, 1000);
							}
						},
						// 创建Media对象成功后调用的回调函数
						onSuccess : function() {
							console.log("playAudio():Audio Success");
						},
						// 创建Media对象出错后调用的回调函数
						onError : function(error) {
							new Piece.Toast('code: ' + error.code + '\n'
									+ 'message: ' + error.message + '\n');
						},
						// 设置音频播放位置
						setAudioPosition : function(position) {
							document.getElementById('audio_position').innerHTML = position;
						},
						// 暂停音频播放
						pauseAudio : function() {
							if (my_media) {
								my_media.pause();
							}
						},
						// 停止音频播放
						stopAudio : function() {
							if (my_media) {
								my_media.stop();
							}
							clearInterval(mediaTimer);
							mediaTimer = null;
						},
						// 增加音量
						addVol : function() {
							All.media_vol = All.media_vol + 0.1;
							var wid = $(".vol-bar").width();
							var timeNum = 10;
							var move = wid / timeNum * (All.media_vol * 10);
							if (move < 0) {
								move = 0;
							}
							if (move > wid) {
								move = wid + 1;
							}
							$(".vol-progress").css("width", move + "px");
							if (All.media_vol > 1) {
								All.media_vol = 1;
							}
							All.vol_status = "0";
							All.my_media.setVolume(All.media_vol);
						},
						progressBarInit : function() {
							var wid = $(".vol-bar").width();
							var timeNum = 10;
							var move = wid / timeNum * (All.media_vol * 10);
							if (move > wid) {
								move = wid + 1;
							}
							if (move < 0) {
								move = 0;
							}
							if ("1" == All.vol_status) {
								All.media_vol = 0.0;
								$(".vol-progress").css("width", "0px");
							} else {
								$(".vol-progress").css("width", move + "px");
							}
						},
						// 减小音量
						subVol : function() {
							All.media_vol = All.media_vol - 0.1;
							var wid = $(".vol-bar").width();
							var timeNum = 10;
							var move = wid / timeNum * (All.media_vol * 10);
							if (move > wid) {
								move = wid + 1;
							}
							if (move < 0) {
								move = 0;
							}
							$(".vol-progress").css("width", move + "px");
							if (All.media_vol < 0) {
								All.media_vol = 0;
							}
							if (0 == All.media_vol) {
								All.vol_status = "1";
							}
							All.my_media.setVolume(All.media_vol);
						},
						songNameScroll : function() {
							musicScroll =setInterval(function() {
								var obj =document.getElementById('scrollobj');
								var tmp = (obj.scrollLeft)++;
								// 当滚动条到达右边顶端时
								if (obj.scrollLeft == tmp)
									obj.innerHTML += obj.innerHTML;
								// 当滚动条滚动了初始内容的宽度时滚动条回到最左端
								if (obj.scrollLeft >= 300)
									obj.scrollLeft = 0;
								// 获取正在播放音乐名称
								var now_song = Piece.Cache
										.get("PlBTSongList-Play-Title");
								// 设置播放名称
								if (("0" == All.media_status || "1" == All.media_status)
										&& null != now_song && "" != now_song) {
									$(".song-title")
											.text(
													_TU._T.magicbox_PlBTMain.data.music_name
															+ now_song);
								} else {
									$(".song-title")
											.text(
													"　　"
															+ _TU._T.magicbox_PlBTMain.data.music_noPlay
															+ "　　");
								}
							}, 1000);
						},
						onLoadTemplate : function() {
							_TU._U.setHeader(_TU._T.magicbox_PlBTMain);
							var me = this;
							// 页面布局共通化管理

							var plBTMainTemplate = $(me.el).find(
									"#PlBTMainTemplate").html();
							var plBTMainHtml = _.template(plBTMainTemplate,
									_TU._T.magicbox_PlBTMain.data);
							$(".content").html(plBTMainHtml);
							// 根据蓝牙连接状态显示文字
							if (All.bt_cnn_status == 0) {
								$(".switch")
										.text(
												_TU._T.magicbox_PlBTMain.data.switch_text);
							} else {
								$(".switch")
										.text(
												_TU._T.magicbox_PlBTMain.data.switchOff_text);
							}
						},
						onShow : function() {
							var me = this;
							me.onLoadTemplate();// 加载配置模板
							me.progressBarInit();
							me.songNameScroll();
							// 获取正在播放音乐名称
							var now_song = Piece.Cache
									.get("PlBTSongList-Play-Title");
							// 设置播放名称
							if (("0" == All.media_status || "1" == All.media_status)
									&& null != now_song && "" != now_song) {
								$(".song-title")
										.text(
												_TU._T.magicbox_PlBTMain.data.music_name
														+ now_song);
							} else {
								$(".song-title")
										.text(
												"　　"
														+ _TU._T.magicbox_PlBTMain.data.music_noPlay
														+ "　　");
							}

							// write your business logic here :)
							var wid = $(".menu-box").width();
							var hei = $(".menu-box").height();
							var HI = $(".menu-view i").height();
							var HD = $(".menu-view div").height();
							$(".menu-view i").css({
								"margin-top" : ((hei - (HI + HD)) / 2) + "px"
							});

							$(".content").find(".menu-view").each(
									function(ev, ex) {
										var _this = $(ex);
										var t = _this.position().top;
										var l = _this.position().left;
										_this.css({
											"width" : wid + "px",
											"height" : hei + "px",
											"top" : t + 'px',
											"left" : l + 'px'
										});
									});

							_TU._U.goBack(function(){
								clearInterval(musicScroll);
								history.go(-1);
								return;		    
							});
						}
					}); // view define

		});