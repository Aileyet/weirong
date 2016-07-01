define(['text!ehome/CoToilet.html',"../base/templates/template"],
	function(viewTemplate,_TU) {
		return Piece.View.extend({
			id: 'ehome_CoToilet',
			events:{
			},
			render: function() {
				$(this.el).html(viewTemplate);

				Piece.View.prototype.render.call(this);
				return this;
			},
			onLoadTemplate:function(){
				_TU._U.setHeader(_TU._T.ehome_CoToilet);//加载头部导航
				var obj=_TU._T.ehome_CoToilet.data;
				var TemplateHtml = $(this.el).find("#ehome_CoToilet_Template").html();
				var TemplateObj = _.template(TemplateHtml, obj);
				$(".content").html("").append(TemplateObj);
			},
			onShow: function() {
				//write your business logic here :)
				
				this.onLoadTemplate();
			}
		}); //view define

	});