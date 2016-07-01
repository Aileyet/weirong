define(['text!magicbox/SeSubscribe.html',"zepto", "../base/openapi", '../base/util','../base/socketutil',"../base/templates/template"],
	function(viewTemplate, $, OpenAPI, Util,SocketUtil,_TU) {
		
		var subscribe=Piece.Store.loadObject("SeSubscribe",true);

		
		if(subscribe==null)subscribe={"hw_select":false,"hw_type":"1","hw_time":"5000","kq_select":false,
		"kq_type":"1","kq_time":"5000","dc_select":false,"dc_type":"1","dc_time":"5000",
		"temp_select":false,"temp_type":"1","temp_time":"5000","temp_max":"35","temp_min":"15",
		"th_select":false,"th_type":"1","th_time":"5000","th_max":"80","th_min":"40"};
		

		var initView=function(){
			if(subscribe.hw_select==false){//当前未选中
				$("#hw_select").html('<i class="icon iconfont magicbox_SeSubscribe_i-color" style="font-size:24px;">&#xe68d;</i>');
			}
			else{
				$("#hw_select").html('<i class="icon iconfont magicbox_SeSubscribe_i-color" style="font-size:24px;">&#xe68e;</i>');
			}
			
			$("#hw_type").val(subscribe.hw_type);
			$("#hw_time").val(subscribe.hw_time);
			
			if(subscribe.kq_select==false){//当前未选中
				$("#kq_select").html('<i class="icon iconfont magicbox_SeSubscribe_i-color" style="font-size:24px;">&#xe68d;</i>');
			}
			else{
				$("#kq_select").html('<i class="icon iconfont magicbox_SeSubscribe_i-color" style="font-size:24px;">&#xe68e;</i>');
			}
			
			$("#kq_type").val(subscribe.kq_type);
			$("#kq_time").val(subscribe.kq_time);
			
			if(subscribe.dc_select==false){//当前未选中
				$("#dc_select").html('<i class="icon iconfont magicbox_SeSubscribe_i-color" style="font-size:24px;">&#xe68d;</i>');
			}
			else{
				$("#dc_select").html('<i class="icon iconfont magicbox_SeSubscribe_i-color" style="font-size:24px;">&#xe68e;</i>');
			}
		    $("#dc_type").val(subscribe.dc_type);
			$("#dc_time").val(subscribe.dc_time);
			
			
			if(subscribe.temp_select==false){//当前未选中
				$("#temp_select").html('<i class="icon iconfont magicbox_SeSubscribe_i-color" style="font-size:24px;">&#xe68d;</i>');
			}
			else{
				$("#temp_select").html('<i class="icon iconfont magicbox_SeSubscribe_i-color" style="font-size:24px;">&#xe68e;</i>');
			}
			$("#temp_type").val(subscribe.temp_type);
			$("#temp_time").val(subscribe.temp_time);
			$("#temp_max").val(subscribe.temp_max);
			$("#temp_min").val(subscribe.temp_min);
			
			if(subscribe.th_select==false){//当前未选中
				$("#th_select").html('<i class="icon iconfont magicbox_SeSubscribe_i-color"  style="font-size:24px;">&#xe68d;</i>');
			}
			else{
				$("#th_select").html('<i class="icon iconfont magicbox_SeSubscribe_i-color"  style="font-size:24px;">&#xe68e;</i>');
			}
			$("#th_type").val(subscribe.th_type);
			$("#th_time").val(subscribe.th_time);
			$("#th_max").val(subscribe.th_max);
			$("#th_min").val(subscribe.th_min);
		}
		
		
		return Piece.View.extend({
			id: 'magicbox_SeSubscribe',
			events:{
			},
			render: function() {
				$(this.el).html(viewTemplate);

				Piece.View.prototype.render.call(this);
				return this;
			},
			onLoadTemplate:function(){
				_TU._U.setHeader(_TU._T.magicbox_SeSubscribe);//加载头部导航
				var me = this;
				var seSubscribeTemplate = $(me.el).find("#seSubscribeTemplate").html();
				var seSubscribeHtml= _.template(seSubscribeTemplate, _TU._T.magicbox_SeSubscribe.data);
				$("#content").html("").append(seSubscribeHtml);
			},
			onShow: function() {

				this.onLoadTemplate();
				
				new Piece.VSelect({
					id : "sd_type",
					preset : "select"
				});
				
				new Piece.VSelect({
					id : "wd_type",
					preset : "select"
				});
				
				new Piece.VSelect({
					id : "dc_type",
					preset : "select"
				});
				
				new Piece.VSelect({
					id : "kq_type",
					preset : "select"
				});
				
				new Piece.VSelect({
					id : "hw_type",
					preset : "select"
				});
				
				initView();
				Piece.Cache.put("serial","0000");
				
				$("#hw_select").bind("tap",function(){
					if(subscribe.hw_select==false){//当前未选中
					    subscribe.hw_select=true;
						Piece.Store.saveObject("SeSubscribe",subscribe,true);
						initView();
						//发送启用命令
						SocketUtil.SeSubscribeHW_Select("on");
					}
					else{
						subscribe.hw_select=false;
						Piece.Store.saveObject("SeSubscribe",subscribe,true);
						initView();
						SocketUtil.SeSubscribeHW_Select("off");
					}
				});
				
				
				$("#hw_type").change(function(){
					subscribe.hw_type=$(this).val();
					Piece.Store.saveObject("SeSubscribe",subscribe,true);
					initView();
					SocketUtil.SeSubscribeHW_Type(subscribe.hw_type);
				});
				
				
				$("#hw_time").blur(function(){
					
					var time=$(this).val();
					var itime=parseInt(time);
					if(isNaN(itime)){
						Piece.Toast("间隔时间请输入数字!");
						return;
					}
					
					if(itime<0||itime>1000000){
						Piece.Toast("间隔时间必须在0-1000000之间!");
						return;
					}
					
					subscribe.hw_time=itime;
					Piece.Store.saveObject("SeSubscribe",subscribe,true);
					initView();
					SocketUtil.SeSubscribeHW_Time(subscribe.hw_time);
				});
				
				
				/*空气质量*/
				$("#kq_select").bind("tap",function(){
					if(subscribe.kq_select==false){//当前未选中
					    subscribe.kq_select=true;
						Piece.Store.saveObject("SeSubscribe",subscribe,true);
						initView();
						//发送启用命令
						SocketUtil.SeSubscribeKQ_Select("on");
					}
					else{
						subscribe.kq_select=false;
						Piece.Store.saveObject("SeSubscribe",subscribe,true);
						initView();
						SocketUtil.SeSubscribeKQ_Select("off");
					}
				});
				
				
				$("#kq_type").change(function(){
					subscribe.kq_type=$(this).val();
					Piece.Store.saveObject("SeSubscribe",subscribe,true);
					initView();
					SocketUtil.SeSubscribeKQ_Type(subscribe.kq_type);
				});
				
				
				$("#kq_time").blur(function(){
					var time=$(this).val();
					var itime=parseInt(time);
					if(isNaN(itime)){
						Piece.Toast("间隔时间请输入数字!");
						return;
					}
					
					if(itime<0||itime>1000000){
						Piece.Toast("间隔时间必须在0-1000000之间!");
						return;
					}
					
					subscribe.kq_time=itime;
					Piece.Store.saveObject("SeSubscribe",subscribe,true);
					initView();
					SocketUtil.SeSubscribeKQ_Time(subscribe.kq_time);
				});
				
				/*电池低电量*/
				$("#dc_select").bind("tap",function(){
					if(subscribe.dc_select==false){//当前未选中
					    subscribe.dc_select=true;
						Piece.Store.saveObject("SeSubscribe",subscribe,true);
						initView();
						//发送启用命令
						SocketUtil.SeSubscribeDC_Select("on");
					}
					else{
						subscribe.dc_select=false;
						Piece.Store.saveObject("SeSubscribe",subscribe,true);
						initView();
						SocketUtil.SeSubscribeDC_Select("off");
					}
				});
				
				$("#dc_type").change(function(){
					subscribe.dc_type=$(this).val();
					Piece.Store.saveObject("SeSubscribe",subscribe,true);
					initView();
					SocketUtil.SeSubscribeDC_Type(subscribe.dc_type);
				});
				
				
				$("#dc_time").blur(function(){
					var time=$(this).val();
					var itime=parseInt(time);
					if(isNaN(itime)){
						Piece.Toast("间隔时间请输入数字!");
						return;
					}
					
					if(itime<0||itime>1000000){
						Piece.Toast("间隔时间必须在0-1000000之间!");
						return;
					}
					
					subscribe.dc_time=itime;
					Piece.Store.saveObject("SeSubscribe",subscribe,true);
					initView();
					SocketUtil.SeSubscribeDC_Time(subscribe.dc_time);
				});
				
				
				/*温度*/
				$("#temp_select").bind("tap",function(){
					if(subscribe.temp_select==false){//当前未选中
					    subscribe.temp_select=true;
						Piece.Store.saveObject("SeSubscribe",subscribe,true);
						initView();
						//发送启用命令
						SocketUtil.SeSubscribeTemp_Select("on");
					}
					else{
						subscribe.temp_select=false;
						Piece.Store.saveObject("SeSubscribe",subscribe,true);
						initView();
						SocketUtil.SeSubscribeTemp_Select("off");
					}
				});
				
				
				$("#wd_type").change(function(){
					subscribe.temp_type=$(this).val();
					Piece.Store.saveObject("SeSubscribe",subscribe,true);
					initView();
					SocketUtil.SeSubscribeTemp_Type(subscribe.temp_type);
				});
				
				
				$("#temp_time").blur(function(){
					
					var time=$(this).val();
					var itime=parseInt(time);
					if(isNaN(itime)){
						Piece.Toast("间隔时间请输入数字!");
						return;
					}
					
					if(itime<0||itime>1000000){
						Piece.Toast("间隔时间必须在0-1000000之间!");
						return;
					}
					
					subscribe.temp_time=itime;
					Piece.Store.saveObject("SeSubscribe",subscribe,true);
					initView();
					SocketUtil.SeSubscribeTemp_Time(subscribe.temp_time);
				});
				
				
				$("#temp_max").blur(function(){
					
					var val=$(this).val();
					var ival=parseInt(val);
					if(isNaN(ival)){
						Piece.Toast("温度请输入数字!");
						return;
					}
					
					if(ival<-40||ival>125){
						Piece.Toast("温度必须在-40度到125度之间!");
						return;
					}
					
					subscribe.temp_max=ival;
					Piece.Store.saveObject("SeSubscribe",subscribe,true);
					initView();
					SocketUtil.SeSubscribeTemp_Max(subscribe.temp_max);
				});
				
				$("#temp_min").blur(function(){
					
					var val=$(this).val();
					var ival=parseInt(val);
					if(isNaN(ival)){
						Piece.Toast("温度请输入数字!");
						return;
					}
					
					if(ival<-40||ival>125){
						Piece.Toast("温度必须在-40度到125度之间!");
						return;
					}
					
					subscribe.temp_min=ival;
					Piece.Store.saveObject("SeSubscribe",subscribe,true);
					initView();
					SocketUtil.SeSubscribeTemp_Min(subscribe.temp_min);
				});
				
				/*湿度*/
				$("#th_select").bind("tap",function(){
					if(subscribe.th_select==false){//当前未选中
					    subscribe.th_select=true;
						Piece.Store.saveObject("SeSubscribe",subscribe,true);
						initView();
						//发送启用命令
						SocketUtil.SeSubscribeTH_Select("on");
					}
					else{
						subscribe.th_select=false;
						Piece.Store.saveObject("SeSubscribe",subscribe,true);
						initView();
						SocketUtil.SeSubscribeTH_Select("off");
					}
				});
				
				
				$("#sd_type").change(function(){
					subscribe.th_type=$(this).val();
					Piece.Store.saveObject("SeSubscribe",subscribe,true);
					initView();
					SocketUtil.SeSubscribeTH_Type(subscribe.th_type);
				});
				
				
				$("#th_time").blur(function(){
					
					var time=$(this).val();
					var itime=parseInt(time);
					if(isNaN(itime)){
						Piece.Toast("间隔时间请输入数字!");
						return;
					}
					
					if(itime<0||itime>1000000){
						Piece.Toast("间隔时间必须在0-1000000之间!");
						return;
					}
					
					subscribe.th_time=itime;
					Piece.Store.saveObject("SeSubscribe",subscribe,true);
					initView();
					SocketUtil.SeSubscribeTH_Time(subscribe.th_time);
				});
				
				
				$("#th_max").blur(function(){
					
					var val=$(this).val();
					var ival=parseInt(val);
					if(isNaN(ival)){
						Piece.Toast("湿度请输入数字!");
						return;
					}
					
					if(ival<0||ival>1000){
						Piece.Toast("湿度必须在0到1000之间!");
						return;
					}
					
					subscribe.th_max=ival;
					Piece.Store.saveObject("SeSubscribe",subscribe,true);
					initView();
					SocketUtil.SeSubscribeTH_Max(subscribe.th_max);
				});
				
				$("#th_min").blur(function(){
					
					var val=$(this).val();
					var ival=parseInt(val);
					if(isNaN(ival)){
						Piece.Toast("湿度请输入数字!");
						return;
					}
					
					if(ival<0||ival>1000){
						Piece.Toast("湿度必须在0到1000之间!");
						return;
					}
					
					subscribe.th_min=ival;
					Piece.Store.saveObject("SeSubscribe",subscribe,true);
					initView();
					SocketUtil.SeSubscribeTH_Min(subscribe.th_min);
				});
				
			}
		}); //view define

	});