define(['text!ehome/CoProjector.html',"../base/templates/template", '../base/util'],
	function(viewTemplate,_TU,Util) {
		return Piece.View.extend({
			id: 'ehome_CoProjector',
			events:{
				"touchstart #study"    :     "study"
			},
			render: function() {
				$(this.el).html(viewTemplate);

				Piece.View.prototype.render.call(this);
				return this;
			},
			onLoadTemplate:function(){
				_TU._U.setHeader(_TU._T.ehome_CoProjector);//加载头部导航
				var obj=_TU._T.ehome_CoProjector.data;
				var TemplateHtml = $(this.el).find("#ehome_CoProjector_Template").html();
				var TemplateObj = _.template(TemplateHtml, obj);
				$(".content").html("").append(TemplateObj);
			},
			onShow: function() {
				//write your business logic here :)
				this.onLoadTemplate();
			},
			study:function(){
				 new Piece.Toast("该功能未开发！");
				 return;
			},
		}); //view define

	});