define(['text!ehome/CoSwitch.html',"zepto", "../base/openapi", '../base/util','../base/socketutil',"../base/templates/template",'../base/i18nMain'],
	function(viewTemplate, $, OpenAPI, Util,SocketUtil,_TU,I18n) {
		
		var cstore={"switch":"off","timeswitch":"off","time":(new Date()+"").split(" ")[4]};
	
	    var initView=function(){
			if(cstore.switch=="on"){
					   $(".swich-main").find("div[class=line]").css("backgroundColor",_TU._T.Color.checkbarColor);
					   $(".swich-main").find("i").css("color",_TU._T.Color.checkbarColor);
					   $(".swich-main").find("span").html("ON");
			}
			else{
					   $(".swich-main").find("div[class=line]").css("backgroundColor",_TU._T.Color.barColor);
					   $(".swich-main").find("i").css("color",_TU._T.Color.barColor);
					   $(".swich-main").find("span").html("OFF");
			}
			
			if(cstore.timeswitch=="on"){
				$(".btnTime").css("background",_TU._T.Color.checkbarColor);
				$(".btnTime").find("i").css("color",_TU._T.Color.iconColor);
				$(".btnTime").css("color",_TU._T.Color.iconColor);
			}
			else{
				$(".btnTime").css("backgroundColor",_TU._T.Color.barColor);
				$(".btnTime").find("i").css("color",_TU._T.Color.textColor);
				$(".btnTime").css("color",_TU._T.Color.iconColor);
			}
		}
		
		return Piece.View.extend({
			id: 'ehome_CoSwitch',
			
			render: function() {
				$(this.el).html(viewTemplate);
				Piece.View.prototype.render.call(this);
				return this;
			},
			events:{
			},
			onLoadTemplate:function(){
				_TU._U.setHeader(_TU._T.ehome_CoSwitch);//加载头部导航
				var obj=_TU._T.ehome_CoSwitch.data;
				var TemplateHtml = $(this.el).find("#ehome_CoSwitch_Template").html();
				var TemplateObj = _.template(TemplateHtml, obj);
				$(".btns").html("").append(TemplateObj);
				$("#swich-img-id").html(obj.icon);
				$("#swich-img-id").parent().find("span").text(obj.off);
			},
			onShow: function() {	
				//write your business logic here :)
				
				this.onLoadTemplate();
				
				this.checkValue();
				
				$(".swich-main").bind("touchstart",function(){
					if(cstore.switch=="off"){
					   cstore.switch="on";
					   initView();
					   SocketUtil.SeZigbeeSwitch("on");
					}
					else{
					   cstore.switch="off";
					   initView();
					   SocketUtil.SeZigbeeSwitch("off");
					}
				});
				
				$(".btnTime").bind("touchstart",function(){
					if(cstore.timeswitch=="on"){
						cstore.timeswitch="off";
					    initView();
						SocketUtil.SeZigbeeTimeSwitch(cstore.time,"off");
					}else{
						//打开定时
						window.plugins.datePicker.show({date: new Date(),mode: 'time'}, function(date){
							var time=(date+"").split(' ')[4];
							cstore.time=time;
							cstore.timeswitch="off";
					        initView();
							SocketUtil.SeZigbeeTimeSwitch(cstore.time,"on");
						}, function(data){
						});
					}
				});
				
				$(".btnHome").bind("touchstart",function(){
					new Piece.Toast(I18n.Common.functionUnable);
				});
				

				socketRspnCallBack.func003d=function(obj){
					cstore.timeswitch=obj.enable=="1"?"on":"off";
					cstore.time=obj.startTime;
					initView();
				}
				socketRspnCallBack.func0035=function(obj){
					cstore.switch=obj.switch;
					initView();
				}
				SocketUtil.GeZigbeeSwitch();//获取开关状态
				SocketUtil.GeZigbeeSwitchTime();
				
			},
			checkValue:function()
			{
				     var gatewayId=Piece.Cache.get("gatewayId");	
					 if(gatewayId==null||gatewayId=="")
					 {
						 new Piece.Toast(I18n.Common.noMagicBoxError);
						 return;
			    	 }
					  var serial=Piece.Cache.get("serial");	
					  if(serial==null||serial=="")
				     {
						 new Piece.Toast(I18n.Common.noDeviceSeriError);
						 return;
			         }
					 
					  var currentDevice = Util.getCurrentDevice(gatewayId, _TU._T.ehome_CoSwitch.device, serial);
					if(currentDevice!=null){
						$('#controlTitle').html(currentDevice.name);
					}
			},
		}); //view define

	});