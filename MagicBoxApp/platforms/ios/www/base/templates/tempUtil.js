define(['zepto'], function($) {
	var _U={
		/*设置头部导航*/
		setHeader:function(e){
			
			var rightMenuH='';
			var type="";
			var h='<div id="homelist_city_name_div" class="nav-wrap-left header_left" >'+
				  '<a class="react" gaevent="imt/hd/home">'; 
			if(e.leftIcon!=""){
				if(e.leftIcon=="&#xe661;"){
					type="back";
				}
				h=h+'<i type="'+type+'" class="icon iconfont">'+e.leftIcon+'</i>';
			}
				h=h+'</a></div>'+
				  '<span class="nav-header h1" id="controlTitle">'+e.title+'</span>'+
				  '<span class="nav-header h1" id="editTitle" style="display:none">'+e.titleHide+'</span>'+
				  '<div id="homelist_city_name_div" class="nav-wrap-right header_right" >'+
				  '<a class="react" gaevent="imt/hd/home">';
		    if(e.rightIcon!=""){
				if(e.rightMenu!=null&&e.rightMenu.Menu.length>0){//右键是否有下拉菜单
					 h=h+'<i class="icon iconfont" style="font-size: 1.5em;pointer-events:none;" id="study">'+e.rightIcon+'</i>'
					 +'<i class="icon iconfont" id="save" style="display:none" >'+e.rightIconHide+'</i>';
					 rightMenuH="<ul>";
					 for(var i=0;i<e.rightMenu.Menu.length;i++){
						 rightMenuH+='<li class="'+e.rightMenu.Menu[i].div_style+'" data-type="'+e.rightMenu.Menu[i].data_type+'">'+e.rightMenu.Menu[i].name+'</li>';
					 }
					 rightMenuH+="</ul>";
				}else{
						h=h+'<i class="icon iconfont" id="study">'+e.rightIcon+'</i>'+
				       '<i class="icon iconfont" id="save" style="display:none">'+e.rightIconHide+'</i>';
					
				}
			}
			h=h+'</a>'+rightMenuH+'</div>';
			$("#homelist_header").html("");
			$("#homelist_header").append(h);
			
			_U.goBack(null);
			
			//显示头部状态栏
//			if(typeof cordova === "object"){
//			 	if (cordova.platformId == 'android') {
//					 StatusBar.show();//显示状态栏
//				}
//			}
			
			
			$(".content").addClass("backgroundColor").css("height",(document.body.clientHeight-51)+"px");
			$("#controlTitle").addClass("titleColor");
		},
		goBack:function(fun){
			if(typeof fun == "function"){
				var backObj = $(".nav-wrap-left");
				backObj.off("touchend");
				$(".nav-wrap-left").one("touchend",function(e){
					fun();
				});
			}else{
				$(".nav-wrap-left").one("touchend",function(e){
					if(e.target.tagName=="I" && $(e.target).attr("type")=="back"){
						history.back();
					}else if($(e.target).find("i").length>0){
						if($(e.target).find("i").attr("type") == "back"){
							history.back();
						}
					}
				});
			}
		}
	};
	
	return _U;
});