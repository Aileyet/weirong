define(['text!devicemanage/SeBrandChoice.html',"zepto", "../base/openapi", '../base/util',"../base/schema","../base/templates/template",
"../base/i18nMain",],
	function(viewTemplate,$, OpenAPI, Util,Schema,_TU,I18n) {
		return Piece.View.extend({
			id: 'devicemanage_SeBrandChoice',
			render: function() {
				$(this.el).html(viewTemplate);

				Piece.View.prototype.render.call(this);
				return this;
			},
			onLoadTemplate:function(){
				_TU._U.setHeader(_TU._T.brandChoice);
			},
			events:{
			},
			onShow: function() {
				 this.onLoadTemplate();//加载配置模板
				 $('.content').css('height','');
				  //字母组
		    	 var earray=[{key:"a",values:new Array()},{key:"b",values:new Array()},{key:"c",values:new Array()},{key:"d",values:new Array()},{key:"e",values:new Array()},{key:"f",values:new Array()},{key:"g",values:new Array()},{key:"h",values:new Array()},{key:"i",values:new Array()},{key:"j",values:new Array()},{key:"k",values:new Array()},{key:"l",values:new Array()},{key:"m",values:new Array()},{key:"n",values:new Array()},{key:"o",values:new Array()},{key:"p",values:new Array()},{key:"q",values:new Array()},{key:"r",values:new Array()},{key:"s",values:new Array()},{key:"t",values:new Array()},{key:"u",values:new Array()},{key:"v",values:new Array()},{key:"w",values:new Array()},{key:"x",values:new Array()},{key:"y",values:new Array()},{key:"z",values:new Array()}];
				
				 //字母导航栏
				 $(".slider-nav ul").append('<li><a alt="#">#</a></li>');
                 for(var i=0;i<earray.length;i++){
					 $(".slider-nav ul").append('<li><a alt="#'+earray[i].key+'">'+earray[i].key.toUpperCase()+'</a></li>');
				 }
				//字母事件
				$('.slider-nav a').bind("touchstart",function(){
					var target = $(this).attr('alt');
					if(target=="#"){$('.content').scrollTop(0);return;};
					if($('.content '+target).length==0)return;
					// var cOffset = $('.content').offset().top;
					// var tOffset = $('.content '+target).offset().top;
					// var height = $('.slider-nav').height();
					// var pScroll = (tOffset - cOffset) - height/8;
					$('#list .key-list-bar').removeClass('selected');
					$(target).addClass('selected');
					var height1=parseInt($(".key-list-bar").css("height").replace("px",""));
					var height2=parseInt($(".brand-list-box").css("height").replace("px",""));
					var num1=0;
					var num2=$("#mainlist .brand-list-box").length-1;
					for(var j=0;j<earray.length;j++){
							  if(target.indexOf(earray[j].key)>-1)
							  { 
								   break;
							  }
							  num1++;
							  num2+=earray[j].values.length;
					}
					$('.content').scrollTop(height1*num1+height2*num2);//滚动条定位
					}
				);
				//调api
				var deviceIndex=0;
				if(Piece.Cache.get("deviceIndex")!=null)deviceIndex=Piece.Cache.get("deviceIndex");
				var devType=Schema.DeviceCatg[deviceIndex].apiType;
	         Util.Ajax(OpenAPI.readIRCBrands, "GET", {devType: devType},'jsonp',
                  function(data, textStatus, jqXHR){
					    data.brandList=data.brandList.sort(function(a, b){
	             	    return a.brandNameEn.localeCompare(b.brandNameEn);
	             });
				       //按照品牌英文分组到相应字母下
						for(var i=0;i<data.brandList.length;i++){
							  for(var j=0;j<earray.length;j++){
								  if(data.brandList[i].brandNameEn[0].toLowerCase()==earray[j].key){
									  if(earray[j].values==null||earray[j].values==undefined)
									  {
										  earray[j].values=new Array();
									  }
									  earray[j].values[earray[j].values.length]=data.brandList[i];
								      break;
							  }
						   }
						}
						
						for(var i=0;i<earray.length;i++){
							if(earray[i].values.length<=0){continue};
							var obj=$("<div class='key-list-bar' id='"+earray[i].key+"'>"+earray[i].key.toUpperCase()+"</div>");
							   obj.appendTo("#list");
							for(var j=0;j<earray[i].values.length;j++){
								    var data=earray[i].values[j];
									   var template=$("#template").html();
                                       template=template.replace("<%=name%>","<div class='brand-name-Chinese'>"+data.brandName+"</div><div class='brand-name-English'>"+data.brandNameEn+"</div>");
									var obj=$("<div>").attr("class","brand-list-box").html(template);
									obj.attr("data-option-id",data.brandId);//品牌id
									obj.attr("data-option-type",data.deviceType);//设备类型
									obj.attr("data-option-name",data.brandName);//设备名称
									obj.bind("tap",function(){
										  Piece.Cache.put("deviceBrandName",$(this).attr("data-option-name"));
										  Piece.Cache.put("deviceBrandId",$(this).attr("data-option-id"));
											var deviceIndex=Piece.Cache.get("deviceIndex");
											 if(Schema.DeviceCatg[deviceIndex].isManual==0){//不支持手动则直接跳到自动匹配页面
												 Backbone.history.navigate("devicemanage/SeAutoMatch", {trigger: true});
											 }else{
												 Backbone.history.navigate("devicemanage/SeModelChoice", {trigger: true});
											 }
								  });
									if(data.mainBrand){
										obj.appendTo("#mainlist");
									}else{
										obj.appendTo("#list");
									}
							}
						}
						
                        // for(var i=0;i<data.brandList.length;i++){
                            // var template=$("#template").html();
                            // template=template.replace("<%=name%>","<div class='name'>"+data.brandList[i].brandName+"</div><div class='desc'>"+data.brandList[i].brandNameEn+"</div>");
                            // var obj=$("<div>").attr("class","list").html(template);
                            // obj.attr("data-option-id",data.brandList[i].brandId);//品牌id
                            // obj.attr("data-option-type",data.brandList[i].deviceType);//设备类型
                            // obj.attr("data-option-name",data.brandList[i].brandName);//设备名称
                            // obj.bind("tap",function(){
                                  // Piece.Cache.put("deviceBrandName",$(this).attr("data-option-name"));
                                  // Piece.Cache.put("deviceBrandId",$(this).attr("data-option-id"));
                                  // // Backbone.history.navigate("devicemanage/SeIRWay", {//跳转到自动/手动选择设备页面
                                                                // // trigger: true});
                                    // var deviceIndex=Piece.Cache.get("deviceIndex");
									 // if(Schema.DeviceCatg[deviceIndex].isManual==0){//不支持手动则直接跳到自动匹配页面
										 // Backbone.history.navigate("devicemanage/SeAutoMatch", {trigger: true});
									 // }else{
										 // Backbone.history.navigate("devicemanage/SeModelChoice", {trigger: true});
									 // }
						  // });
						  	// if(data.brandList[i].mainBrand){
								// obj.appendTo("#mainlist");
							// }else{
								// obj.appendTo("#list");
							// }
                            
                        // }
                    }, function(e, xhr, type) {
			new Piece.Toast(I18n.Common.serverError);
	           });

			}
		}); //view define

	});