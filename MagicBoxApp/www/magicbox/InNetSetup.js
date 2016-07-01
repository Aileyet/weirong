define(['text!magicbox/InNetSetup.html','../base/util', '../base/socketutil','../knobKnob/knobKnob.zepto',"../base/templates/template","../base/i18nMain",],
	function(viewTemplate,Util,SocketUtil,knobKnob,_TU,I18n) {
		var gatewayId="";
		var serial="0000";
		var check=null;
		var isIP=null;
		var string2HexStr=null;
		var socketChange='';
		var requestType='networkSettings';
		return Piece.View.extend({
			id: 'magicbox_InNetSetup',
			events:{
				"touchstart .nav-wrap-right"   :  "onSetUpNetworkFn"	
			},
			isIP: function(ip) {
			    var reSpaceCheck = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/;  
			    if (reSpaceCheck.test(ip))  
			    {  
			        ip.match(reSpaceCheck);  
			        if (RegExp.$1<=255&&RegExp.$1>=0  
			          &&RegExp.$2<=255&&RegExp.$2>=0  
			          &&RegExp.$3<=255&&RegExp.$3>=0  
			          &&RegExp.$4<=255&&RegExp.$4>=0)  
			        {  
			            return true;   
			        }else  
			        {  
			            return false;  
			        }  
			    }else  
			    {  
			        return false;  
			    }  
			},
			checkValue:function(){
			     gatewayId=Piece.Cache.get("gatewayId");
				 if(gatewayId==null||gatewayId=="")
				 {
					 new Piece.Toast(I18n.Common.noMagicBoxError);
					 return;
		    	 }
		    },
			onSetUpNetworkFn:function(obj){
				 check();
				 if(requestType.trim()=="networkSettings"){
					 //IP地址
					 var ipAddress=$("#ipAddress").val();
					 if(ipAddress==null||ipAddress==""||!isIP(ipAddress))
				     {
						 new Piece.Toast(I18n.Common.inputValidIpError);
						 return;
			         }
					 //子网掩码
					 var netMask=$("#netMask").val();
					 if(netMask==null||netMask==""||!isIP(netMask))
				     {
						 new Piece.Toast(I18n.Common.inputValidNetMaskError);
						 return;
			         }
					 //网关
					 var gateway=$("#gateway").val();
					 if(gateway==null||gateway==""||!isIP(gateway))
				     {
						 new Piece.Toast(I18n.Common.inputValidGatewayError);
						 return;
			         }
					 //DNS
					 var dns1=$("#dns1").val();
					 if(dns1==null||dns1==""||!isIP(dns1))
				     {
						 new Piece.Toast(I18n.Common.inputValidDns1Error);
						 return;
			         }
					 
					 //获取模块工作状态回调
					 socketRspnCallBack.func0207=function(obj){
						 if(obj.command.indexOf("Rspn0000")<0){
							    new Piece.Toast(I18n.Common.magicboxUsableError);
								return;
						   }else {
		                        //设置IP地址、子网掩码、网关、DNS
								 Util.sockSendAndRecDataIntime(10000,socketChange,
										 Util.ConvertToOrder("WRJWllll        0208SYS0"+serial+"SYS00000ComdGet     &ipAddress="
						                    		+ipAddress+"&gateway="+gateway+"&netMask="+netMask+"&dns1="+dns1));
					            socketRspnCallBack.func0210=function(obj){
					            		 if(obj.command.indexOf("Rspn0000")<0){
											 new Piece.Toast(I18n.Common.setIpNetworkSuc);
											 return;
							           }
					              };
							  }
					 };  
				     //取当前设备支持的各个功能模块及其工作状态
					 Util.sockSendAndRecDataIntime(10000,socketChange,
							 Util.ConvertToOrder("WRJW0038        0207SYS00000SYS00000ComdGet     &device"));
				 }
				 if(requestType.trim()=="wifiSettings"){
					 //网络模式
					 var mode='AP';
					 var SSID=$("#ssid").val();
					 if(SSID==null||SSID=="")
				     {
						 new Piece.Toast(I18n.Common.inputSSID);  
						 return;
			         }
					 var password=$("#password").val();
					 //密码
					 if(password==null||password=="")
				     {
						 new Piece.Toast(I18n.Common.inputPassword);   
						 return;
			         }	
					 //模式
					 if($(".icon.iconfont.checked-i").siblings().val().trim()==I18n.magicbox_InNetSetup.relay ){
						 mode='ST';
					 }else{
						 mode='AP';
					 }
					 alert($(".icon.iconfont.checked-i").siblings().val().trim());
					 //取当前设备支持的各个功能模块及其工作状态
					 Util.sockSendAndRecDataIntime(10000,socketChange,
							 Util.ConvertToOrder("WRJW0038        0209SYS00000SYS00000ComdGet     &device"));
					 //获取模块工作状态回调
					 socketRspnCallBack.func0209=function(obj){
						 if(obj.command.indexOf("Rspn0000")<0){
							    new Piece.Toast(I18n.Common.magicboxUsableError);
								return true;
						   }else {
								for(var arr in obj){
									if(arr.indexOf("WIFI")>-1){//加载所有模块
										if(obj[arr]=='unset'){
											var moduleN=arr.substr(0,4);
											var moduleS=arr.substr(4,4);
											//增加WIFI模块
											 Util.sockSendAndRecDataIntime(10000,socketChange,
													 Util.ConvertToOrder("WRJWllll        0211WIFI0000WIFI0000ComdAddD    &module="+moduleN+"&serial="+moduleS));
											 socketRspnCallBack.func0211=function(obj){
												 if(obj.command.indexOf("Rspn0000")<0){
													 new Piece.Toast(c);
													 return false;
									             }else{
									            	 socketRspnCallBack.func0212=function(obj){
									            		 if(obj.command.indexOf("Rspn0000")<0){
															 new Piece.Toast(I18n.Common.setModeSSIDPasswordSuc);
															 return false;
											              }
									            	  };
									            	//设置模式、SSID、密码
													 Util.sockSendAndRecDataIntime(10000,socketChange,
															 Util.ConvertToOrder("WRJWllll        0212SYS00000SYS00000ComdSet    &mode="+mode+"&localSSID="+SSID+"&localPwd="+password));
									             }
											 };
										}
								     }
							   }
						  }
					 };   
				 }
			},
			render: function() {
				$(this.el).html(viewTemplate);
				Piece.View.prototype.render.call(this);
				return this;
			},
			onLoadTemplate:function(){
				_TU._U.setHeader(_TU._T.magicbox_InNetSetup);//加载头部导航
				var me = this;
				var inNetSetupTemplate = $(me.el).find("#inNetSetupTemplate").html();
				var inNetSetupHtml= _.template(inNetSetupTemplate, _TU._T.magicbox_InNetSetup.data);
				$("#content").append(inNetSetupHtml);
			},
			onShow: function() {
				this.onLoadTemplate();
				this.radioSwitch();
			    check=this.checkValue;
				check();
				socketChange="/exchange/magicbox.exchange/magicbox."+gatewayId;
				isIP=this.isIP;
			},
			radioSwitch:function(){
				//选择路由器  把IP地址、子网掩码、网关、DNS隐藏掉
				$(".network-model > div:nth-child(2) > div:nth-child(1) > i , .network-model > div:nth-child(2) > div:nth-child(1)").on("touchstart",function(e){
					$(".network-model > div:nth-child(2) > div:nth-child(1) > i").addClass("checked-i").html("&#xe68c;");
					$(".network-model > div:nth-child(2) > div:nth-child(2) > i").removeClass("checked-i").html("&#xe68b;");
					$(".network-settings").css('display','');
					$(".wifi-settings").css('display','none');
					requestType="networkSettings";
				});
				//选择中继
				$(".network-model > div:nth-child(2) > div:nth-child(2) > i , .network-model > div:nth-child(2) > div:nth-child(2)").on("touchstart",function(e){
					$(".network-model > div:nth-child(2) > div:nth-child(2) > i").addClass("checked-i").html("&#xe68c;");
					$(".network-model > div:nth-child(2) > div:nth-child(1) > i").removeClass("checked-i").html("&#xe68b;");
					$(".wifi-settings").css('display','');
					$(".network-settings").css('display','none');
					requestType="wifiSettings";  
				});
			},
		}); //view define
	});