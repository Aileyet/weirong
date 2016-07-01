define(['text!ehome/CoLamp.html',"zepto", "../base/openapi", '../base/util','../base/socketutil',"../base/templates/template",'../base/i18nMain'],
	function(viewTemplate, $, OpenAPI, Util,SocketUtil,_TU,I18n) {
		
		var cstore={"switch":"off","color":"auto","light":"70"};
		
		var initView=function(){
			if(cstore.switch=="off"){
				$(".div-slider").parent().find(".colamp-view-box i").css("color",_TU._T.ehome_Lamp.data.offColor);
				$(".div-slider").css("backgroundColor",_TU._T.ehome_Lamp.data.offbkColor);
				$(".div-slider").find("div").css("float","left");
			}
			else{
				$(".div-slider").parent().find(".colamp-view-box i").css("color",_TU._T.ehome_Lamp.data.onColor);
				$(".div-slider").css("backgroundColor",_TU._T.ehome_Lamp.data.onbkColor);
				$(".div-slider").find("div").css("float","right");
			}
			
			$(".div-light").html(cstore.light+"%");
			
			if(cstore.color=="auto"){
				 $(".color").css("backgroundColor","");
			}
			else{
			    $(".color").css("backgroundColor","#"+cstore.color);
			}
		}
	
	
		return Piece.View.extend({
			id: 'ehome_Lamp',
			render: function() {
				$(this.el).html(viewTemplate);

				Piece.View.prototype.render.call(this);
				return this;
			},
			onLoadTemplate:function(){
				_TU._U.setHeader(_TU._T.ehome_Lamp);//加载头部导航
				var obj=_TU._T.ehome_Lamp.data;
				var TemplateHtml = $(this.el).find("#ehome_Lamp_Template").html();
				var TemplateObj = _.template(TemplateHtml, obj);
				$(".colamp-bottom-box .table-rg").html("").append(TemplateObj);
				$(".colamp-top-box .colamp-view-box i").html(obj.icon);
			},
			events:{
			},
			onShow: function() {
				//write your business logic here :)
				this.onLoadTemplate();
				this.checkValue();
				$(".div-slider").bind("tap",function(){
					if(cstore.switch=="off"){
						cstore.switch="on";
					    initView();
						SocketUtil.SeZigbeeLamp("on");
					}
					else{
						cstore.switch="off";
					    initView();
						SocketUtil.SeZigbeeLamp("off");
					}
				});
				
				$(".div-light").bind("tap",function(){
					//弹出选择框
					var dialog=null;
					var content=$("<div>");
					for(var i=0;i<11;i++){
						var item=$("<div>").html((i*10)+"%");
						item.attr("data-light",i*10);
						item.attr("class","item");
						item.bind("tap",function(){
							cstore.light=$(this).attr("data-light");
					        initView();
							dialog.hide();
							SocketUtil.SeZigbeeLampLight(cstore.light);
						});
						item.appendTo(content);
					}
					dialog = new
                    Piece.Dialog({
                        autoshow:false,
                        target:'body',
                        title:I18n.CoSchedule.lampLightDialogTitle,
                        content:content
                    },
                    {
                        configs:[]
                    });
                    dialog.show();
				});
				
				$(".color").bind("tap",function(){
					//弹出选择框
					var dialog=null;
					var content=$("<div>");
					for(var i=0;i<5;i++){
						var color="f60f60";
						if(i==1)color="3f04dd";
						if(i==2)color="dd55ff";
						if(i==3)color="00a600";
						if(i==4)color="ffffff";
						var item=$("<div>");
						item.attr("data-color",color);
						if(color=="auto"){
						   
						}
						else{
						   item.css("backgroundColor","#"+color);
						}
						item.attr("class","coloritem");
						item.bind("tap",function(){
							cstore.color=$(this).attr("data-color");
					        initView();
							dialog.hide();
							SocketUtil.SeZigbeeLampColor(cstore.color);
						});
						item.appendTo(content);
					}
					
					dialog = new
                    Piece.Dialog({
                        autoshow:false,
                        target:'body',
                        title:I18n.CoSchedule.lampColorDialogTitle,
                        content:content
                    },
                    {
                        configs:[]
                    });
                    dialog.show();
				});
				
				
				socketRspnCallBack.func0037=function(obj){
					cstore.switch=obj.switch;
					cstore.color=obj.color;
					cstore.light=obj.light;
					initView();
				}
				SocketUtil.GeZigbeeLamp();//获取开关状态
				
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
					 
					  var currentDevice = Util.getCurrentDevice(gatewayId, _TU._T.ehome_Lamp.device, serial);
					if(currentDevice!=null){
						$('#controlTitle').html(currentDevice.name);
					}
			},
		}); //view define

	});