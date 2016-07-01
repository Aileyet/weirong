define(['text!magicbox/VideoList.html',"../base/templates/template"],
	function(viewTemplate,_TU) {
		return Piece.View.extend({
			id: 'magicbox_VideoList',
			events:{
				"touchstart .videoLis"    :     "wPlay"
			},
			render: function() {
				$(this.el).html(viewTemplate);

				Piece.View.prototype.render.call(this);
				return this;
			},
			onLoadTemplate:function(){
				_TU._U.setHeader(_TU._T.magicbox_VideoList);//加载头部导航
			},
			onShow: function() {
				this.onLoadTemplate();
				this.getVideoList();
			},
			getVideoList:function(){
				if(window.MusicSearch){
					window.MusicSearch.videoList(function(data){
						if(data){
							var html = "";
							data = data.substring(0,data.length-2);
							var lis = data.split("@@");
							$(lis).each(function(){
								var videoInfo = this.split(",");
								html = "<li class='videoLis' src="+videoInfo[2]+">"+videoInfo[0]+"</li>" 
								$("#videoList").append(html);
							});
						}
				    },function(){
				    	new Piece.Toast("视频列表获取失败");
				    });
				}
			},
			wPlay:function(e){
				var url = $(e.target).attr("src");
				VideoPlayer.play(url);
			}
		}); //view define

	});