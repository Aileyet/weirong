cordova.define("com.mediatek.elian.ElianPlugin", function(require, exports, module) {
	
	var exec = require('cordova/exec');
	
	module.exports = {
		
		startSmartConn:function(callbackSuccess,callbackFail,ssid,passwd){
		
			exec(callbackSuccess, callbackFail, "ElianPlugin", "StartSmartConnection", [ssid,passwd]);
		}		
	};
	
});