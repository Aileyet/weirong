define(['text!devicemanage/SeModelChoice.html',"zepto","../base/openapi", '../base/util',"../base/schema", "../base/templates/template","../base/i18nMain",'devicemanage/SeDevReName'],
	function(viewTemplate,$, OpenAPI, Util,Schema,_TU,I18n,SeDevReName) {
		return Piece.View.extend({
			id: 'devicemanage_SeModelChoice',
			render: function() {
				$(this.el).html(viewTemplate);

				Piece.View.prototype.render.call(this);
				return this;
			},
			Guid:function(){
				return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
				},
				GenerateGuid:function(){return this.Guid()+this.Guid()+this.Guid()+this.Guid()+this.Guid()+this.Guid()+this.Guid()+this.Guid();
			},
			onLoadTemplate:function(){
				_TU._U.setHeader(_TU._T.model_choice);
				var Model_choice_inf = $(this.el).find("#model_choice_inf").html();
				var Model_choice_event = _.template(Model_choice_inf, _TU._T.model_choice.data);
				$("#homelist_header").append(Model_choice_event);
				$(".auto").html(_TU._T.model_choice.data.auto);
			},
			onShow: function() {
				this.onLoadTemplate();//加载配置模板
				
				$(".auto").bind("touchstart",function(){
					 Backbone.history.navigate("devicemanage/SeAutoMatch", {trigger: true});
				});
				var devType='Ac';
				var brandId=1;
				var brandName="海信";
				var gatewayId="00-11-22-33-44-55";
		   	    var deviceIndex=0;
				if(Piece.Cache.get("deviceIndex")!=null)deviceIndex=Piece.Cache.get("deviceIndex");
				var devType=Schema.DeviceCatg[deviceIndex].apiType;
				if(Piece.Cache.get("deviceBrandId")!=null)brandId=Piece.Cache.get("deviceBrandId");
				if(Piece.Cache.get("deviceBrandName")!=null)brandName=Piece.Cache.get("deviceBrandName");
				if(Piece.Cache.get("gatewayId")!=null)gatewayId=Piece.Cache.get("gatewayId");
				var guid=this.GenerateGuid();
				
				//清除掉auto
				Piece.Cache.put("autoSearchId","");

	           Util.Ajax(OpenAPI.readIRCModels, "GET", {devType: devType, brandId:brandId},'jsonp',
                  function(data, textStatus, jqXHR)
                  {
                        for(var i=0;i<data.modelList.length;i++){
                            var template=$("#template").html();
                            template=template.replace("<%=name%>","<div class='brand-name-Chinese'>"+brandName+"("+data.modelList[i].modelName+")</div>");
                            var obj=$("<div>").attr("class","brand-list-box").html(template);
                            obj.attr("data-option-moduleid",data.modelList[i].modelId);//modelId
                            obj.bind("tap",function(){
                                  Piece.Cache.put("deviceSerial",guid);
                                  Piece.Cache.put("deviceModuleId",$(this).attr("data-option-moduleid"));
                                  //保存到object数据
                                  var equipList=Piece.Store.loadObject("DeviceList", true);
                                  if(equipList==null){
                                      equipList=new Array();
                                  }
                                  var loginId = Piece.Store.loadObject("loginId", true);
                                  equipList[equipList.length]={"loginId":loginId,"serial":guid,"device":Schema.DeviceCatg[deviceIndex].type,"name":"","gatewayId":gatewayId,"brandId":brandId,"moduleId":$(this).attr("data-option-moduleid")};
                                  Piece.Store.saveObject("DeviceList", equipList, true);//保存到本地存储
                                  //跳转
								  var seDevReName = new SeDevReName();
				                  seDevReName.show();	
                                  //Backbone.history.navigate("devicemanage/SeDevReName?prePage=SeModelChoice", {trigger: true});
                            });
                            obj.appendTo("#list");
                        }
                    }, function(e, xhr, type) {
		             	new Piece.Toast(I18n.Common.serverError);
	           });

			}
		});
	});