define(['text!magicbox/addInShareUser.html','zepto', "../base/openapi", '../base/util', '../base/constant',"../base/templates/template", '../base/validate'],
	function(viewTemplate,$, OpenAPI, Util,Cons,_TU,V) {
		var timeOutEvent=0;
		return Piece.View.extend({
			id: 'magicbox_addInShareUser',
			events:{
				"touchstart #addShareSuser":   "addMyShareUsers",
				"touchstart .div-type i":   "onChoiceType",
				"touchstart #selectTimeL":   "onSelectTimeL",
				"touchstart #btnClose":   "closeWin",
				"touchstart #btnSave":   "conTime"

			},
			render: function() {
				$(this.el).html(viewTemplate);
				Piece.View.prototype.render.call(this);
				return this;
			},
			onLoadTemplate:function(){
				_TU._U.setHeader(_TU._T.magicbox_addInShareUser);//加载头部导航
				var me = this;
				var addInShareUserTemplate = $(me.el).find("#addInShareUserTemplate").html();
				var addInShareUserHtml= _.template(addInShareUserTemplate, _TU._T.magicbox_addInShareUser.data);
				$("#content").append(addInShareUserHtml);
			},
			onShowDateBox:function(){
				var beginDateSel=new Piece.VSelect({
						id : "beginTime",
						preset : "date",
					});
				var endDateSel=new Piece.VSelect({
						id : "endTime",
						preset : "date"
					});	

				$("#beginTime").change(function(){
					  var beginTime=$("#beginTime").val();
					  var endTime = $("#endTime").val();
					  if(endTime!=""&&endTime<beginTime){
						   new Piece.Toast(_TU.I18n.Common.choiceTimeError);
					       return;
					  }
					});
				$("#endTime").change(function(){
					  var beginTime=$("#beginTime").val();
					  var endTime = $("#endTime").val();
					   if(beginTime!=""&&endTime<beginTime){
						   new Piece.Toast(_TU.I18n.Common.choiceTimeError);
					       return;
					  }
					});
			},
			onShow: function() {
				this.onLoadTemplate();

				this.onShowDateBox();
				var me = this;
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
			},
			addMyShareUsers:function(){
				//添加共享设备用户
				var shareUserName = $("#shareUserName").val();
				var remarks = $("#remarks").val();
				if(shareUserName!=null && shareUserName != ""){
					var thirdPartyType="SELF";
					$(".div-type i").each(function(){
						if($(this).css('color')==_TU._T.magicbox_addInShareUser.data.checkColorRgb){
							thirdPartyType=$(this).attr("thirdPartyType");
						}
					});
					var beginTime=$("#beginTime").val();
					var endTime = $("#endTime").val();
					if(endTime<beginTime){
						new Piece.Toast(_TU.I18n.Common.choiceTimeError);
					    return;
					 }

					 if(!V.emailV($("#shareUserName"))&&!V.phoneV($("#shareUserName"))){
					 	new Piece.Toast(_TU.I18n.Common.enterAccountPrompt);
					 	return;
					 }
					 LoginDialog  =  new  Piece.Dialog({ 
					    autoshow:  false, 
					    target:  'body', 
					    title:   _TU.I18n.Common.tip, 
					    content:  _TU.I18n.Common.inShareUserConfirm
					},  { 
					    configs:  [{ 
					        title: _TU.I18n.Common.cancel, 
					        eventName:  'cancel' ,
					    },{ 
					        title:  _TU.I18n.Common.ok,
					        eventName:'ok' ,
					    },
					], 
					cancel:function()  { 
						LoginDialog.hide();
						return;
					   },
					ok:function()  { 
					        var url = OpenAPI['addMyShareUsers'];
							var data={accessToken:Piece.Store.loadObject("user_token",true).accessToken,
								 userLoginId:Piece.Store.loadObject("user_token",true).userLoginId,
									shareUserName:shareUserName,
									fromDate:beginTime,
									thruDate:endTime,
									memo:remarks,
									thirdPartyType:thirdPartyType,
									dataType:'jsonp'
								}	
							Util.Ajax(url, "GET", data,'jsonp', function(data, textStatus, jqXHR) {						
								if(data.result=="success"){
									new Piece.Toast(_TU.I18n.Common.inShareUserSuccess);
									Backbone.history.navigate("magicbox/InShareUser", {
			            					trigger: true
			            				});	
								}else{
									new Piece.Toast(_TU.I18n.Common.inShareUserFail);
								}
							}, function(e, xhr, type) {
								new Piece.Toast(_TU.I18n.Common.inShareUserFail);
							});   
					     }
					});
					
					LoginDialog.show();
				}else{
					new Piece.Toast(_TU.I18n.Common.enterAccountPrompt);
				}
			},
			onChoiceType:function(e){
				var icolor = $(e.target).css('color');				
				if(icolor==_TU._T.magicbox_addInShareUser.data.checkColorRgb){
					$(e.target).css('color','#e0e0e2');
					return false;
				}
				$(".div-type i").css('color','#e0e0e2');
				$(e.target).css('color',_TU._T.magicbox_addInShareUser.data.checkColor);
			},
			onSelectTimeL:function(){
				$(".div-time").show();
			},
			closeWin:function(){
				$(".div-time").hide();
			},
			conTime:function(){
				var beginTime = $("#beginTime").val();
				var endTime = $("#endTime").val();
				if(Util.IsNullOrEmpty(beginTime)){
					new Piece.Toast(_TU.I18n.Common.choiceBeginTime);
					return;
				}
				if(Util.IsNullOrEmpty(endTime)){
					new Piece.Toast(_TU.I18n.Common.choiceEndTime);
					return;
				}
				$("#selectTimeL").text(beginTime+"~"+endTime);
				$(".div-time").hide();
			}
		}); 

	});