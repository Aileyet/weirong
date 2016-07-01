define(['text!ehome/CoTV.html','../base/util', '../base/socketutil','../base/tooltip/tooltip',"../base/templates/template",'../base/i18nMain'],
		function(viewTemplate,Util,SocketUtil,Tooltip,_TU,I18n) {
		var gatewayId="";
		var serial="";
		var check=null;
		var CoTv=null;
		var viewInitFun,setBtnColorFun,onMenuFn,getNewCustBtnNumFun;
		var study;
		var device="TV00";
		var deviceStatus,currentDeviceStatusIndex;
		var cusBtns=new Array();
		var userKey="user";
		return Piece.View.extend({
			id: 'ehome_CoTV',
			events:{
				'touchstart .div-btn,.custom-btn-div ,#volUp,#volDown,#chUp,#chDown': 'action',
				//"touchstart #study":'onStudy',
				"touchstart #save":"save",
				"touchstart .opera":"operation",
			},
			onStudy:function(e){
				var tooltip = new Tooltip();
				tooltip.show("ehome/CoTV");
			},
			render: function() {
				$(this.el).html(viewTemplate);

				Piece.View.prototype.render.call(this);
				return this;
			},
			onLoadTemplate:function(){
				 _TU._U.setHeader(_TU._T.ehome_CoTV);//加载头部导航
				 var obj=_TU._T.ehome_CoTV.data;
				 var TemplateHtml = $(this.el).find("#ehome_CoTV_Template").html();
				 var TemplateObj = _.template(TemplateHtml, obj);
				 $(".content").html("").append(TemplateObj);
			},
			onShow: function() {
				this.onLoadTemplate();
				setBtnColorFun=this.setBtnColor;
				customerBtnHtmlFun=this.customerBtnHtml;
				getNewCustBtnNumFun=this.getNewCustBtnNum;
				onMenuFn=this.onMenu;
				viewInitFun=this.viewInit;
				
				Piece.Cache.put("operation-type",null);
				//检查
				check=this.checkValue;
				check();
					
			    //数据初始化
			    deviceStatus=Piece.Store.loadObject("DeviceStatus", true);//添加到本地
				if(deviceStatus!=null&&deviceStatus.length>0)
				{
					for(var i=0;i<deviceStatus.length;i++){
						if(deviceStatus[i].gatewayId==gatewayId&&deviceStatus[i].serial==serial&&deviceStatus[i].device==device){
							 currentDeviceStatusIndex=i;
							 CoTv= deviceStatus[i];
							 break;
						}
					}
					if(CoTv==null){
						cusBtns=new Array();
						CoTv={"gatewayId":gatewayId,"device":device,"serial":serial,"cusBtns":cusBtns};
						deviceStatus[deviceStatus.length]=CoTv;
						currentDeviceStatusIndex=0;
						Piece.Store.saveObject("DeviceStatus", deviceStatus, true);
					}
				}
				else{
					deviceStatus=new Array();
					cusBtns=new Array();
					CoTv={"gatewayId":gatewayId,"device":device,"serial":serial,"cusBtns":cusBtns};
					deviceStatus[deviceStatus.length]=CoTv;
					currentDeviceStatusIndex=0;
					Piece.Store.saveObject("DeviceStatus", deviceStatus, true);
				}
				
				//学习返回之后判断是否为编辑状态
				study=Piece.Cache.get("study");
				if(study==1){
					 $("#editTitle").attr("style","");
					 $("#controlTitle").attr("style","display:none"); 
					 $("#save").attr("style","");
					 $("#study").attr("style","display:none");
				}
                //右上角下拉菜单
			    onMenuFn();
				//状态初始化
				viewInitFun();
				
				//自定义按钮弹出框
			     EditDialog  =  new  Piece.Dialog({ 
					    autoshow:  false, 
					    target:  '.content', 
					    title:  I18n.Common.setCustomerBtnName, 
					    content:  '<input type="text" id="btnName" style="width:170px"></input>' 
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
								var name=$("#btnName").val();
								if(name==""){
									 new Piece.Toast(I18n.Common.inputMsg);
									 return;
				  				}
								 var type=Piece.Cache.get("operation-type");
								 if(type=="edit"){//修改
										 var btnId=Piece.Cache.get("btnId"); 
										 for(var i=0;i< CoTv.cusBtns.length;i++){
											 if(CoTv.cusBtns[i].id==btnId){
												 CoTv.cusBtns[i].name=name;
												 Piece.Store.saveObject("DeviceStatus", deviceStatus, true);
												 $("#"+btnId+" .btnName").text(name);
											 }
										 }
								 }
								 else{//新增
									 var num=getNewCustBtnNumFun();
									 var item={"id":userKey+num,"num":num,"name":name};
									 CoTv.cusBtns[CoTv.cusBtns.length]=item;
									 Piece.Store.saveObject("DeviceStatus", deviceStatus, true);
									 customerBtnHtmlFun(item);
									 Piece.Cache.put("operation-type",null);
									 SocketUtil.AddUserBtn(device,userKey+num);
								 }
					        },
					  can:  function()  { 
					            EditDialog.hide(); 
					        },
					}); 
			},
			checkValue:function()
			{
				     gatewayId=Piece.Cache.get("gatewayId");	
					 if(gatewayId==null||gatewayId=="")
					 {
						 new Piece.Toast(I18n.Common.noMagicBoxError);
						 return;
			    	 }
					  serial=Piece.Cache.get("serial");	
					  if(serial==null||serial=="")
				     {
						 new Piece.Toast(I18n.Common.noDeviceSeriError);
						 return;
			         }
					 var currentDevice= Util.getCurrentDevice(gatewayId,serial);
					if(currentDevice!=null){
						$('#controlTitle').html(currentDevice.name);
					}
			},
			operation:function(e){
				 var type=$(e.target).attr("data-type");
				 if(type==null)return;
				 Piece.Cache.put("operation-type",type);
				 switch(type){
					case "study":
					{
					      this.onStudy();
						  break;
					}
					case "add":
					{
						  if(CoTv.cusBtns.length>=10){
							 new Piece.Toast(I18n.Common.maxUserBtnMsg);
							 return;
						  }
					      EditDialog.show();
						  this.setDialogCss();
						  break;
					}
					case "edit":
					case "delete":
					{
						//变成编辑状态
						 $("#editTitle").attr("style","");
						 $("#controlTitle").attr("style","display:none"); 
						 $("#save").attr("style","");
						 $(".nav-wrap-right ul").removeClass("disp");//移除下拉菜单事件
						 $("#study").attr("style","display:none");
						 break;
					}
					default:
					{
						break;
					}
				}
			},
			action:function(obj){
			     var id='';
				 var order='';
				 if(obj!=null&&obj!='undefined')
				 	id=obj.srcElement.id==""?obj.srcElement.parentElement.id:obj.srcElement.id;
				 study=Piece.Cache.get("study");
				 var type=Piece.Cache.get("operation-type");
				 if(study==1){
					  SocketUtil.StudyKey(device,id);
					  if(id.indexOf(userKey)>-1){
					      Piece.Cache.put("study-name", $("#"+id+" .btnName").text()); 
					  } 
					  Piece.Cache.put("study-key",id);  
					  Piece.Cache.put("study-module",device);
					  Backbone.history.navigate("ehome/SeRemoteCopy", {
						 trigger: true
					 });
				 }
				 else if(type!=null){//自定义按钮操作
					  if(type=="edit"&&id.indexOf(userKey)>-1){
					   Piece.Cache.put("btnId",id); 
					   EditDialog.show();
					   this.setDialogCss();
					 }
					 else if(type=="delete"){
						 if(id.indexOf(userKey)>-1){
						    for(var i=0;i< CoTv.cusBtns.length;i++){
										 if(CoTv.cusBtns[i].id==id){
											 CoTv.cusBtns.splice(i,1);
											 Piece.Store.saveObject("DeviceStatus", deviceStatus, true);
											 $("#"+id).parent(".box-flex").remove();
											 SocketUtil.DeleteUserBtn(device,id);
											 break;
										 }
									 }
						  }
					 }		
				 }
				 else{//遥控
					 this.setTV(id);
				 }
			},
			save:function(){
				     $("#editTitle").attr("style","display:none");
					 $("#controlTitle").attr("style",""); 
					 $("#save").attr("style","display:none");
					 $("#study").attr("style","");
					 Piece.Cache.put("study",0);
					 Piece.Cache.put("operation-type",null);
			},
			setTV:function(id){
				if(id.indexOf(userKey)>-1)
				{
					SocketUtil.SendUserBtn(device,id);
					return;
				}
				switch(id)
				{
					case "power":
					{  
						SocketUtil.SeCoTVPower();
						break;
					}
					case "mute":
					{ 
					    SocketUtil.SeCoTVMute();
						break;
					}
					case "return":
					{ 	
 					    SocketUtil.SeCoTVReturn();
						break;
					}
					case "volUp":
					{ 	
 					    SocketUtil.SeCoTVVolUp();
						break;
					}
					case "volDown":
					{ 	
 					    SocketUtil.SeCoTVVolDown();
						break;
					}
					case "chUp":
					{ 	
 					    SocketUtil.SeCoTVChUp();
						break;
					}
					case "chDown":
					{ 	
 					    SocketUtil.SeCoTVChDown();
						break;
					}
					case "source":
					{ 	
 					    SocketUtil.SeCoTVSource();
						break;
					}
					default:"";
				}
			},
			//根据获取到的设备值设置设备属性
			viewInit:function()
			{
						//自定义按钮
                        if(CoTv.cusBtns.length>0){
							for(var i=0;i<CoTv.cusBtns.length;i++){
								customerBtnHtmlFun(CoTv.cusBtns[i]);
							}
						}		
			},
			setBtnColor:function(on,obj){
			    if(on){
			               obj.css("backgroundColor",_TU._T.ehome_CoTV.data.onbkColor);
						   obj.find("i").css("color",_TU._T.ehome_CoTV.data.onColor);
						   obj.css("color",_TU._T.ehome_CoTV.data.onColor);
			    }else{
					       obj.css("backgroundColor",_TU._T.ehome_CoTV.data.offbkColor);
						   obj.find("i").css("color",_TU._T.ehome_CoTV.data.offColor);
						   obj.css("color",_TU._T.ehome_CoTV.data.offColor);
				}
		    },
		    onMenu:function(){
				$(".nav-wrap-right a").on("tap",function(e){
					$(e.target).parent().find("ul").toggleClass("disp");
					e.stopPropagation();
				});
				
				$(document).ready(function(){
			        $("*").on("tap",function (event) {
			            if (!$(this).hasClass("react")){
			                $(".nav-wrap-right ul").removeClass("disp");
			            }  
			        });
			    });
			},
			setDialogCss:function(){
				$(".btn").first().css("background-color",_TU._T.dialog_Style.cancelColor);
				$(".ui-header").css("background-color",_TU._T.dialog_Style.backColor);
				$(".btn").last().css("background-color",_TU._T.dialog_Style.backColor);
			},
			customerBtnHtml:function(obj){
					var lastElement=$('.control-btn-container-custom')[$('.control-btn-container-custom').length-1];
					if(lastElement!=null&&lastElement!=undefined&&lastElement.children.length<3){
						$(lastElement)
						.append('<div class="box-flex"><div class="custom-btn-div" id="'+obj.id+'"><span class="btnName">'+obj.name+'</span></div></div>');
					}
					else{
						$('.control-btn')
						.append('<div class="control-btn-container-custom box-flex"><div class="box-flex"><div class="custom-btn-div" id="'+obj.id+'"><span class="btnName">'+obj.name+'</span></div></div></div>');
					}
			},
            getNewCustBtnNum:function(){//自定义按钮最多10个，user0-user9
	             var ishave=false;
			     for(var i=0;i<9;i++){
					  ishave=false;
					  for(var j=0;j<9;j++)
						   if(CoTv.cusBtns[j]!=null&&CoTv.cusBtns[j].num==i){
							   ishave=true;
							   break;
						   }
					if(!ishave)return i;
			   }
		   },
		});

	});