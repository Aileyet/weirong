define(['text!scene/CoStageSet.html','zepto','../base/util','../base/socketutil','../base/login/login',"../base/templates/template"],
	function(viewTemplate,$,Util,SocketUtil,Login,_TU) {
		var login = new Login();
		var magicList=new Array();
		var modesList;
		return Piece.View.extend({
			id: 'magicbox_CoStageSet',
			events:{
				"touchstart .opera":"operation",
				"touchstart .div-box-add":"CoChoice",
			},
			onLoadTemplate:function(){
				_TU._U.setHeader(_TU._T.CoStageSet);
				for(var i=0;i<_TU._T.CoStageSet.data.menus.length;i++){
						var userInfoTemplate = $(this.el).find("#stage_inf").html();
						var userInfoHtml = _.template(userInfoTemplate, _TU._T.CoStageSet.data.menus[i]);
						$(".list").append(userInfoHtml);
				}
				
			},
			render: function() {
				$(this.el).html(viewTemplate);
				Piece.View.prototype.render.call(this);
				return this;
			},
			onShow: function() {
				 this.onLoadTemplate();//加载配置模板
				 
				 _TU._U.goBack(function(){
					Backbone.history.navigate('home/MeIndex', {trigger: true});
				 });
				 
				 // LoginDialog  =  new  Piece.Dialog({ 
					//     autoshow:  false, 
					//     target:  'body', 
					//     title:  '提示', 
					//     content:  '亲！您需要登陆后才能操作~' 
					// },  { 
					//     configs:  [{ 
					//         title:  "取消", 
					//         eventName:  'cancel' ,
					//     },{ 
					//         title:  "确定", 
					//         eventName:'ok' ,
					//     },
					// ], 
					// cancel:function()  { 
					//              LoginDialog.hide(); 
					// 			 Backbone.history.navigate('home/MeIndex', {trigger: true});
					//         },
					// ok:function()  { 
					//              login.show();
					//         }
					// });
					
		   //     	 var checkLogin = Util.checkLogin()
				 // if(checkLogin === false || Piece.TempStage.loginId() == null){
					//  LoginDialog.show();
					//  return;
			  //     }
				  
				  //清空临时存储
				  Piece.Cache.put("modeIndex",null);
				  Piece.Cache.put("operation-type",null);
				  Piece.Store.saveObject("tempMode", null, true);	
				  Piece.Store.saveObject("deviceTempList", null, true);	
				
				//加载魔方列表
				magicList=Piece.Store.loadObject("magicList", true);
				//加载列表
				modesList=Piece.Store.loadObject("modesList",true);
				if(modesList==null)
					modesList=new Array();
				
				for(var i=0;i<modesList.length;i++)
				{
					var StartFont='',StartIcon='';
					if(modesList[i].isFixed==0){
						var img=Util.IsNullOrEmpty(modesList[i].img)?"&#xe637;":modesList[i].img;
						if(modesList[i].isStart==1){
							 StartFont='style="color:'+_TU._T.CoStageSet.data.start_color+'"';
							 StartIcon='<div class="choosedA"><i class="icon iconfont" style="font-size: 20px;color:'+_TU._T.CoStageSet.data.start_color+'">'+_TU._T.CoStageSet.data.start_icon+'</i></div>';
						}
						$(".list").append('<div class="main-box"><div class="'+_TU._T.CoStageSet.data.div_style+'" ><div draggable="true" class="view-box" data-type='+modesList[i].calType+' data-index="'+modesList[i].modeIndex+'" ><i class="icon iconfont" '+StartFont+'>'+img+'</i><div class="'+_TU._T.CoStageSet.data.name_style+'" '+StartFont+'>'+modesList[i].modeName+'</div>'+StartIcon+'</div></div><div class="choosed"><i class="icon iconfont">'+_TU._T.CoStageSet.data.delete_icon+'</i></div></div>');
					}
				}
				$(".list").append('<div class="main-box"><div class='+_TU._T.CoStageSet.data.add_div_style+'><div draggable="true" class="view-box" data-type="" data-index="" style="top: 52.5px; left: 79.4375px;"><i class="icon iconfont">'+_TU._T.CoStageSet.data.add_icon+'</i><div class="">'+_TU._T.CoStageSet.data.add_name+'</div></div></div></div>');
				
				//场景模式ID初始化
				Util.GetUnUseQJModeIndex();
				//右上角下拉菜单
				this.onMenuFn();
				
				var wid=$(".div-box").width();
				var hei=$(".div-box").height();
				
				
				$(".view-box").each(function(ev,ex){
					var _this=$(ex);
					var ewid=_this.width();
					var ehei=_this.height();
					var t = _this.position().top+(hei-ehei)/2;
					var l = _this.position().left+(wid-ewid)/2;
					_this.css({
						"top": t+'px',
						"left": l+'px'
					});
				});
				

				this.onEHomeMenuFn();
				this.deleteMenu();//删除菜单
				$(".div-box-add").addClass("menuDivColor").find("div").addClass("fontColor");
			},
			onEHomeMenuFn:function(e){
				$(".div-box").on({
			        touchend: function(e){
						var obj=$(e.target).find(".view-box").length==0?$(e.target).parent().find(".view-box"):$(e.target).find(".view-box");
						var calType  =obj.attr("data-type");//模式类型，离家3回家4
						var modeIndex=obj.attr("data-index");
					    var type=Piece.Cache.get("operation-type");
						//启动
						if(type=="start"){
							//修改样式	
							var i=$(e.target).find("i");
							i.attr("style","color:"+_TU._T.CoStageSet.data.start_color);
							var obj=$(e.target).find("."+_TU._T.CoStageSet.data.name_style);
							if(obj.find(".choosedA").length==0){
							   obj.attr("style","color:"+_TU._T.CoStageSet.data.start_color);
							   obj.append('<div class="choosedA"><i class="icon iconfont" style="font-size: 20px;color:'+_TU._T.CoStageSet.data.start_color+'">'+_TU._T.CoStageSet.data.start_icon+'</i></div>');
							}
							
							//发命令
							var cmds=Piece.Store.loadObject("ModeCmds", true);
							if(cmds!=null){
								for(var i=0;i<cmds.length;i++)
								{
									if(cmds[i].modeIndex==modeIndex){
										if(cmds[i].groupIds.length>0){//启用该模式下原来存在的日程
											for(var j=0;j<cmds[i].groupIds.length;j++){
												SocketUtil.QJStartMode(magicList[cmds[i].gateIndex].gatewayId,cmds[i].groupIds[j]);
											}
										}
									}
								}
							}
							
							for(var i=0;i<modesList.length;i++){
								if(modeIndex==modesList[i].modeIndex){
									modesList[i].isStart=1;
								    Piece.Store.saveObject("modesList", modesList, true);
									break;
								}
				            }
						}
						//关闭
						else if(type=="end"){
							//修改样式
							$(e.target).find("i").attr("style","");
							$(e.target).find("."+_TU._T.CoStageSet.data.name_style).attr("style","");
							var obj=$(e.target).find(".choosedA");
							obj.html("");
							obj.attr("class","");
							//发命令
							var cmds=Piece.Store.loadObject("ModeCmds", true);
							if(cmds!=null){
								for(var i=0;i<cmds.length;i++)
								{
									if(cmds[i].modeIndex==modeIndex){
										if(cmds[i].groupIds.length>0){//启用该模式下原来存在的日程
											for(var j=0;j<cmds[i].groupIds.length;j++){
												SocketUtil.QJEndMode(magicList[cmds[i].gateIndex].gatewayId,cmds[i].groupIds[j]);
											}
										}
									}
								}
							}
							for(var i=0;i<modesList.length;i++){
								if(modeIndex==modesList[i].modeIndex){
									modesList[i].isStart=0;
								    Piece.Store.saveObject("modesList", modesList, true);
									break;
								}
				            }
						}
						//修改
						else if(type=="edit"){
							  if(calType!=""&&calType!=undefined){
							   Piece.Cache.put("calType",calType);
							   Piece.Cache.put("modeIndex",modeIndex);
						    }
							Backbone.history.navigate("scene/CoSchedule?"+"prePage=scene/CoStageSet", {trigger: true});
						}
			        }
			    })
			},
			onMenuFn:function(){
				$(".nav-wrap-right a").on("tap",function(e){
					$(e.target).parent().find("ul").toggleClass("disp");
					e.stopPropagation();
				});
				
				$(document).ready(function(){
			        $("*").on("tap",function (event) {
			            if (!$(this).hasClass("react")){
			                $(".nav-wrap-right ul").removeClass("disp");
			            }
			           // event.stopPropagation(); //阻止事件冒泡    
			        });
			    });
			},
			operation:function(e){
				var type=$(e.target).attr("data-type");
				if(type!="")
					Piece.Cache.put("operation-type",type);
			},
			deleteMenu:function(){
				$(".nav-wrap-right li").on("tap",function(e){
					if($(e.target).attr("data-type")=="delete"){
						$(".choosed").css("display","block");
					}
					else
					{
						$(".choosed").css("display","none");
					}
				});
				$(".choosed").on("tap",function(e){
					       // 离家回家不能删除
							if(modeIndex=="60"||modeIndex=="61"||modeIndex=="62")
							{
								new Piece.Toast("该模式不可删除");
								return;
							}
							//页面删除
						   var modeIndex=$(e.target).parents(".main-box").find(".view-box").attr("data-index");
						   $(e.target).parents(".main-box").remove();
							//删除该模式命令
							var cmds=Piece.Store.loadObject("ModeCmds", true);
							if(cmds!=null){
								for(var i=0;i<cmds.length;i++)
								{
									if(cmds[i].modeIndex==modeIndex){
										if(cmds[i].groupIds.length>0){//删除该模式下原来存在的日程
											for(var j=0;j<cmds[i].groupIds.length;j++){
												SocketUtil.QJDeleteMode(magicList[cmds[i].gateIndex].gatewayId,cmds[i].groupIds[j]);
											}
										}
										cmds.splice(i,1);//本地删除该模式
									}
								}
							}
							Piece.Store.saveObject("ModeCmds", cmds, true);
							//删除该模式
							for(var i=0;i<modesList.length;i++)
				            {
								if(modeIndex==modesList[i].modeIndex){
									modesList.splice(i,1)
									break;
								}
				            }
							Piece.Store.saveObject("modesList", modesList, true);
							//重置删除编号为可用
							var array=Piece.Store.loadObject("QJModeIndexArray", true);
							  for(var i=0;i<array.length;i++){
								  if(array[i].index==modeIndex)
								  {
									  array[i].isUse=0;
									  break;
								  }
							} 
							Piece.Store.saveObject("QJModeIndexArray", array,true);
							//删除该模式下的设备
						    var deviceExistHomeList=Piece.Store.loadObject("deviceExistHomeList", true);
					        for(var j=0;j<deviceExistHomeList.length;j++){//已经添加到离家列表的设备不再出现在弹出框中
								if(modeIndex==deviceExistHomeList[j].modeIndex) {
									  deviceExistHomeList.splice(j,1);
								   }
				            }
				            Piece.Store.saveObject("deviceExistHomeList", deviceExistHomeList,true);
				});
			},
		    CoChoice:function(e){
				        var obj=$(e.target).find(".view-box").length==0?$(e.target).parent().find(".view-box"):$(e.target).find(".view-box");
						var module=obj.attr("data-module");
			            var view  =obj.attr("data-view");
						Backbone.history.navigate("scene/CoChoice", {
			            		trigger: true
			            	});
			}
		}); //view define

	});