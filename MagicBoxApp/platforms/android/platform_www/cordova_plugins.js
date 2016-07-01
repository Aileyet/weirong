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
        "file": "plugins/com.spout.phonegap.plugins.baidulocation/www/baidulocation.js",
        "id": "com.spout.phonegap.plugins.baidulocation.BiaduLocation",
        "pluginId": "com.spout.phonegap.plugins.baidulocation",
        "clobbers": [
            "window.baiduLocation"
        ]
    },
    {
        "file": "plugins/cordova-plugin-datepicker/www/android/DatePicker.js",
        "id": "cordova-plugin-datepicker.DatePicker",
        "pluginId": "cordova-plugin-datepicker",
        "clobbers": [
            "datePicker"
        ]
    },
    {
        "file": "plugins/cordova-plugin-whitelist/whitelist.js",
        "id": "cordova-plugin-whitelist.whitelist",
        "pluginId": "cordova-plugin-whitelist",
        "runs": true
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
        "file": "plugins/example.cordova.qqLogin/www/qqLogin.js",
        "id": "example.cordova.qqLogin.QQLogin",
        "pluginId": "example.cordova.qqLogin",
        "clobbers": [
            "window.QQLogin"
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
        "file": "plugins/wbample.cordova.weiboLogin/www/weiboLogin.js",
        "id": "wbample.cordova.weiboLogin.WeiboLogin",
        "pluginId": "wbample.cordova.weiboLogin",
        "clobbers": [
            "window.WeiboLogin"
        ]
    },
    {
        "file": "plugins/cordova-plugin-file/www/DirectoryEntry.js",
        "id": "cordova-plugin-file.DirectoryEntry",
        "clobbers": [
            "window.DirectoryEntry"
        ]
    },
    {
        "file": "plugins/cordova-plugin-file/www/DirectoryReader.js",
        "id": "cordova-plugin-file.DirectoryReader",
        "clobbers": [
            "window.DirectoryReader"
        ]
    },
    {
        "file": "plugins/cordova-plugin-file/www/Entry.js",
        "id": "cordova-plugin-file.Entry",
        "clobbers": [
            "window.Entry"
        ]
    },
    {
        "file": "plugins/cordova-plugin-file/www/File.js",
        "id": "cordova-plugin-file.File",
        "clobbers": [
            "window.File"
        ]
    },
    {
        "file": "plugins/cordova-plugin-file/www/FileEntry.js",
        "id": "cordova-plugin-file.FileEntry",
        "clobbers": [
            "window.FileEntry"
        ]
    },
    {
        "file": "plugins/cordova-plugin-file/www/FileError.js",
        "id": "cordova-plugin-file.FileError",
        "clobbers": [
            "window.FileError"
        ]
    },
    {
        "file": "plugins/cordova-plugin-file/www/FileReader.js",
        "id": "cordova-plugin-file.FileReader",
        "clobbers": [
            "window.FileReader"
        ]
    },
    {
        "file": "plugins/cordova-plugin-file/www/FileSystem.js",
        "id": "cordova-plugin-file.FileSystem",
        "clobbers": [
            "window.FileSystem"
        ]
    },
    {
        "file": "plugins/cordova-plugin-file/www/FileUploadOptions.js",
        "id": "cordova-plugin-file.FileUploadOptions",
        "clobbers": [
            "window.FileUploadOptions"
        ]
    },
    {
        "file": "plugins/cordova-plugin-file/www/FileUploadResult.js",
        "id": "cordova-plugin-file.FileUploadResult",
        "clobbers": [
            "window.FileUploadResult"
        ]
    },
    {
        "file": "plugins/cordova-plugin-file/www/FileWriter.js",
        "id": "cordova-plugin-file.FileWriter",
        "clobbers": [
            "window.FileWriter"
        ]
    },
    {
        "file": "plugins/cordova-plugin-file/www/Flags.js",
        "id": "cordova-plugin-file.Flags",
        "clobbers": [
            "window.Flags"
        ]
    },
    {
        "file": "plugins/cordova-plugin-file/www/LocalFileSystem.js",
        "id": "cordova-plugin-file.LocalFileSystem",
        "clobbers": [
            "window.LocalFileSystem"
        ],
        "merges": [
            "window"
        ]
    },
    {
        "file": "plugins/cordova-plugin-file/www/Metadata.js",
        "id": "cordova-plugin-file.Metadata",
        "clobbers": [
            "window.Metadata"
        ]
    },
    {
        "file": "plugins/cordova-plugin-file/www/ProgressEvent.js",
        "id": "cordova-plugin-file.ProgressEvent",
        "clobbers": [
            "window.ProgressEvent"
        ]
    },
    {
        "file": "plugins/cordova-plugin-file/www/fileSystems.js",
        "id": "cordova-plugin-file.fileSystems"
    },
    {
        "file": "plugins/cordova-plugin-file/www/requestFileSystem.js",
        "id": "cordova-plugin-file.requestFileSystem",
        "clobbers": [
            "window.requestFileSystem"
        ]
    },
    {
        "file": "plugins/cordova-plugin-file/www/resolveLocalFileSystemURI.js",
        "id": "cordova-plugin-file.resolveLocalFileSystemURI",
        "merges": [
            "window"
        ]
    },
    {
        "file": "plugins/cordova-plugin-file/www/android/FileSystem.js",
        "id": "cordova-plugin-file.androidFileSystem",
        "merges": [
            "FileSystem"
        ]
    },
    {
        "file": "plugins/cordova-plugin-file/www/fileSystems-roots.js",
        "id": "cordova-plugin-file.fileSystems-roots",
        "runs": true
    },
    {
        "file": "plugins/cordova-plugin-file/www/fileSystemPaths.js",
        "id": "cordova-plugin-file.fileSystemPaths",
        "merges": [
            "cordova"
        ],
        "runs": true
    },
    {
        "file": "plugins/com.eyu.cordova.weather/www/Weather.js",
        "id": "com.eyu.cordova.weather.Weather",
        "clobbers": [
            "window.Weather"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{}
// BOTTOM OF METADATA
});