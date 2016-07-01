define(['text!ehome/CoRecipe.html'],
	function(viewTemplate) {
		var num=1,timeoutID;
		return Piece.View.extend({
			id: 'ehome_CoRecipe',
			events:{
			},
			render: function() {
				$(this.el).html(viewTemplate);

				Piece.View.prototype.render.call(this);
				return this;
			},
			onShow: function() {
				
				var wid=$(".menu-box").width();
				var hei=$(".menu-box").height();
				var HI = $(".menu-view i").height();
				var HD = $(".menu-view div").height();
				$(".menu-view i").css({"margin-top":((hei-(HI+HD)) / 2)+"px"});
				
				$(".content").find(".menu-view").each(function(ev,ex){
					var _this=$(ex);
					var t = _this.position().top;
					var l = _this.position().left;
					_this.css({
						"width":wid+"px",
						"height":hei+"px",
						"top": t+'px',
						"left": l+'px'
					});
				});
				
				
				this.onCarousel();
				var me=this;
				
				$(".picture-browse").swipeLeft(function(e){
					if(num==5){
						num=0;
					}
					me.viewImg(num);
				});
				$(".picture-browse").swipeRight(function(e){
					if(num==0){
						num=5;
					}
					num=num-2;
					if(num<0){
						num=4;
					}
					
					me.viewImg(num);
				});
				$(".picture-browse").on("touchstart",function(e){
					clearTimeout(timeoutID);
				});
				$(".picture-browse").on("touchend",function(e){
					me.onCarousel();
				});
			},
			onCarousel:function(){
				var me=this;
				timeoutID=setTimeout(function(){
					me.viewImg(num);	
					me.onCarousel();
				},5000);
			},
			viewImg:function(n){
				$("#active label").css("background","#bbb");
				$("#sliders article .info").removeClass("text-browse");
				$("#sliders .inner").removeClass("move1 move2 move3 move4 move5");
				
				$("#sliders").find("article").eq(n).find(".info").addClass("text-browse");
				var obj=$("#sliders .inner");
				if(n==0){
					obj.addClass("move1");
					$("#active label[for='slider1']").css("background","#e50a86");
				}else if(n==1){
					obj.addClass("move2");
					$("#active label[for='slider2']").css("background","#e50a86");
				}else if(n==2){
					obj.addClass("move3");
					$("#active label[for='slider3']").css("background","#e50a86");
				}else if(n==3){
					obj.addClass("move4");
					$("#active label[for='slider4']").css("background","#e50a86");
				}else if(n==4){
					obj.addClass("move5");
					$("#active label[for='slider5']").css("background","#e50a86");
				}
				
				num++;
				if(num==5){
					num=0;
				}
			}
		}); //view define

	});