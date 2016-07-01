define(['text!home/CoLinkedDetails.html','../base/templates/template','../base/util','../base/socketutil','../base/schema',"../base/i18nMain"],
	function(viewTemplate,_TU,Util,SocketUtil,Schema,I18n) {
		
		var diableColor2="#fff";//白色
		var onBackgroundColor=_TU._T.Color.checkbarColor;//粉红
		var onBackgroundColor2="#de3d96";//灰色
		
		var labelTxt={
			"power":"开/关",
			"auto":"自动",
			"airSpeed":"风速",
			"airWhere":"风向",
			"airAuto":"扫风",
			"playStop":"播放/暂停",
			"fanSpeed":"风速",
			"fanAuto":"摇头",
			"lampLight":"亮度",
			"delete":"删除",
			"play":"播放",
			"stop":"暂停",
			"cancel":"取消",
			"exit":"退出",
			"setAirTemp":"温度调节",
			"setFanSpeed":"档位调节",
			"setLampColor":"设置颜色",
			"setLampLight":"设置亮度"
		};
		var ariTemplate,dvdTemplate;
		var deviceDialog,tempDialog,fanSpeedDialog,lampLightDialog,lampColorDialog;
		var listenDevices=[{
			'ListenKey':'TMP',
			'ListenName':I18n.CoLinkedDetails.tempListen,
			'ListenIcon':'&#xe62c;',
			'Title':I18n.CoLinkedDetails.tempBind,
			'ListenWheres':">=30"
		}];//可用的监听设备
		
		
		var ListenName= Piece.Cache.get("ListenName");
		var findLinkedObj=null;
		var isEdit=false;//新增或者编辑
		var LinkedDevices=Piece.Store.loadObject("LinkedDevices", true);//已经存储的监听设备
		if(LinkedDevices==null)LinkedDevices=new Array();
		
		if(findLinkedObj==null){//新建一个监听
		    findLinkedObj=
			{'ListenKey':'TMP',
			'ListenName':I18n.CoLinkedDetails.tempListen,
			'ListenIcon':'&#xe62c;',
			'Title':I18n.CoLinkedDetails.tempBind,
			'ListenWheres':">=30",
			'GroupIds':[],
			"ControlDevices":[]};
		}

		var getAirStatuByCurrAndType=function(type,curr){
				var mode;
				for(var i=0;i<Schema.AriControl.length;i++){
					if(Schema.AriControl[i].key==type){
						for(var j=0;j<Schema.AriControl[i].value.length;j++){
							if(Schema.AriControl[i].value[j].key==curr){
								mode=Schema.AriControl[i].value[j];
								break;
							}
						}
						break;
					}
				}
				return mode;
		};
		var getFanStatuByCurrAndType=function(type,curr){
				var mode;
				for(var i=0;i<Schema.FanControl.length;i++){
					if(Schema.FanControl[i].key==type){
						for(var j=0;j<Schema.FanControl[i].value.length;j++){
							if(Schema.FanControl[i].value[j].key==curr){
								mode=Schema.FanControl[i].value[j];
								break;
							}
						}
						break;
					}
				}
				return mode;
		};
		var getNextAirStatuByCurrAndType=function(type,curr){  
			  var mode;
              for(var i=0;i<Schema.AriControl.length;i++){
					if(Schema.AriControl[i].key==type){
						for(var j=0;j<Schema.AriControl[i].value.length;j++){
							if(Schema.AriControl[i].value[j].key==curr){
								if(j+1<Schema.AriControl[i].value.length){
									mode=Schema.AriControl[i].value[j+1];
								}else{
									mode=Schema.AriControl[i].value[0];
								}
								break;
							}
						}
						break;
					}
				}
				return mode;
		};
		
		//设置按钮颜色
		var setBtnColor=function(obj){
		    if (obj.attr("value") == 0) {
		        obj.css("backgroundColor", "");
		        //关闭
		    } else {
		        obj.css("backgroundColor", onBackgroundColor);
		        //打开
		    }
		};
		//在存储的设备列表中按序列号查找设备
		var searchCurrentDevice=function(gatewayId,device,serial){
			for(var i=0;i<findLinkedObj.ControlDevices.length;i++){
				if(findLinkedObj.ControlDevices[i].serial==serial
				&&findLinkedObj.ControlDevices[i].device==device
				&&findLinkedObj.ControlDevices[i].gatewayId==gatewayId){
					return findLinkedObj.ControlDevices[i];
				}
			}
	    };
		//设置窗口样式
		var setDialogCss=function(num){
				    $(".cube-dialog-subtitle").attr("class","cube-dialog-subtitle1");
					$(".cube-dialog-subtitle1").css("height",num*60);
					$(".cube-dialog").css("margin-top","80px");
					$(".cube-dialog").css("top","0px");
					$(".ui-header").css("background-color",onBackgroundColor);
		};
		//填充html
		var fillHtml=function(obj){
			
		        var list=$("<div>").attr("class","div-list");
				var lname=$("<div>").attr("class","div-list-name").attr("data-serial",obj.serial).attr("data-device",obj.device).attr("data-gatewayId",obj.gatewayId).html(obj.name);
				lname.appendTo(list);
				list.appendTo("#equipList .table-rg");
		};
		//获得设备的操作按钮
		var getBtnHtml=function(CoObj){
				var btnhtml="";
				switch(CoObj.device.toLocaleLowerCase())
				{
									case "ac00"://空调
										  btnhtml='<div class="b-flex" data-type="open" value="'+CoObj.power+'"><div class="div-slider"><div class="div-slidering"></div></div><div class="text-label" style="font-size:10px">'+I18n.CoSchedule.power+'</div></div>';
									      btnhtml+='<div data-type="mode" value="'+CoObj.mode+'">'+I18n.CoSchedule.mode+'</div>';
										  btnhtml+='<div data-type="temperature" value="'+CoObj.temperature+'">'+CoObj.temperature+'℃</div>';
										  btnhtml+='<div data-type="airVolume" value="'+CoObj.airVolume+'"><i class="icon iconfont" style="font-size:20px">'+ariTemplate.airVolume.icon+'</i><div class="text-label" style="font-size:10px">'+I18n.CoSchedule.airVolume+'</div></div>';
										  btnhtml+='<div data-type="airDir" value="'+CoObj.airDir+'"><i class="icon iconfont" style="font-size:20px">'+ariTemplate.airDir.icon+'</i><div class="text-label" style="font-size:10px">'+I18n.CoSchedule.airDir+'</div></div>';
										  btnhtml+='<div data-type="autoDir" value="'+CoObj.autoDir+'"><i class="icon iconfont" style="font-size:20px">'+ariTemplate.autoDir.icon+'</i><div class="text-label" style="font-size:10px">'+I18n.CoSchedule.autoDir+'</div></div>';
										  break;
									case "tv00"://电视
									      btnhtml='<div class="b-flex" data-type="open" value="'+CoObj.power+'"><div class="div-slider"><div class="div-slidering"></div></div><div class="text-label" style="font-size:10px">'+I18n.CoSchedule.power+'</div></div>';
										  break;
									case "dvd0"://DVD
									       btnhtml='<div class="b-flex" data-type="open" value="'+CoObj.power+'"><div   class="div-slider"><div class="div-slidering"></div></div><div class="text-label" style="font-size:10px">'+I18n.CoSchedule.power+'</div></div>';
										   btnhtml+='<div data-type="dvd-play" value="'+CoObj.play+'"><i class="icon iconfont" style="font-size:20px">'+dvdTemplate.play_icon+'</i><div class="text-label" style="font-size:10px">'+I18n.CoSchedule.stop+'</div></div>';
										  break;
                                    case "stb0"://机顶盒
				                    case "iptv"://iptv
                                        btnhtml = '<div class="b-flex" data-type="open" value="' + CoObj.power + '"><div class="div-slider"><div class="div-slidering"></div></div><div class="text-label" style="font-size:10px">' + I18n.CoSchedule.power + '</div></div>';
										  break;	
                                     case "fan0"://电风扇
									      btnhtml='<div class="b-flex" data-type="open" value="'+CoObj.power+'"><div class="div-slider"><div class="div-slidering"></div></div><div class="text-label" style="font-size:10px">'+I18n.CoSchedule.power+'</div></div>';
									      btnhtml += '<div data-type="oscillate" value="' + CoObj.oscillate + '"><i class="icon iconfont">' + _TU._T.CoSchedule.data.oscillate_icon + '</i><div class="text-label" style="font-size:10px">' + I18n.CoSchedule.oscillate + '</div></div>';
										  btnhtml+='<div data-type="speed" value="'+CoObj.speed+'">1'+I18n.CoSchedule.step+'</div>';
										  break;	
                                     case "ss00"://插座
									      btnhtml='<div class="b-flex" data-type="open" value="'+CoObj.power+'"><div class="div-slider"><div class="div-slidering"></div></div><div class="text-label" style="font-size:10px">'+I18n.CoSchedule.power+'</div></div>';
										  break;
                                     case "slb0"://电灯
									       btnhtml='<div class="b-flex" data-type="open" value="'+CoObj.power+'"><div class="div-slider"><div class="div-slidering"></div></div><div class="text-label" style="font-size:10px">'+I18n.CoSchedule.power+'</div></div>'; 
										   btnhtml+='<div data-type="light" value="'+CoObj.light+'">'+CoObj.light+'%<div class="text-label" style="font-size:10px">'+I18n.CoSchedule.light+'</div></div>';
										   btnhtml+='<div data-type="color" value="'+CoObj.color+'" class="color" style="background-color:#8d12eb;"></div>';
										   break;
				                     case "prj0"://投影仪
				                           btnhtml += '<div class="b-flex" data-type="open" value="' + CoObj.power + '"><div class="div-slider"><div class="div-slidering"></div></div><div class="text-label" style="font-size:10px">' + I18n.CoSchedule.power + '</div></div>';
				                           btnhtml += '<div data-type="pc" value="' + CoObj.pc + '"><i class="icon iconfont">' + _TU._T.CoSchedule.data.pc_icon + '</i><div class="text-label" style="font-size:10px">' + I18n.CoSchedule.pc + '</div></div>';
				                           btnhtml += '<div data-type="video" value="' + CoObj.video + '"><i class="icon iconfont">' + _TU._T.CoSchedule.data.video_icon + '</i><div class="text-label" style="font-size:10px">' + I18n.CoSchedule.video + '</div></div>';
				                           break;
				}
				return btnhtml;
		};
		//绑定设备操作按钮
		var fillDevice=function(item,btnhtml){
			    var pic=Util.getDevice(item.device).img;
				var id="ser_"+item.device+'-'+item.gatewayId+'-'+item.serial;
				
				$(".lastfore").append('<div class="main-conterner" ><div class="main-box" data-serial="'+item.serial+'" data-device="'+item.device+'" data-gatewayId="'+item.gatewayId+'"  id="ser_'+id+'"><div class="b-flex-1"><div><i class="icon iconfont">'+pic+'</i><div>'+item.name+'</div></div></div><div class="b-flex-2">'+btnhtml+'</div><div class="cont-edit"><div><div class="cont-edit-1" >'+labelTxt.delete+'</div></div></div></div>');
			  
			    //拖动事件
			    $("#"+item.serial).swipeLeft(function(e){
				    $(e.target).parents(".main-box").css("right",100+"px");
				 });
				$("#"+item.serial).swipeRight(function(e){
				    $(e.target).parents(".main-box").css("right",0+"px");
				});

				//各种按钮绑定事件
				var currentObj=null;
				
				//开关
				$("#ser_"+id).find(".div-slider").bind("tap",function(){
					    var serial=$(this).parents(".main-box").attr("data-serial");
						var device=$(this).parents(".main-box").attr("data-device");
						var gatewayId=$(this).parents(".main-box").attr("data-gatewayId");
						currentObj=searchCurrentDevice(gatewayId,device,serial);
						if($(this).find("div").css("float")=="left"){
							$(this).css("backgroundColor",onBackgroundColor);
							$(this).find("div").css("float","right");
							//打开
							currentObj.power=1;
						}
						else{
							$(this).css("backgroundColor","");
							$(this).find("div").css("float","left");
							//关闭
							currentObj.power=0;
						}
				});	
				//空调模式
				$("#ser_"+id).find("[data-type=mode]").bind("tap",function(){
				        var value=$(this).attr("value");
						var next=getNextAirStatuByCurrAndType("mode",value);
						$(this).attr("value",next.key);
						$(this).text(next.name);
					
						//保存
						var serial=$(this).parents(".main-box").attr("data-serial");
						var device=$(this).parents(".main-box").attr("data-device");
						var gatewayId=$(this).parents(".main-box").attr("data-gatewayId");
						currentObj=searchCurrentDevice(gatewayId,device,serial);
						currentObj.mode=next.key;
				});
				//空调温度
				$("#ser_"+id).find("[data-type=temperature]").bind("tap",function(){
					 window.setTimeout(function(){
						tempDialog.show();
						setDialogCss(6);},100);
						Piece.Cache.put("device",$(this));
				});
				//空调风速
				$("#ser_"+id).find("[data-type=airVolume]").bind("tap",function(){
				       var value=$(this).attr("value");
						var next=getNextAirStatuByCurrAndType("airVolume",value);
						$(this).attr("value",next.key);
						$(this).children(".text-label").html(next.name);
						
						//保存
						var serial=$(this).parents(".main-box").attr("data-serial");
						var device=$(this).parents(".main-box").attr("data-device");
						var gatewayId=$(this).parents(".main-box").attr("data-gatewayId");
						currentObj=searchCurrentDevice(gatewayId,device,serial);
						currentObj.airVolume=next.key;
				});
				//空调风向
				$("#ser_"+id).find("[data-type=airDir]").bind("tap",function(){
				        var value=$(this).attr("value");
						var next=getNextAirStatuByCurrAndType("airDir",value);
						$(this).attr("value",next.key);
						$(this).children(".text-label").html(next.name);
						
						//保存
						var serial=$(this).parents(".main-box").attr("data-serial");
						var device=$(this).parents(".main-box").attr("data-device");
						var gatewayId=$(this).parents(".main-box").attr("data-gatewayId");
						currentObj=searchCurrentDevice(gatewayId,device,serial);
						currentObj.airDir=next.key;
				});
				//空调是否自动扫风
				$("#ser_"+id).find("[data-type=autoDir]").bind("tap",function(){
				        var value=$(this).attr("value");
						if(value==1)
						{
							$(this).attr("value",0);
							setBtnColor($(this));
						}
						else{
							$(this).attr("value",1);
							setBtnColor($(this));
						}
						//保存
						var serial=$(this).parents(".main-box").attr("data-serial");
						var device=$(this).parents(".main-box").attr("data-device");
						var gatewayId=$(this).parents(".main-box").attr("data-gatewayId");
						currentObj=searchCurrentDevice(gatewayId,device,serial);
						currentObj.autoDir=(value==1?0:1);
				});	
				//电风扇档位
				$("#ser_"+id).find("[data-type=speed]").bind("tap",function(){
					 window.setTimeout(function(){
						fanSpeedDialog.show();
						setDialogCss(3);},100);
						Piece.Cache.put("device",$(this));
				});
				//电风扇摇头
				$("#ser_"+id).find("[data-type=oscillate]").bind("tap",function(){
				        var value=$(this).attr("value");
						if(value==1)
						{
							$(this).attr("value",0);
							setBtnColor($(this));
						}
						else{
							$(this).attr("value",1);
							setBtnColor($(this));
						}
						//保存
						var serial=$(this).parents(".main-box").attr("data-serial");
						var device=$(this).parents(".main-box").attr("data-device");
						var gatewayId=$(this).parents(".main-box").attr("data-gatewayId");
						currentObj=searchCurrentDevice(gatewayId,device,serial);
						currentObj.oscillate=(value==1?0:1);
				});	
				//DVD播放暂停
				$("#ser_"+id).find("[data-type=dvd-play]").bind("tap",function(){
				       var value=$(this).attr("value");
						if(value==1)
						{
							$(this).attr("value",0);
							$(this).children(".icon").html(dvdTemplate.play_icon);
							$(this).children(".text-label").html(I18n.CoSchedule.stop);
						}
						else{
							$(this).attr("value",1);
						    $(this).children(".icon").html(dvdTemplate.stop_icon);
							$(this).children(".text-label").html(I18n.CoSchedule.play);
						}
						//保存
						var serial=$(this).parents(".main-box").attr("data-serial");
						var device=$(this).parents(".main-box").attr("data-device");
						var gatewayId=$(this).parents(".main-box").attr("data-gatewayId");
						currentObj=searchCurrentDevice(gatewayId,device,serial);
						currentObj.play=(value==1?0:1);
				});
				//电灯亮度
			    $("#ser_"+id).find("[data-type=light]").bind("tap",function(){
					 window.setTimeout(function(){
					    lampLightDialog.show();
						setDialogCss(5);},100);
						Piece.Cache.put("device",$(this));
					
				});
				//电灯颜色
				$("#ser_"+id).find("[data-type=color]").bind("tap",function(){
					 window.setTimeout(function(){
					    lampColorDialog.show();
						setDialogCss(3);},100);
						Piece.Cache.put("device",$(this));
				});

 
		      //投影仪电脑
				$("#ser_" + id).find("[data-type=pc]").bind("tap", function () {
				     //保存
				    var serial = $(this).parents(".main-box").attr("data-serial");
				    var device = $(this).parents(".main-box").attr("data-device");
				    var gatewayId = $(this).parents(".main-box").attr("data-gatewayId");
				    currentObj = searchCurrentDevice(gatewayId, device, serial);
				    var value = $(this).attr("value");
				    if (value == 1) {
				        $(this).attr("value", 0);
				        setBtnColor($(this));
				    }
				    else {
				        $(this).attr("value", 1);
				        setBtnColor($(this));

				        $(this).next("[data-type=video]").attr("value", 0);
				        setBtnColor($(this).next("[data-type=video]"));
				        currentObj.video = value;
				    }
				   
				    currentObj.pc = (value == 1 ? 0 : 1);
				});

		      //投影仪视频
				$("#ser_" + id).find("[data-type=video]").bind("tap", function () {
				    var serial = $(this).parents(".main-box").attr("data-serial");
				    var device = $(this).parents(".main-box").attr("data-device");
				    var gatewayId = $(this).parents(".main-box").attr("data-gatewayId");
				    currentObj = searchCurrentDevice(gatewayId, device, serial);
				    var value = $(this).attr("value");
				    if (value == 1) {
				        $(this).attr("value", 0);
				        setBtnColor($(this));
				    }
				    else {
				        $(this).attr("value", 1);
				        setBtnColor($(this));

				        $(this).prev("[data-type=pc]").attr("value", 0);
				        setBtnColor($(this).prev("[data-type=pc]"));
				        currentObj.pc = value;
				    }
				    //保存
				    currentObj.video = (value == 1 ? 0 : 1);
				});
		};
		var addNewFunc=null;
		
		return Piece.View.extend({
			id: 'home_CoLinkedDetails',
			events:{
				"touchstart .div-list-name":"afterNew",
				"touchstart .temp-list-name":"afterChooseTemp",
				"touchstart .div-list2":"afterChooseFanSpeed",
				"touchstart .item":"afterChooseLampLight",
				"touchstart .coloritem":"afterChooseLampColor",
				"touchstart .cont-edit-1":"deleteEquip",
				"touchstart .save":"doSave"
			},
			//添加新的离家设备
			addNew:function(){
				     var heightCount=0;
				     $("#equipList .table-rg").html('');
					 var equipList=Piece.Store.loadObject("DeviceList", true);
					 var magicList=Piece.Store.loadObject("magicList", true);
					  var sharList=new Array();
					  if(magicList!=null&&magicList.length>0){
						for(var j=0;j<magicList.length;j++){
							if(magicList[j].share){
								sharList[sharList.length]=magicList[j].gatewayId;
							}
						}
					 }
					 var ifSkip=false;
					 if(equipList!=null&&equipList.length>0)
					 {     
							for(var i=0;i<equipList.length;i++){
								ifSkip=false;
								if(equipList[i].device=="MagicBox"||equipList[i]==null||equipList[i].name==undefined||equipList[i].name==''){
									 continue;
								}
								
								for(var j=0;j<findLinkedObj.ControlDevices.length;j++){
										if(equipList[i].serial==findLinkedObj.ControlDevices[j].serial
										&&equipList[i].device==findLinkedObj.ControlDevices[j].device
										&&equipList[i].gatewayId==findLinkedObj.ControlDevices[j].gatewayId)
										{
											ifSkip=true;
											break;
										}
								}
								if(ifSkip)continue;
								ifSkip=false;
								for(var k=0;k<sharList.length;k++){//共享设备的不允许加日程
									if(sharList[k]==equipList[i].gatewayId){
										ifSkip=true;
										break;
									}
								}
								if(ifSkip)continue;
								//显示
								fillHtml(equipList[i]);
								if(heightCount<6)//弹出层最多显示6个，否则出现滚动条
								heightCount++;
							}
					}
					
					if(heightCount==0){
						new Piece.Toast(I18n.CoLinkedDetails.pleaseNeedDeviceFirst);
						return;
					}
					deviceDialog  =  new  Piece.Dialog({ 
						    autoshow:  false, 
						    target:  '.content', 
						    title:  '设备列表', 
						    content:  $("#equipList").html(),
						},{
							configs:[]
						});
						 window.setTimeout(function(){
			        deviceDialog.show();
					setDialogCss(heightCount);},100);
			},
			//选择设备之后
			afterNew:function(obj){
				
				var equipList=Piece.Store.loadObject("DeviceList", true);
				var Item=null;
				var serial=$(obj.srcElement).attr("data-serial");
				var device=$(obj.srcElement).attr("data-device");
				var gatewayId=$(obj.srcElement).attr("data-gatewayId");
				
			    for(var i=0;i<equipList.length;i++){
					if(serial==equipList[i].serial
					&&device==equipList[i].device
					&&gatewayId==equipList[i].gatewayId)
					{
						Item=equipList[i];
					    break;
					}
				}
				var linkedObj=null;
				
				
				//识别，赋值
				switch(Item.device.toLocaleLowerCase())
				{
									case "ac00"://空调
									      linkedObj={gatewayId:Item.gatewayId,serial:Item.serial,device:Item.device,name:Item.name,power:0,mode:"auto",temperature:25,airVolume:"auto",airDir:"middle",autoDir:0};
										  break;
									case "tv00"://电视
									      linkedObj={gatewayId:Item.gatewayId,serial:Item.serial,device:Item.device,name:Item.name,power:0};
										  break;
									case "dvd0"://DVD
										  linkedObj={gatewayId:Item.gatewayId,serial:Item.serial,device:Item.device,name:Item.name,power:0,play:0};
										  break;
				                    case "stb0"://机顶盒
				                    case "iptv"://iptv
										  linkedObj={gatewayId:Item.gatewayId,serial:Item.serial,device:Item.device,name:Item.name,power:0};
										  break;	
                                     case "fan0"://电风扇
										  linkedObj={gatewayId:Item.gatewayId,serial:Item.serial,device:Item.device,name:Item.name,power:0,oscillate:0,speed:"low"};
										  break;	
									 // case "sw00"://开关
										  // linkedObj={gatewayId:Item.gatewayId,serial:Item.serial,device:Item.device,name:Item.name,power:0};
                                     case "ss00"://插座
										  linkedObj={gatewayId:Item.gatewayId,serial:Item.serial,device:Item.device,name:Item.name,power:0};
										  break;
                                     case "slb0"://电灯
										  linkedObj={gatewayId:Item.gatewayId,serial:Item.serial,device:Item.device,name:Item.name,power:0,light:0,color:"#f60f60"};
										  break;
				                    case "prj0"://投影仪
				                          linkedObj = { gatewayId: Item.gatewayId, serial: Item.serial, device: Item.device, name: Item.name, power: 0, pc: 0, video: 0 };
				                          break;
				}
				
				if(linkedObj!=null){
					btnhtml=getBtnHtml(linkedObj);
					fillDevice(linkedObj,btnhtml);
					findLinkedObj.ControlDevices[findLinkedObj.ControlDevices.length]=linkedObj//新建一个设备
				}
				deviceDialog.hide();
			},
			afterChooseTemp:function(obj){
			    var Item=null;
			    var temp=obj.srcElement.id==""?obj.srcElement.parentElement.id:obj.srcElement.id;
				var device=Piece.Cache.get("device");
			    device.attr("value",temp);
				device.html(temp+"℃");
				tempDialog.hide();
				

				//保存
				var serial=device.parents(".main-box").attr("data-serial");
				var device2=device.parents(".main-box").attr("data-device");
				var gatewayId=device.parents(".main-box").attr("data-gatewayId");
				currentObj=searchCurrentDevice(gatewayId,device2,serial);
				currentObj.temperature=temp;
		    },
		    afterChooseFanSpeed:function(obj){
			    var Item=null;
			    var step=obj.srcElement.id==""?obj.srcElement.parentElement.id:obj.srcElement.id;
				var device=Piece.Cache.get("device");
			    device.attr("value",step);
				device.html(getFanStatuByCurrAndType("speed",step).name);
				fanSpeedDialog.hide();
				
				//保存
				var serial=device.parents(".main-box").attr("data-serial");
				var device2=device.parents(".main-box").attr("data-device");
				var gatewayId=device.parents(".main-box").attr("data-gatewayId");
				currentObj=searchCurrentDevice(gatewayId,device2,serial);
				currentObj.speed=step;
		    },
		    afterChooseLampLight:function(obj){
			    var Item=null;
			    var light=obj.srcElement.id==""?obj.srcElement.parentElement.id:obj.srcElement.id;
				var device=Piece.Cache.get("device");
			    device.attr("value",light);
				device.html(light+"%");
				lampLightDialog.hide();
				
				//保存
				var serial=device.parents(".main-box").attr("data-serial");
				var device2=device.parents(".main-box").attr("data-device");
				var gatewayId=device.parents(".main-box").attr("data-gatewayId");
				currentObj=searchCurrentDevice(gatewayId,device2,serial);
				currentObj.light=light;
			},
		    afterChooseLampColor:function(obj){
				var Item=null;
			    var color=obj.srcElement.id==""?obj.srcElement.parentElement.id:obj.srcElement.id;
				var device=Piece.Cache.get("device");
			    device.attr("value",color);
				if(color=="auto")
				{
					device.css("backgroundColor","");
					device.html("auto");
				}
				else{
					device.css("backgroundColor","#"+color);
					device.html("");
				}
				lampColorDialog.hide();
				
				//保存
				var serial=device.parents(".main-box").attr("data-serial");
				var device2=device.parents(".main-box").attr("data-device");
				var gatewayId=device.parents(".main-box").attr("data-gatewayId");
				currentObj=searchCurrentDevice(gatewayId,device2,serial);
				currentObj.color=color;
			},
			deleteEquip:function(e){
				
				var serial=$(e.target).parents().find(".main-box").attr("data-serial");
				var device=$(e.target).parents().find(".main-box").attr("data-device");
				var gatewayId=$(e.target).parents().find(".main-box").attr("data-gatewayId");

			    for(var i=0;i<findLinkedObj.ControlDevices.length;i++){
				   if(findLinkedObj.ControlDevices[i].serial==serial
				   &&findLinkedObj.ControlDevices[i].device==device
				   &&findLinkedObj.ControlDevices[i].gatewayId==gatewayId){
					 findLinkedObj.ControlDevices.splice(i,1);
					 break;
				 }
			   }
			   //$("#"+serial).parent(".main-conterner").remove();
				$(e.target).parent().parent().parent().parent().remove();
			},
			render: function() {
				$(this.el).html(viewTemplate);

				Piece.View.prototype.render.call(this);
				return this;
			},
			onLoadTemplate:function(){
				_TU._U.setHeader(_TU._T.home_CoLinkedDetails);//替换头部导航
				var userInfoTemplate = $(this.el).find("#home_CoLinkedDetails_Template").html();
				var userInfoHtml = _.template(userInfoTemplate, _TU._T.home_CoLinkedDetails.data);
				$(".content").html("");
				$(".content").append(userInfoHtml);
			},
			onShow: function() {
				
				this.onLoadTemplate();
				this.setDropDown();//下来菜单
				addNewFunc=this.addNew;
				
				ariTemplate = _TU._T.ehome_Air.data;
				dvdTemplate= _TU._T.ehome_CoSDVD.data;
				 
				$("#add").bind("click",function(){
					addNewFunc();
				});
				
				//空调温度对话框
				for(var i=16;i<31;i++)
				{
					$("<div>")
					.html('<div class="div-list" id="'+i+'"><div class="temp-list-name">'+i+'</div></div>')
					.appendTo("#tempList .table-rg");
				}
				tempDialog=new  Piece.Dialog({ 
					    autoshow:  false, 
					    target:  '.content', 
					    title:  labelTxt.setAirTemp, 
					    content:  $("#tempList").html(),
					},{
                        configs:[]
                    });
				//电风扇档位对话框	
				var arry=new Array("","low","middle","high");
				for(var i=1;i<4;i++)
				{
					$("<div>")
					.html('<div class="div-list2" id="'+arry[i]+'"><div class="speed-list-name">'+i+'</div></div>')
					.appendTo("#fanStepList .table-rg");
				}
				fanSpeedDialog=new  Piece.Dialog({ 
					    autoshow:  false, 
					    target:  '.content', 
					    title:  labelTxt.setFanSpeed, 
					    content:  $("#fanStepList").html(),
					},{
                        configs:[]
                    });
					
				//电灯颜色对话框
				var content=$("<div>");
				for(var i=0;i<5;i++){
						var color="f60f60";
						if(i==1)color="3f04dd";
						if(i==2)color="dd55ff";
						if(i==3)color="00a600";
						if(i==4)color="auto";
						var item=$("<div>");
						item.attr("id",color);
						if(color=="auto"){
						}
						else{
						   item.css("backgroundColor","#"+color);
						}
						item.attr("class","coloritem");
						item.appendTo(content);
				}
				lampColorDialog = new Piece.Dialog({
                        autoshow:false,
                        target:'.content',
                        title:labelTxt.setLampColor,
                        content:content
                    },
                    {
                        configs:[]
                });
				//电灯亮度对话框
				var content=$("<div>");
				for(var i=0;i<11;i++){
						var item=$("<div>").html((i*10)+"%");
						item.attr("id",i*10);
						item.attr("class","item");
						item.appendTo(content);
				}
			    lampLightDialog = new
                    Piece.Dialog({
                        autoshow:false,
                        target:'.content',
                        title:labelTxt.setLampLight,
                        content:content
                    },
                    {
                        configs:[]
                });
			},
			setDropDown:function(){
				$(".choose-1").on("touchstart",function(e){
					$(e.target).find("ul").css("display","block");
				});
				$(".choose-1 ul li").on("touchstart",function(e){
					var text=$(e.target).text();
					$(e.target).parent().parent().parent().find("span[class='bname']").text(text);
					findLinkedObj.ListenWheres=$(".bname").text()+$(".ptext").val();
				});
				
				$(".ptext").blur(function(){
					findLinkedObj.ListenWheres=$(".bname").text()+$(".ptext").val();
				});
				
				
				//设置监听器
				$(".identification").html(listenDevices[0].ListenKey);//监听项目
				$(".equipment").html(listenDevices[0].ListenName);//监听器名称
				//$(".instructions").html("<i class='icon iconfont'>"+listenDevices[0].ListenIcon+"</i>");//监听器图标
				//条件
				$(".cname").html("温度");
				$(".clist").html("");
				
				
				$(document).ready(function () {
			        $("*").on("tap",function (event) {
			            if (!$(this).hasClass("choose-1")){
			                $(".choose-1 ul").css("display","none");
			            }
			            //event.stopPropagation(); //阻止事件冒泡    
			        });
			    });
			},
			get4s:function(indexH){
				var indexSH=indexH+"";
				while(indexSH.length<4){
					indexSH="0"+indexSH;
				}
				return indexSH;
			},
			get3s:function(indexH){
				var indexSH=indexH+"";
				while(indexSH.length<3){
					indexSH="0"+indexSH;
				}
				return indexSH;
			},
			doSave:function(){
				LinkedDevices[LinkedDevices.length]=findLinkedObj;
				Piece.Store.saveObject("LinkedDevices", LinkedDevices,true);
				Backbone.history.navigate("home/CoLinkedList", {trigger: true});
			}
		}); //view define

	});