define(['text!scene/CoSchedule.html','../base/util','../base/socketutil','../base/schema',"../base/templates/template","../base/i18nMain",],
	function(viewTemplate,Util,SocketUtil,Schema,_TU,I18n) {
		var equipList;
		var heightCount=0;
		var modeImgDialog,periodDialog,weekDialog,deviceDialog,tempDialog,fanSpeedDialog,lampLightDialog,lampColorDialog;
		var currentDeviceList=new Array();
		var currentDeviceListName="deviceExistHomeList";
		var getAirStatuByCurrAndTypeFun,getFanStatuByCurrAndTypeFun;
		var getNextAirStatuByCurrAndTypeFun=null;
		var setBtnColorFun=null;
		var setDialogCssFun=null;
		var searchCurrentDeviceFun,saveToLocalFun;
		var calType;//离家3、回家4
		var modeIndex;
		var modesList;
		var currentMode=null;
		var isFixed=0;//是否为固定模式
		var operationType;
		var loginId;
		var ariTemplate,dvdTemplate;
		return Piece.View.extend({
			id: 'scene_CoSchedule',
			render: function() {
				$(this.el).html(viewTemplate);

				Piece.View.prototype.render.call(this);
				return this;
			},
			events:{
				"tap #add": "addNew",
				"tap .div-list-name":"afterNew",
				"tap .temp-list-name":"afterChooseTemp",
				"tap .period-list-name":"afterChoosePeriod",
				"tap .week-list-name":"afterChooseWeek",
				"tap .img-list-name":"afterChooseImg",
				"tap .speed-list-name":"afterChooseFanSpeed",
				"tap .item":"afterChooseLampLight",
				"tap .coloritem":"afterChooseLampColor",
				"tap .cont-edit-1":"deleteEquip",
				"tap #periodName":"setPeriod",
				"tap #save":"save",
				"tap #study":"next",
			},
			onLoadTemplate:function(){
				_TU._U.setHeader(_TU._T.CoSchedule);
				var userInfoTemplate = $(this.el).find("#schedule_inf").html();
				var userInfoHtml = _.template(userInfoTemplate, _TU._T.CoSchedule);
				$(".content").append(userInfoHtml);
			},
			onShow: function() {
				 this.onLoadTemplate();
				 $("#controlTitle").html('<i class="icon iconfont" id="modeImg"></i><span id="modeName"></span>');
				 
				 ariTemplate = _TU._T.ehome_Air.data;
				 dvdTemplate= _TU._T.ehome_CoSDVD.data;
				
				 loginId=Piece.Store.loadObject("loginId", true);
				 isFixed=0;
				 operationType=Piece.Cache.get("operation-type");
				 calType=Piece.Cache.get("calType");
				 modeIndex=Piece.Cache.get("modeIndex");
				 modesList=Piece.Store.loadObject("modesList", true);
				 if(modesList==null)modesList=new Array();
				 if(!Util.IsNullOrEmpty(calType)){
					 if(calType==0){
							$("#modeName").html(I18n.FixStage.Schedule);
							$(".setSch").attr("style","");
							if(operationType=="add"){
								$("#modeName").html(I18n.FixStage.Add);
							}
					 }
					 else 
					 { 
				         $(".setSch").attr("style","display:none");
						 if(calType==3)
						    $("#modeName").html(I18n.FixStage.ExitHome);
					     else  if(calType==4)
							$("#modeName").html(I18n.FixStage.BackHome); 
						else if(calType==1)
							$("#modeName").html(I18n.FixStage.Mode); 
						if(operationType=="add")
								$("#modeName").html(I18n.FixStage.Add);
					 }
				 }
				 else
				 {
					 new Piece.Toast(I18n.CoSchedule.noScheduleError);
					 return;
				 }
				 if(modesList.length>0&&operationType!="add")
				 {
						 for(var i=0;i<modesList.length;i++){
							 if(modesList[i].modeIndex==modeIndex){
								currentMode=modesList[i];
								$("#modeName").html(currentMode.modeName);
								break;
							 }
						 }
				 }
				 if(modeIndex>=60&&modeIndex<=62)
					 isFixed=1;
				 if(operationType=="add"||(operationType=="edit"&&isFixed==0)){
					 $("#study").attr("style","font-size:1em");
					 $("#save").attr("style","display:none");
				 }
				 else
				 {
					 $("#study").attr("style","display:none");
					 $("#save").attr("style","");
				 }
				 if(operationType=="add"){
					  currentDeviceListName="deviceTempList";
				 }
				 else{
					 currentDeviceListName="deviceExistHomeList";
				 }
				
				 //方法初始化
				 getAirStatuByCurrAndTypeFun=this.getAirStatuByCurrAndType;
				 getFanStatuByCurrAndTypeFun=this.getFanStatuByCurrAndType;
				 getNextAirStatuByCurrAndTypeFun=this.getNextAirStatuByCurrAndType;
				 setBtnColorFun=this.setBtnColor;
				 setDialogCssFun=this.setDialogCss;
				 searchCurrentDeviceFun=this.searchCurrentDevice;
				 saveToLocalFun=this.saveToLocal;
				
				//判断修改还是新增
				if(operationType=="add"){
					currentMode=Piece.Store.loadObject("tempMode", true);
					if(Util.IsNullOrEmpty(modeIndex)||currentMode==null){//新增
						 //获取场景唯一编号 modeIndex
						  modeIndex=Util.GetUnUseQJModeIndex();
						  //添加该模式到本地临时存储
						  currentMode={"loginId":loginId,"img":null,"modeIndex":modeIndex,"calType":calType,"modeName":"","isStart":0,"isFixed":0,
											"startTime":null,"endTime":null,"period":"none","week":(new Array())
									  };
						  Piece.Store.saveObject("tempMode", currentMode, true);
						  Piece.Cache.put("modeIndex", modeIndex);
						  Piece.Store.saveObject("deviceTempList", null, true);
					}else{//返回
						  currentMode=Piece.Store.loadObject("tempMode", true);
						  modeIndex=Piece.Cache.get("modeIndex");
					}
				} 
				else{
					//获取当前模式
					if(currentMode==null)
					{
						//添加该模式到本地
						  currentMode={"loginId":loginId,"img":null,"modeIndex":modeIndex,"calType":calType,"modeName":$("#modeName").html(),
						            "isStart":0,"isFixed":isFixed,
									"startTime":null,"endTime":null,"period":"none","week":(new Array())
								   };
				          
						  modesList[modesList.length]=currentMode;
						  Piece.Store.saveObject("modesList", modesList, true);
					}
					if(operationType=="edit"){
					 Piece.Store.saveObject("tempMode", currentMode, true);
				    }
				}
				
				$("#modeImg").html(currentMode.img);
				//模式图标对话框
				for(var i=0;i<Schema.ModeImgArray.length;i++)
				{
					$("<div>")
					.html('<div class="div-list" data-key="'+i+'"data-name="'+Schema.ModeImgArray[i].name+'"><div class="img-list-name"><i class="icon iconfont" style="pointer-events:none;">'+Schema.ModeImgArray[i].key+'</i></div></div>')
					.appendTo("#ModeImgList .table-rg");
				}
				modeImgDialog=new  Piece.Dialog({ 
					    autoshow: false, 
					    target:  '.content', 
					    title: I18n.CoSchedule.modeImgDialogTitle, 
					    content:  $("#ModeImgList").html(),
					},{
                        configs:[]
                    });
				if(isFixed==0&&Util.IsNullOrEmpty(currentMode.img)){
					modeImgDialog.show();
					var index=0;
					for(var i=0;i<Schema.ModeImgArray.length;i++){
					    if(currentMode.img!=null&&currentMode.img==Schema.ModeImgArray[i]){
							index=i;
						    break;
						}
					}
					setDialogCssFun(5,index);
				}
				$("#modeImg").bind("tap",function(){
					 window.setTimeout(function(){
					 modeImgDialog.show();
					 var index=0;
					for(var i=0;i<Schema.ModeImgArray.length;i++){
					    if(currentMode.img!=null&&currentMode.img==Schema.ModeImgArray[i]){
							index=i;
						    break;
						}
					}
					setDialogCssFun(5,index);},100);
				});
				//周期对话框
				for(var i=0;i<Schema.PeriodArray.length;i++)
				{
                    var choose=false;
					$("<div>")
					.html('<div class="div-list" data-key="'+Schema.PeriodArray[i].key+'"data-name="'+Schema.PeriodArray[i].name+'"><div class="period-list-name">'+Schema.PeriodArray[i].name+'</div><div class="choosedA" style="display:'+(choose?"block":"none")+'"><i class="icon iconfont" style="font-size: 20px;color:#df489c;">&#xe69a;</i></div></div>')
					.appendTo("#periodList .table-rg");
				}
				periodDialog=new  Piece.Dialog({ 
					    autoshow:  false, 
					    target:  '.content', 
					    title:  I18n.CoSchedule.periodDialogTitle, 
					    content:  $("#periodList").html(),
					},{
                        configs:[]
                    });
					
				//周重复设置
                for(var i=0;i<Schema.WeekArray.length;i++)
				{  
 			        var choose=false;
					$("<div>")
					.html('<div class="div-list" data-key="'+Schema.WeekArray[i].key+'"data-name="'+Schema.WeekArray[i].name+'"><div class="week-list-name">'+Schema.WeekArray[i].name+'</div><div class="choosedA" style="display:'+(choose?"block":"none")+'"><i class="icon iconfont" style="font-size: 20px;color:#df489c;">&#xe69a;</i></div></div>')
					.appendTo("#weekList .table-rg");
				}
				
				weekDialog=new  Piece.Dialog({ 
					    autoshow:  false, 
					    target:  '.content', 
					    title:  I18n.CoSchedule.weekDialogTitle, 
					    content:  $("#weekList").html(),
					},  { 
					    configs:  [{ 
					        title:  I18n.Common.cancel, 
					        eventName:  'cancel' ,
					    },{ 
					        title:  I18n.Common.ok, 
					        eventName:'ok' ,
					    },
					], 
					cancel:function()  { 
					             weekDialog.hide(); 
					        },
					ok:function()  { 
					              saveToLocalFun();
					              weekDialog.hide(); 
					        }
					});
					
				//开始时间、结束时间
				var beginDateSel=new Piece.VSelect({
						id : "startTime",
						preset : "datetime",
					});
				var endDateSel=new Piece.VSelect({
						id : "endTime",
						preset : "datetime"
					});	
				  
				$("#startTime").val(currentMode.startTime);
				$("#endTime").val(currentMode.endTime);
                
				$("#startTime").change(function(){
					  currentMode.startTime=$("#startTime").val();
					  if(currentMode.endTime!=null&&currentMode.endTime<currentMode.startTime){
						   new Piece.Toast(I18n.CoSchedule.timeSelectError);
					       return;
					  }
					  saveToLocalFun();
					});
				$("#endTime").change(function(){
					  currentMode.endTime=$("#endTime").val();
					   if(currentMode.startTime!=null&&currentMode.endTime<currentMode.startTime){
						   new Piece.Toast(I18n.CoSchedule.timeSelectError);
					       return;
					  }
                      saveToLocalFun();
					});
				
				//空调温度对话框
				for(var i=16;i<31;i++)
				{
					$("<div>")
					.html('<div class="div-list" data-key="'+i+'"><div class="temp-list-name">'+i+'</div></div>')
					.appendTo("#tempList .table-rg");
				}
				tempDialog=new  Piece.Dialog({ 
					    autoshow:  false, 
					    target:  '.content', 
					    title:  I18n.CoSchedule.tempDialogTitle, 
					    content:  $("#tempList").html(),
					},{
                        configs:[]
                    });
				//电风扇档位对话框	
				var arry=new Array("","low","middle","high");
				for(var i=1;i<4;i++)
				{
					$("<div>")
					.html('<div class="div-list" data-key="'+arry[i]+'"><div class="speed-list-name">'+i+'</div></div>')
					.appendTo("#fanStepList .table-rg");
				}
				fanSpeedDialog=new  Piece.Dialog({ 
					    autoshow:  false, 
					    target:  '.content', 
					    title:  I18n.CoSchedule.fanSpeedDialogTitle, 
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
						item.attr("data-key",color);
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
                        title:I18n.CoSchedule.lampColorDialogTitle, 
                        content:content
                    },
                    {
                        configs:[]
                });
				//电灯亮度对话框
				var content=$("<div>");
				for(var i=0;i<11;i++){
						var item=$("<div>").html((i*10)+"%");
						item.attr("data-key",i*10);
						item.attr("class","item");
						item.appendTo(content);
				}
			    lampLightDialog = new
                    Piece.Dialog({
                        autoshow:false,
                        target:'.content',
                        title:I18n.CoSchedule.lampLightDialogTitle, 
                        content:content
                    },
                    {
                        configs:[]
                });
				
				
				this.initView();
				this.onSlidering();//滑块
			},
			setPeriod:function(){
				periodDialog.show();
				$(".cube-dialog-subtitle .table-rg .div-list").each(function(){
							  if(currentMode.period==$(this).attr("data-key")){
								  $(this).children(".choosedA").attr("style","display:block");
							  }
							});
				var index=0;
				for(var i=0;i<Schema.PeriodArray.length;i++){
				  if(currentMode.period!=null&&currentMode.period==Schema.PeriodArray[i].key){
					  index=i;
					  break;
				  }
				}
				setDialogCssFun(4,index);
			},
		    onSlidering:function(){
				$(".main-box").swipeLeft(function(e){
				    $(e.target).parents(".main-box").css("right",100+"px");
				});
				$(".main-box").swipeRight(function(e){
					 $(e.target).parents(".main-box").css("right",0+"px");
				});
				
			},
			deleteEquip:function(e){
				var serial=$(e.target).parents(".main-box").attr("data-serial");
				var device=$(e.target).parents(".main-box").attr("data-device");
				var gatewayId=$(e.target).parents(".main-box").attr("data-gatewayId");
				currentDeviceList=Piece.Store.loadObject(currentDeviceListName, true);
			    for(var i=0;i<currentDeviceList.length;i++){
				   if(currentDeviceList[i].serial==serial
				   &&currentDeviceList[i].device==device
				   &&currentDeviceList[i].gatewayId==gatewayId
				   &&currentDeviceList[i].calType==calType
				   &&currentDeviceList[i].modeIndex==modeIndex){
					 currentDeviceList.splice(i,1);
					 Piece.Store.saveObject(currentDeviceListName, currentDeviceList,true);
					 break;
				 }
			   }
				$(e.target).parent().parent().parent().parent().remove();
			},
	        initView:function(){
				 $.each(Schema.PeriodArray, function(){     
                       if(this.key==currentMode.period)
						   $("#periodName").html(this.name==I18n.CoSchedule.noPeriod?I18n.CoSchedule.choicePeriod:this.name);
					 }); 
				currentDeviceList=Piece.Store.loadObject(currentDeviceListName, true);
				if(currentDeviceList==null)
					currentDeviceList=new Array();
				for(var j=0;j<currentDeviceList.length;j++){
					   var CoObj=currentDeviceList[j];
					   var btnhtml='';
						if(CoObj!=null&&CoObj.modeIndex==modeIndex)
						{
							btnhtml=this.getBtnHtml(CoObj);
							this.fillDevice(CoObj,btnhtml);
							this.loadViewStatus(CoObj);
						}
					}
              $(".content").append('<div class="main-box"><div class="b-flex-1" id="add"><div><i class="icon iconfont">'+_TU._T.CoSchedule.add_icon+'</i><div>'+_TU._T.CoSchedule.add+'</div></div></div></div>');					
			},
			//在离家设备列表中按序列号查找设备
			searchCurrentDevice:function(div){
				var serial=div.parents(".main-box").attr("data-serial");
				var device=div.parents(".main-box").attr("data-device");
				var gatewayId=div.parents(".main-box").attr("data-gatewayId");
				
				currentDeviceList=Piece.Store.loadObject(currentDeviceListName, true);
				if(currentDeviceList==null){
						 currentDeviceList=new Array();
						 return null;
				}
				for(var j=0;j<currentDeviceList.length;j++){
						if(currentDeviceList[j]!=null
						   &&currentDeviceList[j].serial!="undefined"
						   &&serial==currentDeviceList[j].serial
						   &&device==currentDeviceList[j].device
						   &&gatewayId==currentDeviceList[j].gatewayId
						   &&calType==currentDeviceList[j].calType
						   &&modeIndex==currentDeviceList[j].modeIndex)
						   {
							  return currentDeviceList[j];
						   }
				}
			},
			//添加新的离家设备
			addNew:function(){
				     $("#equipList .table-rg").html('');
					 equipList=Piece.Store.loadObject("DeviceList", true);
					 currentDeviceList=Piece.Store.loadObject(currentDeviceListName, true);
					 if(currentDeviceList==null)
						 currentDeviceList=new Array();
					 var ifSkip=false;
					 if(equipList!=null&&equipList.length>0)
					 {     
				            heightCount=0;
							for(var i=0;i<equipList.length;i++){
								ifSkip=false;
								if(equipList[i].device=="MagicBox"||equipList[i]==null||equipList[i].name==undefined||equipList[i].name==''){
									 continue;
								}
								for(var j=0;j<currentDeviceList.length;j++){//已经添加到该模式列表的设备不再出现在弹出框中
										if(currentDeviceList[j]!=null
										&&currentDeviceList[j].serial!="undefined"
										&&equipList[i].serial==currentDeviceList[j].serial
										&&equipList[i].device==currentDeviceList[j].device
										&&equipList[i].gatewayId==currentDeviceList[j].gatewayId
										&&currentDeviceList[j].calType==calType
										&&currentDeviceList[j].modeIndex==modeIndex
										)
										{
											ifSkip=true;
											break;
										}
									}
									if(ifSkip)continue;
								//显示
								this.fillHtml(equipList[i]);
								if(heightCount<6)//弹出层最多显示6个，否则出现滚动条
								heightCount++;
							}
					}
					if(heightCount==0)
					{
						  new Piece.Toast(I18n.CoSchedule.noDeviceError);
					      return;
					}
					deviceDialog  =  new  Piece.Dialog({ 
						    autoshow:  false, 
						    target:  '.content', 
						    title:I18n.CoSchedule.deviceDialogTitle, 
						    content:  $("#equipList").html(),
						},{
							configs:[]
						});
						 window.setTimeout(function(){
			        deviceDialog.show();
					setDialogCssFun(heightCount,0);},100);
			},
			fillHtml:function(obj){
				$("<div>")
				.html('<div class="div-list"  data-serial="'+obj.serial+'" data-device="'+obj.device+'" data-gatewayId="'+obj.gatewayId+'" ><div class="div-list-name">'+ obj.name+'</div></div>')
				.appendTo("#equipList .table-rg");
			},
			//选择设备之后
			afterNew:function(obj){
				var Item=null;
				var div=obj.srcElement.parentElement;
				var device=div.getAttribute("data-device");
				var serial=div.getAttribute("data-serial");
				var gatewayId=div.getAttribute("data-gatewayId");
			    for(var i=0;i<equipList.length;i++){
					if(serial==equipList[i].serial&&device==equipList[i].device&&gatewayId==equipList[i].gatewayId)
					{
						Item=equipList[i];
					    break;
					}
				}
				var btnhtml;
				var CoObj=null;
				switch(Item.device.toLocaleLowerCase())
				{
									case "ac00"://空调
									      CoObj={modeIndex:modeIndex,calType:calType,gatewayId:Item.gatewayId,serial:Item.serial,device:Item.device,name:Item.name,power:0,mode:"auto",temperature:25,airVolume:"auto",airDir:"middle",autoDir:0};
										  break;
									case "tv00"://电视
									      CoObj={modeIndex:modeIndex,calType:calType,gatewayId:Item.gatewayId,serial:Item.serial,device:Item.device,name:Item.name,power:0};
										  break;
									case "dvd0"://DVD
										  CoObj={modeIndex:modeIndex,calType:calType,gatewayId:Item.gatewayId,serial:Item.serial,device:Item.device,name:Item.name,power:0,play:0};
										  break;
                                    case "stb0"://机顶盒
										  CoObj={modeIndex:modeIndex,calType:calType,gatewayId:Item.gatewayId,serial:Item.serial,device:Item.device,name:Item.name,power:0};
										  break;	
                                     case "fan0"://电风扇
										  CoObj={modeIndex:modeIndex,calType:calType,gatewayId:Item.gatewayId,serial:Item.serial,device:Item.device,name:Item.name,power:0,oscillate:0,speed:"low"};
										  break;	
                                     case "ss00"://插座
										  CoObj={modeIndex:modeIndex,calType:calType,gatewayId:Item.gatewayId,serial:Item.serial,device:Item.device,name:Item.name,power:0};
										  break;
                                     case "slb0"://电灯
										   CoObj={modeIndex:modeIndex,calType:calType,gatewayId:Item.gatewayId,serial:Item.serial,device:Item.device,name:Item.name,power:0,light:0,color:"#f60f60"};
										  break;	  
				}
				if(CoObj!=null){
					btnhtml=this.getBtnHtml(CoObj);
					this.fillDevice(Item,btnhtml);

					//追加增加模块
					$(".content").find(".main-box #add").parent().remove();
					$(".content").append('<div class="main-box"><div class="b-flex-1" id="add"><div><i class="icon iconfont">'+_TU._T.CoSchedule.add_icon+'</i><div>'+_TU._T.CoSchedule.add+'</div></div></div></div>');
					
					currentDeviceList[currentDeviceList.length]=CoObj;
					Piece.Store.saveObject(currentDeviceListName, currentDeviceList, true);//添加到本地
				}
				deviceDialog.hide();
			},
			//填充离家设备到界面
			fillDevice:function(item,btnhtml){
			   var device=Util.getDevice(item.device);
				$(".content").append('<div class="main-conterner" ><div class="main-box" data-serial="'+item.serial+'" data-device="'+item.device+'" data-gatewayId="'+item.gatewayId+'"><div class="b-flex-1"><div><i class="icon iconfont">'+device.img+'</i><div>'+item.name+'</div></div></div><div class="b-flex-2">'+btnhtml+'</div><div class="cont-edit"><div><div class="cont-edit-1" >'+I18n.Common.delete+'</div></div></div></div>');
			    
			    //拖动事件
			    this.onSlidering();
				//找到当前div
				 var currDiv=null;
				 $(".main-box").each(function(){
						 if($(this).attr("data-serial")==item.serial
						   &&$(this).attr("data-device")==item.device
						   &&$(this).attr("data-gatewayId")==item.gatewayId)
						   {
						     currDiv=$(this);
					       }
				 });
				 //各种按钮绑定事件
				 var currentObj=null;
				//开关
				currDiv.find(".div-slider").bind("tap",function(){
						currentObj=searchCurrentDeviceFun($(this));
						if($(this).find("div").css("float")=="left"){
							$(this).parent().find(".view-box i").css("color",_TU._T.CoSchedule.data.onbkColor);
							$(this).css("backgroundColor",_TU._T.CoSchedule.data.powerOnbkColor);
							$(this).find("div").css("float","right");
							//打开
							currentObj.power=1;
						}
						else{
							$(this).parent().find(".view-box i").css("color",_TU._T.CoSchedule.data.powerOffColor);
							$(this).css("backgroundColor",_TU._T.CoSchedule.data.powerOffbkColor);
							$(this).find("div").css("float","left");
							//关闭
							currentObj.power=0;
						}
					    Piece.Store.saveObject(currentDeviceListName, currentDeviceList, true);
				});	
				//空调模式
				currDiv.find("[data-type=mode]").bind("tap",function(){
				        var value=$(this).attr("value");
						var statuObj=getNextAirStatuByCurrAndTypeFun("mode",value);
						if(statuObj!=null){
							$(this).attr("value",statuObj.key);
							$(this).text(statuObj.name);
						}
						//保存
						currentObj=searchCurrentDeviceFun($(this));
						if(statuObj!=null){
						currentObj.mode=statuObj.key;
						}
						Piece.Store.saveObject(currentDeviceListName, currentDeviceList, true);
				});
				//空调温度
				currDiv.find("[data-type=temperature]").bind("tap",function(){
					    var obj=$(this);
					    window.setTimeout(function(){
						tempDialog.show();
					    var index=-1;
						for(var i=16;i<31;i++){
						   if(i==parseInt(obj.attr("value"))){
							   break;
						   }
						   index++;
						}
						setDialogCssFun(6,index);},100);
						Piece.Cache.put("device",obj);
				});
				//空调风速
				currDiv.find("[data-type=airVolume]").bind("tap",function(){
				        var value=$(this).attr("value");
						var statuObj=getNextAirStatuByCurrAndTypeFun("airVolume",value);
						if(statuObj!=null){
							$(this).attr("value",statuObj.key);
							$(this).children(".text-label").html(statuObj.name);
						}
						
						//保存
					    currentObj=searchCurrentDeviceFun($(this));
						if(statuObj!=null){
						  currentObj.airVolume=statuObj.key;
						}
						Piece.Store.saveObject(currentDeviceListName, currentDeviceList, true);
				});
				//空调风向
				currDiv.find("[data-type=airDir]").bind("tap",function(){
				        var value=$(this).attr("value");
						var statuObj=getNextAirStatuByCurrAndTypeFun("airDir",value);
						if(statuObj!=null){
							$(this).attr("value",statuObj.key);
							$(this).children(".text-label").html(statuObj.name);
						}
						
						//保存
					    currentObj=searchCurrentDeviceFun($(this));
						if(statuObj!=null){
						currentObj.airDir=statuObj.key;
						}
						Piece.Store.saveObject(currentDeviceListName, currentDeviceList, true);
				});
				//空调是否自动扫风
				currDiv.find("[data-type=autoDir]").bind("tap",function(){
				        var value=$(this).attr("value");
						if(value==1)
						{
							$(this).attr("value",0);
							setBtnColorFun($(this));
						}
						else{
							$(this).attr("value",1);
							setBtnColorFun($(this));
						}
						//保存
						currentObj=searchCurrentDeviceFun($(this));
						currentObj.autoDir=(value==1?0:1);
						Piece.Store.saveObject(currentDeviceListName, currentDeviceList, true);
				});	
				//电风扇档位
				currDiv.find("[data-type=speed]").bind("tap",function(){
					 window.setTimeout(function(){
					    fanSpeedDialog.show();
						setDialogCssFun(3,0);},100);
						Piece.Cache.put("device",$(this));
				});
				//电风扇摇头
				currDiv.find("[data-type=oscillate]").bind("tap",function(){
				        var value=$(this).attr("value");
						if(value==1)
						{
							$(this).attr("value",0);
							setBtnColorFun($(this));
						}
						else{
							$(this).attr("value",1);
							setBtnColorFun($(this));
						}
						//保存
						currentObj=searchCurrentDeviceFun($(this));
						currentObj.oscillate=(value==1?0:1);
						Piece.Store.saveObject(currentDeviceListName, currentDeviceList, true);
				});	
				//DVD播放暂停
				currDiv.find("[data-type=dvd-play]").bind("tap",function(){
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
					    currentObj=searchCurrentDeviceFun($(this));
						currentObj.play=(value==1?0:1);
						Piece.Store.saveObject(currentDeviceListName, currentDeviceList, true);
				});
				//电灯亮度
			    currDiv.find("[data-type=light]").bind("tap",function(){
					 window.setTimeout(function(){
					    lampLightDialog.show();
						setDialogCssFun(5,0);},100);
						Piece.Cache.put("device",$(this));
					
				});
				//电灯颜色
				currDiv.find("[data-type=color]").bind("tap",function(){
					 window.setTimeout(function(){
					    lampColorDialog.show();
						setDialogCssFun(3,0);},100);
						Piece.Cache.put("device",$(this));
				});
				
			},
	        afterChoosePeriod:function(obj){
				var Item=null;
			    var period=obj.srcElement.parentElement.getAttribute("data-key");
				var name=obj.srcElement.parentElement.getAttribute("data-name");
				$("#periodName").html(name);
				periodDialog.hide();
				//保存到本地
				currentMode.period=period;
				saveToLocalFun();
				//如果选择每周则弹出周重复设置
				if(period=="week"){
					weekDialog.show();
					var index=0;
					for(var i=0;i<currentMode.week.length;i++){
					   $(".cube-dialog-subtitle .table-rg .div-list").each(function(){
							  if(currentMode.week[i]==$(this).attr("data-key")){
								  $(this).children(".choosedA").attr("style","display:block");
							  }
							});
				   }
				   for(var i=0;i<Schema.WeekArray.length;i++){ 
				     if(currentMode.week.length<=0)break;
				     if(currentMode.week.sort()[0]==Schema.WeekArray[i].key){
						 index=i;
						 break;
					 }
				   }
				   setDialogCssFun(5,index);
				}
				else{//清空该模式的周设置
					currentMode.week=(new Array());
					saveToLocalFun();
				}
				
			},
			afterChooseWeek:function(obj){
				var week=obj.srcElement.parentElement.getAttribute("data-key");
				if(obj.srcElement.parentElement.children[1].getAttribute("style")=="display:none"){
				     obj.srcElement.parentElement.children[1].setAttribute("style","display:block");
					 currentMode.week[currentMode.week.length]=week;
				}
				else{
					 obj.srcElement.parentElement.children[1].setAttribute("style","display:none");
					 for(var i=0;i<currentMode.week.length;i++)
					 {
						 if(currentMode.week[i]==week)
							 currentMode.week.splice(i,1);
					 }
				}
			},
			afterChooseImg:function(obj){
				var object=obj.srcElement.parentElement;
				var index=object.getAttribute("data-key");
				var Img=Schema.ModeImgArray[index].key;
				currentMode.img=Img;
				saveToLocalFun();
				$("#modeImg").html(Img);
				modeImgDialog.hide();
			},
			afterChooseTemp:function(obj){
				var Item=null;
			    var temp=obj.srcElement.parentElement.getAttribute("data-key");
				var device=Piece.Cache.get("device");
			    device.attr("value",temp);
				device.html(temp+"℃");
				tempDialog.hide();
				
				//保存
				currentObj=searchCurrentDeviceFun(device);
				currentObj.temperature=temp;
				Piece.Store.saveObject(currentDeviceListName, currentDeviceList, true);
		    },
		    afterChooseFanSpeed:function(obj){
			    var Item=null;
			    var step=obj.srcElement.parentElement.getAttribute("data-key");
				var device=Piece.Cache.get("device");
			    device.attr("value",step);
				var statuObj=getFanStatuByCurrAndTypeFun("speed",step);
				if(statuObj!=null)
				device.html(statuObj.name);
			    fanSpeedDialog.hide();
				//保存
				currentObj=searchCurrentDeviceFun(device);
				currentObj.speed=step;
				Piece.Store.saveObject(currentDeviceListName, currentDeviceList, true);
		    },
			afterChooseLampLight:function(obj){
			    var Item=null;
			    var light=obj.srcElement.getAttribute("data-key");
				var device=Piece.Cache.get("device");
			    device.attr("value",light);
				device.html(light+"%");
				lampLightDialog.hide();
				
				//保存
				currentObj=searchCurrentDeviceFun(device);
				currentObj.light=light;
				Piece.Store.saveObject(currentDeviceListName, currentDeviceList, true);
			},
			afterChooseLampColor:function(obj){
				var Item=null;
			    var color=obj.srcElement.getAttribute("data-key");
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
				currentObj=searchCurrentDeviceFun(device);
				currentObj.color=color;
				Piece.Store.saveObject(currentDeviceListName, currentDeviceList, true);
			},
		    getAirStatuByCurrAndType:function(type,curr){
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
			},
			getFanStatuByCurrAndType:function(type,curr){
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
			},
			getNextAirStatuByCurrAndType:function(type,curr){  
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
			},
  	        setBtnColor:function(obj){
				if(obj.css("color")=="rgb(255, 255, 255)"){
							obj.css("backgroundColor","");
							obj.css("color",_TU._T.CoSchedule.data.offColor);
							obj.find("i").css("color",_TU._T.CoSchedule.data.offColor);
							//关闭
						}else{
							obj.css("backgroundColor",_TU._T.CoSchedule.data.onbkColor);
							obj.css("color",_TU._T.CoSchedule.data.onColor);
							obj.find("i").css("color",_TU._T.CoSchedule.data.onColor);
							//打开
						}
			},
			setDialogCss:function(num,index){
				    $(".cube-dialog-subtitle").attr("class","cube-dialog-subtitle1");
					$(".cube-dialog-subtitle1").css("height",num*60);
					$(".cube-dialog").css("margin-top","80px");
					$(".cube-dialog").css("top","0px");
					$(".btn").first().css("background-color",_TU._T.dialog_Style.cancelColor);
					$(".ui-header").css("background-color",_TU._T.dialog_Style.backColor);
					$(".btn").last().css("background-color",_TU._T.dialog_Style.backColor);
					$(".cube-dialog-subtitle1").scrollTop(index*60);//滚动条定位
					$(".cube-dialog-subtitle").scrollTop(index*60);
			},
		    //获取各种按钮html
		    getBtnHtml:function(CoObj){
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
									      btnhtml='<div class="b-flex" data-type="open" value="'+CoObj.power+'"><div class="div-slider"><div class="div-slidering"></div></div><div class="text-label" style="font-size:10px">'+I18n.CoSchedule.power+'</div></div>';
										  break;	
                                     case "fan0"://电风扇
									      btnhtml='<div class="b-flex" data-type="open" value="'+CoObj.power+'"><div class="div-slider"><div class="div-slidering"></div></div><div class="text-label" style="font-size:10px">'+I18n.CoSchedule.power+'</div></div>';
										  btnhtml+='<div data-type="oscillate" value="'+CoObj.oscillate+'"><i class="icon iconfont">&#xe6a1;</i><div class="text-label" style="font-size:10px">'+I18n.CoSchedule.oscillate+'</div></div>';
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
				}
				return btnhtml;
			},
			loadViewStatus:function(item){
				//找到当前div
				 var currentDiv=null;
				 $(".main-box").each(function(){
						 if($(this).attr("data-serial")==item.serial
						   &&$(this).attr("data-device")==item.device
						   &&$(this).attr("data-gatewayId")==item.gatewayId)
						   {
						     currentDiv=$(this);
					       }
				 });
				 
				//开关
				var obj=currentDiv.find(".div-slider");
				if(item.power==1){
						obj.parent().find(".view-box i").css("color",_TU._T.CoSchedule.data.onbkColor);
						obj.css("backgroundColor",_TU._T.CoSchedule.data.powerOnbkColor);
						obj.find("div").css("float","right");
						//打开
				}
				else{
						obj.parent().find(".view-box i").css("color",_TU._T.CoSchedule.data.powerOffColor);
						obj.css("backgroundColor",_TU._T.CoSchedule.data.powerOffbkColor);
						obj.find("div").css("float","left");
						//关闭
				}
				
				//空调模式
				obj=currentDiv.find("[data-type=mode]");
				var statuObj=getAirStatuByCurrAndTypeFun("mode",item.mode);
				obj.attr("value",item.mode);
				if(statuObj!=null)
				 obj.text(statuObj.name);
				
				//空调温度
				obj=currentDiv.find("[data-type=temperature]");
				obj.attr("value",item.temperature);
				obj.text(item.temperature+"℃");
				
				//空调风速
				obj=currentDiv.find("[data-type=airVolume]");
				var statuObj=getAirStatuByCurrAndTypeFun("airVolume",item.airVolume);
				obj.attr("value",item.airVolume);
				if(statuObj!=null)
					obj.children(".text-label").html(statuObj.name);
						
				//空调风向
				obj=currentDiv.find("[data-type=airDir]");
				var statuObj=getAirStatuByCurrAndTypeFun("airDir",item.airDir);
				obj.attr("value",item.airDir);
				if(statuObj!=null)
					obj.children(".text-label").html(statuObj.name);
				
				//空调是否自动扫风
				obj=currentDiv.find("[data-type=autoDir]");
				if(item.autoDir==1){
					 obj.attr("value",1);
					 obj.css("backgroundColor",_TU._T.CoSchedule.data.onbkColor);
					 obj.css("color",_TU._T.CoSchedule.data.onColor);
					 obj.find("i").css("color",_TU._T.CoSchedule.data.onColor);
				}
				else{
					  obj.attr("value",0);
					  obj.css("backgroundColor","");
					  obj.css("color",_TU._T.CoSchedule.data.offColor);
					  obj.find("i").css("color",_TU._T.CoSchedule.data.offColor);
				}
						
				//电风扇档位
				obj=currentDiv.find("[data-type=speed]");
				obj.attr("value",item.speed);
				var statuObj=getFanStatuByCurrAndTypeFun("speed",item.speed);
				if(statuObj!=null)
				obj.text(statuObj.name);
						
				
				//电风扇摇头
				obj=currentDiv.find("[data-type=oscillate]");
				if(item.oscillate==1){
						obj.attr("value",1);
						obj.css("backgroundColor",_TU._T.CoSchedule.data.onbkColor);
					    obj.css("color",_TU._T.CoSchedule.data.onColor);
					    obj.find("i").css("color",_TU._T.CoSchedule.data.onColor);
				}
				else{
						obj.attr("value",0);
						obj.css("backgroundColor","");
					    obj.css("color",_TU._T.CoSchedule.data.offColor);
					    obj.find("i").css("color",_TU._T.CoSchedule.data.offColor);
				}
				
				//DVD播放暂停
				obj=currentDiv.find("[data-type=dvd-play]");
				var value=$(this).attr("value");
				if(item.play==1)
				{
					obj.attr("value",1);
					obj.children(".icon").html(dvdTemplate.stop_icon);
					obj.children(".text-label").html(I18n.CoSchedule.play);
				}
				else{
					  obj.attr("value",0);
					  obj.children(".icon").html(dvdTemplate.play_icon);
					  obj.children(".text-label").html(I18n.CoSchedule.stop);
				}
				
			    //电灯亮度
				obj=currentDiv.find("[data-type=light]");
				obj.attr("value",item.light);
				obj.text(item.light+"%");
				
				//电灯颜色
				obj=currentDiv.find("[data-type=color]");
				obj.attr("value",item.color);
				if(item.color=="auto")
				{
					obj.css("backgroundColor","");
					obj.html("auto");
				}
				else{
					obj.css("backgroundColor","#"+item.color);
					obj.html("");
				}
			},
			saveToLocal:function(){
				if(operationType=="add"||(operationType=="edit"//&&isFixed==0
				)){
									 Piece.Store.saveObject("tempMode", currentMode, true);
								  }
								  else{
					                  Piece.Store.saveObject("modesList", modesList, true);
								  }
			},
			checkIfAddDevice:function(){
				var flag=false;
				for(var j=0;j<currentDeviceList.length;j++){//一组网关发一组命令
						        if(modeIndex!=currentDeviceList[j].modeIndex)continue;
								else{
							        flag=true;
									break;
								}
				}
				return flag;
			},
			next:function(){
				  if(!this.checkIfAddDevice()){
							 new Piece.Toast(I18n.CoSchedule.withNoDeviceError);
					         return;
				  }
				  Piece.Cache.put("modeIndex",modeIndex);
				  Backbone.history.navigate("scene/CoSetName", {trigger: true});
				  
			},
			//发命令
		    save:function(){
				 if(!this.checkIfAddDevice()){
							 new Piece.Toast(I18n.CoSchedule.withNoDeviceError);
					         return;
				 }
				 var CoObj;
				 var order="";
				currentDeviceList=Piece.Store.loadObject(currentDeviceListName, true);
				if(currentDeviceList==null){
						 currentDeviceList=new Array();
						 return;
				}
				var gatewayIds=new Array();
				for(var j=0;j<currentDeviceList.length;j++){//把不同的网关放到数组
			  	    if(calType==currentDeviceList[j].calType&&gatewayIds.indexOf(currentDeviceList[j].gatewayId)<0)
				       gatewayIds[gatewayIds.length]=currentDeviceList[j].gatewayId;
					}
				var orders=new Array();
				for(var i=0;i<gatewayIds.length;i++)
				{        
    			          orders=new Array();
					      CoObj=null;
						  for(var j=0;j<currentDeviceList.length;j++){//一组网关发一组命令
						        if(modeIndex!=currentDeviceList[j].modeIndex)continue;
						        if(gatewayIds[i]!=currentDeviceList[j].gatewayId)continue;
							    CoObj=currentDeviceList[j];
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
														+"#method=pressKey#key=power"
												  break;
											case "dvd0"://DVD
												 order="#distModule=DVD0#distSerial="+CoObj.serial
														+"#method=pressKey#key=power"
														if(CoObj.power==1)
														{
														  order+="#play=1"
														}
												  break;
											case "stb0"://机顶盒
												 order="#distModule=STB0#distSerial="+CoObj.serial
														+"#method=pressKey#key=power"
												  break;	
											 case "fan0"://电风扇
												order="#distModule=FAN0#distSerial="+CoObj.serial
														+"#method=pressKey#key=power"
														if(CoObj.power==1)
														{
															order=order
															+"#oscillate=1"
															+"#speed="+CoObj.speed
														}
												  break;	
											 case "ss00"://插座
												   order="#distModule=SS00#distSerial="+CoObj.serial
														 +"#method=pressKey#key=power"
												  break;
											 case "slb0"://电灯
													order="#distModule=SLB0#distSerial="+CoObj.serial
														+"#method=pressKey#key=power"
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
						SocketUtil.QJSetModeNew(gateIndex,modeIndex,gatewayIds[i],calType,orders,currentMode);
				}
			}
		,
		
		}); 

	});