define(['text!devicemanage/SeAddMB.html',"../base/templates/template","../base/i18nMain",'devicemanage/SeDevReName'],
	function(viewTemplate,_TU,I18n,SeDevReName) {
		
		var checkMac=function(mac)
        {   
          var temp = /[A-Fa-f0-9]{2}-[A-Fa-f0-9]{2}-[A-Fa-f0-9]{2}-[A-Fa-f0-9]{2}-[A-Fa-f0-9]{2}-[A-Fa-f0-9]{2}/;
          if (!temp.test(mac))
          {
              return false;
          }
          return true;
       }
	
		return Piece.View.extend({
			id: 'devicemanage_AddMB',
			render: function() {
				$(this.el).html(viewTemplate);

				Piece.View.prototype.render.call(this);
				return this;
			},
			onLoadTemplate:function(){
				_TU._U.setHeader(_TU._T.seAddMB);
				for(var i=0;i<_TU._T.seAddMB.data.menus.length;i++){
					var userInfoTemplate = $(this.el).find("#AddMB_menus").html();
					var userInfoHtml = _.template(userInfoTemplate, _TU._T.seAddMB.data.menus[i]);
					$(".content").append(userInfoHtml);
				}
			},
			onShow: function() {
				this.onLoadTemplate();//加载配置模板
				//write your business logic here :)
			},
			events: {
				'touchstart .equip': 'SeAddMB'
			},
			SeAddMB:function(obj){
				 var id=obj.currentTarget.id;	 
				 if(id=="devicemanage/"){
					  //扫描二维码
					cordova.plugins.barcodeScanner.scan(
					function (result) {
						//var result="serial=00-11-22-33-44-55&MacAddr=00-01-43-E1-76-29";
						
						var res=result.split('&');
						if(res.length<2){
							  new Piece.Toast(I18n.Common.confirmBarCode);
							  return;
						}
						var serials=res[0].split('=');
						if(serials.length<2){
							  new Piece.Toast(I18n.Common.confirmBarCode);
							  return;
						}
						var macs=res[1].split('=');
						if(macs.length<2)
						{
							new Piece.Toast(I18n.Common.confirmBarCode);
							return;
						}
						if(checkMac(macs[1])==false){
							new Piece.Toast(I18n.Common.confirmBarCode);
							return;
						}
						var serial=serials[1];
						var mac=macs[1];
						
				        var equipList=Piece.Store.loadObject("DeviceList", true);//从本地存储获取设备列表
                        if(equipList!=null){//判断设备是否存在
				            for(var i=0;i<equipList.length;i++){
				                if (equipList[i].serial == serial && equipList[i].device == "MAGICBOX") {//判断序列号是否相同，设备已存在，则忽略.
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
				        Piece.Cache.put("gatewayId",serial);
                        Piece.Cache.put("deviceSerial",serial);
						Piece.Cache.put("deviceIndex",0);
						var obj={};
				        obj.device="MAGICBOX";
						obj.serial=serial;
				        obj.gatewayId=serial;
				        obj.fsVer="1.0";
				        obj.protocolVer="1.0";
				        obj.name = "";
				        obj.loginId = Piece.Store.loadObject("loginId", true);
				        equipList[equipList.length]=obj;
                        Piece.Store.saveObject("DeviceList", equipList, true);//保存到本地存储
						var seDevReName = new SeDevReName();
				        seDevReName.show();	
                        //Backbone.history.navigate("devicemanage/SeDevReName?prePage=SeAddMBAuto", {trigger: true});
						
				    }, 
				    function (error) {
				          new Piece.Toast(I18n.Common.confirmBarCode);
				    },[]);
				 }else{
					  Backbone.history.navigate(id, {trigger: true});
				 }
			},
			save: function () {
			    var loginId = Piece.Store.loadObject("loginId", true);
			    var c = { "loginId": loginId, name: $("#MagicName").val(), url: '#' };
				  var equipList= Piece.Store.loadObject("DeviceList", true);
                  equipList[equipList.length]=c;
				  Piece.Store.saveObject("DeviceList", equipList, true);//添加到本地
				  new Piece.Toast(I18n.Common.saveSuccess);
		          Backbone.history.navigate('devicemanage/Ehome', {trigger: true});
				  //调用api保存数据到服务器
				  //...
			},
		}); //view define

	});