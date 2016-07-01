define(['zepto', "../base/openapi", "sockjs", "../base/constant", "../base/util", '../base/i18nMain'], function ($, OpenAPI, SockJs, Cons, Util, I18n) {

    var gatewayId = "";
    var serial = "";
    var actionId = "";
    var actionIndex = "";
    var MaxLen = 64 * 1024;
    var SocketUtil = {
        checkVal: function () {
            gatewayId = Piece.Cache.get("gatewayId");
            if (gatewayId == null || gatewayId == "") {
                new Piece.Toast("未获取到该设备所属魔方编号！");
                return;
            }
            serial = Piece.Cache.get("serial");
            if (serial == null || serial == "") {
                new Piece.Toast("未获取到该设备系列号！");
                return;
            }
        },
        //检查遥控按钮是否已经获取过funcId
        checkFunctionID: function (module, fun, isbtn) {

            if (isbtn) Util.vibration();

            gatewayId = Piece.Cache.get("gatewayId");
            if (gatewayId == null || gatewayId == "") {
                new Piece.Toast("未获取到该设备所属魔方编号！");
                return;
            }
            serial = Piece.Cache.get("serial");
            if (serial == null || serial == "") {
                new Piece.Toast("未获取到该设备系列号！");
                return;
            }

            actionId = Piece.Cache.get("actionId");
            actionIndex = Piece.Cache.get("actionIndex");
            if (actionId == null || actionIndex == null) {
                var model = new SocketUtil.sendModel();
                model.gatewayId = gatewayId;
                model.moduleId = "IRRC";
                model.moduleIndex = "0000";
                model.actionId = "IRRC";
                model.actionIndex = "0000";
                model.cmdType = "Comd";
                model.cmdCatalog = "Get ";
                model.queryString = { "function": "" };
                model.sock = this;
                model.callbackFun = function (sendObj, backObj) {
                    for (var arr in backObj) {
                        if (arr.indexOf("function") > -1) {
                            actionId = backObj[arr].substr(1, 4);
                            actionIndex = backObj[arr].substr(5, 4);
                            var model = new SocketUtil.sendModel();
                            model.gatewayId = gatewayId;
                            model.moduleId = module;
                            model.moduleIndex = serial;
                            model.actionId = module;
                            model.actionIndex = actionIndex;
                            model.cmdType = "Comd";
                            model.cmdCatalog = "Get ";
                            model.queryString = { "function": "" };
                            model.sock = this;
                            model.callbackFun = function (sendObj, backObj) {
                                for (var arr in backObj) {
                                    if (arr.indexOf("function") > -1) {
                                        actionId = backObj[arr].substr(1, 4);
                                        actionIndex = backObj[arr].substr(5, 4);
                                        Piece.Cache.put("actionId", actionId);
                                        Piece.Cache.put("actionIndex", actionIndex);
                                        fun();
                                        break;
                                    }
                                }
                            }
                            SocketUtil.sendMessage(model);
                            break;
                        }
                    }
                }
                SocketUtil.sendMessage(model);
            }
            else {
                fun();
            }
        },
        //检查摄像头按钮是否已经获取过funcId
        checkCamFunctionID: function (module, fun, isbtn) {

            if (isbtn) Util.vibration();

            gatewayId = Piece.Cache.get("gatewayId");
            if (gatewayId == null || gatewayId == "") {
                new Piece.Toast("未获取到该设备所属魔方编号！");
                return;
            }
            actionId = Piece.Cache.get("actionId");
            actionIndex = Piece.Cache.get("actionIndex");
            if (actionId == null || actionIndex == null) {
                var model = new SocketUtil.sendModel();
                model.gatewayId = gatewayId;
                model.moduleId = "CAM0";
                model.moduleIndex = "0000";
                model.actionId = "CAM0";
                model.actionIndex = "0000";
                model.cmdType = "Comd";
                model.cmdCatalog = "Get ";
                model.queryString = { "function": "" };
                model.sock = this;
                model.callbackFun = function (sendObj, backObj) {
                    for (var arr in backObj) {
                        if (arr.indexOf("function") > -1) {
                                        actionId = backObj[arr].substr(1, 4);
                                        actionIndex = backObj[arr].substr(5, 4);
                                        Piece.Cache.put("actionId", actionId);
                                        Piece.Cache.put("actionIndex", actionIndex);
                                        serial = actionIndex;
                                        fun();
                                        break;
                            }
                        }
                }
                SocketUtil.sendMessage(model);
            }
            else {
                fun();
            }
        },
        AddModule: function (module) {
            var check = this.checkVal; check();

            var model = new this.sendModel();
            model.gatewayId = gatewayId;
            model.identify = "0177";
            model.moduleId = "SYS0";
            model.moduleIndex = "0000";
            model.cmdType = "Comd";
            model.cmdCatalog = "AddD";
            model.queryString = { "module": module, "serial": "0000" };
            this.sendMessage(model);
        },
        AddNewModule: function (checkModuleName, setFun) {//公共调用的函数(需要检验的模块，检验完后执行的命令)
            var model = new this.sendModel();
            model.gatewayId = gatewayId;
            model.moduleId = "SYS0";
            model.moduleIndex = "0000";
            model.actionId = "SYS0";
            model.actionIndex = "0000";
            model.cmdType = "Comd";
            model.cmdCatalog = "Get ";
            model.queryString = { "device": "" };
            model.setFun = setFun;
            model.callbackFun = function (sendObj, backObj) {
                for (var arr in backObj) {
                    if (arr.indexOf(checkModuleName) > -1) {
                        if (backObj[arr].indexOf('normal') > -1) {
                            sendObj.setFun();
                        } else {
                            //没有该模块则添加该模块
                            var model = new SocketUtil.sendModel();
                            model.gatewayId = gatewayId;
                            model.moduleId = "SYS0";
                            model.moduleIndex = "0000";
                            model.actionId = "SYS0";
                            model.actionIndex = "0000";
                            model.cmdType = "Comd";
                            model.cmdCatalog = "AddD";
                            model.queryString = { "module": arr.substr(0, 4), "serial": arr.substr(4, 4) };
                            model.setFun = sendObj.setFun;
                            model.callbackFun = function (sendObj, backObj) {
                                sendObj.setFun();
                            }
                            SocketUtil.sendMessage(model);
                        }
                    }
                }
            }
            this.sendMessage(model);
        },
        /*湿度报警选择开关*/
        SeSubscribeTH_Select: function (state) {
            var check = this.checkVal; check();
            this.AddNewModule("HUM0",
				function () {//设置订阅
				    var model = new SocketUtil.sendModel();
				    model.gatewayId = gatewayId;
				    model.moduleId = "HUM0";
				    model.moduleIndex = "0000";
				    model.cmdType = "Comd";
				    model.cmdCatalog = "Subs";
				    model.queryString = { "alarmH": "subscribe" };
				    model.callbackFun = function (sendObj, backObj) {//成功调用
				        //执行页面回调
				    }
				    if (state != "on") {
				        model.queryString.alarmH = "unsubscribe";
				    }
				    SocketUtil.sendMessage(model);
				}
			);
        },
        /*湿度报警类型*/
        SeSubscribeTH_Type: function (type) {
            var check = this.checkVal; check();

            this.AddNewModule("HUM0",
				function () {//设置订阅
				    var model = new SocketUtil.sendModel();
				    model.gatewayId = gatewayId;
				    model.moduleId = "HUM0";
				    model.moduleIndex = "0000";
				    model.cmdType = "Comd";
				    model.cmdCatalog = "Set ";
				    model.queryString = { "alarmType": type };
				    model.callbackFun = function (sendObj, backObj) {//成功调用
				        //执行页面回调
				    }
				    SocketUtil.sendMessage(model);
				}
			);
        },
        /*湿度报警间隔*/
        SeSubscribeTH_Time: function (time) {
            var check = this.checkVal; check();

            this.AddNewModule("HUM0",
				function () {//设置订阅
				    var model = new SocketUtil.sendModel();
				    model.gatewayId = gatewayId;
				    model.moduleId = "HUM0";
				    model.moduleIndex = "0000";
				    model.cmdType = "Comd";
				    model.cmdCatalog = "Set ";
				    model.queryString = { "msgInterval": time };
				    model.callbackFun = function (sendObj, backObj) {//成功调用
				        //执行页面回调
				    }
				    SocketUtil.sendMessage(model);
				}
			);
        },
        /*湿度上限*/
        SeSubscribeTH_Max: function (max) {
            var check = this.checkVal; check();

            this.AddNewModule("HUM0",
				function () {//设置订阅
				    var model = new SocketUtil.sendModel();
				    model.gatewayId = gatewayId;
				    model.moduleId = "HUM0";
				    model.moduleIndex = "0000";
				    model.cmdType = "Comd";
				    model.cmdCatalog = "Set ";
				    model.queryString = { "alarmH": (max * 1000) };
				    model.callbackFun = function (sendObj, backObj) {//成功调用
				        //执行页面回调
				    }
				    SocketUtil.sendMessage(model);
				}
			);
        },
        /*湿度下限*/
        SeSubscribeTH_Min: function (min) {
            var check = this.checkVal; check();

            this.AddNewModule("HUM0",
				function () {//设置订阅
				    var model = new SocketUtil.sendModel();
				    model.gatewayId = gatewayId;
				    model.moduleId = "HUM0";
				    model.moduleIndex = "0000";
				    model.cmdType = "Comd";
				    model.cmdCatalog = "Set ";
				    model.queryString = { "alarmL": (min * 1000) };
				    model.callbackFun = function (sendObj, backObj) {//成功调用
				        //执行页面回调
				    }
				    SocketUtil.sendMessage(model);
				}
			);
        },
        /*红外警报选择开关*/
        SeSubscribeHW_Select: function (state) {
            var check = this.checkVal; check();

            var check = this.checkVal; check();
            this.AddNewModule("PIR0",
				function () {//设置订阅
				    var model = new SocketUtil.sendModel();
				    model.gatewayId = gatewayId;
				    model.moduleId = "PIR0";
				    model.moduleIndex = "0000";
				    model.cmdType = "Comd";
				    model.cmdCatalog = "Subs";
				    model.queryString = { "alarmValue": "subscribe" };
				    model.callbackFun = function (sendObj, backObj) {//成功调用
				        //执行页面回调
				    }
				    if (state != "on") {
				        model.queryString.alarmValue = "unsubscribe";
				    }
				    SocketUtil.sendMessage(model);
				}
			);
        },
        /*红外警报类型*/
        SeSubscribeHW_Type: function (type) {
            var check = this.checkVal; check();

            this.AddNewModule("PIR0",
				function () {//设置订阅
				    var model = new SocketUtil.sendModel();
				    model.gatewayId = gatewayId;
				    model.moduleId = "PIR0";
				    model.moduleIndex = "0000";
				    model.cmdType = "Comd";
				    model.cmdCatalog = "Set ";
				    model.queryString = { "alarmType": type };
				    model.callbackFun = function (sendObj, backObj) {//成功调用
				        //执行页面回调
				    }
				    SocketUtil.sendMessage(model);
				}
			);
        },
        /*红外警报间隔*/
        SeSubscribeHW_Time: function (time) {
            var check = this.checkVal; check();

            this.AddNewModule("PIR0",
				function () {//设置订阅
				    var model = new SocketUtil.sendModel();
				    model.gatewayId = gatewayId;
				    model.moduleId = "PIR0";
				    model.moduleIndex = "0000";
				    model.cmdType = "Comd";
				    model.cmdCatalog = "Set ";
				    model.queryString = { "msgInterval": time };
				    model.callbackFun = function (sendObj, backObj) {//成功调用
				        //执行页面回调
				    }
				    SocketUtil.sendMessage(model);
				}
			);
        },
        /*空气警报选择开关*/
        SeSubscribeKQ_Select: function (state) {
            var check = this.checkVal; check();

            this.AddNewModule("AQ00",
				function () {//设置订阅
				    var model = new SocketUtil.sendModel();
				    model.gatewayId = gatewayId;
				    model.moduleId = "AQ00";
				    model.moduleIndex = "0000";
				    model.cmdType = "Comd";
				    model.cmdCatalog = "Subs";
				    model.queryString = { "alarmValue": "subscribe" };
				    model.callbackFun = function (sendObj, backObj) {//成功调用
				        //执行页面回调
				    }
				    if (state != "on") {
				        model.queryString.alarmValue = "unsubscribe";
				    }
				    SocketUtil.sendMessage(model);
				}
			);
        },
        /*空气警报类型*/
        SeSubscribeKQ_Type: function (type) {
            var check = this.checkVal; check();

            this.AddNewModule("AQ00",
				function () {//设置订阅
				    var model = new SocketUtil.sendModel();
				    model.gatewayId = gatewayId;
				    model.moduleId = "AQ00";
				    model.moduleIndex = "0000";
				    model.cmdType = "Comd";
				    model.cmdCatalog = "Set ";
				    model.queryString = { "alarmType": type };
				    model.callbackFun = function (sendObj, backObj) {//成功调用
				        //执行页面回调
				    }
				    SocketUtil.sendMessage(model);
				}
			);
        },
        /*空气警报间隔*/
        SeSubscribeKQ_Time: function (time) {
            var check = this.checkVal; check();

            this.AddNewModule("AQ00",
				function () {//设置订阅
				    var model = new SocketUtil.sendModel();
				    model.gatewayId = gatewayId;
				    model.moduleId = "AQ00";
				    model.moduleIndex = "0000";
				    model.cmdType = "Comd";
				    model.cmdCatalog = "Set ";
				    model.queryString = { "msgInterval": time };
				    model.callbackFun = function (sendObj, backObj) {//成功调用
				        //执行页面回调
				    }
				    SocketUtil.sendMessage(model);
				}
			);
        },
        /*电池警报选择开关*/
        SeSubscribeDC_Select: function (state) {
            var check = this.checkVal; check();

            this.AddNewModule("BTT0",
               function () {//设置订阅
                   var model = new SocketUtil.sendModel();
                   model.gatewayId = gatewayId;
                   model.moduleId = "BTT0";
                   model.moduleIndex = "0000";
                   model.cmdType = "Comd";
                   model.cmdCatalog = "Subs";
                   model.queryString = { "alarmL": "subscribe" };
                   model.callbackFun = function (sendObj, backObj) {//成功调用
                       //执行页面回调
                   }
                   if (state != "on") {
                       model.queryString.alarmL = "unsubscribe";
                   }
                   SocketUtil.sendMessage(model);
               }
           );

        },
        /*电池警报类型*/
        SeSubscribeDC_Type: function (type) {
            var check = this.checkVal; check();

            this.AddNewModule("BTT0",
				function () {//设置订阅
				    var model = new SocketUtil.sendModel();
				    model.gatewayId = gatewayId;
				    model.moduleId = "BTT0";
				    model.moduleIndex = "0000";
				    model.cmdType = "Comd";
				    model.cmdCatalog = "Set ";
				    model.queryString = { "alarmType": type };
				    model.callbackFun = function (sendObj, backObj) {//成功调用
				        //执行页面回调
				    }
				    SocketUtil.sendMessage(model);
				}
			);
        },
        /*电池警报间隔*/
        SeSubscribeDC_Time: function (time) {
            var check = this.checkVal; check();

            this.AddNewModule("BTT0",
				function () {//设置订阅
				    var model = new SocketUtil.sendModel();
				    model.gatewayId = gatewayId;
				    model.moduleId = "BTT0";
				    model.moduleIndex = "0000";
				    model.cmdType = "Comd";
				    model.cmdCatalog = "Set ";
				    model.queryString = { "msgInterval": time };
				    model.callbackFun = function (sendObj, backObj) {//成功调用
				        //执行页面回调
				    }
				    SocketUtil.sendMessage(model);
				}
			);
        },
        /*温度报警选择开关*/
        SeSubscribeTemp_Select: function (state) {
            var check = this.checkVal; check();

            this.AddNewModule("TMP0",
				function () {//设置订阅
				    var model = new SocketUtil.sendModel();
				    model.gatewayId = gatewayId;
				    model.moduleId = "TMP0";
				    model.moduleIndex = "0000";
				    model.cmdType = "Comd";
				    model.cmdCatalog = "Subs";
				    model.queryString = { "alarmH": "subscribe" };
				    model.callbackFun = function (sendObj, backObj) {//成功调用
				        //执行页面回调
				    }
				    if (state != "on") {
				        model.queryString.alarmH = "unsubscribe";
				    }
				    SocketUtil.sendMessage(model);
				}
			);
        },
        /*温度报警类型*/
        SeSubscribeTemp_Type: function (type) {
            var check = this.checkVal; check();

            this.AddNewModule("TMP0",
				function () {//设置订阅
				    var model = new SocketUtil.sendModel();
				    model.gatewayId = gatewayId;
				    model.moduleId = "TMP0";
				    model.moduleIndex = "0000";
				    model.cmdType = "Comd";
				    model.cmdCatalog = "Set ";
				    model.queryString = { "alarmType": type };
				    model.callbackFun = function (sendObj, backObj) {//成功调用
				        //执行页面回调
				    }
				    SocketUtil.sendMessage(model);
				}
			);
        },
        /*温度报警间隔*/
        SeSubscribeTemp_Time: function (time) {
            var check = this.checkVal; check();

            this.AddNewModule("TMP0",
				function () {//设置订阅
				    var model = new SocketUtil.sendModel();
				    model.gatewayId = gatewayId;
				    model.moduleId = "TMP0";
				    model.moduleIndex = "0000";
				    model.cmdType = "Comd";
				    model.cmdCatalog = "Set ";
				    model.queryString = { "msgInterval": time };
				    model.callbackFun = function (sendObj, backObj) {//成功调用
				        //执行页面回调
				    }
				    SocketUtil.sendMessage(model);
				}
			);
        },
        /*温度上限*/
        SeSubscribeTemp_Max: function (max) {
            var check = this.checkVal; check();

            this.AddNewModule("TMP0",
				function () {//设置订阅
				    var model = new SocketUtil.sendModel();
				    model.gatewayId = gatewayId;
				    model.moduleId = "TMP0";
				    model.moduleIndex = "0000";
				    model.cmdType = "Comd";
				    model.cmdCatalog = "Set ";
				    model.queryString = { "alarmH": (max * 1000) };
				    model.callbackFun = function (sendObj, backObj) {//成功调用
				        //执行页面回调
				    }
				    SocketUtil.sendMessage(model);
				}
			);
        },
        /*温度下限*/
        SeSubscribeTemp_Min: function (min) {
            var check = this.checkVal; check();

            this.AddNewModule("TMP0",
				function () {//设置订阅
				    var model = new SocketUtil.sendModel();
				    model.gatewayId = gatewayId;
				    model.moduleId = "TMP0";
				    model.moduleIndex = "0000";
				    model.cmdType = "Comd";
				    model.cmdCatalog = "Set ";
				    model.queryString = { "alarmL": (min * 1000) };
				    model.callbackFun = function (sendObj, backObj) {//成功调用
				        //执行页面回调
				    }
				    SocketUtil.sendMessage(model);
				}
			);
        },


        /*重启魔方*/
        MBRestart: function () {
            var check = this.checkVal; check();

            var model = new this.sendModel();
            model.gatewayId = gatewayId;
            model.identify = "0045";
            model.moduleId = "SYS0";
            model.moduleIndex = "0000";
            model.actionId = "SYS0";
            model.actionIndex = "0000";
            model.cmdType = "Comd";
            model.cmdCatalog = "Set ";
            model.queryString = { "reboot": "1" };
            this.sendMessage(model);
        },
        /*魔方配置保存*/
        MBConfBackup: function (time) {
            var check = this.checkVal; check();

            var model = new this.sendModel();
            model.gatewayId = gatewayId;
            model.identify = "0044";
            model.moduleId = "SYS0";
            model.moduleIndex = "0000";
            model.actionId = "SYS0";
            model.actionIndex = "0000";
            model.cmdType = "Comd";
            model.cmdCatalog = "Set ";
            model.queryString = { "save": time };
            this.sendMessage(model);
        },
        /*魔方配置还原*/
        MBConfLoad: function (time) {
            var check = this.checkVal; check();

            var model = new this.sendModel();
            model.gatewayId = gatewayId;
            model.identify = "0047";
            model.moduleId = "SYS0";
            model.moduleIndex = "0000";
            model.actionId = "SYS0";
            model.actionIndex = "0000";
            model.cmdType = "Comd";
            model.cmdCatalog = "Set ";
            model.queryString = { "restore": time };
            this.sendMessage(model);
        },
        /*魔方配置初始化*/
        MBReset: function () {
            var check = this.checkVal; check();

            var model = new this.sendModel();
            model.gatewayId = gatewayId;
            model.identify = "0048";
            model.moduleId = "SYS0";
            model.moduleIndex = "0000";
            model.actionId = "SYS0";
            model.actionIndex = "0000";
            model.cmdType = "Comd";
            model.cmdCatalog = "Set ";
            model.queryString = { "factory": "1" };
            this.sendMessage(model);
        },
        /*魔方固件升级*/
        MBUpgrade: function (version) {
            var check = this.checkVal; check();

            var model = new this.sendModel();
            model.gatewayId = gatewayId;
            model.identify = "0046";
            model.moduleId = "SYS0";
            model.moduleIndex = "0000";
            model.actionId = "SYS0";
            model.actionIndex = "0000";
            model.cmdType = "Comd";
            model.cmdCatalog = "Set ";
            model.queryString = { "update": version };
            this.sendMessage(model);
        },
        /*获取智能插座的状态*/
        GeZigbeeSocket: function () {
            var check = this.checkVal; check();

            var model = new this.sendModel();
            model.gatewayId = gatewayId;
            model.identify = "0035";
            model.moduleId = "SS00";
            model.moduleIndex = serial;
            model.cmdType = "Comd";
            model.cmdCatalog = "Get ";
            model.queryString = { "switch": "" };
            this.sendMessage(model);
        },
        /*获取智能插座的日程状态*/
        GeZigbeeSocketTime: function () {
            var check = this.checkVal; check();

            var model = new this.sendModel();
            model.gatewayId = gatewayId;
            model.identify = "003d";
            model.moduleId = "CAL0";
            model.moduleIndex = serial;
            model.cmdType = "Comd";
            model.cmdCatalog = "Get ";
            model.queryString = { "index": "003d", "enable": "" };
            this.sendMessage(model);
        },
        /*获取智能开关的状态*/
        GeZigbeeSwitch: function () {
            var check = this.checkVal; check();

            var model = new this.sendModel();
            model.gatewayId = gatewayId;
            model.identify = "0036";
            model.moduleId = "SW00";
            model.moduleIndex = serial;
            model.cmdType = "Comd";
            model.cmdCatalog = "Get ";
            model.queryString = { "switch": "" };
            this.sendMessage(model);
        },
        /*获取智能开关的日程状态*/
        GeZigbeeSwitchTime: function () {
            var check = this.checkVal; check();

            var model = new this.sendModel();
            model.gatewayId = gatewayId;
            model.identify = "003e";
            model.moduleId = "CAL0";
            model.moduleIndex = serial;
            model.cmdType = "Comd";
            model.cmdCatalog = "Get ";
            model.queryString = { "index": "003e", "enable": "" };
            this.sendMessage(model);
        },
        /*获取智能电灯的状态*/
        GeZigbeeLamp: function () {
            var check = this.checkVal; check();

            var model = new this.sendModel();
            model.gatewayId = gatewayId;
            model.identify = "0037";
            model.moduleId = "SLB0";
            model.moduleIndex = serial;
            model.cmdType = "Comd";
            model.cmdCatalog = "Get ";
            model.queryString = { "switch": "", "light": "", "color": "" };
            this.sendMessage(model);
        },
        /*设置智能插座的定时开关(time:时间格式00:03:00，state:on/off)*/
        SeZigbeeTimeSocket: function (time, state) {
            var check = this.checkVal; check();

            var model = new this.sendModel();
            model.gatewayId = gatewayId;
            model.identify = "0000";
            model.moduleId = "CAL0";
            model.moduleIndex = "0000";
            model.cmdType = "Comd";
            model.cmdCatalog = "Set ";
            model.queryString = { "group": "0", "index": "0", "enable": "0", "startDate": "20000101", "startTime": time, "period": "day", "distModule": "SS00", "DistSerial": serial, "power": state };
            if (state == "on") {
                model.queryString.enable = "1";
            }
            this.sendMessage(model);
        },
        /*设置智能插座开启/关闭(state:on/off)*/
        SeZigbeeSocket: function (state) {
            var check = this.checkVal; check();

            var model = new this.sendModel();
            model.gatewayId = gatewayId;
            model.identify = "0001";
            model.moduleId = "SS00";
            model.moduleIndex = serial;
            model.cmdType = "Comd";
            model.cmdCatalog = "Set ";
            model.queryString = { "switch": state };
            this.sendMessage(model);
        },
        /*设置智能开关的定时开关(time:时间格式，state:on/off)*/
        SeZigbeeTimeSwitch: function (time, state) {
            var check = this.checkVal; check();

            var model = new this.sendModel();
            model.gatewayId = gatewayId;
            model.identify = "0002";
            model.moduleId = "CAL0";
            model.moduleIndex = "0000";
            model.cmdType = "Comd";
            model.cmdCatalog = "Set ";
            model.queryString = { "group": "0", "index": "0", "enable": "0", "startDate": "20000101", "startTime": time, "period": "day", "distModule": "SW00", "DistSerial": serial, "power": state };
            if (state == "on") {
                model.queryString.enable = "1";
            }
            this.sendMessage(model);
        },
        /*设置智能开关开启/关闭(state:on/off)*/
        SeZigbeeSwitch: function (state) {
            var check = this.checkVal; check();

            var model = new this.sendModel();
            model.gatewayId = gatewayId;
            model.identify = "0003";
            model.moduleId = "SW00";
            model.moduleIndex = serial;
            model.cmdType = "Comd";
            model.cmdCatalog = "Set ";
            model.queryString = { "switch": state };
            this.sendMessage(model);
        },
        /*设置智能电灯开启/关闭(state:on/off)*/
        SeZigbeeLamp: function (state) {
            var check = this.checkVal; check();

            var model = new this.sendModel();
            model.gatewayId = gatewayId;
            model.identify = "0004";
            model.moduleId = "SLB0";
            model.moduleIndex = serial;
            model.cmdType = "Comd";
            model.cmdCatalog = "Set ";
            model.queryString = { "switch": state };
            this.sendMessage(model);
        },
        /*设置智能电灯亮度*/
        SeZigbeeLampLight: function (light) {
            var check = this.checkVal; check();

            var model = new this.sendModel();
            model.gatewayId = gatewayId;
            model.identify = "0005";
            model.moduleId = "SLB0";
            model.moduleIndex = serial;
            model.cmdType = "Comd";
            model.cmdCatalog = "Set ";
            model.queryString = { "lumen": light };
            this.sendMessage(model);
        },
        /*设置智能电灯颜色*/
        SeZigbeeLampColor: function (color) {
            var check = this.checkVal; check();

            var model = new this.sendModel();
            model.gatewayId = gatewayId;
            model.identify = "0006";
            model.moduleId = "SLB0";
            model.moduleIndex = serial;
            model.cmdType = "Comd";
            model.cmdCatalog = "Set ";
            model.queryString = { "color": color };
            this.sendMessage(model);
        },


        /*设置空调按钮*/
        SeCoAir: function (key, value) {
            var fun = function () {

                var model = new SocketUtil.sendModel();
                model.gatewayId = gatewayId;
                model.moduleId = "AC00";
                model.moduleIndex = serial;
                model.actionId = actionId;
                model.actionIndex = actionIndex;
                model.cmdType = "Comd";
                model.cmdCatalog = "Set ";
                model.queryString = { "method": "pressKey", "key": key };
                model.queryString[key] = value;
                SocketUtil.sendMessage(model);
            };
            var check = this.checkFunctionID; check("AC00", fun, true);
        },
        /*调高空调温度*/
        SeCoAirTempUp: function (temp) {
            var fun = function () {

                var model = new SocketUtil.sendModel();
                model.gatewayId = gatewayId;
                model.moduleId = "AC00";
                model.moduleIndex = serial;
                model.actionId = actionId;
                model.actionIndex = actionIndex;
                model.cmdType = "Comd";
                model.cmdCatalog = "Set ";
                model.queryString = { "method": "pressKey", "key": "tempUp", "temperature": temp };
                SocketUtil.sendMessage(model);
            };
            var check = this.checkFunctionID; check("AC00", fun, true);
        },
        /*调低空调温度*/
        SeCoAirTempDown: function (temp) {
            var fun = function () {

                var model = new SocketUtil.sendModel();
                model.gatewayId = gatewayId;
                model.moduleId = "AC00";
                model.moduleIndex = serial;
                model.actionId = actionId;
                model.actionIndex = actionIndex;
                model.cmdType = "Comd";
                model.cmdCatalog = "Set ";
                model.queryString = { "method": "pressKey", "key": "tempDown", "temperature": temp };
                SocketUtil.sendMessage(model);
            };
            var check = this.checkFunctionID; check("AC00", fun, true);
        },
        /*设置电视按钮*/
        SeCoTV: function (key) {
            //WRJW003f719595620016SRV00000        Rspn0000    &function=#TV000000
            var fun = function () {

                var model = new SocketUtil.sendModel();
                model.gatewayId = gatewayId;
                model.moduleId = "TV00";
                model.moduleIndex = serial;
                model.actionId = actionId;
                model.actionIndex = actionIndex;
                model.cmdType = "Comd";
                model.cmdCatalog = "Set ";
                model.queryString = { "method": "pressKey", "key": key };
                SocketUtil.sendMessage(model);
            };
            var check = this.checkFunctionID; check("TV00", fun, true);
        },

        /*机顶盒或IPTV按钮*/
        SeCoSTBORIPTV: function (device, key) {
            var fun = function () {

                var model = new SocketUtil.sendModel();
                model.gatewayId = gatewayId;
                model.moduleId = device;
                model.moduleIndex = serial;
                model.actionId = actionId;
                model.actionIndex = actionIndex;
                model.cmdType = "Comd";
                model.cmdCatalog = "Set ";
                model.queryString = { "method": "pressKey", "key": key };
                SocketUtil.sendMessage(model);
            };
            var check = this.checkFunctionID; check(device, fun, true);
        },

        /*电风扇开关*/
        SeCoFanSetupPower: function () {
            var fun = function () {

                var model = new SocketUtil.sendModel();
                model.gatewayId = gatewayId;
                model.moduleId = "FAN0";
                model.moduleIndex = serial;
                model.actionId = actionId;
                model.actionIndex = actionIndex;
                model.cmdType = "Comd";
                model.cmdCatalog = "Set ";
                model.queryString = { "method": "pressKey", "key": "power" };
                SocketUtil.sendMessage(model);
            };
            var check = this.checkFunctionID; check("FAN0", fun, true);
        },
        /*电风扇摇头*/
        SeCoFanSetupOscillate: function () {
            var fun = function () {

                var model = new SocketUtil.sendModel();
                model.gatewayId = gatewayId;
                model.moduleId = "FAN0";
                model.moduleIndex = serial;
                model.actionId = actionId;
                model.actionIndex = actionIndex;
                model.cmdType = "Comd";
                model.cmdCatalog = "Set ";
                model.queryString = { "method": "pressKey", "key": "oscillate" };
                SocketUtil.sendMessage(model);
            }
            var check = this.checkFunctionID; check("FAN0", fun, true);
        },
        /*电风扇高档*/
        SeCoFanSetupHigh: function () {
            var fun = function () {
                var model = new SocketUtil.sendModel();
                model.gatewayId = gatewayId;
                model.moduleId = "FAN0";
                model.moduleIndex = serial;
                model.actionId = actionId;
                model.actionIndex = actionIndex;
                model.cmdType = "Comd";
                model.cmdCatalog = "Set ";
                model.queryString = { "method": "pressKey", "key": "power" };
                SocketUtil.sendMessage(model);

                var model = new SocketUtil.sendModel();
                model.gatewayId = gatewayId;
                model.moduleId = "FAN0";
                model.moduleIndex = serial;
                model.actionId = actionId;
                model.actionIndex = actionIndex;
                model.cmdType = "Comd";
                model.cmdCatalog = "Set ";
                model.queryString = { "method": "pressKey", "key": "speed", "high": "1" };
                SocketUtil.sendMessage(model);
            }
            var check = this.checkFunctionID; check("FAN0", fun, true);
        },
        /*电风扇中档*/
        SeCoFanSetupMiddle: function () {
            var fun = function () {
                var model = new SocketUtil.sendModel();
                model.gatewayId = gatewayId;
                model.moduleId = "FAN0";
                model.moduleIndex = serial;
                model.actionId = actionId;
                model.actionIndex = actionIndex;
                model.cmdType = "Comd";
                model.cmdCatalog = "Set ";
                model.queryString = { "method": "pressKey", "key": "power" };
                SocketUtil.sendMessage(model);

                var model = new SocketUtil.sendModel();
                model.gatewayId = gatewayId;
                model.moduleId = "FAN0";
                model.moduleIndex = serial;
                model.actionId = actionId;
                model.actionIndex = actionIndex;
                model.cmdType = "Comd";
                model.cmdCatalog = "Set ";
                model.queryString = { "method": "pressKey", "key": "speed", "middle": "1" };
                SocketUtil.sendMessage(model);
            }
            var check = this.checkFunctionID; check("FAN0", fun, true);
        },
        /*电风扇低档*/
        SeCoFanSetupLow: function () {
            var fun = function () {
                var model = new SocketUtil.sendModel();
                model.gatewayId = gatewayId;
                model.moduleId = "FAN0";
                model.moduleIndex = serial;
                model.actionId = actionId;
                model.actionIndex = actionIndex;
                model.cmdType = "Comd";
                model.cmdCatalog = "Set ";
                model.queryString = { "method": "pressKey", "key": "power" };
                SocketUtil.sendMessage(model);

                var model = new SocketUtil.sendModel();
                model.gatewayId = gatewayId;
                model.moduleId = "FAN0";
                model.moduleIndex = serial;
                model.actionId = actionId;
                model.actionIndex = actionIndex;
                model.cmdType = "Comd";
                model.cmdCatalog = "Set ";
                model.queryString = { "method": "pressKey", "key": "speed", "low": "1" };
                SocketUtil.sendMessage(model);
            }
            var check = this.checkFunctionID; check("FAN0", fun, true);
        },
        /*电风扇定时*/
        SeCoFanSetupTime: function (time) {

            var check = this.checkVal; check();
            var date = time.getFullYear() + Util.SetFormat((time.getMonth() + 1), 2, "l") + Util.SetFormat(time.getDate(), 2, "l");
            var h = Util.SetFormat(time.getHours(), 2, "l") + ":" + Util.SetFormat(time.getMinutes(), 2, "l") + ":" + Util.SetFormat(time.getSeconds(), 2, "l");

            var model = new this.sendModel();
            model.gatewayId = gatewayId;
            model.identify = "0022";
            model.moduleId = "CAL0";
            model.moduleIndex = "0000";
            model.actionId = "CAL0";
            model.actionIndex = "0000";
            model.cmdType = "Comd";
            model.cmdCatalog = "Set ";
            model.queryString = { "group": "0", "index": "0", "enable": "1", "startDate": date, "startTime": h, "period": "none", "distModule": "FAN0", "DistSerial": serial, "power": "1" };
            this.sendMessage(model);
        },
        /*电风扇模式*/
        SeCoFanSetupMode: function () {
            var fun = function () {

                var model = new SocketUtil.sendModel();
                model.gatewayId = gatewayId;
                model.moduleId = "FAN0";
                model.moduleIndex = serial;
                model.actionId = actionId;
                model.actionIndex = actionIndex;
                model.cmdType = "Comd";
                model.cmdCatalog = "Set ";
                model.queryString = { "method": "pressKey", "key": "mode" };
                SocketUtil.sendMessage(model);
            }
            var check = this.checkFunctionID; check("FAN0", fun, true);
        },

        /*DVD按钮*/
        SeCoDVD: function (key) {
            var fun = function () {

                var model = new SocketUtil.sendModel();
                model.gatewayId = gatewayId;
                model.moduleId = "DVD0";
                model.moduleIndex = serial;
                model.actionId = actionId;
                model.actionIndex = actionIndex;
                model.cmdType = "Comd";
                model.cmdCatalog = "Set ";
                model.queryString = { "method": "pressKey", "key": key };
                SocketUtil.sendMessage(model);
            }
            var check = this.checkFunctionID; check("DVD0", fun, true);
        },

        /*Projector 投影仪*/
        SeProjector: function (key) {
            var fun = function () {

                var model = new SocketUtil.sendModel();
                model.gatewayId = gatewayId;
                model.moduleId = "PRJ0";
                model.moduleIndex = serial;
                model.actionId = actionId;
                model.actionIndex = actionIndex;
                model.cmdType = "Comd";
                model.cmdCatalog = "Set ";
                model.queryString = { "method": "pressKey", "key": key };
                SocketUtil.sendMessage(model);
            }
            var check = this.checkFunctionID; check("PRJ0", fun, true);
        },
        //学习命令
        StudyKey: function (module, key) {
            var fun = function () {
                var model = new SocketUtil.sendModel();
                model.gatewayId = gatewayId;
                model.moduleId = module;
                model.moduleIndex = serial;
                model.actionId = actionId;
                model.actionIndex = actionIndex;
                model.cmdType = "Comd";
                model.cmdCatalog = "Set ";
                model.queryString = { "method": "learn", "key": key };
                model.callbackFun = function (sendObj, backObj) {
                    for (var arr in backObj) {
                        if (arr.indexOf("Rspn0000") > -1) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                }
                SocketUtil.sendMessage(model);
            }
            var check = this.checkFunctionID; check(module, fun, false);
        },

        //增加自定义按钮
        AddUserBtn: function (moduleId, key) {
            var fun = function () {
                var model = new SocketUtil.sendModel();
                model.gatewayId = gatewayId;
                model.moduleId = moduleId;
                model.moduleIndex = serial;
                model.actionId = actionId;
                model.actionIndex = actionIndex;
                model.cmdType = "Comd";
                model.cmdCatalog = "Set ";
                model.queryString = { "method": "addKey", "key": key };
                SocketUtil.sendMessage(model);
            }
            var check = this.checkFunctionID; check(moduleId, fun, false);
        },
        //删除自定义按钮
        DeleteUserBtn: function (moduleId, key) {
            var fun = function () {
                var model = new SocketUtil.sendModel();
                model.gatewayId = gatewayId;
                model.moduleId = moduleId;
                model.moduleIndex = serial;
                model.actionId = actionId;
                model.actionIndex = actionIndex;
                model.cmdType = "Comd";
                model.cmdCatalog = "Set ";
                model.queryString = { "method": "delKey", "key": key };
                SocketUtil.sendMessage(model);
            }
            var check = this.checkFunctionID; check(moduleId, fun, false);
        },
        //自定义按钮发送命令
        SendUserBtn: function (device, key) {
            var fun = function () {
                var model = new SocketUtil.sendModel();
                model.gatewayId = gatewayId;
                model.moduleId = device;
                model.moduleIndex = serial;
                model.actionId = device;
                model.actionIndex = serial;
                model.cmdType = "Comd";
                model.cmdCatalog = "Set ";
                model.queryString = { "method": "pressKey", "key": key };
                SocketUtil.sendMessage(model);
            }
            var check = this.checkFunctionID; check(device, fun, true);
        },


        /*删除非魔方设备*/
        DeleteDevice: function (deviceId, module, gateId, serial, fun) {
            var len = module.length;
            module = module.toUpperCase();
            while (len < 4) {
                module = module + "0";
                len++;
            }

            var parentM = "IRRC";
            if (module == "SS00" || module == "SW00" || module == "SLB0") {
                parentM = "ZB00";
            }

            var model = new this.sendModel();
            model.gatewayId = gateId;
            model.moduleId = parentM;
            model.moduleIndex = "0000";
            model.actionId = parentM;
            model.actionIndex = "0000";
            model.cmdType = "Comd";
            model.cmdCatalog = "DelD";
            model.queryString = { "module": module, "serial": serial };
            model.callbackFun = function (sendObj, backObj) {
                if (backObj.command.indexOf(Cons.Rspn_Suc) < 0) {
                    new Piece.Toast(I18n.Common.deleteError);
                    return;
                }
                else {
                    fun();
                }
            }
            this.sendMessage(model);
        },
        /*修改非魔方设备名称*/
        EditDevice: function (name, module, gatewayId, serial, fun) {
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
            model.cmdCatalog = "Get ";
            model.queryString = { "function": "" };
            model.sock = this;
            model.callbackFun = function (sendObj, backObj) {
                for (var arr in backObj) {
                    if (arr.indexOf("function") > -1) {
                        actionId = backObj[arr].substr(1, 4);
                        actionIndex = backObj[arr].substr(5, 4);
                        var model = new SocketUtil.sendModel();
                        model.gatewayId = gatewayId;
                        model.moduleId = module;
                        model.moduleIndex = serial;
                        model.actionId = module;
                        model.actionIndex = actionIndex;
                        model.cmdType = "Comd";
                        model.cmdCatalog = "Get ";
                        model.queryString = { "function": "" };
                        model.sock = this;
                        model.callbackFun = function (sendObj, backObj) {
                            for (var arr in backObj) {
                                if (arr.indexOf("function") > -1) {
                                    actionId = backObj[arr].substr(1, 4);
                                    actionIndex = backObj[arr].substr(5, 4);
                                    var model = new SocketUtil.sendModel();
                                    model.gatewayId = gatewayId;
                                    model.moduleId = module;
                                    model.moduleIndex = serial;
                                    model.actionId = actionId;
                                    model.actionIndex = actionIndex;
                                    model.cmdType = "Comd";
                                    model.cmdCatalog = "Set ";
                                    model.queryString = { "name": name };
                                    model.callbackFun = function (sendObj, backObj) {
                                        if (backObj.command.indexOf(Cons.Rspn_Suc) < 0) {
                                            new Piece.Toast(I18n.Common.deleteError);
                                            return;
                                        }
                                        else {
                                            fun();
                                        }
                                    }
                                    SocketUtil.sendMessage(model);
                                    break;
                                }
                            }
                        }
                        SocketUtil.sendMessage(model);
                        break;
                    }
                }
            }
            SocketUtil.sendMessage(model);
        },
        /*新增zigbee设备*/
        AddZigbeeDevice: function (name, module, gateId, pinCode) {
            var model = new this.sendModel();
            model.gatewayId = gateId;
            model.identify = "0041";
            model.moduleId = "ZB00";
            model.moduleIndex = "0000";
            model.cmdType = "Comd";
            model.cmdCatalog = "Get ";
            model.queryString = { "device": "" };
            this.sendMessage(model);
        },
        /*新增自动匹配的红外设备*/
        AddDeviceAuto: function (baseCodeIndex, brandId, autoSearchId, name, module, gateId) {
            var len = module.length;
            module = module.toUpperCase();
            while (len < 4) {
                module = module + "0";
                len++;
            }


            var model = new this.sendModel();
            model.gatewayId = gateId;
            model.identify = "0042";
            model.moduleId = "IRRC";
            model.moduleIndex = "0000";
            model.actionId = "IRRC";
            model.actionIndex = "0000";
            model.cmdType = "Comd";
            model.cmdCatalog = "AddD";
            model.queryString = { "brandId": brandId, "autoSearchIndex": autoSearchId, "serial": "", "name": name, "module": module };
            this.sendMessage(model);
        },
        /*新增手动添加的红外设备*/
        AddDevice: function (brandId, modelId, name, module, gateId) {
            var len = module.length;
            module = module.toUpperCase();
            while (len < 4) {
                module = module + "0";
                len++;
            }

            var model = new this.sendModel();
            model.gatewayId = gateId;
            model.identify = "0043";
            model.moduleId = "IRRC";
            model.moduleIndex = "0000";
            model.cmdType = "Comd";
            model.cmdCatalog = "AddD";
            model.queryString = { "brandId": brandId, "modelId": modelId, "name": name, "serial": "", "module": module };
            this.sendMessage(model);
        },
        //日程添加命令，modeIndex暂定范围60-69
        //网关在本地存储中的索引编号、情景编号，网关、命令类别、命令、情景对象(此处没有修改)
        QJSetModeNew: function (gateIndex, modeIndex, gatewayId, calType, ordersArray, mode) {
            var queryArray = new Array();
            queryArray = { "method": "addcal", "group": "", "type": calType, "package": "0", "enable": "0" };
            if (calType == 0) {//日程则追加时间命令
                if (mode.startTime != null) {
                    var date = new Date(mode.startTime);
                    queryArray["StartDate"] = date.getFullYear() + Util.SetFormat((date.getMonth() + 1), 2, "l") + Util.SetFormat(date.getDate(), 2, "l");
                    queryArray["startTime"] = Util.SetFormat(date.getHours(), 2, "l") + ":" + Util.SetFormat(date.getMinutes(), 2, "l") + ":" + Util.SetFormat(date.getSeconds(), 2, "l");
                }
                if (mode.endTime != null) {
                    var date = new Date(mode.endTime);
                    queryArray["stopDate"] = date.getFullYear() + Util.SetFormat((date.getMonth() + 1), 2, "l") + Util.SetFormat(date.getDate(), 2, "l");
                    queryArray["stoptime"] = Util.SetFormat(date.getHours(), 2, "l") + ":" + Util.SetFormat(date.getMinutes(), 2, "l") + ":" + Util.SetFormat(date.getSeconds(), 2, "l");
                }
                if (mode.period != null) {
                    queryArray["period"] = mode.period;
                }
                if (mode.period == "week" && mode.week != null) {
                    queryArray["week"] = mode.week.join("");
                }
            }
            var num = 0;
            var order = "";
            var query = queryArray;
            for (var i = 0; i < ordersArray.length; i++) {
                query = queryArray;
                query["index0000"] = ordersArray[i];
                var model = new SocketUtil.sendModel();
                model.gatewayId = gatewayId;
                model.moduleId = "CAL0";
                model.moduleIndex = "0000";
                model.actionId = "CAL0";
                model.actionIndex = "0000";
                model.cmdType = "Comd";
                model.cmdCatalog = "Set ";
                model.queryString = query;
                model.callbackFun = function (sendObj, backObj) {
                    var cmds = Piece.Store.loadObject("ModeCmds", true);
                    for (var i = 0; i < cmds.length; i++) {
                        if (cmds[i].modeIndex == modeIndex && cmds[i].gateIndex == gateIndex) {
                            cmds[i].groupIds[cmds[i].groupIds.length] = backObj.group;
                        }
                    }
                    Piece.Store.saveObject("ModeCmds", cmds, true);
                }
                this.sendMessage(model);
            }
        },

        //日程添加命令，modeIndex暂定范围60-69
        //网关在本地存储中的索引编号、情景编号，网关、命令类别、命令、情景对象(此处没有修改)
        QJSetMode: function (gateIndex, modeIndex, gatewayId, calType, ordersArray, mode) {
            var orders = new Array();
            var orderHead = "";
            if (calType != 0) {//非日程的命令
                orderHead = "WRJWllll        " + Util.SetFormat(gateIndex, 2, "l") + Util.SetFormat(modeIndex, 2, "l") + "CAL00000CAL00000ComdSet     &method=addcal&group=&type=" + calType + "&package=0&enable=0";
            } else {//日程则追加时间命令
                orderHead = "WRJWllll        " + Util.SetFormat(gateIndex, 2, "l") + Util.SetFormat(modeIndex, 2, "l") + "CAL00000CAL00000ComdSet     &method=addcal&group=&type=" + calType + "&package=0&enable=0";
                if (mode.startTime != null) {
                    var date = new Date(mode.startTime);
                    orderHead += ("&StartDate=" + date.getFullYear() + Util.SetFormat((date.getMonth() + 1), 2, "l") + Util.SetFormat(date.getDate(), 2, "l"));
                    orderHead += ("&startTime=" + Util.SetFormat(date.getHours(), 2, "l") + ":" + Util.SetFormat(date.getMinutes(), 2, "l") + ":" + Util.SetFormat(date.getSeconds(), 2, "l"));
                }
                if (mode.endTime != null) {
                    var date = new Date(mode.endTime);
                    orderHead += ("&stopDate=" + date.getFullYear() + Util.SetFormat((date.getMonth() + 1), 2, "l") + Util.SetFormat(date.getDate(), 2, "l"));
                    orderHead += ("&stoptime=" + Util.SetFormat(date.getHours(), 2, "l") + ":" + Util.SetFormat(date.getMinutes(), 2, "l") + ":" + Util.SetFormat(date.getSeconds(), 2, "l"));
                }
                if (mode.period != null)
                    orderHead += ("&period=" + mode.period);
                if (mode.period == "week" && mode.week != null)
                    orderHead += ("&week=" + mode.week.join(""));
            }
            var num = 0;
            var order = "";
            for (var i = 0; i < ordersArray.length; i++) {
                var oldNum = num;
                num = Util.SetFormat(++num, 3, "l");
                var oldOrder = order;
                order += "&index" + num + "=" + ordersArray[i];
                if (Util.GetStrByteLen(order) > (MaxLen - Util.GetStrByteLen(orderHead))
				   && parseInt(num) > 1)//单个设备不考虑长度超出
                {
                    orders[orders.length] = orderHead + "&devCnt=" + (parseInt(num) - 1) + oldOrder;
                    order = "";
                    i--;
                    num = 0;
                }
            }
            orders[orders.length] = orderHead + "&devCnt=" + parseInt(num) + order;
            //发命令
            for (var i = 0; i < orders.length; i++) {
                Util.sockSendData("/exchange/magicbox.exchange/magicbox." + gatewayId, Util.ConvertToOrder(orders[i]));
            }

        },
        //启动日程
        QJStartMode: function (gatewayId, groupId) {
            var model = new this.sendModel();
            model.gatewayId = gatewayId;
            model.identify = "0053";
            model.moduleId = "CAL0";
            model.moduleIndex = "0000";
            model.actionId = "CAL0";
            model.actionIndex = "0000";
            model.cmdType = "Comd";
            model.cmdCatalog = "Set ";
            model.queryString = { "enable": "1", "group": groupId };
            this.sendMessage(model);
        },
        //关闭日程
        QJEndMode: function (gatewayId, groupId) {
            var model = new this.sendModel();
            model.gatewayId = gatewayId;
            model.identify = "0054";
            model.moduleId = "CAL0";
            model.moduleIndex = "0000";
            model.actionId = "CAL0";
            model.actionIndex = "0000";
            model.cmdType = "Comd";
            model.cmdCatalog = "Set ";
            model.queryString = { "enable": "0", "group": groupId };
            this.sendMessage(model);
        },
        //删除日程
        QJDeleteMode: function (gatewayId, groupId) {
            var model = new this.sendModel();
            model.gatewayId = gatewayId;
            model.identify = "0055";
            model.moduleId = "CAL0";
            model.moduleIndex = "0000";
            model.actionId = "CAL0";
            model.actionIndex = "0000";
            model.cmdType = "Comd";
            model.cmdCatalog = "Set ";
            model.queryString = { "method": "delcal", "group": groupId };
            this.sendMessage(model);
        },

        /*获取温度*/
        GeTMP0Temperature: function () {
            var model = new this.sendModel();
            model.identify = "0209";
            model.moduleId = "TEMP";
            model.moduleIndex = Piece.Cache.get("serial");
            model.cmdType = "Comd";
            model.cmdCatalog = "Get ";
            model.queryString = { "temperature": "", "light": "" };
            this.sendMessage(model);
        },
        /*获取湿度*/
        GeHUM0Thumidity: function () {

            var model = new this.sendModel();
            model.identify = "0037";
            model.moduleId = "HUM0";
            model.moduleIndex = Piece.Cache.get("serial");
            model.cmdType = "Comd";
            model.cmdCatalog = "Rgs ";
            model.queryString = { "humiture": "register" };


            this.sendMessage(model);
        },

        /*设置摄像头*/
        SetCam:function(key,value){
            var fun = function () {
                var model = new SocketUtil.sendModel();
                model.gatewayId = gatewayId;
                model.moduleId = "CAM0";
                model.moduleIndex = serial;
                model.actionId = actionId;
                model.actionIndex = actionIndex;
                model.cmdType = "Comd";
                model.cmdCatalog = "Set ";
                model.queryString = { "key": key };
                model.queryString[key] = value;
                model.callbackFun = function (sendObj, obj) {
                    if (obj.command.indexOf("Rspn0000") < 0) {
                        if (key == "brightness") {
                            new Piece.Toast(I18n.Common.setCameraBrightnessFailed);
                        } else if (key == "contrast") {
                            new Piece.Toast(I18n.Common.setCameraContrastFailed);
                        } else if (key == "saturation") {
                            new Piece.Toast(I18n.Common.setMagixboxCameraFailed);
                        }
                    };
                };
                SocketUtil.sendMessage(model);
            };
            var check = this.checkCamFunctionID; check("CAM0", fun, false);
        },
        /*添加摄像头模块*/
        AddCam: function () {
            var model = new SocketUtil.sendModel();
            model.gatewayId = gatewayId;
            model.moduleId = Cons.MODULE_SYS;
            model.moduleIndex = "0000";
            model.actionId = Cons.MODULE_SYS;
            model.actionIndex = "0000";
            model.cmdType = Cons.Socket_Comd;
            model.cmdCatalog = Cons.Comd_Get;
            model.queryString = { "device": "" };
            model.callbackFun = function (sendObj, obj) {
                for (var arr in obj) {
                    if (arr.indexOf("CAM0") > -1) {//加载所有模块
                        if (obj[arr] == 'unset') {
                            var moduleN = arr.substr(0, 4);
                            var moduleS = arr.substr(4, 4);
                            serial = moduleS;
                            var model = new SocketUtil.sendModel();
                            model.gatewayId = gatewayId;
                            model.moduleId = Cons.MODULE_SYS;
                            model.moduleIndex = "0000";
                            model.actionId = Cons.MODULE_SYS;
                            model.actionIndex = "0000";
                            model.cmdType = Cons.Socket_Comd;
                            model.cmdCatalog = "AddD";
                            model.queryString = { "module": moduleN, "serial": serial };
                            model.callbackFun = function (sendObj, obj) {
                                if (obj.command.indexOf("Rspn0000") < 0) {
                                    new Piece.Toast(I18n.Common.setMbVedioConnectionFailed);
                                    Piece.Cache.put("isIntranet", "1");
                                    return;
                                } else {
                                    //表示在局域网内
                                    Piece.Cache.put("isIntranet", "0");
                                }
                            }
                            SocketUtil.sendMessage(model);
                        } else if (obj[arr] == 'normal') {
                            break;
                        }
                    }
                }
            }
            SocketUtil.sendMessage(model);
        },
        /*获取设备列表*/
        GetDevices: function () {
            //从服务器取数据
            var user_token = Piece.Store.loadObject("user_token", true);
            var loginId = Piece.Store.loadObject("loginId", true);
            var access_token = user_token.accessToken;
            var equipList = new Array();
            var magicList = new Array();
            //调用异步方法获取数据
            var user_info = Piece.Store.loadObject("user_info", true);
            Util.AjaxWait(OpenAPI.readAllMagicBox,
                "GET",
                { access_token: access_token, userLoginId: loginId, dataType: 'jsonp' },
                'jsonp',
                function (data, textStatus, jqXHR) {
                    if (data.gatewaylist != null && data.gatewaylist.length > 0) {
                        for (var i = 0; i < data.gatewaylist.length; i++) {//缓存到本地
                            var serialt = (data.gatewaylist[i].serial == "" || data.gatewaylist[i].serial == null || data.gatewaylist[i].serial == undefined) ? data.gatewaylist[i].gatewayId : data.gatewaylist[i].serial;
                            var item = {
                                "loginId": loginId, "serial": serialt, "name": data.gatewaylist[i].gatewayName, "device": 'MagicBox',
                                "gatewayId": data.gatewaylist[i].gatewayId, "share": data.gatewaylist[i].share
                            };
                            magicList[magicList.length] = item;
                            equipList[equipList.length] = item;
                        }
                        if (magicList == undefined || magicList.length == 0) return;//假如没有魔方
                        //保存到缓存
                        Piece.Store.saveObject("magicList", magicList, true);
                        Piece.Store.saveObject("DeviceList", equipList, true);

                        var gatewayIndex = 0;
                        var fun = function () {
                            if (gatewayIndex <= magicList.length - 1) {
                                SocketUtil.getMagicDevices(magicList[gatewayIndex].gatewayId);
                                gatewayIndex++;
                            } else {
                                window.clearInterval(intev);
                            }
                        }
                        var intev = window.setInterval(fun, 0*100);//按时间间隔获取一个魔方设备
                    }
                }, function (e, xhr, type) {
                    // new Piece.Toast(I18n.Common.getUserMagicboxError);
                }
            );

        },
        getMagicDevices: function (gatewayId) {
            var equipList = Piece.Store.loadObject("DeviceList", true);
            var newArray = new Array();
            var loginId = Piece.Store.loadObject("loginId", true);
            var model = new SocketUtil.sendModel();
            model.gatewayId = gatewayId;
            model.moduleId = Cons.MODULE_SYS;
            model.moduleIndex = "0000";
            model.actionId = Cons.MODULE_SYS;
            model.actionIndex = "0000";
            model.cmdType = Cons.Socket_Comd;
            model.cmdCatalog = Cons.Comd_Get;
            model.queryString = { "device": "" };
            model.callbackFun = function (sendObj, obj) {
                var irrc = false;
                var irrcid = "0000";
                var zb = false;
                var zbid = "0000";
                for (var arr in obj) {
                    if (arr.indexOf("IRRC") > -1) {//红外模块
                        if (obj[arr].indexOf('normal') > -1) {
                            irrc = true;
                            irrcid = arr.substr(4, 4);
                        }
                    }
                    else if (arr.indexOf("ZB00") > -1) {//红外模块
                        if (obj[arr].indexOf('normal') > -1) {
                            zb = true;
                            zbid = arr.substr(4, 4);
                        }
                    }
                }

                if (irrc == true) {
                    var moduleN = "IRRC";
                    var moduleS = irrcid;
                    var model = new SocketUtil.sendModel();
                    model.gatewayId = gatewayId;
                    model.moduleId = moduleN;
                    model.moduleIndex = moduleS;
                    model.actionId = moduleN;
                    model.actionIndex = moduleS;
                    model.cmdType = Cons.Socket_Comd;
                    model.cmdCatalog = Cons.Comd_Get;
                    model.queryString = { "device": "" };
                    model.callbackFun = function (sendObj, obj) {
                        //处理红外设备
                        for (var arr in obj) {
                            if (obj[arr].indexOf('normal') > -1) {
                                var moduleN = arr.substr(0, 4);
                                var moduleS = arr.substr(4, 4);
                                var name = obj[arr].split('#')[1];
                                var item = { "loginId": loginId, "serial": moduleS, "name": name, "device": moduleN, "gatewayId": gatewayId, "deviceId": moduleS };
                                var ishave = false;
                                for (var i = 0; i < equipList.length; i++) {
                                    if (equipList[i].loginId == loginId
                                        && equipList[i].serial == item.serial
                                        && equipList[i].device == item.device
                                        && equipList[i].gatewayId == item.gatewayId) {
                                        ishave = true;
                                        break;
                                    }
                                }
                                if (ishave == false) {
                                    newArray[newArray.length] = item;
                                }
                            }
                        }
                        equipList = Piece.Store.loadObject("DeviceList", true);
                        for (var i = 0; i < newArray.length; i++)
                        {
                            equipList[equipList.length] = newArray[i];
                        }
                        Piece.Store.saveObject("DeviceList", equipList, true);//保存设备到缓存

                        //处理zigbee
                        if (zb == true) {
                            var moduleN = "ZB00";
                            var moduleS = zbid;
                            var model = new SocketUtil.sendModel();
                            model.gatewayId = gatewayId;
                            model.moduleId = moduleN;
                            model.moduleIndex = moduleS;
                            model.actionId = moduleN;
                            model.actionIndex = moduleS;
                            model.cmdType = Cons.Socket_Comd;
                            model.cmdCatalog = Cons.Comd_Get;
                            model.queryString = { "device": "" };
                            model.callbackFun = function (sendObj, obj) {
                                //处理zigbee设备
                                for (var arr in obj) {
                                    if (obj[arr].indexOf('normal') > -1) {
                                        var moduleN = arr.substr(0, 4);
                                        var moduleS = arr.substr(4, 4);
                                        var name = obj[arr].split('#')[1];
                                        var item = { "loginId": loginId, "serial": moduleS, "name": name, "device": moduleN, "gatewayId": gatewayId, "deviceId": moduleS };
                                        var ishave = false;
                                        for (var i = 0; i < equipList.length; i++) {
                                            if (equipList[i].loginId == loginId
                                            && equipList[i].serial == item.serial
                                            && equipList[i].device == item.device
                                            && equipList[i].gatewayId == item.gatewayId) {
                                                ishave = true;
                                                break;
                                            }
                                        }
                                        if (ishave == false) {
                                            newArray[newArray.length] = item;
                                        }
                                    }
                                }
                                equipList = Piece.Store.loadObject("DeviceList", true);
                                for (var i = 0; i < newArray.length; i++) {
                                    equipList[equipList.length] = newArray[i];
                                }
                                Piece.Store.saveObject("DeviceList", equipList, true);//保存设备到缓存
                            }
                            SocketUtil.sendMessage(model);
                        }
                    }
                    SocketUtil.sendMessage(model);
                } else {//处理zigbee
                    if (zb == true) {
                        var moduleN = "ZB00";
                        var moduleS = zbid;
                        var model = new SocketUtil.sendModel();
                        model.gatewayId = gatewayId;
                        model.moduleId = moduleN;
                        model.moduleIndex = moduleS;
                        model.actionId = moduleN;
                        model.actionIndex = moduleS;
                        model.cmdType = Cons.Socket_Comd;
                        model.cmdCatalog = Cons.Comd_Get;
                        model.queryString = { "device": "" };
                        model.callbackFun = function (sendObj, obj) {
                            //处理zigbee设备
                            for (var arr in obj) {
                                if (obj[arr].indexOf('normal') > -1) {
                                    var moduleN = arr.substr(0, 4);
                                    var moduleS = arr.substr(4, 4);
                                    var name = obj[arr].split('#')[1];
                                    var item = { "loginId": loginId, "serial": moduleS, "name": name, "device": moduleN, "gatewayId": gatewayId, "deviceId": moduleS };
                                    var ishave = false;
                                    for (var i = 0; i < equipList.length; i++) {
                                        if (equipList[i].loginId == loginId
                                        && equipList[i].serial == item.serial
                                        && equipList[i].device == item.device
                                        && equipList[i].gatewayId == item.gatewayId) {
                                            ishave = true;
                                            break;
                                        }
                                    }
                                    if (ishave == false) {
                                        newArray[newArray.length] = item;
                                    }
                                }
                            }
                            equipList = Piece.Store.loadObject("DeviceList", true);
                            for (var i = 0; i < newArray.length; i++) {
                                equipList[equipList.length] = newArray[i];
                            }
                            Piece.Store.saveObject("DeviceList", equipList, true);//保存设备到缓存
                        }
                        SocketUtil.sendMessage(model);
                    }
                }
            }
            SocketUtil.sendMessage(model);
        },

        /*获取一个socket对象*/
        sendModel: function () {
            var user_info = Piece.Store.loadObject("user_token", true);
            var _20space = "                    "; // 20 个空白
            var src = _20space;
            if (user_info != null || user_info.userId != null) {
                src = _20space.substring(0, _20space.length - (user_info.userId + "").length) + user_info.userId;
            }

            return {
                gatewayId: "",
                header: "WRJW",
                length: "llll",
                sendFrom: src,
                //sendTo: "    ",
                identify: "    ",
                moduleId: "    ",
                moduleIndex: "    ",
                actionId: "    ",
                actionIndex: "    ",
                cmdType: "    ",
                cmdCatalog: "    ",
                reserveString: "    ",
                queryString: {},
                sendTime: new Date(),
                callbackFun: null,
                timeoutFun: null
            };
        },
        padLeft: function (str, t, p) {
            str = str + "";
            var e = []; p = p || "0";
            for (var d = 0, a = t - str.length; d < a; d++) {
                e.push(p);
            }
            e.push(str).j;
            return e.join('');
        },
        /*组合命令*/
        sendBuilder: function (model) {
            var str = "";
            str += model.header;
            str += model.length;
            str += model.sendFrom;
            //str += model.sendTo;
            str += model.identify;
            str += model.moduleId;
            str += model.moduleIndex;
            str += model.actionId;
            str += model.actionIndex;
            str += model.cmdType;
            str += model.cmdCatalog;
            str += model.reserveString;
            for (var arr in model.queryString) {
                if (model.queryString[arr] == undefined || model.queryString[arr] == null || model.queryString[arr] == "") {
                    if (model.cmdCatalog == "Get ") {
                        str += "&" + arr;
                    } else {
                        str += "&" + arr + "=";
                    }
                } else {
                    str += "&" + arr + "=" + model.queryString[arr];
                }
            }
            str = Util.ConvertToOrder(str);
            return str;
        },
        /*发送命令*/
        sendMessage: function (model) {
            if (model.identify == "    ") {//自动生成
                model.identify = this.padLeft(sendIdf, 4, "0");
                sendData[sendData.length] = model;
                sendIdf += 1;
            }
            var cmdText = this.sendBuilder(model);
            var gatewayId = Piece.Cache.get("gatewayId");
            if (model.gatewayId != undefined && model.gatewayId != null && model.gatewayId != "") {
                gatewayId = model.gatewayId;
            }
            Util.sockSendData("/exchange/magicbox.exchange/magicbox." + gatewayId, cmdText);
        },
    };
    return SocketUtil;
});