
	var exec = require('cordova/exec');
	module.exports = {
	    getWeather: function (success, fail,city) {
	      return exec(success, fail,"Weather","getWeather", [city]); 
	    } ,
	    getindex:function (success, fail,city) {
	      return exec(success, fail,"Weather","getindex", [city]); 
	    } ,
	    getindexXml:function (success, fail,city) {
	      return exec(success, fail,"Weather","getindexXml", [city]); 
	    }
	}
