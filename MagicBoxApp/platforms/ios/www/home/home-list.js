define(['text!../home/home-list.html', "../base/openapi", '../base/util', '../base/constant'],
	function(viewTemplate, OpenAPI, Util ,Cons,lang) {
		return Piece.View.extend({
			id: 'home_home—list',
			searchCond:{},
			events: {
				"click #scanBarCode"            :"scanBarCode",
				"click #homelist_input_div"     :"onClickInputDiv",	
				"click #homelist_city_name_div" :"onClickCityName",	
				"click .bank_item_bt_go"        :"onClickBankItemBtGo", // 点击搜索列表item中的"到这去"
				"click .bank_item_bt_subscribe" :"onClickBankItemBtsubscribe",// 点击搜索列表item中的"预约"
				/*
				"click .homelist": "goToNewsDetail",
				"click .right-banner": "goNewsSearch"
				*/
			},
			
			// 点击搜索列表item中的"预约"
			onClickBankItemBtsubscribe:function(el){
				var target = $(el.currentTarget);
				var parentLi = target.parents("li.cube-list-item");
				var my = home_list_this;
				my.selBankIndex = $(parentLi).index();
			},
			
			// 点击搜索列表item中的"到这去"
			onClickBankItemBtGo:function(el){
				var target = $(el.currentTarget);
				var parentLi = target.parents("li.cube-list-item");
				var my = home_list_this;
				my.selBankIndex = $(parentLi).index();
				my.goDlg.show();
			},
			
			// 点击右上角城市名
			onClickCityName:function(){
				// 切换到网点搜索界面
				var my = home_list_this;
				my.onLeave();
				my.navigate("/bankmap/zone-select", {
					trigger: true
				});
				return;
			},
			
			onClickInputDiv:function(){
				// 切换到网点搜索界面
				var my = home_list_this;
				my.onLeave();
				my.navigate("/bankmap/bank-search", {
					trigger: true
				});
				return;
			},
			
			scanBarCode :function(){
//				// 测试
//				var requestUrl = "index.html#home/test";
//				Backbone.history.navigate(requestUrl, {
//					trigger: true
//				});	
//				return;
//				// 测试结束
				Util.makeBarCode("4","formKey");
				 var urlResult = {};
				 //扫二维码进行解析
				   cordova.plugins.barcodeScanner.scan(
					 function (result) {							
						 var matchResult = result.text.match(Cons.SCAN_DOWNLOAD_URL);//判断二维码是否是本系统二维码
						 if(matchResult != null){
							 var urlNeed = result.text.split("?")[1];	
							 var keyValueArr = urlNeed.split("&");	
							 for(var i = 0; i<keyValueArr.length; i++){
								 var key = keyValueArr[i].split("=")[0];
								 var value = keyValueArr[i].split("=")[1];
								 if(key==="t"){
									 if(value=="FORM"){
										 var requestUrl = "/home/home-form-confirm?" + urlNeed;
										 Piece.Cache.put("home-list-form-url", urlNeed);
										 Backbone.history.navigate(requestUrl, {trigger: true});
										 break;
									 }else if(value=="LINE"){
										 var requestUrl = "/home/home-subs-confirm?" + urlNeed;
										 Piece.Cache.put("home-list-subs-url", urlNeed);
										 Backbone.history.navigate(requestUrl, {trigger: true});
										 break;
									 }
								 }									
							 }
							 new Piece.Toast(Cons.SCAN_BARCODE_FORMAT_ERROR);
						 }else if( result.text != ""){
							 new Piece.Toast(Cons.SCAN_BARCODE_OUT);
						 }					       
				      }, 
				      function (error) {
				          new Piece.Toast(Cons.SCAN_BARCODE_FAILED);
				      }
				,[]);
			},
			// 初始化
			init:function(){
				home_list_this = this;
				

			},
			
			// 判断是否第一次进入此页面
			isFirstInThisPage:function()
			{
				var my = home_list_this;
				var rs = Piece.Cache.get(my.id+"isFirstInThisPage");
				Piece.Cache.put(my.id+"isFirstInThisPage", 1);
				if (rs == undefined || rs == null || rs == 0){
					return true;
				} else {
					return false;
				}
			},
			
			// 定位并搜索
			locateAndSearch:function(isSearch){
				if (pieceConfig.enablePhoneGap){
					if (isSearch){
						home_list_this.loaderDlg = new Piece.Loader({
							autoshow:true,//是否初始化时就弹出加载控件        
							text:"正在定位...",
							target:'#'+home_list_this.id   //页面目标组件表识            
						});
					}
					var locationService = window.baiduLocation;
					locationService.getCurrentPosition(
						function(pos){
							var my = home_list_this;
							my.searchCond.cityName = pos.addr.city.replace(Cons.MAP_CITY_SUFFIX_REG, "");
							my.searchCond.lng = pos.coords.longitude;
							my.searchCond.lat = pos.coords.latitude;
							$("#homelist_city_name").text(my.searchCond.cityName);
							if (isSearch){
								my.loaderDlg.hide();
								my.searchBank();
							}
							my.onLeave();
						}, 
						function(){
							if (isSearch){
								home_list_this.loaderDlg.hide();
								home_list_this.searchBank();
							}
						});
				} else {
					if (isSearch){
						home_list_this.searchBank();
					}
				}
			},
			
			// 搜索并渲染银行网点
			searchBank:function(){
				var my = home_list_this;
//				if ($("#id_bs_rs_search_rs_detail").length > 0){
//					$("#id_bs_rs_search_rs_detail").html("");
//				}
				
			},
			
			getScParam:function(){
				var my = home_list_this;
				var scForm = {};
				scForm["scForm.lng"] =            my.searchCond.lng;
				scForm["scForm.lat"] =            my.searchCond.lat;
				scForm["scForm.cityName"] =       my.searchCond.cityName;
				return scForm;
			},
			
			// 离开bankmapDetail.html事件
			onLeave:function(){
				var my = home_list_this;
				
				
			},
			render: function() {
				
				$(this.el).html(viewTemplate);
				Piece.View.prototype.render.call(this);
				
				return this;
			},
			onShow: function() {
				
				// 初始化
				this.init();
				// 初始化手机按键事件
				Util.initViewEvent(this);

				// 启动Websocket连接
				//Util.sockConnect();

			},



		}); //view define

	});