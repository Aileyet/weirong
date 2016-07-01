define(['zepto', "../base/openapi", "sockjs", "../base/constant", "../base/schema"], function ($, OpenAPI, SockJs, Cons, Schema) {
    var Util = {

        /**
		 * 加载模板列表
		 * 
		 * @param me 当前对象
		 * @param obj {
		 * 			listName : "列表id"，
		 * 			url : action请求URL
		 * 			params 参数 
		 * 			isFromServer 是否从服务器加载
	     *             若：true 都从服务器加载 false 先判断本地是否有若有就直接从本地加载
		 *             若没有就从服务器请求
		 *         callback 回调方法
		 *         	items : [{
		 *					text:"删除该选项",
		 *					click: function(menu, event) {
		 *					}
		 *				},{
		 *					iconCls:"icon-book",
		 *					text:"增加该选项",
		 *					click: function(menu, event) {
		 *					}
		 *		    }]
		 *   }
		 */
        loadList: function (me, obj) {
            // 获取组件
            var list = me.component(obj.listName);
            list.config.url = obj.url;
            list.reqObj = obj || {};

            // 从服务器加载
            if (obj.isFromService || !Piece.Store.loadObject(obj.listName + "-flag")) {
                list.setRequestParams();
            } else {
                // 若本地存在直接从本地取
                if (list.isExistStoreData(obj)) {
                    list.loadListByStoreData();
                } else {
                    list.setRequestParams();
                }
            }
            this.requestList(obj.listName, false);
        },

        requestList: function (listName, flag) {
            Piece.Store.saveObject(listName + "-flag", flag || false);
        },
        loadDifferentUsersList: function (me, listName, url, params, isLoadFrom, isLoadFromID, reload) {
            var list = me.component(listName); // 获取组件
            list.config.url = url;
            params.client_id = OpenAPI.client_id;
            var oldList = Piece.Store.loadObject("cube-list-" + isLoadFrom)
            if (reload) {
                list.setRequestParams(params);
                return;
            }
            //当List是根据不同的用户而变化时，通过isLoadFrom拿取缓存中的标识ID与idLoadFromID比较判断是否拿缓存，common/common-seeUser
            if (oldList === null) {
                list.setRequestParams(params);
            } else {
                if (oldList[0].author === isLoadFromID) {
                    list.loadListByStoreData(url, params);
                } else {
                    list.setRequestParams(params);
                }
            }

        },

        reloadPage: function (url) {
            setTimeout(function () {
                Backbone.history.navigate("#", {
                    trigger: false
                });

                Backbone.history.navigate(url, {
                    trigger: true
                });

            }, 1000);
        },
        cleanStoreListData: function (id) {
            // 在注销登陆时，调用此方法清除我的空间缓存
            var CACHE_ID = 'cube-list-' + id;
            Piece.Store.deleteObject(CACHE_ID);
            Piece.Store.deleteObject(CACHE_ID + "-config");
            Piece.Store.deleteObject(CACHE_ID + "-params");
            Piece.Store.deleteObject(CACHE_ID + "-scrollY");

        },

        StripHtml: function (html) {
            html = html || "";
            var scriptregex = "<scr" + "ipt[^>.]*>[sS]*?</sc" + "ript>";
            var scripts = new RegExp(scriptregex, "gim");
            html = html.replace(scripts, " ");

            //Stripts the <style> tags from the html
            var styleregex = "<style[^>.]*>[sS]*?</style>";
            var styles = new RegExp(styleregex, "gim");
            html = html.replace(styles, " ");

            //Strips the HTML tags from the html
            var objRegExp = new RegExp("<(.| )+?>", "gim");
            var strOutput = html.replace(objRegExp, " ");

            //Replace all < and > with &lt; and &gt;
            strOutput = strOutput.replace(/</, "&lt;");
            strOutput = strOutput.replace(/>/, "&gt;");

            objRegExp = null;
            return strOutput;
        },

        getIdFromUrl: function (moduleName, url) {
            var names = url.split("/");
            var index = names.indexOf(moduleName);
            return names[index + 1];

        },
        imgGoToUserInfor: function (imgEl) {
            var $target = $(imgEl.currentTarget);
            var id = $target.attr("data-id");
            var author = $target.attr("data-author");
            var authorid = $target.attr("data-authorid");
            author = encodeURI(author);
            Backbone.history.navigate("common/common-seeUser?id=" + id + "&fromAuthor=" + author + "&fromAuthorId=" + authorid, {
                trigger: true
            });
        },
        checkLogin: function () {
            var me = this;
            var user_info = Piece.Store.loadObject("user_token", true);
            if (user_info === null || user_info === "" || user_info === undefined) {
                return false;
            }
            var user_timeout = user_info.expiresIn;
            var user_systime = user_info.addTime;
            var timeNow = new Date().getTime();
            var calc = timeNow - user_systime;
            // modi by wjl 2015-07-31 begin
            if ((calc / 1000) < user_timeout) {
               // me.sockConnect();
                return true;
            } else {
                me.sockDisconnect();
                Piece.Store.deleteObject("user_token", true);
                Piece.Store.deleteObject("user_message", true);
                return false;
            }
            // modi by wjl 2015-07-31 end
        },
        checkConnection: function () {
            var networkState = navigator.connection.type;

            var states = {};
            states[Connection.UNKNOWN] = 'Unknown connection';
            states[Connection.ETHERNET] = 'Ethernet connection';
            states[Connection.WIFI] = 'WiFi connection';
            states[Connection.CELL_2G] = 'Cell 2G connection';
            states[Connection.CELL_3G] = 'Cell 3G connection';
            states[Connection.CELL_4G] = 'Cell 4G connection';
            states[Connection.NONE] = 'No network connection';
            return states[networkState];
        },
        bigImg: function (el) {
            //如果confirm出现，那么return，不查看大图。
            if (typeof $('.cube-dialog-screen').get(0) != 'undefined') {
                return;
            };
            var $target = $(el.currentTarget);
            var imgsrc = $target.attr("img-data");
            if (imgsrc == null) {
                imgsrc = $target.attr("src");
            }
            console.info(imgsrc);
            $('.bigImg').attr("src", imgsrc);
            var img = new Image;
            loader = new Piece.Loader({
                autoshow: true, //是否初始化时就弹出加载控件
                target: 'body' //页面目标组件表识
            });
            img.onload = function () {
                var OriginalWidth = img.width;
                OriginalHeight = img.height;
                bigImg.show({
                    ImgWidth: OriginalWidth,
                    ImgHeight: OriginalHeight
                });
                loader.hide();

            };
            img.src = imgsrc;
        },
        removeImg: function (htmlstr) {
            var replaceHtml;
            var loadImg = Piece.Session.loadObject("loadImg");
            //勾选了加载图片
            if (loadImg == "1") {
                replaceHtml = htmlstr;
                return replaceHtml;
            }

            //没勾选加载图片，那么在wifi的网络下加载图片
            if (navigator.connection) {
                var networkState = navigator.connection.type;

                var states = {};
                states[Connection.UNKNOWN] = 'Unknown connection';
                states[Connection.ETHERNET] = 'Ethernet connection';
                states[Connection.WIFI] = 'WiFi connection';
                states[Connection.CELL_2G] = 'Cell 2G connection';
                states[Connection.CELL_3G] = 'Cell 3G connection';
                states[Connection.CELL_4G] = 'Cell 4G connection';
                states[Connection.NONE] = 'No network connection';
                if (states[networkState] == "WiFi connection") {
                    replaceHtml = htmlstr;
                    return replaceHtml;
                }

            }
            //其他网络条件下不加载图片
            replaceHtml = htmlstr.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, " ");

            return replaceHtml;

        },

        request: function (paras) {
            var url = location.href;
            var paraString = url.substring(url.indexOf("?") + 1, url.length).split("&");

            var returnValue;
            for (i = 0; i < paraString.length; i++) {
                var tempParas = paraString[i].split('=')[0];
                var parasValue = paraString[i].split('=')[1];

                if (tempParas === paras)
                    returnValue = parasValue;
            }

            if (typeof (returnValue) == "undefined") {
                return "";
            } else {
                return returnValue;
            }
        },
        requestView: function () {
            var url = location.href;
            return "/" + url.substring(url.indexOf("#") + 1, url.length).split("?")[0];
        },

        eventBubble: function (el) {
            //A标签事件 与 列表详情 事件，事件冒泡.
            var eventHTML = el.target.outerHTML;
            var eventB = eventHTML.substr(1, 4);
            var eventLink = eventHTML.substr(12, 11); //删除动弹截取。事件冲突
            //去掉空格
            eventB = eventB.replace(/^\s*/, "").replace(/\s*$/, "");
            eventLink = eventLink.replace(/^\s*/, "").replace(/\s*$/, "");
            if (eventB == 'div' || eventLink == "cube-dialog") {
                return true
            } else {
                return false
            }
        },

        isExistStoreData: function (listName, params, cubeName) {

            var isSearchBps = false;
            if (listName == "id_bs_rs_search_rs_detail") {
                isSearchBps = true;
            }
            var pts = [4];
            if (Piece.Store.loadObject(cubeName + listName) != "null" && Piece.Store.loadObject(cubeName + listName)) {
                var listParams = Piece.Store.loadObject(cubeName + listName + "-params") || "{}";
                for (var p in params) {
                    if (isSearchBps && p == "scForm.lat") {
                        pts[0] = params[p];
                        pts[2] = listParams[p];
                        continue;
                    } else if (isSearchBps && p == "scForm.lng") {
                        pts[1] = params[p];
                        pts[3] = listParams[p];
                        continue;
                    }
                    if (params[p] != listParams[p]) {
                        return false;
                    }
                }
                if (isSearchBps && this.getDistance(pts[0], pts[1], pts[2], pts[3]) > Cons.SEARCH_BPS_DISTANCE_DIFF) {
                    return false;
                }
                return true;
            }
            return false;
        },

        /**
		 * 加载详情模板到Store
		 * 
		 * @param key 区分关键字 建议直接写 模板id
		 * @param action请求URL
		 * @param params 参数
		 * @param isService 是否从服务器加载
		 *    若：true 都从服务器加载 false 先判断本地是否有若有就直接从本地加载
		 *    若没有就从服务器请求
		 *  @param callback 回调方法
		 */
        loadObj: function (key, urls, params, isService, callback) {
            if (isService == true) {
                this.setRequestParams(key, urls, params, callback);
            } else {
                if (this.isExistStoreData(key, params, "cube-obj-")) {
                    if ($.isFunction(successCallback)) {
                        var data = Piece.Store.get("cub-obj-" + key);
                        callback(data);
                    } else {
                        throw new Error('返回方法不正确！');
                    }
                } else {
                    this.setRequestParams(key, urls, params, callback);
                }
            }
        },
        setRequestParams: function (key, url, params, callback) {
            var loader = new Piece.Loader({
                autoshow: true, //是否初始化时就弹出加载控件
                target: 'body' //页面目标组件表识
            });

            $.get(url, params, function (res) {
                loader.hide();
                if (res.errCode == 0) {
                    Piece.Store.saveObject("cub-obj-" + key, res.data);
                    Piece.Store.saveObject("cub-obj-" + key + "-params", params);
                    callback(res.data);
                } else {
                    new Piece.Toast(res.errMsg);
                }
            }, 'jsonp');
        },

        /**
		 * 服务器请求数据 不保存本地
		 * 
		 * @param action请求URL
		 * @param params 参数
		 * @param callback 回调方法
		 * @param noLoading 是否不需要 加载阴影层
		 *    若为true 表示不需要 默认表示需要
		 */
        _Ajax: function (url, params, callback, loading) {
            var loader = null;
            if (loading == true) {
                loader = new Piece.Loader({
                    autoshow: true, //是否初始化时就弹出加载控件
                    target: 'body' //页面目标组件表识
                });
            }

            $.get(url, params, function (res) {
                if (loader) {
                    loader.hide();
                }
                if (res.errCode == 0) {
                    if ($.isFunction(callback)) {
                        callback(res.data);
                    }
                } else {
                    new Piece.Toast(res.errMsg);
                }
            }, "jsonp");
        },

        Ajax: function (urls, types, datas, dataTypes, successCallback, errorCallback, completeCallback) {
            var loader;
            var meUrls = urls;
            $.ajax({
                timeout: 2000 * 1000,
                url: urls,
                type: types,
                data: datas,
                dataType: "jsonp",
                contentType: "application/x-www-form-urlencoded; charset=utf-8",
                beforeSend: function (xhr, settings) {
                    loader = new Piece.Loader({
                        autoshow: true, //是否初始化时就弹出加载控件
                        target: 'body' //页面目标组件表识
                    });
                },
                success: function (data, textStatus, jqXHR) {
                    if (successCallback !== null && successCallback !== undefined) {
                        successCallback(data, textStatus, jqXHR);
                    }
                },
                error: function (e, xhr, type) {
                    if (errorCallback !== null && errorCallback !== undefined) {
                        errorCallback(e, xhr, type);
                    } else {
                        console.info("============")
                        console.info(xhr);
                        console.info(type);
                        console.info(e);
                        new Piece.Toast("请求出错，请稍后尝试");
                    }
                },
                complete: function (xhr, status) {
                    console.info(status)
                    console.info(xhr)

                    loader.hide();
                    if (completeCallback && completeCallback()) {
                        completeCallback(xhr, status);
                    }
                }
            });
        },
        AjaxWait: function (urls, types, datas, dataTypes, successCallback, errorCallback, completeCallback) {
            var loader;
            var meUrls = urls;
            $.ajax({
                timeout: 5 * 1000,
                url: urls,
                type: types,
                async: false,
                data: datas,
                dataType: "jsonp",
                contentType: "application/x-www-form-urlencoded; charset=utf-8",
                beforeSend: function (xhr, settings) {
                    loader = new Piece.Loader({
                        autoshow: true, //是否初始化时就弹出加载控件
                        target: 'body' //页面目标组件表识
                    });
                },
                success: function (data, textStatus, jqXHR) {
                    if (successCallback !== null && successCallback !== undefined) {
                        successCallback(data, textStatus, jqXHR);
                    }

                },
                error: function (e, xhr, type) {
                    if (errorCallback !== null && errorCallback !== undefined) {
                        errorCallback(e, xhr, type);
                    } else {
                        console.info("============")
                        console.info(xhr);
                        console.info(type);
                        console.info(e);
                        new Piece.Toast("请求出错，请稍后尝试");
                    }
                },
                complete: function (xhr, status) {
                    console.info(status)
                    console.info(xhr)

                    loader.hide();
                    if (completeCallback && completeCallback()) {
                        completeCallback(xhr, status);
                    }
                }
            });
        },
        AjaxNoLoading: function (urls, types, datas, dataTypes, successCallback, errorCallback, completeCallback) {
            datas.client_id = OpenAPI.client_id;
            var loader;
            var meUrls = urls;
            $.ajax({
                timeout: 2000 * 1000,
                url: urls,
                type: types,
                data: datas,
                dataType: "jsonp",
                beforeSend: function (xhr, settings) {
                },
                success: function (data, textStatus, jqXHR) {
                    if (successCallback !== null && successCallback !== undefined) {
                        successCallback(data, textStatus, jqXHR);
                    }

                },
                error: function (e, xhr, type) {
                    if (errorCallback !== null && errorCallback !== undefined) {
                        errorCallback(e, xhr, type);
                    } else {
                        new Piece.Toast("请求出错，请稍后尝试");
                    }
                },
                complete: function (xhr, status) {
                    if (completeCallback && completeCallback()) {
                        completeCallback(xhr, status);
                    }
                }
            });
        },

        /**
		 * 获取冒泡父类的节点对象
		 * 
		 * @event 事件event
		 * @param 选择匹配参数 
		 * 
		 *  @example getParentNode(event, ".star");
		 *  获取样式为star的父节点
		 */
        getParentNode: function (event, param) {
            var target = $(event.target);
            return target.is(param) ? target : target.parents(param);
        },

        /**
		 * 星级评价使用，可以用在N个星级的评价
		 *  
		 * @event 可传入事件event或者score
		 * showMsg 是否显示后面的分数
		 */
        rating: function (event, showMsg) {
            var index = this.getParentNode(event, "li").index();
            var score = index + 1;
            var ul = this.getParentNode(event, ".star");
            var lis = ul.find("li");

            lis.removeClass("on");
            for (var i = 0; i < score; i++) {
                lis.eq(i).addClass("on");
            }

            if (showMsg == true) {
                ul.siblings("span").html("<strong>" + score + " 分</strong>");
            }
        },

        toggleFoot: function () {
            $('#footer-more-detail').toggle();
            $("#more-detail-mask").toggle();

            $('#more-detail-mask').click(function () {
                $('#footer-more-detail').hide();
                $("#more-detail-mask").hide();
            });
        },
        getTimestamp: function () {
            return (new Date()).valueOf();
        },


        /**
		 * 字符串 businessTypeIds 转json类型
		 * returns json
		 */
        idsToJson: function (str) {
            if (!str) {
                return;
            }

            var arr = str.split(",");
            var idsJson = {};
            for (var i = 0; i < arr.length; i++) {
                idsJson[arr[i]] = "";
            }
            return idsJson
        },

        /**
		 * 通过businessTypeIds 获取相应的businessTypeNames 列表
		 * 
		 * @param businessTypeIds 业务ids 如：json {1:"",2:""}
		 * @param bankPointId  str
		 * @param nodeId 要渲染的节点id
		 */
        getBusinessTypeNames: function (businessTypeIds, bankPointId, nodeId) {
            var businessTypes = Piece.Cache.get("businessTypes_" + bankPointId) || {};
            if ($.isEmptyObject(businessTypes)) {
                Util.Ajax(OpenAPI.getBusinessPage, "GET", {
                    "appForm.bankPointId": bankPointId
                }, 'jsonp', function (data, textStatus, jqXHR) {
                    var typeJson = {};
                    var businessTypes = data.dataList;
                    for (var j = 0; businessTypes && j < businessTypes.length; j++) {
                        typeJson[businessTypes[j].businessTypeId] = businessTypes[j].businessTypeName;
                    }
                    Piece.Cache.put("businessTypes_" + bankPointId, typeJson);

                    var names = getNames(businessTypeIds, typeJson);
                    $("#" + nodeId).text(names);
                }, null, null);
            } else {
                var names = getNames(businessTypeIds, businessTypes);
                $("#" + nodeId).text(names);
            }

            function getNames(businessTypeIds, typeJson) {
                var names = "";
                for (var id in businessTypeIds) {
                    if (typeJson[id]) {
                        names += typeJson[id] + ",";
                    }
                }
                return names.substring(0, names.length - 1);
            }
        },

        getKeys: function (json) {
            var keys = "";
            for (i in json) {
                keys += i + ","
            }
            return keys.substring(0, keys.length - 1);
        },

        gotoPage: function (slector, slector2) {
            $(slector).show().siblings(slector2).hide();
        },

        showBTypeNames: function (node) {
            var businessTypeIds = "" + node.data("businesstypeids");
            var btypeNames = "";
            if (businessTypeIds) {
                businessTypeIds = businessTypeIds.split(",");
                for (var i = 0; i < businessTypeIds.length; i++) {
                    var name = $("#" + businessTypeIds[i]).data("type");
                    if (name && name != "undefined") {
                        btypeNames += "," + name;
                    }
                }
                btypeNames = btypeNames.substring(1, btypeNames.length);
            }
            node.text(btypeNames)
        },
        /**
		 * 设置已选择的
		 */
        alreadySelect: function (id) {
            var node = $("#" + id);
            var businessTypeIds = "" + node.data("businesstypeids");
            var typeNames = node.text();

            if (businessTypeIds && businessTypeIds != "undefined") {
                var busniessArr = businessTypeIds.split(",");
                for (var i = 0; i < busniessArr.length; i++) {
                    $("#" + busniessArr[i]).addClass("ok");
                }
                Piece.Cache.put(id + "_businessTypeIds", businessTypeIds);
                Piece.Cache.put(id + "_typeNames", typeNames);
            } else {
                Piece.Cache.put(id + "_businessTypeIds", null);
                Piece.Cache.put(id + "_typeNames", null);
            }
        },

        /**
		 * 设置选中状态
		 */
        select: function (event, id) {
            var targetNode = this.getParentNode(event, "dd");
            var key = targetNode.attr("id");
            var type = targetNode.data("type");

            var businessTypeIds = Piece.Cache.get(id + "_businessTypeIds");
            var typeNames = Piece.Cache.get(id + "_typeNames");
            //没有任何业务时
            if (!businessTypeIds) {
                businessTypeIds = key;
                typeNames = type;
            } else {
                // 取消
                if (targetNode.hasClass("ok")) {
                    businessTypeIds = businessTypeIds.toString();
                    // 首个删减字符串 有多个时候
                    if (businessTypeIds.split(",").length == 1) {
                        businessTypeIds = businessTypeIds.replace(key, "");
                        typeNames = typeNames.replace(type, "未选择");

                        // 首个删减字符串 只有一个时候
                    } else if (businessTypeIds.indexOf(key + ",") == 0) {
                        businessTypeIds = businessTypeIds.replace(key + ",", "");
                        typeNames = typeNames.replace(type + ",", "");
                    } else {
                        businessTypeIds = businessTypeIds.replace("," + key, "");
                        typeNames = typeNames.replace("," + type, "");
                    }
                } else {
                    businessTypeIds += "," + key;
                    if (type != 'undefined') {
                        typeNames += "," + type;
                    }

                }
            }

            Piece.Cache.put(id + "_businessTypeIds", businessTypeIds);
            Piece.Cache.put(id + "_typeNames", typeNames);
            targetNode.toggleClass("ok");
        },

        saveBusinessTypes: function (id) {
            var node = $("#" + id)
            node.data("businesstypeids", Piece.Cache.get(id + "_businessTypeIds"));
            node.text(Piece.Cache.get(id + "_typeNames"));

            return Piece.Cache.get(id + "_businessTypeIds");
        },
        /**
		 * 设置已选择的
		 */
        alreadySelect_form: function (node) {
            var businessTypeIds = null;
            if (Piece.Cache.get("form-businessType")) {
                businessTypeIds = Piece.Cache.get("form-businessType").businessTypeIds;
            }
            if (businessTypeIds) {
                businessTypeIds = businessTypeIds.split(",");
                for (var i = 0; i < businessTypeIds.length; i++) {
                    $("#" + businessTypeIds[i]).addClass("ok");
                }
            }
        },

        /**
		 * 设置选中状态
		 */
        select_form: function (event, node) {
            var targetNode = Util.getParentNode(event, ".business");
            var businessTypeIds = "";
            var typeNames = "";
            var businessType = {};
            if (Piece.Cache.get("form-businessType") != "" && Piece.Cache.get("form-businessType") != null) {
                businessType = Piece.Cache.get("form-businessType");
                businessTypeIds = businessType.businessTypeIds;
                typeNames = businessType.typeNames;
            }
            var key = targetNode.attr("id");
            var type = targetNode.data("type");

            //没有任何业务时
            if (businessTypeIds == "") {
                businessTypeIds = key;
                typeNames = type;
            } else {
                // 取消
                if (targetNode.hasClass("ok")) {
                    // 首个删减字符串
                    if (businessTypeIds.length == 1) {
                        businessTypeIds = businessTypeIds.replace(key, "");
                        typeNames = typeNames.replace(type, "");
                    }
                    else if (businessTypeIds.indexOf(key) == 0) {
                        businessTypeIds = businessTypeIds.replace(key + ",", "");
                        typeNames = typeNames.replace(type + ",", "");
                    } else {
                        businessTypeIds = businessTypeIds.replace("," + key, "");
                        typeNames = typeNames.replace("," + type, "");
                    }
                } else {
                    businessTypeIds += "," + key;
                    typeNames += "," + type;
                }
            }
            node.data("businesstypeids", businessTypeIds);
            if (typeNames == "" || typeNames == null) {
                node.text("未选择");
            }
            else {
                node.text(typeNames);
            }
            targetNode.toggleClass("ok");

            businessType["typeNames"] = typeNames;
            businessType["businessTypeIds"] = businessTypeIds;
            Piece.Cache.put("form-businessType", businessType);
        },
        /*********************Web socket 处理函数 开始*************************/
        /**
		 * 对象转变打印字符串
		 */
        toString: function (obj) {
            var description = "";
            if (typeof obj == "object") {
                for (var i in obj) {
                    var property = obj[i];
                    description += i + " = " + property + ",";
                }
            } else {
                description += obj;
            }
            return (description);
        },

        /*把socket获取到的字符转换成对象*/
        sockToObject: function (msg) {
            var type = msg.command;
            var body = msg.body;
            var first = body.substr(0, 8);
            var source = body.substr(8, 20);
            var idf = body.substr(28, 4);
            var moduleName = body.substr(32, 4);
            var moduleId = body.substr(36, 4);
            var actionName = body.substr(40, 4);
            var actionId = body.substr(44, 4);
            var command = body.substr(48, 8);
            var baoliu = body.substr(56, 4);

            var query = body.substr(body.indexOf("&"));

            var queryArray = query.split("&");
            var robj = { "first": first, "source": source, "idf": idf, "moduleName": moduleName, "moduleId": moduleId, "actionName": actionName, "actionId": actionId, "command": command, "baoliu": baoliu, "type": type };
            for (var i = 0; i < queryArray.length; i++) {
                var ars = queryArray[i];
                if (ars != "") {
                    var ars2 = ars.split("=");
                    if (ars2.length > 1) {
                        robj[ars2[0]] = ars2[1];
                    }
                }
            }
            return robj;
        },
        /*把socket获取到的字符转换成对象*/
        udpToObject: function (body) {
            var first = body.substr(0, 8);
            var source = body.substr(8, 20);
            var idf = body.substr(28, 4);
            var moduleName = body.substr(32, 4);
            var moduleId = body.substr(36, 4);
            var actionName = body.substr(40, 4);
            var actionId = body.substr(44, 4);
            var command = body.substr(48, 8);
            var baoliu = body.substr(56, 4);
            var query = body.substr(body.indexOf("&"));
            var queryArray = query.split("&");
            var robj = { "first": first, "source": source, "idf": idf, "moduleName": moduleName, "moduleId": moduleId, "actionName": actionName, "actionId": actionId, "command": command, "baoliu": baoliu };
            for (var i = 0; i < queryArray.length; i++) {
                var ars = queryArray[i];
                if (ars != "") {
                    var ars2 = ars.split("=");
                    if (ars2.length > 1) {
                        robj[ars2[0]] = ars2[1];
                    }
                }
            }
            return robj;
        },
        /**
		 * 处理收到消息
		 */
        onSockMessage: function (message) {
            var me = this;
            try {

                var robj = Util.sockToObject(message);
                if (robj.command == "MesgMesg") {//定时

                }
                else if (robj.command == "MesgSubs") {//订阅
                    var gid = robj.source.substring(3);//robj.gatewayId;
                    var gname = "";
                    var magicBox = Piece.Store.loadObject("magicList", true);
                    if (magicBox != null) {
                        for (var i = 0; i < magicBox.length; i++) {
                            if (magicBox[i].serial == gid) {
                                gname = magicBox[i].name;
                                break;
                            }
                        }
                    }
                    if (robj.module == "TMP0") {//温度报警
                        var tmp = robj.temperature;
                        tmp = tmp / 1000;
                        var msgs = Piece.Store.loadObject("MSGS", true);
                        if (msgs == null) msgs = new Array();
                        if (msgs.length > 50) msgs.splice(0, 1);
                        var msgObj = { "message": gname + "提醒：室内温度达到" + tmp + "度。", "time": new Date() };
                        msgs[msgs.length] = msgObj;
                        Piece.Store.saveObject("MSGS", msgs, true);

                        if (pieceConfig.enablePhoneGap) {
                            localNotification.add(Math.floor(Math.random() * 100 + 1), {
                                seconds: 30,
                                message: msgObj.message,
                                badge: 1
                            });
                        }
                        return;
                    }
                    else if (robj.module == "PIR0") {//红外感应
                        var msgs = Piece.Store.loadObject("MSGS", true);
                        if (msgs == null) msgs = new Array();
                        if (msgs.length > 50) msgs.splice(0, 1);
                        var msgObj = { "message": gname + "提醒：室内有人走动。", "time": new Date() };
                        msgs[msgs.length] = msgObj;
                        Piece.Store.saveObject("MSGS", msgs, true);

                        if (pieceConfig.enablePhoneGap) {
                            localNotification.add(Math.floor(Math.random() * 100 + 1), {
                                seconds: 30,
                                message: msgObj.message,
                                badge: 1
                            });
                        }
                        return;
                    }
                    else if (robj.module == "AQ00") {//空气感应
                        var msgs = Piece.Store.loadObject("MSGS", true);
                        if (msgs == null) msgs = new Array();
                        if (msgs.length > 50) msgs.splice(0, 1);
                        var msgObj = { "message": gname + "提醒：室内空气质量很差。", "time": new Date() };
                        msgs[msgs.length] = msgObj;
                        Piece.Store.saveObject("MSGS", msgs, true);

                        if (pieceConfig.enablePhoneGap) {
                            localNotification.add(Math.floor(Math.random() * 100 + 1), {
                                seconds: 30,
                                message: msgObj.message,
                                badge: 1
                            });
                        }
                        return;
                    }
                    else if (robj.module == "BTT0") {//电池感应
                        var msgs = Piece.Store.loadObject("MSGS", true);
                        if (msgs == null) msgs = new Array();
                        if (msgs.length > 50) msgs.splice(0, 1);
                        var msgObj = { "message": gname + "提醒：电池电量很低，请及时充电。", "time": new Date() };
                        msgs[msgs.length] = msgObj;
                        Piece.Store.saveObject("MSGS", msgs, true);

                        if (pieceConfig.enablePhoneGap) {
                            localNotification.add(Math.floor(Math.random() * 100 + 1), {
                                seconds: 30,
                                message: msgObj.message,
                                badge: 1
                            });
                        }
                        return;
                    }
                    else if (robj.module == "HUM0") {//湿度报警
                        var tmp = robj.humiture;
                        tmp = tmp / 1000;
                        var msgs = Piece.Store.loadObject("MSGS", true);
                        if (msgs == null) msgs = new Array();
                        if (msgs.length > 50) msgs.splice(0, 1);
                        var msgObj = { "message": gname + "提醒：室内湿度达到" + tmp + "%rh。", "time": new Date() };
                        msgs[msgs.length] = msgObj;
                        Piece.Store.saveObject("MSGS", msgs, true);

                        if (pieceConfig.enablePhoneGap) {
                            localNotification.add(Math.floor(Math.random() * 100 + 1), {
                                seconds: 30,
                                message: msgObj.message,
                                badge: 1
                            });
                        }
                        return;
                    }
                }
                else if (robj.command == "MesgNotf") {//操作时返回通知
                    //不同终端登录数据同步
                    Util.DataSync(robj);
                }
                else if (robj.command.indexOf("Rspn") > -1) {//命令响应
                    var haveCallBack = false;
                    for (var i = 0; i < sendData.length; i++) {
                        if (sendData[i].identify == robj.idf) {
                            if (sendData[i].callbackFun != undefined && sendData[i].callbackFun != null) {
                                sendData[i].callbackFun(sendData[i], robj);
                                sendData.splice(i, 1);
                                haveCallBack = true;
                            }
                        }
                    }

                    if (haveCallBack == true) {
                        //如果定义了回调则不处理
                    }
                    else {//查找对应的函数执行
                        eval("var func=socketRspnCallBack.func" + robj.idf + ";");
                        if (func != null && func != undefined && typeof (func) == "function") { func(robj); }
                    }
                    //不同终端登录数据同步
                    Util.DataSync(robj);
                }

            } catch (e) {
                new Piece.Toast(Cons.RESULT_UNKOWN_MSG + me.toString(result));
            }
        },
        //不同终端登录数据同步
        DataSync: function (robj) {
            var loginId = Piece.Store.loadObject("loginId", true);
            var equipList = Piece.Store.loadObject("DeviceList", true);
            if (robj.operate == null || robj.operate == undefined) return;
            var operate = robj.operate.trim().toLowerCase();
            var gatewayId = robj.source.substring(3);
            switch (operate) {
                case "change"://菜单变更
                	Util.readMenuFromService();
                    break;
                case "addd"://新增设备
                    {
                        var ifHave = false;
                        for (var i = 0; i < equipList.length; i++) {
                            if (equipList[i].loginId == loginId
                                 && equipList[i].serial == robj.serial
                                 && equipList[i].device == robj.module
                                 && equipList[i].gatewayId == gatewayId) {
                                ifHave = true;
                                break;
                            }
                        }
                        if (ifHave) break;
                        var item = { "loginId": loginId, "serial": robj.serial, "name": robj.name, "device": robj.module, "gatewayId": gatewayId, "deviceId": robj.serial };
                        equipList[equipList.length] = item;
                        Piece.Store.saveObject("DeviceList", equipList, true);//保存设备到缓存
                        break;
                    }
                case "name"://修改设备名称
                    {
                        for (var i = 0; i < equipList.length; i++) {
                            if (equipList[i].loginId == loginId
                                 && equipList[i].serial == robj.serial
                                 && equipList[i].device == robj.module
                                 && equipList[i].gatewayId == gatewayId) {
                                equipList[i].name = robj.name;
                                Piece.Store.saveObject("DeviceList", equipList, true);//保存设备到缓存
                                break;
                            }
                        }
                        break;
                    }
                case "deld"://删除设备
                    {
                        for (var i = 0; i < equipList.length; i++) {
                            if (equipList[i].loginId == loginId
                                 && equipList[i].serial == robj.serial
                                 && equipList[i].device == robj.module
                                 && equipList[i].gatewayId == gatewayId) {
                                equipList.splice(i, 1);
                                Piece.Store.saveObject("DeviceList", equipList, true);//保存设备到缓存
                                break;
                            }
                        }
                        break;
                    }
                default: ""; break;
            }
        },
        /**
		 * 当错误发生时，重新连接服务器
		 */
        onSockError: function (message) {
            setTimeout(Util.sockConnect(), 10000);
            if (Piece.Cache.get("connectFlag") == true || typeof (Piece.Cache.get("connectFlag")) == "undefined") {
                Piece.Cache.put("connectFlag", false);
            }
        },
        /**
		 * 通信消息
		 */
        notifyUser: function (message) {
            try {
                var result = $.parseJSON(message.body);
                result = $.parseJSON(result.data);
                if (result.cmd == Cons.CMD_SUBS_ABORT) { // 中止通知
                    var abortSubsData = $.parseJSON(result.data);
                    if (abortSubsData.subsId == Cons.SUBS_ID_ALL) {
                        if (pieceConfig.enablePhoneGap) {
                            localNotification.add(Math.floor(Math.random() * 100 + 1), {
                                seconds: 30,
                                message: "This is an weirong example",
                                badge: 1
                            });
                        } else {
                            new Piece.Toast("This is an weirong example");
                        }
                    }
                }
            } catch (e) {
                new Piece.Toast(Cons.RESULT_UNKOWN_MSG + me.toString(result));
            }
        },
        /*生成随机码*/
        Guid: function () {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        },
        /*生成唯一编码*/
        GenerateGuid: function () {
            return this.Guid() + this.Guid() + this.Guid() + this.Guid() + this.Guid() + this.Guid() + this.Guid() + this.Guid();
        },

        /**
		 * 连接服务器
		 */
        sockConnect: function () {

            var me = this;
            if (stompClient == null || !stompClient.connected) {

                webSocket = new SockJs(OpenAPI.websocketEndPoint);
                stompClient = Stomp.over(webSocket);


                var login_info = Piece.Store.loadObject("user_info", true);


                if (login_info != null) {
                    stompClient.connect(login_info.username, login_info.password, function (frame) {


                        Piece.Cache.put("connectFlag", true);
                        console.log('Connected: ' + frame);
                        var user_token = Piece.Store.loadObject("user_token", true);

                        if (user_token != null) {
                            stompClient.subscribe('/topic/app.' + user_token.userLoginId, me.onSockMessage);
                        }
                    }, me.onSockError);
                }
            }
        },
        /**
		 * 断开服务器
		 */
        sockDisconnect: function () {
            if (stompClient != null && stompClient.connected) {
                stompClient.disconnect(function (frame) {
                    console.info("stompClient.disconnected ！");
                });
            }
        },

        /**
		 * 用户进行网点预约
		 * subsInfo : 预约信息,包含以下内容
		 *     bankPointId ：网点标识
		 *     userLoginId ：用户登录标识
		 *     subsId ：预约标识（新预约是为空，变更时要填入对应内容）
		 *     subsType ：预约类型（subsType= CANCEL 时为取消此预约）
		 *     runDay ： 业务处理时间
		 *     startTime ：定时预约开始时间
		 *     endTime ：定时预约开始时间
		 *     longitude ：经度坐标
		 *     latitude ：纬度坐标
		 *     businessTypeIds ：多个业务类型
		 */
        subscribe: function (subsInfo) {
            var me = this;
            if (stompClient == null || stompClient.connected == false) {
                new Piece.Toast(Cons.STMOP_NO_CONNECTED);
                return;
            }
            var user_token = Piece.Store.loadObject("user_token", true);
            if (user_token != null) {
                subsInfo.userLoginId = user_token.userLoginId;
                subscribeIds[subsInfo.bankPointId] = stompClient.subscribe("/topic/vbank." + subsInfo.bankPointId, me.notifyUser);
                me.sockSendData("/exchange/vbank.exchange/vbank." + subsInfo.bankPointId, Cons.CMD_NUM_SUBS, Cons.DESTINATION_BANKPOINT, JSON.stringify(subsInfo));
            }
        },
        /**
		 * 远程打印（subsId或formsIds两者只允许一方有值。）
		 * bankPointId ：网点标识
		 * subsId: 预约标识
		 * cmd ：命令号，"007"：打印表单，"007"：打印排队号
		 * data ：请求数据
		 */
        remotePrint: function (bankPointId, subsId, cmd) {
            this.sockSendData("/exchange/vbank.exchange/vbank." + bankPointId, cmd, Cons.DESTINATION_BANKPOINT, subsId);
        },

        sockSendData: function (exchange, data) {
            stompClient.send(exchange, {}, data);
        },
        /**
		 * 取消订阅网点消息
		 * bankPointId ：网点标识
		 */
        unsubscribe: function (bankPointId) {
            if (subscribeIds[bankPointId] != null) {
                stompClient.unsubscribe(subscribeIds[bankPointId].id);
            }
        },
        /*********************Web socket 处理函数 结束*************************/
        /**
		 * 生成二维码
		 * data ：详细数据
		 * type ：数据类型键值
		 */
        makeBarCode: function (data, type, isFormed) {
            var url = OpenAPI.IP + "/download.do?" + type + "=" + data + "&isFormed=" + isFormed;
            cordova.plugins.barcodeScanner.encode(cordova.plugins.barcodeScanner.Encode.TEXT_TYPE, url, function (success) {
                new Piece.Toast("encode success: " + success);
            }, function (fail) {
                new Piece.Toast("encoding failed: " + fail);
            });
        },
        /**
		 * 取消订阅网点消息
		 * bankPointId ：网点标识
		 */
        initViewEvent: function (view) {
            //绑定android点击返回键按钮事件。
            if (view.onBackKeyDown) {
                document.addEventListener("backbutton", view.onBackKeyDown, false);
            }
            //绑定offline事件
            if (view.onOffline) {
                document.addEventListener("offline", view.onOffline, false);
            }
            //绑定android点击菜单按钮事件
            if (view.onmenuKeydown) {
                document.addEventListener("menubutton", view.onMenuKeydown, false);
            }
            //绑定online事件
            if (view.onOnline) {
                document.addEventListener("online", view.onOnline, false);
            }
            // 程序运行于后台是触发事件
            if (view.onPause) {
                document.addEventListener("pause", view.onPause, false);
            }
            // 画面关闭前是触发事件
            if (view.onbeforeunload) {
                document.addEventListener("beforeunload", view.onBeforeunload, false);
            }
            // 当窗口隐藏时运行的脚本。
            if (view.onpagehide) {
                document.addEventListener("pagehide", view.onpagehide, false);
            }
            // 画面关闭前时触发事件
            if (view.onunload) {
                document.addEventListener("unload", view.onunload, false);
            }
        },

        /**
		 * 获取城市选择结果-----
		 */
        getCitySelectResult: function () {
            var data = Piece.Store.loadObject("bankmap_citySelectResult");
            if (data == undefined || data == null || data.cityName.length == 0 ||
				data.lat < 1 || data.lat > 65 || data.lng < 72 || data.lng > 136) {
                data = {};
                data.cityId = "330300000000";
                data.cityName = "温州";
                data.lng = 120.703824;
                data.lat = 27.999672;
                data.zoomValue = 14;
            }
            return data;
        },

        /**
		 * 存储城市选择结果-----
		 */
        putCitySelectResult: function (data) {
            Piece.Store.saveObject("bankmap_citySelectResult", data);
        },

        /**
		 * 获取银行网点检索条件-----
		 */
        getBankSearchCondition: function () {
            var condition = Piece.Cache.get("bankmap_bankSearchCondition");
            if (condition == undefined || condition == null) {
                var cityInfo = this.getCitySelectResult();
                condition = {};
                condition.pageIndex = 0;

                condition.cityName = cityInfo.cityName;
                condition.lat = cityInfo.lat;
                condition.lng = cityInfo.lng;

                condition.cityId = "";
                condition.words = "";
                condition.bankPointName = "";
                condition.bankPointId = "";
                condition.abbreviation = "";

                condition.distance = Cons.BMAP_DEFAULT_MAX_NUM;
                condition.waitingNum = Cons.BMAP_DEFAULT_MAX_NUM;
                condition.sortType = Cons.BMAP_DEFAULT_SORT_TYPE;
                condition.districtId = Cons.BMAP_DEFAULT_DISTRICT_ID;
                condition.isAtm = Cons.BMAP_DEFAULT_IS_ATM;
                condition.businessIdsStr = "";
            }
            return condition;
        },

        /**
		 * 存储银行网点检索条件-----
		 */
        putBankSearchCondition: function (condtion) {
            Piece.Cache.put("bankmap_bankSearchCondition", condtion);
        },

        /**
		 * 比较检索条件-----
		 */
        compareBankSearchCondition: function (cond1, cond2) {
            if (cond1.pageIndex != cond2.pageIndex)
                return false;
            if (cond1.cityName != cond2.cityName)
                return false;
            if (this.getDistance(cond1.lat, cond1.lng, cond2.lat, cond2.lng) >= Cons.SEARCH_BPS_DISTANCE_DIFF) {
                return false;
            }
            if (cond1.cityId != cond2.cityId)
                return false;
            if (cond1.words != cond2.words)
                return false;
            if (cond1.bankPointName != cond2.bankPointName)
                return false;
            if (cond1.bankPointId != cond2.bankPointId)
                return false;
            if (cond1.abbreviation != cond2.abbreviation)
                return false;
            if (cond1.distance != cond2.distance)
                return false;
            if (cond1.waitingNum != cond2.waitingNum)
                return false;
            if (cond1.sortType != cond2.sortType)
                return false;
            if (cond1.districtId != cond2.districtId)
                return false;
            if (cond1.isAtm != cond2.isAtm)
                return false;
            if (cond1.businessIdsStr != cond2.businessIdsStr)
                return false;
            return true;
        },

        // 获取两点之间的距离，参数为角度制-----
        getDistance: function (lat1, lng1, lat2, lng2) {
            var radius = 6370996.81; //平均半径，米
            var startLat = 1;
            var endLat = 65;
            var startLng = 72;
            var endLng = 136;
            var BP_SC_MAX_DISTANCE = 9999999;
            if ((lat1 < startLat || lat1 > endLat) || (lat2 < startLat || lat2 > endLat) ||
					   (lng1 < startLng || lng1 > endLng) || (lng2 < startLng || lng2 > endLng)) {
                return BP_SC_MAX_DISTANCE;
            }
            var toRad = 0.017453293;// =（2PI/360）
            var lng = toRad * (lng2 - lng1);
            lat1 = toRad * lat1;
            lat2 = toRad * lat2;
            var distance = radius * Math.acos(Math.cos(lat1) * Math.cos(lat2) * Math.cos(lng) +
                    Math.sin(lat1) * Math.sin(lat2));
            return distance;
        },

        /**
		 * 存储银行网点检索条件----
		 */
        loadBankSearchResult: function () {
            var data = Piece.Store.loadObject("cube-list-id_bs_rs_search_rs_detail");
            if (data == undefined || data == null) {
                data = [];
            }
            return data;
        },

        /**
		 * 网页退回函数
		 */
        backPage: function () {
            window.history.back();
        },

        /**
		 * 跳转到预约画面---
		 */
        gotoSubsPage: function (bpIndex, my) {
            var bpId = this.loadBankSearchResult()[bpIndex].bankPointId;
            Piece.TempStage.bankPointId(bpId);
            my.navigate("/subscribes/subscribe-submit", {
                trigger: true
            });
        },

        /**
		 * 线路方式选择框-----
		 */
        createRouteTypeDlg: function (target, my) {
            function clickGoDlgBt(routeType) {
                my.navigate("/bankmap/bankmapdetail?pageId=2&routeType=" +
						routeType + "&selBankIndex=" + my.selBankIndex, {
						    trigger: true
						});
            }

            // 到这去选择框
            var goDlg = new Piece.Dialog(
				{
				    autoshow: false, // 是否初始化时就弹出加载控件
				    target: target,  //页面目标组件标识  
				    title: "请选择线路方式",
				    content: ""//弹出框提示文字
				}, {
				    configs: [{ title: "步行", eventName: "walk" },
					         { title: "驾车", eventName: "drive" }],
				    walk: function () {
				        clickGoDlgBt("walk");
				    },
				    drive: function () {
				        clickGoDlgBt("drive");
				    }
				});
            return goDlg;
        },

        /**
		 * 获取设备类别-----
		 */
        getDevice: function (deviceType) {
            var obj = null;
            for (var i = 0; i < Schema.DeviceCatg.length; i++) {
                if (deviceType.toUpperCase() == Schema.DeviceCatg[i].type) {
                    obj = Schema.DeviceCatg[i];
                    break;
                }
            }
            return obj;
        },
        /**
		 * 获取命令16进制长度,转换成命令
		 */
        ConvertToOrder: function (str) {
            var length = 0;
            for (var i = 0; i < str.length; i++) {
                if (str.charCodeAt(i) > 127 || str.charCodeAt(i) == 94) {
                    length += 2;
                }
                else {
                    length++;
                }
            }

            //var length=str.length;		

            //转换
            var yu = length % 4;
            var jia = 0;
            if (yu != 0 && yu < 4) {
                jia = 4 - yu;
            }
            if (jia != 0) {
                length += jia;
                while (jia > 0) {
                    str += " ";
                    jia--;
                }
            }
            var num = parseInt(length).toString(16);
            var len = num.toString().length;
            while (len < 4) {
                num = "0" + num;
                len++;
            }
            str = str.replace("llll", num)
            return str;
        },
        GetStrByteLen: function (str) {
            var char = str.replace(/[^\x00-\xff]/g, '**');
            return char.length;
        },
        //设置数字格式：val:数字，count:显示位数，dir：左边补零或者右边补零（l/r）
        SetFormat: function (val, count, dir) {
            var len = (val.toString()).length;
            if (dir == "l") {
                while (len < count) {
                    val = "0" + val;
                    len++;
                }
            }
            else if (dir == "r") {
                while (len < count) {
                    val = val + "0";
                    len++;
                }
            }
            return val;
        },
        //获取未使用的情景模式编号	
        GetUnUseQJModeIndex: function (val, count, dir) {
            var array = Piece.Store.loadObject("QJModeIndexArray", true);
            var index = null;
            if (array == null) {
                array = new Array();
                for (var i = 60; i < 70; i++) {
                    if (i < 63)//离家、回家、日程的id固定
                        array[array.length] = { "index": i, "isUse": 1 };
                    else array[array.length] = { "index": i, "isUse": 0 };
                }
                Piece.Store.saveObject("QJModeIndexArray", array, true);
            }
            for (var i = 0; i < array.length; i++) {
                if (array[i].isUse == 0) {
                    index = array[i].index;
                    break;
                }
            }
            return index;
        },
        //检查字符串是否为空
        IsNullOrEmpty: function (str) {
            if (str == "" || str == "undefined" || str == null)
                return true;
            else return false;
        },
        getQueryStringByName: function (name) {
            var result = location.hash.match(new RegExp("[\?\&]" + name + "=([^\&]+)", "i"));
            if (result == null || result.length < 1) {
                return "";
            }
            return result[1];
        },

        //发送指令超时处理
        sockSendAndRecDataIntime: function (time, socketChange, order) {
            //if (stompClient == null || !stompClient.connected) {
                //Util.sockConnect();
            //}
            Util.sockSendData(socketChange, order);
            window.setTimeout(function () {
                try {
                    //中断连接
                    if (func != null && func != undefined && typeof (func) == "function") {
                        throw new error("连接超时！");
                    }
                } catch (e) {
                    new Piece.Toast("连接超时！");
                    return;
                } finally {
                }
            }, time);
        },
        //根据魔方编号与设备序列号查找设备
        getCurrentDevice: function (gatewayId, device, serial) {
            var equipList = Piece.Store.loadObject("DeviceList", true);
            for (var i = 0; i < equipList.length; i++) {
                if (equipList[i].gatewayId == gatewayId && equipList[i].serial == serial && equipList[i].device == device) {
                    return equipList[i];
                }
            }
        },
        vibration: function (time) {
            if (window.vibration) {
                if (time && time > 50) {
                    window.vibration.vibrate(time);
                } else {
                    window.vibration.vibrate(150);
                }
            }
        },
        /*
		 * 从服务器上获取用户菜单数据 
		 */
		readMenuFromService:function(){
			var user_token=Piece.Store.loadObject("user_token", true);
			var access_token=user_token.accessToken;
			var loginId=Piece.Store.loadObject("loginId", true);
			
			Util.AjaxWait(OpenAPI.readAllAppMenu,"GET", 
				{"access_token":access_token,"appForm.userLoginId":loginId,"dataType": 'jsonp'}, 
				'jsonp',
				function(data, textStatus, jqXHR){
					if(data.appMenuList.length>0 && data.appMenuList[0]!=undefined){
						var appMenus = data.appMenuList;
						$.map(appMenus,function(item,index){
							if(item.menuKey=="HOME" && item.menuLevel=="1"){//首页菜单
								var appMenu = item.jsonMenu;
								appMenu=JSON.parse(appMenu.split("'").join("\""));
								if(appMenu.menus!=null && appMenu.menus!=undefined && appMenu.menus.length>0 &&
								   appMenu.menuPos!=null && appMenu.menuPos!=undefined && Object.keys(appMenu.menuPos).length>0){
									
									Piece.Store.saveObject("homeMenuInfos", appMenu, true);
								
								}else if(appMenu.menus!=null && appMenu.menus!=undefined && appMenu.menus.length>0 &&
										appMenu.deleteMenu !=null && appMenu.deleteMenu!=undefined && Object.keys(appMenu.deleteMenu).length>0){
									
									Piece.Store.saveObject("homeMenuInfos", appMenu, true);
								}
							}else if(item.menuKey=="Ehome" && item.menuLevel=="2"){//设备列表
								var appMenu = item.jsonMenu;
								appMenu=JSON.parse(appMenu.split("'").join("\""));
								
								Piece.Store.saveObject("eHomeMenuInfos", appMenu, true);
							}
						});
					}
				},function(e, xhr, type) {
					new Piece.Toast("读取菜单数据失败...");
				}
			);
		}
    };
    return Util;
});