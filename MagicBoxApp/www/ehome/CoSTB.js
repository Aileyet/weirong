define(['text!ehome/CoSTB.html','../base/util', '../base/socketutil',"../base/templates/template",'../base/tooltip/tooltip','../base/i18nMain'],
	function(viewTemplate,Util,SocketUtil,_TU,Tooltip,I18n) {
		var gatewayId="";
		var serial="";
		var check=null;
		var CoSTB=null;
		var study;
		return Piece.View.extend({
			id: 'ehome_CoSTB',
			events:{
				'touchstart .div-btn,#ok,#left,#right,#up,#down': 'action',
				"touchstart #study":'onStudy',
				"touchstart #save":"save"
			},
			render: function() {
				$(this.el).html(viewTemplate);

				Piece.View.prototype.render.call(this);
				return this;
			},
			onLoadTemplate:function(){
				_TU._U.setHeader(_TU._T.ehome_CoSTB);//加载头部导航
				var obj=_TU._T.ehome_CoSTB.data;
				var TemplateHtml = $(this.el).find("#ehome_CoSTB_Template").html();
				var TemplateObj = _.template(TemplateHtml, obj);
				$(".content").html("").append(TemplateObj);
			},
			onShow: function() {
				this.onLoadTemplate();
			
			
			    check=this.checkValue;
				check();
				
			 	CoSTB=Piece.Store.loadObject("CoSTB", true);//添加到本地
			    if(CoSTB==null)
			    {
					 CoSTB={power:0,mute:0,return:0,
					 up:0,down:0,right:0,left:0,ok:0,volUp:0,volDown:0};
					 Piece.Store.saveObject("CoSTB", CoSTB, true)
			    }
				 
				
				 study=Piece.Cache.get("study");
				 if(study==1){
					 $("#editTitle").attr("style","");
					 $("#controlTitle").attr("style","display:none"); 
					 $("#save").attr("style","");
					 $("#study").attr("style","display:none");
				 }
			},
			onStudy:function(e){
				var tooltip = new Tooltip();
				tooltip.setCovering(0);
				tooltip.show("ehome/CoSTB");
			},
			action:function(obj){
			     var id='';
				 var order='';
				 if(obj!=null&&obj!='undefined')
					id=obj.srcElement.id==""?obj.srcElement.parentElement.id:obj.srcElement.id;
				study=Piece.Cache.get("study");
				 if(study==1){
					  SocketUtil.StudyKey("STB0",id);
					  Piece.Cache.put("study-key",id);  
					  Piece.Cache.put("study-module","STB0");
					  Backbone.history.navigate("ehome/SeRemoteCopy", {
						 trigger: true
					 });
				 }
				 else{
					 this.setSTB(id);
				 }
			},
			save:function(){
				     $("#editTitle").attr("style","display:none");
					 $("#controlTitle").attr("style",""); 
					 $("#save").attr("style","display:none");
					 $("#study").attr("style","");
					 Piece.Cache.put("study",0);
			},
			checkValue:function()
			{
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
			setSTB:function(id){
				switch(id)
				{
					case "power":
					{
						 if(CoSTB.power==0){
							CoSTB.power=1;
						}
						else
						{  
					        CoSTB.power=0;
						}
					    SocketUtil.SeCoSTBPower();
						break;
					}
					case "mute":
					{ 
					    if(CoSTB.mute==0){
							CoSTB.mute=1;
						}
						else
						{  
					        CoSTB.mute=0;
						}
				        SocketUtil.SeCoSTBMute();
						break;
					}
					case "return":
					{ 	
 					    SocketUtil.SeCoSTBReturn();
						break;
					}
					case "up":
					{ 	
 					    SocketUtil.SeCoSTBUp();
						break;
					}
					case "down":
					{ 	
 					    SocketUtil.SeCoSTBDown();
						break;
					}
					case "right":
					{ 	
 					    SocketUtil.SeCoSTBRight();
						break;
					}
					case "left":
					{ 	
 					    SocketUtil.SeCoSTBLeft();
						break;
					}
					case "ok":
					{ 	
 					    SocketUtil.SeCoSTBOK();
						break;
					}
					case "volUp":
					{ 	
 					    SocketUtil.SeCoSTBVolUp();
						break;
					}
					case "volDown":
					{ 	
  					    SocketUtil.SeCoSTBVolDown();	
						break;
					}
					default:"";
				}
				 Piece.Store.saveObject("CoSTB", CoSTB, true);
			},
		}); 

	});