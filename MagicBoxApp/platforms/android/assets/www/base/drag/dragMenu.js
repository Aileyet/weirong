define(['zepto','../../base/util','../../base/openapi','../../base/tooltip/tooltip','../../base/drag/menuStoreUtil',"../../base/templates/template"], function($,Util,OpenApi,Tooltip,MenuUtil,_TU) {
	var oUl,aLi;
	var aPos,menuPos,menus;
	var minZindex = 1,isMoving=false;
	var _this,page;
	var tooltip = new Tooltip();
	
	var _Drag={
		equipLists:null,
		//程序入口
		onLoad:function(menuInfo,me,equipList){
			if(equipList instanceof Array){//是数组,设备数据
				if(!(equipList!=null && equipList!=undefined && equipList.length>0)){
					return;
				}else{
					_Drag.equipLists=equipList;
				}
			}else{//是对象,魔方数据
				if(!(equipList!=null && equipList!=undefined)){
					return;
				}else{
					if(_Drag.equipLists==null || _Drag.equipLists==undefined){
						_Drag.equipLists=new Array();
					}
					_Drag.equipLists[_Drag.equipLists.length] = equipList;
				}
			}
			page = Util.getQueryStringByName("prePage");
			_this = me;
			isMoving=false;//默认不能拖拽
			if(menuInfo!=null){
				menus = menuInfo.menus;
				menuPos = menuInfo.menuPos;
			}
	
			$("#equipList").html("");
			if(menuPos==null || menuPos==undefined){
				$.map(menus,function(item,index){
					if(item.type=="menu"){
						$.map(item.data,function(obj,n){
							var _isvd = _Drag.isViewDevice(obj);
							if(_isvd.bool){
								$("<div>").html('<div class="my-E-home-cell" type="menu" order="'+obj.order+'"><div class="inner-border"><a class="equip" data-serial="'+obj.serial+'" data-device="'+obj.device+'" data-gatewayId="'+obj.gatewayId+'"><i class="icon iconfont" style="font-size: 32px;">'+_isvd.icon+'</i><span class="my-E-home-name">'+ item.title+'</span></a></div></div>')/*.bind("touchstart",function(){tdate=new Date();}).bind("touchend",function(){var tsec=new Date()-tdate; if(tsec>1000){editFun($(this))}else{detailFun($(this))};;})*/.appendTo("#equipList");
							}
						});
					}else if(item.type=="folder"){
						var htmlObj = $("<div>").html('<div class="my-E-home-cell" type="folder" order="'+item.order+'"><div style="overflow: hidden;"></div><div class="my-E-home-name-small">'+menu.title+'</div></div>');
						var bool=false;
						$.map(item.data,function(obj,n){
							var _isvd = _Drag.isViewDevice(obj);
							if(_isvd.bool){
								bool=true;
								htmlObj.find(".my-E-home-cell div").eq(0).append('<div class="inner-border-small"><i class="icon iconfont icon-small">'+_isvd.icon+'</i></div>');
							}
						});
						if(bool){
							$("#equipList").append(htmlObj);
						}
					}
				});
			}else{
				for(var key in menuPos){
					var menu = _Drag.getMenuByOrder(menuPos[key]);
					if(menu.type=="menu"){
						$.map(menu.data,function(obj,n){
							var _isvd = _Drag.isViewDevice(obj);
							if(_isvd.bool){
								$("<div>").html('<div class="my-E-home-cell" type="menu" order="'+obj.order+'"><div class="inner-border"><a class="equip" data-serial="'+obj.serial+'" data-device="'+obj.device+'" data-gatewayId="'+obj.gatewayId+'"><i class="icon iconfont" style="font-size: 32px;">'+_isvd.icon+'</i><span class="my-E-home-name">'+ menu.title+'</span></a></div></div>')/*.bind("touchstart",function(){tdate=new Date();}).bind("touchend",function(){var tsec=new Date()-tdate; if(tsec>1000){editFun($(this))}else{detailFun($(this))};;})*/.appendTo("#equipList");
							}
						});
					}else if(menu.type=="folder"){
						var htmlObj = $("<div>").html('<div class="my-E-home-cell" type="folder" order="'+menu.order+'"><div style="overflow: hidden;"></div><div class="my-E-home-name-small">'+menu.title+'</div></div>');
						var bool=false;
						$.map(menu.data,function(obj,n){
							var _isvd = _Drag.isViewDevice(obj);
							if(_isvd.bool){
								bool=true;
								htmlObj.find(".my-E-home-cell div").eq(0).append('<div class="inner-border-small"><i class="icon iconfont icon-small">'+_isvd.icon+'</i></div>');
							}
						});
						if(bool){
							$("#equipList").append(htmlObj);
						}
					}
				}
			}
			
			oUl = $("#equipList");
			var myEH = oUl.find(".my-E-home-cell[type='menu']").height();
			if(myEH==null || myEH==undefined){myEH=92;}
			aLi = oUl.find(".my-E-home-cell");
			aLi.css("height",myEH+"px");
			_Drag.initView();
		},
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
				var ord = $(aLi[i]).attr("order");
				aLi[i].order = ord;
				menuPos[i] = ord;
			}
			for(var i=0;i<aLi.length;i++){
				aLi[i].style.position = "absolute";
				aLi[i].style.margin = 0;
				
				_Drag.setDindEvent(aLi[i]);
				_Drag.setDrag(aLi[i]);
			}
		},
		//绑定事件
		setDindEvent:function(event){
			
			if($(event).find('.inner-border').length>0){
				$(event).find('.inner-border').css("pointer-events","none").children().css("pointer-events","none");
			}else{
				$(event).children().css("pointer-events","none");
			}
			
			$(event).on("touchstart",function(e){
				if(!isMoving){
					_Drag.start(e);
					$(document).on("touchend",function(){
						_Drag.stop(e);
					});
				}
			});
			
			
			$(event).on("tap",function(e){
				var pas = $(e.target);
				if(pas.attr("type")=="menu"){
					_this.detail(e.target);
				}else if(pas.attr("type")=="folder"){
					tooltip.setCovering(0);
					tooltip.showMenu();
					
					//动态加载菜单
					var order = pas.attr("order");
					var menuObj = _Drag.getMenuByOrder(order);
					var datas = menuObj.data;
					tooltip.setMenu(menuObj.title,datas,order,_Drag);
					
					var mes = $(".misc-menu");
					mes.find(".menu-view").children().css("pointer-events","none");
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
					    	var tObj = $('div[class="my-E-home-cell"][order="'+order+'"] .my-E-home-name-small');
					    	var oldT = tObj.text();
					    	if(oldT != t){
					    		_Drag.getMenuByOrder(order).title=t;
					    		tObj.text(t);
					    		_Drag.saveMenuToService({menus:menus,menuPos:menuPos});//保存菜单到服务器
					    	}
					    }
					});
				}				
				return false;
			});
			
		},
		start : function (dom){
	        dom.index = dom.index >= 0 ? dom.index + 1 : 0;
	        if (dom.index > 1 && dom.index < 3)
	        {
	            clearTimeout (dom.timer);
	            isMoving=true;//可以拖拽
	            $(".my-E-home-cell").addClass("my-E-home-cell-moveBg");
	            
		        //点击空白处关闭弹出菜单
				$(document).on("tap",function(e){
					e.stopPropagation(); //阻止事件冒泡    
				    var _con = $('.my-E-home-cell');   // 设置目标区域
				    if(!$(this).hasClass("my-E-home-cell") && _con.has(e.target).length === 0 ){ // Mark 1
				    	isMoving=false;//可以拖拽
				    	_con.removeClass("my-E-home-cell-moveBg");
				    }
				});
	            
	        }else if(dom.index > 3){
	            dom.index = 0;
	            clearTimeout (dom.timer);
	            $('.my-E-home-cell').removeClass("my-E-home-cell-moveBg");
	            isMoving=false;//可以拖拽
	            _Drag.edit($(dom.target));
	            return;
	        }
	        dom.timer = setTimeout (function ()
	        {
	            _Drag.start (dom);
	        }, 500);
	    },
	     
	    stop : function (dom){
	        delete dom.index; 
	        clearTimeout (dom.timer);
	    },
		//拖拽
		setDrag:function(obj){
			$(obj).on("touchstart", function(event){
				if(!isMoving){//判断是否可以拖拽
					return;
				}
				
				var scrollTop = document.documentElement.scrollTop||document.body.scrollTop;
				var scrollLeft = document.documentElement.scrollLeft||document.body.scrollLeft;
				obj.style.zIndex = minZindex++;
				//当鼠标按下时计算鼠标与拖拽对象的距离
				disX = event.touches[0].clientX +scrollLeft-obj.offsetLeft;
				disY = event.touches[0].clientY +scrollTop-obj.offsetTop;
				
				var width2 = obj.offsetWidth/2;
				var menuObj = _Drag.getMenuByOrder($(obj).attr("order"));
				$(document).on("touchmove",function(event){
					//当鼠标拖动时计算div的位置
					var l = event.touches[0].clientX -disX +scrollLeft;
					var t = event.touches[0].clientY -disY + scrollTop;
					obj.style.left = l + "px";
					obj.style.top = t + "px";
					for(var i=0;i<aLi.length;i++){
						$(aLi[i]).removeClass("active");
						$(aLi[i]).removeClass("polymerization");
					}
					
					var oNear = _Drag.findMin(obj);
					if(oNear.obj && (oNear.dis>width2 || menuObj.type=="folder")){
						$(oNear.obj).addClass("active");
					}else if(oNear.obj){
						$(oNear.obj).addClass("polymerization");
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
					var oNear = _Drag.findMin(obj);
					if(oNear.obj && (oNear.dis>width2 || menuObj.type=="folder")){
						//交换位置
						$(oNear.obj).removeClass("active");
						oNear.obj.style.zIndex = minZindex++;
						obj.style.zIndex = minZindex++;
						_Drag.startMove(oNear.obj,aPos[obj.index]);
						_Drag.startMove(obj,aPos[oNear.obj.index]);
						//交换index
						oNear.obj.index += obj.index;
						obj.index = oNear.obj.index - obj.index;
						oNear.obj.index = oNear.obj.index - obj.index;
						//交换菜单下标位置
						var odr = oNear.obj.order;
						menuPos[oNear.obj.index] = odr;
						menuPos[obj.index] = obj.order;
						
						_Drag.saveMenuToService({menus:menus,menuPos:menuPos});
					}else if(oNear.obj){
						$(oNear.obj).removeClass("polymerization");
						
						var dialog  =  new  Piece.Dialog({ 
							    autoshow:  false, 
							    target:  'body', 
							    title:  "提示", 
							    content:  '是否组合为一个菜单?' 
							},{ 
							configs:  [
							    { 
							        title:  "取消", 
							        eventName:  'cancle' 
							    },{ 
							        title:  "确定", 
							        eventName:  'sure' 
							    }
							], 
							sure:  function()  { 
								_Drag.setGroupMenu(obj,oNear.obj);
							},
							cancle:  function(){
								//回到原来位置
								_Drag.startMove(obj,aPos[obj.index]);
							}
						});
						
						dialog.show();
						_Drag.setDialogCss();
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
						tooltip.hideMenu(); // 隐藏弹出菜单
						_this.detail(e.target);
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
						_Drag.saveMenuToService({menus:menus,menuPos:menuPos});//保存菜单信息
						_Drag.onLoad(null,_this,_Drag.equipLists);
					}else{
						//回到原来位置
						_Drag.startMove(obj,aPos[obj.index]);
					}
				});
				
				clearInterval(obj.timer);
				return false;//低版本出现禁止符号
			});
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
        //保存菜单位置坐标
		setLocal:function(key,value){
			if(value){
				localStorage.setItem(key,JSON.stringify(value));
			}
		},
		//保存菜单位置坐标
		getLocal:function(key){
			if(localStorage.getItem(key)==null){
				return null;
			}else{
				var jsonStr = localStorage.getItem(key);
				if(typeof JSON.parse(jsonStr) === "object"){
					return JSON.parse(localStorage.getItem(key));
				}else{
					return null;
				}
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
		//多个菜单组合
		setGroupMenu:function(obj,nobj){
			//把菜单的数据进行组合
			var menuObj = _Drag.getMenuByOrder($(obj).attr("order"));
			var data1 = menuObj.data[0];
			
			var menuObjONear = _Drag.getMenuByOrder($(nobj).attr("order"));
			if(menuObjONear.type == "menu"){
				var data2 = menuObjONear.data[0];
				//创建新的菜单数据
				var mv = menus.length;
				menus[mv]={
						title:"文件夹",
						order:mv,
						type:"folder",
						data:[data2,data1]
				}
				
				for(var key in menuPos){
					if(menuPos[key] == $(nobj).attr("order")){
						menuPos[key] = mv;
					}
				}
			}else if(menuObjONear.type == "folder"){
				//把菜单的数据进行组合
				
				var data2 = menuObjONear.data;
				data2[data2.length] = data1;
			}
			
			//把合并的菜单删除，并把它之后的菜单向前移动一个位置
			delete menuPos[obj.index];  
			$(obj).parent().remove();
			$(nobj).parent().remove();
			_Drag.saveMenuToService({menus:menus,menuPos:menuPos});
			//重新加载菜单的位置坐标
			_Drag.onLoad(null,_this,_Drag.equipLists);
		},
		//保存菜单信息到服务器
		saveMenuToService:function(jsonObj){
			MenuUtil.saveMenuToService(jsonObj,2,"Ehome");
		},
		//编辑
		edit:function(even){
			_this.edit(even);
		},
		//删除设备
		deleteMenu:function(serial,gatewayId,device){
			$.map(menus,function(item,index){
				if(item.type == "menu"){
					$.map(item.data,function(e,n){
						if(e.serial == serial && e.gatewayId == gatewayId && e.device == device){
							menus.splice(index,1);
							for(var key in menuPos){
								if(menuPos[key] == item.order){
									delete menuPos[key];
								}
							}
						}
					});
				}else if(item.type == "folder"){
					$.map(item.data,function(e,n){
						if(e.serial == serial && e.gatewayId == gatewayId && e.device == device){
							if(item.data.length>1){//数量大于1 
								item.data.splice(n,1);
								for(var key in menuPos){
									if(menuPos[key] == e.order){
										delete menuPos[key];
									}
								}
							}else{//数量等于1
								menus.splice(index,1);
								for(var key in menuPos){
									if(menuPos[key] == item.order){
										delete menuPos[key];
									}
								}
							}
						}
					});
				}
			});
			_Drag.saveMenuToService({menus:menus,menuPos:menuPos});//保存设备信息
			_Drag.onLoad(null,_this,_Drag.equipLists);
		},
		//修改设备名称
		notifyMenu:function(serial,gatewayId,device,name){
			for(var i=0;i<menus.length;i++){
				var item = menus[i];
				for(var j=0;j<item.data.length;j++){
					var e = item.data[j];
					if(e.serial == serial && e.gatewayId == gatewayId && e.device == device){
						/*
						* 设备名称和服务器上保存的设备菜单信息名称不同,
						* 需要修改服务器上保存的设备菜单信息的名称。
						*/
						if(e.title != name && item.type == "menu"){
							item.title = name;
							e.title = name;
							break;
						}else if(e.title != name && item.type == "folder"){
							e.title = name;
							break;
						}
					}
				}
			}
			_Drag.saveMenuToService({menus:menus,menuPos:menuPos});//保存设备信息
			_Drag.onLoad(null,_this,_Drag.equipLists);
		},
		/*
		 * 把服务器上的设备信息 与 魔方搜索的设备信息对比
		 * 显示魔方搜索到的设备信息
		 */
		isViewDevice:function(obj){
			var bool = false;
			var icon = "";
			if(page==""){//设备列表,显示魔方，设备
					for(var i=0;i<_Drag.equipLists.length;i++){
						if(_Drag.equipLists[i].serial==obj.serial && _Drag.equipLists[i].device==obj.device && 
								_Drag.equipLists[i].gatewayId==obj.gatewayId && (_Drag.equipLists[i].name).replace("\n","") == obj.title.replace("\n","")){
							bool=true;
							var device=Util.getDevice(obj.device)
							icon=device.img;
							break;
						}
					}
			} else if (page == "magicbox/StMBMain" || page == "magicbox/InMBSetup") {//红外设备列表或魔方设置中设备详情,显示设备
				var nid = Piece.Cache.get("gatewayId");
					for(var i=0;i<_Drag.equipLists.length;i++){
						if(_Drag.equipLists[i].serial==obj.serial && _Drag.equipLists[i].device==obj.device && 
								_Drag.equipLists[i].gatewayId==obj.gatewayId && obj.device!="MagicBox" && 
								obj.gatewayId==nid && (_Drag.equipLists[i].name).replace("\n","") == obj.title.replace("\n","")){
							bool=true;
							var device=Util.getDevice(obj.device)
							icon=device.img;
							break;
						}
					}
			}
			else if (page == "home/MeIndex") {//我的E家，不显示共享设备
			    var shareMagic = new Array();
			    for (var i = 0; i < _Drag.equipLists.length; i++) {
			        if (_Drag.equipLists[i].device == "MagicBox"&&_Drag.equipLists[i].share)
			            shareMagic[_Drag.equipLists[i].gatewayId] = 1;
			    }

			    for (var i = 0; i < _Drag.equipLists.length; i++) {
			        if (_Drag.equipLists[i].serial == obj.serial && _Drag.equipLists[i].device == obj.device &&
                            _Drag.equipLists[i].gatewayId == obj.gatewayId && shareMagic[_Drag.equipLists[i].gatewayId]!=1 &&
                            (_Drag.equipLists[i].name).replace("\n", "") == obj.title.replace("\n", "")) {
			            bool = true;
			            var device = Util.getDevice(obj.device)
			            icon = device.img;
			            break;
			        }
			    }
			}
			return {bool:bool,icon:icon};
		},
		setDialogCss:function(){
	        $(".btn").first().css("background-color",_TU._T.dialog_Style.cancelColor);
	        $(".ui-header").css("background-color",_TU._T.dialog_Style.backColor);
	        $(".btn").last().css("background-color",_TU._T.dialog_Style.backColor);
		}
	};
	
	return _Drag;
});