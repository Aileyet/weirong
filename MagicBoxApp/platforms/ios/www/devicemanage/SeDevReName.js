define(['text!devicemanage/SeDevReName.html', '../base/util', '../base/socketutil', '../base/openapi', "../base/templates/template", "../base/schema", "../base/i18nMain", "../base/constant", ],
	function (viewTemplate, Util, SocketUtil, OpenAPI, _TU, Schema, I18n, Cons) {
	    var equipList = null;
	    var gatewayId = '';
	    var deviceType;
	    var autoSearchId = '';//自动搜索码
	    var loader;
	    var outTimer = null;
	    var callbackCancelFun = null;
	    var AddDeviceFun, AddDeviceAutoFun;
	    var loginId;
	    var seDevReName = Piece.View.extend({
	        id: 'myequip_DeviceName',
	        render: function () {
	            //解决重复加载的问题
	            if ($(".covering-layer").size() > 0) {
	                $(".covering-layer").remove();
	            }
	            $("body").append(viewTemplate);
	            this.closeCovering();//关闭遮盖层
	        },
	        initialize: function () {
	            this.render();
	        },
	        onLoadTemplate: function () {
	            var template = $("#SeDevReNameTemplate").html();
	            var html = _.template(template, _TU._T.Dev_Rename);
	            $(".covering-layer").html(html);
	        },
	        showFun: function (callBackCancel) {
	            callbackCancelFun = callBackCancel;
	            this.show();
	        },
	        show: function () {
	            this.onLoadTemplate();//加载配置模板
	            $(".title-mag").css("background-color", _TU._T.Color.checkbarColor);
	            $(".title-mag").css("color", "white");
	            $("#covering-btn-determine").css("background-color", _TU._T.Color.checkbarColor);
	            $("#covering-btn-determine").css("color", "white");
	            $("#covering-btn-cancle").css("background-color", _TU._T.Color.iconColor);
	            $("#covering-btn-cancle").css("color", "white");
	            var saveFunc = this.save;

	            prePage = Piece.Cache.get("prePage") == "" ? "" : "?prePage="+ Piece.Cache.get("prePage");

	            $(".covering-layer").show();

	            $("#covering-btn-cancle").on("tap", function () {
	                if (callbackCancelFun != null) { callbackCancelFun(); callbackCancelFun = null; }
	                $(".covering-layer").hide();
	            });

	            $("#covering-btn-determine").on("tap", function () {
	                saveFunc();
	            });

	            AddDeviceAutoFun = this.AddDeviceAuto;
	            AddDeviceFun = this.AddDevice;

	            $("#DeviceName").focus();
	            loginId = Piece.Store.loadObject("loginId", true);
	            autoSearchId = Piece.Cache.get("autoSearchId");
	            var deviceName = Piece.Cache.get("deviceName");
	            if (deviceName == null || deviceName == "") {
	                new Piece.Toast(I18n.Common.deviceAddError);
	                return;
	            }
	            $(".title-mag").html(I18n.Dev_Rename.title.replace("{}", deviceName));

	            gatewayId = Piece.Cache.get("gatewayId");
	            if (gatewayId == null || gatewayId == "") {
	                new Piece.Toast(I18n.Common.noMagicBoxError);
	                return;
	            }
	            if (Piece.Cache.get("deviceIndex") != null) {
	                deviceIndex = Piece.Cache.get("deviceIndex");
	                deviceType = Schema.DeviceCatg[deviceIndex].type;
	            }
	            if (deviceType == null || deviceType == "") {
	                new Piece.Toast(I18n.Common.deviceAddError);
	                return;
	            }
	            loader = new Piece.Loader({
	                autoshow: false,//是否初始化时就弹出加载控件
	                target: '.content'//页面目标组件表识
	            });
	        },
	        events: {
	            //'touchstart #study': 'save'
	        },
	        //自动匹配添加设备
	        AddDeviceAuto: function (baseCodeIndex, brandId, autoSearchId, name, module) {
	            var len = module.length;
	            module = module.toUpperCase();
	            while (len < 4) {
	                module = module + "0";
	                len++;
	            }
	            var model = new SocketUtil.sendModel();
	            model.gatewayId = gatewayId;
	            model.moduleId = "IRRC";
	            model.moduleIndex = "0000";
	            model.actionId = "IRRC";
	            model.actionIndex = "0000";
	            model.cmdType = "Comd";
	            model.cmdCatalog = "AddD";
	            model.queryString = { "brandId": brandId, "autoSearchIndex": autoSearchId, "serial": "", "name": name, "module": module };
	            model.callbackFun = function (sendObj, backObj) {
	                if (backObj.command.indexOf(Cons.Rspn_Suc) < 0) {
	                    loader.hideAll();
	                    new Piece.Toast(I18n.Dev_Rename.fail);
	                    return;
	                }
	                else {
	                        for (var arr in backObj) {
	                            if (arr.indexOf("serial") > -1) {
	                                var serial = backObj[arr].substr(0, 4);
	                                var item = {"loginId":loginId, "serial": serial, "name": name, "device": module, "gatewayId": gatewayId, "deviceId": serial };
	                                equipList[equipList.length] = item;
	                                break;
	                            }
	                        }
	                        Piece.Store.saveObject("DeviceList", equipList, true);//添加到本地
	                        window.clearTimeout(outTimer);
	                        loader.hideAll();
	                        Backbone.history.navigate('devicemanage/Ehome' + prePage, { trigger: true });
	                        $(".covering-layer").hide();
	                        //清空
	                        Piece.Cache.put("AddType", "");
	                        Piece.Cache.put("autoSearchId", "");

                           //如果增加IPTV或机顶盒，增加完成之后需要增加两个自定义key
	                        if (module == "IPTV" || module == "STB0") {
	                            Piece.Cache.put("actionId", null);
	                            Piece.Cache.put("actionIndex", null);
	                            Piece.Cache.put("serial", serial);
	                            SocketUtil.AddUserBtn(module, "tvPower");
	                            SocketUtil.AddUserBtn(module, "tvMute");
	                        }
	                }
	            }
	            SocketUtil.sendMessage(model);
	        },
	        /*新增手动添加的红外设备*/
	        AddDevice: function (brandId, modelId, name, module, isCustom) {
	            var len = module.length;
	            module = module.toUpperCase();
	            while (len < 4) {
	                module = module + "0";
	                len++;
	            }
	            var model = new SocketUtil.sendModel();
	            model.gatewayId = gatewayId;
	            model.moduleId = "IRRC";
	            model.moduleIndex = "0000";
	            model.actionId = "IRRC";
	            model.actionIndex = "0000";
	            model.cmdType = "Comd";
	            model.cmdCatalog = "AddD";
	            if (isCustom == 0) {
	                model.queryString = { "brandId": brandId, "modelId": modelId, "name": name, "serial": "", "module": module };
	            } else {
	                model.queryString = { "name": name, "serial": "", "module": module };
	            }
	            model.callbackFun = function (sendObj, backObj) {
	                if (backObj.command.indexOf(Cons.Rspn_Suc) < 0) {
	                    loader.hideAll();
	                    new Piece.Toast(I18n.Dev_Rename.fail);
	                    return;
	                }
	                else {
	                    for (var arr in backObj) {
	                        if (arr.indexOf("serial") > -1) {
	                            var serial = backObj[arr].substr(0, 4);
	                            var item = { "loginId": loginId, "serial": serial, "name": name, "device": module, "gatewayId": gatewayId, "deviceId": serial };
	                            equipList[equipList.length] = item;
	                            break;
	                        }
	                    }

	                    Piece.Store.saveObject("DeviceList", equipList, true);//添加到本地
	                    window.clearTimeout(outTimer);
	                    loader.hideAll();
	                    Backbone.history.navigate('devicemanage/Ehome' + prePage, { trigger: true });
	                    $(".covering-layer").hide();
	                    //清空
	                    Piece.Cache.put("AddType", "");
	                    Piece.Cache.put("autoSearchId", "");

	                    //如果增加IPTV或机顶盒，增加完成之后需要增加两个自定义key
	                    if (module == "IPTV" || module == "STB0") {
	                        Piece.Cache.put("serial", serial);
	                        SocketUtil.AddUserBtn(module, "tvPower");
	                        SocketUtil.AddUserBtn(module, "tvMute");
	                    }
	                }
	            }
	            SocketUtil.sendMessage(model);
	        },
	        save: function () {

	            var Name = $("#DeviceName").val();
	            if (Name == "" || $("#DeviceName").val() == I18n.Common.inputMsg) {
	                new Piece.Toast(I18n.Common.inputMsg);
	                return;
	            }
	            var socketChange = "/exchange/magicbox.exchange/magicbox." + gatewayId;
	            equipList = Piece.Store.loadObject("DeviceList", true);
	            if (equipList == null)
	                equipList = new Array();
	            for (var i = 0; i < equipList.length; i++) {
	                if (Name == equipList[i].name) {
	                    new Piece.Toast(I18n.Common.sameNameError);
	                    return;
	                }
	            }
	            var flag = false;
	            var addType = Piece.Cache.get("AddType");
	            if (addType == "zigbee") {//zigbee设备
	                /*
                         var deviceSerial=Piece.Cache.get("deviceSerial");
                         if(deviceSerial==''||deviceSerial==undefined)
                         {
                            new Piece.Toast(I18n.Common.noDeviceSeriError);
                            return;
                         }
                         for(var i=0;i<equipList.length;i++)
                         {
                             if(deviceSerial==equipList[i].serial&&deviceType==equipList[i].device&&gatewayId==equipList[i].gatewayId)
                             {
                                flag=true;
                                equipList[i].name=Name;
                                equipList[i].check=false;
                                Piece.Store.saveObject("DeviceList", equipList, true);//添加到本地
                                 //增加模块到魔方
                                socketRspnCallBack.func0100=function(obj){
                                for(var arr in obj){
                                          if(arr.indexOf(Cons.MODULE_ZB)>-1){//加载所有模块
                                                          if(obj[arr]=='normal'){
                                                                  SocketGetDeviceFun("0102",Cons.MODULE_ZB);
                                                                  break;
                                                          };
                                                          var moduleN=arr.substr(0,4);
                                                          var moduleS=arr.substr(4,4);
                                                          
                                                          //增加该模块
                                                          var model=new SocketUtil.sendModel();
                                                          model.identify="0101";
                                                          model.moduleId=Cons.MODULE_SYS;
                                                          model.moduleIndex="0000";
                                                          model.cmdType=Cons.Socket_Comd;
                                                          model.cmdCatalog=Cons.Comd_Add;
                                                          model.queryString={"module":moduleN,"serial":moduleS};
                                                          SocketUtil.sendMessage(model);
                                                  }
                                              }
                              };
                              socketRspnCallBack.func0102=function(obj){
                                      if(obj.command.indexOf(Cons.Rspn_Suc)<0){
                                          loader.hideAll();
                                          new Piece.Toast(I18n.Dev_Rename.fail);
                                          return;
                                      }
                                      else{
                                           //新增模块成功后新增设备
                                          SocketUtil.AddZigbeeDevice(Name,equipList[i].device,equipList[i].pinCode);
                                      }
                              };
                              socketRspnCallBack.func0101=function(obj){
                                      if(obj.command.indexOf(Cons.Rspn_Suc)<0){
                                          loader.hideAll();
                                          new Piece.Toast(I18n.Dev_Rename.fail);
                                          return;
                                      }
                                      else{
                                           SocketGetDeviceFun("0102",Cons.MODULE_ZB);
                                      }
                              };
                              socketRspnCallBack.func0041=function(obj){
                                      //与缓存列表中的数据pinCode进行比对，
                                      for(var arr in obj){
                                          if(arr.indexOf("SW00")>-1||arr.indexOf("SS00")>-1||arr.indexOf("SLB0")>-1){
                                                  var moduleN=arr.substr(0,4);
                                                  var moduleS=arr.substr(4,4);
                                                  var stas=obj[arr].split('#')[0];
                                                  var mac=obj[arr].split('#')[1].replace("macAddress=","");
                                                  
                                                  equipList=Piece.Store.loadObject("DeviceList", true);
                                                  if(equipList!=null){
                                                      for(var i=0;i<equipList.length;i++){
                                                          if(equipList[i].device==moduleN&&equipList[i].pinCode==mac&&stas=="normal"){
                                                              equipList.splice(i,1);//已经加载则删除掉缓存
                                                          }
                                                      }
                                                      for(var i=0;i<equipList.length;i++){
                                                         if(equipList[i].device==moduleN&&equipList[i].pinCode==mac&&stas=="unset"){//则发送添加命令
                                                              var model=new SocketUtil.sendModel();
                                                              model.identify="0941";
                                                              model.moduleId=Cons.MODULE_ZB;
                                                              model.moduleIndex="0000";
                                                              model.cmdType=Cons.Socket_Comd;
                                                              model.cmdCatalog=Cons.Comd_Add;
                                                              model.queryString={"module":moduleN,"name":equipList[i].name,"serial":moduleS};
                                                              SocketUtil.sendMessage(model);
                                                             equipList.splice(i,1);//已经加载则删除掉缓存
                                                         }
                                                      }
                                                  }
                                                  Piece.Store.saveObject("DeviceList",equipList, true);
                                          }
                                      }
                              };
                              SocketGetDeviceFun("0100",Cons.MODULE_SYS);
                              Backbone.history.navigate('devicemanage/Ehome', {trigger: true});
                              $(".covering-layer").hide();
                              Piece.Cache.put("AddType","");//清空添加类别
                              break;
                           }
                         }
                         if(!flag) new Piece.Toast(I18n.Common.noDeviceOfSeriError);
                         */
	            }
	            else if (addType == "AddCustom") {//红外自定义
	                loader.show();
	                //增加模块到魔方
	                var model = new SocketUtil.sendModel();
	                model.gatewayId = gatewayId;
	                model.moduleId = Cons.MODULE_SYS;
	                model.moduleIndex = "0000";
	                model.actionId = Cons.MODULE_SYS;
	                model.actionIndex = "0000";
	                model.cmdType = Cons.Socket_Comd;
	                model.cmdCatalog = Cons.Comd_Get;
	                model.queryString = { "device": "" };
	                model.callbackFun = function (sendObj, backObj) {
	                    for (var arr in backObj) {
	                        if (arr.indexOf(Cons.MODULE_IRRC) > -1) {
	                            if (backObj[arr].indexOf('normal') > -1) {
	                                //新增模块成功后新增设备
	                                AddDeviceFun('', '', Name, deviceType, 1);
	                            } else {
	                                //没有该模块则添加该模块
	                                var model = new SocketUtil.sendModel();
	                                model.gatewayId = gatewayId;
	                                model.moduleId = Cons.MODULE_SYS;
	                                model.moduleIndex = "0000";
	                                model.actionId = Cons.MODULE_SYS;
	                                model.actionIndex = "0000";
	                                model.cmdType = Cons.Socket_Comd;
	                                model.cmdCatalog = Cons.Comd_Add;
	                                model.queryString = { "module": arr.substr(0, 4), "serial": arr.substr(4, 4) };
	                                model.callbackFun = function (sendObj, backObj) {
	                                    //新增模块成功后新增设备
	                                    AddDeviceFun('', '', Name, deviceType, 1);
	                                }
	                                SocketUtil.sendMessage(model);
	                            }
	                        }
	                    }
	                }
	                SocketUtil.sendMessage(model);
	                outTimer = window.setTimeout(function () { new Piece.Toast(I18n.Common.timeOut); loader.hideAll(); return; }, 10000);

	            }
	            else//固定红外设备或魔方
	            {
	                var deviceSerial = Piece.Cache.get("deviceSerial");
	                if (deviceSerial == '' || deviceSerial == undefined) {
	                    new Piece.Toast(I18n.Common.noDeviceSeriError);
	                    return;
	                }
	                var loginId = Piece.Store.loadObject("loginId", true);
	                var user_token = Piece.Store.loadObject("user_token", true);
	                if (user_token === null || user_token === "" || user_token === undefined) {
	                    new Piece.Toast(I18n.Common.needlogin);
	                    return;
	                }
	                accessToken = user_token.accessToken;
	                for (var i = 0; i < equipList.length; i++) {
	                    if (loginId == equipList[i].loginId && deviceSerial == equipList[i].serial && deviceType == equipList[i].device && gatewayId == equipList[i].gatewayId)//查找缓存里的设备匹配
	                    {
	                       // equipList[i].name = Name;
	                        var currentEquip = equipList[i];
	                        flag = true;
	                        if (currentEquip.device == "MAGICBOX") {
	                            Util.AjaxWait(OpenAPI.addGateway,
                                                "GET",
                                                {
                                                    "access_token": accessToken,
                                                    "appForm.userLoginId": loginId,
                                                    "appForm.gatewayId": currentEquip.gatewayId,
                                                    "appForm.gatewayName": Name,
                                                    "appForm.macAddress": currentEquip.macAddress,
                                                    "appForm.deviceTypeId": "MagicBox",
                                                    /*serialNumber:equipList[i].serial,非必须参数
													deviceAddress:equipList[i].ipAddress,
													kernelVer:equipList[i].kernelVer,
													fileSystemVersion:equipList[i].fsVer,
													protocolVer:equipList[i].protocolVer,
													softwareVersion:equipList[i].firmware,
													*/
                                                    "dataType": 'json'
                                                },
                                                'jsonp',
                                               function (data, textStatus, jqXHR) {
                                                   if (data.result == "success") {

                                                       Piece.Store.saveObject("DeviceList", equipList, true);//添加到本地
                                                       Backbone.history.navigate('devicemanage/Ehome' + prePage, { trigger: true });
                                                       $(".covering-layer").hide();
                                                       Piece.Cache.put("AddType", "");//清空添加类别
                                                   }
                                                   else {
                                                       new Piece.Toast(I18n.Dev_Rename.addMagicFail + data.error);
                                                   }
                                               },
                                                function (e, xhr, type) {
                                                    new Piece.Toast(I18n.Dev_Rename.addMagicFail);
                                                }
                                               );
	                        }
	                        else {
	                            

	                            //调用api保存数据到服务器
	                            if (autoSearchId != null && autoSearchId != '' && autoSearchId != undefined) {//自动匹配的红外设备
	                                loader.show();

	                                //增加模块到魔方
	                                var model = new SocketUtil.sendModel();
	                                model.gatewayId = gatewayId;
	                                model.moduleId = Cons.MODULE_SYS;
	                                model.moduleIndex = "0000";
	                                model.actionId = Cons.MODULE_SYS;
	                                model.actionIndex = "0000";
	                                model.cmdType = Cons.Socket_Comd;
	                                model.cmdCatalog = Cons.Comd_Get;
	                                model.queryString = { "device": "" };
	                                model.callbackFun = function (sendObj, backObj) {
	                                    for (var arr in backObj) {
	                                        if (arr.indexOf(Cons.MODULE_IRRC) > -1) {
	                                            if (backObj[arr].indexOf('normal') > -1) {
	                                                //新增模块成功后新增设备
	                                                AddDeviceAutoFun(currentEquip.baseCodeIndex, currentEquip.brandId, autoSearchId, Name, currentEquip.device);

	                                            } else {
	                                                //没有该模块则添加该模块
	                                                var model = new SocketUtil.sendModel();
	                                                model.gatewayId = gatewayId;
	                                                model.moduleId = Cons.MODULE_SYS;
	                                                model.moduleIndex = "0000";
	                                                model.actionId = Cons.MODULE_SYS;
	                                                model.actionIndex = "0000";
	                                                model.cmdType = Cons.Socket_Comd;
	                                                model.cmdCatalog = Cons.Comd_Add;
	                                                model.queryString = { "module": arr.substr(0, 4), "serial": arr.substr(4, 4) };
	                                                model.callbackFun = function (sendObj, backObj) {
	                                                    if (backObj.command.indexOf(Cons.Rspn_Suc) < 0) {

	                                                        loader.hideAll();
	                                                        new Piece.Toast(I18n.Dev_Rename.fail);
	                                                        return;
	                                                    }
	                                                    else {
	                                                        AddDeviceAutoFun(currentEquip.baseCodeIndex, currentEquip.brandId, autoSearchId, Name, currentEquip.device);
	                                                    
	                                                    }
	                                                }
	                                                SocketUtil.sendMessage(model);
	                                            }
	                                        }
	                                    }
	                                }
	                                SocketUtil.sendMessage(model);
	                                outTimer = window.setTimeout(function () { new Piece.Toast(I18n.Common.timeOut); loader.hideAll(); return; }, 10000);
	                            }
	                            else {
	                                //手动增加的设备
	                                loader.show();
	                                //增加模块到魔方
	                                var model = new SocketUtil.sendModel();
	                                model.gatewayId = gatewayId;
	                                model.moduleId = Cons.MODULE_SYS;
	                                model.moduleIndex = "0000";
	                                model.actionId = Cons.MODULE_SYS;
	                                model.actionIndex = "0000";
	                                model.cmdType = Cons.Socket_Comd;
	                                model.cmdCatalog = Cons.Comd_Get;
	                                model.queryString = { "device": "" };
	                                model.callbackFun = function (sendObj, backObj) {
	                                    for (var arr in backObj) {
	                                        if (arr.indexOf(Cons.MODULE_IRRC) > -1) {
	                                            if (backObj[arr].indexOf('normal') > -1) {
	                                                //新增模块成功后新增设备
	                                                AddDeviceFun(currentEquip.brandId, currentEquip.moduleId, Name, currentEquip.device, 0);
	                                            } else {
	                                                //没有该模块则添加该模块
	                                                var model = new SocketUtil.sendModel();
	                                                model.gatewayId = gatewayId;
	                                                model.moduleId = Cons.MODULE_SYS;
	                                                model.moduleIndex = "0000";
	                                                model.actionId = Cons.MODULE_SYS;
	                                                model.actionIndex = "0000";
	                                                model.cmdType = Cons.Socket_Comd;
	                                                model.cmdCatalog = Cons.Comd_Add;
	                                                model.queryString = { "module": arr.substr(0, 4), "serial": arr.substr(4, 4) };
	                                                model.callbackFun = function (sendObj, backObj) {
	                                                    //新增模块成功后新增设备
	                                                    AddDeviceFun(currentEquip.brandId, currentEquip.moduleId, Name, currentEquip.device, 0);
	                                                }
	                                                SocketUtil.sendMessage(model);
	                                            }
	                                        }
	                                    }
	                                }
	                                SocketUtil.sendMessage(model);
	                                outTimer = window.setTimeout(function () { new Piece.Toast(I18n.Common.timeOut); loader.hideAll(); return; }, 10000);
	                            }
	                        }
	                        break;
	                    }
	                }
	                if (!flag) new Piece.Toast(I18n.Common.noDeviceOfSeriError);
	            }
	        },
	        closeCovering: function () {
	            var me = this;
	            $(".close-btConn i").on("tap", function (e) {
	                me.hideConn();
	            });
	        }
	    });
	    return seDevReName;
	});