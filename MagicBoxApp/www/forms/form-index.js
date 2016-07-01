define(['text!../forms/form-index.html', "../base/openapi", '../base/util','../base/constant','../base/login/login'],
	function(viewTemplate, OpenAPI, Util,Cons,Login) {
	var myScroll = null;
	var scrollAll = null;
		return Piece.View.extend({
			id: 'forms_form-index',
			type : "forms",
			cityId:null,
			bankPointId:"",
			businessTypeIds:"",
			//事件绑定
			events: {
				"click .navigate-bar-inner" : "clickNavigate",
				"click #business" : "selectBusTypes",
//				"click #search_tempelete-list" : "clickTempList",
				"tap .cube-list-item" : "clickFormList",
				"click .back-index" : "backToIndex",				
				"click .business" : "selectBusiness",
				"tap #bankPoint" : "selectBankPoint",
				"tap #city" : "selectCity",
				"tap #save" : "save"
			},
			render: function() {
				$(this.el).html(viewTemplate);
				Piece.View.prototype.render.call(this);	
				return this;
			},
			//页面加载时触发
			onShow: function() {
				var me = this;
				Piece.View.prototype.onShow.call(this);
				$("#selectCondition").hide();
				$("#form_select").hide();
				$("#form_filled").hide();
				var login = new Login();
				var checkLogin = Util.checkLogin()
				if(checkLogin === false || Piece.TempStage.loginId() == null){
					login.show();
					new Piece.Toast('需登录才能填单');
				}
				else{	
						$("#form_filled").show();
						//城市、网点、业务渲染
						if(typeof(Piece.Cache.get("form-city")) != "undefined" &&
								Piece.Cache.get("form-city") != null){
							if(Piece.Cache.get("form-city").cityName != "" && Piece.Cache.get("form-city").cityName !=null){
								$('#cityResult').text(Piece.Cache.get("form-city").cityName);
							}
							this.cityId = Piece.Cache.get("form-city").cityId;
							var attr = Util.getCitySelectResult();
							var searchCond = Util.getBankSearchCondition();
							searchCond.cityName = Piece.Cache.get("form-city").cityName;
							searchCond.cityId   = Piece.Cache.get("form-city").cityId;
							searchCond.lng      = attr.lng;
							searchCond.lat      = attr.lat;
							Util.putBankSearchCondition(searchCond);
						}
						if(typeof(Piece.Cache.get("form-bankPoint")) != "undefined" &&
								Piece.Cache.get("form-bankPoint") != null){
							$('#bankPointResult').text(Piece.Cache.get("form-bankPoint").bankPointName);
							this.bankPointId = Piece.Cache.get("form-bankPoint").bankPointId;
							$("#form_select").show();
							if(Piece.Cache.get("form-bankPoint") != null && Piece.Cache.get("form-businessType") == null){
//								Util.loadList(this, 'search_tempelete-list', OpenAPI.searchFormPage, {
//									'appForm.bankPointId' : this.bankPointId,
//									'appForm.businessTypeIds' : this.businessTypeIds
//								}, false);
								Util.loadList(this, {
								    listName : 'search_tempelete-list', 
								    url :　OpenAPI.searchFormPage,
								    isFromService: false,
								    params : {
								    	'appForm.bankPointId' : this.bankPointId,
										'appForm.businessTypeIds' : this.businessTypeIds
									},
							    	items : [{
							    		text : "删除该选项",
							    		click : function(menu, event){
							    		}
							    	},{
							    		iconCls : "icon-book",
							    		text : "增加该选项",
							    		click : function(menu, event){
							    			
							    		}
							    	}]
								});
							}							
						}
						if(typeof(Piece.Cache.get("form-businessType")) != "undefined" &&
								Piece.Cache.get("form-businessType") != null){
							$('#businessTypeResult').text(Piece.Cache.get("form-businessType").typeNames);
							this.businessTypeIds = Piece.Cache.get("form-businessType").businessTypeIds;
							$("#businessTypeResult").data("businesstypeids",Piece.Cache.get("form-businessType").businessTypeIds);
							$("#form_select").show();
//							Util.loadList(this, 'search_tempelete-list', OpenAPI.searchFormPage, {
//								'appForm.bankPointId' : this.bankPointId,
//								'appForm.businessTypeIds' : this.businessTypeIds
//							}, false);
							Util.loadList(this, {
							    listName : 'search_tempelete-list', 
							    url :　OpenAPI.searchFormPage,
							    isFromService: false,
							    params : {
							    	'appForm.bankPointId' : this.bankPointId,
									'appForm.businessTypeIds' : this.businessTypeIds
								},
						    	items : [{
						    		text : "删除该选项",
						    		click : function(menu, event){
						    		}
						    	},{
						    		iconCls : "icon-book",
						    		text : "增加该选项",
						    		click : function(menu, event){
						    			
						    		}
						    	}]
							});
						}
						//判断是从已填表单或者表单模板跳转到form-input
						if(Piece.Cache.get("form-from") == "search"){
							$("#selectCondition").show();
							$("#form_filled").hide();
							$('#nav-tab-right').addClass("selected").siblings("li").removeClass("selected");
						}
						else{
							$("#selectCondition").hide();
							$("#form_filled").show();
							$("#form_select").hide();
//							Util.loadList(this, 'subsForm-list', OpenAPI.getSubsFormPage, {
//								'appForm.userLoginId' : Piece.TempStage.loginId()
//							}, true);
							Util.loadList(this, {
							    listName : 'subsForm-list', 
							    url :　 OpenAPI.getSubsFormPage,
							    isFromService: false,
							    params : {
							    	'appForm.userLoginId' : Piece.TempStage.loginId()
								},
						    	items : [{
						    		text : "删除该选项",
						    		click : function(menu, event){
						    		}
						    	},{
						    		iconCls : "icon-book",
						    		text : "增加该选项",
						    		click : function(menu, event){
						    			
						    		}
						    	}]
							});
							$('#nav-tab-left').addClass("selected").siblings("li").removeClass("selected");
						}
				}					
			},
			//点击表单搜索/已填表单
			clickNavigate : function (event) {
				var login = new Login();
				var checkLogin = Util.checkLogin()
				if(checkLogin === false || Piece.TempStage.loginId() == null){
					login.show();
					new Piece.Toast('需登录才能填单');
					return;
				}
				var li = Util.getParentNode(event, "li");
				var index = li.index();
				li.addClass("selected").siblings("li").removeClass("selected");
				
				if (index == 0) {
					$("#selectCondition").hide();
					$("#form_filled").show();
					$("#form_select").hide();
//					Util.loadList(this, 'subsForm-list', OpenAPI.getSubsFormPage, {
//						'appForm.userLoginId' : Piece.TempStage.loginId()
//					}, false);
					Util.loadList(this, {
					    listName : 'subsForm-list', 
					    url :　OpenAPI.getSubsFormPage,
					    isFromService: false,
					    params : {
					    	'appForm.userLoginId' : Piece.TempStage.loginId()
						},
				    	items : [{
				    		text : "删除该选项",
				    		click : function(menu, event){
				    		}
				    	},{
				    		iconCls : "icon-book",
				    		text : "增加该选项",
				    		click : function(menu, event){
				    			
				    		}
				    	}]
					});
				} else {
					$("#selectCondition").show();
					$("#form_filled").hide();
					if((typeof(Piece.Cache.get("form-bankPoint")) != "undefined" &&
							Piece.Cache.get("form-bankPoint") != null) || (typeof(Piece.Cache.get("form-businessType")) != "undefined" &&
									Piece.Cache.get("form-businessType") != null)){
						$("#form_select").show();
					}
//					this.requestFormTemplete();
//					Util.loadList(this, 'search_tempelete-list', OpenAPI.searchFormPage, {
//						'appForm.bankPointId' : Piece.TempStage.bankPointId()||"ABC_086330106001",
//						'appForm.businessTypeIds' : $("#businessTypeResult").data("businesstypeids")
//					}, true);
				}
			},
			
//			/**
//			 * 表单选择请求
//			 */
//			requestFormTemplete : function() {
//				var selects = Piece.Cache.get(Util.requestView());
//				var businessTypeIds = Util.getKeys(selects);
//				Util.loadList(this, 'search_tempelete-list', OpenAPI.searchFormPage, {
//					'appForm.bankPointId' : Piece.TempStage.bankPointId()||"ABC_086330106001",
//					'appForm.businessTypeIds' : businessTypeIds 
//				}, true);
//			},
			//点击选择业务
			selectBusTypes : function(event) {
//				var bankPointId =Piece.TempStage.bankPointId("ABC_086330106001");
				if (!this.bankPointId) {
					new Piece.Toast('请先选择网点');
					return;
				}				
////				Util.viewHtml(this, "set");
//				var view = Util.requestView();
//				this.navigate("/subscribes/subscribe-business-type?view=" +view, {
//					trigger: true
//				});
				Util.gotoPage(".sub-page", ".index-page");				
//				Util.loadList(this, 'subscribes-business-list', OpenAPI.getBusinessPage, {
//					'appForm.bankPointId' : this.bankPointId
//				}, false, function(){
//					Util.alreadySelect("businessTypeResult");
//				});
//				
				Util.loadList(this, {
				    listName : 'subscribes-business-list', 
				    url :　OpenAPI.getBusinessPage,
				    isFromService: false,
				    params : {
				    	'appForm.bankPointId' : this.bankPointId
					},
					callback:function(){
						Util.alreadySelect("businessTypeResult");
					},
//			    	items : [{
//			    		text : "删除该选项",
//			    		click : function(menu, event){
//			    		}
//			    	},{
//			    		iconCls : "icon-book",
//			    		text : "增加该选项",
//			    		click : function(menu, event){
//			    			
//			    		}
//			    	}]
				});
				
			},
			save : function() {
				Util.saveBusinessTypes("businessTypeResult");
				var businessType = {};
				businessType["typeNames"] = Piece.Cache.get("businessTypeResult" + "_typeNames");
				businessType["businessTypeIds"] = Piece.Cache.get("businessTypeResult" + "_businessTypeIds");
				Piece.Cache.put("form-businessType",businessType);
				this.businessTypeIds = Piece.Cache.get("businessTypeResult" + "_businessTypeIds");
//				Util.loadList(this, 'search_tempelete-list', OpenAPI.searchFormPage, {
//					'appForm.bankPointId' : this.bankPointId,
//					'appForm.businessTypeIds' : this.businessTypeIds
//				}, false);	
				Util.loadList(this, {
				    listName : 'search_tempelete-list', 
				    url :　OpenAPI.searchFormPage,
				    isFromService: false,
				    params : {
				    	'appForm.bankPointId' : this.bankPointId,
						'appForm.businessTypeIds' : this.businessTypeIds
					},
			    	items : [{
			    		text : "删除该选项",
			    		click : function(menu, event){
			    		}
			    	},{
			    		iconCls : "icon-book",
			    		text : "增加该选项",
			    		click : function(menu, event){
			    			
			    		}
			    	}]
				});
				this.backToIndex();
			},
			//点击选择网点
			selectBankPoint: function(event) {
				if (!this.cityId) {
					new Piece.Toast('请先选择城市');
					return;
				}	
				var view = Util.requestView();
				this.navigate("/bankmap/bank-search?view=" +view, {
					trigger: true
				});
				$('#businessTypeResult').text("还未选");
				Piece.Cache.put("form-businessType",null);
			},
			//点击选择城市
			selectCity: function(event) {
				var view = Util.requestView();				
				this.navigate("/bankmap/zone-select?view=" +view, {
					trigger: true
				});
				$('#bankPointResult').text("还未选");
				Piece.Cache.put("form-bankPoint",null);
				$('#businessTypeResult').text("还未选");
				Piece.Cache.put("form-businessType",null);
			},
			//点击List
			clickFormList:function(event){
				var cardNode = Util.getParentNode(event, ".dealcard");
				var formId = cardNode.data("formid");
				var formTempId = cardNode.data("formtempid");
				var formTempName = cardNode.data("formtempname");
				if(formTempId == null){
					return;
				}
				Piece.TempStage.subsId("null");
				//点击已填表单
				if(formId != null && formId != "null"){
					Piece.Cache.put("form-from","filled");
					this.navigate("/forms/form-input?formId=" + formId+"&formTempId=" + formTempId +"&formTempName="+encodeURI(formTempName), {
						trigger: true
					});
				}
				//点击表单模板
				else{
					Piece.Cache.put("form-from","search");
					this.navigate("/forms/form-input?formTempId=" + formTempId + "&formTempName="+encodeURI (formTempName), {
						trigger: true
					});
				}
			},
			//业务选择页面选择业务
			selectBusiness : function(event) {
				this["businessTypeResult"] = Util.select(event, "businessTypeResult");
			},
			//业务页面点击返回
			backToIndex : function() {
				Util.gotoPage(".index-page", ".sub-page");								
			},
	});
}); //view define