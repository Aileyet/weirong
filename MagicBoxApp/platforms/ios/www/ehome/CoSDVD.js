define(['text!ehome/CoSDVD.html', '../base/socketutil', '../base/tooltip/tooltip', "../base/templates/template", '../base/util', '../base/i18nMain'],
	function (viewTemplate, SocketUtil, Tooltip, _TU, Util, I18n) {
	    var gatewayId = "";
	    var serial = "";
	    var check = null;
	    var CoDVD = null;
	    var study;
	    var viewInitFun, onMenuFn, getNewCustBtnNumFun, customerBtnHtmlFun, setDialogCssFun;
	    var device = _TU._T.ehome_CoSDVD.device;
	    var deviceStatus, currentDeviceStatusIndex;
	    var cusBtns = new Array();
	    var userKey = "user";
	    return Piece.View.extend({
	        id: 'ehome_CoSDVD',
	        events: {
	            'touchstart #power,#mute,#open,#previous,#reverse,#up,#down,#left,#right,#ok,#next,#forware,#menu,#play,#Return,.custom-btn-div': 'action',
	            //"touchstart #study":'onStudy',
	            "touchstart #save": "save",
	            "tap .opera": "operation",
	        },
	        render: function () {
	            $(this.el).html(viewTemplate);

	            Piece.View.prototype.render.call(this);
	            return this;
	        },
	        onLoadTemplate: function () {
	            _TU._U.setHeader(_TU._T.ehome_CoSDVD);//加载头部导航
	            var obj = _TU._T.ehome_CoSDVD.data;
	            var TemplateHtml = $(this.el).find("#ehome_CoSDVD_Template").html();
	            var TemplateObj = _.template(TemplateHtml, obj);
	            $(".content").html("").append(TemplateObj);
	        },
	        onShow: function () {
	            this.onLoadTemplate();
	            this.loadView();//初始页面，对页面样式的调整

	            //设置中间圆圈的位置
	            var operDiskH = $(".operating-disk-div").height();
	            var operDiskDWH = $(".operating-disk-dot-wai").height();
	            var tBtnDWH = $(".tBtn-text-div").height();
	            $(".operating-disk-dot-wai").css("margin-top", ((operDiskH - operDiskDWH) / 2 - (tBtnDWH / 2)) + "px");
	            
	            var spanH = $(".operating-disk-dot-zhong span").height();
	            var spanW = $(".operating-disk-dot-zhong span").width();
	            $(".operating-disk-dot-zhong span").css({
	            	"top":"calc(50% - "+(spanH/2)+"px)",
	            	"left":"calc(50% - "+(spanW/2)+"px)"
	            });
	            
	            this.checkValue();

	            customerBtnHtmlFun = this.customerBtnHtml;
	            getNewCustBtnNumFun = this.getNewCustBtnNum;
	            onMenuFn = this.onMenu;
	            viewInitFun = this.viewInit;
	            setDialogCssFun = this.setDialogCss;

	            $(".switchBin-div").bind("tap", function () {//开关
	                if ($(this).find(".switchBin-Dot-div").css("float") == "left") {
	                    $(this).css("backgroundColor", _TU._T.Color.sliderBgColor);
	                    $(this).find(".switchBin-Dot-div").css("float", "right");
	                    //打开
	                    CoDVD.open = 1;
	                    SocketUtil.SeCoDVD("open");
	                }
	                else {
	                    $(this).css("backgroundColor", _TU._T.Color.sliderBgUnColor);
	                    $(this).find(".switchBin-Dot-div").css("float", "left");
	                    //关闭
	                    CoDVD.open = 0;
	                    SocketUtil.SeCoDVD("open");
	                }
	                Piece.Store.saveObject("CoDVD", CoDVD, true);
	            });



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
	                        CoDVD = deviceStatus[i];
	                        break;
	                    }
	                }
	                if (CoDVD == null) {
	                    cusBtns = new Array();
	                    CoDVD = { "gatewayId": gatewayId, "device": device, "serial": serial, "cusBtns": cusBtns, "play": 0 };
	                    deviceStatus[deviceStatus.length] = CoDVD;
	                    currentDeviceStatusIndex = 0;
	                    Piece.Store.saveObject("DeviceStatus", deviceStatus, true);
	                }
	            }
	            else {
	                deviceStatus = new Array();
	                cusBtns = new Array();
	                CoDVD = { "gatewayId": gatewayId, "device": device, "serial": serial, "cusBtns": cusBtns, "play": 0 };
	                deviceStatus[deviceStatus.length] = CoDVD;
	                currentDeviceStatusIndex = 0;
	                Piece.Store.saveObject("DeviceStatus", deviceStatus, true);
	            }

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
	                        for (var i = 0; i < CoDVD.cusBtns.length; i++) {
	                            if (CoDVD.cusBtns[i].id == btnId) {
	                                CoDVD.cusBtns[i].name = name;
	                                Piece.Store.saveObject("DeviceStatus", deviceStatus, true);
	                                $("#" + btnId + " .btnName").text(name);
	                            }
	                        }
	                    }
	                    else {//新增
	                        var num = getNewCustBtnNumFun();
	                        var item = { "id": userKey + num, "num": num, "name": name };
	                        CoDVD.cusBtns[CoDVD.cusBtns.length] = item;
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


	            viewInitFun();
	        },
	        onStudy: function (e) {
	            var tooltip = new Tooltip();
	            tooltip.show("ehome/CoSDVD");
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
	                        if (CoDVD.cusBtns.length >= 10) {
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
	            study = Piece.Cache.get("study");
	            var type = Piece.Cache.get("operation-type");
	            if (study == 1) {
	                //SocketUtil.StudyKey(_TU._T.ehome_CoSDVD.device, id);
	                if (id.indexOf(userKey) > -1) {
	                    Piece.Cache.put("study-name", $("#" + id + " .btnName").text());
	                }
	                Piece.Cache.put("study-key", id);
	                Piece.Cache.put("study-module", _TU._T.ehome_CoSDVD.device);
	                Backbone.history.navigate("ehome/SeRemoteCopy", { trigger: true });
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
	                        for (var i = 0; i < CoDVD.cusBtns.length; i++) {
	                            if (CoDVD.cusBtns[i].id == id) {
	                                CoDVD.cusBtns.splice(i, 1);
	                                Piece.Store.saveObject("DeviceStatus", deviceStatus, true);
	                                SocketUtil.DeleteUserBtn(device, id);
	                                break;
	                            }
	                        }
	                        viewInitFun();
	                    }
	                }
	            }
	            else {//遥控
	                this.setDVD(id);
	            }
	        },
	        save: function () {
	            $("#editTitle").attr("style", "display:none");
	            $("#controlTitle").attr("style", "");
	            $("#save").attr("style", "display:none");
	            $("#study").attr("style", "");
	            Piece.Cache.put("operation-type", null);
	            Piece.Cache.put("study", 0);
	        },
	        //根据获取到的设备值设置设备属性
	        viewInit: function () {
	            $('.control-btn').html('')
	            //自定义按钮
	            if (CoDVD.cusBtns.length > 0) {
	                for (var i = 0; i < CoDVD.cusBtns.length; i++) {
	                    customerBtnHtmlFun(CoDVD.cusBtns[i]);
	                }
	            }
	        },
	        loadView: function () {
	            var centerVH = $(".center-view").height() - 20;
	            var childDivH0 = $(".center-view>div").eq(0).height();
	            var childDivH1 = $(".center-view>div").eq(1).height();
	            var childDivH2 = $(".center-view>div").eq(2).height();

	            if (centerVH - childDivH0 > 0) {
	                $(".center-view>div").eq(0).css("margin-top", (centerVH - childDivH0) / 2 + "px");
	                $(".center-view>div").eq(2).css("margin-top", (centerVH - childDivH0) / 2 + "px");
	            }
	            if (centerVH - childDivH1 > 0) {
	                $(".center-view>div").eq(1).css("margin-top", (centerVH - childDivH1) / 2 + "px");
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
	            var currentDevice = Util.getCurrentDevice(gatewayId, _TU._T.ehome_CoSDVD.device, serial);
	            if (currentDevice != null) {
	                $('#controlTitle').html(currentDevice.name);
	            }
	        },
	        setDVD: function (id) {
	            if (id.indexOf(userKey) > -1) {
	                SocketUtil.SendUserBtn(device, id);
	                return;
	            }
	            if (id == "play") {
	                if (CoDVD.play == 0) {
	                    $("#play").html('<i class="icon iconfont">' + _TU._T.ehome_CoSDVD.data.stop_icon + '</i>');
	                    CoDVD.play = 1;
	                    SocketUtil.SeCoDVD("play");
	                }
	                else {
	                    $("#play").html('<i class="icon iconfont">' + _TU._T.ehome_CoSDVD.data.play_icon + '</i>');
	                    CoDVD.play = 0;
	                    SocketUtil.SeCoDVD("pause");
	                }
	            }
	            else if (id != "open") {
	                SocketUtil.SeCoDVD(id);
	            }
	            Piece.Store.saveObject("CoDVD", CoDVD, true)
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
	                    if (CoDVD.cusBtns[j] != null && CoDVD.cusBtns[j].num == i) {
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
	    });

	});