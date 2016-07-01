define(['text!devicemanage/SeGatewayChoice.html','../base/util',"../base/templates/template"],
	function(viewTemplate,Util,_TU) {
		var magicList=new Array();
		return Piece.View.extend({
			id: 'devicemanage_GatewayChoice',
			render: function() {
				$(this.el).html(viewTemplate);
				Piece.View.prototype.render.call(this);
				return this;
			},
			onLoadTemplate:function(){
				_TU._U.setHeader(_TU._T.gataway_choice);
			},
			onShow: function() {
				this.onLoadTemplate();//加载配置模板
				 magicList=Piece.Store.loadObject("magicList", true);
				$('#magicList').val('');
				if(magicList!=null&&magicList.length>0){
					for(var i=0;i<magicList.length;i++){
						 if(magicList[i].device=="MagicBox"){
							  $('#magicList').append('<a  class="gateway-list"  id="'+magicList[i].gatewayId+'"><div class="gateway-name" ><i class="icon iconfont" >&#xe604;</i>'+ magicList[i].name+'</div><div class="right-arrow-area" ><i class="icon iconfont" >&#xe682;</i></div></a>');
						 }
					}
				}else
				{
					Backbone.history.navigate('devicemanage/SeAddDev', {trigger: true});
				}
			},
			events:{
				'touchstart .gateway-list': 'addDev'
			},
			addDev:function(obj){
				     var gatewayId=obj.currentTarget.id;
				     var AddDevUrl=Piece.Cache.get("AddDevUrl");
					 Piece.Cache.put("gatewayId", gatewayId);
					 Backbone.history.navigate(AddDevUrl, {trigger: true});
			}
		}); //view define

	});