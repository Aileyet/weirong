define(['text!ehome/SeRemoteCopy.html','../base/schema', '../base/socketutil',"../base/templates/template","../base/i18nMain"],
	function(viewTemplate,Schema,SocketUtil,_TU,I18n) {
	    var module;
		var studyKey;
		var outTimer=null;
		return Piece.View.extend({
			id: 'ehome_SeRemoteCopy',
			events:{
				"tap .save":"save",
				"tap .cancel":"cancel",
				"touchstart .reStudy":"reStudy",
				
			},
			render: function() {
				$(this.el).html(viewTemplate);

				Piece.View.prototype.render.call(this);
				return this;
			},
			onLoadTemplate:function(){
				_TU._U.setHeader(_TU._T.ehome_SeRemoteCopy);//加载头部导航
				var TemplateHtml = $(this.el).find("#ehome_SeRemoteCopy").html();
				var TemplateObj = _.template(TemplateHtml, _TU._T.ehome_SeRemoteCopy);
				$(".content").append(TemplateObj);
			},
			onShow: function() {
			    this.onLoadTemplate();
			    $(".content").css("height", '');

				module=Piece.Cache.get("study-module");
			    studyKey=Piece.Cache.get("study-key");
				if(studyKey.indexOf("user")>-1){
					$('.btn-div').html('<i class="icon iconfont">'+Piece.Cache.get("study-name")+'</i>');
					this.waitBack();
					return;
				}
				
				var array=Schema.TVControl;
				switch(module){
					case "TV00":
					{
						array=Schema.TVControl;
						break;
					}
					case "AC00":
					{
						array=Schema.AriControl;
						break;
					}
					case "FAN0":
					{
						array=Schema.FanControl;
						break;
					}
					case "STB0":
					{
						array=Schema.STBControl;
						break;
					}
					case "DVD0":
					{
						array=Schema.DVDControl;
						break;
					}
				    case "PRJ0":
				    {
				        array = Schema.PRJControl;
				        break;
				    }
				    case "IPTV":
				    {
				        array = Schema.IPTVControl;
				        break;
				    }
					default:"";
				}
				for(var i=0;i<array.length;i++){
					if(array[i].key==studyKey){
						$('.btn-div').html('<i class="icon iconfont">'+array[i].img+'</i>');
						$('.text-1').html(array[i].name);
						break;
					}
				}
				this.StudyKey(module, studyKey);
			},
			reStudy:function(){
				$(".reStudy").attr("style","display:none");
				$(".cancel").attr("style", "");
				$("#save").attr("style", "color:gray");
				$("#save").attr("class", "");
				this.StudyKey(module, studyKey);
			},
			waitBack:function(){
			    var loader=new Piece.Loader({autoshow:false,//是否初始化时就弹出加载控件
                                             target:'.content'//页面目标组件表识
											 });
				 //显示加载窗
				loader.show();
				socketRspnCallBack.func006A=function(obj){
					          loader.hideAll();
							  if(obj.command.indexOf("Rspn0000")<0){
										   new Piece.Toast(I18n.ehome_SeRemoteCopy.failStudy);
								}else{
									       window.clearTimeout(outTimer);
									       //成功提示
								           $("#tipOK").attr("style","");
                                           $("#tipIng").attr("style","display:none");	
								}
								//显示重新学习按钮
								$(".reStudy").attr("style","");
								$(".cancel").attr("style","display:none");	
				};
				outTimer=window.setTimeout(function(){
					new Piece.Toast(I18n.Common.timeOut);
					loader.hideAll();
					//显示重新学习按钮
					$(".reStudy").attr("style","");
					$(".cancel").attr("style","display:none");	
					return;
					},10000);
			},
			save:function(){
					Backbone.history.navigate(Piece.Cache.get("tooltip-tooltip-parent"), {
            		trigger: true
            	});
			},
			cancel:function(){
					Backbone.history.navigate(Piece.Cache.get("tooltip-tooltip-parent"), {
            		trigger: true
            	});
			},
		    //学习命令
			StudyKey: function (module, key) {
			    var fun = function () {
			        var model = new SocketUtil.sendModel();
			        model.gatewayId =Piece.Cache.get("gatewayId");
			        model.moduleId = module;
			        model.moduleIndex = Piece.Cache.get("serial");
			        model.actionId = Piece.Cache.get("actionId");
			        model.actionIndex = Piece.Cache.get("actionIndex");
			        model.cmdType = "Comd";
			        model.cmdCatalog = "Set ";
			        model.queryString = { "method": "learn", "key": key };
			        model.callbackFun = function (sendObj, backObj) {
			            var isOk = false;
			            for (var arr in backObj) {
			                if (backObj[arr].indexOf("Rspn0000") > -1) {
			                    $("#tipOK").attr("style", "");
			                    $("#tipIng").attr("style", "display:none");
			                    $("#save").attr("style", "");
			                    $("#save").attr("class", "save");
			                    isOk = true;
			                    break;
			                } 
			            }
			            if (!isOk) {
			                //显示重新学习按钮
			                $(".reStudy").attr("style", "");
			                $(".cancel").attr("style", "display:none");
			                $("#save").attr("style", "");
			                $("#save").attr("class", "save");
			            }
			        }
			        SocketUtil.sendMessage(model);
			    }
			    var check = SocketUtil.checkFunctionID; check(module, fun, false);
			},
		});

	});