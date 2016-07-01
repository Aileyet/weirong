define(['text!user/user-info.html', "../base/openapi", '../base/util'],
	function(viewTemplate, OpenAPI, Util, Login) {
		return Piece.View.extend({
			id: 'user-user-info',
			uploadImageURI: "",
			form:{"appForm.userLoginId" :  Piece.TempStage.loginId()},
			
			events: {
				"tap .refreshBtn": "refresh",
				"tap .backBtn": "goBack",
				"tap .userpic": "editUserImg",
				"tap #lastName" : "inputLastName",
				"tap #firstName" : "inputFirstName",
				"tap #certNO" : "inputCertNO",
				"tap #residence" : "textareResidence",
				"tap .nav-word" : "savePersonal",
				"tap #account" : "inputAccount",
				"tap #email" : "inputEmail",
				"touchstart #Logout"  :"Logout"
			},
			render: function() {
				$(this.el).html(viewTemplate);
				Piece.View.prototype.render.call(this);
				return this;
			},
			onShow: function() {

				var me = this;
				Piece.View.prototype.onShow.call(this);
				
				Util.Ajax(OpenAPI.getPersonal, "GET", {
					"appForm.userLoginId" :Piece.TempStage.loginId()
				}, 'jsonp', function(data, textStatus, jqXHR) {
					
					data.portraitUrl = OpenAPI.IP + data.portraitUrl +"?"+ Util.getTimestamp();
					var userInfoTemplate = $(me.el).find("#userInfoTemplate").html();
					var userInfoHtml = _.template(userInfoTemplate, data);
					$("#content").html(userInfoHtml);
					me.renderData(data);
					
					var s = new Piece.VSelect({
						id : "certType",
						preset : "select"
					});
					
					new Piece.VSelect({
						id : "sex",
						preset : "select"
					});
					
					new Piece.VSelect({
						id : "birthday",
						preset : "date"
					});
					
				});
			},
			Logout:function(){
				Piece.Store.deleteObject("user_info",true);
				Piece.Store.deleteObject("user_token",true);
				Piece.TempStage.loginId("");
				Piece.TempStage.loginUser(null);
				new Piece.Toast('注销成功');

				Backbone.history.navigate("home/InUserInfoL", {
            		trigger: true
            	});
			},
			editUserImg: function() {
				var me = this;
				var dialog = new Piece.Dialog({
					autoshow: true,
					target: 'body',
					title: '请选择',
					content: ''
				}, {
					configs: [{
						title: "手机拍照",
						eventName: 'camera'
					}, {
						title: "手机相册",
						eventName: 'library'
					}],
					camera: function() {
						me.getPicture("CAMERA");
					},
					library: function() {
						me.getPicture("PHOTOLIBRARY");
					}
					
				});
			
			},
			inputAccount : function(event, tt) {
				var me = this;
				var target = Util.getParentNode(event, ".userInfo").find(".dialog-value");
				var dialog = new Piece.Dialog({
					title: '编辑 用户名',
					confirm: function(e, value) {
		        		target.text(value);
		        		me.form["appForm.accountName"] = value;
					},
					content: '<input class="dialog-input" value="'+target.text()+'"  autocomplete="on" placeholder="例如：sunny">'
				});
				
			},
			inputEmail : function(event, tt) {
				var me = this;
				var target = Util.getParentNode(event, ".userInfo").find(".dialog-value");
				var dialog = new Piece.Dialog({
					title: '编辑 邮箱',
					confirm: function(e, value) {
		        		target.text(value);
		        		me.form["appForm.email"] = value;
					},
					content: '<input class="dialog-input" value="'+target.text()+'"  autocomplete="on" placeholder="例如：123456@qq.com">'
				});
				
			},
			inputLastName : function(event, tt) {
				var me = this;
				var target = Util.getParentNode(event, ".userInfo").find(".dialog-value");
				var dialog = new Piece.Dialog({
					title: '编辑 姓',
					confirm: function(e, value) {
		        		target.text(value);
		        		me.form["appForm.lastName"] = value;
					},
					content: '<input class="dialog-input" value="'+target.text()+'"  autocomplete="on" placeholder="例如：王">'
				});
				
			},
			inputFirstName : function() {
				var me = this;
				var target = Util.getParentNode(event, ".userInfo").find(".dialog-value");
				var dialog = new Piece.Dialog({
					title: '编辑 名',
					confirm: function(e, value) {
		        		target.text(value);
		        		me.form["appForm.firstName"] = value;
					},
					content: '<input class="dialog-input"  value="'+target.text()+'"  autocomplete="on" placeholder="例如：小明">'
				});
				
			},
			inputCertNO : function(event) {
				var me = this;
				var target = Util.getParentNode(event, ".userInfo").find(".dialog-value");
				var dialog = new Piece.Dialog({
					title: '编辑 证件号码',
					confirm: function(e, value) {
		        		target.text(value);
		        	
		        		me.form["appForm.certNO"] = value;
					},
					content: '<input class="dialog-input"  value="'+target.text()+'" autocomplete="on" placeholder="例如：33035484895415">'
				});
			},
			textareResidence : function(event) {
				var me = this;
				var target = Util.getParentNode(event, ".userInfo").find(".dialog-value");
				var dialog = new Piece.Dialog({
					title: '编辑 现居住地址',
					confirm: function(e, value) {
		        		target.text(value);
		        		me.form["appForm.residence"] = value;
					},
					content: '<textarea name="address"  class="input-weak kv-v" placeholder="例如：浙江省，杭州市，西湖区，浙大网新软件园" pattern="^.{1,60}$" data-err="请填写正确的地址信息！">'+target.text()+'</textarea>'
				});
			},
			
			savePersonal : function() {
				var me = this;
				me.form["appForm.sex"] = $("#sex").val();
				me.form["appForm.certType"] = $("#certType").val();
				me.form["appForm.birth"] = $("#birthday").val();
				Util._Ajax(OpenAPI.savePersonal, this.form, function(){
					new Piece.Toast("保存成功!");
				}, true);
			},
			getPicture: function(type) {
				var me = this;
				var user_token = OpenAPI.access_user;
				var access_token = OpenAPI.access_token;

				var loader = new Piece.Loader({
					autoshow: false, //是否初始化时就弹出加载控件
					target: 'body' //页面目标组件表识
				});

				function win(r) {
					console.log("Code = " + r.responseCode);
					console.log("Response = " + r.response);
					console.log("Sent = " + r.bytesSent);
					var response = JSON.parse(r.response);
					if (r.responseCode == "200") {
						new Piece.Toast('上传头像成功');
						$('.userpic').attr("src", me.uploadImageURI + "?" + Util.getTimestamp());
					} else {
						new Piece.Toast('上传失败,请重试');
					}
					loader.hide();
				};

				function fail(error) {
					loader.hide();
					new Piece.Toast('上传失败,请重试');
					console.log("upload error source " + error.source);
					console.log("upload error target " + error.target);
				};

				//上传图片
				function uploadPhoto(imageURI) {
					loader.show();
					var options = new FileUploadOptions();
					options.fileKey = "portrait";
					options.fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1) + ".jpg";
					options.mimeType = "image/jpeg";

					var params = {};
					params.access_token = access_token;
					params["appForm.userId"] = Piece.Store.loadObject("loginId") || "1";
						
					options.params = params;

					var ft = new FileTransfer();
					ft.upload(imageURI, encodeURI(OpenAPI.portrait_update), win, fail, options);
				};


				var pictureSource = navigator.camera.PictureSourceType;
				var destinationType = navigator.camera.DestinationType;

				//选择图片完成后，马上上传。
				function onSuccess(imageUrl) {
					me.uploadImageURI = imageUrl;
					uploadPhoto(imageUrl);
				}
				//选择图片失败
				function onFail(message) {
				}

				var source;
				if (type === "CAMERA") {
					source = pictureSource.CAMERA;
				} else {
					source = pictureSource.PHOTOLIBRARY;
				}

				navigator.camera.getPicture(onSuccess, onFail, {
					quality: 75,
					allowEdit: true,
					encodingType: Camera.EncodingType.JPEG,
					destinationType: destinationType.FILE_URI,
					sourceType: source
				});

			},

			refresh: function() {
				this.onShow();
			},
			goBack: function() {
				var lastPage = Piece.Session.loadObject("osLastPage");
				this.navigateModule(lastPage, {
					trigger: true
				});
			},
			
			renderData : function(data) {
				$("#sex").val(data.sex);
				$("#certType").val(data.certType);
				$("#birthday").val(data.birth);
			}
		}); //view define

	});