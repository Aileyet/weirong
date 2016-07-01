define(['text!magicbox/StCharger.html','../base/util','../knobKnob/knobKnob.zepto',"../base/templates/template",'../base/socketutil',"../base/i18nMain"],
	function(viewTemplate,Util,knobKnob,_TU,SocketUtil,I18n) {
		var outTimer=null;
		
		return Piece.View.extend({
			id: 'magicbox_StCharger',
			events:{
			},
			render: function() {
				$(this.el).html(viewTemplate);

				Piece.View.prototype.render.call(this);
				return this;
			},
			onLoadTemplate:function(){
				_TU._U.setHeader(_TU._T.magicbox_StCharger);//加载头部导航
				var me = this;
				var stChargerTemplate = $(me.el).find("#stChargerTemplate").html();
				var stChargerHtml= _.template(stChargerTemplate, _TU._T.magicbox_StCharger.data);
				$("#content").append(stChargerHtml);
			},
			onShow: function() {
				this.onLoadTemplate();
				$("#presentSituation").hide();
				this.getVoltage();
			},
			getVoltage:function(){

			    $("#frequency").html("");
				$(".fontColor").html(I18n.StCharger.getload);
			    var gatewayId=Piece.Cache.get("gatewayId");
			outTimer=window.setTimeout(function(){
				 $("#frequency").html("");
				$(".fontColor").html(I18n.StCharger.geterror);
			},2000);
			    
			    SocketUtil.AddNewModule("BTT0",function(){
					var model=new SocketUtil.sendModel();
				                model.gatewayId=gatewayId;
				                model.moduleId="BTT0";
				                model.moduleIndex="0000";
				                model.cmdType="Comd";
				                model.cmdCatalog="Get ";
								model.callbackFun=function(sendObj,obj){
									if(outTimer!=null)window.clearTimeout(outTimer);
									if(obj.command.indexOf("Rspn0000")<0){
										new Piece.Toast(_TU.I18n.Common.timeOut);
										return;
				  					} else{
										if(obj.command.indexOf("=")<0){
											var index = obj.command.indexOf("=");
											var voltage = obj.substring(index+1,obj.length-1);
											var val = (parseFloat(voltage) - 3.2)*100;
											$(".fontColor").html("%");
											$("#frequency").html(val);
										}
				  					}
								}
				                model.queryString={"voltage":""};
				                SocketUtil.sendMessage(model);
				});
				
			}
	}); //view define

});