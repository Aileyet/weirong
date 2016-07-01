define(['text!magicbox/InShareUser.html', "../base/openapi", '../base/util',"../base/templates/template",'../base/login/login'],
	function(viewTemplate, OpenAPI, Util,_TU,Login) {
		var login = new Login();
		var LoginDialog;
		return Piece.View.extend({
			id: 'magicbox_InShareUser',
			events:{
				"touchstart #addInShareUser"    :     "onAddInShareUser",
				"touchstart .ehome-sphoto"    :     "onDelInShareUser"
			},
			onAddInShareUser:function(e){
				Backbone.history.navigate("magicbox/addInShareUser", {
            		trigger: true
            	});
			},
			render: function() {
				$(this.el).html(viewTemplate);

				Piece.View.prototype.render.call(this);
				return this;
			},
			onLoadTemplate:function(){
				_TU._U.setHeader(_TU._T.magicbox_InShareUser);//加载头部导航
				var me = this;
				var inShareUserTemplate = $(me.el).find("#inShareUserTemplate").html();
				var inShareUserHtml= _.template(inShareUserTemplate, _TU._T.magicbox_InShareUser.data);
				$("#content").append(inShareUserHtml);
			},
			onShowShareUers:function(){
				//获取共享用户列表
				var url = OpenAPI['readMyShareUsers'];
				var strHtml="";
				Util.Ajax(url, "GET", {
					accessToken:Piece.Store.loadObject("user_token",true).accessToken,
					userLoginId:Piece.Store.loadObject("user_token",true).userLoginId,
					dataType:'jsonp'
				}, 'jsonp', function(data, textStatus, jqXHR) {
					$("#userCount").text($(data.shareUserList).length);					
					$(data.shareUserList).each(function(){
						strHtml+="<div class='div-list'><div class='user-circle'><div class='ehome-sphoto'>"
									+"<img alt='' userLoginId='"+this.userLoginId+"' src='../images/ehome-temp.jpg' width='65px'>"
									+"</div></div><div class='div-userName'>"+this.nickName+"</div></div>";
					});
					$(".div-middle").html(strHtml);
				}, function(e, xhr, type) {
					new Piece.Toast(_TU.I18n.Common.updateTimeOut);
				});
			},
			onShow: function() {
				this.onLoadTemplate();

				this.onShowShareUers();
				
			},
			onDelInShareUser:function(e){
				var shareUserLoginId = $(e.target).attr('userLoginId');
				var url = OpenAPI['delMyShareUsers'];
				var strHtml="";
				Util.Ajax(url, "GET", {
					accessToken:Piece.Store.loadObject("user_token",true).accessToken,
					userLoginId:Piece.Store.loadObject("user_token",true).userLoginId,
					shareUserLoginId:shareUserLoginId,
					dataType:'jsonp'
				}, 'jsonp', function(data, textStatus, jqXHR) {
					if(data.result=="success"){
						$(e.target).parent().parent().parent().remove();
						$("#userCount").text(parseFloat($("#userCount").text())-1);		
						new Piece.Toast(_TU.I18n.Common.delSuccess);
					}else{
						new Piece.Toast(_TU.I18n.Common.delFail);
					}
				}, function(e, xhr, type) {
					new Piece.Toast(_TU.I18n.Common.updateTimeOut);
				});
			}
		}); 

	});