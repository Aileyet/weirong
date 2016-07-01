define(['text!magicbox/InUpgrade.html',"zepto", "../base/openapi", '../base/util','../base/socketutil',"../base/templates/template","../base/i18nMain",],
	function(viewTemplate, $, OpenAPI, Util,SocketUtil,_TU,I18n) {
		var outTimer=null;
		return Piece.View.extend({
			id: 'magicbox_InUpgrade',
			events:{
			},
			render: function() {
				$(this.el).html(viewTemplate);

				Piece.View.prototype.render.call(this);
				return this;
			},
			onLoadTemplate:function(){
				_TU._U.setHeader(_TU._T.magicbox_InUpgrade);//加载头部导航
				var me = this;
				var inUpgradeTemplate = $(me.el).find("#inUpgradeTemplate").html();
				var inUpgradeHtml= _.template(inUpgradeTemplate, _TU._T.magicbox_InUpgrade.data);
				$("#content").append(inUpgradeHtml);
			},
			onShow: function() {
				this.onLoadTemplate();
				//write your business logic here :)
				socketRspnCallBack.func0046=function(obj){//定义回调函数
				    window.clearTimeout(outTimer);
				    $(".div-text").html(I18n.Common.updateSucess);
					$(".div-img").css("display","none");
				}
				SocketUtil.MBUpgrade();
				outTimer=window.setTimeout(function(){
					$(".div-text").html(I18n.Common.updateTimeOut);
					$(".div-img").css("display","none");
				},1000*10);
				Piece.Cache.put("serial","0000");
			}
		}); //view define

	});