define([ 'text!magicbox/InConfBackup.html', "zepto", "../base/openapi",
		'../base/util', '../base/socketutil', "../base/templates/template","../base/i18nMain"],
		function(viewTemplate, $, OpenAPI, Util, SocketUtil, _TU,I18n) {
			var loader=null;
			var outTimer=null;
			var leftWiper=function(str,length){
				str=""+str;
					while(str.length<length){
						str="0"+str;
					}
					return str;
		    };
			var getNowTimeString=function(){
				var time = new Date();
					var year=time.getFullYear();
					var month=leftWiper(time.getMonth()+1,2);
					var day=leftWiper(time.getDate(),2);
					var hour=leftWiper(time.getHours(),2);
					var min=leftWiper(time.getMinutes(),2);
					var sec=leftWiper(time.getSeconds(),2);
					var stime=year+month+day+" "+hour+":"+min+":"+sec;
					return stime;
			};
			
			
			return Piece.View.extend({
				id : 'magicbox_InConfBackup',
				events : {
				},
				render : function() {
					$(this.el).html(viewTemplate);

					Piece.View.prototype.render.call(this);
					return this;
				},
				onLoadTemplate : function() {
					_TU._U.setHeader(_TU._T.magicbox_InConfBackup);
					var me = this;
					// 页面布局共通化管理
					var inConfBackupTemplate = $(me.el).find(
							"#InConfBackupTemplate").html();
					var inConfBackupHtml = _.template(inConfBackupTemplate,
							_TU._T.magicbox_InConfBackup.data);
					$("#content").append(inConfBackupHtml);
				},
				onShow : function() {
					this.onLoadTemplate();// 加载配置模板
					Piece.Cache.put("serial","0000");
					$(".nav-wrap-right").bind(
							"tap",
							function() {
								// 保存配置
					            var stime=getNowTimeString();
								
								socketRspnCallBack.func0044=function(obj){//定义回调函数
				                    window.clearTimeout(outTimer);
									loader.hideAll();
				                    Piece.Toast(I18n.magicbox_InConfBackup.saveConfigSucess);
									
									// 保存到本地存储
									var MBConfig = Piece.Store.loadObject(
											"MBConfig", true);
									if (MBConfig == null)
										MBConfig = new Array();
									MBConfig[MBConfig.length] = {
										"time" :stime,
										"isload" : false
									};
									Piece.Store.saveObject("MBConfig",
											MBConfig, true);
									Backbone.history.navigate(
											"magicbox/InAboutMB", {
												trigger : true
											});// 跳转
			                        }
									
									SocketUtil.MBConfBackup(stime);
									loader=new Piece.Loader({autoshow:true,target:'.content'});
									outTimer=window.setTimeout(function(){
										  loader.hideAll();
					                      Piece.Toast(I18n.magicbox_InConfBackup.saveConfigTimeOut);
				                    },1000*10);
									
							});
				}
			}); // view define

		});