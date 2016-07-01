define(['text!home/OneKeyConfig.html','../base/templates/template','../base/tooltip/tooltip'],
	function(viewTemplate,_TU,ToolTip) {
		var tooltip = new ToolTip();
		return Piece.View.extend({
			id: 'home_OneKeyConfig',
			events:{
				"tap .wifi-info"  :  "setWifiInfoFn"
			},
			render: function() {
				$(this.el).html(viewTemplate);

				Piece.View.prototype.render.call(this);
				return this;
			},
			onLoadTemplate:function(){
				_TU._U.setHeader(_TU._T.home_OneKeyConfig);//替换头部导航
			},
			onShow: function() {
				this.onLoadTemplate();
				
				if(window.plugins!=undefined){
					window.plugins.WifiAdmin.getWifiInfo(function(data){
						$.map(data.available,function(iten,index){
							$('<div class="wifi-info">'+iten.SSID+'</div>').appendTo(".wifi-list");
						});
						
					},function(error){
						new Piece.Toast("获取WIFI失败...");
					});
				}
				
			},
			setWifiInfoFn:function(e){
				var wifiName = $(e.target).text();
				tooltip.setCovering(0);
				tooltip.showWifi(wifiName);
				$(".wifi-cancle").on("touchend",function(){
					tooltip.hideWifi();
				});
				
				$(".wifi-sure").on("touchend",function(){
					var pass = $('#wifiPassWord').val();
					if(pass ==""){
						$('.WIFI-Info-seting-tooltip .wifiPAW-input').css("border",'1px red solid');
						new Piece.Toast("请输入WIFI密码...");
					}else{
						tooltip.hideWifi();
						navigator.elian.startSmartConn(function(data){
							new Piece.Toast("设置魔方WIFI成功!");
		 				
		 				},function(error){
		 					new Piece.Toast("设置魔方WIFI失败...");
		 				},wifiName,pass);
					}
				});
			}
				
		}); //view define

	});