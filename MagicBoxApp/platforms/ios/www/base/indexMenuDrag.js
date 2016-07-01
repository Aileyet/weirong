define(['zepto','../base/tooltip/tooltip','../base/util',"../base/openapi",'../base/drag/menuStoreUtil'], function($,Tooltip,Util,OpenApi,MenuUtil) {
	var oUl,aLi;
	var disX = 0;
	var disY = 0;
	var minZindex = 1;
	var aPos,menuPos,menus,deleteMenuStr;
	var moveing=false;
	var tooltip = new Tooltip();
	
	var _Drag={
			//程序入口
			onLoad:function(){
				var homeMenuInfos = Piece.Store.loadObject("homeMenuInfos", true);
				if(homeMenuInfos == null){
					MenuUtil.setHomeDefaultMenu();
					homeMenuInfos = Piece.Store.loadObject("homeMenuInfos", true); 
				}
				menus = homeMenuInfos.menus;
				menuPos = homeMenuInfos.menuPos==null || homeMenuInfos.menuPos==undefined?{}:homeMenuInfos.menuPos;
				deleteMenuStr = homeMenuInfos.deleteMenu==null || homeMenuInfos.deleteMenu==undefined?{}:homeMenuInfos.deleteMenu;
				
				_Drag.onLoadData();
			},
			//加载数据
			onLoadData:function(){
				
				moveing=false;
				
				if(_Drag.isEmptyJSON(menuPos) && _Drag.isEmptyJSON(deleteMenuStr)){
					$("#ul1").html("");
					$.map(menus,function(item,index){
						var t="";
						$.map(item.data,function(e,n){
							t+= '<div class="'+e.style+' '+e.bgcolor+'" data-module="'+e.module+'" data-view="'+e.view+'">'+
							    	'<i class="icon iconfont '+e.font+'">'+e.icon+'</i>'+
								'</div>';
						});
						
						var h = '<li>'+
									'<div order="'+item.order+'" class="menu-icon-text">'+
										'<div class="menu-icon-container" data-type="'+item.type+'">';
							h+=t;			
							h+='</div>';
							if(item.type=="menu"){
								h+='<div>'+item.title+'</div>';
							}else if(item.type=="folder"){
								h+='<div style="padding:2.5px 0px;">'+item.title+'</div>';
							}
										
							h+='<div class="close-icon" order="'+item.order+'"><i class="icon iconfont">&#xe69b;</i></div>'+
									 '</div>'+
								'</li>';
						$("#ul1").append(h);
						
					});
				}else{
					$("#ul1").html("");
					for(var key in menuPos){
						var t="",item=_Drag.getMenuByOrder(menuPos[key]);
						if(item != undefined){
							$.map(item.data,function(e,n){
								t+= '<div class="'+e.style+' '+e.bgcolor+'" data-module="'+e.module+'" data-view="'+e.view+'">'+
								    	'<i class="icon iconfont '+e.font+'">'+e.icon+'</i>'+
									'</div>';
							});
							
							var h = '<li>'+
										'<div order="'+menuPos[key]+'" class="menu-icon-text">'+
											'<div class="menu-icon-container" data-type="'+item.type+'">';
								h+=t;			
								h+='</div>';
								if(item.type=="menu"){
									h+='<div>'+item.title+'</div>';
								}else if(item.type=="folder"){
									h+='<div style="padding:2.5px 0px;">'+item.title+'</div>';
								}
								    h+='<div class="close-icon" order="'+menuPos[key]+'"><i class="icon iconfont">&#xe69b;</i></div>'+
										 '</div>'+
									'</li>';
							$("#ul1").append(h);
						}
					}
				}
				
				oUl = $("#ul1");
				aLi = oUl.find(".menu-icon-text");
				_Drag.initView();
			},
			//初始菜单坐标，位置信息
			initView:function(){
					menuPos={};
					aPos=[];
					for(var i=0;i<aLi.length;i++){
						var t = aLi[i].offsetTop;
						var l = aLi[i].offsetLeft;
						aLi[i].style.top = t+"px";
						aLi[i].style.left = l+"px";
						aPos[i] = {left:l,top:t};
						aLi[i].index = i;
						var odr = $(aLi[i]).attr("order");
						menuPos[i] = odr;
					}
					
					for(var i=0;i<aLi.length;i++){
						aLi[i].style.position = "absolute";
						aLi[i].style.margin = 0;
						_Drag.setListener(aLi[i]);
						_Drag.setDrag(aLi[i]);
					}
					
//					if(moveing){
//						$(".close-icon").css("display","block");
//					}
					
					//绑定保存菜单数据事件
//					$(".nav-wrap-right a").on("tap",function(e){
//						moveing=false;
//						$(".close-icon").css("display","none");
////					$(e.target).parent().find("i").css("display","none");
//						var appMenu={"menus":menus,"menuPos":menuPos,"deleteMenu":deleteMenuStr};
//						MenuUtil.saveMenuToService(appMenu,1,"HOME");
//					});
			},
			//绑定事件
			setListener:function(obj){
				//绑定长按时间进行拖拽，删除，组合等功能
				$(obj).on("longTap",function(event){
					moveing=true;
					$(".close-icon").css("display","block");
				});
				
				//跳转页面
				$(obj).on("tap",function(e){
					if(!moveing){//在可移动菜单的情况下，不能点击菜单
						//判断点击的是菜单还是组合菜单
						var event = $(e.target).parent().parent().find(".menu-icon-container");
						var type=event.attr('data-type');
						
						if(type=="menu"){//菜单
							if(e.target.className.indexOf("menu-icon")!=-1){
								var module=$(e.target).attr("data-module");
					            var view  =$(e.target).attr("data-view");
					            if(module!=null && module!="undefined" && module!="" 
					            	&& view!=null && view!="" && view!="undefined"){
					            	//判断是否已经登录，未登录跳转到登录页面
					            	var checkLogin = Util.checkLogin()
									 if(checkLogin === false || Piece.TempStage.loginId() == null){
									 	new Piece.Toast("请先登录!");
										Backbone.history.navigate("home/InUserInfoL", {
						            		trigger: true
						            	});
										 return;
								      }

					            	Backbone.history.navigate(module+"/"+view, {
					            		trigger: true
					            	});
					            }else{
					            	new Piece.Toast("此功能还未开通!");
					            }
							}
						}else if(type == "folder"){//组合菜单
							tooltip.setCovering(0);
							tooltip.showMenu();
							
							//动态加载菜单
							var order = event.parent().attr("order");
							var menuObj = _Drag.getMenuByOrder(order);
							var datas = menuObj.data;
							tooltip.setMenu(menuObj.title,datas,order);
							
							var mes = $(".misc-menu");
							aLi = mes.find(".menu-view");
							aLi[aLi.length] = mes[0];
							aPos=[];
							for(var i=0;i<aLi.length;i++){
								var t = aLi[i].offsetTop;
								var l = aLi[i].offsetLeft;
								aLi[i].style.top = t+"px";
								aLi[i].style.left = l+"px";
								aPos[i] = {left:l,top:t};
								aLi[i].index = i;
							}
							for(var i=0;i<aLi.length;i++){
								aLi[i].style.position = "absolute";
								_Drag.setDragToDesktop(aLi[i]);
							}
							//点击空白处关闭弹出菜单
							$(document).on("tap",function(e){
								e.stopPropagation(); //阻止事件冒泡    
							    var _con = $('.misc-menu');   // 设置目标区域
							    if(!$(this).hasClass("misc-menu") && _con.has(e.target).length === 0 && $(e.target).hasClass("covering")){ // Mark 1
							    	tooltip.hideMenu(); // 隐藏弹出菜单
							    	var t = $("#misc-menu-title").val();
							    	$(document).off("tap");
							    	_Drag.getMenuByOrder(order).title=t;
							    	$('div[order="'+order+'"]>div').eq(1).text(t);
							    	//重新加载菜单的位置坐标
							    	_Drag.onLoadData();
							    }
							});
						}
					}
				});
				
//				localStorage.removeItem("home_MeIndex_deleteMenuInfo");
				//删除菜单事件绑定
				$(obj).find(".close-icon").on("touchend",function(e){
					var ord = $(e.target).attr("order");
					var menuObj = _Drag.getMenuByOrder(ord);
					if(menuObj.type=="menu"){
						deleteMenuStr[ord]=parseInt(ord);
					}else if(menuObj.type=="folder"){
						$.map(menuObj.data,function(item,index){
							deleteMenuStr[item.order]=item.order;
							var das=_Drag.getMenuByOrder(item.order).data[0];
							das.style="menu-icon";
							das.font="i-font";
						});
						_Drag.deleteMenuByOrder(ord);//删除菜单
					}
					for(var key in menuPos){
						if(menuPos[key] == ord){
							delete menuPos[key];
						}
					}
					
					//保存菜单信息
					var appMenu={"menus":menus,"menuPos":menuPos,"deleteMenu":deleteMenuStr};
					MenuUtil.saveMenuToService(appMenu,1,"HOME");
					
					_Drag.onLoadData();
				});
			},
			//拖拽
			setDrag:function(obj){
				$(obj).on("touchstart", function(event){
					if(!moveing){//判断是否可以拖拽
						return;
					}
					
					var scrollTop = document.documentElement.scrollTop||document.body.scrollTop;
					var scrollLeft = document.documentElement.scrollLeft||document.body.scrollLeft;
					obj.style.zIndex = minZindex++;
					//当鼠标按下时计算鼠标与拖拽对象的距离
					disX = event.touches[0].clientX +scrollLeft-obj.offsetLeft;
					disY = event.touches[0].clientY +scrollTop-obj.offsetTop;
					
					var width2 = obj.offsetWidth/2;
					
					$(document).on("touchmove",function(event){
						//当鼠标拖动时计算div的位置
						var l = event.touches[0].clientX -disX +scrollLeft;
						var t = event.touches[0].clientY -disY + scrollTop;
						obj.style.left = l + "px";
						obj.style.top = t + "px";
						for(var i=0;i<aLi.length;i++){
							aLi[i].className = "menu-icon-text";
						}
						
						var type = _Drag.getMenuByOrder($(obj).attr("order")).type;
						
						var oNear = _Drag.findMin(obj);
						if(oNear.obj && (oNear.dis>width2 || type=="folder")){
							oNear.obj.className = "menu-icon-text active";
						}else if(oNear.obj){
							oNear.obj.className = "menu-icon-text polymerization";
						}
						
					});
					
					$(document).on("touchend",function(){
						$(document).off("touchmove");//当鼠标弹起时移出移动事件
						$(document).off("touchend");//移出up事件，清空内存
						/*
						* 检测是否普碰上，在交换位置
						* obj 拖拽的对象
						* oNear 交换位置的对象
						*/
						var menuObj = _Drag.getMenuByOrder($(obj).attr("order"));
						if(menuObj == undefined){
							return;
						}
						var type = menuObj.type;
						var oNear = _Drag.findMin(obj);
						if(oNear.obj && (oNear.dis>width2 || type=="folder")){
							//交换位置
							oNear.obj.className = "menu-icon-text";
							oNear.obj.style.zIndex = minZindex++;
							obj.style.zIndex = minZindex++;
							_Drag.startMove(oNear.obj,aPos[obj.index]);
							_Drag.startMove(obj,aPos[oNear.obj.index]);
							//交换index
							oNear.obj.index += obj.index;
							obj.index = oNear.obj.index - obj.index;
							oNear.obj.index = oNear.obj.index - obj.index;
							
							var odr = $(oNear.obj).attr("order");
							menuPos[oNear.obj.index] = odr;
							menuPos[obj.index] = $(obj).attr("order");
							
							//保存菜单信息
							var appMenu={"menus":menus,"menuPos":menuPos,"deleteMenu":deleteMenuStr};
							MenuUtil.saveMenuToService(appMenu,1,"HOME");
//							//重新加载菜单的位置坐标
							_Drag.onLoadData();
							
						}else if(oNear.obj){
							//两个菜单组合为一个菜单框
							oNear.obj.className="menu-icon-text";
							$(oNear.obj).find(".menu-icon i").removeClass(".i-font").addClass("i-font-Small");
							$(oNear.obj).find(".menu-icon").removeClass(".menu-icon").addClass("menu-icon-Small");
							
							var imgOjb = $(obj).find(".menu-icon");
							imgOjb.find("i").removeClass(".i-font").addClass("i-font-Small");
							imgOjb.removeClass(".menu-icon").addClass("menu-icon-Small");
							$(oNear.obj).find(".menu-icon-container").append(imgOjb);
							
							var menuObjONear = _Drag.getMenuByOrder($(oNear.obj).attr("order"));
							var type = menuObjONear.type;
							if(type=="menu"){
								//把菜单的数据进行组合
								var data1 = menuObj.data[0];
								data1.style="menu-icon-Small";
								data1.font="i-font-Small";
								
								var data2 = menuObjONear.data[0];
								data2.style="menu-icon-Small";
								data2.font="i-font-Small";
								
								//创建新的菜单数据
								var mv = menus.length;
								menus[mv]={
										title:"文件夹",
										order:mv,
										type:"folder",
										data:[data2,data1]
								}
								
								for(var key in menuPos){
									if(menuPos[key] == $(oNear.obj).attr("order")){
										menuPos[key] = mv;
									}
								}
								
							}else if(type=="folder"){
								//把菜单的数据进行组合
								var data1 = menuObj.data[0];
								data1.style="menu-icon-Small";
								data1.font="i-font-Small";
								
								var data2 = menuObjONear.data;
								data2[data2.length] = data1;
							}
							
							
							//把合并的菜单删除，并把它之后的菜单向前移动一个位置
							delete menuPos[obj.index];  
							$(obj).parent().remove();
							
							//保存菜单信息
							var appMenu={"menus":menus,"menuPos":menuPos,"deleteMenu":deleteMenuStr};
							MenuUtil.saveMenuToService(appMenu,1,"HOME");
							
							//重新加载菜单的位置坐标
							_Drag.onLoadData();
						}else{
							//回到原来位置
							_Drag.startMove(obj,aPos[obj.index]);
						}
					});
					
					clearInterval(obj.timer);
					return false;//低版本出现禁止符号
				});
			},
			//把菜单拖拽到桌面上的逻辑
			setDragToDesktop:function(obj){
				//设置文件夹不能拖动
				if(_Drag.getMenuByOrder($(obj).attr("order")).type=="folder"){
					return;
				}
				$(obj).on("touchstart", function(event){
					var scrollTop = document.documentElement.scrollTop||document.body.scrollTop;
					var scrollLeft = document.documentElement.scrollLeft||document.body.scrollLeft;
					//obj.style.zIndex = minZindex++;
					//当鼠标按下时计算鼠标与拖拽对象的距离
					disX = event.touches[0].clientX +scrollLeft-obj.offsetLeft;
					disY = event.touches[0].clientY +scrollTop-obj.offsetTop;
					var mmm=false;
					$(document).on("touchmove",function(event){
						//当鼠标拖动时计算div的位置
						var l = event.touches[0].clientX -disX +scrollLeft;
						var t = event.touches[0].clientY -disY + scrollTop;
						obj.style.left = l + "px";
						obj.style.top = t + "px";
						mmm=true;
					});
					$(document).on("touchend",function(e){
						$(document).off("touchmove");//当鼠标弹起时移出移动事件
						$(document).off("touchend");//移出up事件，清空内存
						if(!mmm){
							_Drag.jumpPage(e);
							return;
						}
						
						var isCoincidence = _Drag.colTest(obj,$(aLi[aLi.length-1]).find(".menu-container")[0]);
						if(!isCoincidence){
							tooltip.hideMenu(); // 隐藏弹出菜单
							var moveOrd = $(obj).attr("order");
							var stopOrd = _Drag.getGroupOrder(obj);
							//修改菜单json信息
							var bool=true;
							for(var key in menuPos){
								if(menuPos[key] == moveOrd){
									bool=false;
									break;
								}
							}
							if(bool){
								menuPos[Object.keys(menuPos).length] = moveOrd;
							}
							
							var menuStopOrd =  _Drag.getMenuByOrder(stopOrd);
							
							var tempDatas = menuStopOrd.data;
							menuStopOrd.data=[];
							var datas = menuStopOrd.data;
							for(var i=0;i<tempDatas.length;i++){
								var data = tempDatas[i];
								if(data.order != moveOrd){
									datas[datas.length]=data
								}
							}
							//修改菜单样式
							datas = menuStopOrd.data
							if(datas.length==0){
								_Drag.deleteMenuByOrder(stopOrd);//删除菜单
								for(var key in menuPos){
									if(menuPos[key] == stopOrd){
										delete menuPos[key];
										break;
									}
								}
							}
							var mData = _Drag.getMenuByOrder(moveOrd).data;
							mData[0].style="menu-icon";
							mData[0].font="i-font";
							
							
							//保存菜单信息
							var appMenu={"menus":menus,"menuPos":menuPos,"deleteMenu":deleteMenuStr};
							MenuUtil.saveMenuToService(appMenu,1,"HOME");
							
							_Drag.onLoadData();
						}else{
							//回到原来位置
							_Drag.startMove(obj,aPos[obj.index]);
						}
					});
					
					clearInterval(obj.timer);
					return false;//低版本出现禁止符号
				});
			},
			//页面跳转逻辑
			jumpPage:function(e){
				var event=e;
				if(!$(e.target).hasClass(".menu-icon")){
					event = $(e.target).parent();
				}
				var module = event.attr("data-module");
				var view = event.attr("data-view");
				if(module!=null && module!="undefined" && module!="" 
	            	&& view!=null && view!="" && view!="undefined"){
					tooltip.hideMenu(); // 隐藏弹出菜单
					//判断是否已经登录，未登录跳转到登录页面
					var checkLogin = Util.checkLogin()
					 if(checkLogin === false || Piece.TempStage.loginId() == null){
					 	new Piece.Toast("请先登录!");
						Backbone.history.navigate("home/InUserInfoL", {
		            		trigger: true
		            	});
						 return;
				      }
	            	Backbone.history.navigate(module+"/"+view, {
	            		trigger: true
	            	});
	            }else{
	            	new Piece.Toast("此功能还未开通!");
	            }
			},
			//菜单从组合拖出时，获取所在组合的order
			getGroupOrder:function(obj){
				var inNum;
				outerloop:
				for(var i=0;i<menus.length;i++){
					var event=menus[i];
					if(event.type=="folder"){
						for(var j=0;j<event.data.length;j++){
							var e = event.data[j];
							if(e.order == $(obj).attr("order")){
								inNum=event.order;
								break outerloop;
							}
						}
					}
				}
				return inNum;
			},
			//根据order 获取菜单数据(menus)中对应的数据
			getMenuByOrder:function(order){
				var menuObj;
				for(var i=0;i<menus.length;i++){
					var item = menus[i];
					if(item.order == order){
						menuObj = item;
						break;
					}
				}
				return menuObj;
			},
			//删除菜单，根据order
			deleteMenuByOrder:function(order){
				for(var i=0;i<menus.length;i++){
					var item = menus[i];
					if(item.order == order){
						menus.splice(i,1);
						break;
					}
				}
			},
			//碰撞检测
			colTest:function(obj1,obj2){
				var t1 = obj1.offsetTop;
				var r1 = obj1.offsetWidth+obj1.offsetLeft;
				var b1 = obj1.offsetHeight+obj1.offsetTop;
				var l1 = obj1.offsetLeft;
				
				var t2 = obj2.offsetTop;
				var r2 = obj2.offsetWidth+obj2.offsetLeft;
				var b2 = obj2.offsetHeight+obj2.offsetTop;
				var l2 = obj2.offsetLeft;
				
				if(t1>b2||r1<l2||b1<t2||l1>r2){
					return false;
				}else{
					return true;
				}
			},
			//勾股定理求距离
			getDis:function(obj1,obj2){
				var a = obj1.offsetLeft-obj2.offsetLeft;
				var b = obj1.offsetTop-obj2.offsetTop;
				return Math.sqrt(Math.pow(a,2)+Math.pow(b,2));
			},
			//找到距离最近的
			findMin:function(obj){
				var minDis = 999999999;
				var minIndex = -1;
				for(var i=0;i<aLi.length;i++){
					if(obj==aLi[i])continue;
					if(_Drag.colTest(obj,aLi[i])){
						var dis = _Drag.getDis(obj,aLi[i]);
						if(dis<minDis){
							minDis = dis;
							minIndex = i;
						}
					}
				}
				if(minIndex==-1){
					return {obj:null,dis:dis};
				}else{
					return {obj:aLi[minIndex],dis:dis};
				}
			},
			isEmptyJSON:function(jsonObj){
				if (typeof jsonObj === "object" && !(jsonObj instanceof Array)){  
				    var hasProp = true;
				    for (var prop in jsonObj){  
				        hasProp = false; 
				        break;  
				    } 
				    
				    return hasProp;
				} 
			},
			/*
			 * 移动菜单逻辑
			 * */
			//通过class获取元素
			getClass:function(cls){
			    var ret = [];
			    var els = document.getElementsByTagName("*");
			    for (var i = 0; i < els.length; i++){
			        //判断els[i]中是否存在cls这个className;.indexOf("cls")判断cls存在的下标，如果下标>=0则存在;
			        if(els[i].className === cls || els[i].className.indexOf("cls")>=0 || els[i].className.indexOf(" cls")>=0 || els[i].className.indexOf(" cls ")>0){
			            ret.push(els[i]);
			        }
			    }
			    return ret;
			},
			getStyle:function(obj,attr){//解决JS兼容问题获取正确的属性值
				return obj.currentStyle?obj.currentStyle[attr]:getComputedStyle(obj,false)[attr];
			},
			startMove:function(obj,json,fun){
				clearInterval(obj.timer);
				obj.timer = setInterval(function(){
					var isStop = true;
					for(var attr in json){
						var iCur = 0;
						//判断运动的是不是透明度值
						if(attr=="opacity"){
							iCur = parseInt(parseFloat(_Drag.getStyle(obj,attr))*100);
						}else{
							iCur = parseInt(_Drag.getStyle(obj,attr));
						}
						var ispeed = (json[attr]-iCur)/8;
						//运动速度如果大于0则向下取整，如果小于0想上取整；
						ispeed = ispeed>0?Math.ceil(ispeed):Math.floor(ispeed);
						//判断所有运动是否全部完成
						if(iCur!=json[attr]){
							isStop = false;
						}
						//运动开始
						if(attr=="opacity"){
							obj.style.filter = "alpha:(opacity:"+(json[attr]+ispeed)+")";
							obj.style.opacity = (json[attr]+ispeed)/100;
						}else{
							obj.style[attr] = iCur+ispeed+"px";
						}
					}
					//判断是否全部完成
					if(isStop){
						clearInterval(obj.timer);
						if(fun){
							fun();
						}
					}
				},30);
			},
			//删除本地缓存
			deleteStorag:function(){
				localStorage.removeItem("MeIndexMenus");
				localStorage.removeItem("menuPos");
				localStorage.removeItem("home_MeIndex_deleteMenuInfo");
			}
	};
	return _Drag;
});