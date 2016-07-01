define(['text!magicbox/StMBMain.html','zepto', "../base/openapi", '../base/util', '../base/weather',"../base/templates/template", '../base/socketutil', '../base/include'],
	function(viewTemplate,$, OpenAPI, Util,weatherJson,_TU,SocketUtil) {
		var gatewayId="";
		var serial="";
		var check=null;
		return Piece.View.extend({
			id: 'magicbox_StMBMain',
			events:{
				"touchstart .nav-wrap-right .react"    :     "onToSetup"
			},
			onToSetup:function(e){
				Backbone.history.navigate("magicbox/InMBSetup", {
            		trigger: true
            	});
			},
			onEHomeMenuFn:function(e){
				var me=this;
				$(".menu-box").on({
			        tap: function(e){
			            var module=$(e.target).attr("data-module");
			            var view  =$(e.target).attr("data-view");
			            if(module!=null && view!=null){ 
			            	Backbone.history.navigate(module+"/"+view, {
			            		trigger: true
			            	});
			            }else{
			            	
			            } 
			            return false; 
			        }
			    });
			},
			render: function() {
				$(this.el).html(viewTemplate);
				Piece.View.prototype.render.call(this);
				var magicList=Piece.Store.loadObject("magicList",true);
				if(!magicList||magicList.length<1){
		           new Piece.Toast(_TU.I18n.Common.getUserMagicboxError);
		           Backbone.history.navigate("home"+"/"+"MeIndex", {
		               trigger: true
		              });
		           return;
		        }
				return this;
			},
			getDateNow:function(){
				var date = new Date();
			    var seperator1 = "-";
			    var seperator2 = ":";
			    var month = date.getMonth() + 1;
			    var strDate = date.getDate();
			    if (month >= 1 && month <= 9) {
			        month = "0" + month;
			    }
			    if (strDate >= 0 && strDate <= 9) {
			        strDate = "0" + strDate;
			    }
			    var currentdate = date.getFullYear() + month + strDate
			            + date.getHours() + date.getMinutes();
			    return currentdate;
			},
			showWeather:function(cityName){
				if(cityName==""||cityName=="undefined"){
					 new Piece.Toast(_TU.I18n.Common.mapWeatherFailed);
					 return false;
				}
				var dateTime = this.getDateNow();
				var cityCode = weatherJson.cityNames[cityName];
				var appid = "d3986f468cee45b8";
	            var private_key = "0f846a_SmartWeatherAPI_70b8a4c";
	            var thisCity = "101270101";
	            var type = "forecast_v";
	            var api_head = OpenAPI.getWeather+"?areaid="+cityCode+"&type="+type+"&date="+dateTime;
           		var publickey = api_head + "&appid="+appid;


           		key = b64_hmac_sha1(private_key,publickey);
           		var urlAppid = appid.substring(0, 6);
            	var thisUrl = api_head + "&appid="+urlAppid+"&key="+key;
            	
            	this.jsAjax(thisUrl,function(responseJson){
					var fd = responseJson.f.f1[0].fd;
				    var fc = responseJson.f.f1[0].fc;
				    var fa = responseJson.f.f1[0].fa;	
				    var fb = responseJson.f.f1[0].fb;
					var weatherPhenomena;
					if(fa.length>0){
						weatherPhenomena = weatherJson.weatherPhenomena[fa];
					}else{
						weatherPhenomena = weatherJson.weatherPhenomena[fb];
					}
					var weatherStr;
					if(fc.length){
						weatherStr = fd+"~"+fc;
					}else{
						weatherStr = fd;
					}
					var weatherStr = weatherPhenomena+" "+weatherStr;
					$("#spWeather").text(weatherStr);
					Piece.Cache.put("weatherStr",weatherStr);//温度存入缓存
				});


				$.ajax({  
					url:OpenAPI.getWthrcdn+'?citykey='+cityCode+'&callback=test',// 跳转到 action  
				    data:{},  
					type:'get',  
					dataType:'xml',  
					success:function(data) {  
						var zhishu = $(data).find('zhishu');
						var zhishu1 = $(zhishu[4]).children('value').text()+$(zhishu[4]).children('name').text().substring(0,$(zhishu[4]).children('name').text().length-2);
						var zhishu2 = $(zhishu[5]).children('value').text()+$(zhishu[5]).children('name').text().substring(0,$(zhishu[5]).children('name').text().length-2);
						var zhishu3 = $(zhishu[7]).children('value').text()+$(zhishu[7]).children('name').text().substring(0,$(zhishu[7]).children('name').text().length-2);
						var zhishu4 = $(zhishu[8]).children('value').text()+$(zhishu[8]).children('name').text().substring(0,$(zhishu[8]).children('name').text().length-2);
						$("#outdoorSport").text(zhishu1);
						$("#openWindow").text(zhishu2);
						$("#wearMasks").text(zhishu3);
						$("#openPurifier").text(zhishu4);
						var arrZhiShu=new Array();
						arrZhiShu[0] = zhishu1;
						arrZhiShu[1] = zhishu2;
						arrZhiShu[2] = zhishu4;
						arrZhiShu[3] = zhishu1;
						Piece.Cache.put("arrZhiShu",arrZhiShu);  //天气指数存入缓存
					},  
					error : function() { 
						new Piece.Toast(_TU.I18n.Common.mapWeatherFailed);
					}  
				});
			},
			onShowPM:function(){
				this.showCacheWearther();
				this.showCachePM25();
				this.showCacheIndex();
				var cityName = Piece.Cache.get("cityName");
				if(cityName){
					$("#city").text(cityName);
					this.showWeather(cityName.substring(0,cityName.length-1));
					var url =OpenAPI.readCityPM25;
					var data={cityName:cityName}	
					Util.Ajax(url, "GET", data, 'jsonp', function(data, textStatus, jqXHR) {						
						$("#pm25Value").text(data.cityPm25.pm25Value);
						Piece.Cache.put("pm25Value",data.cityPm25.pm25Value);   //PM2.5存入缓存
					}, function(e, xhr, type) {
						new Piece.Toast(_TU.I18n.Common.mapWeatherFailed);
					});	
				}

				this.getHumidity();
				this.getTemperature();
				this.getAirQuality();
			},
			showCacheWearther:function(){
				var weatherStr = Piece.Cache.get("weatherStr");
				if(weatherStr){
					$("#spWeather").text(weatherStr);
				}else{
					$("#spWeather").text("多云 1~10");
				}
				
			},
			showCachePM25:function(){
				var pm25Value = Piece.Cache.get("pm25Value");
				if(pm25Value){
					$("#pm25Value").text(pm25Value);
				}else{
					$("#pm25Value").text("100");
				}
				
			},
			showCacheIndex:function(){
				var arrZhiShu = Piece.Cache.get("arrZhiShu");
				if(arrZhiShu){
					$("#outdoorSport").text(arrZhiShu[0]);
					$("#openWindow").text(arrZhiShu[1]);
					$("#wearMasks").text(arrZhiShu[2]);
					$("#openPurifier").text(arrZhiShu[3]);
				}
			},
			onLoadTemplate:function(){
				_TU._U.setHeader(_TU._T.magicbox_StMBMain);//加载头部导航
				var me = this;
				var stMBMainTopTemplate = $(me.el).find("#stMBMainTopTemplate").html();
				var stMBMainTopHtml= _.template(stMBMainTopTemplate, _TU._T.magicbox_StMBMain.data.top);
				$("#top").append(stMBMainTopHtml);
				var menuTemplate = $(me.el).find("#menuTemplate").html();
				var sort = 1;
				var menuHtml="";
				var magicList=Piece.Store.loadObject("magicList",true);
				for(var i=0;i<magicList.length;i++){
					menuHtml+="<div class='div-menu' data-sort='"+sort+"'>";
					$(_TU._T.magicbox_StMBMain.data.menu).each(function(index){
						menuHtml+= _.template(menuTemplate, _TU._T.magicbox_StMBMain.data.menu[index]);
					});
					menuHtml += "</div>";
					sort=sort+1;
					if(i==0){
			 			$("#activeM").append("<label for='slider3' style='background: #e50a86;'></label>");
					}else{
						$("#activeM").append("<label for='slider3'></label>");
					}
				}
				$("#menu-container").append(menuHtml);
			},
			checkValue:function(){
				     gatewayId=Piece.Cache.get("gatewayId");	
					 if(gatewayId==null||gatewayId=="")
					 {
						 new Piece.Toast(_TU.I18n.Common.noMagicBoxError);
						 return;
			    	 }
					  serial=Piece.Cache.get("serial");	
					  if(serial==null||serial=="")
				     {
						 new Piece.Toast(_TU.I18n.Common.noDeviceSeriError);
						 return;
			         }
			},
			getAirQuality:function(){   //获取空气质量
				SocketUtil.AddNewModule("AQ00",function(){
					var model=new SocketUtil.sendModel();
	                model.gatewayId=gatewayId;
	                model.moduleId="AQ00";
	                model.moduleIndex="0000";
	                model.cmdType="Comd";
	                model.cmdCatalog="Get ";
					model.callbackFun=function(sendObj,obj){
						if(outTimer!=null)window.clearTimeout(outTimer);
						if(obj.command.indexOf("Rspn0000")<0){
							new Piece.Toast(_TU.I18n.Common.timeOut);
							return;
	  					} else{
							if(obj.command.indexOf("=")<0){
								var index = obj.command.indexOf("=");
								var quantized = obj.substring(index+1,obj.length-1);
								var value="";
								if(quantized==0){
									value="优";
								}else if(quantized==1){
									value="良";
								}else if(quantized==2){
									value="差";
								}
								$("#quantizedValue").val(value);
							}
	  					}
					}
	                model.queryString={"quantized":""};
	                SocketUtil.sendMessage(model);
				});
			},
			getTemperature:function(){   //获取温度
				SocketUtil.AddNewModule("TEMP",function(){
					var model=new SocketUtil.sendModel();
	                model.gatewayId=gatewayId;
	                model.moduleId="TEMP";
	                model.moduleIndex="0000";
	                model.cmdType="Comd";
	                model.cmdCatalog="Get ";
					model.callbackFun=function(sendObj,obj){
						if(outTimer!=null)window.clearTimeout(outTimer);
						if(obj.command.indexOf("Rspn0000")<0){
							new Piece.Toast(_TU.I18n.Common.timeOut);
							return;
	  					} else{
							if(obj.command.indexOf("=")<0){
								var index = obj.command.indexOf("=");
								var temperature = obj.substring(index+1,obj.length-1);
								$("#temperatureValue").val(temperature);
							}
	  					}
					}
	                model.queryString={"temperature":""};
	                SocketUtil.sendMessage(model);
				});
			},
			getHumidity:function(){  //获取湿度
				SocketUtil.AddNewModule("HUM0",function(){
					var model=new SocketUtil.sendModel();
	                model.gatewayId=gatewayId;
	                model.moduleId="HUM0";
	                model.moduleIndex="0000";
	                model.cmdType="Comd";
	                model.cmdCatalog="Get ";
					model.callbackFun=function(sendObj,obj){
						if(outTimer!=null)window.clearTimeout(outTimer);
						if(obj.command.indexOf("Rspn0000")<0){
							new Piece.Toast(_TU.I18n.Common.timeOut);
							return;
	  					} else{
							if(obj.command.indexOf("=")<0){
								var index = obj.command.indexOf("=");
								var humidity = obj.substring(index+1,obj.length-1);
								$("#humidityValue").val(humidity);
							}
	  					}
					}
	                model.queryString={"humiture":"register"};
	                SocketUtil.sendMessage(model);
				});
			},
			jsAjax:function(url,callback){
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
			onShow: function() {
				this.onLoadTemplate();

				var magicList=Piece.Store.loadObject("magicList",true);
				if(magicList==null){
					Backbone.history.navigate("home/MeIndex", {
	            		trigger: true
	            	});
					return;
				}
				
				_TU._U.goBack(function(){
						Backbone.history.navigate('home/MeIndex', {trigger: true});
				});
				
				var ga=Piece.Cache.get("gatewayId");
				var index=-1;
					var magicList=Piece.Store.loadObject("magicList",true);
					for(var i=0;i<magicList.length;i++){
						if(magicList[i].gatewayId==ga){
							index=i;
							break;
					}
				}
				if(index==-1){
				    Piece.Cache.put("gatewayId",magicList[0].gatewayId);
				    Piece.Cache.put("serial",magicList[0].serial);
				    $("#controlTitle").html(magicList[0].name);
				}else{
					Piece.Cache.put("gatewayId",magicList[index].gatewayId);
				    Piece.Cache.put("serial",magicList[index].serial);
				    $("#controlTitle").html(magicList[index].name);
				}
				
				this.onEHomeMenuFn();
				this.slipOffPanel();
				this.slipMagicBox();

				var HI = $(".menu-view i").height();
				var HD = $(".menu-view div").height();
				
				var wid=$(".menu-box").width();
				var hei=$(".menu-box").height();
				
				$(".menu-view i").css({"margin-top":((hei-(HI+HD)) / 2)+"px"});
				
				$(".content").find(".menu-view").each(function(ev,ex){
					var _this=$(ex);
					var t = _this.position().top;
					var l = _this.position().left;
					_this.css({
						"width":wid+"px",
						"height":hei+"px",
						"top": t+'px',
						"left": l+'px'
					});
				});
				this.onShowPM();
			},
			slipMagicBox:function(){
				$(".content").swipeLeft(function(e){
					var ga=Piece.Cache.get("gatewayId");
					var index=0;
					var magicList=Piece.Store.loadObject("magicList",true);
					for(var i=0;i<magicList.length;i++){
						if(magicList[i].gatewayId==ga){
							index=i;
							break;
						}
					}
					if(index>0){
						Piece.Cache.put("gatewayId",magicList[index-1].gatewayId);
				        Piece.Cache.put("serial",magicList[index-1].serial);
						$("#controlTitle").html(magicList[index-1].name);
					}
				});
				$(".content").swipeRight(function(e){
					var ga=Piece.Cache.get("gatewayId");
					var index=0;
					var magicList=Piece.Store.loadObject("magicList",true);
					for(var i=0;i<magicList.length;i++){
						if(magicList[i].gatewayId==ga){
							index=i;
							break;
						}
					}
					if(index<magicList.length-1){
						Piece.Cache.put("gatewayId",magicList[index+1].gatewayId);
				        Piece.Cache.put("serial",magicList[index+1].serial);
						$("#controlTitle").html(magicList[index+1].name);
					}
				});
			},
			slipOffPanel:function(){
				var count =$(".div-menu").length;
				var divmenus = $(".div-menu");
				var activeLabel = $("#activeM label");

				for (var i = 0; i < count; i++) {
						if(i ==0){
							$(divmenus[i]).css("left","0%");
						}else{
							$(divmenus[i]).css("left","-100%");
						}
						
				}
				var index = 0;
				$(".div-menu").swipeLeft(function(e){
					var sort =  $(this).attr("data-sort");
					if(sort >=count){
						return false;
					}
					$(divmenus[sort-1]).css("left","-100%");
					$(divmenus[sort]).css("left","0%");

					$(activeLabel).each(function(){
						$(this).css("background","#cacaca");
					});
					$(activeLabel[sort]).css("background","#e50a86");
				});
				$(".div-menu").swipeRight(function(e){
					var sort =  $(this).attr("data-sort");
					if(sort <=1){
						return false;
					}
					$(divmenus[sort-1]).css("left","-100%");
					$(divmenus[sort-2]).css("left","0%");
					$(activeLabel).each(function(){
						$(this).css("background","#cacaca");
					});
					$(activeLabel[sort-2]).css("background","#e50a86");
				});
			}
		}); //view define
	});
	function readCityPM25jsonp(data) {
		$("#pm25Value").text(data.cityPm25.pm25Value);
	}