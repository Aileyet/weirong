define(['text!home/CoLinkedList.html', '../base/templates/template', '../base/util', '../base/socketutil', '../base/schema', "../base/i18nMain"],
	function (viewTemplate, _TU, Util, SocketUtil, Schema, I18n) {
	    var onBackgroundColor = _TU._T.Color.checkbarColor;//粉红
	    var onBackgroundColor2 = "#dcdde0";
	    var linkedDevices = null;
	    var onLoadLinkedDeviceFunc = null;
	    var tempHtml = "";
	    var outTimer = null;
	    var loader = null;


	    var get4s = function (indexH) {
	        var indexSH = indexH + "";
	        while (indexSH.length < 4) {
	            indexSH = "0" + indexSH;
	        }
	        return indexSH;
	    };

	    var get3s = function (indexH) {
	        var indexSH = indexH + "";
	        while (indexSH.length < 3) {
	            indexSH = "0" + indexSH;
	        }
	        return indexSH;
	    };

	    return Piece.View.extend({
	        id: 'home_CoLinkedList',
	        events: {
	            "touchstart .nav-wrap-right": "onGoToFn"
	        },
	        onGoToFn: function (e) {
	            Backbone.history.navigate("home/CoLinkedDetails", {
	                trigger: true
	            });
	        },
	        render: function () {
	            $(this.el).html(viewTemplate);

	            Piece.View.prototype.render.call(this);
	            return this;
	        },
	        onLoadTemplate: function () {
	            _TU._U.setHeader(_TU._T.home_CoLinkedList);//替换头部导航
	            var userInfoTemplate = $(this.el).find("#home_CoLinkedList_Template").html();
	            var userInfoHtml = _.template(userInfoTemplate, _TU._T.home_CoLinkedList.data);
	            tempHtml = userInfoHtml;
	        },
	        onLoadLinkedDevice: function () {


	            linkedDevices = Piece.Store.loadObject("LinkedDevices", true);

	            //手工模拟元素
	            $(".content").html("");

	            if (linkedDevices != null) {
	                for (var i = 0; i < linkedDevices.length; i++) {
	                    var dd = $("<div>").html(tempHtml);
	                    $(dd).find(".icon-1").html("<i class='icon iconfont'>tmp</i>");
	                    $(dd).find(".icon-2").html(linkedDevices[i].Title);
	                    $(dd).find(".title-label").html(I18n.CoLinkedList.listenWhere.replace('%d', '温度') + linkedDevices[i].ListenWheres);
	                    if (linkedDevices[i].Enabled == 1) {
	                        $(dd).find(".div-slider").find(".div-slidering").css("float", "right");
	                        $(dd).find(".div-slider").css("background-color", onBackgroundColor);
	                    }
	                    var txt = "";//描述文字

	                    for (var j = 0; j < linkedDevices[i].ControlDevices.length; j++) {
	                        switch (linkedDevices[i].ControlDevices[j].device.toLocaleLowerCase()) {
	                            case "ac00"://空调
	                                txt += "," + I18n.CoLinkedList.ac;
	                                break;
	                            case "tv00"://电视
	                                txt += "," + I18n.CoLinkedList.tv;
	                                break;
	                            case "dvd0"://DVD
	                                txt += "," + I18n.CoLinkedList.dvd;
	                                break;
	                            case "stb0"://机顶盒
	                                txt += "," + I18n.CoLinkedList.stb;
	                                break;
	                            case "fan0"://电风扇
	                                txt += "," + I18n.CoLinkedList.fan;
	                                break;
	                            case "sw00"://开关
	                                txt += "," + I18n.CoLinkedList.sw;
	                            case "ss00"://插座
	                                txt += "," + I18n.CoLinkedList.ss;
	                                break;
	                            case "slb0"://电灯
	                                txt += "," + I18n.CoLinkedList.slb;
	                            case "iptv"://iptv
	                                txt += "," + I18n.CoLinkedList.iptv;
	                            case "prj"://投影仪
	                                txt += "," + I18n.CoLinkedList.prj;
	                        }
	                    }
	                    if (txt != "") txt = txt.substr(1);
	                    $(dd).find(".mag-label").html(I18n.CoLinkedList.aboutDevices + txt);

	                    $(dd).find(".cont-edit-2").attr("data-index", i);
	                    $(dd).find(".cont-edit-2").bind("tap", function () {//删除联动
	                        loader = new Piece.Loader({ autoshow: true, target: '.content' });
	                        outTimer = window.setTimeout(function () {
	                            loader.hideAll();
	                            Piece.Toast(I18n.CoLinkedList.setTimeOut);
	                        }, 1000 * 10);

	                        var index = $(this).attr("data-index");
	                        var findLinkedObj = linkedDevices[index];
	                        if (findLinkedObj.group == undefined || findLinkedObj.group == null) {//表示该日程没有被使用过，则直接删除缓存
	                            //从缓存中删除
	                            window.clearTimeout(outTimer);
	                            loader.hideAll();
	                            Piece.Toast(I18n.CoLinkedList.setSucess);
	                            linkedDevices.splice(index, 1);
	                            Piece.Store.saveObject("LinkedDevices", linkedDevices, true);
	                            onLoadLinkedDeviceFunc();
	                            return;
	                        }
	                        //发送命令禁止此联动
	                        var magicList = Piece.Store.loadObject("magicList", true);
	                        if (magicList != null) {
	                            for (var i = 0; i < magicList.length; i++) {
	                                var indexH = 1;
	                                var findDevice = false;
	                                var cmd = "";
	                                for (var j = 0; j < findLinkedObj.ControlDevices.length; j++) {
	                                    if (findLinkedObj.ControlDevices[j].gatewayId == magicList[i].gatewayId) {//拼接当前魔方数据
	                                        findDevice = true;
	                                        indexH += 1;
	                                        var CoObj = findLinkedObj.ControlDevices[j];
	                                        var order = "";
	                                        switch (CoObj.device.toLocaleLowerCase()) {
	                                            case "ac00"://空调
	                                                order = "#distModule=AC00#distSerial=" + CoObj.serial
                                                          + "#power=" + (CoObj.power == 0 ? "off" : "on")
	                                                if (CoObj.power == 1) {
	                                                    order = order
                                                        + "#mode=" + CoObj.mode
                                                        + "#temperature=" + CoObj.temperature
                                                        + "#airVolume=" + CoObj.airVolume
                                                        + "#airDir=" + CoObj.airDir
                                                        + "#autoDir=" + (CoObj.autoDir == 0 ? "off" : "on")
	                                                }
	                                                break;
	                                            case "tv00"://电视
	                                                order = "#distModule=TV00#distSerial=" + CoObj.serial
                                                          + "#power=1"
	                                                break;
	                                            case "dvd0"://DVD
	                                                order = "#distModule=DVD0#distSerial=" + CoObj.serial
                                                           + "#power=1"
	                                                if (CoObj.power == 1) {
	                                                    order += "#play=1"
	                                                }
	                                                break;
	                                            case "stb0"://机顶盒
	                                                order = "#distModule=STB0#distSerial=" + CoObj.serial
                                                           + "#power=1"
	                                                break;
	                                            case "fan0"://电风扇
	                                                order = "#distModule=FAN0#distSerial=" + CoObj.serial
                                                            + "#power=1"
	                                                if (CoObj.power == 1) {
	                                                    order = order
                                                        + "#oscillate=1"
                                                        + "#speed=" + CoObj.speed
	                                                }
	                                                break;
	                                            case "ss00"://插座
	                                                order = "#distModule=SS00#distSerial=" + CoObj.serial
                                                          + "#power=1"
	                                                break;
	                                            case "slb0"://电灯
	                                                order = "#distModule=SLB0#distSerial=" + CoObj.serial
														+ "#power=1"
	                                                if (CoObj.power == 1) {
	                                                    order = order
                                                        + "#light=" + CoObj.light
                                                        + "#color=" + CoObj.color
	                                                }
	                                                break;
	                                            case "iptv"://IPTV
	                                                order = "#distModule=IPTV#distSerial=" + CoObj.serial
                                                           + "#power=1"
	                                                break;
	                                            case "prj0"://投影仪
	                                                order = "#distModule=PRJ0#distSerial=" + CoObj.serial
                                                            + "#power=" + (CoObj.power == 0 ? "off" : "on")
	                                                if (CoObj.power == 1) {
	                                                    order = order
                                                        + "#pc=" + CoObj.pc
                                                        + "#video=" + CoObj.video
	                                                }
	                                                break;
	                                        }
	                                        cmd += "&index" + get3s(indexH) + "=#trigger=1" + order;
	                                    }
	                                }
	                                if (findDevice == true) {//该魔方下有联动设备
	                                    var enable = 0;
	                                    if (findLinkedObj.Enabled == undefined || findLinkedObj.Enabled == 0) {
	                                        enable = 1;
	                                    }
	                                    var eventName = "tempAlarmL";
	                                    if (findLinkedObj.ListenWheres.indexOf(">=") > -1) {//高报警
	                                        eventName = "tempAlarmH";
	                                    }
	                                    var gatewayId = magicList[i].serial;
	                                    var temp = findLinkedObj.ListenWheres.replace(">=", "").replace("<=", "");
	                                    socketRspnCallBack.func0916 = function (obj) {//定义回调函数
	                                        window.clearTimeout(outTimer);
	                                        loader.hideAll();
	                                        Piece.Toast(I18n.CoLinkedList.setSucess);
	                                        linkedDevices.splice(index, 1);
	                                        Piece.Store.saveObject("LinkedDevices", linkedDevices, true);
	                                        onLoadLinkedDeviceFunc();
	                                    }
	                                    //Util.sockSendData("/exchange/magicbox.exchange/magicbox."+gatewayId,Util.ConvertToOrder("WRJWllll        0003SYS00000SYS00000ComdAddD    &module=TMP0&serial=0000"));
	                                    //Util.sockSendData("/exchange/magicbox.exchange/magicbox."+gatewayId,Util.ConvertToOrder("WRJWllll        0914TMP00000TMP00000ComdSubs    &tempAlarmH=unsubscribe"));
	                                    //Util.sockSendData("/exchange/magicbox.exchange/magicbox."+gatewayId,Util.ConvertToOrder("WRJWllll        0915TMP00000TMP00000ComdSet     &tempAlarmH="+temp));

	                                    //Util.sockSendData("/exchange/magicbox.exchange/magicbox."+gatewayId,Util.ConvertToOrder("WRJWllll        0915SYS00000SYS00000ComdSet     &module=CAL0&serial=0000"));
	                                    //Util.sockSendData("/exchange/magicbox.exchange/magicbox."+gatewayId,Util.ConvertToOrder("WRJWllll        0916CAL00000CAL00000ComdSet     &method=addcal&&name=testCAL&devCnt=2&type=0&enable=1&startDate=20160225&startTime=14:00:00&stopDate=20160227&stopTime=11:45:00&period=day&index0000=#distModule=DBUG#distSerial=0000#distFunction=    #distFserial=0000#testaction=123456"));

	                                    //Util.sockSendData("/exchange/magicbox.exchange/magicbox."+gatewayId,Util.ConvertToOrder("WRJWllll        0917CAL00000CAL00000ComdSet     &method=addcal&group=&type=2&devCnt=2&package=0&enable=1&index0000=#srcModule=TMP0#srcSerial=0000#event=tempAlarmH#distModule=TV00#distSerial=0003#power=1"));


	                                    //Util.sockSendData("/exchange/magicbox.exchange/magicbox."+gatewayId,Util.ConvertToOrder("WRJWllll        0916CAL00001CAL00000ComdSet     &method=delcal&group="+findLinkedObj.group+"&type=2&devCnt=2&package=0&enable="+enable+"&index001=#srcModule=TEMP#srcSerial=0000#event="+methodName+cmd));
	                                }// 0000CAL00000CAL00000ComdSet     &method=delcal&group=0001

	                            }
	                        }
	                    });

	                    $(dd).find(".div-slider").attr("data-index", i);
	                    $(dd).find(".div-slider").bind("tap", function () {//创建联动
	                        loader = new Piece.Loader({ autoshow: true, target: '.content' });
	                        outTimer = window.setTimeout(function () {
	                            loader.hideAll();
	                            Piece.Toast(I18n.CoLinkedList.setTimeOut);
	                        }, 1000 * 10);


	                        //发送命令
	                        var index = $(this).attr("data-index");
	                        var findLinkedObj = linkedDevices[index];
	                        var magicList = Piece.Store.loadObject("magicList", true);
	                        if (magicList != null) {
	                            for (var i = 0; i < magicList.length; i++) {
	                                var deviceIndex = new Array();
	                                var findDevice = false;
	                                var cmd = "";
	                                for (var j = 0; j < findLinkedObj.ControlDevices.length; j++) {
	                                    if (findLinkedObj.ControlDevices[j].gatewayId == magicList[i].gatewayId) {//拼接当前魔方数据
	                                        findDevice = true;
	                                        var CoObj = findLinkedObj.ControlDevices[j];
	                                        var order = "";
	                                        switch (CoObj.device.toLocaleLowerCase()) {
	                                            case "ac00"://空调
	                                                order = "#distModule=AC00#distSerial=" + CoObj.serial
                                                          + "#power=" + (CoObj.power == 0 ? "off" : "on")
	                                                if (CoObj.power == 1) {
	                                                    order = order
                                                        + "#mode=" + CoObj.mode
                                                        + "#temperature=" + CoObj.temperature
                                                        + "#airVolume=" + CoObj.airVolume
                                                        + "#airDir=" + CoObj.airDir
                                                        + "#autoDir=" + (CoObj.autoDir == 0 ? "off" : "on")
	                                                }
	                                                break;
	                                            case "tv00"://电视
	                                                order = "#distModule=TV00#distSerial=" + CoObj.serial
                                                          + "#method=pressKey#key=power"
	                                                break;
	                                            case "dvd0"://DVD
	                                                order = "#distModule=DVD0#distSerial=" + CoObj.serial
                                                           + "#method=pressKey#key=power"
	                                                //if(CoObj.power==1)
	                                                //{
	                                                //order+="#play=1"
	                                                //}
	                                                break;
	                                            case "stb0"://机顶盒
	                                                order = "#distModule=STB0#distSerial=" + CoObj.serial
                                                           + "#method=pressKey#key=power"
	                                                break;
	                                            case "fan0"://电风扇
	                                                order = "#distModule=FAN0#distSerial=" + CoObj.serial
                                                            + "#method=pressKey#key=power"
	                                                //if(CoObj.power==1)
	                                                //{
	                                                //order=order
	                                                //+"#oscillate=1"
	                                                //+"#speed="+CoObj.speed
	                                                //}
	                                                break;
	                                            case "ss00"://插座
	                                                order = "#distModule=SS00#distSerial=" + CoObj.serial
                                                          + "#method=pressKey#key=power"
	                                                break;
	                                            case "slb0"://电灯
	                                                order = "#distModule=SLB0#distSerial=" + CoObj.serial
														+ "#method=pressKey#key=power"
	                                                //if(CoObj.power==1)
	                                                //{
	                                                //order=order
	                                                //+"#light="+CoObj.light
	                                                //+"#color="+CoObj.color
	                                                //}
	                                                break;
	                                            case "iptv"://IPTV
	                                                order = "#distModule=IPTV#distSerial=" + CoObj.serial
                                                         + "#method=pressKey#key=power"
	                                                break;
	                                            case "prj0"://投影仪
	                                                order = "#distModule=PRJ0#distSerial=" + CoObj.serial
                                                             + "#power=" + (CoObj.power == 0 ? "off" : "on")
	                                                if (CoObj.power == 1) {
	                                                    order = order
                                                        + "#pc=" + CoObj.pc
                                                        + "#video=" + CoObj.video
	                                                }
	                                                break;
	                                        }
	                                        deviceIndex[deviceIndex.length] = order;
	                                    }
	                                }

	                                if (findDevice == true) {//该魔方下有联动设备
	                                    var enable = 0;
	                                    if (findLinkedObj.Enabled == undefined || findLinkedObj.Enabled == 0) {
	                                        enable = 1;
	                                    }
	                                    var methodName = "addcal";
	                                    var group = "";
	                                    if (findLinkedObj.group != undefined && findLinkedObj.group != null) {
	                                        methodName = "set";
	                                        group = findLinkedObj.group;
	                                    }
	                                    var gatewayId = magicList[i].serial;

	                                    var temp = findLinkedObj.ListenWheres.replace(">=", "").replace("<=", "");
	                                    var lkey = findLinkedObj.ListenKey;

	                                    //传入魔方序列号
	                                    Piece.Cache.put("gatewayId", gatewayId)

	                                    //发送命令
	                                    SocketUtil.AddNewModule("CAL0", function () {
	                                        //检测src是什么
	                                        if (lkey == "TMP") {//温度
	                                            SocketUtil.AddNewModule("TMP0", function () {
	                                                var model = new SocketUtil.sendModel();
	                                                model.gatewayId = gatewayId;
	                                                model.moduleId = "TMP0";
	                                                model.moduleIndex = "0000";
	                                                model.actionId = "TMP0";
	                                                model.actionIndex = "0000";
	                                                model.cmdType = "Comd";
	                                                model.cmdCatalog = "Subs";
	                                                model.queryString = { "alarmH": "subscribe", "alarmL": "unsubscribe" };
	                                                if (findLinkedObj.ListenWheres.indexOf("<=") > -1) {//下限
	                                                    model.queryString = { "alarmH": "unsubscribe", "alarmL": "subscribe" };
	                                                }
	                                                model.callbackFun = function (sendObj, backObj) {
	                                                    //设置温度
	                                                    var model = new SocketUtil.sendModel();
	                                                    model.gatewayId = gatewayId;
	                                                    model.moduleId = "TMP0";
	                                                    model.moduleIndex = "0000";
	                                                    model.actionId = "TMP0";
	                                                    model.actionIndex = "0000";
	                                                    model.cmdType = "Comd";
	                                                    model.cmdCatalog = "Set ";
	                                                    model.queryString = { "alarmH": temp };
	                                                    if (findLinkedObj.ListenWheres.indexOf("<=") > -1) {//下限
	                                                        model.queryString = { "alarmL": temp };
	                                                    }
	                                                    model.callbackFun = function (sendObj, backObj) {
	                                                        //发送日程
	                                                        var model = new SocketUtil.sendModel();
	                                                        model.gatewayId = gatewayId;
	                                                        model.moduleId = "CAL0";
	                                                        model.moduleIndex = "0000";
	                                                        model.actionId = "CAL0";
	                                                        model.actionIndex = "0000";
	                                                        model.cmdType = "Comd";
	                                                        model.cmdCatalog = "Set ";
	                                                        model.queryString =
															{
															    "method": "addcal", "name": "cc", "devCnt": "2"
															, "type": "2", "enable": "1", "period": "manual", "srcModule": "TMP0", "srcSerial": "0000",
															    "event": "alarmH", "trigger": "1", "srcFunction": "TMP0", "srcFserial": "0000"
															};
	                                                        if (findLinkedObj.ListenWheres.indexOf("<=") > -1) {//下限
	                                                            model.queryString.event = "alarmL";
	                                                        }
	                                                        for (var p = 0; p < deviceIndex.length; p++) {
	                                                            eval("model.queryString.index" + get4s(p) + "='" + deviceIndex[p] + "';");
	                                                        }
	                                                        model.callbackFun = function (sendObj, backObj) {
	                                                            window.clearTimeout(outTimer);
	                                                            loader.hideAll();
	                                                            Piece.Toast(I18n.CoLinkedList.setSucess);
	                                                            linkedDevices[index].group = backObj.group;
	                                                            linkedDevices[index].Enabled = enable;
	                                                            Piece.Store.saveObject("LinkedDevices", linkedDevices, true);
	                                                            onLoadLinkedDeviceFunc();
	                                                        };
	                                                        SocketUtil.sendMessage(model);
	                                                    };
	                                                    SocketUtil.sendMessage(model);
	                                                };
	                                                SocketUtil.sendMessage(model);
	                                            });
	                                        }
	                                        else if (key == "HUM") {//湿度
	                                            SocketUtil.AddNewModule("HUM0", function () {
	                                                //执行命令
	                                            });
	                                        }
	                                        else if (key == "AQ") {//空气质量
	                                            SocketUtil.AddNewModule("AQ00", function () {
	                                                //执行命令
	                                            });
	                                        }
	                                    });

	                                    //socketRspnCallBack.func0913=function(obj){//定义回调函数
	                                    //window.clearTimeout(outTimer);
	                                    //loader.hideAll();
	                                    //Piece.Toast(I18n.CoLinkedList.setSucess);
	                                    //linkedDevices[index].group=obj.group;
	                                    //linkedDevices[index].Enabled=enable;
	                                    //Piece.Store.saveObject("LinkedDevices", linkedDevices,true);
	                                    //onLoadLinkedDeviceFunc();
	                                    //}

	                                    //Util.sockSendData("/exchange/magicbox.exchange/magicbox."+gatewayId,Util.ConvertToOrder("WRJWllll        0914SYS00000SYS00000ComdAddD    &device"));
	                                    //Util.sockSendData("/exchange/magicbox.exchange/magicbox."+gatewayId,Util.ConvertToOrder("WRJWllll        0915SYS00000SYS00000ComdAddD    &module=CAL0&serial=0000"));
	                                    //Util.sockSendData("/exchange/magicbox.exchange/magicbox."+gatewayId,Util.ConvertToOrder("WRJWllll        0916CAL00000CAL00000ComdSet     &method=addcal&&name=testCAL&devCnt=2&type=0&enable=1&startDate=20160225&startTime=14:00:00&stopDate=20160227&stopTime=11:45:00&period=day&index0000=#distModule=DBUG#distSerial=0000#distFunction=    #distFserial=0000#testaction=123456"));
	                                    //回复 
	                                    //WRJW003b644078920916SRV00000        Rspn0000    &group=0000



	                                    //Util.sockSendData("/exchange/magicbox.exchange/magicbox."+gatewayId,Util.ConvertToOrder("WRJWllll        0915SYS00000SYS00000ComdAddD    &module=TMP0&serial=0000"));

	                                    //Util.sockSendData("/exchange/magicbox.exchange/magicbox."+gatewayId,Util.ConvertToOrder("WRJWllll        0000CAL00000CAL00000ComdSet     &method=delcal&group=0000"));

	                                    //Util.sockSendData("/exchange/magicbox.exchange/magicbox."+gatewayId,Util.ConvertToOrder("WRJWllll        0917CAL00000CAL00000ComdSet     &method=addcal&name=cc&devCnt=2&type=2&enable=1&startDate=20160225&startTime=14:00:00&stopDate=20160227&stopTime=11:45:00&period=day&srcModule=TMP0&srcSerial=0000&event=alarmH&trigger=1&srcFunction=TMP0&srcFserial=0000&index0000=#distModule=TV00#distSerial=0000#distFunction=TV00#method=pressKey#key=power"));
	                                    //(时间已经可以了)

	                                    //Util.sockSendData("/exchange/magicbox.exchange/magicbox."+gatewayId,Util.ConvertToOrder("WRJWllll        0917CAL00000CAL00000ComdSet     &method=addcal&name=cc&devCnt=2&type=2&enable=1&period=manual&srcModule=TMP0&srcSerial=0000&event=alarmH&trigger=1&srcFunction=TMP0&srcFserial=0000&index0000=#distModule=TV00#distSerial=0000#distFunction=TV00#method=pressKey#key=power"));

	                                    //Util.sockSendData("/exchange/magicbox.exchange/magicbox."+gatewayId,Util.ConvertToOrder("WRJWllll        0003SYS00000SYS00000ComdAddD    &module=TMP0&serial=0000"));
	                                    //Util.sockSendData("/exchange/magicbox.exchange/magicbox."+gatewayId,Util.ConvertToOrder("WRJWllll        0911TMP00000TMP00000ComdSubs    &tempAlarmH=subscribe"));
	                                    //Util.sockSendData("/exchange/magicbox.exchange/magicbox."+gatewayId,Util.ConvertToOrder("WRJWllll        0912TMP00000TMP00000ComdSet     &tempAlarmH=20"));
	                                    //Util.sockSendData("/exchange/magicbox.exchange/magicbox."+gatewayId,Util.ConvertToOrder("WRJWllll        0913CAL00001CAL00000ComdSet     &method="+methodName+"&group="+group+"&type=2&devCnt=2&package=0&enable="+enable+"&index001=#srcModule=TEMP#srcSerial=0000#event="+eventName+cmd));
	                                }
	                            }
	                        }
	                    });
	                    $(".content").append(dd);
	                }
	            }
	        },
	        onShow: function () {
	            this.onLoadTemplate();
	            this.onLoadLinkedDevice();
	            this.onSlidering();//滑块

	            onLoadLinkedDeviceFunc = this.onLoadLinkedDevice;
	        },
	        onSlidering: function () {
	            $(".div-slidering").swipeLeft(function (e) {
	                $(e.target).css("float", "left");
	                $(e.target).parent().css("background-color", onBackgroundColor2);
	            });
	            $(".div-slidering").swipeRight(function (e) {
	                $(e.target).css("float", "right");
	                $(e.target).parent().css("background-color", onBackgroundColor);
	            });

	            $(".container").swipeLeft(function (e) {
	                if ($(e.target).attr('class') != "div-slider") {
	                    $(e.target).css("right", 180 + "px");
	                    $(e.target).parent().find(".cont-edit").css("right", 0 + "px");
	                }

	            });
	            $(".container").swipeRight(function (e) {
	                if ($(e.target).attr('class') != "div-slider") {
	                    $(e.target).css("right", 0 + "px");
	                    $(e.target).parent().find(".cont-edit").css("right", -180 + "px");
	                }
	            });

	        }
	    }); //view define

	});