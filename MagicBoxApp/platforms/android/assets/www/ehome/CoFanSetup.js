define(['text!ehome/CoFanSetup.html', '../base/util', '../base/socketutil', '../knobKnob/knobKnob.zepto', "../base/templates/template", '../base/tooltip/tooltip', '../base/i18nMain', '../base/schema'],
	function (viewTemplate, Util, SocketUtil, knobKnob, _TU, Tooltip, I18n, Schema) {
	    var gatewayId = "";
	    var serial = "";
	    var check = null;
	    var CoFan = null;
	    var lastRatio = 0;
	    var study;
	    var hourDialog;
	    var viewInitFun, onMenuFn, getNewCustBtnNumFun, customerBtnHtmlFun, setDialogCssFun;
	    var device = _TU._T.ehome_CoFanSetup.device;
	    var deviceStatus, currentDeviceStatusIndex;
	    var cusBtns = new Array();
	    var userKey = "user";
	    return Piece.View.extend({
	        id: 'ehome_CoFanSetup',
	        events: {
	            "tap .custom-btn-div,#power,#time,#oscillate,#speed,#mode": "action",
	            "touchstart #save": "save",
	            "tap .hour-list-name": "afterChooseHour",
	            "tap .opera": "operation",
	        },
	        onStudy: function (e) {
	            var tooltip = new Tooltip();
	            tooltip.show("ehome/CoFanSetup");
	        },
	        render: function () {
	            $(this.el).html(viewTemplate);

	            Piece.View.prototype.render.call(this);
	            return this;
	        },
	        onLoadTemplate: function () {
	            _TU._U.setHeader(_TU._T.ehome_CoFanSetup);//加载头部导航
	            var obj = _TU._T.ehome_CoFanSetup.data;
	            var TemplateHtml = $(this.el).find("#ehome_CoFanSetup_Template").html();
	            var TemplateObj = _.template(TemplateHtml, obj);
	            $(".content").append(TemplateObj);
	        },
	        onShow: function () {
	            this.onLoadTemplate();

	            customerBtnHtmlFun = this.customerBtnHtml;
	            getNewCustBtnNumFun = this.getNewCustBtnNum;
	            onMenuFn = this.onMenu;
	            viewInitFun = this.viewInit;
	            setDialogCssFun = this.setDialogCss;

	            check = this.checkValue;
	            check();

	            _TU._U.goBack(function () {
	                var page = Util.getQueryStringByName("prePage");
	                if (page != "") {
	                    Backbone.history.navigate(page, { trigger: true });
	                }
	                else {
	                    Backbone.history.navigate('devicemanage/Ehome', { trigger: true });
	                }
	            });

	            //数据初始化
	            Piece.Cache.put("operation-type", null);
	            deviceStatus = Piece.Store.loadObject("DeviceStatus", true);//添加到本地
	            if (deviceStatus != null && deviceStatus.length > 0) {
	                for (var i = 0; i < deviceStatus.length; i++) {
	                    if (deviceStatus[i].gatewayId == gatewayId && deviceStatus[i].serial == serial && deviceStatus[i].device == device) {
	                        currentDeviceStatusIndex = i;
	                        CoFan = deviceStatus[i];
	                        break;
	                    }
	                }
	                if (CoFan == null) {
	                    cusBtns = new Array();
	                    CoFan = { "gatewayId": gatewayId, "device": device, "serial": serial, "cusBtns": cusBtns, "ratio": 0, "speed": 0 };
	                    deviceStatus[deviceStatus.length] = CoFan;
	                    currentDeviceStatusIndex = 0;
	                    Piece.Store.saveObject("DeviceStatus", deviceStatus, true);
	                }
	            }
	            else {
	                deviceStatus = new Array();
	                cusBtns = new Array();
	                CoFan = { "gatewayId": gatewayId, "device": device, "serial": serial, "cusBtns": cusBtns, "ratio": 0, "speed": 0 };
	                deviceStatus[deviceStatus.length] = CoFan;
	                currentDeviceStatusIndex = 0;
	                Piece.Store.saveObject("DeviceStatus", deviceStatus, true);
	            }

	            //设置滚动控制
	            //knobKnob.Start('.center-1',CoFan.ratio,false,{
	            //  turn : function(ratio){
	            //	  ratio=ratio-7>0?ratio-7:0;
	            //	  $("#temp").html(ratio);
	            //	  var beginRatio=45;
	            //	  var add=45;
	            //	  var tempBegin=17;
	            //	  var result=0;
	            //	  $("#temp").html(ratio);
	            //	  if(ratio>=0&&ratio<=90)
	            //		   result=0;
	            //	  else if(ratio>90&&ratio<=180)
	            //	       result=3;
	            //	  else if(ratio>180&&ratio<=270)
	            //	       result=2;
	            //	  else if(ratio>270&&ratio<360)
	            //	       result=1;
	            //		$("#temp").html(result);
	            //	 $("#temp").html(result);
	            //	 lastRatio=ratio;
	            //  },
	            //  end: function(temp){
	            //	  var value="";
	            //	  if(temp==1)
	            //		  SocketUtil.SeCoFanSetupLow();
	            //	  else if(temp==2)
	            //		 SocketUtil.SeCoFanSetupMiddle();
	            //	  else if(temp==3)
	            //		 SocketUtil.SeCoFanSetupHigh();
	            //	  CoFan.speed=temp;
	            //	  CoFan.ratio=lastRatio;
	            //	  Piece.Store.saveObject("CoFan", CoFan, true);
	            //	 }
	            //  });

	            //学习返回之后判断是否为编辑状态
	            study = Piece.Cache.get("study");
	            if (study == 1) {
	                $("#editTitle").attr("style", "");
	                $("#controlTitle").attr("style", "display:none");
	                $("#save").attr("style", "");
	                $("#study").attr("style", "display:none");
	            } else {
	                //清空functionId
	                Piece.Cache.put("actionId", null);
	                Piece.Cache.put("actionIndex", null);
	            }
	            //右上角下拉菜单
	            onMenuFn();
	            //自定义按钮弹出框
	            EditDialog = new Piece.Dialog({
	                autoshow: false,
	                target: '.content',
	                title: I18n.Common.setCustomerBtnName,
	                content: '<input type="text" id="btnName" style="width:170px"></input>'
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
	                    var name = $("#btnName").val();
	                    if (name == "") {
	                        new Piece.Toast(I18n.Common.inputMsg);
	                        return;
	                    }
	                    var type = Piece.Cache.get("operation-type");
	                    if (type == "edit") {//修改
	                        var btnId = Piece.Cache.get("btnId");
	                        for (var i = 0; i < CoFan.cusBtns.length; i++) {
	                            if (CoFan.cusBtns[i].id == btnId) {
	                                CoFan.cusBtns[i].name = name;
	                                Piece.Store.saveObject("DeviceStatus", deviceStatus, true);
	                                $("#" + btnId + " .btnName").text(name);
	                            }
	                        }
	                    }
	                    else {//新增
	                        var num = getNewCustBtnNumFun();
	                        var item = { "id": userKey + num, "num": num, "name": name };
	                        CoFan.cusBtns[CoFan.cusBtns.length] = item;
	                        Piece.Store.saveObject("DeviceStatus", deviceStatus, true);
	                        customerBtnHtmlFun(item);
	                        Piece.Cache.put("operation-type", null);
	                        SocketUtil.AddUserBtn(device, userKey + num);
	                    }
	                },
	                can: function () {
	                    EditDialog.hide();
	                },
	            });

	            //因为定时操作需要在电源开关打开的情况下才能设置，所以记住之前的设置状态
	            this.viewInit();
	        },
	        operation: function (e) {
	            var type = $(e.target).attr("data-type");
	            if (type == null) return;
	            Piece.Cache.put("operation-type", type);
	            switch (type) {
	                case "study":
	                    {
	                        this.onStudy();
	                        break;
	                    }
	                case "add":
	                    {
	                        if (CoFan.cusBtns.length >= 10) {
	                            new Piece.Toast(I18n.Common.maxUserBtnMsg);
	                            return;
	                        }
	                        window.setTimeout(function () {
	                            EditDialog.show();
	                            setDialogCssFun();
	                        }, 100);
	                        break;
	                    }
	                case "edit":
	                case "delete":
	                    {
	                        //变成编辑状态
	                        $("#editTitle").attr("style", "");
	                        $("#controlTitle").attr("style", "display:none");
	                        $("#save").attr("style", "");
	                        $(".nav-wrap-right ul").removeClass("disp");//移除下拉菜单事件
	                        $("#study").attr("style", "display:none");
	                        break;
	                    }
	                default:
	                    {
	                        break;
	                    }
	            }
	        },
	        action: function (obj) {
	            var order = '';
	            var id = obj.currentTarget.id;
	            if (id == "") {
	                if (obj.currentTarget.getAttribute("class") == "top")
	                    id = "speed";
	            }
	            study = Piece.Cache.get("study");
	            var type = Piece.Cache.get("operation-type");
	            if (study == 1) {
	               // SocketUtil.StudyKey(_TU._T.ehome_CoFanSetup.device, id);
	                if (id.indexOf(userKey) > -1) {
	                    Piece.Cache.put("study-name", $("#" + id + " .btnName").text());
	                }
	                Piece.Cache.put("study-key", id);
	                Piece.Cache.put("study-module", _TU._T.ehome_CoFanSetup.device);
	                Backbone.history.navigate("ehome/SeRemoteCopy", {
	                    trigger: true
	                });
	            }
	            else if (type != null) {//自定义按钮操作
	                if (type == "edit" && id.indexOf(userKey) > -1) {
	                    Piece.Cache.put("btnId", id);
	                    window.setTimeout(function () {
	                        EditDialog.show();
	                        setDialogCssFun();
	                    }, 100);
	                }
	                else if (type == "delete") {
	                    if (id.indexOf(userKey) > -1) {
	                        for (var i = 0; i < CoFan.cusBtns.length; i++) {
	                            if (CoFan.cusBtns[i].id == id) {
	                                CoFan.cusBtns.splice(i, 1);
	                                Piece.Store.saveObject("DeviceStatus", deviceStatus, true);
	                                //$("#"+id).parent(".box-flex").remove();
	                                SocketUtil.DeleteUserBtn(device, id);
	                                break;
	                            }
	                        }
	                        viewInitFun();
	                    }
	                }
	            }
	            else {//遥控
	                this.setFan(id);
	            }
	        },
	        save: function () {
	            $("#editTitle").attr("style", "display:none");
	            $("#controlTitle").attr("style", "");
	            $("#save").attr("style", "display:none");
	            $("#study").attr("style", "");
	            Piece.Cache.put("study", 0);
	            Piece.Cache.put("operation-type", null);
	        },
	        //根据获取到的设备值设置设备属性
	        viewInit: function () {
	            $('.control-btn').html('')
	            //自定义按钮
	            if (CoFan.cusBtns.length > 0) {
	                for (var i = 0; i < CoFan.cusBtns.length; i++) {
	                    customerBtnHtmlFun(CoFan.cusBtns[i]);
	                }
	            }
	        },
	        checkValue: function () {
	            gatewayId = Piece.Cache.get("gatewayId");
	            if (gatewayId == null || gatewayId == "") {
	                new Piece.Toast(I18n.Common.noMagicBoxError);
	                return;
	            }
	            serial = Piece.Cache.get("serial");
	            if (serial == null || serial == "") {
	                new Piece.Toast(I18n.Common.noDeviceSeriError);
	                return;
	            }
	            var currentDevice = Util.getCurrentDevice(gatewayId, _TU._T.ehome_CoFanSetup.device, serial);
	            if (currentDevice != null) {
	                $('#controlTitle').html(currentDevice.name);
	            }
	        },
	        afterChooseHour: function (obj) {
	            var Item = null;
	            var obj = obj.currentTarget.getAttribute("data-key") == null ? obj.currentTarget.parentElement : obj.currentTarget;
	            var hour = obj.getAttribute("data-key");
	            CoFan.time = parseInt(hour);
	            $('.choosedA').attr("style", "display:none");
	            if (obj.children[1].getAttribute("style") == "display:none") {
	                obj.children[1].setAttribute("style", "display:block");
	            }
	            else {
	                obj.children[1].setAttribute("style", "display:none");
	            }
	        },
	        setFan: function (id) {
	            if (id.indexOf(userKey) > -1) {
	                SocketUtil.SendUserBtn(device, id);
	                return;
	            }
	            switch (id) {
	                case "power":
	                    {
	                        if (CoFan.power == 0) {
	                            CoFan.power = 1;
	                        }
	                        else {
	                            CoFan.power = 0;
	                        }
	                        SocketUtil.SeCoFanSetupPower();
	                        break;
	                    }
	                case "oscillate":
	                    {
	                        if (CoFan.oscillate == 0) {
	                            CoFan.oscillate = 1;
	                        }
	                        else {
	                            CoFan.oscillate = 0;
	                        }
	                        SocketUtil.SeCoFanSetupOscillate();
	                        break;
	                    }
	                case "time"://定时关
	                    {
	                        $("#hourList .table-rg").html('');
	                        for (var i = 0; i <= 12; i++) {
	                            var choose = (i == CoFan.time);
	                            $("<div>")
                                .html('<div class="div-list" data-key="' + i + '"><div class="hour-list-name">' + i + I18n.ehome_CoFanSetup.hour + '</div><div class="choosedA" style="display:' + (choose ? "block" : "none") + '"><i class="icon iconfont" style="font-size: 20px;color:' + _TU._T.dialog_Style.backColor + '">&#xe69a;</i></div></div>')
                                .appendTo("#hourList .table-rg");
	                        }
	                        hourDialog = new Piece.Dialog({
	                            autoshow: false,
	                            target: '.content',
	                            title: I18n.ehome_CoFanSetup.hourDialogTitle,
	                            content: $("#hourList").html(),
	                        }, {
	                            configs: [{
	                                title: I18n.Common.cancel,
	                                eventName: 'cancel',
	                            }, {
	                                title: I18n.Common.ok,
	                                eventName: 'ok',
	                            },
	                            ],
	                            cancel: function () {
	                                hourDialog.hide();
	                            },
	                            ok: function () {
	                                hourDialog.hide();
	                                Piece.Store.saveObject("CoFan", CoFan, true);
	                                var dat = new Date();
	                                dat.setHours(dat.getHours() + CoFan.time);
	                                SocketUtil.SeCoFanSetupTime(dat);
	                            }
	                        });
	                        window.setTimeout(function () {
	                            hourDialog.show();
	                            $(".cube-dialog-subtitle").attr("class", "cube-dialog-subtitle1");
	                            $(".cube-dialog-subtitle1").css("height", 5 * 60);
	                            $(".cube-dialog").css("margin-top", "80px");
	                            $(".cube-dialog").css("top", "0px");
	                            $(".btn").first().css("background-color", _TU._T.dialog_Style.cancelColor);
	                            $(".ui-header").css("background-color", _TU._T.dialog_Style.backColor);
	                            $(".btn").last().css("background-color", _TU._T.dialog_Style.backColor);
	                            if (CoFan.time > 0) {
	                                $(".cube-dialog-subtitle1").scrollTop(CoFan.time * 60);//滚动条定位
	                            }
	                        }, 100);
	                        break;
	                    }
	                case "mode":
	                    {
	                        SocketUtil.SeCoFanSetupMode();
	                        break;
	                    }
	                case "speed":
	                    {
	                        var statuObj = this.getNextStatuByCurrAndType("speed", CoFan.speed);
	                        if (statuObj != null) {
	                            CoFan.speed = statuObj.key;
	                            // $("#speed").find(".btnName").text(statuObj.name);
	                            if (CoFan.speed == "low")
	                                SocketUtil.SeCoFanSetupLow();
	                            else if (CoFan.speed == "middle")
	                                SocketUtil.SeCoFanSetupMiddle();
	                            else if (CoFan.speed == "high")
	                                SocketUtil.SeCoFanSetupHigh();
	                        }
	                        break;
	                    }
	                default: "";
	            }
	            Piece.Store.saveObject("CoFan", CoFan, true);
	        },
	        onMenu: function () {
	            $(".nav-wrap-right a").on("tap", function (e) {
	                $(e.target).parent().find("ul").toggleClass("disp");
	                e.stopPropagation();
	            });

	            $(document).ready(function () {
	                $("*").on("tap", function (event) {
	                    if (!$(this).hasClass("react")) {
	                        $(".nav-wrap-right ul").removeClass("disp");
	                    }
	                });
	            });
	        },
	        customerBtnHtml: function (obj) {
	            var lastElement = $('.control-btn-container-custom')[$('.control-btn-container-custom').length - 1];
	            if (lastElement != null && lastElement != undefined && lastElement.children.length < 3) {
	                $(lastElement)
                    .append('<div class="box-flex"><div class="custom-btn-div" id="' + obj.id + '"><span class="btnName">' + obj.name + '</span></div></div>');
	            }
	            else {
	                $('.control-btn')
                    .append('<div class="control-btn-container-custom box-flex"><div class="box-flex"><div class="custom-btn-div" id="' + obj.id + '"><span class="btnName">' + obj.name + '</span></div></div></div>');
	            }
	        },
	        getNewCustBtnNum: function () {//自定义按钮最多10个，user0-user9
	            var ishave = false;
	            for (var i = 0; i < 9; i++) {
	                ishave = false;
	                for (var j = 0; j < 9; j++)
	                    if (CoFan.cusBtns[j] != null && CoFan.cusBtns[j].num == i) {
	                        ishave = true;
	                        break;
	                    }
	                if (!ishave) return i;
	            }
	        },
	        setDialogCss: function () {
	            $(".btn").first().css("background-color", _TU._T.dialog_Style.cancelColor);
	            $(".ui-header").css("background-color", _TU._T.dialog_Style.backColor);
	            $(".btn").last().css("background-color", _TU._T.dialog_Style.backColor);
	        },
	        getNextStatuByCurrAndType: function (type, curr) {
	            var mode;
	            for (var i = 0; i < Schema.FanControl.length; i++) {
	                if (Schema.FanControl[i].key == type) {
	                    for (var j = 0; j < Schema.FanControl[i].value.length; j++) {
	                        if (curr == 0)
	                        {
	                            mode = Schema.FanControl[i].value[0];
	                            break;
	                        }
	                        else if (Schema.FanControl[i].value[j].key == curr)
	                        {
	                            if (j + 1 < Schema.FanControl[i].value.length) {
	                                mode = Schema.FanControl[i].value[j + 1];
	                            }
	                            else {
	                                mode = Schema.FanControl[i].value[0];
	                            }
	                            break;
	                        }
	                    }
	                    break;
	                }
	            }
	            return mode;
	        },
	    });

	});

