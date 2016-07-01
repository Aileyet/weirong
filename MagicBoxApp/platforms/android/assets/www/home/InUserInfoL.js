define(['text!home/InUserInfoL.html', '../base/validate', "../base/openapi", '../base/util', '../base/templates/template', '../base/socketutil', '../base/drag/menuStoreUtil'],
	function (viewTemplate, validate, OpenAPI, Util, _TU, SocketUtil, MenuUtil) {
	    var phoneType;
	    var GetDeviceFun;
	    if (navigator.userAgent.indexOf("iPhone") > -1) {
	        phoneType = "IOS";
	    } else {
	        phoneType = "Android";
	    }

	    return Piece.View.extend({
	        id: 'home_InUserInfoL',
	        events: {
	            "touchstart #btnRegister": "onToRegister",
	            "touchstart #loginSubmitBtn": "login",
	            "touchstart #qqLoginBtn": "qqLogin",
	            "touchstart #wbLoginBtn": "wbLogin",
	            "touchstart #wxLoginBtn": "wxLogin",
	            "touchstart #eye": "onShowAndHide"
	        },
	        onToRegister: function (e) {
	            Backbone.history.navigate("home/InUserInfoReg", {
	                trigger: true
	            });
	        },
	        render: function () {
	            $(this.el).html(viewTemplate);
	            Piece.View.prototype.render.call(this);
	            return this;
	        },
	        onShowAndHide: function () {
	            var passtype = $("#loginPassword").attr("type");
	            if (passtype == "text") {
	                $("#loginPassword").attr("type", "password");
	            } else if (passtype == "password") {
	                $("#loginPassword").attr("type", "text");
	            }
	        },
	        onLoadTemplate: function () {
	            _TU._U.setHeader(_TU._T.home_InUserInfoL);//替换头部导航
	            var userInfoTemplate = $(this.el).find("#LoginTemplate").html();
	            var userInfoHtml = _.template(userInfoTemplate, _TU._T.home_InUserInfoL.data);
	            $(".content").html("");
	            $(".content").append(userInfoHtml);
	        },
	        onShow: function () {
	            this.onLoadTemplate();
	            _TU._U.goBack(function () {
	                Backbone.history.navigate("home/MeIndex", { trigger: true });
	                return;
	            });
	            GetDeviceFun = this.GetDevice;
	        },
	        jsAjax: function (url, callback) {
	            var xmlhttp;
	            if (window.XMLHttpRequest) {
	                xmlhttp = new XMLHttpRequest();
	            }
	            else {
	                xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	            }
	            xmlhttp.open("GET", url, true);
	            //设置回调函数
	            xmlhttp.onreadystatechange = function () {
	                if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
	                    responseJson = eval("(" + xmlhttp.responseText + ")");
	                    callback(responseJson);
	                }
	            }
	            //发送请求
	            xmlhttp.send(null);
	        },
	        addThirdPartyUser: function (arrParam) {
	            Util.Ajax(OpenAPI.addThirdPartyUser, "GET", {
	                "appForm.externalAuthId": arrParam["externalAuthId"],
	                "appForm.nickName": arrParam["nickName"],
	                "appForm.thirdPartyTypeId": arrParam["thirdPartyTypeId"],
	                "appForm.thumbnail": arrParam["thumbnail"],
	                "appForm.lastLocale": arrParam["lastLocale"],
	                "appForm.emailAddress": arrParam["emailAddress"],
	                "appForm.mobilePhone": arrParam["mobilePhone"],
	                "appForm.sex": arrParam["sex"],
	                "appForm.fullName": arrParam["fullName"],
	                dataType: 'jsonp'
	            }, 'jsonp', function (data, textStatus, jqXHR) {
	                if (data.result == "success") {
	                    var user_info = {
	                        username: data.retObj.nickName,
	                        password: "",
	                        isCheckd: true,
	                        nickName: data.retObj.nickName
	                    };
	                    var user_token = data.retObj;
	                    user_token.addTime = new Date().getTime();
	                    user_token.expiresIn = 604800;
	                    Piece.Store.deleteObject("user_info", true);
	                    Piece.Store.deleteObject("user_token", true);
	                    Piece.Store.saveObject("user_info", user_info, true);
	                    Piece.Store.saveObject("loginId", data.retObj.userLoginId, true);
	                    Piece.TempStage.loginId(data.retObj.userLoginId);
	                    Piece.TempStage.loginUser(user_info);
	                    Piece.Store.saveObject("user_token", user_token, true);
	                    new Piece.Toast(_TU.I18n.Common.signInSuccess);
	                    Backbone.history.navigate("home/MeIndex", {
	                        trigger: true
	                    });
	                    GetDeviceFun();
	                } else {
	                    new Piece.Toast(_TU.I18n.Common.AuthorizationFailed);
	                }
	            }, function (e, xhr, type) {
	                new Piece.Toast(_TU.I18n.Common.AuthorizationFailed);
	            });
	        },
	        qqLogin: function () {
	            var me = this;
	            if (phoneType == "IOS") {
	                cordova.exec(function (msg) {
	                    // 识别成果回调
	                    console.log(msg);
	                    new Piece.Toast(msg);


	                }, function (msg) {
	                    new Piece.Toast(msg);
	                    // 识别失败回调
	                    console.log(msg);


	                }, "QQAuthLogin", "authLogin", []);
	            } else if (phoneType == "Android") {
	                var qqLogin = window.QQLogin;
	                if (qqLogin) {
	                    qqLogin.ssoLogin(function (res) {
	                        me.getQQUserInfo(res.token, res.appid, res.uid);
	                    }, function () {
	                        new Piece.Toast(_TU.I18n.Common.AuthorizationFailed);
	                    });
	                } else {
	                    new Piece.Toast(_TU.I18n.Common.AuthorizationFailed);
	                }
	            }
	        },
	        getQQUserInfo: function (token, appid, uid) {
	            var me = this;
	            if (!(token && appid && uid)) {
	                new Piece.Toast(_TU.I18n.Common.AuthorizationFailed);
	                return;
	            }
	            var url = OpenAPI.get_QQUser_info + "?access_token=" + token + "&oauth_consumer_key=" + appid + "&openid=" + uid + "&format=json";
	            me.jsAjax(url, function (data) {
	                var arrParam = new Array();
	                arrParam["externalAuthId"] = uid;
	                arrParam["nickName"] = data.nickname;
	                arrParam["thirdPartyTypeId"] = "QQ";
	                arrParam["thumbnail"] = data.figureurl_qq_1;
	                arrParam["lastLocale"] = "";
	                arrParam["emailAddress"] = "";
	                arrParam["mobilePhone"] = "";
	                arrParam["sex"] = (data.gender == "女" ? "F" : "M");
	                arrParam["fullName"] = "";
	                me.addThirdPartyUser(arrParam);
	            });
	        },
	        wbLogin: function () {
	            var me = this;
	            if (phoneType == "IOS") {
	                cordova.exec(function (msg) {
	                    // 识别成果回调
	                    console.log(msg);
	                    new Piece.Toast(msg);


	                }, function (msg) {

	                    // 识别失败回调
	                    console.log(msg);
	                    new Piece.Toast(msg);

	                }, "WeiBoAuthLogin", "authLogin", []);
	            } else if (phoneType == "Android") {
	                var weiboLogin = window.WeiboLogin;
	                if (weiboLogin) {
	                    weiboLogin.ssoLogin(function (res) {
	                        me.getWBUserInfo(res.token, res.uid);
	                    }, function () {
	                        new Piece.Toast(_TU.I18n.Common.AuthorizationFailed);
	                    });
	                } else {
	                    new Piece.Toast(_TU.I18n.Common.AuthorizationFailed);
	                }
	            }
	        },
	        getWBUserInfo: function (token, uid) {
	            var me = this;
	            if (!(token && uid)) {
	                new Piece.Toast(_TU.I18n.Common.AuthorizationFailed);
	                return;
	            }
	            var url = OpenAPI.get_WBUser_info + "?access_token=" + token + "&uid=" + uid;
	            me.jsAjax(url, function (data) {
	                var arrParam = new Array();
	                arrParam["externalAuthId"] = uid;
	                arrParam["nickName"] = data.screen_name;
	                arrParam["thirdPartyTypeId"] = "WEIBO";
	                arrParam["thumbnail"] = data.profile_image_url;
	                arrParam["lastLocale"] = data.lang;
	                arrParam["emailAddress"] = "";
	                arrParam["mobilePhone"] = "";
	                arrParam["sex"] = (data.gender == "女" ? "F" : "M");
	                arrParam["fullName"] = "";
	                me.addThirdPartyUser(arrParam);
	            });
	        },
	        wxLogin: function () {
	            var me = this;
	            if (phoneType == "IOS") {
	                cordova.exec(function (msg) {
	                    // 识别成果回调
	                    console.log(msg);

	                    new Piece.Toast(msg);

	                }, function (msg) {

	                    // 识别失败回调
	                    console.log(msg);
	                    new Piece.Toast(msg);

	                }, "WeChatAuthLogin", "sendAuthRequest", []);
	            } else if (phoneType == "Android") {
	                var weixionLogin = window.Wechat;
	                if (weixionLogin) {
	                    // weixionLogin.isInstalled(function(res) {
	                    // 	console.log(res);
	                    //       	new Piece.Toast(res);
	                    //    }, function() {
	                    //        new Piece.Toast(_TU.I18n.Common.wxClientNotInstalled);
	                    //        return;
	                    //    });
	                    var scope = "snsapi_userinfo";
	                    var state = "_" + (+new Date());
	                    weixionLogin.auth(scope, state, function (res) {
	                        me.getWXUserInfo(res.code, res.lang);
	                    }, function () {
	                        new Piece.Toast(_TU.I18n.Common.AuthorizationFailed);
	                    });
	                } else {
	                    new Piece.Toast(_TU.I18n.Common.AuthorizationFailed);
	                }
	            }
	        },
	        getWXUserInfo: function (code, lang) {
	            var me = this;
	            if (!(code)) {
	                new Piece.Toast(_TU.I18n.Common.AuthorizationFailed);
	                return;
	            }
	            var url = OpenAPI.get_WXoauth2 + "?appid=wx19545caa6b654cc6&secret=acab61a073155a941ce22aa91ab30625&code=" + code + "&grant_type=authorization_code"
	            me.jsAjax(url, function (data) {
	                url = OpenAPI.get_WXUser_info + "?access_token=" + data.access_token + "&openid=" + data.openid;
	                me.jsAjax(url, function (data) {
	                    var arrParam = new Array();
	                    arrParam["externalAuthId"] = data.openid;
	                    arrParam["nickName"] = data.nickname;
	                    arrParam["thirdPartyTypeId"] = "WEIBO";
	                    arrParam["thumbnail"] = data.headimgurl;
	                    arrParam["lastLocale"] = lang;
	                    arrParam["emailAddress"] = "";
	                    arrParam["mobilePhone"] = "";
	                    arrParam["sex"] = (data.gender == "2" ? "F" : "M");
	                    arrParam["fullName"] = "";
	                    me.addThirdPartyUser(arrParam);
	                });
	            });
	        },
	        login: function () {

	            var u = $("#loginUserName").val();
	            var p = $("#loginPassword").val();
	            if (u === null || u === undefined || u === "") {
	                //todo
	                new Piece.Toast(_TU.I18n.Common.accounMsg);

	            } else if (p === null || p === undefined || p === "") {
	                new Piece.Toast(_TU.I18n.Common.enterPasswordMsg);
	            } else {
	                if (!validate.emailV($("#loginUserName")) && !validate.phoneV($("#loginUserName"))) {
	                    new Piece.Toast(_TU.I18n.Common.accounMsg);
	                    return;
	                }

	                if (p.length > 12 || p.length < 6) {
	                    new Piece.Toast(_TU.I18n.Common.passwordLength);
	                    return;
	                }
	                //检查网络
	                if (pieceConfig.enablePhoneGap == true && Util.checkConnection() == 'No network connection') {
	                    new Piece.Toast(_TU.I18n.Common.connectNetFailed);
	                    return;
	                }
	                Util.Ajax(OpenAPI.access_token, "GET", {
	                    clientId: OpenAPI.clientId,
	                    clientSecret: OpenAPI.clientSecret,
	                    grantType: "refresh_token",
	                    username: u,
	                    password: p,
	                    dataType: 'jsonp'
	                }, 'jsonp', function (data, textStatus, jqXHR) {

	                    if (data.responseCode != 0) {
	                        new Piece.Toast(_TU.I18n.Common.signInError);
	                        return;
	                    }
	                    // 判断是否保存密码
	                    var isCheckd = $('.rememberPassword').is(":checked");
	                    if (isCheckd) {
	                        $('.rememberPassword').attr("checked", "true");
	                    } else {
	                        $('.rememberPassword').attr("checked", "false");
	                    }
	                    var user_info = {
	                        username: u,
	                        password: p,
	                        isCheckd: isCheckd,
	                        nickName: data.nickName
	                    };
	                    Piece.Store.deleteObject("user_info", true);
	                    Piece.Store.deleteObject("user_token", true);
	                    Piece.Store.saveObject("user_info", user_info, true);
	                    Piece.Store.saveObject("loginId", data.userLoginId, true);
	                    Piece.TempStage.loginId(data.userLoginId);
	                    Piece.TempStage.loginUser(user_info);
	                    data.addTime = new Date().getTime();
	                    Piece.Store.saveObject("user_token", data, true);
	                    new Piece.Toast(_TU.I18n.Common.signInSuccess);
	                    MenuUtil.readMenuFromService(function () {
	                        Backbone.history.navigate("home/MeIndex", {
	                            trigger: true
	                        });
	                    });

	                    GetDeviceFun();

	                }, function (e, xhr, type) {
	                    new Piece.Toast(_TU.I18n.Common.signInError);
	                });

	            }
	        },
	        GetDevice: function () {
	            Piece.Store.saveObject("magicList", null, true);
	            Piece.Store.saveObject("DeviceList", null, true);

	            Util.sockConnect();
	            if (stompClient != null && stompClient.connected) {
	                SocketUtil.GetDevices();
	            } else {
	                var intev = null;
	                var ifok = false;
	                var begin = (new Date());
	                var fun = function () {
	                    if ((stompClient != null && stompClient.connected) || ((new Date()) - begin) > 10000) {
	                        ifok = true;
	                        window.clearInterval(intev);
	                        SocketUtil.GetDevices();
	                    }
	                }
	                var intev = window.setInterval(fun, 10);
	            }
	        }
	    });
	});