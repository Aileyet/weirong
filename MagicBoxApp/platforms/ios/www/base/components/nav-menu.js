define(['zepto', 'underscore', 'backbone', '../util', "../openapi"],
	function($, _, Backbone, Util, OpenAPI) {

		var Menu = Backbone.View.extend({
			login: null,
			initialize: function() {
				this.render();
			},
			render: function() {
				var me = this;

				$(this.el).find("li").click(function() {
					var url = $(this).attr("data-value");

					var sign = url.split('/')[1];

					if (sign === "common-seeUser" || sign === "common-seeUserBlog") {
						var id = Util.request("id");
						var fromAuthor = Util.request("fromAuthor");
						var fromAuthorId = Util.request("fromAuthorId");
						var from = Util.request("from");
						var fromMoule = null;
						if (from === "news-list") {
							fromMoule = "news/news-detail?id=";
						} else if (from === "blog-list" || from === "recommend-list") {
							fromMoule = "news/news-blog-detail?id=";
						} else {
							fromMoule = "question/question-detail?id=";
						}

						//从用户信息，，，保留的参数，用于页脚
						var fromType = Util.request("fromType");
						var checkDetail = Util.request("checkDetail");
						var com = Util.request("com");

						Backbone.history.navigate(url + "?id=" + id + "&fromAuthor=" + fromAuthor + "&fromAuthorId=" + fromAuthorId + "&from=" + from + "&fromMoule=" + fromMoule + "&fromType=" + fromType + "&checkDetail=" + checkDetail + "&com=" + com, {
							trigger: true
						});
					} else {
						Backbone.history.navigate(url, {
							trigger: true
						});
					}

				});
			}
		}, {
			compile: function(contentEl) {
				var me = this;
				return _.map($(contentEl).find("nav.nav-menu"), function(tag) {
					var menu = new Menu({
						el: tag
					});
					return menu;
				});
			}
		});

		return Menu;

	});