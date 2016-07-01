cordova.define("cn.net.wenzhixin.cordova.ExtraInfo", function(require, exports, module) { var exec = require('cordova/exec');

exports.getExtra = function(success, error) {
    exec(success, error, "ExtraInfo", "getExtra", []);
};

exports.getMagicBox = function(success, error, args) {
    exec(success, error, "ExtraInfo", "getMagicBox", args);
};
});
