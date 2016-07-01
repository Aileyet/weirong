define(['text!devicemanage/SeAddZigBee.html',"zepto","../base/openapi",'../base/util',"../base/templates/template","../base/i18nMain","../base/schema",'devicemanage/SeDevReName'],
	function(viewTemplate,$, OpenAPI, Util,_TU,I18n,Schema,SeDevReName) {
		return Piece.View.extend({
			id: 'devicemanage_SeAddZigBee',
			render: function() {
				$(this.el).html(viewTemplate);

				Piece.View.prototype.render.call(this);
				return this;
			},
			onLoadTemplate:function(){
				_TU._U.setHeader(_TU._T.seAddZigBee);
				$("#sbm").val(I18n.AddZigBee.msg1);
				$(".my-E-home-name").html(I18n.AddZigBee.msg2);
				$("#scan i").html(_TU._T.seAddZigBee.scanIcon);
			},
			events: {
			},
			onShow: function() {
				this.onLoadTemplate();//加载配置模板
				var deviceName=Piece.Cache.get("deviceName");
				var deviceType=Piece.Cache.get("deviceType");
				var gatewayId=Piece.Cache.get("gatewayId");
				if(deviceName==null||deviceName=="")
				{
						 new Piece.Toast(I18n.Common.deviceAddError);
						 return;
				}
				$("#controlTitle").html(I18n.Common.addMsg+deviceName);
					
				$("#sbm").click(function(){
					$(this).val("");
				});
				var ifBtn=false;
				var guid=Util.GenerateGuid();
				//提交魔方
				var saveDevice=function(){
					if(ifBtn==true){Piece.Toast(I18n.Common.repeatError);return;}
					ifBtn=true;
					//1.判断产品码(如果有长度，规则等要求再此判断)
					
					//2.保存到本地库
					var equipList=Piece.Store.loadObject("DeviceList", true);
                    if(equipList==null){
                        equipList=new Array();
                    }
                    var loginId = Piece.Store.loadObject("loginId", true);
                    equipList[equipList.length] = { "loginId": loginId, "serial": guid, "device": deviceType, "name": "", "gatewayId": gatewayId, "pinCode": $("#sbm").val() };
                    Piece.Store.saveObject("DeviceList", equipList, true);//保存到本地存储
					 
					//3.完成后设置ifBtn=false;
					ifBtn=false;
					
					//4.跳转到设置名称页
					Piece.Cache.put("deviceSerial",guid);
					var seDevReName = new SeDevReName();
				    seDevReName.show();	
					//Backbone.history.navigate("devicemanage/SeDevReName?prePage=SeAddZigBee", {trigger: true});
				};
				
				//二维码扫描
				$("#scan").bind("tap",function(){
					cordova.plugins.barcodeScanner.scan(
					  function (result) {							
						  $("#sbm").val(result.text);
                          saveDevice();						  
				      }, 
				      function (error) {
				          new Piece.Toast(I18n.Common.confirmBarCode);
				      },[]);
				});
				
				//提交
				$("#study").bind("tap",function(){
					var sbm=$("#sbm").val();
					 if(sbm==""||$("#sbm").val()==I18n.AddZigBee.msg1)
				     {
					   new Piece.Toast(I18n.AddZigBee.msg1);
					   return;
				     }
					saveDevice();
				});
			}
			
		}); //view define

	});