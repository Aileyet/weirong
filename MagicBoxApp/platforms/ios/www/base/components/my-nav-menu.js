define(['zepto', 'underscore', 'backbone', 'text!base/components/my-nav-menu.html', '../login/login', '../util', "../openapi"], function($, _, Backbone, MyNavHtml, Login, Util, OpenAPI) {

	var MyNav = Backbone.View.extend({
		login: null,

		initialize: function() {
			this.render();
		},

		render: function() {
			$(this.el).addClass("bar-standard");
			$(this.el).addClass("bar-header-secondary");
			$(this.el).html(MyNavHtml);
			$(this.el).find("li").removeClass("active");
			var module = $(this.el).attr("data-value");
			var moduleChange = "li[data-module=" + "\"" + module + "\"" + "]";
			$(this.el).find(moduleChange).addClass("active");

			$(this.el).find("li").bind('click', function() {
				var url = $(this).attr("data-module");
				console.info(url)
				if (url) {
					Backbone.history.navigate(url, {
						trigger: true
					});
				}
			});

			var me = this;
				//未读信息提示
				var NavPrompt = Piece.Session.loadObject('Prompt');
				if (NavPrompt != null) {
					var userPromptNum = NavPrompt.replyCount + NavPrompt.msgCount + NavPrompt.referCount;
					if (userPromptNum != 0) {
						//nav
						if (NavPrompt.msgCount != 0) {
							$(me.el).find('.commentPrompt').css("display", "inline-block");
							$(me.el).find('.commentPrompt').html(NavPrompt.msgCount);
						}
						if (NavPrompt.replyCount != 0) {
							$(me.el).find('.criticPrompt').css("display", "inline-block");
							$(me.el).find('.criticPrompt').html(NavPrompt.replyCount);
						}
						if (NavPrompt.referCount != 0) {
							$(me.el).find('.atmePrompt').css("display", "inline-block");
							$(me.el).find('.atmePrompt').html(NavPrompt.referCount);
						}
					}
				}

		}
	}, {
		compile: function(contentEl) {
			var me = this;
			return _.map($(contentEl).find("nav.my-nav-menu"), function(tag) {
				var myNavHtml = new MyNav({
					el: tag
				});
				return myNavHtml;
			});
		}
	});

	return MyNav;

});