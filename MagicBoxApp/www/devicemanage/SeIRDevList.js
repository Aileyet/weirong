define(['text!devicemanage/SeIRDevList.html',"../base/schema","../base/templates/template","../base/i18nMain",],
	function(viewTemplate,Schema,_TU,I18n) {
		return Piece.View.extend({
			id: 'devicemanage_IRDevList',
			render: function() {
				$(this.el).html(viewTemplate);

				Piece.View.prototype.render.call(this);
				return this;
			},
			onLoadTemplate:function(){
				_TU._U.setHeader(_TU._T.ir_dev_list);
				for(var i=0;i<_TU._T.ir_dev_list.data.menus.length;i++){
					if(_TU._T.ir_dev_list.data.menus[i].isShow){
						var userInfoTemplate = $(this.el).find("#custominf_inf").html();
						var userInfoHtml = _.template(userInfoTemplate, _TU._T.ir_dev_list.data.menus[i]);
						$(".my-E-home-box").append(userInfoHtml);
					}
				}
			},
			onShow: function() {
					this.onLoadTemplate();//加载配置模板
				   var  gatewayId=Piece.Cache.get("gatewayId");	
					 if(gatewayId==null||gatewayId=="")
					{
						 new Piece.Toast(I18n.Common.noMagicBoxIdError);
						 return;
					}
			},
			events: {
				'touchstart .equip': 'SeBrandChoice'
			},
			SeBrandChoice:function(obj)
			{    
			     var type=obj.currentTarget.getAttribute("type");
				 if(type=="Custom"){
					 Backbone.history.navigate('devicemanage/SeCustom', {trigger: true});
				 }else{
					 				 
				   for(var i=0;i<Schema.DeviceCatg.length;i++){
				 		if(Schema.DeviceCatg[i].type==type){
							Piece.Cache.put("deviceIndex",i);
							Piece.Cache.put("deviceName",Schema.DeviceCatg[i].name);
				            Piece.Cache.put("deviceType",Schema.DeviceCatg[i].type);
							break;
						}
					}
				    Backbone.history.navigate('devicemanage/SeBrandChoice', {trigger: true});
				 }

			},
		}); //view define

	});