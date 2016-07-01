define(['zepto',"../base/openapi","sockjs",'text!magicbox/PlRealTimeVideo.html','../base/util', '../base/socketutil','../knobKnob/knobKnob.zepto',"../base/templates/template","../base/i18nMain",],
	function($,OpenAPI,SockJs,viewTemplate,Util,SocketUtil,knobKnob,_TU,I18n) {
	    //0表示内网  1表示外网
	    var isIntranet="0";
		var check=null;
		var gatewayId="";
		var serial="0000";
		var length=0;
		var socketChange='';
		var toolsShowOnTach=null;
		var showTimes=0;
		var toolsHidInTime=null;
		var brightnessInpChange=null;
		var checkIfShow=null;
		return Piece.View.extend({
			id: 'magicbox_PlRealTimeVideo',
			events:{
				"touchstart .nav-wrap-left .react"    :     "onBackUpFn",
				"touchstart .nav-wrap-right .react"    :     "onSetup",
				"touchstart #brightness"  :     "brightnessChange",
				"touchstart #contrast"  :     "contrastChange",
				"touchstart #saturability"  :     "saturabilityChange",
				"touchstart #video"  :     "toolsShowOnTach",
				"touchstart .nav-wrap-right .react"    :     "onToVideoList"
			},
			checkValue:function(){
				     gatewayId=Piece.Cache.get("gatewayId");	
					 if(gatewayId==null||gatewayId=="")
					 {
						 new Piece.Toast(I18n.Common.noMagicBoxError);
						 return;
			    	 }
			},
			onToVideoList:function(){
				Backbone.history.navigate("magicbox/VideoList", {
            		trigger: true
            	});
			},
			toolsShowOnTach:function(){
				//设置函数 过几秒调用
				$(".main-box").css('display','');
				$("#brightnessHid").css('display','none');
				$("#contrastHid").css('display','none');
				$("#saturabilityHid").css('display','none');
				toolsHidInTime();
			},
			checkIfShow:function(){
				if(showTimes>-1)$('.main-box').css('display','none');
			},
			toolsHidInTime:function(){
				showTimes--;
				//设置函数 过几秒调用
				window.setTimeout(function(){
					//-1就执行
				    if(showTimes>=-1){
				    	$('.main-box').css('display','none');
				    	showTimes=0;
				    //撤销
				    }else if(showTimes<-1){
				    	showTimes++;
				    }
				},5000); 
			},
			brightnessChange:function(e){
				$("#brightnessHid").css('display','');
				$("#brightnessHid").appendTo($("#brightness"));
				$("#contrastHid").css('display','none');
				$("#saturabilityHid").css('display','none');
				$("#brightnessVal").val($("#brightnessInp").val());
			},
			contrastChange:function(e){
				$("#contrastHid").css('display','');
				$("#contrastHid").appendTo($("#contrast"));
				$("#brightnessHid").css('display','none');
				$("#saturabilityHid").css('display','none');
			},
			saturabilityChange:function(e){
				$("#saturabilityHid").css('display','');
				$("#saturabilityHid").appendTo($("#saturability"));
				$("#contrastHid").css('display','none');
				$("#brightnessHid").css('display','none');
			},
			brightnessInpChange:function(e){
				var brightness=$("#brightnessInp").val();
				 //socketRspnCallBack.func00204=function(obj){
				 //   if(obj.command.indexOf("Rspn0000")<0){
				 //   	new Piece.Toast(I18n.Common.setCameraBrightnessFailed);
				 //   	return;
				 //   }
				 //};     
				 //设置屏幕亮度
				 //var setBrightnessOrder="WRJWllll        0204CAM0"+serial+"CAM00000ComdSet     &brightness="+brightness;
				 //setBrightnessOrder=Util.ConvertToOrder(setBrightnessOrder);
				 //Util.sockSendAndRecDataIntime(10000, socketChange, setBrightnessOrder);

				 SocketUtil.SetCam("brightness", brightness);
			},
			contrastInpChange:function(e){
				var contrast=$("#contrastInp").val();
				 //socketRspnCallBack.func00205=function(obj){
				 //   	if(obj.command.indexOf("Rspn0000")<0){
				 //   		new Piece.Toast(I18n.Common.setCameraContrastFailed);
				 //   		return;
				 //   	}
				 //};
				 //设置对比度
				 //var setContrastOrder=Util.ConvertToOrder("WRJWllll        0205CAM0"+serial+"CAM00000ComdSet     &contrast="+contrast);
				 //Util.sockSendAndRecDataIntime(10000, socketChange, Util.ConvertToOrder(setContrastOrder));

				 SocketUtil.SetCam("contrast", contrast);
			},
			saturabilityInpChange:function(e){
				var saturation=$("#saturabilityInp").val();
				//var contrast=$("#contrastInp").val();
				 //socketRspnCallBack.func00206=function(obj){
				 //   	if(obj.command.indexOf("Rspn0000")<0){
				 //   		new Piece.Toast(I18n.Common.setMagixboxCameraFailed);
				 //   		return;
				 //   	}
				 //};
				 //设置屏幕饱和度
				 //var setSaturabilityOrder=Util.ConvertToOrder("WRJWllll        0206CAM0"+serial+"CAM00000ComdSet     &saturation="+saturation);
				 //Util.sockSendAndRecDataIntime(10000, socketChange, Util.ConvertToOrder(setSaturabilityOrder));

				SocketUtil.SetCam("saturation", saturation);
			},
			onBackUpFn:function(e){
				video=null;
			},
			onSetup:function(e){
			},
			render: function() {
				$(this.el).html(viewTemplate);
				Piece.View.prototype.render.call(this);
				return this;
			},
			onLoadTemplate:function(){
				_TU._U.setHeader(_TU._T.magicbox_PlRealTimeVideo);//加载头部导航
			},
			onShow: function() {
				this.onLoadTemplate();
				check=this.checkValue;
				check();

				Piece.Cache.put("actionId",null);
				Piece.Cache.put("actionIndex", null);

				brightnessInpChange=this.brightnessInpChange;
				contrastInpChange=this.contrastInpChange;
				saturabilityInpChange=this.saturabilityInpChange;
				toolsHidInTime=this.toolsHidInTime;
				toolsShowOnTach=this.toolsShowOnTach;
				checkIfShow=this.checkIfShow;
				$("#brightnessInp").change(function(){
					$("#brightnessVal").text($("#brightnessInp").val());
					toolsHidInTime();
					brightnessInpChange();
				 });
				$("#contrastInp").change(function(){
					$("#contrastVal").text($("#contrastInp").val());
					toolsHidInTime();
					contrastInpChange();
				 });
				$("#saturabilityInp").change(function(){
					$("#saturabilityVal").text($("#saturabilityInp").val());
					toolsHidInTime();
					saturabilityInpChange();
				 });
				//socketChange="/exchange/magicbox.exchange/magicbox."+gatewayId;
				////获取模块工作状态回调
				//socketRspnCallBack.func0202=function(obj){
				//	for(var arr in obj){
				//		if(arr.indexOf("CAM0")>-1){//加载所有模块
				//			if(obj[arr]=='unset'){
				//				var moduleN=arr.substr(0,4);
				//				var moduleS=arr.substr(4,4);
				//				serial=moduleS;
				//				//添加摄像头回调
				//				socketRspnCallBack.func0203=function(obj){
				//					if(obj.command.indexOf("Rspn0000")<0){
				//						new Piece.Toast(I18n.Common.setMbVedioConnectionFailed);
				//						Piece.Cache.put("isIntranet","1");
				//						return;
				//					} else{
				//						//表示在局域网内
				//			        	Piece.Cache.put("isIntranet","0");
				//					}
				//				 }; 
				//				//添加摄像头到魔方
				//			    Util.sockSendAndRecDataIntime(10000,socketChange,Util.ConvertToOrder("WRJWllll        0203CAM0"+serial+"CAM00000ComdAddD    &module="+moduleN+"&serial="+moduleS));
				//			}else if(obj[arr]=='normal'){
				//				break;
				//			}
				//		}
				//	}
				// };
				////取当前设备支持的各个功能模块及其工作状态
				//Util.sockSendAndRecDataIntime(10000,socketChange,Util.ConvertToOrder("WRJW0038        0202SYS00000SYS00000ComdGet     &device"));
				
				SocketUtil.AddCam();

				var video = document.getElementById("video");
				//本地的视频播放 实际是网络上获取的 离开的时候释放资源
				video.src = "http://172.16.82.12:8081";
				var context = document.getElementById("canvas").getContext("2d");
				context.drawImage(video, 0, 0, 640, 480);
				
				/**
				 * 调用视频播放插件
				 * url:视频地址
				 * http://192.168.0.105:8081/
				 * 需要获取同网段魔方的IP 地址
				 */
//				VideoPlayer.play(url);
			}
		}); //view define
	});
