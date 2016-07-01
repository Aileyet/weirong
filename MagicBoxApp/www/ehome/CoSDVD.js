define(['text!ehome/CoSDVD.html','../base/socketutil','../base/tooltip/tooltip',"../base/templates/template",'../base/util','../base/i18nMain'],
	function(viewTemplate,SocketUtil,Tooltip,_TU,Util,I18n) {
		var gatewayId="";
		var serial="";
		var check=null;
		var CoDVD=null;
		var study;
		return Piece.View.extend({
			id: 'ehome_CoSDVD',
			events:{
				'touchstart .div-btn,.b-flex,#forware,#up,#reverse,#down,#play,.div-slider': 'action',
				"touchstart #study":'onStudy',
				"touchstart #save":"save"
			},
			render: function() {
				$(this.el).html(viewTemplate);

				Piece.View.prototype.render.call(this);
				return this;
			},
			onLoadTemplate:function(){
				_TU._U.setHeader(_TU._T.ehome_CoSDVD);//加载头部导航
				var obj=_TU._T.ehome_CoSDVD.data;
				var TemplateHtml = $(this.el).find("#ehome_CoSDVD_Template").html();
				var TemplateObj = _.template(TemplateHtml, obj);
				$(".content").html("").append(TemplateObj);
			},
			onShow: function() {
				this.onLoadTemplate();
				this.loadView();//初始页面，对页面样式的调整
				$(".div-slider").bind("tap",function(){//开关
						if($(this).find("div").css("float")=="left"){
							$(this).parent().find(".view-box i").css("color",_TU._T.Color.barColor);
							$(this).css("backgroundColor",_TU._T.Color.checkbarColor);
							$(this).find("div").css("float","right");
							//打开
							 CoDVD.open=1;
							 SocketUtil.SeCoDVDOpen();
						}
						else{
							$(this).parent().find(".view-box i").css("color",_TU._T.Color.checkbarColor);
							$(this).css("backgroundColor",_TU._T.Color.barColor);
							$(this).find("div").css("float","left");
							//关闭
							 CoDVD.open=0;
							 SocketUtil.SeCoDVDOpen();
						}
						Piece.Store.saveObject("CoDVD", CoDVD, true);
				});
				
				
				this.checkValue();
				
				CoDVD=Piece.Store.loadObject("CoDVD", true);//添加到本地
				if(CoDVD==null)
				{
					CoDVD={power:0,mute:0,open:0,play:0};
					Piece.Store.saveObject("CoDVD", CoDVD, true)
				}
			
			     study=Piece.Cache.get("study");
				 if(study==1){
					 $("#editTitle").attr("style","");
					 $("#controlTitle").attr("style","display:none"); 
					 $("#save").attr("style","");
					 $("#study").attr("style","display:none");
				 }
				 
				//后续注释
				// viewInitFun=this.viewInit;
				// viewInitFun();
			},
			onStudy:function(e){
				var tooltip = new Tooltip();
				tooltip.show("ehome/CoSDVD");
			},
			action:function(obj){
				var order='';
				var id=obj.currentTarget.id;
				 study=Piece.Cache.get("study");
				 if(study==1){
					  SocketUtil.StudyKey("DVD0",id);
					  Piece.Cache.put("study-key",id);  
					  Piece.Cache.put("study-module","DVD0");
					  Backbone.history.navigate("ehome/SeRemoteCopy", {trigger: true});
				 }
				 else{
					 this.setDVD(id);
				 }
			},
			save:function(){
				     $("#editTitle").attr("style","display:none");
					 $("#controlTitle").attr("style",""); 
					 $("#save").attr("style","display:none");
					 $("#study").attr("style","");
					 Piece.Cache.put("study",0);
			},
			loadView:function(){
				var centerVH = $(".center-view").height()-20;
				var childDivH0 = $(".center-view>div").eq(0).height();
				var childDivH1 = $(".center-view>div").eq(1).height();
				var childDivH2 = $(".center-view>div").eq(2).height();
				
				if(centerVH - childDivH0 > 0){
					$(".center-view>div").eq(0).css("margin-top",(centerVH - childDivH0)/2+"px");
					$(".center-view>div").eq(2).css("margin-top",(centerVH - childDivH0)/2+"px");
				}
				if(centerVH - childDivH1 > 0){
					$(".center-view>div").eq(1).css("margin-top",(centerVH - childDivH1)/2+"px");
				}
				
			},
			checkValue:function(){
                    gatewayId=Piece.Cache.get("gatewayId");	
					 if(gatewayId==null||gatewayId=="")
					 {
						 new Piece.Toast(I18n.Common.noMagicBoxError);
						 return;
			    	 }
					  serial=Piece.Cache.get("serial");	
					  if(serial==null||serial=="")
				     {
						 new Piece.Toast(I18n.Common.noDeviceSeriError);
						 return;
			         }
					var currentDevice= Util.getCurrentDevice(gatewayId,serial);
					if(currentDevice!=null){
						$('#controlTitle').html(currentDevice.name);
					}
			},
			setDVD:function(id){
				switch(id)
				{
					case "power":
					{
						if(CoDVD.power==0){
							CoDVD.power=1;
						}
						else
						{  
					        CoDVD.power=0;
						}
					    SocketUtil.SeCoDVDPower();
						break;
					}
					case "mute":
					{ 	
					   if(CoDVD.mute==0){
							CoDVD.mute=1;
						}
						else
						{  
					        CoDVD.mute=0;
						}
 					    SocketUtil.SeCoDVDMute();
						break;
					}
					case "play":
					{ 
					   if(CoDVD.play==0){
						    $(".chassis").html('<i class="icon iconfont">'+_TU._T.ehome_CoSDVD.data.stop_icon+'</i>');
							CoDVD.play=1;
							SocketUtil.SeCoDVDPlay();
						}
						else
						{   $(".chassis").html('<i class="icon iconfont">'+_TU._T.ehome_CoSDVD.data.play_icon+'</i>');
					        CoDVD.play=0;
							SocketUtil.SeCoDVDPause();
						}
						break;
					}
					case "previous":
					{ 	
 					    SocketUtil.SeCoDVDPrevious();
						break;
					}
					case "next":
					{ 	
 					    SocketUtil.SeCoDVDNext();
						break;
					}
					case "reverse":
					{ 	
 					    SocketUtil.SeCoDVDReverse();
						break;
					}
					case "forware":
					{ 	
 					    SocketUtil.SeCoDVDForware();
						break;
					}
					case "up":
					{ 	
 					    SocketUtil.SeCoDVDUp();
						break;
					}
					case "down":
					{ 	
 					    SocketUtil.SeCoDVDDown();
						break;
					}
					case "ok":
					{ 	
 					    SocketUtil.SeCoDVDOk();
						break;
					}
					case "return":
					{ 	
 					    SocketUtil.SeCoDVDReturn();
						break;
					}
					case "menu":
					{ 	
 					    SocketUtil.SeCoDVDMenu();
						break;
					}
					default:"";
				}
				Piece.Store.saveObject("CoDVD", CoDVD, true)
			},
		}); 

	});