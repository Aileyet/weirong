define(['text!magicbox/InMBRestart.html',"zepto", "../base/openapi", '../base/util','../base/socketutil',"../base/templates/template","../base/i18nMain",],
	function(viewTemplate, $, OpenAPI, Util,SocketUtil,_TU,I18n) {
		var outTimer=null;
		
		return Piece.View.extend({
			id: 'magicbox_InMBRestart',
			events:{
				"touchstart .react"   :  "onBackUpFn",
				"touchstart .div-btn" :  "onRestart"
 			},
			onBackUpFn:function(e){
				 Backbone.history.navigate("magicbox/InMBSetup", {
	           		 trigger: true
	           	 });
			},
			onRestart:function(e){
				//重启
				socketRspnCallBack.func0045=function(obj){//定义回调函数
				    window.clearTimeout(outTimer);
				    $(".div-txt").html(I18n.magicbox_InMBRestart.restartSucess);
				}
				SocketUtil.MBRestart();
				outTimer=window.setTimeout(function(){
					$(".div-txt").html(I18n.magicbox_InMBRestart.restartTimeOut);
				},1000*10);
				
				
				$(".div-btn").css("display","none");
				$(".div-txt").css("display","block");
			},
			render: function() {
				$(this.el).html(viewTemplate);

				Piece.View.prototype.render.call(this);
				return this;
			},
			onLoadTemplate:function(){
				_TU._U.setHeader(_TU._T.magicbox_InMBRestart);//加载头部导航
				var me = this;
				var inMBRestartTemplate = $(me.el).find("#inMBRestartTemplate").html();
				var inMBRestartHtml= _.template(inMBRestartTemplate, _TU._T.magicbox_InMBRestart.data);
				$("#content").append(inMBRestartHtml);
			},
			onShow: function() {
				this.onLoadTemplate();
				Piece.Cache.put("serial","0000");
				//write your business logic here :)
			}
		}); //view define

	});