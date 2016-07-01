define(['text!devicemanage/SeAutoMatch.html',"zepto", "../base/openapi", '../base/util','../base/socketutil',"../base/templates/template","../base/i18nMain","../base/schema","../base/constant",'devicemanage/SeDevReName'],
	function(viewTemplate,$, OpenAPI, Util,SocketUtil,_TU,I18n,Schema,Cons,SeDevReName) {
     
	 var keys=[
		{"name":"电源","key":"POWER_KEY","img":"&#xe62e;"},
		{"name":"音量","key":"VOL_UP_KEY","img":"&#xe61e;"},
		{"name":"开仓","key":"OPEN_KEY","img":"&#xe648;"},
		{"name":"关","key":"OFF_KEY","img":"&#xe636;"},
		{"name":"开","key":"ON_KEY","img":"&#xe62e;"},
		{"name":"模式","key":"MODE_KEY","img":"&#xe675;"},
		{"name":"速度","key":"POWER_SPEED_KEY","img":"&#xe66e;"}
		];
		
		var scanData=null;
		var scanIndex=-1;
		var columName=null;
		var autoTime=Cons.AutoMatchTime;
		var autoState=0;//0:自动扫描状态,1:确认状态
		var autoTimer=null;
		
		var guid=Util.GenerateGuid();
        var devType='';
        var brandId=0;
        var brandName="";
        var autoSearchId=0;
		var baseCodeIndex=0;
        var gatewayId="";
		
		
		var findKey=function(key){
			for(var i=0;i<keys.length;i++){
				if(keys[i].key==key)return keys[i];
			}
			return "";
		}
		
		
		var sendSearch=function(moduleId,moduleIndex){
			var model=new SocketUtil.sendModel();
			model.gatewayId=gatewayId;
			model.moduleId=moduleId;
			model.moduleIndex=moduleIndex;
			model.actionId=moduleId;
			model.actionIndex=moduleIndex;
			model.cmdType="Comd";
			model.cmdCatalog="Set ";
			for(var j=0;j<scanData.columnNames.length;j++){
			    model.queryString={"method":"transport","deviceTypeId":devType,"brandId":brandId,"autoSearchIndex":autoSearchId,"columName":scanData.columnNames[j]};
			    SocketUtil.sendMessage(model);
			}
		}
		
		
        var addScanEvent=function(){//设置扫描按键事件
		
			autoSearchId= scanData.items[scanIndex].autoSearchId;
			baseCodeIndex= scanData.items[scanIndex].baseCodeIndex;

			
			//设置测试按钮事件
			if(scanData.columnNames.length>1){
				if(autoState==0){
				    columName=scanData.columnNames[0];
				}else{
					columName=scanData.columnNames[1];
				}
				
				$("#key").html("");
				for (var j = 0; j < scanData.columnNames.length; j++) {
				    var columName = scanData.columnNames[j];
					var btn=$("<div>");
					btn.attr("columName",columName);
					btn.html("<div><div class='btn-div'><i class='icon iconfont'>"+findKey(columName).img+"</i></div><div class='txt-div'>"+findKey(columName).name+"</div></div>");
					btn.unbind();
					btn.bind("tap",function(){
					//发送命令
					var model=new SocketUtil.sendModel();
			        model.gatewayId=gatewayId;
			        model.moduleId="IRRC";
			        model.moduleIndex="0000";
			        model.cmdType="Comd";
			        model.cmdCatalog="Set ";
			        model.queryString={"method":"transport","deviceTypeId":devType,
					"brandId":brandId,"autoSearchIndex":autoSearchId,"columName":$(this).attr("columName")};
			        SocketUtil.sendMessage(model);
					});
                    //电风扇不显示风速按钮
					if (devType == "Fan" && columName == "POWER_SPEED_KEY") {
					    continue;
					}
					$("#key").append(btn);
				}
				
			}else{
				columName=scanData.columnNames[0];
				$("#key").html("<div><div class='btn-div'><i class='icon iconfont'>"+findKey(columName).img+"</i></div><div class='txt-div'>"+findKey(columName).name+"</div></div>");
				$("#key").unbind();
				$("#key").bind("tap",function(){
					
					var model=new SocketUtil.sendModel();
			        model.gatewayId=gatewayId;
			        model.moduleId="IRRC";
			        model.moduleIndex="0000";
			        model.cmdType="Comd";
			        model.cmdCatalog="Set ";
			        model.queryString={"method":"transport","deviceTypeId":devType,
					"brandId":brandId,"autoSearchIndex":autoSearchId,"columName":columName};
			        SocketUtil.sendMessage(model);
				});
			}
		}

	    var nextScan=function(){ //进入下一组扫描
									if(scanData.items.length>(scanIndex+1)){
										scanIndex+=1;
										autoSearchId= scanData.items[scanIndex].autoSearchId;
			                            baseCodeIndex= scanData.items[scanIndex].baseCodeIndex;
										
										$("#key").html("");
										for(var j=0;j<scanData.columnNames.length;j++){
											columName=scanData.columnNames[j];
											var btn=$("<div>");
											btn.attr("columName",columName);
											btn.html("<div><div class='btn-div'><i class='icon iconfont'>"+findKey(columName).img+"</i></div><div class='txt-div'>"+findKey(columName).name+"</div></div>");
											btn.unbind();
											btn.bind("tap",function(){
											//发送命令
											var model=new SocketUtil.sendModel();
			        						model.gatewayId=gatewayId;
			        						model.moduleId="IRRC";
			       						    model.moduleIndex="0000";
			        						model.cmdType="Comd";
			       						    model.cmdCatalog="Set ";
			        					    model.queryString={"method":"transport","deviceTypeId":devType,
										    "brandId":brandId,"autoSearchIndex":autoSearchId,"columName":$(this).attr("columName")};
			        					    SocketUtil.sendMessage(model);
											});
										    //电风扇不显示风速按钮
											if (devType == "Fan" && columName == "POWER_SPEED_KEY") {
											    continue;
											}
											$("#key").append(btn);
										}
										
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
												if(arr.indexOf("IRRC")>-1){
													if(backObj[arr].indexOf('normal')>-1){
														sendSearch(arr.substr(0,4),arr.substr(4,4));
													}else{
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
														    sendSearch(backObj.module,backObj.serial);
														}
														SocketUtil.sendMessage(model);
													}
												}
											}
										}
										SocketUtil.sendMessage(model);
									}else{//提示最后一条
										$("#tip").html(I18n.AutoMatch.checkLastSearchIndexFinish);
										$("#key").html("");
										$("#btnOk").css("display","none");
										$("#btnCancel").css("display","none");
									}
		}
		
	    return Piece.View.extend({
			id: 'devicemanage_SeAutoMatch',
			render: function() {
				$(this.el).html(viewTemplate);

				Piece.View.prototype.render.call(this);
				return this;
			},
			onLoadTemplate:function(){
				_TU._U.setHeader(_TU._T.seAutoMatch);
				$("#btnOk").attr("value",I18n.AutoMatch.btnYes);
				$("#btnCancel").attr("value",I18n.AutoMatch.btnNo);
			},
			onShow: function() {
			
				if(autoTimer!=null)window.clearInterval(autoTimer);
				
				 
				scanData=null;//扫描的数据存储
		        scanIndex=-1;//扫描索引
		        columName=null;//键名称
		        autoTime=Cons.AutoMatchTime;//倒计时
		        autoState=0;//0:自动扫描状态,1:确认状态
		        autoTimer=null;//循环记时
				
				
				this.onLoadTemplate();
				$(".content").css("height", '');
				
				if(Piece.Cache.get("deviceType")!=null)devType=Piece.Cache.get("deviceType");
        		if(Piece.Cache.get("deviceBrandId")!=null)brandId=Piece.Cache.get("deviceBrandId");
        		if(Piece.Cache.get("deviceBrandName")!=null)brandName=Piece.Cache.get("deviceBrandName");
       		    if(Piece.Cache.get("autoSearchId")!=null)autoSearchId=Piece.Cache.get("autoSearchId");
				if(Piece.Cache.get("baseCodeIndex")!=null)baseCodeIndex=Piece.Cache.get("baseCodeIndex");
        		if(Piece.Cache.get("gatewayId")!=null)gatewayId=Piece.Cache.get("gatewayId");
				var deviceIndex=0;
				if(Piece.Cache.get("deviceIndex")!=null)deviceIndex=Piece.Cache.get("deviceIndex");
				devType=Schema.DeviceCatg[deviceIndex].apiType;
				$("#deviceName").html(Schema.DeviceCatg[deviceIndex].name);
                $("#tip").html(I18n.AutoMatch.loadGetSearchIndex);//设置启动提示语
				
				
                                //取数据，发起请求
                                Util.Ajax(OpenAPI.readIRCAutoSearchIndexs, "GET", {devType: devType, brandId:brandId},'jsonp',
                                function(data, textStatus, jqXHR){
                                     if(data.autoSearchData.items.length==0){ //没有索引码，则禁用按钮
										$("#tip").html(I18n.AutoMatch.thisBrandDeviceHaveNoSearchIndex);
										$("#key").html("");
										$("#btnOk").css("display","none");
										$("#btnCancel").css("display","none");
									 }
									 else{
									    $("#tip").html(I18n.AutoMatch.checkSearchIndexFor.replace('%d',Cons.AutoMatchTime));//初始化提示
									    scanData={};
									    scanData.items=data.autoSearchData.items;
									    scanData.columnNames=data.autoSearchData.columnNames;
									    nextScan();
										addScanEvent();
									 }
                                },
                                function(e, xhr, type) {
									$("#tip").html(I18n.AutoMatch.thisBrandDeviceHaveNoSearchIndex);//提示无法获取到索引码
								});
								
                                //修改页面和增加事件
                                $("#btnCancel").bind("tap",function(){
									if(scanData==null){
                                        Piece.Toast(I18n.AutoMatch.waitForLoadSearchIndex);
                                        return;
                                    }
									
									//if(autoState==0){
										//autoTime=Cons.AutoMatchTime;
										//nextScan();
										//addScanEvent();
									//}
									//else if(autoState==1){//如果是确认状态，按否则重新进入自动扫描状态
										autoState=0;
										nextScan();
										addScanEvent();
									//}
                                });
								
								//按是
                                $("#btnOk").bind("tap",function(){//确定按钮
                                    if(scanData==null){
                                        Piece.Toast(I18n.AutoMatch.waitForLoadSearchIndex);
                                        return;
                                    }
									
									//if(autoState==0){//自动扫描状态
										//autoState=1;
										//addScanEvent();
									//}
									//else if(autoState==1){//确认状态
									    autoState=1;
										
                                        //保存到object数据
                                        var equipList=Piece.Store.loadObject("DeviceList", true);
                                        if(equipList==null){
                                            equipList=new Array();
                                        }
                                        var loginId = Piece.Store.loadObject("loginId", true);
                                        equipList[equipList.length] = { "loginId": loginId, "serial": guid, "device": Schema.DeviceCatg[deviceIndex].type, "brandId": brandId, "baseCodeIndex": baseCodeIndex, "autoSearchId": autoSearchId, "name": "", "gatewayId": gatewayId };
                                        Piece.Store.saveObject("DeviceList", equipList, true);//保存到本地存储
                                        //跳转
									    Piece.Cache.put("autoSearchId",autoSearchId);
									    Piece.Cache.put("deviceSerial",guid);
										var seDevReName = new SeDevReName();
				                        seDevReName.showFun(function(){
											autoState=0;
										});	
									//}
                                });
								
								
									var  EditDialog  =  new  Piece.Dialog({ 
						    autoshow:  false, 
						    target:  '.content', 
						    title:  "提示", 
						    content:  '请先打开所要添加设备的电源键，再点击确认开始自动匹配!' 
						},  { 
						    configs:  [
						    { 
						        title:  I18n.Common.cancel, 
						        eventName:  'can' ,
						
						    },{ 
						        title:  I18n.Common.ok, 
						        eventName:  'search' ,
						    }], 
						  search:  function()  { 
									
								//定时器
								autoTimer=window.setInterval(function(){

									if(window.location.hash!="#devicemanage/SeAutoMatch"){//只在当前页面有效，定时器
									    if(autoTimer!=null)window.clearInterval(autoTimer);
										return;
									}
									if(scanData==null){//没有索引码则没有反应
                                        return;
                                    }
									if(autoState==1){//是否是确认状态
										return;
									}
									
									
									if(autoTime>0){
										autoTime--;
									}else{//重新计数，进入下一组
									    autoTime=Cons.AutoMatchTime;
										nextScan();
									}
								   },1000);//隔1秒一次
						        },
						  can:  function()  { 
						            EditDialog.hide(); 
						            history.back();
						        },
						}); 
						 EditDialog.show();
						this.setDialogCss();
			},
			setDialogCss:function(){
				$(".btn").first().css("background-color",_TU._T.dialog_Style.cancelColor);
				$(".ui-header").css("background-color",_TU._T.dialog_Style.backColor);
				$(".btn").last().css("background-color",_TU._T.dialog_Style.backColor);
			},
	    });
	});