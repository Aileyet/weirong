define(['text!devicemanage/SeCustom.html',"../base/templates/template","../base/schema",'devicemanage/SeDevReName'],
	function(viewTemplate,_TU,Schema,SeDevReName) {
		return Piece.View.extend({
			id: 'devicemanage_SeCustom',
			render: function() {
				$(this.el).html(viewTemplate);

				Piece.View.prototype.render.call(this);
				return this;
			},
			onLoadTemplate:function(){
				_TU._U.setHeader(_TU._T.custom);
				for(var i=0;i<_TU._T.custom.menus.length;i++){
					if(_TU._T.custom.menus[i].isShow){
						var userInfoTemplate = $(this.el).find("#home_Custome_menus").html();
						var userInfoHtml = _.template(userInfoTemplate, _TU._T.custom.menus[i]);
						$(".my-E-home-box").append(userInfoHtml);
					}
				}
			},
			onShow: function() {
				this.onLoadTemplate();//加载配置模板
				//write your business logic here :)
			},
			events: {
				'touchstart .equip': 'SeBrandChoice'
			},
			SeBrandChoice:function(obj)
			{  
			   var type=obj.currentTarget.getAttribute("type");
			   for(var i=0;i<Schema.DeviceCatg.length;i++){
				 		if(Schema.DeviceCatg[i].type==type){
							Piece.Cache.put("deviceIndex",i);
							Piece.Cache.put("deviceName",Schema.DeviceCatg[i].name);
				            Piece.Cache.put("deviceType",Schema.DeviceCatg[i].type);
							Piece.Cache.put("AddType",'RemoteCopy');
							break;
						}
					}
				var seDevReName = new SeDevReName();
				seDevReName.show();	
			 // Backbone.history.navigate('devicemanage/SeDevReName?prePage=SeCustom', {trigger: true});

			},
		}); //view define

	});