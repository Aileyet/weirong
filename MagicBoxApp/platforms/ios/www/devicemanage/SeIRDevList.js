define(['text!devicemanage/SeIRDevList.html',"../base/schema","../base/templates/template","../base/i18nMain","../base/constant",'../base/socketutil',],
	function(viewTemplate,Schema,_TU,I18n,Cons,SocketUtil) {
		var outTimer=null;
		var gatewayId;
		var loader=null;
		return Piece.View.extend({
			id: 'devicemanage_IRDevList',
			render: function() {
				$(this.el).html(viewTemplate);

				Piece.View.prototype.render.call(this);
				return this;
			},
			onLoadTemplate:function(){
				_TU._U.setHeader(_TU._T.ir_dev_list);
				var userInfoTemplate = $(this.el).find("#custominf_inf").html();
				
				gatewayId=Piece.Cache.get("gatewayId");	
				if(gatewayId==null||gatewayId=="")
				{
					 new Piece.Toast(I18n.Common.noMagicBoxError);
					 return;
				}
				loader=new Piece.Loader({autoshow:false,//是否初始化时就弹出加载控件
										 target:'.content'//页面目标组件表识
										 });
			    loader.show();
			    
				//发命令查找红外模块支持的设备类型
				var model=new SocketUtil.sendModel();
				model.gatewayId=gatewayId;
				model.moduleId=Cons.MODULE_SYS;
				model.moduleIndex="0000";
				model.actionId=Cons.MODULE_SYS;
				model.actionIndex="0000";
				model.cmdType=Cons.Socket_Comd;
				model.cmdCatalog=Cons.Comd_Get;
				model.queryString={"device":""};
				model.callbackFun=function(sendObj,backObj){
					for(var arr in backObj){
						if(arr.indexOf(Cons.MODULE_IRRC)>-1){
							if(backObj[arr].indexOf('normal')>-1){
										var model=new SocketUtil.sendModel();
										model.gatewayId=gatewayId;
										model.moduleId=Cons.MODULE_IRRC;
										model.moduleIndex="0000";
										model.actionId=Cons.MODULE_IRRC;
										model.actionIndex="0000";
										model.cmdType=Cons.Socket_Comd;
										model.cmdCatalog=Cons.Comd_Get;
										model.queryString={"device":""};
										model.callbackFun=function(sendObj,obj){
											//处理红外设备
											for(var arr in obj){
												if(obj[arr].indexOf('unset')>-1){
													var device=arr.substr(0,4);
													for(var i=0;i<_TU._T.ir_dev_list.data.menus.length;i++){
														if(_TU._T.ir_dev_list.data.menus[i].isShow&&_TU._T.ir_dev_list.data.menus[i].type==device)
														{
															var userInfoHtml = _.template(userInfoTemplate, _TU._T.ir_dev_list.data.menus[i]);
															$(".my-E-home-box").append(userInfoHtml);
															break;
														}
													}
												}
											}
											//追加自定义设备
											for(var i=0;i<_TU._T.ir_dev_list.data.menus.length;i++){
													if(_TU._T.ir_dev_list.data.menus[i].isShow&&_TU._T.ir_dev_list.data.menus[i].type=="Custom")
													{
														var userInfoHtml = _.template(userInfoTemplate, _TU._T.ir_dev_list.data.menus[i]);
														$(".my-E-home-box").append(userInfoHtml);
														break;
													}
											}
											loader.hideAll();
											window.clearTimeout(outTimer);
										}
									   SocketUtil.sendMessage(model);
							}else{
								//没有该模块则添加该模块
								var model=new SocketUtil.sendModel();
								model.gatewayId=gatewayId;
								model.moduleId=Cons.MODULE_SYS;
								model.moduleIndex="0000";
								model.actionId=Cons.MODULE_SYS;
								model.actionIndex="0000";
								model.cmdType=Cons.Socket_Comd;
								model.cmdCatalog=Cons.Comd_Add;
								model.queryString={"module":arr.substr(0,4),"serial":arr.substr(4,4)};
								model.callbackFun=function(sendObj,backObj){
									    var model=new SocketUtil.sendModel();
										model.gatewayId=gatewayId;
										model.moduleId=Cons.MODULE_IRRC;
										model.moduleIndex="0000";
										model.actionId=Cons.MODULE_IRRC;
										model.actionIndex="0000";
										model.cmdType=Cons.Socket_Comd;
										model.cmdCatalog=Cons.Comd_Get;
										model.queryString={"device":""};
										model.callbackFun=function(sendObj,obj){
											//处理红外设备
											for(var arr in obj){
												if(obj[arr].indexOf('unset')>-1){
													var device=arr.substr(0,4);
													for(var i=0;i<_TU._T.ir_dev_list.data.menus.length;i++){
														if(_TU._T.ir_dev_list.data.menus[i].isShow&&_TU._T.ir_dev_list.data.menus[i].type==device)
														{
															var userInfoHtml = _.template(userInfoTemplate, _TU._T.ir_dev_list.data.menus[i]);
															$(".my-E-home-box").append(userInfoHtml);
															break;
														}
													}
												}
											}
										    //追加自定义设备
											for (var i = 0; i < _TU._T.ir_dev_list.data.menus.length; i++) {
											    if (_TU._T.ir_dev_list.data.menus[i].isShow && _TU._T.ir_dev_list.data.menus[i].type == "Custom") {
											        var userInfoHtml = _.template(userInfoTemplate, _TU._T.ir_dev_list.data.menus[i]);
											        $(".my-E-home-box").append(userInfoHtml);
											        break;
											    }
											}
											loader.hideAll();
											window.clearTimeout(outTimer);
										}
									   SocketUtil.sendMessage(model);
								}
								SocketUtil.sendMessage(model);
							}
							break;
						}
					}
				}
				SocketUtil.sendMessage(model);
				outTimer=window.setTimeout(function(){new Piece.Toast(I18n.Common.timeOut);loader.hideAll();return;},10000);
			},
			onShow: function() {
					this.onLoadTemplate();//加载配置模板
			},
			events: {
				'touchstart .equip': 'SeBrandChoice'
			},
			SeBrandChoice:function(obj)
			{    
			     var type=obj.currentTarget.getAttribute("type");
				 if(type=="Custom"){
					 Backbone.history.navigate('devicemanage/SeCustom', {trigger: true});
				 }else{
					 				 
				   for(var i=0;i<Schema.DeviceCatg.length;i++){
				 		if(Schema.DeviceCatg[i].type==type){
							Piece.Cache.put("deviceIndex",i);
							Piece.Cache.put("deviceName",Schema.DeviceCatg[i].name);
				            Piece.Cache.put("deviceType",Schema.DeviceCatg[i].type);
							break;
						}
					}
				    Backbone.history.navigate('devicemanage/SeBrandChoice', {trigger: true});
				 }

			},
		}); //view define

	});