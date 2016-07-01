define(['text!scene/CoSetName.html','../base/socketutil',"../base/templates/template","../base/i18nMain",],
	function(viewTemplate,SocketUtil,_TU,I18n) {
		var modeIndex;
		var deviceTempList;
		var tempMode=null;
		var modesList;
		var calType;
		var deviceExistHomeList;
		var operationType;
		return Piece.View.extend({
			id: 'scene_CoSetName',
			render: function() {
				$(this.el).html(viewTemplate);
				Piece.View.prototype.render.call(this);
				return this;
			},
			onLoadTemplate:function(){
				_TU._U.setHeader(_TU._T.CoSetName);
				var userInfoTemplate = $(this.el).find("#setName_inf").html();
				var userInfoHtml = _.template(userInfoTemplate, _TU._T.CoSetName);
				$(".content").append(userInfoHtml);
			},
			onShow: function() {
				 this.onLoadTemplate();
				 $("#ModeName").focus();
				 operationType=Piece.Cache.get("operation-type");
				 modeIndex=Piece.Cache.get("modeIndex");
				 calType=Piece.Cache.get("calType");
				 modesList=Piece.Store.loadObject("modesList",true);
				 if(modesList==null)modesList=new Array();
				 deviceExistHomeList=Piece.Store.loadObject("deviceExistHomeList",true);
				 if(deviceExistHomeList==null)
					 deviceExistHomeList=new Array();
				 deviceTempList=Piece.Store.loadObject("deviceTempList",true);
				 if(deviceTempList==null)
					 deviceTempList=new Array();
				 tempMode=Piece.Store.loadObject("tempMode",true);
				 $("#ModeName").val(tempMode.modeName);
			},
			events: {
				'touchstart #study': 'save'
			},
			save:function(){
				  var Name=$("#ModeName").val();
			      if(Name==""||$("#ModeName").val()==I18n.Common.inputMsg)
				  {
					 new Piece.Toast(I18n.Common.inputMsg);
					 return;
				  }
				  if(operationType=="add"){
					  //把临时设备存储存储到设备模式列表
					  for(var i=0;i<deviceTempList.length;i++){
						 deviceExistHomeList[deviceExistHomeList.length]=deviceTempList[i];
					  }
					  tempMode.modeName=Name;
					  modesList[modesList.length]=tempMode;
					   //修改索引数组
					  var array=Piece.Store.loadObject("QJModeIndexArray", true);
					  for(var i=0;i<array.length;i++){
						  if(array[i].index==modeIndex)
						  {
							  array[i].isUse=1;
							  break;
						  }
					  }
					  Piece.Store.saveObject("QJModeIndexArray", array,true);
				  }
				  else if(operationType=="edit"){
					  for(var i=0;i<deviceTempList.length;i++){
						 var device=this.searchCurrentDevice(deviceTempList[i]);
						 if(device!=null)
							 device=deviceTempList[i];
					  }
					  tempMode.modeName=Name;
					  for(var i=0;i<modesList.length;i++){
						  if(modesList[i].modeIndex==modeIndex){
						     modesList[i]=tempMode;
							 break;
						  }
					  }
				  }
				  Piece.Store.saveObject("deviceExistHomeList", deviceExistHomeList, true);
				  Piece.Store.saveObject("modesList", modesList, true);
				  Piece.Cache.put("modeIndex",null);
				  Piece.Cache.put("operation-type",null);
				  Piece.Store.saveObject("tempMode", null, true);	//清空临时存储
				  Piece.Store.saveObject("deviceTempList", null, true);	//清空临时存储
				 
				  this.SendOrder();
			},
			//在设备列表中按序列号查找设备
			searchCurrentDevice:function(device){
				if(deviceExistHomeList==null){
						 deviceExistHomeList=new Array();
						 return null;
				}
				for(var j=0;j<deviceExistHomeList.length;j++){
						if(deviceExistHomeList[j]!=null
						   &&deviceExistHomeList[j].serial!="undefined"
						   &&device.serial==deviceExistHomeList[j].serial
						   &&device.calType==deviceExistHomeList[j].calType
						   &&device.modeIndex==deviceExistHomeList[j].modeIndex
						   &&device.gatewayId==deviceExistHomeList[j].gatewayId)
						   {
							  return deviceExistHomeList[j];
						   }
				}
				return null;
			},
			//发命令
		    SendOrder:function(){
				 var CoObj;
				 var order="";
				if(deviceExistHomeList==null){
						 deviceExistHomeList=new Array();
						 return;
				}
				var gatewayIds=new Array();
				for(var j=0;j<deviceExistHomeList.length;j++){//把不同的网关放到数组
			  	    if(calType==deviceExistHomeList[j].calType&&gatewayIds.indexOf(deviceExistHomeList[j].gatewayId)<0)
				       gatewayIds[gatewayIds.length]=deviceExistHomeList[j].gatewayId;
					}
				var orders=new Array();
				for(var i=0;i<gatewayIds.length;i++)
				{        
    			          orders=new Array();
					      CoObj=null;
						  for(var j=0;j<deviceExistHomeList.length;j++){//一组网关发一组命令
						        if(modeIndex!=deviceExistHomeList[j].modeIndex)continue;
						        if(gatewayIds[i]!=deviceExistHomeList[j].gatewayId)continue;
							    CoObj=deviceExistHomeList[j];
							    order="";
								switch(CoObj.device.toLocaleLowerCase())
								{
											case "ac00"://空调
												  order="#distModule=AC00#distSerial="+CoObj.serial
														+"#power="+(CoObj.power==0?"off":"on")
														if(CoObj.power==1)
														{
															order=order
															+"#mode="+CoObj.mode
															+"#temperature="+CoObj.temperature
															+"#airVolume="+CoObj.airVolume
															+"#airDir="+CoObj.airDir
															+"#autoDir="+(CoObj.autoDir==0?"off":"on")
														}
												  break;
											case "tv00"://电视
												  order="#distModule=TV00#distSerial="+CoObj.serial
														+"#power=1"
												  break;
											case "dvd0"://DVD
												 order="#distModule=DVD0#distSerial="+CoObj.serial
														+"#power=1"
														if(CoObj.power==1)
														{
														  order+="#play=1"
														}
												  break;
											case "stb0"://机顶盒
												 order="#distModule=STB0#distSerial="+CoObj.serial
														+"#power=1"
												  break;	
											 case "fan0"://电风扇
												order="#distModule=FAN0#distSerial="+CoObj.serial
														+"#power=1"
														if(CoObj.power==1)
														{
															order=order
															+"#oscillate=1"
															+"#speed="+CoObj.speed
														}
												  break;	
											 case "ss00"://插座
												   order="#distModule=SS00#distSerial="+CoObj.serial
														 +"#power=1"
												  break;
											 case "slb0"://电灯
													order="#distModule=SLB0#distSerial="+CoObj.serial
														+"#power=1"
														if(CoObj.power==1)
														{
															order=order
															+"#light="+CoObj.light
															+"#color="+CoObj.color
														}
												  break;	  
								}
								if(order!="")
								orders[orders.length]=order;
						}
						
						//获取该网关编号在数组中的索引，放到命令索引前两位，以区分返回的group属于哪个魔方网关
						var gateIndex=-1;
						var magicList=Piece.Store.loadObject("magicList", true);
						for(var m=0;m<magicList.length;m++){
							if(gatewayIds[i]==magicList[m].gatewayId)
							{
								gateIndex=m;
								break;
							}
						}
						var cmds=Piece.Store.loadObject("ModeCmds", true);
						var isExists=false;
						 var groupIds=new Array();
						 //测试启用、关闭、删除命令用，后续接口能返回则注释
						// groupIds[0]="0001";
						//测试用，后续接口能返回则注释
						if(cmds==null) cmds=new Array();
						else{
							for(var k=0;k<cmds.length;k++)
							{
								if(cmds[k].modeIndex==modeIndex&&cmds[k].gateIndex==gateIndex){
									
									if(cmds[k].groupIds.length>0){//删除该模式下原来存在的日程
										for(var j=0;j<cmds[k].groupIds.length;j++){
											SocketUtil.QJDeleteMode(gatewayIds[i],cmds[k].groupIds[j]);
										}
									}
									cmds[k]={"gateIndex":gateIndex,"modeIndex":modeIndex,"groupIds":groupIds};
									isExists=true;
									break;
								}
							}
						}
						if(!isExists)cmds[cmds.length]={"gateIndex":gateIndex,"modeIndex":modeIndex,"groupIds":groupIds};
						Piece.Store.saveObject("ModeCmds", cmds, true);
						Backbone.history.navigate("scene/CoStageSet", {trigger: true});
			            //发命令
						SocketUtil.QJSetMode(gateIndex,modeIndex,gatewayIds[i],calType,orders,tempMode);
						
				}
			}
		,
		}); 
});