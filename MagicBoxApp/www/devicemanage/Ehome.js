define(['text!devicemanage/Ehome.html', "zepto", "../base/openapi", '../base/util','../base/login/login',"../base/templates/template",'../base/socketutil','../base/i18nMain',"../base/constant",],
	function(viewTemplate, $, OpenAPI, Util,Login,_TU,SocketUtil,I18n,Cons) {
        var equipList =new Array();
		var magicList=new Array();
		//var deleteTime=1000;//长按触发时间
		var login = new Login();
		var tdate=null;
		var editFun;
		var detailFun;
		var fillHtmlFun;
		var fillHtmlFun2;
		var deleteFun;
		var editStorageFun;
		var access_token="";
		var LoginDialog;
		//新参数
		var sendJishu=0;
		var sendTimer=null;
		var sendGatewayIndex=0;
		var allJishu=0;
		var sendLoader=null;
		
		return Piece.View.extend({
			id: 'devicemanage_DeviceList',
			render: function() {
				$(this.el).html(viewTemplate);
				Piece.View.prototype.render.call(this);
				return this;
			},
			events: {
				//'touchstart .equip': 'edit',
				'touchstart #study': 'add'
			},
			onLoadTemplate:function(){
				_TU._U.setHeader(_TU._T.devicemanage_Ehome);
			},
            onShow: function () {
				//清空学习状态
				Piece.Cache.put("study",0);
				
				if(sendTimer!=null)window.clearInterval(sendTimer);
				
				this.onLoadTemplate();//加载配置模板
				
				_TU._U.goBack(function(){
					var page=Util.getQueryStringByName("prePage");
					if(page!=""){
				        Backbone.history.navigate(page, {trigger: true});
						}
					else{
						Backbone.history.navigate('home/MeIndex', {trigger: true});
					}
				});
				
				//定义函数
				 editFun=this.edit;
				 detailFun=this.detail;
				 fillHtmlFun=this.fillHtml;
				 fillHtmlFun2=this.fillHtml2;
				 deleteFun=this.deleteStorage;
				 editStorageFun=this.editStorage;
				 setDialogCssFun=this.setDialogCss;
				 
				 LoginDialog  =  new  Piece.Dialog({ 
					    autoshow:  false, 
					    target:  'body', 
					    title:  I18n.Common.tip, 
					    content:  I18n.Common.needlogin 
					},  { 
					    configs:  [{ 
					        title: I18n.Common.cancel, 
					        eventName:  'cancel' ,
					    },{ 
					        title:  I18n.Common.ok,
					        eventName:'ok' ,
					    },
					], 
					cancel:function()  { 
					             LoginDialog.hide(); 
								 Backbone.history.navigate('home/MeIndex', {trigger: true});
					        },
					ok:function()  { 
					             login.show();
								 setDialogCssFun();
					        }
					});
					
		       	 var checkLogin = Util.checkLogin()
				 if(checkLogin === false || Piece.TempStage.loginId() == null){
					 LoginDialog.show();
					 // login.show();
					 // new Piece.Toast('请先登录');
					 return;
			      }
				 
            	$('#equipList').val('');
				//从服务器取数据
				var user_token=Piece.Store.loadObject("user_token", true);
				access_token=user_token.accessToken;
				equipList=Piece.Store.loadObject("DeviceList", true);
				if(equipList==null)equipList=new Array();
				for(var i=0;i<equipList.length;i++){
					if(equipList[i].device!="SW00"&&equipList[i].device!="SS00"&&equipList[i].device!="SLB0"){
						equipList.splice(i,1);
					}
				}
				Piece.Store.saveObject("DeviceList", equipList, true);
				
				
				//调用异步方法获取数据
				var loginId=Piece.Store.loadObject("loginId", true);
				var user_info=Piece.Store.loadObject("user_info", true);
				Util.AjaxWait(OpenAPI.readAllMagicBox,
					"GET", 
					{access_token:access_token,userLoginId:loginId,dataType: 'jsonp'}, 
					'jsonp',
					function(data, textStatus, jqXHR){
						magicList=new Array();
						if (data.gatewaylist!=null&&data.gatewaylist.length>0) {
							//添加魔方到本地
							for(var i=0;i<data.gatewaylist.length;i++){
								var serialt=(data.gatewaylist[i].serial==""||data.gatewaylist[i].serial==null||data.gatewaylist[i].serial==undefined)?data.gatewaylist[i].gatewayId:data.gatewaylist[i].serial;
								var item={"serial":serialt,"name":data.gatewaylist[i].gatewayName,"device":'MagicBox',"gatewayId":data.gatewaylist[i].gatewayId};
								magicList[magicList.length]=item;
								equipList[equipList.length]=item;
								fillHtmlFun(item);
							}
							Piece.Store.saveObject("magicList", magicList, true);
							//从魔方获取添加的设备
							if(magicList==undefined||magicList.length==0)return;
							sendGatewayIndex=0;//发送查询的魔方序列号
							sendJishu=0;//发送计数
							allJishu=0;//超时计数
							//显示load
							sendLoader=new Piece.Loader({autoshow:true,//是否初始化时就弹出加载控件
                                             target:'.content'//页面目标组件表识
							});
							
							//定时器
							sendTimer=window.setInterval(function(){
								var gatewayId=magicList[sendGatewayIndex].serial;//魔方序列号
								if(allJishu>=10){//5秒超时
								    allJishu=0;
									new Piece.Toast(I18n.Common.getUserMagicboxDeviceTimeOut);
									if(magicList.length==(sendGatewayIndex+1)){//魔方都处理完毕，则停止计时器
									    sendLoader.hideAll();
										if(sendTimer!=null)window.clearInterval(sendTimer);
										return;
									}else{//定位到下一个魔方
										sendJishu=0;
										sendGatewayIndex=sendGatewayIndex+1;
										return;
									}
								}
								allJishu+=1;
								if(sendJishu>=1&&sendJishu<3){//发送过程中
									return;
								}
								else if(sendJishu>=3){//接收完成
									if(magicList.length==(sendGatewayIndex+1)){
										sendLoader.hideAll();
										if(sendTimer!=null)window.clearInterval(sendTimer);
										return;
									}else{
										sendJishu=0;
										sendGatewayIndex=sendGatewayIndex+1;
										return;
									}
								}
								sendJishu+=1;

								
								socketRspnCallBack.func0781=function(obj){
						            for(var arr in obj){
							            if(arr.indexOf("IRRC")>-1){//红外模块
								            if(obj[arr].indexOf('normal')>-1){
								                var moduleN=arr.substr(0,4);
								                var moduleS=arr.substr(4,4);
												
												var model=new SocketUtil.sendModel();
												model.gatewayId=gatewayId;
			        							model.identify="0782";
			        							model.moduleId=moduleN;
			        							model.moduleIndex=moduleS;
												model.actionId=moduleN;
			        							model.actionIndex=moduleS;
			        							model.cmdType=Cons.Socket_Comd;
			        							model.cmdCatalog=Cons.Comd_Get;
			        							model.queryString={"device":""};
			        							SocketUtil.sendMessage(model);
								            }
							            }
										else if(arr.indexOf("ZB00")>-1){//zigbee模块
										    if(obj[arr].indexOf('normal')>-1){
								                var moduleN=arr.substr(0,4);
								                var moduleS=arr.substr(4,4);
												var model=new SocketUtil.sendModel();
												model.gatewayId=gatewayId;
			        							model.identify="0783";
			        							model.moduleId=moduleN;
			        							model.moduleIndex=moduleS;
												model.actionId=moduleN;
			        							model.actionIndex=moduleS;
			        							model.cmdType=Cons.Socket_Comd;
			        							model.cmdCatalog=Cons.Comd_Get;
			        							model.queryString={"device":""};
			        							SocketUtil.sendMessage(model);
								            }
										}
						            }
					            };
								socketRspnCallBack.func0782=function(obj){//保存红外设备
									for(var arr in obj){
									    if(arr.indexOf("TV00")>-1||arr.indexOf("FAN0")>-1||arr.indexOf("IPTV")>-1||arr.indexOf("PRJ0")>-1
										||arr.indexOf("STB0")>-1||arr.indexOf("DVD0")>-1||arr.indexOf("AC00")>-1){
										    if(obj[arr].indexOf('normal')>-1){
										        var moduleN=arr.substr(0,4);
								                var moduleS=arr.substr(4,4);
												var name=obj[arr].split('#')[1];
												var item={"serial":moduleS,"name":name,"device":moduleN,"gatewayId":gatewayId,"deviceId":moduleS};
												var ishave=false;
												for(var i=0;i<equipList.length;i++){
													if(equipList[i].serial==item.serial
													&&equipList[i].device==item.device
													&&equipList[i].gatewayId==item.gatewayId){
														ishave=true;
														break;
													}
												}
												if(ishave==false){
												    equipList[equipList.length]=item;
												    fillHtmlFun(item);
											    }
											}
										}
									}
									Piece.Store.saveObject("DeviceList", equipList, true);
									sendJishu+=1;
								};
								socketRspnCallBack.func0783=function(obj){//保存zigbee设备
									for(var arr in obj){
									    if(arr.indexOf("SW00")>-1||arr.indexOf("SS00")>-1||arr.indexOf("SLB0")>-1){
										    if(obj[arr].indexOf('normal')>-1){
										        var moduleN=arr.substr(0,4);
								                var moduleS=arr.substr(4,4);
												var name=obj[arr].split('#')[1];
												var item={"serial":moduleS,"name":name,"device":moduleN,"gatewayId":gatewayId,"deviceId":moduleS};
												var ishave=false;
												for(var i=0;i<equipList.length;i++){
													if(equipList[i].serial==item.serial
													&&equipList[i].device==item.device
													&&equipList[i].gatewayId==item.gatewayId){
														ishave=true;
														break;
													}
												}
												if(ishave==false){
												    equipList[equipList.length]=item;
												    fillHtmlFun(item);
												}
											}
										}
									}
									Piece.Store.saveObject("DeviceList", equipList, true);
									sendJishu+=1;
								};
								var model=new SocketUtil.sendModel();
								model.gatewayId=gatewayId;
			        			model.identify="0781";
			        			model.moduleId=Cons.MODULE_SYS;
			        			model.moduleIndex="0000";
								model.actionId=Cons.MODULE_SYS;
			        			model.actionIndex="0000";
			        			model.cmdType=Cons.Socket_Comd;
			        			model.cmdCatalog=Cons.Comd_Get;
			        			model.queryString={"device":""};
			        			SocketUtil.sendMessage(model);
							},500);
					    }
					},function(e, xhr, type) {new Piece.Toast(I18n.Common.getUserMagicboxError);}
				);
				
				for(var i=0;i<equipList.length;i++){//zigbee设备额外显示
					if(equipList[i].device=="SS00"||equipList[i].device=="SW00"||equipList[i].device=="SLB0"){
						if(equipList[i].check==false){//显示
							fillHtmlFun2(equipList[i]);
						}
					}
				}
			},
			add:function(){
			  Backbone.history.navigate('devicemanage/SeAddDev', {trigger: true});
			},
			//长按弹出操作框
			edit:function(obj){
				//setTimeout(function () {
				
				 var dataSerial=$(obj).find(".equip").attr("data-serial");
				 var dataDevice=$(obj).find(".equip").attr("data-device");
				 var dataGatewayId=$(obj).find(".equip").attr("data-gatewayId");
				
				 var dialog  =  new  Piece.Dialog({ 
					    autoshow:  false, 
					    target:  'body', 
					    title:  I18n.Common.operate, 
					    content:  '' 
					},  { 
					    configs:  [
					    { 
					        title:  I18n.Common.delete, 
					        eventName:  'del' ,
					    },{ 
					        title:  I18n.Common.edit, 
					        eventName:  'edit' ,
					    }
					], 
					  edit:  function()  { 
					             dialog.hide(); 
					             EditDialog.show();
                                 setDialogCssFun();					
					        },
					  del:  function(){
								if(!Util.IsNullOrEmpty(dataSerial))
								{
									for(var i=0;i<equipList.length;i++)
									{
										if(equipList[i].serial==dataSerial&&equipList[i].device==dataDevice&&equipList[i].gatewayId==dataGatewayId)
										{
											//deleteFun(equipList[i],i);
											
											//调用api保存数据到服务器,待完成
								             if(equipList[i].device=="MagicBox")//魔方删除
											 {
												 	Util.AjaxWait(OpenAPI.delGateway,
													"GET", 
													{
													access_token:access_token,
													gatewayId:equipList[i].gatewayId,
													dataType: 'jsonp'
													}, 
													'jsonp',
												   function(data, textStatus, jqXHR){ 
													   if (data.result=="success") {
																deleteFun(equipList[i],i);
													            new Piece.Toast(I18n.Common.deleteSucess);
															 }
															 else
															 {
																new Piece.Toast(I18n.Common.deleteError+data.error);
															 }
													},
													function(e, xhr, type) {
														new Piece.Toast(I18n.Common.deleteError);
												  	 }
											       );
											 }
											 else{
													SocketUtil.DeleteDevice(equipList[i].deviceId,equipList[i].device,equipList[i].gatewayId,equipList[i].serial);
													deleteFun(equipList[i],i);
											 }
											 break;
										}
									}
								}
								
					        },
					
					});
					var  EditDialog  =  new  Piece.Dialog({ 
						    autoshow:  false, 
						    target:  '.content', 
						    title:  I18n.Common.editDeviceName, 
						    content:  '<input type="text" id="equipName" style="width:170px"></input>' 
						},  { 
						    configs:  [
						    { 
						        title:  I18n.Common.cancel, 
						        eventName:  'can' ,
						
						    },{ 
						        title:  I18n.Common.save, 
						        eventName:  'save' ,
						    }], 
						  save:  function()  { 
									var name=$("#equipName").val();
									for(var i=0;i<equipList.length;i++)
									{
										if(equipList[i].serial==dataSerial&&equipList[i].device==dataDevice&&equipList[i].gatewayId==dataGatewayId)
										{
											 equipList[i].name=name;
											 //调用api保存数据到服务器,待完成
								             if(equipList[i].device=="MagicBox")//魔方修改
											 {
												 	Util.AjaxWait(OpenAPI.changGatewayName,
													"GET", 
													{
													access_token:access_token,
													gatewayId:equipList[i].gatewayId,
													gatewayName:name,
													dataType: 'jsonp'
													}, 
													'jsonp',
												   function(data, textStatus, jqXHR){ 
													   if (data.result=="success") {
																editStorageFun(equipList[i],i);
													            new Piece.Toast(I18n.Common.editSucess);
															 }
															 else
															 {
																new Piece.Toast(I18n.Common.editError+data.error);
															 }
													},
													function(e, xhr, type) {
														new Piece.Toast(I18n.Common.getUserDeviceError);
												  	 }
											       );
											 }
											 else{
													 SocketUtil.EditDevice(name,equipList[i].device,equipList[i].gatewayId,equipList[i].serial);
													 editStorageFun(equipList[i],i);
											 }
											 break;
										}
									}
						        },
						  can:  function()  { 
						            EditDialog.hide(); 
						        },
						}); 
					//防止重复打开
					if($('#cube-dialog-wrapper').length<=0){dialog.show();setDialogCssFun();}
            //}, deleteTime)
			},
			editStorage:function(equip,index){
				equipList[index].name=equip.name;
				Piece.Store.saveObject("DeviceList", equipList, true);
				$(".equip").each(function(){
						 if($(this).attr("data-serial")==equip.serial
						   &&$(this).attr("data-device")==equip.device
						   &&$(this).attr("data-gatewayId")==equip.gatewayId)
						   {
						     $(this).parent().parent().remove();
					       }
				 })
				//显示
				fillHtmlFun(equip);
				//如果操作魔方数据，更新魔方的缓存
				if(equip.device=="MagicBox")
				{
					 var  magicList= Piece.Store.loadObject("magicList", true);
					 for(var i=0;i<magicList.length;i++)
					 {
						if(magicList[i].serial==equip.serial)
						{
								magicList[i].name=name;
								Piece.Store.saveObject("magicList", magicList, true);//添加到本地
								break;
					    }
					} 
				}
			},
			setDialogCss:function(){
				$(".btn").first().css("background-color",_TU._T.dialog_Style.cancelColor);
				$(".ui-header").css("background-color",_TU._T.dialog_Style.backColor);
				$(".btn").last().css("background-color",_TU._T.dialog_Style.backColor);
			},
			deleteStorage:function(equip,index)
			{
				//如果操作魔方数据，更新魔方的缓存
					  if(equip.device=="MagicBox")
				  	  {
						var  magicList= Piece.Store.loadObject("magicList", true);
						for(var i=0;i<magicList.length;i++)
							{
								if(magicList[i].serial==equip.serial)
								{
									magicList.splice(i,1);
									Piece.Store.saveObject("magicList", magicList, true);//添加到本地
									break;
								}
							} 
					  }
				//删除魔方数据
				 equipList.splice(index,1);
				 Piece.Store.saveObject("DeviceList", equipList, true);//添加到本地
				 $(".equip").each(function(){
						 if($(this).attr("data-serial")==equip.serial
						   &&$(this).attr("data-device")==equip.device
						   &&$(this).attr("data-gatewayId")==equip.gatewayId)
						   {
						     $(this).parent().parent().remove();
					       }
				 })
				// $("#"+equip.serial).parent().parent().remove();											
			},
			//跳转到对应设备控制面板
			detail:function(obj){
				   var device=$(obj).find(".equip").attr("data-device");
				   var serial=$(obj).find(".equip").attr("data-serial");
				   var gatewayId=$(obj).find(".equip").attr("data-gatewayId");

				for(var i=0;i<equipList.length;i++)
					{
						if(equipList[i].serial==serial
						&&equipList[i].device==device
						&&equipList[i].gatewayId==gatewayId)
							{
								if(equipList[i].check==false){
								   Piece.Toast(I18n.Common.zigbeeIsLoading);
								}
								else if(equipList[i].device=="MagicBox")
								{
									Piece.Cache.put("gatewayId",equipList[i].gatewayId);
									Piece.Cache.put("serial",equipList[i].serial);
									Backbone.history.navigate("magicbox/StMBMain", {trigger: true});
								}
								else
								{
									Piece.Cache.put("gatewayId",equipList[i].gatewayId);
									Piece.Cache.put("serial",equipList[i].serial);
									var device=Util.getDevice(equipList[i].device);
									Backbone.history.navigate(device.url, {trigger: true});
								}
								
							}
					}
			},
			fillHtml:function(obj){
				var device=Util.getDevice(obj.device);
				$("<div>").html('<div class="my-E-home-cell"><div class="inner-border"><a class="equip" data-serial="'+obj.serial+'" data-device="'+obj.device+'" data-gatewayId="'+obj.gatewayId+'"><i class="icon iconfont" style="font-size: 32px;">'+device.img+'</i></span><span class="my-E-home-name">'+ obj.name+'</span></a></div></div>').bind("touchstart",function(){tdate=new Date();}).bind("touchend",function(){var tsec=new Date()-tdate; if(tsec>1000){editFun($(this))}else{detailFun($(this))};;}).appendTo("#equipList");
			},	
            fillHtml2:function(obj){
				var device=Util.getDevice(obj.device);
				$("<div>").html('<div class="my-E-home-cell"><div class="inner-border"><a class="equip" data-serial="'+obj.serial+'" data-device="'+obj.device+'" data-gatewayId="'+obj.gatewayId+'"><i class="icon iconfont" style="font-size: 32px;color:#d0d0d0;">'+device.img+'</i></span><span class="my-E-home-name" style="color:#d0d0d0;">'+ obj.name+'</span></a></div></div>').bind("touchstart",function(){tdate=new Date();}).bind("touchend",function(){var tsec=new Date()-tdate; if(tsec>1000){editFun($(this))}else{detailFun($(this))};;}).appendTo("#equipList");
			},				
		});
	});

Array.prototype.remove=function(dx) 
{ 
    if(isNaN(dx)||dx>this.length){return false;} 
    for(var m=0,n=0;m<this.length;m++) 
    { 
        if(this[m]!=this[dx]) 
        { 
            this[n++]=this[m] 
        } 
    } 
	if(this.length>=1)
    this.length-=1 
    return true;
}