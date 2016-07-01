define(['text!home/SeAlertList.html',"zepto", "../base/openapi", '../base/util','../base/login/login','../base/socketutil','../base/templates/template'],
	function(viewTemplate, $, OpenAPI, Util,Login,SocketUtil,_TU) {
		var CfDialog;
		
		return Piece.View.extend({
			id: 'home_SeAlertList',
			events:{
			},
			render: function() {
				$(this.el).html(viewTemplate);

				Piece.View.prototype.render.call(this);
				return this;
			},
			onLoadTemplate:function(){
				_TU._U.setHeader(_TU._T.home_SeAlertList);//替换头部导航
				var userInfoTemplate = $(this.el).find("#home_SeAlertList_Template").html();
				var userInfoHtml = _.template(userInfoTemplate, _TU._T.home_SeAlertList.data);
//				$(".content").html("");
//				$(".content").append(userInfoHtml);
			},
			onShow: function() {
				//write your business logic here :)
				this.onLoadTemplate();
				this.setView();//设置高度 
				
				
				//处理过期或者点击过消息
				var msgs=Piece.Store.loadObject("MSGS",true);
				if(msgs==null)msgs=new Array();
				
				
				//msgs[msgs.length]={"message":"红外警报","time":new Date(),"click":false,"type":"hw"};
				//msgs[msgs.length]={"message":"空气警报","time":new Date(),"click":false,"type":"kq"};
					var smsgs=msgs.sort(function(a,b){
						return a.time > b.time;
					});
					for(var i=0;i<smsgs.length;i++){
						if(i>10)break;//最多显示10条
						var divhtml='<div class="tt3 tt3-1"></div>';
						divhtml+='<div class="tt4"><div class="tt5">';
						divhtml+='<div>'+smsgs[i].time+'</div><div>'+smsgs[i].message+'</div>';
						divhtml+='</div></div>';
						if(smsgs[i].type=="hw"){//红外特别
						   var div=$("<div>").bind("tap",function(){
							  CfDialog=new Piece.Dialog
							  ({ 
					                 autoshow:  false, 
					                 target:  'body', 
					                 title:  '提示', 
					                 content:  '您是否要查看当前摄像头视频~' 
					                 }, 
									 { 
					                    configs:[{ 
					                           title:  "取消", 
					                           eventName:  'cancel' ,
					                       },{ 
					                           title:  "确定", 
					                           eventName:'ok' ,
					                       },
					                     ], 
					                     cancel:function()  { 
					                        CfDialog.hide(); 
					                     },
					                     ok:function()  { 
					                         //切换到视频页面
											 Backbone.history.navigate("magicbox/seVideo", {
            		                              trigger: true
            	                             });
					                     }
				             	});
							    CfDialog.show();
								//设置本条消息被浏览
								var check=$(this).attr("data-options");
							    for(var i=0;i<smsgs.length;i++){
									if((smsgs[i].message+"-"+smsgs[i].time)==check){
										smsgs.splice(i,1);
										Piece.Store.saveObject("MSGS",smsgs,true);
									}
								}
								//显示灰色
								$(this).find("div").eq(0).attr("class","tt3");
								$(this).find("div").eq(1).attr("class","tt4 tt4-1");
						   }).attr("class","tt2").attr("data-options",smsgs[i].message+"-"+smsgs[i].time).html(divhtml).appendTo(".tt0");
					    }
						else{
						   var div=$("<div>").bind("tap",function(){
							  //设置本条消息被浏览
							  var check=$(this).attr("data-options");
							    for(var i=0;i<smsgs.length;i++){
									if((smsgs[i].message+"-"+smsgs[i].time)==check){
										smsgs.splice(i,1);
										Piece.Store.saveObject("MSGS",smsgs,true);
									}
							  }
							  //显示灰色
							  $(this).find("div").eq(0).attr("class","tt3");
							  $(this).find("div").eq(1).attr("class","tt4 tt4-1");
						   }).attr("class","tt2").attr("data-options",smsgs[i].message+"-"+smsgs[i].time).html(divhtml).appendTo(".tt0");
						}
					}
				
			},
			setView:function(){
				var offset1=$(".tt0").offset();
				var offset2=$(".content").offset();
				if(offset1.height>offset2.height){
					$(".tt").css("height",offset.height+"px");
				}
			}
		}); //view define

	});