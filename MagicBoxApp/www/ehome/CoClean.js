define(['text!ehome/CoClean.html',"../base/templates/template", '../base/util'],
	function(viewTemplate,_TU,Util) {
		return Piece.View.extend({
			id: 'ehome_CoClean',
			events:{
				"touchstart #study"    :     "study",
				"touchstart .navigation-tab .nat-tab-text" : "panelSwitch"
			},
			panelSwitch:function(e){
				$(".navigation-tab .nat-tab-text").removeClass("coclean-bor-bottom");
				$(e.target).addClass("coclean-bor-bottom");
				var contentClass=$(e.target).attr("data-module");
				$(".current-state").addClass("dis-none");
				$(".history").addClass("dis-none");
				$(".time-switch").addClass("dis-none");
				$("."+contentClass).removeClass("dis-none");
			},
			render: function() {
				$(this.el).html(viewTemplate);

				Piece.View.prototype.render.call(this);
				return this;
			},
			onLoadTemplate:function(){
				_TU._U.setHeader(_TU._T.ehome_CoClean);//加载头部导航
				var obj=_TU._T.ehome_CoClean.data;
				var TemplateHtml = $(this.el).find("#ehome_CoClean_Template").html();
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