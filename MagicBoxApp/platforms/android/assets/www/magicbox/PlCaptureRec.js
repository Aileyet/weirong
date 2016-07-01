define(['text!magicbox/PlCaptureRec.html',"../base/templates/template"],
	function(viewTemplate,_TU) {
		return Piece.View.extend({
			id: 'magicbox_PlCaptureRec',
			events:{
			},
			onEHomeMenuFn:function(e){
				$(".div-photo").on({
			        touchend: function(e){
			            var module=$(e.target).attr("data-module");
			            var view  =$(e.target).attr("data-view");
			            if(module!=null && view!=null){ 
			            	Backbone.history.navigate(module+"/"+view, {
			            		trigger: true
			            	});
			            }else{
			            	new Piece.Toast("此功能还未完成");
			            } 
			            return false; 
			        }
			    })
			},
			render: function() {
				$(this.el).html(viewTemplate);

				Piece.View.prototype.render.call(this);
				return this;
			},
			onLoadTemplate:function(){
				_TU._U.setHeader(_TU._T.magicbox_PlCaptureRec);//加载头部导航
				var me = this;
				var delTemplate = $(me.el).find("#delTemplate").html();
				var delHtml= _.template(delTemplate, _TU._T.magicbox_PlCaptureRec.data);
				$("#content").append(delHtml);
			},
			onShow: function() {
				this.onLoadTemplate();
				//write your business logic here :)
				this.onEHomeMenuFn();
			}
		}); //view define

	});