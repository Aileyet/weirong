define(['text!ehome/CoAir.html', '../base/util', '../base/socketutil','../knobKnob/knobKnob.zepto',"../base/templates/template",'../base/tooltip/tooltip','../base/schema','../base/i18nMain'],
		function(viewTemplate,Util,SocketUtil,knobKnob,_TU,Tooltip,Schema,I18n) {
			var gatewayId="";
		    var serial="";
		    var check=null;
			var CoAir=null;
			var viewInitFun,setBtnColorFun;
			var btnName='';
			var img='';
			var lastRatio=0;
			var study;
		return Piece.View.extend({
			id: 'ehome_Air',
			events:{
				'touchstart .div-btn,.top': 'action',
				"touchstart #study":'onStudy',
				"touchstart #save":"save",
			},
			render: function() {
				$(this.el).html(viewTemplate);
				Piece.View.prototype.render.call(this);
				return this;
			},
			onLoadTemplate:function(){
				_TU._U.setHeader(_TU._T.ehome_Air);//加载头部导航
				var obj = _TU._T.ehome_Air.data;
				var templateHtml = $(this.el).find("#ehome_Air_Template").html();
				var power_templateObj = _.template(templateHtml, obj.power);
				var mode_templateObj = _.template(templateHtml, obj.mode);
				var airVolume_templateObj = _.template(templateHtml, obj.airVolume);
				var airDir_templateObj = _.template(templateHtml, obj.airDir);
				var autoDir_templateObj = _.template(templateHtml, obj.autoDir);
				
				$(".div-top .box-flex").eq(0).html("").append(power_templateObj);
				$(".div-top .box-flex").eq(1).html("").append(mode_templateObj);
				$(".control-btn-container .box-flex").eq(0).html("").append(airVolume_templateObj);
				$(".control-btn-container .box-flex").eq(1).html("").append(airDir_templateObj);
				$(".control-btn-container .box-flex").eq(2).html("").append(autoDir_templateObj);
				
			},
			onShow: function() {
				this.onLoadTemplate();//加载配置模板
				
				//返回 回调函数
				_TU._U.goBack(function(){
					new Piece.Toast("返回回调函数!");
					history.back();
				});
				
				
                setBtnColorFun=this.setBtnColor;		
               		
			    
				 //check魔方编号与序列号
				 check=this.checkValue;
				 check();
				 
				 
				 //数据初始化
				CoAir=Piece.Store.loadObject("CoAir", true);//添加到本地
				if(CoAir==null)
				{
					  CoAir={power:"off",mode:"auto",temperature:25,ratio:130,airVolume:"auto",airDir:"middle",autoDir:"off"};
					  Piece.Store.saveObject("CoAir", CoAir, true);
				}
				
				//按钮点击效果
				$(".div-btn").bind("tap",function(){
					if($(this).attr("id")=="power"||$(this).attr("id")=="autoDir")
					{
						CoAir=Piece.Store.loadObject("CoAir", true);//添加到本地
						if(CoAir.power=="off")
						{
							CoAir.power="on";
							Piece.Store.saveObject("CoAir", CoAir, true);
							setBtnColorFun(true,$(this));
							 //打开
						}
						else{
							CoAir.power="off";
							Piece.Store.saveObject("CoAir", CoAir, true);
							setBtnColorFun(false,$(this));
							//关闭
						}
					}
				});
				
				//设置滚动控制
				knobKnob.Start('.text-chassis',CoAir.ratio,true,{//130为25度时的角度，默认25度
				  turn : function(ratio){
					 // $("#temp").html(ratio);
					  var beginRatio=4;
					  var add=15;
					  var tempBegin=17;
					  var result=0;
					  for(var i=1;i<360/15+2;i++)
					  {
						  if(ratio>=(beginRatio+add*(i-1))&&ratio<(beginRatio+add*i))//大于4度开始计算
						  {
							  if(tempBegin+i-1>30||tempBegin+i-1<16)
							  {
								  result=16;
							  }
							  else
							  {
								  result=tempBegin+i-1;
							  }
							  $("#temp").html(result);
							  break;
						  }
						  else if(ratio<beginRatio)//小于4度
						  {
							   result=16;
							    $("#temp").html(result);
							   break;
						  }
					  }
					 lastRatio=ratio;
				  },
				  end: function(temp){
							 //根据温度变大还是变小设置温度
							 if(CoAir.temperature>temp)
							 {
								 SocketUtil.SeCoAirTempDown(temp);
							 }
							 else if(CoAir.temperature<temp)
							 {
								 SocketUtil.SeCoAirTempUp(temp);
							 }
							  CoAir.temperature=temp;
					          CoAir.ratio=lastRatio;
					          Piece.Store.saveObject("CoAir", CoAir, true);
						  }
				  })
				 study=Piece.Cache.get("study");
				 if(study==1){
					 $("#editTitle").attr("style","");
					 $("#controlTitle").attr("style","display:none"); 
					 $("#save").attr("style","");
					 $("#study").attr("style","display:none");
				 }
				  
				  //后续去掉
				   viewInitFun=this.viewInit;
				   viewInitFun();
				   
		    },
			onStudy:function(e){
				var tooltip = new Tooltip();
				tooltip.show("ehome/CoAir");
			},
			action:function(obj){
				var order='';
				var	id=obj.currentTarget.id;
				if(id=="")
				{
					if(obj.currentTarget.getAttribute("class")=="top")
						id="temperature";
				}
				study=Piece.Cache.get("study");
				 if(study==1){
					  SocketUtil.StudyKey("AC00",id);
					  Piece.Cache.put("study-key",id);  
					  Piece.Cache.put("study-module","AC00");
					  Backbone.history.navigate("ehome/SeRemoteCopy", {
						 trigger: true
					 });
				 }
				 else{
					 this.setAir(id);
				 }
			},
			save:function(){
				     $("#editTitle").attr("style","display:none");
					 $("#controlTitle").attr("style",""); 
					 $("#save").attr("style","display:none");
					 $("#study").attr("style","");
					 Piece.Cache.put("study",0);
			},
			checkValue:function()
			{
				     gatewayId=Piece.Cache.get("gatewayId");	
					 if(gatewayId==null||gatewayId=="")
					 {
						 new Piece.Toast(I18n.Common.noMagicBoxError);
						 return;
			    	 }
					  serial=Piece.Cache.get("serial");	
					  if(serial==null||serial=="")
				     {
						 new Piece.Toast(I18n.Common.noDeviceSeriError);
						 return;
			         }
					 
					var currentDevice= Util.getCurrentDevice(gatewayId,serial);
					if(currentDevice!=null){
						$('#controlTitle').html(currentDevice.name);
					}
			},
			setAir:function(id){
			    
				switch(id)
				{
					case "power":
					{
						if(CoAir.power=="off"){
							SocketUtil.SeCoAirPower("on");
						}
						else
						{  
							SocketUtil.SeCoAirPower("off");
						}
						break;
					}
					case "mode":
					{
						var statuObj=this.getNextAirStatuByCurrAndType("mode",CoAir.mode);
						if(statuObj!=null){
							CoAir.mode=statuObj.key;
							//$("#mode").html('<i class="icon iconfont">'+statuObj.img+'</i>');
						    $("#mode").next(".btnName").text(statuObj.name);
						}
						 if(CoAir.mode=="cool"||CoAir.mode=="heat")
						{
								$(".knob").show();
								$(".temp").show();
						}
						else
						{
								$(".knob").hide();
								$(".temp").hide();
						}
						SocketUtil.SeCoAirMode(CoAir.mode);
						break;
					}
					case "airVolume"://高速即风量
					{
						var statuObj=this.getNextAirStatuByCurrAndType("airVolume",CoAir.airVolume);
						if(statuObj!=null){
							CoAir.airVolume=statuObj.key;
							//$("#airVolume").html('<i class="icon iconfont">'+statuObj.img+'</i>');
						    $("#airVolume").next(".btnName").text(statuObj.name);
						}
						SocketUtil.SeCoAirAirVolume(CoAir.airVolume);
						break;
					}
					case "airDir"://风向
					{
						var statuObj=this.getNextAirStatuByCurrAndType("airDir",CoAir.airDir);
						if(statuObj!=null){
							CoAir.airDir=statuObj.key;
							//$("#airDir").html('<i class="icon iconfont">'+statuObj.img+'</i>');
						    $("#airDir").next(".btnName").text(statuObj.name);
						}
						SocketUtil.SeCoAirAirDir(CoAir.airDir);
						break;
					}
					case "autoDir"://扫风即是否风向自动
					{
						if(CoAir.autoDir=="off"){
							CoAir.autoDir="on";
							// $("#autoDir").html('<i class="icon iconfont">&#xe69f;</i>');
						}
						else
						{  
					        CoAir.autoDir="off";
							// $("#autoDir").html('<i class="icon iconfont">&#xe69e;</i>');
						}
						SocketUtil.SeCoAirAutoDir(CoAir.autoDir);
						break;
					}
					default:"";
				}
				Piece.Store.saveObject("CoAir", CoAir, true);
			},
			//根据获取到的设备值设置设备属性
			viewInit:function()
			{
				        //根据模式判断是否显示温度
						if(CoAir.mode=="cool"||CoAir.mode=="heat")
						{
							$(".knob").show();
							$(".temp").show();
							$("#temp").html(CoAir.temperature);
							$(".top").attr("style",'transform: rotate('+CoAir.ratio+'deg);-webkit-transform: rotate('+CoAir.ratio+'deg);');
						}
						else
						{
							 $(".knob").hide();
							 $(".temp").hide();
						}
						//模式
						var statuObj=this.getAirStatuByCurrAndType("mode",CoAir.mode);
						if(statuObj!=null){
							$("#mode").html('<i class="icon iconfont">'+statuObj.img+'</i>');
						    $("#mode").next(".btnName").text(statuObj.name);
						}
						//风量
						var statuObj=this.getAirStatuByCurrAndType("airVolume",CoAir.airVolume);
						if(statuObj!=null){
							$("#airVolume").html('<i class="icon iconfont">'+statuObj.img+'</i>');
						    $("#airVolume").next(".btnName").text(statuObj.name);
						}
						//风向
						var statuObj=this.getAirStatuByCurrAndType("airDir",CoAir.airDir);
						if(statuObj!=null){
							$("#airDir").html('<i class="icon iconfont">'+statuObj.img+'</i>');
						    $("#airDir").next(".btnName").text(statuObj.name);
						}
						//风向是否自动
						if(CoAir.autoDir=="off"){
							setBtnColorFun(false,$("#autoDir"));
						}
						else{ 
					       setBtnColorFun(true,$("#autoDir"));
						}
						//开关按钮
						if(CoAir.power=="off"){
							setBtnColorFun(false,$("#power"));
						}
						else{ 
					        setBtnColorFun(true,$("#power"));
						}
						 
			},
			getNextAirStatuByCurrAndType:function(type,curr){  
			  var mode;
              for(var i=0;i<Schema.AriControl.length;i++){
					if(Schema.AriControl[i].key==type){
						for(var j=0;j<Schema.AriControl[i].value.length;j++){
							if(Schema.AriControl[i].value[j].key==curr){
								if(j+1<Schema.AriControl[i].value.length){
									mode=Schema.AriControl[i].value[j+1];
								}else{
									mode=Schema.AriControl[i].value[0];
								}
								break;
							}
						}
						break;
					}
				}
				return mode;
			},
           getAirStatuByCurrAndType:function(type,curr){
				var mode;
				for(var i=0;i<Schema.AriControl.length;i++){
					if(Schema.AriControl[i].key==type){
						for(var j=0;j<Schema.AriControl[i].value.length;j++){
							if(Schema.AriControl[i].value[j].key==curr){
								mode=Schema.AriControl[i].value[j];
								break;
							}
						}
						break;
					}
				}
				return mode;
			},
		   setBtnColor:function(on,obj){
			   if(on){
			               obj.css("backgroundColor",_TU._T.Color.checkbarColor);
						   obj.find("i").css("color",_TU._T.Color.barColor);
						   obj.css("color",_TU._T.Color.barColor);
			    }else{
					       obj.css("backgroundColor",'');
						   obj.find("i").css("color",_TU._T.Color.iconColor);
						   obj.css("color",_TU._T.Color.iconColor);
				}
			  
		  }	,
		});

	});