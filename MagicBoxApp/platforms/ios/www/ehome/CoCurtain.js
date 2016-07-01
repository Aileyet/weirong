define(['text!ehome/CoCurtain.html',"../base/templates/template", '../base/util'],
	function(viewTemplate,_TU,Util) {
		return Piece.View.extend({
			id: 'ehome_CoCurtain',
			events:{
			},
			render: function() {
				$(this.el).html(viewTemplate);

				Piece.View.prototype.render.call(this);
				return this;
			},
			onLoadTemplate:function(){
				_TU._U.setHeader(_TU._T.ehome_CoCurtain);//加载头部导航
				var obj=_TU._T.ehome_CoCurtain.data;
				var TemplateHtml = $(this.el).find("#ehome_CoCurtain_Template").html();
				var TemplateObj = _.template(TemplateHtml, obj);
				$(".content").html("").append(TemplateObj);
			},
			onShow: function() {
				//write your business logic here :)
				
				this.onLoadTemplate();
			},
		}); //view define

	});