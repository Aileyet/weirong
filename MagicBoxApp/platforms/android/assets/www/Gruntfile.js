module.exports = function(grunt) {
	grunt.initConfig({
		piece_modulejs: {
			main: {
				options: {
					mode: "project",
					exclude: ["node_modules", "piece"]
				}
			}
		},
		requirejs: {
			piece: {
				options: {
					baseUrl: ".",
					skipDirOptimize: true,
					fileExclusionRegExp: /^node_modules$/,
					dir: "dist",
					removeCombined: true,
					mainConfigFile: "config.js",
					wrap: false,
					inlineText: true,
					locale: "zh-cn",
					optimize: "uglify",
					uglify: {
						toplevel: true,
						ascii_only: true,
						beautify: false,
						max_line_length: 10000,
						defines: {
							DEBUG: ["name", "false"]
						},
						no_mangle: false
					},
					optimizeCss: "standard",
					modules: [{
						name: "base/module"
					}, {
						name: "home/module"
					}, {
						name: "piece/js/piece-debug"
					}]
				}
			}
		},
	});

	grunt.loadNpmTasks('grunt-piece-modulejs');

	grunt.registerTask('default', [
		'piece_modulejs'
	]);
};