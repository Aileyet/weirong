define(['text!home/MeFuncSet.html','../base/templates/template','../base/util',"../base/openapi"],
	function(viewTemplate,_TU,Util,OpenApi) {
	
	    var menus,menuPos,deleteMenuInfo;
	    var homeMenuInfos;
	    
		return Piece.View.extend({
			id: 'home_MeFuncSet',
			events:{
				"tap .get-back"              :  "onGoBackMenu",
				"tap #oneKeySetting"         :  "oneKeySettingFn"
			},
			render: function() {
				$(this.el).html(viewTemplate);
				Piece.View.prototype.render.call(this);
				return this;
			},
			onLoadTemplate:function(){
				_TU._U.setHeader(_TU._T.home_MeFuncSet);//替换头部导航
				var data = _TU._T.home_MeFuncSet.data;
				var Body_Template = $(this.el).find("#home_MeFuncSet_Body_Template").html();
				var Body_TemplateObj = _.template(Body_Template, data.body);
				$(".content").html("").append(Body_TemplateObj);
				
				
				var find=data.menus.find; //找回
				var mormalUse=data.menus.mormalUse;//正常使用
				
				
				if(deleteMenuInfo==null || Object.keys(deleteMenuInfo).length==0){//找回全部菜单
					var Menu_Template = $(this.el).find("#home_MeFuncSet_Menu_Template").html();
					$.map(menus,function(item,index){
						$.map(item.data,function(event,num){
							event.find="";
							event.mormalUse=mormalUse;
							var Menu_TemplateObj = _.template(Menu_Template, event);
							$("#Normal-use").append(Menu_TemplateObj);
						});
					});
				}else if(deleteMenuInfo!=null && Object.keys(deleteMenuInfo).length>0){
					var Menu_Template = $(this.el).find("#home_MeFuncSet_Menu_Template").html();
					$.map(menus,function(item,index){
						if(index<=8){
							if(deleteMenuInfo[item.order]==undefined){
								$.map(item.data,function(event,num){
									event.find="";
									event.mormalUse=mormalUse;
									var Menu_TemplateObj = _.template(Menu_Template, event);
									$("#Normal-use").append(Menu_TemplateObj);
								});
							}else{//删除的菜单
								$.map(item.data,function(event,num){
									event.find=find;
									event.mormalUse="";
									var Menu_TemplateObj = _.template(Menu_Template, event);
									$("#Back-menu").append(Menu_TemplateObj);
								});
							}
						}
					});
				}
			},
			onShow: function() {
				homeMenuInfos = Piece.Store.loadObject("homeMenuInfos", true);
				menus = homeMenuInfos.menus;
				menuPos = homeMenuInfos.menuPos==null || homeMenuInfos.menuPos==undefined?{}:homeMenuInfos.menuPos;
				deleteMenuInfo = homeMenuInfos.deleteMenu==null || homeMenuInfos.deleteMenu==undefined?{}:homeMenuInfos.deleteMenu;
				
				this.onLoadTemplate();
			},
			onGoBackMenu:function(e){
				var sobj = $(e.target).parent().find("span").eq(1);
				var ord=sobj.attr("order");
				
				for(var key in deleteMenuInfo){
					if(key==ord){
						delete deleteMenuInfo[key];
					}
				}
				
				menuPos[Object.keys(menuPos).length] = ord;
				
				
				var appMenu={"menus":menus,"menuPos":menuPos,"deleteMenu":deleteMenuInfo};
				
				this.saveMenuToService(appMenu);
			},
			//保存菜单信息到服务器
			saveMenuToService:function(jsonObj){
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
					var me=this;
					Util.AjaxWait(OpenApi.addAppMenu,
						"GET", 
						{"access_token":access_token,"appForm.userLoginId":loginId,"appForm.menuLevel":"1","appForm.menuKey":"HOME","appForm.jsonMenu":JSON.stringify(jsonObj).split("\"").join("'"),"dataType": 'jsonp'}, 
						'jsonp',
						function(data, textStatus, jqXHR){
							if(data.result=="success"){
								new Piece.Toast("找回菜单成功！");
								me.onLoadTemplate();
							}
						},function(e, xhr, type) {
							new Piece.Toast("找回菜单失败...");
							
							menus = homeMenuInfos.menus;
							menuPos = homeMenuInfos.menuPos==null || homeMenuInfos.menuPos==undefined?{}:homeMenuInfos.menuPos;
							deleteMenuInfo = homeMenuInfos.deleteMenu==null || homeMenuInfos.deleteMenu==undefined?{}:homeMenuInfos.deleteMenu;
							
							me.onLoadTemplate();
						}
					);
				}
			},
			oneKeySettingFn:function(){
				Backbone.history.navigate("home/OneKeyConfig", {
            		trigger: true
            	});
			}
		}); //view define

	});