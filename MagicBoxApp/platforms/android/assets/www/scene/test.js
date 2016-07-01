define(['text!scene/test.html'],
	function(viewTemplate) {
		var timeoutId,moveTotal=0;
		return Piece.View.extend({
			id: 'scene_test',
			render: function() {
				$(this.el).html(viewTemplate);

				Piece.View.prototype.render.call(this);
				return this;
			},
			onShow: function() {
				//write your business logic here :)
				
				//this.progressBar();
				
				//画布
//				var canvas = document.getElementById("canvas");
//				var ctx = canvas.getContext("2d");
//				ctx.fillStyle='#FF0000';
//				ctx.fillRect(0,0,80,100);
//				ctx.font="2rem iconfont";
//				ctx.fillText('&#xe697;',100,100);
//				onload();
			},
			progressBar:function(){
				var wid = $(".progress-bar").width();
				var timeNum =3.2 * 60;
				var move = wid/timeNum;
 				var me=this;
 				
				me.progressBarMove(wid,move);
				/* 暂停 */
				$(".stop").on("touchstart",function(){
					console.log("** 暂停 **");
					clearTimeout(timeoutId);
				});
				
				/* 开始 */
				$(".start").on("touchstart",function(){
					console.log("** 开始 **");
					me.progressBarMove(wid,move);
				});
			},
			progressBarMove:function(wid,move){
				var me=this;
				if(moveTotal<wid){
					moveTotal = moveTotal + move;
					$(".pro-point").css("left",moveTotal+"px");
					$(".progress").css("width",moveTotal+"px");
					timeoutId = setTimeout(function(){
						me.progressBarMove(wid,move);
					},1000);
				}
			}
			
		}); //view define

	});