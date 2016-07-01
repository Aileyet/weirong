define(['text!devicemanage/SeZigBeeList.html',"../base/templates/template","../base/schema"],
	function(viewTemplate,_TU,Schema) {
		return Piece.View.extend({
			id: 'devicemanage_SeZigBeeList',
			render: function() {
				$(this.el).html(viewTemplate);

				Piece.View.prototype.render.call(this);
				return this;
			},
			onLoadTemplate:function(){
				_TU._U.setHeader(_TU._T.devicemanage_ZegBeeList);
				for(var i=0;i<_TU._T.devicemanage_ZegBeeList.data.menus.length;i++){
					var InfoTemplate = $(this.el).find("#devicemanage_ZegBeeList_menus").html();
					var InfoHtml = _.template(InfoTemplate, _TU._T.devicemanage_ZegBeeList.data.menus[i]);
					$(".my-E-home-box").append(InfoHtml);
				}
			},
			onShow: function() {
				this.onLoadTemplate();//加载配置模板
			},
			events: {
				'touchstart .equip': 'choice'
			},
			choice:function(obj)
			{      
 			        var id=obj.currentTarget.id;
				    var type=$('#'+id).attr("type");
				    var name=$('#'+id).find("span[class=my-E-home-name]").html();
					for(var i=0;i<Schema.DeviceCatg.length;i++){
						if(Schema.DeviceCatg[i].type==type){
							Piece.Cache.put("deviceIndex",i);
							break;
						}
					}
				    Piece.Cache.put("deviceName",name);
				    Piece.Cache.put("deviceType",type);
					Piece.Cache.put("AddType","zigbee");
				    Backbone.history.navigate('devicemanage/SeAddZigBee', {trigger: true})
				
			},
		}); //view define

	});