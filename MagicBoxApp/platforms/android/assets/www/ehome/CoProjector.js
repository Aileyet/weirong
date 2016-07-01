define(['text!ehome/CoProjector.html', "../base/templates/template", '../base/util', '../base/socketutil',  '../base/tooltip/tooltip', '../base/i18nMain'],
	function (viewTemplate, _TU, Util, SocketUtil, Tooltip, I18n) {
	    var gatewayId = "";
	    var serial = "";
	    var check = null;
	    var study;
	    var CoObj = null;
	    var viewInitFun, onMenuFn, getNewCustBtnNumFun, customerBtnHtmlFun, setDialogCssFun;
	    var device = _TU._T.ehome_CoProjector.device;
	    var deviceStatus, currentDeviceStatusIndex;
	    var cusBtns = new Array();
	    var userKey = "user";
		return Piece.View.extend({
			id: 'ehome_CoProjector',
			events:{
			   // "touchstart #study": 'onStudy',
			    "touchstart #save": "save",
			    'touchstart .custom-btn-div,.div-btn,#exit,#ok,#left,#right,#up,#down,#pc,#video,#source,#zoomin,#zoomout,#picAdd,#picDec,#volUp,#mute,#volDown': 'action',
			    "tap .opera": "operation",
			},
			render: function() {
				$(this.el).html(viewTemplate);

				Piece.View.prototype.render.call(this);
				return this;
			},
			onLoadTemplate:function(){
				_TU._U.setHeader(_TU._T.ehome_CoProjector);//加载头部导航
				var obj=_TU._T.ehome_CoProjector.data;
				var TemplateHtml = $(this.el).find("#ehome_CoProjector_Template").html();
				var TemplateObj = _.template(TemplateHtml, obj);
				$(".content").html("").append(TemplateObj);
			},
			onShow: function() {
			    this.onLoadTemplate();

				/**
				 * 设置中间圆盘的位置
				 */
				var contW = $(".operation").width();
				var contH = $(".operation").height();
				var yuanW = $(".coprojector-floor-radius").width();
				var yuanH = $(".coprojector-floor-radius").height();
				$(".coprojector-floor-radius").css({
					"top":((contH - yuanH)/2)+"px",
					"left":((contW - yuanW)/2)+"px"
					
				});
				
				
			    customerBtnHtmlFun = this.customerBtnHtml;
			    getNewCustBtnNumFun = this.getNewCustBtnNum;
			    setDialogCssFun = this.setDialogCss;
			    onMenuFn = this.onMenu;
			    viewInitFun = this.viewInit;

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
			                CoObj = deviceStatus[i];
			                break;
			            }
			        }
			        if (CoObj == null) {
			            cusBtns = new Array();
			            CoObj = { "gatewayId": gatewayId, "device": device, "serial": serial, "cusBtns": cusBtns, "power": "off" };
			            deviceStatus[deviceStatus.length] = CoObj;
			            currentDeviceStatusIndex = 0;
			            Piece.Store.saveObject("DeviceStatus", deviceStatus, true);
			        }
			    }
			    else {
			        deviceStatus = new Array();
			        cusBtns = new Array();
			        CoObj = { "gatewayId": gatewayId, "device": device, "serial": serial, "cusBtns": cusBtns, "power": "off" };
			        deviceStatus[deviceStatus.length] = CoObj;
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
			    }else {
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
			                for (var i = 0; i < CoObj.cusBtns.length; i++) {
			                    if (CoObj.cusBtns[i].id == btnId) {
			                        CoObj.cusBtns[i].name = name;
			                        Piece.Store.saveObject("DeviceStatus", deviceStatus, true);
			                        $("#" + btnId + " .btnName").text(name);
			                    }
			                }
			            }
			            else {//新增
			                var num = getNewCustBtnNumFun();
			                var item = { "id": userKey + num, "num": num, "name": name };
			                CoObj.cusBtns[CoObj.cusBtns.length] = item;
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
			    tooltip.setCovering(0);
			    tooltip.show("ehome/CoProjector");
			},
			action: function (obj) {
			    var order = '';
			    var id = '';
			    if (obj != null && obj != 'undefined')
			        id = obj.currentTarget.id == "" ? obj.currentTarget.parentElement.id : obj.currentTarget.id;
			    study = Piece.Cache.get("study");
			    var type = Piece.Cache.get("operation-type");
			    if (study == 1) {
			       // SocketUtil.StudyKey(device, id);
			        if (id.indexOf(userKey) > -1) {
			            Piece.Cache.put("study-name", $("#" + id + " .btnName").text());
			        }
			        Piece.Cache.put("study-key", id);
			        Piece.Cache.put("study-module", device);
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
			                for (var i = 0; i < CoObj.cusBtns.length; i++) {
			                    if (CoObj.cusBtns[i].id == id) {
			                        CoObj.cusBtns.splice(i, 1);
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
			        this.setProj(id);
			    }
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
			                if (CoObj.cusBtns.length >= 10) {
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
			save: function () {
			    $("#editTitle").attr("style", "display:none");
			    $("#controlTitle").attr("style", "");
			    $("#save").attr("style", "display:none");
			    $("#study").attr("style", "");
			    Piece.Cache.put("operation-type", null);
			    Piece.Cache.put("study", 0);
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
			    var currentDevice = Util.getCurrentDevice(gatewayId, device, serial);
			    if (currentDevice != null) {
			        $('#controlTitle').html(currentDevice.name);
			    }
			},
			setProj: function (id) {
			    if (id.indexOf(userKey) > -1) {
			        SocketUtil.SendUserBtn(device, id);
			        return;
			    }
			    if (id == "power") {
			        CoObj = deviceStatus[currentDeviceStatusIndex];
			        if (CoObj.power == "off") {
			            CoObj.power = "on";
			          
			            SocketUtil.SeProjector("on");
			        } else {
			            CoObj.power = "off";
			            SocketUtil.SeProjector("off");
			        }
			        Piece.Store.saveObject("DeviceStatus", deviceStatus, true);
			    }
			    else {
			        SocketUtil.SeProjector(id);
			    }
			},
		    //根据获取到的设备值设置设备属性
			viewInit: function () {
			    $('.control-btn').html('')
			    //自定义按钮
			    if (CoObj.cusBtns.length > 0) {
			        for (var i = 0; i < CoObj.cusBtns.length; i++) {
			            customerBtnHtmlFun(CoObj.cusBtns[i]);
			        }
			    }
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
			            if (CoObj.cusBtns[j] != null && CoObj.cusBtns[j].num == i) {
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
		}); //view define

	});