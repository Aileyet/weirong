define(['text!devicemanage/Ehome.html', "zepto", "../base/openapi", '../base/util', "../base/templates/template", '../base/socketutil', '../base/i18nMain', "../base/constant", '../base/drag/dragMenu'],
	function (viewTemplate, $, OpenAPI, Util, _TU, SocketUtil, I18n, Cons, _Drag) {
	    var equipList = new Array();
	    var magicList = new Array();

	    var tdate = null;
	    var editFun;
	    var detailFun;
	    var fillHtmlFun;
	    var fillHtmlFun2;
	    var deleteFun;
	    var editStorageFun;
	    var getMagicDevicesFun;
	    var showHtmlFun;
	    var _getDevices;
	    var access_token = "";
	    //新参数
	    var sendTimer = null;
	    var sendLoader = null;

	    var me;
	    var menuInfo = null;
	    var page;
	    var loginId;
	    var isIRRCPage = false; //魔方红外设备列表
	    var isDeviceDetail = false;//魔方设置中设备详情
	    var isMyEHomePage = false;//我的E家
	    return Piece.View.extend({
	        id: 'devicemanage_DeviceList',
	        render: function () {
	            $(this.el).html(viewTemplate);
	            Piece.View.prototype.render.call(this);
	            return this;
	        },
	        events: {
	            //'touchstart .equip': 'edit',
	            'touchstart #study': 'add'
	        },
	        onLoadTemplate: function () {
	            _TU._U.setHeader(_TU._T.devicemanage_Ehome);
	        },
	        onShow: function () {
	            this.onLoadTemplate();//加载配置模板
	            //区分进入来源界面
	            isIRRCPage = false;
	            isMyEHomePage = false;
	            page = Util.getQueryStringByName("prePage");
	            if (page == "magicbox/StMBMain") {
	                isIRRCPage = true;
	            }
	            else if (page == "magicbox/InMBSetup") {
	                isDeviceDetail = true;
	            }
	            else if (page == "home/MeIndex") {
	                isMyEHomePage = true;
	            }
	            if (isIRRCPage) {
	                $("#controlTitle").text(I18n.Ehome.irrcTitle);
	            }
	            else if (isDeviceDetail) {
	                $("#controlTitle").text(I18n.Ehome.deviceDetail);
	            }
	            else if (isMyEHomePage) {
	                $("#controlTitle").text(I18n.ehome_Ehome.title);
	            }
	            else {
	                $("#controlTitle").text(I18n.Ehome.title);
	            }
	            Piece.Cache.put("prePage", page);

	            //初始化数据
	            Piece.Cache.put("study", 0); //清空学习状态
	            loginId = Piece.Store.loadObject("loginId", true);
	            me = this;
	            if (sendTimer != null) window.clearInterval(sendTimer);
	            _Drag.equipLists = null;
	            
	            menuInfo = Piece.Store.loadObject("eHomeMenuInfos", true);
	            
	            _TU._U.goBack(function () {
	                if (page != "") {
	                    Backbone.history.navigate(page, { trigger: true });
	                }
	                else {
	                    Backbone.history.navigate('home/MeIndex', { trigger: true });
	                }
	            });

	            //定义函数
	            editFun = this.edit;
	            detailFun = this.detail;
	            fillHtmlFun = this.fillHtml;
	            fillHtmlFun2 = this.fillHtml2;
	            deleteFun = this.deleteStorage;
	            editStorageFun = this.editStorage;
	            setDialogCssFun = this.setDialogCss;
	            showHtmlFun = this.showHtml;
	            getMagicDevicesFun = this.getMagicDevices;
	            _getDevices = this.getDevices;
	            
	            _getDevices();
	        },
	        getDevices: function () {

	            $('#equipList').val('');
	            //从服务器取数据
	            var user_token = Piece.Store.loadObject("user_token", true);
	            access_token = user_token.accessToken;
	            equipList = Piece.Store.loadObject("DeviceList", true);
	            magicList = Piece.Store.loadObject("magicList", true);
	            if (equipList == null) equipList = new Array();
	            if (magicList == null) magicList = new Array();
	            //删除没有名称的设备
	            for (var i = 0; i < equipList.length; i++) {
	                if (equipList[i].name == "" || equipList[i].name == undefined || equipList[i].name == null) {
	                    equipList.splice(i, 1);
	                    i--;
	                }
	            }
	            Piece.Store.saveObject("DeviceList", equipList, true);
	            //设备列表进入则魔方全部显示
	            if (!isIRRCPage && !isMyEHomePage && !isDeviceDetail) {
	                for (var i = 0; i < magicList.length; i++) {
	                    fillHtmlFun(magicList[i]);
	                    _Drag.onLoad(menuInfo, me, magicList[i]);
	                }
	            }
	            else if (isMyEHomePage) {//我的E家不显示共享魔方
	                for (var i = 0; i < magicList.length; i++) {
	                    if (!magicList[i].share) {
	                        fillHtmlFun(magicList[i]);
	                        _Drag.onLoad(menuInfo, me, magicList[i]);
	                    }
	                }
	            }
	            showHtmlFun();
	            _Drag.onLoad(menuInfo, me, equipList);

	            //for(var i=0;i<equipList.length;i++){
	            //	if(equipList[i].device!="SW00"&&equipList[i].device!="SS00"&&equipList[i].device!="SLB0"){
	            //		equipList.splice(i,1);
	            //		i--;
	            //	}
	            //}
	            //for(var i=0;i<equipList.length;i++){//zigbee设备额外显示
	            //if(equipList[i].device=="SS00"||equipList[i].device=="SW00"||equipList[i].device=="SLB0"){
	            //if(equipList[i].check==false){//显示
	            //fillHtmlFun2(equipList[i]);
	            //}
	            //}
	            //}
	        },
	        add: function () {
	            if (isIRRCPage) {
	                Backbone.history.navigate('devicemanage/SeIRDevList', { trigger: true });
	            } else {
	                Backbone.history.navigate('devicemanage/SeAddDev', { trigger: true });
	            }
	        },
	        edit: function (obj) {
	            //setTimeout(function () {

	            var dataSerial = $(obj).find(".equip").attr("data-serial");
	            var dataDevice = $(obj).find(".equip").attr("data-device");
	            var dataGatewayId = $(obj).find(".equip").attr("data-gatewayId");

	            var dialog = new Piece.Dialog({
	                autoshow: false,
	                target: 'body',
	                title: I18n.Common.operate,
	                content: ''
	            }, {
	                configs: [
                    {
                        title: I18n.Common.delete,
                        eventName: 'del',
                    }, {
                        title: I18n.Common.edit,
                        eventName: 'edit',
                    }
	                ],
	                edit: function () {
	                    dialog.hide();
	                    EditDialog.show();
	                    //显示旧名字
	                    var oldname = $(obj).find(".equip").find(".my-E-home-name").text();
	                    if (oldname != null && oldname != undefined) {
	                        $("#equipName").val(oldname);
	                    }
	                    setDialogCssFun();
	                },
	                del: function () {
	                    dialog.hide();
	                    ConfirmDeleteDialog.show();
	                    setDialogCssFun();
	                },

	            });
	            var EditDialog = new Piece.Dialog({
	                autoshow: false,
	                target: '.content',
	                title: I18n.Common.editDeviceName,
	                content: '<input type="text" id="equipName" style="width:170px"></input>'
	            }, {
	                configs: [
                    {
                        title: I18n.Common.cancel,
                        eventName: 'can',

                    }, {
                        title: I18n.Common.save,
                        eventName: 'save',
                    }],
	                save: function () {
	                    var name = $("#equipName").val();
	                    for (var i = 0; i < equipList.length; i++) {
	                        if (equipList[i].loginId == loginId && equipList[i].serial == dataSerial && equipList[i].device == dataDevice && equipList[i].gatewayId == dataGatewayId) {
	                            equipList[i].name = name;
	                            //调用api保存数据到服务器,待完成
	                            if (equipList[i].device == "MagicBox")//魔方修改
	                            {
	                                Util.AjaxWait(OpenAPI.changGatewayName,
                                    "GET",
                                    {
                                        access_token: access_token,
                                        gatewayId: equipList[i].gatewayId,
                                        gatewayName: name,
                                        dataType: 'jsonp'
                                    },
                                    'jsonp',
                                   function (data, textStatus, jqXHR) {
                                       if (data.result == "success") {
                                           editStorageFun(equipList[i], i);
                                           new Piece.Toast(I18n.Common.editSucess);
                                       }
                                       else {
                                           new Piece.Toast(I18n.Common.editError + data.error);
                                       }
                                   },
                                    function (e, xhr, type) {
                                        new Piece.Toast(I18n.Common.getUserDeviceError);
                                    }
                                   );
	                            }
	                            else {
	                                var fun = function () {
	                                    editStorageFun(equipList[i], i);
	                                };
	                                SocketUtil.EditDevice(name, equipList[i].device, equipList[i].gatewayId, equipList[i].serial, fun);

	                            }
	                            break;
	                        }
	                    }
	                },
	                can: function () {
	                    EditDialog.hide();
	                },
	            });

	            var ConfirmDeleteDialog = new Piece.Dialog({
	                autoshow: false,
	                target: '.content',
	                title: I18n.Common.tip,
	                content: I18n.Common.deleteConfirm,
	            }, {
	                configs: [{
	                    title: I18n.Common.cancel,
	                    eventName: 'cancel',
	                }, {
	                    title: I18n.Common.ok,
	                    eventName: 'ok',
	                }
	                ],
	                cancel: function () {
	                    ConfirmDeleteDialog.hide();
	                },
	                ok: function () {
	                    if (!Util.IsNullOrEmpty(dataSerial)) {
	                        for (var i = 0; i < equipList.length; i++) {
	                            if (equipList[i].loginId == loginId && equipList[i].serial == dataSerial && equipList[i].device == dataDevice && equipList[i].gatewayId == dataGatewayId) {
	                                //deleteFun(equipList[i],i);

	                                //调用api保存数据到服务器,待完成
	                                if (equipList[i].device == "MagicBox")//魔方删除
	                                {
	                                    Util.AjaxWait(OpenAPI.delGateway,
                                        "GET",
                                        {
                                            access_token: access_token,
                                            gatewayId: equipList[i].gatewayId,
                                            dataType: 'jsonp'
                                        },
                                        'jsonp',
                                       function (data, textStatus, jqXHR) {
                                           if (data.result == "success") {
                                               deleteFun(equipList[i], i);
                                               _Drag.deleteMenu(dataSerial, dataGatewayId, dataDevice);
                                               new Piece.Toast(I18n.Common.deleteSucess);
                                           }
                                           else {
                                               new Piece.Toast(I18n.Common.deleteError + data.error);
                                           }
                                       },
                                        function (e, xhr, type) {
                                            new Piece.Toast(I18n.Common.deleteError);
                                        }
                                       );
	                                }
	                                else {
	                                    var fun = function () {
	                                        deleteFun(equipList[i], i);
	                                        _Drag.deleteMenu(dataSerial, dataGatewayId, dataDevice);
	                                    };
	                                    SocketUtil.DeleteDevice(equipList[i].deviceId, equipList[i].device, equipList[i].gatewayId, equipList[i].serial, fun);
	                                }
	                                break;
	                            }
	                        }
	                    }
	                }
	            });
	            //防止重复打开
	            if ($('#cube-dialog-wrapper').length <= 0) { dialog.show(); setDialogCssFun(); }
	            //}, deleteTime)
	        },
	        editStorage: function (equip, index) {
	            equipList[index].name = equip.name;
	            Piece.Store.saveObject("DeviceList", equipList, true);
	            //				$(".equip").each(function(){
	            //						 if($(this).attr("data-serial")==equip.serial
	            //						   &&$(this).attr("data-device")==equip.device
	            //						   &&$(this).attr("data-gatewayId")==equip.gatewayId)
	            //						   {
	            //						     $(this).parent().parent().remove();
	            //					       }
	            //				 })
	            //显示
	            //				fillHtmlFun(equip);
	            _Drag.notifyMenu(equip.serial, equip.gatewayId, equip.device, equip.name);
	            //如果操作魔方数据，更新魔方的缓存
	            if (equip.device == "MagicBox") {
	                var magicList = Piece.Store.loadObject("magicList", true);
	                for (var i = 0; i < magicList.length; i++) {
	                    if (magicList[i].serial == equip.serial) {
	                        magicList[i].name = name;
	                        Piece.Store.saveObject("magicList", magicList, true);//添加到本地
	                        break;
	                    }
	                }
	            }
	        },
	        setDialogCss: function () {
	            $(".btn").first().css("background-color", _TU._T.dialog_Style.cancelColor);
	            $(".ui-header").css("background-color", _TU._T.dialog_Style.backColor);
	            $(".btn").last().css("background-color", _TU._T.dialog_Style.backColor);
	        },
	        deleteStorage: function (equip, index) {
	            //如果操作魔方数据，更新魔方的缓存
	            if (equip.device == "MagicBox") {
	                var magicList = Piece.Store.loadObject("magicList", true);
	                for (var i = 0; i < magicList.length; i++) {
	                    if (magicList[i].serial == equip.serial) {
	                        magicList.splice(i, 1);
	                        Piece.Store.saveObject("magicList", magicList, true);//添加到本地
	                        break;
	                    }
	                }
	            }
	            //删除设备数据
	            equipList.splice(index, 1);
	            Piece.Store.saveObject("DeviceList", equipList, true);//添加到本地
	            $(".equip").each(function () {
	                if ($(this).attr("data-serial") == equip.serial
                      && $(this).attr("data-device") == equip.device
                      && $(this).attr("data-gatewayId") == equip.gatewayId) {
	                    $(this).parent().parent().remove();
	                }
	            })
	            //删除该设备的自定义按钮缓存
	            var deviceStatus = Piece.Store.loadObject("DeviceStatus", true);
	            if (deviceStatus != null && deviceStatus.length > 0) {
	                for (var i = 0; i < deviceStatus.length; i++) {
	                    if (deviceStatus[i].gatewayId == equip.gatewayId
                            && deviceStatus[i].serial == equip.serial
                            && deviceStatus[i].device == equip.device) {
	                        deviceStatus.splice(i, 1);
	                        Piece.Store.saveObject("DeviceStatus", deviceStatus, true);
	                        break;
	                    }
	                }
	            }
	        },
	        detail: function (obj) {
	            var device = $(obj).find(".equip").attr("data-device");
	            var serial = $(obj).find(".equip").attr("data-serial");
	            var gatewayId = $(obj).find(".equip").attr("data-gatewayId");

	            for (var i = 0; i < equipList.length; i++) {
	                if (equipList[i].loginId == loginId
                        && equipList[i].serial == serial
						&& equipList[i].device == device
						&& equipList[i].gatewayId == gatewayId) {
	                    if (equipList[i].check == false) {
	                        Piece.Toast(I18n.Common.zigbeeIsLoading);
	                    }
	                    else if (equipList[i].device == "MagicBox") {
	                        Piece.Cache.put("gatewayId", equipList[i].gatewayId);
	                        Piece.Cache.put("serial", equipList[i].serial);
	                        Backbone.history.navigate("magicbox/StMBMain", { trigger: true });
	                    }
	                    else {
	                        Piece.Cache.put("gatewayId", equipList[i].gatewayId);
	                        Piece.Cache.put("serial", equipList[i].serial);
	                        var device = Util.getDevice(equipList[i].device);
	                        Backbone.history.navigate(device.url, { trigger: true });
	                    }

	                }
	            }
	        },
	        showHtml: function () {
	            if (isMyEHomePage) {
	                var shareMagic = new Array();
	                for (var i = 0; i < magicList.length; i++) {
	                    if (magicList[i].share)
	                        shareMagic[magicList[i].gatewayId] = 1;
	                }
	            }
	            for (var i = 0; i < equipList.length; i++) {
	                if (equipList[i].device != "MagicBox") {//魔方已经显示，选择设备显示即可
	                    if (isIRRCPage || isDeviceDetail) {//红外设备列表或设备详情只显示特定魔方下的
	                        var nid = Piece.Cache.get("gatewayId");
	                        if (equipList[i].gatewayId == nid) {
	                            fillHtmlFun(equipList[i]);
	                        }
	                    }
	                    else if (isMyEHomePage) {//我的E家不显示共享设备
	                        if (shareMagic[equipList[i].gatewayId] != 1) {
	                            fillHtmlFun(equipList[i]);
	                        }
	                    }
	                    else {
	                        fillHtmlFun(equipList[i]);
	                    }
	                }
	            }
	        },
	        fillHtml: function (obj) {
				console.log(obj.device);
	            var device = Util.getDevice(obj.device);
	            //				$("<div>").html('<div class="my-E-home-cell"><div class="inner-border"><a class="equip" data-serial="'+obj.serial+'" data-device="'+obj.device+'" data-gatewayId="'+obj.gatewayId+'"><i class="icon iconfont" style="font-size: 32px;">'+device.img+'</i></span><span class="my-E-home-name">'+ obj.name+'</span></a></div></div>')/*.bind("touchstart",function(){tdate=new Date();}).bind("touchend",function(){var tsec=new Date()-tdate; if(tsec>1000){editFun($(this))}else{detailFun($(this))};;})*/.appendTo("#equipList");
				console.log(device);

	            if (menuInfo == null) {
	                menuInfo = { menus: [], menuPos: {} };
	                var menu = {
	                    title: obj.name,
	                    order: 0,
	                    type: "menu",
	                    data: [
                              {
                                  serial: obj.serial,
                                  icon: device.img,
                                  device: obj.device,
                                  gatewayId: obj.gatewayId,
                                  title: obj.name,
                                  order: 0,
                              }
	                    ]
	                };
	                menuInfo.menus[0] = menu;
	                menuInfo.menuPos[0] = 0;
	            } else {
	                /*
					 * 判断该设备是否已经存储到菜单信息中，
					 * 如果不存在就把设备添加到菜单信息中。
					 */
	                var Menubool = false;
	                var folderbool = false;
	                var newOrder = 0;
	                var menuOrder = 0;
	                var folderOrder = 0;
	                for (var i = 0; i < menuInfo.menus.length; i++) {
	                    var item = menuInfo.menus[i];
	                    if (item.type == "menu") {
	                        for (var j = 0; j < item.data.length; j++) {
	                            var e = item.data[j];
	                            if (e.serial == obj.serial && e.gatewayId == obj.gatewayId && e.device == obj.device && e.title.replace("\n", "") == obj.name.replace("\n", "")) {
	                                Menubool = true;
	                                menuOrder = item.order;
	                                break;
	                            }
	                        }
	                    } else if (item.type == "folder") {
	                        for (var j = 0; j < item.data.length; j++) {
	                            var e = item.data[j];
	                            if (e.serial == obj.serial && e.gatewayId == obj.gatewayId && e.device == obj.device && e.title.replace("\n", "") == obj.name.replace("\n", "")) {
	                                folderbool = true;
	                                folderOrder = item.order;
	                                break;
	                            }
	                        }
	                    }

	                    //获取最新的设备菜单编号
	                    if (item.order >= newOrder) {
	                        newOrder = item.order + 1;
	                    }
	                }


	                //对有设备信息，但不显示进行校验
	                var orderbool = false;
	                var posord = 0;
	                if (Menubool && folderbool) {//有改设备信息
	                    for (var key in menuInfo.menuPos) {
	                        if (menuInfo.menuPos[key] == menuOrder || menuInfo.menuPos[key] == folderOrder) {
	                            orderbool = true;
	                        }

	                        if (key >= posord) {
	                            posord = parseInt(key) + 1;
	                        }
	                    }

	                    if (!orderbool) {
	                        menuInfo.menuPos[posord] = folderOrder;
	                    }

	                } else if (Menubool && !folderbool) {//有改设备信息，但组合菜单中没有
	                    for (var key in menuInfo.menuPos) {
	                        if (menuInfo.menuPos[key] == menuOrder) {
	                            orderbool = true;
	                        }

	                        if (key >= posord) {
	                            posord = parseInt(key) + 1;
	                        }
	                    }

	                    if (!orderbool) {
	                        menuInfo.menuPos[posord] = menuOrder;
	                    }
	                }

	                //添加新的设备信息
	                if (!Menubool && !folderbool && device != null) {
						try{
						var image = device.img;
	                    var menu = {
	                        title: obj.name,
	                        order: newOrder,
	                        type: "menu",
	                        data: 
                                  {
                                      serial: obj.serial,
                                      icon: image,
                                      device: obj.device,
                                      gatewayId: obj.gatewayId,
                                      title: obj.name,
                                      order: newOrder,
                                  }
	                        
	                    };
	                    menuInfo.menus[menuInfo.menus.length] = menu;
	                    menuInfo.menuPos[Object.keys(menuInfo.menuPos).length] = newOrder;
						}catch(e){
							//console.error(e);
						}
	                }
	            }
	        },
	        fillHtml2: function (obj) {
	            var device = Util.getDevice(obj.device);
	            $("<div>").html('<div class="my-E-home-cell"><div class="inner-border"><a class="equip" data-serial="' + obj.serial + '" data-device="' + obj.device + '" data-gatewayId="' + obj.gatewayId + '"><i class="icon iconfont" style="font-size: 32px;color:#d0d0d0;">' + device.img + '</i></span><span class="my-E-home-name" style="color:#d0d0d0;">' + obj.name + '</span></a></div></div>').bind("touchstart", function () { tdate = new Date(); }).bind("touchend", function () { var tsec = new Date() - tdate; if (tsec > 1000) { editFun($(this)) } else { detailFun($(this)) };; }).appendTo("#equipList");
	        },
	    });
	});

Array.prototype.remove = function (dx) {
    if (isNaN(dx) || dx > this.length) { return false; }
    for (var m = 0, n = 0; m < this.length; m++) {
        if (this[m] != this[dx]) {
            this[n++] = this[m]
        }
    }
    if (this.length >= 1)
        this.length -= 1
    return true;
}