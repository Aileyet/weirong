define(['text!ehome/CoSTB.html','../base/util', '../base/socketutil',"../base/templates/template",'../base/tooltip/tooltip','../base/i18nMain'],
	function(viewTemplate,Util,SocketUtil,_TU,Tooltip,I18n) {
		var gatewayId="";
		var serial="";
		var check=null;
		var CoSTB=null;
		var study;
		var viewInitFun, onMenuFn, getNewCustBtnNumFun, customerBtnHtmlFun, setDialogCssFun;;
		var device = _TU._T.ehome_CoSTB.device;
		var deviceStatus, currentDeviceStatusIndex;
		var cusBtns = new Array();
		var userKey = "user";
		return Piece.View.extend({
			id: 'ehome_CoSTB',
			events:{
			    'touchstart #power,#tv-mute,#tv-power,#ok,#left,#right,#up,#down,#director,#Return,#menu,#volUp,#volDown,#tvMute,#tvPower,.custom-btn-div': 'action',
				//"touchstart #study":'onStudy',
				"touchstart #save": "save",
				"tap .opera": "operation",
			},
			render: function() {
				$(this.el).html(viewTemplate);

				Piece.View.prototype.render.call(this);
				return this;
			},
			onLoadTemplate:function(){
				_TU._U.setHeader(_TU._T.ehome_CoSTB);//加载头部导航
				var obj=_TU._T.ehome_CoSTB.data;
				var TemplateHtml = $(this.el).find("#ehome_CoSTB_Template").html();
				var TemplateObj = _.template(TemplateHtml, obj);
				$(".content").html("").append(TemplateObj);
			},
			onShow: function() {
				this.onLoadTemplate();

				customerBtnHtmlFun = this.customerBtnHtml;
				getNewCustBtnNumFun = this.getNewCustBtnNum;
				onMenuFn = this.onMenu;
				viewInitFun = this.viewInit;
				setDialogCssFun = this.setDialogCss;
			
			    check=this.checkValue;
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
				            CoSTB = deviceStatus[i];
				            break;
				        }
				    }
				    if (CoSTB == null) {
				        cusBtns = new Array();
				        CoSTB = { "gatewayId": gatewayId, "device": device, "serial": serial, "cusBtns": cusBtns, };
				        deviceStatus[deviceStatus.length] = CoSTB;
				        currentDeviceStatusIndex = 0;
				        Piece.Store.saveObject("DeviceStatus", deviceStatus, true);
				    }
				}
				else {
				    deviceStatus = new Array();
				    cusBtns = new Array();
				    CoSTB = { "gatewayId": gatewayId, "device": device, "serial": serial, "cusBtns": cusBtns, };
				    deviceStatus[deviceStatus.length] = CoSTB;
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
			    }
			    else{
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
			                for (var i = 0; i < CoSTB.cusBtns.length; i++) {
			                    if (CoSTB.cusBtns[i].id == btnId) {
			                        CoSTB.cusBtns[i].name = name;
			                        Piece.Store.saveObject("DeviceStatus", deviceStatus, true);
			                        $("#" + btnId + " .btnName").text(name);
			                    }
			                }
			            }
			            else {//新增
			                var num = getNewCustBtnNumFun();
			                var item = { "id": userKey + num, "num": num, "name": name };
			                CoSTB.cusBtns[CoSTB.cusBtns.length] = item;
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
			onStudy:function(e){
				var tooltip = new Tooltip();
				tooltip.setCovering(0);
				tooltip.show("ehome/CoSTB");
			},
			action:function(obj){
			     var id='';
				 var order='';
				 if(obj!=null&&obj!='undefined')
					id=obj.srcElement.id==""?obj.srcElement.parentElement.id:obj.srcElement.id;
				 study = Piece.Cache.get("study");
				 var type = Piece.Cache.get("operation-type");
				 if(study==1){
				    // SocketUtil.StudyKey(_TU._T.ehome_CoSTB.device, id);
				     if (id.indexOf(userKey) > -1) {
				         Piece.Cache.put("study-name", $("#" + id + " .btnName").text());
				     }
					  Piece.Cache.put("study-key",id);  
					  Piece.Cache.put("study-module",device);
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
				             for (var i = 0; i < CoSTB.cusBtns.length; i++) {
				                 if (CoSTB.cusBtns[i].id == id) {
				                     CoSTB.cusBtns.splice(i, 1);
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
					 this.setSTB(id);
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
			                if (CoSTB.cusBtns.length >= 10) {
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
			save:function(){
				     $("#editTitle").attr("style","display:none");
					 $("#controlTitle").attr("style",""); 
					 $("#save").attr("style","display:none");
					 $("#study").attr("style", "");
					 Piece.Cache.put("operation-type", null);
					 Piece.Cache.put("study",0);
			},
			checkValue:function()
			{
				     gatewayId=Piece.Cache.get("gatewayId");	
					 if(gatewayId==null||gatewayId=="")
					 {
						 new Piece.Toast(I18n.Common.noMagicBoxError);
						 return;
			    	 }
					 serial=Piece.Cache.get("serial");	
					 if(serial==null||serial=="")
				     {
						 new Piece.Toast(I18n.Common.noDeviceSeriError);
						 return;
			         }
					 var currentDevice = Util.getCurrentDevice(gatewayId,device, serial);
					if(currentDevice!=null){
						$('#controlTitle').html(currentDevice.name);
					}
			},
			setSTB: function (id) {
			    if (id.indexOf(userKey) > -1) {
			        SocketUtil.SendUserBtn(device, id);
			        return;
			    }
			    SocketUtil.SeCoSTBORIPTV(_TU._T.ehome_CoSTB.device, id);
			},
		    //根据获取到的设备值设置设备属性
			viewInit: function () {
			    $('.control-btn').html('')
			    //自定义按钮
			    if (CoSTB.cusBtns.length > 0) {
			        for (var i = 0; i < CoSTB.cusBtns.length; i++) {
			            customerBtnHtmlFun(CoSTB.cusBtns[i]);
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
			            if (CoSTB.cusBtns[j] != null && CoSTB.cusBtns[j].num == i) {
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