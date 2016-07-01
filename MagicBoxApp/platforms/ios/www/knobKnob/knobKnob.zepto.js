define(['zepto', "../base/openapi", "sockjs", "../base/constant"], function($, OpenAPI, SockJs, Cons) {
	var knobKnob = {
		
		Start:function(elTag,value,ifControl,props){
			
		   var options = $.extend({
			 snap: 0,
			 value: 339,
			 turn: function(){},
			 end:function(){},
		   }, props || {});
		   
		   options.value=value;
	
		   var tpl = '<div class="knob">\
				<div class="top"></div>\
				<div class="base"></div>\
			</div>';
			
			
		$(elTag).each(function(){
			
			var el = $(this);
			el.append(tpl);
			
			var knob = $('.knob',el),
				knobTop = knob.find('.top'),
				startDeg = -1,
				currentDeg = 0,
				rotation = 0,
				lastDeg = 0,
				doc = $(document);
			
			if(options.value > 0 && options.value <= 359){
				rotation = currentDeg = options.value;
				knobTop.css('transform','rotate('+(currentDeg)+'deg)');
				knobTop.css('-webkit-transform','rotate('+(currentDeg)+'deg)');
				options.turn(currentDeg);
			}
			
			knob.on('mousedown touchstart', function(e){
		
				e.preventDefault();
				
				var offset = knob.offset();
				if(ifControl){
							var center = {
									y :offset.top + knob.height()/2,
									x: offset.left + knob.width()/2
							  };
					}
					else{
							var center = {
								y :$('.center-1').offset().top+$('.center-1').offset().height/2, 
								x: $('.center-1').offset().left+$('.center-1').offset().width/2, 
							};
					}
				
				var a, b, deg, tmp,
					rad2deg = 180/Math.PI;

	
				knob.on('mousemove.rem touchmove.rem',function(e){
																
					e = e.changedTouches[0];
					
					a = center.y - e.pageY;
					b = center.x - e.pageX;
					deg = Math.atan2(a,b)*rad2deg;
					
					
					// we have to make sure that negative
					// angles are turned into positive:
					if(deg<0){
						deg = 360 + deg;
					}
					
					// Save the starting position of the drag
					if(startDeg == -1){
						startDeg = deg;
					}
					
					// Calculating the current rotation
					tmp = Math.floor((deg-startDeg) + rotation);
					
					
					// Making sure the current rotation
					// stays between 0 and 359
					// if(ifControl)
					// {
						if(tmp < 0){
							tmp = 360 + tmp;
						}
						else if(tmp > 359){
							tmp = tmp % 360;
						}
					// }
					
					// Snapping in the off position:
					if(options.snap && tmp < options.snap){
						tmp = 0;
					}
					
					if(ifControl)
					{
						if(tmp>0&&tmp<200){
							
						}else if(tmp>334&&tmp<360){
						}
						else{
							return false;
						}
					}
						
					
					
					// This would suggest we are at an end position;
					// we need to block further rotation.
					if(Math.abs(tmp - lastDeg) > 360){
						return false;
					}
				
					
					currentDeg = tmp;
					lastDeg = tmp;
		
		
					knobTop.css('transform','rotate('+(currentDeg)+'deg)');
					knobTop.css('-webkit-transform','rotate('+(currentDeg)+'deg)');
					options.turn(currentDeg);
					
				});
			
				doc.on('mouseup.rem  touchend.rem',function(){
					knob.off('.rem');
					doc.off('.rem');
					
					// Saving the current rotation
					rotation = currentDeg;
					
					// Marking the starting degree as invalid
					startDeg = -1;
					if(ifControl)
					{
					  var beginRatio=4;
					  var add=15;
					  var tempBegin=17;
					  var result=0;
					  for(var i=1;i<360/15+2;i++)
					  {
						  if(rotation>=(beginRatio+add*(i-1))&&rotation<(beginRatio+add*i))//大于4度开始计算
						  {
							  if(tempBegin+i-1>30||tempBegin+i-1<16)
							  {
								  result=16;
							  }
							  else
							  {
								  result=tempBegin+i-1;
							  }
							  break;
						  }
						  else if(rotation<beginRatio)//小于4度
						  {
							   result=16;
							   break;
						  }
					  }
					}
					else{
						  if(rotation>=0&&rotation<=90)
						   result=0;
					  else if(rotation>90&&rotation<=180)
						   result=3;
					  else if(rotation>180&&rotation<=270)
						   result=2;
					  else if(rotation>270&&rotation<=360)
						   result=1;
					  else result=0;
					}
					options.end(result);
				});
			});
		  });
		}
	}
	
	return knobKnob;
});