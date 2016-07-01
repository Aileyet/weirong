cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/cn.net.wenzhixin.cordova/ExtraInfo.js",
        "id": "cn.net.wenzhixin.cordova.ExtraInfo",
        "pluginId": "cn.net.wenzhixin.cordova",
        "clobbers": [
            "cordova.plugins.ExtraInfo"
        ]
    },
    {
        "file": "plugins/cordova-plugin-datepicker/www/ios/DatePicker.js",
        "id": "cordova-plugin-datepicker.DatePicker",
        "pluginId": "cordova-plugin-datepicker",
        "clobbers": [
            "datePicker"
        ]
    },
    {
        "file": "plugins/edu.uic.travelmidwest.cordova.udptransmit/www/udptransmit.js",
        "id": "edu.uic.travelmidwest.cordova.udptransmit.udptransmit",
        "pluginId": "edu.uic.travelmidwest.cordova.udptransmit",
        "merges": [
            "udptransmit"
        ]
    },
    {
        "file": "plugins/org.bcsphere.bluetooth/www/org.underscorejs.underscore/underscore.js",
        "id": "org.bcsphere.bluetooth.underscorejs.underscore",
        "pluginId": "org.bcsphere.bluetooth"
    },
    {
        "file": "plugins/org.bcsphere.bluetooth/www/org.bcsphere/bc.js",
        "id": "org.bcsphere.bluetooth.bcjs",
        "pluginId": "org.bcsphere.bluetooth",
        "merges": [
            "BC"
        ]
    },
    {
        "file": "plugins/org.bcsphere.bluetooth/www/org.bcsphere.bluetooth/bluetoothapi.js",
        "id": "org.bcsphere.bluetooth.bluetoothapi",
        "pluginId": "org.bcsphere.bluetooth",
        "merges": [
            "navigator.bluetooth"
        ]
    },
    {
        "file": "plugins/phonegap-plugin-barcodescanner/www/barcodescanner.js",
        "id": "phonegap-plugin-barcodescanner.BarcodeScanner",
        "pluginId": "phonegap-plugin-barcodescanner",
        "clobbers": [
            "cordova.plugins.barcodeScanner"
        ]
    },
    {
    	"file": "plugins/cordova-plugin-network-information/www/network.js",
        "id": "cordova-plugin-network-information.network",
        "clobbers": [
            "navigator.connection",
            "navigator.network.connection"
        ]
    },
    {
    	"file": "plugins/cordova-plugin-network-information/www/Connection.js",
        "id": "cordova-plugin-network-information.Connection",
        "clobbers": [
            "Connection"
        ]
    },
    {
        "file": "plugins/cordova-plugin-vibration/www/vibration.js",
        "id": "cordova-plugin-vibration.vibration",
        "clobbers": [
            "vibration"
        ]
    },
    {
        "file": "plugins/cordova-plugin-splashscreen/www/splashscreen.js",
        "id": "cordova-plugin-splashscreen.SplashScreen",
        "pluginId": "cordova-plugin-splashscreen",
        "clobbers": [
            "navigator.splashscreen"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cn.net.wenzhixin.cordova": "0.0.1",
    "com.spout.phonegap.plugins.baidulocation": "0.1.0",
    "cordova-plugin-datepicker": "0.9.3",
    "cordova-plugin-whitelist": "1.2.0",
    "edu.uic.travelmidwest.cordova.udptransmit": "0.0.1",
    "example.cordova.qqLogin": "0.1.0",
    "org.bcsphere.bluetooth": "0.5.1",
    "phonegap-plugin-barcodescanner": "4.1.0",
    "wbample.cordova.weiboLogin": "0.1.0",
    "cordova-plugin-splashscreen": "3.2.1"
}
// BOTTOM OF METADATA
});