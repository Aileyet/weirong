define(['zepto', "../../base/openapi",'../../base/util',"../../base/templates/template"], function ($, OpenAPI,Util,_TU) {
	
	 var homeMenuInfos;
	 var eHomeMenuInfos;
	
	 var MenuUtil = {
		 /*
		 * 保存首页菜单信息到缓存 
		 */
		savaHomeMenuToPieceStore:function(){
			Piece.Store.saveObject("homeMenuInfos", homeMenuInfos, true);
		},
		/*
		 * 保存设备菜单信息到缓存 
		 */
		savaEhomeMenuToPieceStore:function(){
			Piece.Store.saveObject("eHomeMenuInfos", eHomeMenuInfos, true);
		},
		/*
		 * 从服务器上获取用户菜单数据 
		 */
		readMenuFromService:function(fun){
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
									homeMenuInfos = appMenu;
									MenuUtil.savaHomeMenuToPieceStore();
								}else if(appMenu.menus!=null && appMenu.menus!=undefined && appMenu.menus.length>0 &&
										appMenu.deleteMenu !=null && appMenu.deleteMenu!=undefined && Object.keys(appMenu.deleteMenu).length>0){
									homeMenuInfos = appMenu;
									MenuUtil.savaHomeMenuToPieceStore();
								}
							}else if(item.menuKey=="Ehome" && item.menuLevel=="2"){//设备列表
								var appMenu = item.jsonMenu;
								appMenu=JSON.parse(appMenu.split("'").join("\""));
								eHomeMenuInfos = appMenu;
								MenuUtil.savaEhomeMenuToPieceStore();
							}
						});
						fun();
					}else{
						fun();
					}
				},function(e, xhr, type) {
					fun();
					new Piece.Toast("读取菜单数据失败...");
				}
			);
		},
		/*
		 * 保存菜单数据到服务器
		 */
		saveMenuToService:function(jsonObj,menuLevel,menuKey){
			var user_token=Piece.Store.loadObject("user_token", true);
			if(user_token==null){
				//判断是否登录
				var checkLogin = Util.checkLogin();
			    if(checkLogin === false || Piece.TempStage.loginId() == null){
			    	Backbone.history.navigate("home/InUserInfoL", {
	            		trigger: true
	            	});
			    	return;
			    }
			}else{
				var access_token=user_token.accessToken;
				var loginId=Piece.Store.loadObject("loginId", true);
				Util.AjaxWait(OpenAPI.addAppMenu,
					"GET", 
					{"access_token":access_token,"appForm.userLoginId":loginId,"appForm.menuLevel":menuLevel,"appForm.menuKey":menuKey,"appForm.jsonMenu":JSON.stringify(jsonObj).split("\"").join("'"),"dataType": 'jsonp'}, 
					'jsonp',
					function(data, textStatus, jqXHR){
						if(data.result=="success"){
							new Piece.Toast("保存菜单数据成功！");
							
							if(menuKey == "HOME"){
								homeMenuInfos = jsonObj;
								MenuUtil.savaHomeMenuToPieceStore();
							}else if(menuKey == "Ehome"){
								eHomeMenuInfos = jsonObj;
								MenuUtil.savaEhomeMenuToPieceStore();
							}
						}
					},function(e, xhr, type) {
						new Piece.Toast("保存菜单数据失败...");
					}
				);
			}
		},
		/*
		 * 添加首页菜单默认的菜单数据 
		 */
		setHomeDefaultMenu:function(){
			var titles = _TU._T.home_MeIndex.data.menus_1;
			homeMenuInfos = {};
			var menus = new Array();
			$.map(titles, function(item, index){ 
				menus[index]={
				   title:item.name,
			       order:index,
			       type:"menu",
		    	   data:[
		    	       {
		    	    	   title:item.name,
		    	    	   icon:item.icon,
		    	    	   order:index,
		    	    	   style:"menu-icon",
		    	    	   bgcolor:item.bgcolor,
		    	    	   font:"i-font",
		    	    	   module:item.data_module,
		    	    	   view:item.data_view
		    	       }
		    	   ]	
				}
			});
			homeMenuInfos["menus"] = menus;
			MenuUtil.savaHomeMenuToPieceStore();
		}	 
	 };
	 return MenuUtil;
});