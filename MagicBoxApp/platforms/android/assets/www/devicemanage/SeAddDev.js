define(['text!devicemanage/SeAddDev.html',"../base/templates/template","../base/i18nMain",],
	function(viewTemplate,_TU,I18n) {
		return Piece.View.extend({
			id: 'myequip_AddDev',
			render: function() {
				$(this.el).html(viewTemplate);

				Piece.View.prototype.render.call(this);
				return this;
			},
			onLoadTemplate:function(){
				_TU._U.setHeader(_TU._T.seAddDev);
				for(var i=0;i<_TU._T.seAddDev.data.menus.length;i++){
					var userInfoTemplate = $(this.el).find("#AddDev_menus").html();
					var userInfoHtml = _.template(userInfoTemplate, _TU._T.seAddDev.data.menus[i]);
					$(".content").append(userInfoHtml);
				}
			},
			onShow: function() {
				this.onLoadTemplate();//加载配置模板
			},
			events:{
				'touchstart .equip': 'gotoGate'
			},
			gotoGate:function(obj){
				var id=obj.currentTarget.id;
				//添加魔方直接跳转
			    if(id=="devicemanage/SeAddMB"){
				    Backbone.history.navigate("devicemanage/SeAddMB", {trigger: true});
				}
				else{//否则需要判断魔方数量来决定跳转页面
					var magicList=Piece.Store.loadObject("magicList", true);
					if(magicList!=null&&magicList.length>0)
					{
						if(magicList.length>1){
							Piece.Cache.put("AddDevUrl",id);
							Backbone.history.navigate('devicemanage/SeGatewayChoice', {trigger: true});
						}
						else{
							Piece.Cache.put("gatewayId", magicList[0].gatewayId);
							Backbone.history.navigate(id, {trigger: true});
						}
					}
					else
					{
						new Piece.Toast(I18n.Common.magicboxError);
					}
				}
			}
		}); //view define
	});