define(['text!home/MeIndex.html',"../base/openapi",'../base/util',"../base/templates/template",'../base/indexMenuDrag'],
	function(viewTemplate, OpenAPI, Util,_TU,Drag) {
		var num=1,timeoutID;
		return Piece.View.extend({
			id: 'home_MeIndex',
			events:{
				"touchstart .nav-wrap-left"  :  "onMenuFn",
				"tap   .div-rgba"            :  "onGoLogin",
				"tap   .meindex-menus-list ul li"    :  "onGoToPage"
			},
			onMenuFn:function(e){
				$(".header_font_color").toggleClass("text-page-move");
				$(".content").toggleClass("content-move");
				$(".footer-menu").toggleClass("footer-move");
				$(".slipoff-page").toggleClass("slipoff-page-move");
			},
			onGoToPage:function(e){
				var module=$(e.target).attr("data-module");
	            var view  =$(e.target).attr("data-view");
	            if(module!=null && view!=null){ 
	            	//判断是否已经登录，未登录跳转到登录页面
	            	var checkLogin = Util.checkLogin()
					 if(checkLogin === false || Piece.TempStage.loginId() == null){
					 	new Piece.Toast("请先登录!");
						Backbone.history.navigate("home/InUserInfoL", {
		            		trigger: true
		            	});
						 return;
				      }

				   Backbone.history.navigate(module+"/"+view, {trigger: true});
	            }else{
	            	new Piece.Toast("此功能还未完成");
	            }
			},
			render: function() {
				$(this.el).html(viewTemplate);
				this.onGetCityName();
				//this.loadMagicBox();
				Piece.View.prototype.render.call(this);
				return this;
			},
			onGetCityName:function(){
				 var phoneType;
				 if (navigator.userAgent.indexOf("iPhone") > -1) {
					  phoneType ="IOS";
		         }else{
		              phoneType ="Android";
		         }
				 
				 if(phoneType=="IOS"){
				      var url ="http://api.map.baidu.com/location/ip?ak=MUdZ6DYEde27znMafGzlCn6n"; 
				      Util.Ajax(url, "GET", {}, 'jsonp', function(data, textStatus, jqXHR) {      
				    	  Piece.Cache.put("cityName",data.content.address_detail.city);
				      }, function(e, xhr, type) {
				    	  new Piece.Toast('获取定位失败');
				      }); 
			    }else if(phoneType=="Android"){
				     var locationService = window.baiduLocation;
				     if(locationService){
				    	 locationService.getCurrentPosition(
				    		function(pos){
						       var longitude = pos.coords.longitude;
						       var latitude = pos.coords.latitude;
						       var url ="http://api.map.baidu.com/geocoder/v2/?ak=pA2N9r3tH7RFaElIfst6CzlY&location="
						    	   +latitude+","+longitude+"&output=json&pois=1";       
						       Util.Ajax(url, "GET", {}, 'jsonp',function(data, textStatus, jqXHR) {      
							       if(data.status==0){
							    	   var cityName = data.result.addressComponent.city;
							    	   Piece.Cache.put("cityName",cityName);
							       }else{
							    	   new Piece.Toast('获取定位失败');
							       }
						       }, function(e, xhr, type) {
						    	   new Piece.Toast('获取定位失败');
						       }); 
				    		},function(e){
				    			new Piece.Toast('获取定位失败');
				        });
				     }else{
				    	 new Piece.Toast('获取定位失败');
				     }
				}
			},
			onGoLogin:function(){
				var module="";
				var view="";
				var checkLogin = Util.checkLogin();
			    if(checkLogin === false || Piece.TempStage.loginId() == null){
			    	module="home";
			    	view="InUserInfoL";
			    }else{
			        module="user";
			        view="user-info";
			    }
				
				Backbone.history.navigate(module+"/"+view, {
	            		trigger: true
	            	});
			},
			onLoadTemplate:function(){
				_TU._U.setHeader(_TU._T.home_MeIndex);//加载头部导航
				$(".nav-wrap-right a").html('<i class="icon iconfont">&#xe69a;</i>').css({
					"color":"#bf793a"
				});
				var datas = _TU._T.home_MeIndex.data;
				for(var i=0;i<datas.menus_2.length;i++){
					var userInfoTemplate = $(this.el).find("#home_MeIndex_menus_2").html();
					var userInfoHtml = _.template(userInfoTemplate,datas.menus_2[i]);
					$(".meindex-menus-list ul").append(userInfoHtml);
					
					var msgs=Piece.Store.loadObject("MSGS",true);
					if(msgs==null){
						$(".meindex-menus-list ul #num").css("display","none");
					}else{
						$(".meindex-menus-list ul #num").html(msgs.length);
					}
				}
				
				var MeIndex_userinf = $(this.el).find("#home_MeIndex_userinf").html();
				var MeIndex_userinf_event = _.template(MeIndex_userinf, datas.login);
				$(".user-info").append(MeIndex_userinf_event);
			},
			loadMagicBox:function(){
				var checkLogin = Util.checkLogin();
			    if(checkLogin === false || Piece.TempStage.loginId() == null){
			    	Backbone.history.navigate("home/InUserInfoL", {
	            		trigger: true
	            	});
			    	return;
			    }
				
				//从服务器取数据
				var user_token=Piece.Store.loadObject("user_token", true),
				access_token=user_token.accessToken;
				equipList=Piece.Store.loadObject("DeviceList", true);
				if(equipList==null)equipList=new Array();
				
				//调用异步方法获取数据
				var loginId=Piece.Store.loadObject("loginId", true);
				var user_info=Piece.Store.loadObject("user_info", true);
				Util.AjaxWait(OpenAPI.readAllMagicBox,
					"GET", 
					{access_token:access_token,userLoginId:loginId,dataType: 'jsonp'}, 
					'jsonp',
					function(data, textStatus, jqXHR){
						if (data.gatewaylist!=null&&data.gatewaylist.length>0) {
							//添加魔方到本地
							var magicList=new Array();
							for(var i=0;i<data.gatewaylist.length;i++){
								//保存到魔方缓存
								var serialt=(data.gatewaylist[i].serial==""||data.gatewaylist[i].serial==null||data.gatewaylist[i].serial==undefined)?data.gatewaylist[i].gatewayId:data.gatewaylist[i].serial;
								var item={"serial":serialt,"name":data.gatewaylist[i].gatewayName,"device":'MagicBox',"gatewayId":data.gatewaylist[i].gatewayId};
								magicList[magicList.length]=item;
							}
							Piece.Store.saveObject("magicList", magicList, true);
					    }
					},function(e, xhr, type) {
						new Piece.Toast("获取用户魔方数据出错！");
					}
				);
			},
			onShow: function() {
//				this.loadMagicBox();
				
				//启动socket(只需启动一次)
				Util.sockConnect();
				this.onLoadTemplate();//加载配置模板
				Drag.onLoad();
				//显示登陆信息
				var checkLogin = Util.checkLogin();
			    if(checkLogin === false || Piece.TempStage.loginId() == null){
			    	$("#mobilePhone").text("未登录");
			    	$("#nickName").text("请登录");
			    }else{
			        var userInfo = Piece.Store.loadObject("user_info",true);
			        $("#mobilePhone").text(userInfo.username);
			        $("#nickName").text(userInfo.nickName);
			    }
				
				this.onCarousel(); //图片轮播
				this.slipOffPanel(); //左右滑出菜单面板
				var me=this;
				
//				Drag.initView(this.id);//加载菜单js,传入页面唯一标识
				
				$(".picture-browse").swipeLeft(function(e){
					if(num==5){
						num=0;
					}
					me.viewImg(num);
				});
				$(".picture-browse").swipeRight(function(e){
					if(num==0){
						num=5;
					}
					num=num-2;
					if(num<0){
						num=4;
					}
					
					me.viewImg(num);
				});
				$(".picture-browse").on("touchstart",function(e){
					clearTimeout(timeoutID);
				});
				$(".picture-browse").on("touchend",function(e){
					me.onCarousel();
				});
			},
			onCarousel:function(){
				var me=this;
				timeoutID=setTimeout(function(){
					me.viewImg(num);	
					me.onCarousel();
				},15000);
			},
			viewImg:function(n){
				$("#active label").css("background","#bbb");
				$("#sliders article .info").removeClass("text-browse");
				$("#sliders .inner").removeClass("move1 move2 move3 move4 move5");
				
				$("#sliders").find("article").eq(n).find(".info").addClass("text-browse");
				var obj=$("#sliders .inner");
				if(n==0){
					obj.addClass("move1");
					$("#active label[for='slider1']").css("background","#e50a86");
				}else if(n==1){
					obj.addClass("move2");
					$("#active label[for='slider2']").css("background","#e50a86");
				}else if(n==2){
					obj.addClass("move3");
					$("#active label[for='slider3']").css("background","#e50a86");
				}else if(n==3){
					obj.addClass("move4");
					$("#active label[for='slider4']").css("background","#e50a86");
				}else if(n==4){
					obj.addClass("move5");
					$("#active label[for='slider5']").css("background","#e50a86");
				}
				
				num++;
				if(num==5){
					num=0;
				}
			},
			slipOffPanel:function(){
				$(".slipoff-page").swipeLeft(function(e){
					$(".header_font_color").removeClass("text-page-move");
					$(".content").removeClass("content-move");
					$(".footer-menu").removeClass("footer-move");
					$(".slipoff-page").removeClass("slipoff-page-move");
				});
				$(".menus").swipeRight(function(e){
					$(".header_font_color").addClass("text-page-move");
					$(".content").addClass("content-move");
					$(".footer-menu").addClass("footer-move");
					$(".slipoff-page").addClass("slipoff-page-move");
				});
			}
		}); //view define

	});