define(['text!ehome/CoSocket.html',"zepto", "../base/openapi", '../base/util','../base/socketutil',"../base/templates/template",'../base/i18nMain'],
	function(viewTemplate, $, OpenAPI, Util,SocketUtil,_TU,I18n) {
		
		var cstore={"switch":"off","timeswitch":"off","time":(new Date()+"").split(" ")[4]};

		
	    var initView=function(){
			if(cstore.switch=="on"){
			  $(".cosocket-top-box .div-slider").parent().find(".cosocket-view-box i").html(_TU._T.ehome_CoSocket.data.icon2);
			  $(".cosocket-top-box .div-slider").css("backgroundColor",_TU._T.Color.sliderBgColor);
			  $(".cosocket-top-box .div-slider").find("div").css("float","right");
			}
			else{
			  $(".cosocket-top-box .div-slider").parent().find(".cosocket-view-box i").html(_TU._T.ehome_CoSocket.data.icon);
			  $(".cosocket-top-box .div-slider").css("backgroundColor",_TU._T.Color.iconColor);
			  $(".cosocket-top-box .div-slider").find("div").css("float","left");
			}
			
			if(cstore.timeswitch=="on"){
				$(".bottom-box .div-slider").css("backgroundColor",_TU._T.Color.sliderBgColor);
				$(".bottom-box .div-slider").find("div").css("float","right");
				$(".spanTime").html(cstore.time);		
			}
			else{
				$(".bottom-box .div-slider").css("backgroundColor",_TU._T.Color.iconColor);
				$(".bottom-box .div-slider").find("div").css("float","left");
				$(".spanTime").html(cstore.time);
			}
		}
		
		return Piece.View.extend({
			id: 'ehome_CoSocket',
			render: function() {
				$(this.el).html(viewTemplate);

				Piece.View.prototype.render.call(this);
				return this;
		},
		onLoadTemplate:function(){
			_TU._U.setHeader(_TU._T.ehome_CoSocket);//加载头部导航
			var obj=_TU._T.ehome_CoSocket.data;
			var TemplateHtml = $(this.el).find("#ehome_CoSocket_Template").html();
			var TemplateObj = _.template(TemplateHtml, obj);
			$(".bottom-box .div-list>div").eq(0).html("").append(TemplateObj);
			$(".cosocket-top-box .cosocket-view-box i").html(obj.icon);
		},
		events:{
			},
		onShow: function() {
				this.onLoadTemplate();
				this.checkValue();
				$(".cosocket-top-box .div-slider").bind("tap",function(){//开关
					if(cstore.switch=="off"){
						//打开
						cstore.switch="on";
						initView();
						SocketUtil.SeZigbeeSocket("on");
					}
					else{
						//关闭
						cstore.switch="off";
						initView();
						SocketUtil.SeZigbeeSocket("off");
					}
				});
				
				$(".bottom-box .div-slider").bind("tap",function(){//定时
					if(cstore.timeswitch=="off"){
						var obj=$(this);
						//打开
						window.plugins.datePicker.show({date: new Date(),mode: 'time'}, function(date){
							cstore.time=(date+"").split(' ')[4];
							cstore.timeswitch="on";
						    initView();
							SocketUtil.SeZigbeeTimeSwitch(time,"on");
						}, function(data){});
					}
					else{
						cstore.timeswitch="off";
						initView();
						SocketUtil.SeZigbeeTimeSwitch(cstore.time,"off");
					}
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
				SocketUtil.GeZigbeeSocket();//获取插座状态
				SocketUtil.GeZigbeeSocketTime();//获取定时时间
				
			},
			onSlider:function(){
				$(".cosocket-top-box .div-slidering").swipeLeft(function(e){
					$(e.target).css({
						"float":"left"
					});
					$(".cosocket-top-box .div-slider").css("background-color",_TU._T.Color.iconColor);
				});
				$(".cosocket-top-box .div-slidering").swipeRight(function(e){
					$(e.target).css({
						"float":"right"
					});
					$(".cosocket-top-box .div-slider").css("background-color",_TU._T.Color.checkbarColor);
					$(".cosocket-top-box i").text(_TU._T.ehome_CoSocket.data.icon2);
				});
				
				$(".bottom-box .div-slidering").swipeLeft(function(e){
					$(e.target).css({
						"float":"left"
					});
					$(".bottom-box .div-slider").css("background-color",_TU._T.Color.iconColor);
				});
				$(".bottom-box .div-slidering").swipeRight(function(e){
					$(e.target).css({
						"float":"right"
					});
					$(".bottom-box .div-slider").css("background-color",_TU._T.Color.checkbarColor);
				});
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
					 
					  var currentDevice = Util.getCurrentDevice(gatewayId, _TU._T.ehome_CoSocket.device, serial);
					if(currentDevice!=null){
						$('#controlTitle').html(currentDevice.name);
					}
			},
		}); //view define

	});