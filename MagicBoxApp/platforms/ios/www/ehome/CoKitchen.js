define(['text!ehome/CoKitchen.html',"../base/templates/template", '../base/util'],
	function(viewTemplate,_TU,Util) {
		return Piece.View.extend({
			id: 'ehome_Kitchen',
			events:{
			},
			render: function() {
				$(this.el).html(viewTemplate);

				Piece.View.prototype.render.call(this);
				return this;
			},
			onLoadTemplate:function(){
				_TU._U.setHeader(_TU._T.ehome_Kitchen);//加载头部导航
				var obj=_TU._T.ehome_Kitchen.data.menus;
				var content = $(".cokitchen-div-bottom");
				content.html("");
				for(var i=0;i<obj.length;i++){
					var TemplateHtml = $(this.el).find("#ehome_Kitchen_Template").html();
					var TemplateObj = _.template(TemplateHtml, obj[i]);
					content.append(TemplateObj);
				}
				
				
			},
			onShow: function() {
				//write your business logic here :)
				
				this.onLoadTemplate();
			}
		}); //view define

	});