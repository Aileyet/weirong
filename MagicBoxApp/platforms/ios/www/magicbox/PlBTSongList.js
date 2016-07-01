define(
		[ 'text!magicbox/PlBTSongList.html', "../base/templates/template" ],
		function(viewTemplate, _TU) {
			return Piece.View
					.extend({
						id : 'magicbox_PlBTSongList',
						events : {
							"tap .play" : "onPlay",
							"touchstart .doPlay" : "onDoPlay",
							"touchstart .back" : "previousPlay",
							"touchstart .ahead" : "nextPlay",
							"touchstart .type" : "onType",
							"touchstart .mute" : "onMute"
						},
						onPlay : function(e) {
							var now_src = Piece.Cache
									.get("PlBTSongList-Play-Src");// 获取正在播放的歌曲路径
							var src = $(e.target).parent().parent()
									.find(".src").text();
							var title = $(e.target).parent().parent().find(
									".title").text();
							var len = $(e.target).parent().parent().find(
									".length").text();
							var music_id = $(e.target).parent().parent().find(
									".music_id").text();
							$(".len_all").text(len);// 设置进度条中音乐总长度
							All.music_len = len;
							// 保存播放的歌曲id
							if (null != All.music_list
									&& All.music_list.length > 0) {
								var arr = All.music_list;
								for (var i = 0; i < arr.length; i++) {
									if (music_id == arr[i].id) {
										All.music_no = i;
									}
								}
							}
							// 如果所选歌曲正在播放，暂停
							if (src == now_src) {
								if ("0" == All.media_status) {
									this.pauseAudio();
								} else {
									this.playAudio(src);
								}
								// 如果所选歌曲未播放，切歌
							} else {
								if (null != now_src && "" != now_src) {
									this.stopAudio();
									clearTimeout(All.progressId);
									clearTimeout(All.timeoutId);
									All.mediaTimer = null;
									All.mediaPosition = 0;
									All.moveTotal = 0;
									All.played_time = 0;
								}
								$(".iconc").css("visibility", "hidden");
								this.playAudio(src);
								$(e.target).parent().parent().find(".iconc")
										.css("visibility", "visible");
								Piece.Cache.put("PlBTSongList-Play-Src", src);// 保存播放的歌曲路径
								Piece.Cache.put("PlBTSongList-Play-Title",
										title);// 保存播放的歌曲名称
								Piece.Cache.put("PlBTSongList-Play-Mcid",
										music_id);
							}
						},
						onDoPlay : function(e) {
							var src = Piece.Cache.get("PlBTSongList-Play-Src");// 获取正在播放的歌曲路径
							// 如果所选歌曲正在播放，暂停
							if (null != src && "" != src) {
								if ("0" == All.media_status) {
									this.pauseAudio();
								} else {
									this.playAudio(src);
								}
								Piece.Cache.put("PlBTSongList-Play-Src", src);// 保存播放的歌曲路径
							} else {
								new Piece.Toast(
										_TU._T.magicbox_PlBTSongList.data.noSelect_msg);
								return;
							}
						},
						onType : function(e) {
							// 切换循环播放类型 0:顺序播放；1:单曲循环；2:随机播放
							if (0 == All.music_cycle) {
								All.music_cycle = 1;
								// 切换图标
								$(".type i")
										.html(
												_TU._T.magicbox_PlBTSongList.data.oneSong_icon);
							} else if (1 == All.music_cycle) {
								All.music_cycle = 2;
								// 切换图标
								$(".type i")
										.html(
												_TU._T.magicbox_PlBTSongList.data.random_icon);
							} else if (2 == All.music_cycle) {
								All.music_cycle = 0;
								// 切换图标
								$(".type i")
										.html(
												_TU._T.magicbox_PlBTSongList.data.cycle_icon);
							}
						},
						onMute : function(e) {
							if ("1" == All.vol_status) {
								All.vol_status = 0;// 取消静音
								// 切换图标
								$(".mute i")
										.html(
												_TU._T.magicbox_PlBTSongList.data.vol_icon);
							} else {
								All.vol_status = 1;// 设置静音
								// 切换图标
								$(".mute i")
										.html(
												_TU._T.magicbox_PlBTSongList.data.mute_icon);
							}
							this.setVolume();
						},
						// 播放音频
						playAudio : function(src) {
							for (var i = 0; i < $(".content-box .music_no").length; i++) {
								var tempNo = $(".content-box")
										.find(".music_no").eq(i).text();
								// 清空所有歌曲前面的图标
								$(".content-box").find(".iconc").eq(i)
										.find("i").css("visibility", "hidden");
								// 若列表的id跟正在播放的歌曲id一致，显示暂停图标
								if (All.music_no == tempNo) {
									$(".content-box")
											.find(".iconc")
											.eq(i)
											.find("i")
											.html(
													_TU._T.magicbox_PlBTSongList.data.pause_icon)
									$(".content-box").find(".iconc").eq(i)
											.find("i").css("visibility",
													"visible");
								}

							}

							var me = this;
							// 从目标文件创建Media对象
							if ("1" != All.media_status) {
								All.my_media = new Media(src, this.onSuccess,
										this.onError);
							}

							// 播放音频
							All.my_media.play();
							// 更新播放状态 0:播放；1：暂停；2：停止
							All.media_status = "0";
							this.setVolume();
							// 每秒更新一次媒体播放到的位置
							if (All.mediaTimer == null) {
								All.mediaTimer = setInterval(function() {
									// 获取媒体播放到的位置
									All.my_media.getCurrentPosition(
									// 获取成功后调用的回调函数
									function(position) {
										All.mediaPosition = position;
										if (position == -0.001) {
											me.toNextPlay();
										}
									},
									// 发生错误后调用的回调函数
									function(e) {
										console.log("Error getting pos=" + e);
									});
								}, 1000);
							}
							$(".doPlay i")
									.html(
											_TU._T.magicbox_PlBTSongList.data.pause_icon);
							this.progressBar();// 更新播放进度条
						},
						// 创建Media对象成功后调用的回调函数
						onSuccess : function() {
							console.log("playAudio():Audio Success");
						},
						// 创建Media对象出错后调用的回调函数
						onError : function(error) {
							new Piece.Toast("code: " + error.code + "\n"
									+ "message: " + error.message + "\n");
							return;
						},
						// 暂停音频播放
						pauseAudio : function() {
							if (All.my_media) {
								All.my_media.pause();
								// 更新播放状态 0:播放；1：暂停；2：停止;3:静音
								All.media_status = "1";
								// 清空所有歌曲前面的图标
								for (var i = 0; i < $(".content-box .music_no").length; i++) {
									var tempNo = $(".content-box").find(
											".music_no").eq(i).text();
									// 若列表的id跟正在播放的歌曲id一致，显示播放图标
									if (All.music_no == tempNo) {
										$(".content-box")
												.find(".iconc")
												.eq(i)
												.find("i")
												.html(
														_TU._T.magicbox_PlBTSongList.data.play_icon)
										$(".content-box").find(".iconc").eq(i)
												.find("i").css("visibility",
														"visible");
									} else {
										$(".content-box").find(".iconc").eq(i)
												.find("i").css("visibility",
														"hidden");
									}

								}
								$(".doPlay i")
										.html(
												_TU._T.magicbox_PlBTSongList.data.play_icon);
								this.progressBar();// 更新播放进度条
							}
						},
						// 停止音频播放
						stopAudio : function() {
							if (All.my_media) {
								All.my_media.stop();
								// 更新播放状态 0:播放；1：暂停；2：停止
								All.media_status = "2";
							}
							clearInterval(All.mediaTimer);
							All.mediaTimer = null;
							All.mediaPosition = 0;
							All.moveTotal = 0;
							All.played_time = 0;
						},
						// 从指定位置开始音频播放
						seekToAudio : function(mseconds) {
							var me = this;
							var src = Piece.Cache.get("PlBTSongList-Play-Src");// 获取正在播放的歌曲路径
							if (All.my_media) {
								if (null == src || "" == src) {
									new Piece.Toast(
											_TU._T.magicbox_PlBTSongList.data.noPlay_msg);
									return;
								}
								// 播放音频
								All.my_media.play();
								All.my_media.seekTo(mseconds);
								// 更新播放状态 0:播放；1：暂停；2：停止
								All.media_status = "0";
								this.setVolume();
								// 每秒更新一次媒体播放到的位置
								if (All.mediaTimer == null) {
									All.mediaTimer = setInterval(function() {
										// 获取媒体播放到的位置
										All.my_media.getCurrentPosition(
										// 获取成功后调用的回调函数
										function(position) {
											All.mediaPosition = position;
											if (position == -0.001) {
												//
												me.toNextPlay();
											}
										},
										// 发生错误后调用的回调函数
										function(e) {
											console.log("Error getting pos="
													+ e);
										});
									}, 1000);
								}
							}
						},
						// 根据循环类型切歌
						toNextPlay : function() {
							if (null == All.music_no || null == All.music_list
									|| 0 == All.music_list.length) {
								new Piece.Toast(
										_TU._T.magicbox_PlBTSongList.data.noPlay_msg);
								return;
							}
							// 若存在多首播放歌曲，关闭当前播放
							this.stopAudio();
							// 顺序播放则切到下一首
							if (0 == All.music_cycle) {
								var arr = All.music_list;
								All.media_status = "0";
								All.mediaTimer = null;
								All.mediaPosition = 0;
								All.moveTotal = 0;
								All.played_time = 0;
								clearTimeout(All.progressId);
								clearTimeout(All.timeoutId);

								// 已是最后一首则从头开始
								if ((arr.length - 1) == All.music_no) {
									All.music_no = 0;
									All.music_len = arr[0].length; // 设置歌曲总长度
									$(".len_all").text(All.music_len);// 设置进度条中音乐时长
									// 播放下一首
									this.playAudio(arr[0].url);
									Piece.Cache.put("PlBTSongList-Play-Src",
											arr[0].url);// 保存播放的歌曲路径
									Piece.Cache.put("PlBTSongList-Play-Title",
											arr[0].title);// 保存播放的歌曲名称
									Piece.Cache.put("PlBTSongList-Play-Mcid",
											arr[0].id);
								} else {
									All.mediaTimer = null;
									All.mediaPosition = 0;
									All.moveTotal = 0;
									All.played_time = 0;
									clearTimeout(All.progressId);
									clearTimeout(All.timeoutId);
									All.music_no = All.music_no + 1;
									All.music_len = arr[All.music_no].length; // 设置歌曲总长度
									$(".len_all").text(All.music_len);// 设置进度条中音乐时长
									// 播放下一首
									this.playAudio(arr[All.music_no].url);
									Piece.Cache.put("PlBTSongList-Play-Src",
											arr[All.music_no].url);// 保存播放的歌曲路径
									Piece.Cache.put("PlBTSongList-Play-Title",
											arr[All.music_no].title);// 保存播放的歌曲名称
									Piece.Cache.put("PlBTSongList-Play-Mcid",
											arr[All.music_no].id);
								}
							} else if (1 == All.music_cycle) {
								clearTimeout(All.progressId);
								clearTimeout(All.timeoutId);
								All.mediaTimer = null;
								All.mediaPosition = 0;
								All.moveTotal = 0;
								All.played_time = 0;
								// 单曲循环则重复该首
								All.media_status = "0";
								// 播放同一首
								this.playAudio(Piece.Cache
										.get("PlBTSongList-Play-Src"));
							} else if (2 == All.music_cycle) {
								// 随机循环则切到随机一首
								var arr = All.music_list;
								// 生成随机数
								var num = parseInt(Math.random() * arr.length,
										10);

								All.media_status = "0";
								All.mediaTimer = null;
								All.mediaPosition = 0;
								All.moveTotal = 0;
								All.played_time = 0;
								clearTimeout(All.progressId);
								clearTimeout(All.timeoutId);
								All.music_no = num;
								All.music_len = arr[num].length; // 设置歌曲总长度
								$(".len_all").text(All.music_len);// 设置进度条中音乐时长
								// 播放下一首
								this.playAudio(arr[num].url);
								Piece.Cache.put("PlBTSongList-Play-Src",
										arr[num].url);// 保存播放的歌曲路径
								Piece.Cache.put("PlBTSongList-Play-Title",
										arr[num].title);// 保存播放的歌曲名称
								Piece.Cache.put("PlBTSongList-Play-Mcid",
										arr[num].id);
							}
						},
						// 播放下一首
						nextPlay : function() {
							if (null == All.music_no || null == All.music_list
									|| 0 == All.music_list.length) {
								new Piece.Toast(
										_TU._T.magicbox_PlBTSongList.data.noPlay_msg);
								return;
							}
							// 切到下一首
							var arr = All.music_list;
							All.media_status = "0";
							All.mediaTimer = null;
							All.mediaPosition = 0;
							All.moveTotal = 0;
							All.played_time = 0;
							clearTimeout(All.progressId);
							clearTimeout(All.timeoutId);
							// 已是最后一首则提示
							if ((arr.length - 1) == All.music_no) {
								new Piece.Toast(
										_TU._T.magicbox_PlBTSongList.data.last_msg);
								return;
							} else {
								this.stopAudio();
								All.music_no = All.music_no + 1;
								All.music_len = arr[All.music_no].length; // 设置歌曲总长度
								$(".len_all").text(All.music_len);// 设置进度条中音乐时长
								// 播放下一首
								this.playAudio(arr[All.music_no].url);

								Piece.Cache.put("PlBTSongList-Play-Src",
										arr[All.music_no].url);// 保存播放的歌曲路径
								Piece.Cache.put("PlBTSongList-Play-Title",
										arr[All.music_no].title);// 保存播放的歌曲名称
								Piece.Cache.put("PlBTSongList-Play-Mcid",
										arr[All.music_no].id);
							}
						},
						// 播放上一首
						previousPlay : function() {
							if (null == All.music_no || null == All.music_list
									|| 0 == All.music_list.length) {
								new Piece.Toast(
										_TU._T.magicbox_PlBTSongList.data.noPlay_msg);
								return;
							}
							// 切到下一首
							var arr = All.music_list;
							All.media_status = "0";
							All.mediaTimer = null;
							All.mediaPosition = 0;
							All.moveTotal = 0;
							All.played_time = 0;
							clearTimeout(All.progressId);
							clearTimeout(All.timeoutId);
							// 已是第一首则提示
							if (0 == All.music_no) {
								new Piece.Toast(
										_TU._T.magicbox_PlBTSongList.data.first_msg);
								return;
							} else {
								this.stopAudio();
								All.music_no = All.music_no - 1;
								All.music_len = arr[All.music_no].length; // 设置歌曲总长度
								$(".len_all").text(All.music_len);// 设置进度条中音乐时长
								// 播放下一首
								this.playAudio(arr[All.music_no].url);
								Piece.Cache.put("PlBTSongList-Play-Src",
										arr[All.music_no].url);// 保存播放的歌曲路径
								Piece.Cache.put("PlBTSongList-Play-Title",
										arr[All.music_no].title);// 保存播放的歌曲名称
								Piece.Cache.put("PlBTSongList-Play-Mcid",
										arr[All.music_no].id);
							}
						},
						// 设置音量
						setVolume : function() {
							// 声音状态 0：正常；1：静音
							if ("1" == All.vol_status) {
								All.my_media.setVolume('0.0');
							} else {
								All.my_media.setVolume(All.media_vol);
							}
						},
						progressBar : function() {
							// 获取歌曲时长
							var len = All.music_len;
							var len_m = len.split(":")[0];
							var len_s = len.split(":")[1];
							var wid = $(".progress-bar").width();
							if ("0" == len_m) {
								var timeNum = Number(len_s);
							} else {
								var timeNum = Number(len_m) * 60
										+ Number(len_s);
							}
							var move = wid / timeNum;
							var me = this;

							me.progressBarMove(wid, move);// 进度条更新
							me.timedCount();// 播放时长更新
							// 停止
							if ("2" == All.media_status) {
								clearTimeout(All.progressId);
								clearTimeout(All.timeoutId);
								All.mediaTimer = null;
								All.mediaPosition = 0;
								All.moveTotal = 0;
								All.played_time = 0;
							}
						},
						progressBarMove : function(wid, move) {
							var me = this;
							// 暂停
							if (All.moveTotal < wid && "1" != All.media_status) {
								All.moveTotal = All.moveTotal + move;
								$(".pro-point").css("left",
										All.moveTotal + "px");
								$(".progress").css("width",
										All.moveTotal + "px");
								All.progressId = setTimeout(function() {
									me.progressBarMove(wid, move);
								}, 1000);
							}
							if (All.moveTotal == wid) {
								clearTimeout(All.progressId);
								All.media_status = "2";
								All.mediaTimer = null;
								All.mediaPosition = 0;
								All.moveTotal = 0;
								All.played_time = 0;
							}
						},
						timedCount : function() {
							var me = this;
							// 获取歌曲时长
							var len = All.music_len;
							var len_m = len.split(":")[0];
							var len_s = len.split(":")[1];
							var wid = $(".progress-bar").width();
							if ("0" == len_m) {
								var timeNum = Number(len_s);
							} else {
								var timeNum = Number(len_m) * 60
										+ Number(len_s);
							}
							if (All.played_time < 0) {
								All.played_time = 0;
							}
							var min = parseInt(All.played_time / 60);// 分钟数
							if (min >= 60) {
								min = min % 60
							}
							var lastsecs = All.played_time % 60;

							var value = min + ":" + lastsecs;
							$(".len_tmp").text(value);// 设置进度条中已播放音乐长度
							if (All.played_time < timeNum
									&& "1" != All.media_status) {
								All.played_time = All.played_time + 1;
								All.timeoutId = setTimeout(function() {
									me.timedCount();
								}, 1000);
							}
							if (All.played_time == timeNum) {
								clearTimeout(timeoutId);
								All.mediaTimer = null;
								All.mediaPosition = 0;
								All.moveTotal = 0;
								All.played_time = 0;
							}
						},
						isPull : function() {
							if (null == Piece.Cache
									.get("PlBTSongList-Play-Src")
									|| "" == Piece.Cache
											.get("PlBTSongList-Play-Src")) {
								return;
							}
							var me = this;
							var is_moving = false;
							var mx_start;// 元素原始水平坐标
							var move_end;// 水平坐标
							var position_start = All.mediaPosition;// 获取拖动前播放位置
							var move_start = All.moveTotal;// 获取拖动前进度条位置
							var time_start = All.played_time;// 获取拖动前进度条位置
							// 获取歌曲时长
							var len = All.music_len;
							var len_m = len.split(":")[0];
							var len_s = len.split(":")[1];
							var wid = $(".progress-bar").width();
							if ("0" == len_m) {
								var timeNum = Number(len_s);
							} else {
								var timeNum = Number(len_m) * 60
										+ Number(len_s);
							}
							var move = wid / timeNum;
							$(".pro-point")
									.on("touchstart", function(e) {
										position_start = All.mediaPosition;// 获取拖动前播放位置
										move_start = All.moveTotal;// 获取拖动前进度条位置
										time_start = All.played_time;// 获取拖动前进度条位置
										mx_start = e.changedTouches[0].pageX;// 获取原始拖动的水平坐标
										is_moving = true;
									})
									.on(
											"touchend",
											function(e) {
												is_moving = false;

												// 计算拖动后播放位置
												if (0 == position_start
														|| -1 == position_start) {
													position_start = 1;
												}
												if (0 == move_start) {
													move_start = 1;
												}
												All.mediaPosition = (position_start
														* move_end / move_start)
														.toFixed(2);
												if ("0" == All.media_status) {
													me
															.seekToAudio(All.mediaPosition * 1000);
												}
											})
									.on(
											"touchmove",
											function(e) {
												if (is_moving) {
													move_end = e.changedTouches[0].pageX
															- mx_start;// 实时获取拖动的水平坐标
													if (move_end < 0) {
														move_end = 0;
													}
													All.moveTotal = move_end;
													// 更新进度条位置
													$(".pro-point").css(
															"left",
															All.moveTotal
																	+ "px");
													$(".progress").css(
															"width",
															All.moveTotal
																	+ "px");
													// 更新播放及时器
													if (0 == time_start) {
														time_start = 1;
													}
													if (0 == move_start) {
														move_start = 1;
													}
													All.played_time = Math
															.round(time_start
																	* move_end
																	/ move_start);
												}
											});
						},
						// 初始化
						init : function(e) {
							window.MusicSearch
									.musicSearch(
											function(data) {
												All.music_list = eval(data);
												var arr = All.music_list;
												var list = "";
												for (var i = 0; i < arr.length; i++) {
													var list_type = "div-list2";
													var visibility_type = "hidden";
													var iconno = _TU._T.magicbox_PlBTSongList.data.pause_icon; // 暂停图标
													var src = Piece.Cache
															.get("PlBTSongList-Play-Src");// 获取正在播放的歌曲路径
													if (i % 2 == 0) {
														list_type = "div-list";
													}
													if (arr[i].url == src) {
														visibility_type = "visible";
														All.music_no = i;
														All.music_len = arr[i].length; // 设置歌曲总长度
													}
													if (All.media_status == "1") {
														iconno = _TU._T.magicbox_PlBTSongList.data.play_icon; // 播放图标
													}
													var str = "<div class='"
															+ list_type
															+ "'><div class='iconc' style='visibility:"
															+ visibility_type
															+ ";'><i class='icon iconfont i-color'>"
															+ iconno
															+ "</i></div>"
															+ "<div class='title'><span class='play'>"
															+ arr[i].title
															+ "</div>"
															+ "<div class='length'>"
															+ arr[i].length
															+ "</div>"
															+ "<div class='src' style='display: none;'>"
															+ arr[i].url
															+ "</div>"
															+ "<div class='music_id' style='display: none;'>"
															+ arr[i].id
															+ "</div>"
															+ "<div class='music_no' style='display: none;'>"
															+ i
															+ "</div></div>";
													list = list + str;
												}
												$(".content-box").append(list);
											},
											// 发生错误后调用的回调函数
											function(e) {
												console
														.log("Error getting pos="
																+ e);
											});

						},
						render : function() {
							$(this.el).html(viewTemplate);

							Piece.View.prototype.render.call(this);
							return this;
						},
						onLoadTemplate : function() {
							_TU._U.setHeader(_TU._T.magicbox_PlBTSongList);
							var me = this;
							// 页面布局共通化管理

							var plBTSongListTemplate = $(me.el).find(
									"#PlBTSongListTemplate").html();
							var plBTSongListHtml = _.template(
									plBTSongListTemplate,
									_TU._T.magicbox_PlBTSongList.data);
							$(".content").html(plBTSongListHtml);
							// 若歌曲处于选中状态，显示播放时长
							if (All.music_len != "") {
								$(".len_all").text(All.music_len);// 设置进度条中音乐时长
								var min = parseInt(All.played_time / 60);// 分钟数
								if (min >= 60) {
									min = min % 60
								}
								var lastsecs = All.played_time % 60;
								$(".len_tmp").text(min + ":" + lastsecs);// 设置进度条中已播放音乐长度
								// 设置播放进度条位置
								$(".pro-point").css("left",
										All.moveTotal + "px");
								$(".progress").css("width",
										All.moveTotal + "px");
							}
							// 显示播放状态
							if (All.media_status == "0") {
								$(".doPlay i")
										.html(
												_TU._T.magicbox_PlBTSongList.data.pause_icon); // 暂停图标
							} else if (All.media_status == "1") {
								$(".doPlay i")
										.html(
												_TU._T.magicbox_PlBTSongList.data.play_icon); // 播放图标
							}

							// 显示播放模式
							if (0 == All.music_cycle) {
								$(".type i")
										.html(
												_TU._T.magicbox_PlBTSongList.data.cycle_icon);
							} else if (1 == All.music_cycle) {
								$(".type i")
										.html(
												_TU._T.magicbox_PlBTSongList.data.oneSong_icon);
							} else if (2 == All.music_cycle) {
								$(".type i")
										.html(
												_TU._T.magicbox_PlBTSongList.data.random_icon);
							}

							// 显示是否静音
							if ("1" == All.vol_status) {
								$(".mute i")
										.html(
												_TU._T.magicbox_PlBTSongList.data.mute_icon);
							} else {
								$(".mute i")
										.html(
												_TU._T.magicbox_PlBTSongList.data.vol_icon);
							}
						},
						onShow : function() {
							this.onLoadTemplate();// 加载配置模板
							// write your business logic here :)
							this.isPull(); // 拖动音乐进度条
							this.init();// 初始化

						}
					}); // view define

		});