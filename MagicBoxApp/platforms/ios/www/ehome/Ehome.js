define(['text!ehome/Ehome.html','zepto','../base/drag','../base/templates/template'],
	function(viewTemplate,$,Drag,_TU) {
		return Piece.View.extend({
			id: 'ehome_Ehome',
			events: {
				"touchstart .header_right" : "gotoFn"
			},
			gotoFn:function(){
				Backbone.history.navigate("devicemanage/SeAddDev", {
            		trigger: true
            	});
			},
			render: function() {
				$(this.el).html(viewTemplate);
				Piece.View.prototype.render.call(this);
				return this;
			},
			onLoadTemplate:function(){
				var menusObj = _TU._T.ehome_Ehome.data.menus;
				$(".content").html("");
				for(var i=0;i<menusObj.length;i++){
					var userInfoTemplate = $(this.el).find("#EHome-MenusList-Id").html();
					var userInfoHtml = _.template(userInfoTemplate,menusObj[i]);
					$(".content").append(userInfoHtml);
				}
			},
			onShow: function() {
				//清空学习状态
				Piece.Cache.put("study",0);
				//write your business logic here :)
				$(".content").css({"height":($(window).height()-110)+"px"});
				this.onLoadTemplate();
				Drag.initView(this.id);//加载菜单js,传入页面唯一标识
				Drag.isDrop();//加载菜单拖拽js
			}
		}); //view define

	});