define(['text!scene/CoChoice.html',"../base/templates/template"],
	function(viewTemplate,_TU) {
		return Piece.View.extend({
			id: 'scene_CoChoice',
			render: function() {
				$(this.el).html(viewTemplate);

				Piece.View.prototype.render.call(this);
				return this;
			},
			events:{
				'touchstart .gotoGate': 'gotoGate'
			},
			onLoadTemplate:function(){
				_TU._U.setHeader(_TU._T.CoChoice);
				for(var i=0;i<_TU._T.CoChoice.data.menus.length;i++){
						var userInfoTemplate = $(this.el).find("#choice_inf").html();
						var userInfoHtml = _.template(userInfoTemplate, _TU._T.CoChoice.data.menus[i]);
						$(".content").append(userInfoHtml);
				}
			},
			onShow: function() {
				this.onLoadTemplate();
			},
			gotoGate:function(obj){
				    var calType=obj.currentTarget.getAttribute("data-type");
					Piece.Cache.put("calType",calType);
					Piece.Cache.put("operation-type","add");
					Backbone.history.navigate("scene/CoSchedule?"+"prePage=scene/CoChoice", {trigger: true});
			},
		}); 

	});