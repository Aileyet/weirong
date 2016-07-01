define([ 'text!magicbox/CoBTSetup.html','../base/tooltip/tooltip', "../base/templates/template" ], function(viewTemplate,Tooltip,_TU) {
	var openCount=0,closeCount=0;var btcnnTime2=30;var btcnnCount2=0;var btTimeoutId2=0;
	return Piece.View.extend({
		id : 'magicbox_CoBTSetup',
		events : {
			"touchstart .BTswitch" : "onBTswitch",
			"touchstart .BTedit" : "onBTedit"
		},
		onBTedit : function(e) {
		},
		render : function() {
			$(this.el).html(viewTemplate);

			Piece.View.prototype.render.call(this);
			return this;
		},
		//蓝牙搜索计时器
		timedCount2 : function() {
			var me = this;
			if (btcnnCount2 < btcnnTime2) {
				btcnnCount2++;
				btTimeoutId2 = setTimeout(function() {
					me.timedCount2();
				}, 1000);
			}
			if (btcnnCount2 == btcnnTime2) {
				//隐藏蓝牙搜索等待框
				$("#btCnn_load").eq(0).css("display", "none");
				btcnnCount2=0;
				clearTimeout(btTimeoutId2);
			}
		},
		onLoadTemplate:function(){
			_TU._U.setHeader(_TU._T.magicbox_CoBTSetup);
			var me = this;
			// 页面布局共通化管理
			
			var coBTSetupTemplate = $(me.el).find(
					"#CoBTSetupTemplate").html();
			var coBTSetupHtml = _.template(coBTSetupTemplate,_TU._T.magicbox_CoBTSetup.data);
			$(".content").html(coBTSetupHtml);
		},
		onShow : function() {
			this.onLoadTemplate();//加载配置模板
			this.timedCount2();
			this.onBTswitch();//开、关蓝牙
			app.addStartDevice(Tooltip);
		},
		onBTswitch : function() {
			var me = this;
			$(".div-slider .div-slidering").on("tap",function(e){
				if(BC.bluetooth.isopen && closeCount==0){
					BC.Bluetooth.StopScan();
					closeCount++;
			 		BC.Bluetooth.CloseBluetooth(function(){
				 		openCount=0;
				 		sessionStorage.setItem("isConnected","NO");
			 			$(".div-word").text(_TU._T.magicbox_CoBTSetup.data.switchOff_text);
						//隐藏蓝牙搜索等待框
						$("#btCnn_load").eq(0).css("display", "none");
						btcnnCount2=0;
						clearTimeout(btTimeoutId2);
			 			$(".table-rg").each(function(num,eve){
	                    	if(num>0){
	                    		$(eve).remove();
	                    	}
	                    });
						console.log("close success!!");
					});
					$(e.target).parent().css('background-color','#dddddd');
					$(e.target).css("float","left");
				}else if(!BC.bluetooth.isopen && openCount==0){
					openCount++;
					BC.Bluetooth.OpenBluetooth(function(){
	                    closeCount=0;
						$(".div-word").text(_TU._T.magicbox_CoBTSetup.data.switchOn_text);
						//显示蓝牙搜索等待框
						$("#btCnn_load").eq(0).css("display", "block");
						btcnnCount2=0;
						clearTimeout(btTimeoutId2);
						me.timedCount2();
						app.addStartDevice(Tooltip);
				 		console.log("open success!!");
					});
					$(e.target).parent().css('background-color','#33c24e');
					$(e.target).css("float","right");
				}
			}); 
		}
	}); 
});