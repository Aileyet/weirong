define(['text!devicemanage/SeAddMBAuto.html',"zepto","../base/openapi",'../base/util',"../base/templates/template","../base/i18nMain",'devicemanage/SeDevReName'],
	function(viewTemplate, $, OpenAPI, Util,_TU,I18n,SeDevReName) {
		return Piece.View.extend({
			id: 'devicemanage_SeAddMBAuto',
			render: function() {
				$(this.el).html(viewTemplate);

				Piece.View.prototype.render.call(this);
				return this;
			},
			onLoadTemplate:function(){
				_TU._U.setHeader(_TU._T.seAddMBAuto);
				var userInfoTemplate = $(this.el).find("#setName_inf").html();
				var userInfoHtml = _.template(userInfoTemplate, _TU._T.seAddMBAuto);
				$(".content").append(userInfoHtml);
			},
			events: {
			},
			onShow: function() {
			this.onLoadTemplate();//加载配置模板
			
			udptransmit.initialize(4322);//监听
			udptransmit.onReceive(function(rmsg){
				
			    eval("var robj="+rmsg);
			    var obj=Util.udpToObject(robj.message);
				var equipList=Piece.Store.loadObject("DeviceList", true);//从本地存储获取设备列表
                if(equipList!=null){//判断设备是否存在
				   for(var i=0;i<equipList.length;i++){
					  if(equipList[i].serial==obj.serial){//判断序列号是否相同，设备已存在，则忽略
					      if(equipList[i].name==""){
							  equipList.splice(i,1);
						  }
						  else{
					         Piece.Toast(I18n.Common.deviceIsExitsError);
                             return;
						  }
                      }
                   }
				}else{
                   equipList=new Array();
                }
                //跳转到修改名称(存储参数)
				Piece.Cache.put("deviceName",I18n.magicbox.name);
				Piece.Cache.put("gatewayId",obj.serial);
                Piece.Cache.put("deviceSerial",obj.serial);
				Piece.Cache.put("deviceIndex",0);
				var obj2={};
				obj2.device="MAGICBOX";
				obj2.serial=obj.serial;
				obj2.gatewayId=obj.serial;
				obj2.fsVer="1.0";
				obj2.protocolVer="1.0";
				obj2.name = "";
			    obj2.loginId = Piece.Store.loadObject("loginId", true),
				equipList[equipList.length]=obj2;
                Piece.Store.saveObject("DeviceList", equipList, true);//保存到本地存储
				
				var seDevReName = new SeDevReName();
				seDevReName.show();	
                //Backbone.history.navigate("devicemanage/SeDevReName?prePage=SeAddMBAuto", {trigger: true});
			},function(robj){
			   Piece.Toast(I18n.Common.addMbAutoError);
			});
			udptransmit.sendMessage("255.255.255.255",4321,"WRJW0044        0000                ComdDscv    &IP&PORT=4322");//发送消息
			}
		}); //view define

	});