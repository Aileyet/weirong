define(['text!forms/form-input.html', "../base/openapi", '../base/util'],
	function(viewTemplate, OpenAPI, Util) {
		return Piece.View.extend({
			id: 'forms_form-input',
			componentType:{},
			formTempItem:{},
			FrequentContacts:{},
			nameIds :{},
			cardIds :{},
			itemId_name :"",
			itemId_card :"",
			formTempId:null,
			formId:null,
			goDlg:null,
			label_first:true,
			form_InputType:{
				CHINESE: "CHINESE",        //中文
				PINYING :"PINYING",        //拼音(英文、空格)
				ENGLISHNUMBER: "ENGLISHNUMBER",  //英数
				NUMBER:"NUMBER",         //数字
				EMAIL:"EMAIL",          //电子邮件
				TELEPHONE: "TELEPHONE",      //电话
				MOBILEPHONE:"MOBILEPHONE",    //手机
				URL:"URL",            //主页地址
				ID: "ID",             //身份证
				CARDNUMBER:"CARDNUMBER",     //卡号
				POSTCODE:"POSTCODE",       //邮编
				CURRENCY:"CURRENCY",       //货币/金额
				DATE:"DATE",           //日期
				TIME :"TIME",           //时间
				DATETIME:"DATETIME",       //日期时间
				ANY:"ANY",             //任意
				AMOUNT_IN_FIGURES:"AMOUNT_IN_FIGURES", //小写金额
				AMOUNT_IN_WORDS:"AMOUNT_IN_WORDS"	//大写金额
		    },			
			gCurrItem :{info:null, jObj:null}, // 当前item
			events: {
				"change .form-select" : "changeCombox",
				"click .form-checkbox" : "changeCheckbox",
				"click .cb-enable" : "clickCbEnable",
				"click .cb-disable" : "clickCbDisable",
				"click #form-right-submit" : "clickFormSubmit",
				"blur .form-input" : "blurFormInput",
				"click .form-span-select" : "clickSpanSelect",
				"click .userName" : "selectName",
				"click .cardNumber" : "selectCard",
				"click .back-index" : "gotoIndex",				
				"focus .input-select" : "focusInputSelect",
				"click .icon-down" : "clickIconDown",	
				
			},
			render: function() {
				$(this.el).html(viewTemplate);
				Piece.View.prototype.render.call(this);	
				return this;
			},
			onShow: function() {				
				var me = this;				
				Piece.View.prototype.onShow.call(this);
				me.nameIds = {};
				me.cardIds = {};
				me.formTempItem = {};	
				me.FrequentContacts = {};
				me.formTempId = Util.request("formTempId");
				me.formId = Util.request("formId");
				$('#nav-header').html( decodeURI(Util.request("formTempName")));
				var isReadOnly = Util.request("readonly");
				
				if (isReadOnly == "true") {
					$("#form_content").find(".form-input").attr("readOnly", "readOnly");
				}
				//获取表单控件类型
				Util.Ajax(OpenAPI.getcomponent, "GET", {					
				}, 'jsonp', function(data, textStatus, jqXHR) {
					for(var i in data.dataList){
						var componentTypeId = data.dataList[i].componentTypeId;
						me.componentType[componentTypeId] = componentTypeId;
						//me.createCtrlHtml(componentTypeId);
					}
					//获取表单项目
					me.getTempItemList(me.formTempId,me.formId);
				}, null, null);
				

				//获取常用联系人
				Util.Ajax(OpenAPI.getFrequentContacts, "GET", {
					"appForm.userLoginId" : Piece.ZTake.loginId()||-1
				}, 'jsonp', function(data, textStatus, jqXHR) {
					var index = 1;
					for(var i in data.dataList){
						var contactName = data.dataList[i].contactName;
						var contactTypeId = data.dataList[i].contactTypeId;
						var userId = data.dataList[i].userId;
						var frequentContact = {};
						frequentContact["contactName"] = contactName;
						frequentContact["contactTypeId"] = contactTypeId;
						frequentContact["userId"] = userId;						
						me.FrequentContacts[i] = frequentContact;
					}					
				}, null, null);				
				me.goDlg = new Piece.Dialog(
						{
							autoshow:false, // 是否初始化时就弹出加载控件
							target:"#forms_form-input", //页面目标组件标识  
							title: "是否作为个人信息保存",//弹出框标题  
							content:"",//弹出框提示文字
						},{
							configs:[{title:"是", eventName:"yes"},
							         {title:"否", eventName:"no"}],
							yes:function(){
									//保存常用联系人
									me.saveContacts();									
							},
							no:function(){
								Piece.Cache.put("form-from","");
								me.navigate("/forms/form-index?inputResult=success" , {
									trigger: true
								});
							}
					});
				
								
			},
			
			
			saveContacts:function(){
				var me = this;
				var contactsList = {};
				var inputList = $('.form-input');
				var selectList = $('.form-select');
				var textareatList = $('.form-textarea');
				var enableList = $('.cb-enable');
				var index_l = 0;
				for(var k =0;k < inputList.size();k++){
					if(($(inputList[k]).attr('contactTypeId') == "NAME" || $(inputList[k]).attr('contactTypeId') == "ACCOUNT_NAME")
						&& $(inputList[k]).attr('parentComponentTypeId') == "LABEL"
						&& inputList[k].value != ""){
						 var parentItemId = $(inputList[k]).attr('parentItemId');
						 var contacts = [];					 
						 var index = 0;
						 for(var i =0;i < inputList.size();i++){
							 if($(inputList[i]).attr('parentItemId') == parentItemId 
									 && $(inputList[i]).attr('parentComponentTypeId') == "LABEL"
									 && $(inputList[i]).attr('contactTypeId') != "OTHER"){
								 var contact = {};
								 contact["contactTypeId"] = $(inputList[i]).attr('contactTypeId');
								 contact["value"] =  inputList[i].value;
								 contacts[index++] = contact;
							 }
						 }
						 for(var i =0;i < selectList.size();i++){
							 for(var j=1;j<selectList[i].length;j++){
								 if($(selectList[i][j]).attr("contactTypeId") != "OTHER" 
									 	 && $(selectList[i]).attr('parentItemId') == parentItemId
									 	 && $(selectList[i]).attr('parentComponentTypeId') == "LABEL"
										 && selectList[i][j].selected == true){
									 var contact = {};
									 contact["contactTypeId"] = $(selectList[i][j]).attr("contactTypeId");
									 contact["value"] = selectList[i][j].text;
									 contacts[index++] = contacts; 
								 }								 
							 }
							 
						 }
						 for(var i =0;i < textareatList.size();i++){
							 if($(textareatList[i]).attr('parentItemId') == parentItemId 
									 && $(textareatList[i]).attr('parentComponentTypeId') == "LABEL"
									 && $(textareatList[i]).attr('contactTypeId') != "OTHER"){
								 var contact = {};
								 contact["contactTypeId"] = $(textareatList[i]).attr('contactTypeId');
								 contact["value"] =  textareatList[i].value;
								 contacts[index++] = contact;
							 }
						 }
						// contactsList[index_l++] = contacts;
						 
						 Util.Ajax(OpenAPI.saveContacts, "GET", {
								"contactsForm.contactsList" : JSON.stringify(contacts),
								"contactsForm.userLoginId" : Piece.ZTake.loginId()
							}, 'jsonp', function(data, textStatus, jqXHR) {
								if(data.errCode == "0"){
									new Piece.Toast('提交联系人成功');
									//发送APP登录者信息
									 me.sendContacts();
								}
								else{
									new Piece.Toast('提交联系人失败');
								}
								Piece.Cache.put("form-from","");
								me.navigate("/forms/form-index?inputResult=success" , {
									trigger: true
								});
							}, null, null);						 
					}
				}
			},
			//获取表单项目
			getTempItemList:function(formTempId,formId){
				var me = this;
				Util.Ajax(OpenAPI.tempItemList, "GET", {
					"appForm.formTempId":formTempId,
				}, 'jsonp', function(data, textStatus, jqXHR) {
					if(data != null){
							var sequenceId_pre = "";
							var parentItemId_pre = "";
							var componentTypeId_pre = "";
							var item = {};
							var itemSelect = {};
							var index = 0;
							for(var i in data.dataList){
								var eachdata = data.dataList[i];
								var itemAlias = eachdata.itemAlias;							
								var componentTypeId = eachdata.componentTypeId;
								var parentComponentTypeId = eachdata.parentComponentTypeId;
								var sequenceId =  parseInt(eachdata.sequenceId);							
								var suffixLable = eachdata.suffixLable;							
								var parentItemId = eachdata.parentItemId;
								var groupSequenceId = eachdata.groupSequenceId;	
								var itemId = eachdata.item;	
								var inputType = eachdata.inputType;	
								var length = eachdata.length;	
								var mustCheck = eachdata.mustCheck;	
								var prefixLable = eachdata.prefixLable;	
								var parentSequenceId = eachdata.parentSequenceId;
								var sampleData = eachdata.sampleData;
								var contactTypeId = eachdata.contactTypeId;
								var selectOption = [];
								var preSelectOption = [];
								//判断是否为下一行
								if(parentItemId_pre != parentItemId && componentTypeId_pre =="RADIOBOX" || componentTypeId_pre =="CHECKBOX"){
									index++;
								}	
								//判断是否为下拉列表
								if(sequenceId == sequenceId_pre && 
										parentItemId == parentItemId_pre && 
										componentTypeId_pre == componentTypeId && 
										componentTypeId_pre =="RADIOBOX"){
									 item["parentItemId"] = parentItemId;
									 preSelectOption["suffixLable"] = data.dataList[i-1].suffixLable;
									 preSelectOption["inputType"] = data.dataList[i-1].inputType;
									 preSelectOption["contactTypeId"] = data.dataList[i-1].contactTypeId
									 itemSelect["" + data.dataList[i-1].item ] = preSelectOption;
									 selectOption["suffixLable"] = suffixLable;
									 selectOption["inputType"] = inputType;
									 selectOption["contactTypeId"] = contactTypeId
									 itemSelect["" + eachdata.item] = selectOption;
									 item.itemSelect = itemSelect;
									 if(mustCheck == "Y"){
											item["mustCheck"] = mustCheck;
										}
									 item["itemAlias"] = itemAlias;
									 item["componentTypeId"] = componentTypeId;
									 item["sequenceId"] = sequenceId;
									 item["contactTypeId"] = contactTypeId;
									 if(typeof(parentItemId) != "undefined" && 
											 parentItemId != null){
										 item["parentItemId"] = parentItemId;
										 item["parentComponentTypeId"] = parentComponentTypeId;										 
									 }									 
									 me.formTempItem[sequenceId+index] = item;
								}else{
									itemSelect = {};
									item = {};
									//判断是否有父控件标识
									if(parentItemId != null && parentComponentTypeId != "LABEL"){									
										for(var i in data.dataList){
											if(parentItemId == data.dataList[i].item ){
												item["inputType"] = data.dataList[i].inputType;
												break;
											}
										}
									}
									//判断是否有父序号
									else if(parentSequenceId != null){
										item["parentSequenceId"] = parentSequenceId;								
										item["inputType"] = inputType;
									}
									else{
										item["inputType"] = inputType;
									}
									if(mustCheck == "Y"){
										item["mustCheck"] = mustCheck;
									}
									item["parentItemId"] = parentItemId;
									item["itemAlias"] = itemAlias;
									item["componentTypeId"] = componentTypeId;
									item["parentComponentTypeId"] = parentComponentTypeId;	
									item["suffixLable"] = suffixLable;
									item["itemId"] = itemId;									
									item["length"] = length;
									item["contactTypeId"] = contactTypeId;
									item["sampleData"] = sampleData;
									item["prefixLable"] = prefixLable;
									item["contactTypeId"] = contactTypeId;
									
									me.formTempItem[sequenceId+index] = item;
									sequenceId_pre = sequenceId;
									parentItemId_pre = parentItemId;
									componentTypeId_pre = componentTypeId;
									item = {};
								}
							}
							for(var i in me.formTempItem){
								$("#form_content").append(me.createCtrlHtml(me.formTempItem[i],i));
							}
							//获取登录者nickName填充姓名和户名
							var user_token = Piece.Store.loadObject("user_token", true);
							Util.Ajax(OpenAPI.getLoginCardNumber, "GET", {
								"appForm.userLoginId":Piece.ZTake.loginId(),
								"appForm.userId":user_token.userId
								}, 'jsonp', function(data, textStatus, jqXHR) {
									var inputList = $('.form-input');
									if(user_token.nickName != "null" && user_token.nickName != null ){
										for(var i = 0; i < inputList.size();i++){
											if($(inputList[i]).attr('contacttypeid') == "ACCOUNT_NAME" || $(inputList[i]).attr('contacttypeid') == "NAME"){											
												if(user_token != null && user_token != "undefined"){
													if(user_token.nickName!= null && user_token.nickName != "undefined" && inputList[i].value == "" && $(inputList[i].parentNode).attr('style') != "display:none"){
														inputList[i].value = user_token.nickName;
														}
												}											
											}
										}
									}
									if(data.loginCardNumber != "null" && data.loginCardNumber != null){
										for(var i = 0; i < inputList.size();i++){
											if($(inputList[i]).attr('contacttypeid') == "BANK_CARD_NUMBER" && data != null && inputList[i].value == "" && $(inputList[i].parentNode).attr('style') != "display:none"){
												if(data.loginCardNumber != "undefined"){
													inputList[i].value = data.loginCardNumber;
													break;
												}											
											}
										}	
									}
									
								});															
							
							
					}
					if(formId != null && formId != "null"){
						//获取表单项目内容
						me.getTempItemContents(formId);	
					}
					else{
						var selectList = $('.form-select');
						for(var i = 0; i< selectList.size();i++){
							new Piece.VSelect({
								id : selectList[i].attributes[2].value ,
								preset : "select",
								inputClass :"input-select"
							});
						}
					}
					
				}, null, null);
				
			},
			
			
			//获取表单项目内容
			getTempItemContents:function(formId){
				var me = this;
				Util.Ajax(OpenAPI.getTempItemContents, "GET", {
					"appForm.subsFormItemId.formId":formId,
				}, 'jsonp', function(data, textStatus, jqXHR) {
					var itemContents = data.dataList;
					for(var key in itemContents){
						var itemId = itemContents[key].subsFormItemId.item;
						var itemValue = itemContents[key].itemValue;
						var inputList = $('.form-input');
						var selectList = $('.form-select');
						var textareatList = $('.form-textarea');
						var checkList = $('.form-check-label');
						var index = 0;
						var flag = 0;
						for(var i =0;i < inputList.size();i++){
							 if( itemId == inputList[i].attributes[1].value){
								 	inputList[i].value = itemValue;
								 	$(inputList[i].parentNode).attr("style","")
								 	flag = 1;
								 	break;
								 }
							 
						 }
						if(flag == 1){
							continue;
						}
						for(var i =0;i < textareatList.size();i++){
							 if( itemId == textareatList[i].attributes[1].value){
								 textareatList[i].value = itemValue;
								 	$(textareatList[i].parentNode).attr("style","")
								 	flag = 1;
								 	break;
								 }
							 
						 }
						if(flag == 1){
							continue;
						}
						if(itemValue == "Y"){							
							for(var i =0;i < selectList.size();i++){
								 for(var j=1;j<selectList[i].length;j++){
									 if(itemId == selectList[i][j].value){
										 selectList[i][0].selected = false;
										 selectList[i][j].selected = true;
										 var id = selectList[i].attributes[2].value;
										 $("#"+id).val(itemId);
										 $(selectList[i].parentNode).attr("style","")
										 flag = 1;
										 //改变子控件的inputtype
										 var parentItemId = selectList[i][j].value;
										 var inputType = $(selectList[i][j]).attr("inputtype");
										 var parentSquenceId = $(selectList[i]).attr("sequenceId");
										 for(var i =0;i < inputList.size();i++){
											 if($(inputList[i]).attr("parentitemid") == parentItemId || $(inputList[i]).attr("parentsequenceid") == parentSquenceId){
												 var inputTypeObj = {};
												 inputTypeObj["inputType"] = inputType;
												 $(inputList[i]).removeAttr("inputType");
												 $(inputList[i]).removeAttr("onkeyup");
												 inputList[i].outerHTML = inputList[i].outerHTML.substr(0,inputList[i].outerHTML.length-1) + me.findInputType(inputTypeObj) +">";												 
											 }
										 }
										 break;
									 }
								 }							 
							 }
						}
						if(flag == 1){
							continue;
						}
						for(var i =0;i < checkList.size();i++){	
							if(itemValue == "Y"){
								 if(itemId == checkList[i].attributes[0].value.split("_")[1]){
									$(checkList[i].childNodes[1]).removeClass('selected');
									$(checkList[i].childNodes[0]).addClass('selected');
									$(checkList[i].parentNode).attr("style","")
									break;								 
								 }	
							}
						 }
					}
					var selectList = $('.form-select');
					for(var i = 0; i< selectList.size();i++){
						new Piece.VSelect({
							id : selectList[i].attributes[2].value ,
							preset : "select",
							inputClass :"input-select"
						});
					}
				}, null, null);
			},
			
			//下拉列表框内值发生变化
			changeCombox : function(event){
				var me = this;
				var inputList = $('.form-input');
				var target = event.currentTarget ;
				var id = target.id ; 
				var selectKey ;
				for(var i= 0 ;i<target.length;i++){
					if(typeof(target[i].selected) == "undefined"){
						continue;
					}
					if(target[i].selected == true){
						selectKey = target[i].value;
						//改变子控件的inputtype
						var parentItemId = target[i].value;
						var inputType = $(target[i]).attr("inputtype");
						var parentSquenceId = $(target[i].parentNode).attr("sequenceId");
						for(var k =0;k < inputList.size();k++){
							 if($(inputList[k]).attr("parentitemid") == parentItemId || $(inputList[k]).attr("parentsequenceid") == parentSquenceId){
								 var inputTypeObj = {};
								 inputTypeObj["inputType"] = inputType;
								 $(inputList[k]).removeAttr("inputType");
								 $(inputList[k]).removeAttr("onkeyup");
								 inputList[k].outerHTML = inputList[k].outerHTML.substr(0,inputList[k].outerHTML.length-1) + me.findInputType(inputTypeObj) +">";												 
							 }
						}
						for(var j in me.formTempItem){
							if(me.formTempItem[j].parentItemId != null && me.formTempItem[j].parentItemId == selectKey){
								$('#div_'+j).show();
								var child = $('#div_'+j)[0].childNodes[1];								
								if(me.formTempItem[j].mustCheck){
									$(child).attr("required","required");	
								}								
							}
						}
					}
					else if(target[i].selected == false){
						selectKey = target[i].value;
						for(var j in me.formTempItem){
							if(me.formTempItem[j].parentItemId != null && me.formTempItem[j].parentItemId == selectKey){
								$('#div_'+j).hide();								
								var child = $('#div_'+j)[0].childNodes[1];
								child.value = null;
								$(child).removeAttr("required");
							}
						}
					}
				}
			},
//			//checkbox改变
//			changeCheckbox : function(event){
//				var me = this;
//				var target = event.currentTarget ;
//				var checked ;				
//				if(typeof(target.checked) == "undefined"){
//					return;
//				}
//				if(target.checked == true){
//					checked = target.value;
//					for(var j in me.formTempItem){
//						if(me.formTempItem[j].parentItemId != null && me.formTempItem[j].parentItemId == checked){
//							$('#'+j).show();
//							$('#'+j).attr("required","required");
//						}
//					}
//				}
//				else if(target.checked == false){
//					checked = target.value;
//					for(var j in me.formTempItem){
//						if(me.formTempItem[j].parentItemId != null && me.formTempItem[j].parentItemId == checked){
//							$('#'+j).hide();
//							$('#'+j).attr("required","");
//						}
//					}
//				}			
//			},
			//创建html内容
			createCtrlHtml : function(formTempItem,index){
				var isHide = "";
				var me = this;
				switch(formTempItem.componentTypeId){
					case me.componentType.PASSWORD:
					case me.componentType.TEXTBOX:
						var maxlength = "maxlength='"+formTempItem.length+"' ";
						var isMustCheck = "";						
						var inputType =  me.findInputType(formTempItem) ;
						var span = "";
						if(formTempItem.contactTypeId == "BANK_CARD_NUMBER" || formTempItem.contactTypeId == "NAME"){
							//span = "<span class='icon-chevron-right triangle form-span-select'></span>";
							span = "<img class='icon-right form-span-select' src='../piece/images/right.png'>";
						}
						//判断是否有parentItemId
						if(formTempItem.parentItemId && formTempItem.parentComponentTypeId != "LABEL"){
							isHide="display:none";
//							for(var i in me.formTempItem){
//								if(me.formTempItem[i].itemId == formTempItem.parentItemId ){
//									if(me.formTempItem[i].componentTypeId == "LABEL"){
//										isHide = "";
//									}
//								}
//							}
//							
//							//isMustCheck = "required='' ";
						}
						var html = "<div id='div_"+ index +"' style='" +isHide +"'>"
						var writing = "";
						html += "<label class='form-label'>";
						//判断是否有别名
						if(formTempItem.itemAlias != ""){
							writing += formTempItem.itemAlias+ ":" ;
							}
						//判断是否有后缀
						if(formTempItem.suffixLable != ""){
							writing += formTempItem.suffixLable+ ":";
							}
						//判断是否为必填项
						if(formTempItem.mustCheck){
							html += "<font color='red'>*</font>" + writing+ "</label>";
							isMustCheck = "required='required' ";
						}						
						else{
							html += "<pre> "+ writing+"</pre>"+"</label>";
						}
						//判断是否有parentItemId
						if(formTempItem.parentItemId && formTempItem.parentComponentTypeId != "LABEL"){
							isMustCheck = "";
						}
						html += "<input class='form-input'  " 
							+" name='"+ formTempItem.itemId 
							+"' "+inputType 
							+ " "+isMustCheck+  maxlength 
							+ "  placeholder='"+formTempItem.sampleData 
							+ "' contactTypeId='"+ formTempItem.contactTypeId
							+ "' parentSequenceId='"+ formTempItem.parentSequenceId	
							+ "' parentItemId='"+ formTempItem.parentItemId	
							+ "' sequenceId='"+ formTempItem.sequenceId	
							+ "' itemId='"+ formTempItem.itemId	
							+ "' parentComponentTypeId='"+ formTempItem.parentComponentTypeId	
							+ "' componentTypeId='"+ formTempItem.componentTypeId	
							+"'/>" 
							+ span
							+"</div>";
						return html;
					case me.componentType.RADIOBOX:
						var i = 0;
						var isMustCheck = "";
						var isNull = "";
						if(formTempItem.mustCheck){
							html += "<font color='red'>*</font>" + writing+ "</label>";
							isNull = "disabled='true'";
						}		
						if(formTempItem.parentItemId && formTempItem.parentComponentTypeId != "LABEL"){
							isHide="display:none";
						}
						var html = "<div id='div_"+ index +"' style='" 
							+isHide + "'>"
							+"<label class='form-label'>";
						//判断是否为必填项
						if(formTempItem.mustCheck){
							html += "<font color='red'>*</font>";
							html += formTempItem.itemAlias+ ":" 
							+ "</label>" ;
							isMustCheck = "required='required' ";
						}
						else{
							html += "<pre> "+ formTempItem.itemAlias+ ":"+"</pre>"+"</label>";
						}
						//判断是否有parentItemId
						if(formTempItem.parentItemId && formTempItem.parentComponentTypeId != "LABEL"){
							isMustCheck = " ";
						}						
						if (formTempItem.itemSelect != null){
							html += "<select class='form-select' name='select' " +
									"id='"+"form-select-"+ index +"' style='width:50%' "
									+isMustCheck 	
									+" contactTypeId='"+ formTempItem.contactTypeId
									+"' sequenceId='"+ formTempItem.sequenceId
									+"' parentItemId='"+ formTempItem.parentItemId
									+"' parentComponentTypeId='"+ formTempItem.parentComponentTypeId
									+"'>";
							html += "<option value='' selected='true' "+isNull+ ">&nbsp;&nbsp;&nbsp;&nbsp请选择</option> ";
							for(var key in formTempItem.itemSelect){  
								html += "<option  value='" + key 
								+"' inputType='"+ formTempItem.itemSelect[key].inputType 
								+"' contactTypeId='"+ formTempItem.itemSelect[key].contactTypeId 
								+ "'>" 
								+ formTempItem.itemSelect[key].suffixLable +"</option>";		
							}
							html += "</select >"
							//+"<span class='icon-chevron-right triangle form-span-select'></span>"
							+"<img class='icon-down' src='../piece/images/down.png'>"
							+"</div>";								
						}
					return html;
					case me.componentType.CHECKBOX:
						var isMustCheck = "";
						//判断是否有parentItemId
						if(formTempItem.parentItemId && formTempItem.parentComponentTypeId != "LABEL"){
							isHide="display:none";
						}
						var html =  "<div  id='div_"+ index +"' style='height:initial;"+isHide+"'>"
						+"<label class='form-label' >";
						var writing = "";
//						if(formTempItem.itemAlias != ""){
//							writing += formTempItem.itemAlias+ ":";
//						}
						if(formTempItem.suffixLable != ""){
							writing += formTempItem.suffixLable+ ":";
						}
						if(formTempItem.mustCheck){
							html += "<font color='red'>*</font>" + writing+ "</label>";
						}
						else{
							html += "<pre> "+ writing+"</pre></label>";
						}	
						html += "<p  id='check_"+formTempItem.itemId+"' class='field switch form-check-label' >"
						+"<label id='cb-enable_"+ formTempItem.itemId +"' class='cb-enable '><span>是</span></label>"
						+"<label id='cb-disable_"+ formTempItem.itemId +"' class='cb-disable selected'><span>否</span></label>"						
						+"</p></div>";
//						html += "<input class='form-checkbox' type='checkbox' value='" 
//						+ formTempItem.itemId 
//						+ "'/></div>";
						return  html;
					case me.componentType.TEXTAREA:
						var maxlength = "maxlength='"+formTempItem.length+"' ";
						var isMustCheck = "";						
						var inputType =  me.findInputType(formTempItem) ;
						//判断是否有parentItemId
						if(formTempItem.parentItemId && formTempItem.parentComponentTypeId != "LABEL"){
							isHide="display:none";
//							for(var i in me.formTempItem){
//								if(me.formTempItem[i].itemId == formTempItem.parentItemId ){
//									if(me.formTempItem[i].componentTypeId == "LABEL"){
//										isHide = "";
//									}
//								}
//							}
//							
//							//isMustCheck = "required='' ";
						}
						var html = "<div id='div_"+ index +"' style='" +isHide +"'>"
						var writing = "";
						html += "<label class='form-label'>";
						//判断是否有别名
						if(formTempItem.itemAlias != ""){
							writing += formTempItem.itemAlias+ ":" ;
							}
						//判断是否有后缀
						if(formTempItem.suffixLable != ""){
							writing += formTempItem.suffixLable+ ":";
							}
						//判断是否为必填项
						if(formTempItem.mustCheck){
							html += "<font color='red'>*</font>" + writing+ "</label>";
							isMustCheck = "required='required' ";
						}						
						else{
							html += "<pre> "+ writing+"</pre>"+"</label>";
						}
						//判断是否有parentItemId
						if(formTempItem.parentItemId && formTempItem){
							isMustCheck = "";
						}
						html += "<textarea class='form-textarea'  " 
							+" name='"+ formTempItem.itemId 
							+"' "+inputType 
							+ " "+isMustCheck+  maxlength 
							+ "  placeholder='"+formTempItem.sampleData 
							+ "' contactTypeId='"+ formTempItem.contactTypeId
							+ "' parentSequenceId='"+ formTempItem.parentSequenceId	
							+ "' parentItemId='"+ formTempItem.parentItemId	
							+ "' sequenceId='"+ formTempItem.sequenceId	
							+ "' itemId='"+ formTempItem.itemId	
							+ "' parentComponentTypeId='"+ formTempItem.parentComponentTypeId	
							+ "' componentTypeId='"+ formTempItem.componentTypeId	
							+"'/>" 
							+"</div>";
						return html;
						
					case me.componentType.LABEL:
						var html = "";
						var hrStyle = "";
						var hr = "";
						var style = "";
						if(formTempItem.parentItemId){
							hrStyle = "class = 'hr-min'";
						}
						else{
							hrStyle = "class = 'hr-max'";
						}
						if(me.label_first){
							style = "style = 'margin-top: 20px'"; 
							me.label_first = false;
						}
						else{
							hr = "<hr "+hrStyle+">";
						}						
						html ="<div id='div_"+ index +"'>"
						+ hr 
						+"<label class='form-label-title' "
						+" itemId='" + formTempItem.itemId
						+"' parentItemId='" + formTempItem.parentItemId	
						+"'><pre "
						+ style
						+">"
						+ formTempItem.itemAlias						
						+"</pre>" 						
						+"</label>" 
						
						+"</div>";
						return html;
					default:
					}
			},	
			//checkbox 点击是
			clickCbEnable:function(event){
				var me = this;
				var parent = Util.getParentNode(event, '.switch');
				var id = event.currentTarget.id;
				$('.cb-disable',parent).removeClass('selected');
				$('#'+id).addClass('selected');
			//	$('.checkbox',parent).attr('checked', true);
				var checked = id.split("_")[1];
				for(var j in me.formTempItem){
					if(me.formTempItem[j].parentItemId != null && me.formTempItem[j].parentItemId == checked){
						$('#div_'+j).show();
						var child = $('#div_'+j)[0].childNodes[1];								
						if(me.formTempItem[j].mustCheck){
							$(child).attr("required","required");
						}
					}
				}
			},
			
			//checkbox 点击否
			clickCbDisable:function(event){
				var me = this;
				var parent = Util.getParentNode(event, '.switch');
				var id = event.currentTarget.id;
				$('.cb-enable',parent).removeClass('selected');
				$('#'+id).addClass('selected');
				//$('.checkbox',parent).attr('checked', false);
				var checked = id.split("_")[1];
				for(var j in me.formTempItem){
					if(me.formTempItem[j].parentItemId != null && me.formTempItem[j].parentItemId == checked){
						$('#div_'+j).hide();								
						var child = $('#div_'+j)[0].childNodes[1];
						child.value = null;
						$(child).removeAttr("required");
					}
				}
			},
			//点击提交保存按钮
			clickFormSubmit:function(){
				 if(!this.verification()){
					 return;
				 }
				 var me = this;
				 var formTempList = [];
				 var inputList = $('.form-input');
				 var selectList = $('.form-select');
				 var textareatList = $('.form-textarea');
				 var enableList = $('.cb-enable');
//				 var disableList = $('.cb-disable');
				 var index = 0;
				 //input类型存入
				 for(var i =0;i < inputList.size();i++){
					 var formTemp = {};
					 formTemp["item"] = inputList[i].attributes[1].value;
					 if(inputList[i].value == null || inputList[i].value.length == 0){
						 continue;
					 }
					 formTemp["itemValue"] = inputList[i].value;
					 formTempList[index++] = formTemp;
				 }
				 for(var i =0;i < selectList.size();i++){
					 for(var j=1;j<selectList[i].length;j++){
						 var formTemp = {};
						 formTemp["item"] = selectList[i][j].value;
						 formTemp["itemValue"] = selectList[i][j].selected;
						 formTempList[index++] = formTemp; 
					 }					 
				 }
				 for(var i =0;i < textareatList.size();i++){
					 var formTemp = {};
					 formTemp["item"] = textareatList[i].attributes[1].value;
					 if(textareatList[i].value == null || textareatList[i].value.length == 0){
						 continue;
					 }
					 formTemp["itemValue"] = textareatList[i].value;
					 formTempList[index++] = formTemp;					 
				 }
				 for(var i =0;i < enableList.size();i++){
					 var formTemp = {};
					 formTemp["item"] = enableList[i].attributes[0].value.split("_")[1];
					 if(enableList[i].attributes[1].value.replace(/\s/g, "") == "cb-enableselected"){
						 formTemp["itemValue"] = "Y";
					 }
					 else if(enableList[i].attributes[1].value.replace(/\s/g, "") == "cb-enable"){
						 formTemp["itemValue"] = "N";
					 }
					 formTempList[index++] = formTemp;					 
				 }
				 Util.Ajax(OpenAPI.saveForm, "GET", {
						"subsForm.subsFormItemList" : JSON.stringify(formTempList),
						"subsForm.formTempId" : Util.request("formTempId"),
						"subsForm.formId" : Util.request("formId"),
						"subsForm.userLoginId" : Piece.ZTake.loginId(),
						"subsForm.subsId" : Piece.ZTake.subsId()
					}, 'jsonp', function(data, textStatus, jqXHR) {
						if(data.errCode == "0"){
							new Piece.Toast('提交成功');	
							me.goDlg.show();
							$(".cube-dialog-screen").unbind("click");

						}
						else{
							new Piece.Toast('提交失败');
						}
						 //发送APP登录者信息
						 me.sendContacts();
					}, null, null);
				
				
			},	
			
			
			
			//发送APP登录者信息
			sendContacts:function(){
				 Util.Ajax(OpenAPI.sendContacts, "GET", {
						"contactsForm.formTempId" : Util.request("formTempId"),
						"contactsForm.userLoginId" : Piece.ZTake.loginId(),
					}, 'jsonp', function(data, textStatus, jqXHR) {
						
					}, null, null);
			},
			
			
			//输入类型
			findInputType:function(formTempItem){
				var me = this;
				var  inputType ;
				var pattern;
//				if(formTempItem.parentItemId && formTempItem.parentComponentTypeId != "LABEL"){
//					inputType = formTempItem.inputType;
//				}else if(formTempItem.parentSequenceId){
//					var seleObj = $('select[sequenceid="'+formTempItem.parentSequenceId +'"]')
//					if(seleObj.val() != ""){
//						inputType = seleObj.find("option[value='"+ seleObj.val()+"']").find('inputtype');
//					} 
//					for(var i in me.formTempItem){
//						if(me.formTempItem[i].sequenceId == formTempItem.parentSequenceId ){
//							inputType = $($('#div_'+i)[0].childNodes[1].selectedOptions[0]).attr('inputtype');
//							break;
//						}
//					}
//				}else{
				inputType = formTempItem.inputType;
//				}
				
				switch(inputType){
                case this.form_InputType.CHINESE://中文
                	//ok
                    pattern = "inputType='"+inputType+"' onkeyup=\"value=value.replace(/[^\\u4E00-\\u9FA5]/g,'')\" " ; 
                    break;
                case this.form_InputType.PINYING://拼音(英文、空格)
                	//ok
                    pattern = "inputType='"+inputType+"' onkeyup=\"value=value.replace(/[^a-zA-Z\s]/g,'')\" ";
                    break;
                case this.form_InputType.ENGLISHNUMBER://英数
                	//ok
                	pattern = "inputType='"+inputType+"' onkeyup=\"value=value.replace(/[^0-9a-zA-Z]/g,'')\" "
//                	pattern = "inputType='"+inputType+"' onkeyup=\"value=value.replace(/[/W]/g,'') \" "
                    break;
                case this.form_InputType.NUMBER://数字
                	//ok
                    pattern = "inputType='"+inputType+"' onkeyup=\"value=value.replace(/[^\\d]/g,'')\" ";
                    break;
                case this.form_InputType.EMAIL://电子邮件
                    //pattern = "^/w+([-+.]/w+)*@/w+([-.]/w+)*/./w+([-.]/w+)*$"
                    pattern =  "inputType='"+inputType+"' ";
                    break;
                case this.form_InputType.TELEPHONE: //电话
                	//数字
                	// pattern = "inputType='"+inputType+"' onkeyup=\"value=value.replace(/[^\\d]/g,'')\" ";
                    break;
                case this.form_InputType.MOBILEPHONE: //手机
                	//数字
                	 pattern = "inputType='"+inputType+"' onkeyup=\"value=value.replace(/[^\\d]/g,'')\" ";
                    break;
                case this.form_InputType.URL://主页地址
                   // pattern = "inputType='"+inputType+"' ^([a-zA-Z]+://)?([\w-\.]+)(\.[a-zA-Z0-9]+)(:\d{0,5})?/?([\w-/]*)\.?([a-zA-Z]*)\??(([\w-]*=[\w%]*&?)*)$";
                	pattern = "inputType='"+inputType+"' ";
                	break;
                case this.form_InputType.ID://身份证
                    pattern = "inputType='"+inputType+"' ";
                    break;
                case this.form_InputType.CARDNUMBER://卡号
                	//数字
                	 pattern = "inputType='"+inputType+"' onkeyup=\"value=value.replace(/[^\\d]/g,'')\" ";
                    break;
                case this.form_InputType.POSTCODE://邮编
                	//数字
                	pattern = "inputType='"+inputType+"' onkeyup=\"value=value.replace(/[^\\d]/g,'')\" ";
                    break;
                case this.form_InputType.ANY://任意
                    pattern = "inputType='"+inputType+"' ";
                    break;
                case this.form_InputType.CURRENCY://货币
                case this.form_InputType.AMOUNT_IN_FIGURES:
                case this.form_InputType.AMOUNT_IN_WORDS:
                    pattern = "inputType='"+inputType+"' inputType='"+inputType+"' style='text-align:right' onkeyup=\"value=value.replace(/[^\\d]/g,'')\" ";
                    break;                    
                default:
                    break;
				}
				return pattern;
			},
			blurFormInput : function(event){
				var me = this;
//				var relatedTarget=event.relatedTarget;
				var target = event.currentTarget;
				var parentItemId =  $(target).attr('parentItemId');
				var itemId = target.attributes[1].value;
				var value = target.value;
				var size = Object.keys(me.FrequentContacts).length;
				var flag = true;
				var contactTypeId = $(target).attr('contactTypeId');
				//匹配失去焦点的对象（name或BANK_CARD_NUMBER）
				if(contactTypeId != "NAME" && contactTypeId != "BANK_CARD_NUMBER" && contactTypeId !="ACCOUNT_NAME"){
					return;
				}
				for(var i in me.FrequentContacts){
					if((me.FrequentContacts[i].contactName == value && 
							me.FrequentContacts[i].contactTypeId == "NAME") || 
							(me.FrequentContacts[i].contactName.split(',')[0] ==value &&
									me.FrequentContacts[i].contactTypeId == "BANK_CARD_NUMBER")){
						//TODO 自动填充
						for(var j in me.FrequentContacts){
							if(me.FrequentContacts[j].userId == me.FrequentContacts[i].userId ){
								 var inputList = $('.form-input');
								 var selectList = $('.form-select');
								 var textareatList = $('.form-textarea');
								 var enableList = $('.cb-enable');
								 for(var k=0;k< inputList.size();k++){
									 //若为BANK_CARD_NUMBER或者NAME
									 if(me.FrequentContacts[j].contactTypeId == "BANK_CARD_NUMBER"&&
											 me.FrequentContacts[j].contactTypeId == $(inputList[k]).attr('contactTypeId') 
											 && flag == true && $(inputList[k]).attr('parentItemId') == parentItemId
											 && (me.FrequentContacts[j].contactName.split(',')[0] == value 
													 || me.FrequentContacts[i].contactTypeId == "NAME")){
										 var array = me.FrequentContacts[j].contactName.split(',');
										// inputList[k].value = array[0];
										 me.FrequentContacts[j]['parent'] = $(inputList[k]).attr('itemid');
										 for(var m = 1;m<array.length;m++){
											 	var frequentContact = {};
											 	switch(m){
											 	case 1 :
											 		frequentContact['contactTypeId'] = 'ACCOUNT_NAME';
												 	break;
											 	case 2 :
											 		frequentContact['contactTypeId'] = 'BANK_OF_DEPOSIT';
												 	break;
											 	case 3 :
											 		frequentContact['contactTypeId'] = 'BANK_CARD_TYPE';
												 	break;
											 	}
											 	frequentContact['contactName'] = array[m];
											 	frequentContact['userId'] = me.FrequentContacts[j].userId;
											 	frequentContact['parent'] = me.FrequentContacts[j]['parent'];
											 	this.cardAutomaticFilling(frequentContact,$(inputList[k]).attr('parentItemid'));											
											}
										 flag = false;
									 }
									 //其他
									 else if(me.FrequentContacts[j].contactTypeId == $(inputList[k]).attr('contactTypeId') 
											 && $(inputList[k]).attr('contactTypeId') != "BANK_CARD_NUMBER"
												 && $(inputList[k]).attr('contactTypeId') != "NAME"
											 && $(inputList[k]).attr('parentItemId') == parentItemId){
										 if( inputList[k].value == ""){
											 inputList[k].value = me.FrequentContacts[j].contactName;
											 $(inputList[k].parentNode).attr('style','');
										 }
										 
									 }
									 
								 }
								 for(var k=0;k< textareatList.size();k++){
									 if(me.FrequentContacts[j].contactTypeId == $(textareatList[k]).attr('contactTypeId')
											 && $(textareatList[k]).attr('parentItemId') == parentItemId){
										 if( textareatList[k].value == ""){
											 textareatList[k].value = me.FrequentContacts[j].contactName;
										 }
										 break;
									 }
								 }
								 for(var k =0;k < selectList.size();k++){
										 for(var m=1;m<selectList[k].length;m++){
											 if(selectList[k][m].text == me.FrequentContacts[j].contactName){
												 if(selectList[k][0].selected ==true){
													 selectList[k][m].selected = true;
													 var id = selectList[k].attributes[2].value;
													 $("#"+id).val(selectList[k][m].value);
													 $(selectList[k].parentNode).attr('style','');
												 }
											 }
											 if($(selectList[k]).attr('sequenceId') != undefined){
												 if($(selectList[k][m]).attr('contactTypeId') == me.FrequentContacts[j].contactTypeId ){													 
													 for(var n=0;n< inputList.size();n++){
														 if($(inputList[n]).attr('parentSequenceId') == $(selectList[k]).attr('sequenceId') &&
																 $(inputList[n]).attr('contactTypeId') == $(selectList[k][m]).attr('contactTypeId')){
															 if(inputList[n].value == ""){
																 inputList[n].value = me.FrequentContacts[j].contactName;
																 $(inputList[n].parentNode).attr('style','');
																 selectList[k][m].selected = true;
																 var id = selectList[k].attributes[2].value;
																 $("#"+id).val(selectList[k][m].value);
																 $(selectList[k].parentNode).attr('style','');
															 }
														 }
													 }
												 } 
											 }											 											
									 }								 
								 }
							}							
						}
					} 
				}
				var selectList = $('.form-select');
				for(var i = 0; i< selectList.size();i++){
					new Piece.VSelect({
						id : selectList[i].attributes[2].value ,
						preset : "select",
						inputClass :"input-select"
					});
				}
			},
			//填充银行卡信息
			cardAutomaticFilling :function(frequentContact,parentItemid){
				var inputList = $('.form-input');
				 var selectList = $('.form-select');
				 var textareatList = $('.form-textarea');
				 var enableList = $('.cb-enable');
				 for(var k=0;k< inputList.size();k++){
					 if(frequentContact.contactTypeId == $(inputList[k]).attr('contactTypeId') && parentItemid == $(inputList[k]).attr('parentItemid')){
						 if(inputList[k].value == ""){
						 inputList[k].value = frequentContact.contactName;
						 $(inputList[k].parentNode).attr('style','');
					 }
					 }
				 }
				 for(var k=0;k< textareatList.size();k++){
					 if(frequentContact.contactTypeId == $(textareatList[k]).attr('contactTypeId')
							 && parentItemid == $(inputList[k]).attr('parentItemid')){
						 if(textareatList[k].value == ""){
							 textareatList[k].value = frequentContact.contactName;
							 break;
						 }
					 }
				 }
				 for(var k =0;k < selectList.size();k++){
						 for(var m=1;m<selectList[k].length;m++){
							 if(selectList[k][m].text == frequentContact.contactName){
								 if(selectList[k][0].selected ==true){
									 selectList[k][m].selected = true;
									 var id = selectList[k].attributes[2].value;
									 $("#"+id).val(selectList[k][m].value);
								 }
							 }
							 //如果该下拉框有子项目
							 if($(selectList[k]).attr('sequenceId') != undefined){
								 if($(selectList[k][m]).attr('contactTypeId') == frequentContact.contactTypeId ){													 
									 for(var n=0;n< inputList.size();n++){
										 if($(inputList[n]).attr('parentSequenceId') == $(selectList[k]).attr('sequenceId')){
											 if(inputList[n].value == ""){	
												 inputList[n].value = frequentContact.contactName;
												 selectList[k][m].selected = true;
												 var id = selectList[k].attributes[2].value;
												 $("#"+id).val(selectList[k][m].value);
												 $(selectList[k].parentNode).attr('style','');
											 }
										 }
										 if($(inputList[n]).attr('parentSequenceId') == $(selectList[k]).attr('sequenceId') &&
												 $(inputList[n]).attr('contactTypeId') == $(selectList[k][m]).attr('contactTypeId')){
											 if(inputList[n].value == ""){
												 inputList[n].value = frequentContact.contactName;
												 $(inputList[n].parentNode).attr('style','');
												 selectList[k][m].selected = true;
												 var id = selectList[k].attributes[2].value;
												 $("#"+id).val(selectList[k][m].value);
												 $(selectList[k].parentNode).attr('style','');
											 }
										 }
									 }
								 } 
							 }											 											
					 }								 
				 }
			},
			clickSpanSelect:function(event){
				var me = this;
				var target = event.currentTarget;
				var contactTypeId = $(target.previousSibling).attr('contactTypeId');				
				if(contactTypeId == "NAME"){
					me.itemId_name = $(target.previousSibling).attr('itemId');
					Util.gotoPage("#userSubPage", ".index-page");
					Util.loadList(this, 'userList', OpenAPI.getUserName, {
						'appForm.userLoginId' : Piece.ZTake.loginId()||-1
					}, true, function(){
							if(me.nameIds[me.itemId_name] != undefined){
							$("#" + me.nameIds[me.itemId_name].id).addClass("ok");
						}						
					});
				}
				else if(contactTypeId == "BANK_CARD_NUMBER"){
					me.itemId_card = $(target.previousSibling).attr('itemId');
					Util.gotoPage("#cardSubPage", ".index-page");
					Util.loadList(this, 'cardList', OpenAPI.getCardNumber, {
						'appForm.userLoginId' : Piece.ZTake.loginId()||-1,
						'appForm.userId' : me.nameIds[me.itemId_name]?
							me.nameIds[me.itemId_name].id:-1
					}, true, function(){
						if(me.cardIds[me.itemId_card] != undefined){
							$("#" + me.cardIds[me.itemId_card].id).addClass("ok");
						}
					});
				}
			},
			//选择姓名
			selectName : function(event) {
				var node = Util.getParentNode(event, ".userName");
				var key = node.attr("id");
				var type = node.data("type");
				var item = {};
				item["name"] = type;
				item["id"] = key;
				this.nameIds[this.itemId_name] = item;
//				this.nameIds["name"] = type;
//				this.nameIds["id"] = key;
				var nameList = node[0].parentElement.parentElement.childNodes;
				for(var i =0 ;;i++){
					if(typeof(nameList[i]) == "undefined"){
						break;
					}
					$(nameList[i].firstElementChild).removeClass("ok");
				}
				node.addClass("ok");
				//从选择姓名页面返回
				var inputList = $('.form-input');
				Util.gotoPage(".index-page", "#userSubPage");
				if(this.nameIds[this.itemId_name] == null){
					return;
				}
				if(typeof(this.nameIds[this.itemId_name].name) == "undefined"){
					return;
				}
				for(var i = 0;i< inputList.size();i++){
					if($(inputList[i]).attr('itemId') == this.itemId_name){
						inputList[i].value = this.nameIds[this.itemId_name].name;
						inputList[i].focus();
						inputList[i].blur();
					}
				}
			},
			
			//选择银行卡
			selectCard : function(event) {
				var node = Util.getParentNode(event, ".cardNumber");
				var key = node.attr("id");
				var type = node.attr("data-type");
				var item = {};
				item["card"] = type;
				item["id"] = key;
				this.cardIds[this.itemId_card] = item;
//				this.cardIds["card"] = type;
//				this.cardIds["id"] = key;
				var cardList = node[0].parentElement.parentElement.childNodes;
				for(var i =0 ;;i++){
					if(typeof(cardList[i]) == "undefined"){
						break;
					}
					$(cardList[i].firstElementChild).removeClass("ok");
				}
				node.addClass("ok");
				//从选择银行卡页面返回
				var inputList = $('.form-input');
				Util.gotoPage(".index-page", "#cardSubPage");
				if(this.cardIds[this.itemId_card] == null){
					return;
				}
				if(typeof(this.cardIds[this.itemId_card].card) == "undefined"){
					return;
				}
				for(var i = 0;i< inputList.size();i++){
					if($(inputList[i]).attr('itemId') == this.itemId_card){
						inputList[i].value = this.cardIds[this.itemId_card].card;
						inputList[i].focus();
						inputList[i].blur();
					}
				}
			},
			//回到index页面
			gotoIndex : function(event) {
				Util.gotoPage(".index-page", ".sub-page");
			},
			//验证表单
			verification : function(){
				for(var key = 0; key < $("select[required='required']").length;key++){
					if($("select[required='required']")[key].value == ""){
						$($("select[required='required']")[key].previousElementSibling).css({"border-color": "red"});
						new Piece.Toast("该项未选");  
	                    return false;  
					}
				}
				for(var key = 0; key < $("input[required='required']").length;key++){
					if($("input[required='required']")[key].value == ""){
						$("input[required='required']")[key].focus();
						new Piece.Toast("该项未填");  
	                    return false;  
					}
				}
				
				
				for(var key = 0; key < $("input[inputtype='EMAIL']").length;key++){
					if($("input[inputtype='EMAIL']")[key].value != ""){
						if(!this.isEmail($("input[inputtype='EMAIL']")[key].value)){
							$("input[inputtype='EMAIL']")[key].focus();
							new Piece.Toast("邮箱格式错误");  
		                    return false;  
						}
					}
				}
				
				for(var key = 0; key < $("input[inputtype='TELEPHONE']").length;key++){
					if($("input[inputtype='TELEPHONE']")[key].value != ""){
						if(!this.isTel($("input[inputtype='TELEPHONE']")[key].value)){
							$("input[inputtype='TELEPHONE']")[key].focus();
							new Piece.Toast("请输入正确的电话号码");  
		                    return false;  
						}
					}
				}
				for(var key = 0;key <  $("input[inputtype='MOBILEPHONE']").length;key++){
					if($("input[inputtype='MOBILEPHONE']")[key].value != ""){
						if(!this.isPhone($("input[inputtype='MOBILEPHONE']")[key].value)){
							$("input[inputtype='MOBILEPHONE']")[key].focus();
							new Piece.Toast("请输入正确的手机号码");   
		                    return false;  
						}
					}
				}
				
				for(var key = 0;key <  $("input[inputtype='ID']").length;key++){
					if($("input[inputtype='ID']")[key].value != ""){
						if(!this.isIdCard($("input[inputtype='ID']")[key].value)){
							$("input[inputtype='ID']")[key].focus();
							new Piece.Toast("请输入正确的身份证");   
		                    return false;  
						}
					}
				}				
				for(var key = 0;key <  $("input[inputtype='POSTCODE']").length;key++){
					if($("input[inputtype='POSTCODE']")[key].value != ""){
						if(!this.isPostcode($("input[inputtype='POSTCODE']")[key].value)){
							$("input[inputtype='POSTCODE']")[key].focus();
							new Piece.Toast("请输入正确的邮编");   
		                    return false;  
						}
					}
				}				
				for(var key = 0;key <  $("input[inputtype='URL']").length;key++){
					if($("input[inputtype='URL']")[key].value != ""){
						if(!this.isUrl($("input[inputtype='URL']")[key].value)){
							$("input[inputtype='URL']")[key].focus();
							new Piece.Toast("请输入正确的网址");   
		                    return false;  
						}
					}
				}
				for(var key = 0;key <  $("input[inputtype='CARDNUMBER']").length;key++){
					var obj =  $("input[inputtype='CARDNUMBER']")[key];
					if(obj.value != ""){
						if(!this.isNumberCard(obj.value)){
							obj.focus();
							new Piece.Toast("请输入正确的卡号");   
		                    return false;  
						}
					}
					
				}
                return true;  
			},
			
			/** 
	        * 检查字符串是否为合法email地址 
	        * @param {String} 字符串 
	        * @return {bool} 是否为合法email地址 
	        */  
	        isEmail:function(aEmail) {  
	            var bValidate = RegExp(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/).test(aEmail);  
	            if (bValidate) {  
	                return true;  
	            }  
	            else  
	                return false;  
	        },
	        isPhone : function(aPhone) {  
	            var bValidate = RegExp(/^(0|86|17951)?(13[0-9]|15[012356789]|18[0-9]|14[57]|17[067])[0-9]{8}$/).test(aPhone);  
	            if (bValidate) {  
	                return true;  
	            }  
	            else  
	                return false;  
	        },
	        isTel: function (aTell) {
                var bValidate = RegExp(/^((\+?86)|(\(\+86\)))?\d{3,4}-\d{7,8}(-\d{3,4})?$/).test(aTell);
                if (bValidate) {  
	                return true;  
	            }  
	            else  
	                return this.isPhone(aTell); 
            },
            isIdCard: function (aIdCard) {
                var bValidate = RegExp(/^(\d{15}$|^\d{18}$|^\d{17}(\d|X|x))$/).test(aIdCard);
                if (bValidate) {  
	                return true;  
	            }  
	            else  
	                return false;  
            },
            isPostcode: function (aPostcode) {
                var bValidate = RegExp(/^\d{6}$/).test(aPostcode);
                if (bValidate) {  
	                return true;  
	            }  
	            else  
	                return false;  
            },
            isUrl: function (aUrl) {
            	var strRegex = "/^((https|http|ftp|rtsp|mms)?://)"  
                    + "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?" //ftp的user@  
                    + "(([0-9]{1,3}\.){3}[0-9]{1,3}" // IP形式的URL- 199.194.52.184  
                    + "|" // 允许IP和DOMAIN（域名） 
                    + "([0-9a-z_!~*'()-]+\.)*" // 域名- www.  
                    + "([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\." // 二级域名  
                    + "[a-z]{2,6})" // first level domain- .com or .museum  
                    + "(:[0-9]{1,4})?" // 端口- :80  
                    + "((/?)|" // a slash isn't required if there is no file name  
                    + "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$/";
                var bValidate = RegExp(RegExp).test(aUrl);
                if (bValidate) {  
	                return true;  
	            }  
	            else  
	                return false;  
            }, 
            isNumberCard: function (aNumberCard) {
                var bValidate = RegExp(/^[\d]{10,19}$/).test(aNumberCard);
                if (bValidate) {  
	                return true;  
	            }  
	            else  
	                return false;  
            },
            focusInputSelect:function(event){
            	var target = event.currentTarget
            	$(target).css({"border-color": ""});
            },
            clickIconDown:function(event){
            	var target = event.currentTarget; 
            	$(target).siblings("input").focus();
            	//$(target).siblings("input").trigger("focus");
            	//$(target.previousElementSibling).focus();//触发select点击事件--失败            	
            	//$('#'+target.previousElementSibling.attributes.id.value+"_dummy").focus();//触发input点击事件--失败
            }          
    });
});