define(function(require) {
     var v1 = require('devicemanage/Ehome');
	 var v2 = require('devicemanage/SeAddDev');
     var v3 = require('devicemanage/index');
	 var v4 = require('devicemanage/SeDevReName');
	 var v5 = require('devicemanage/SeAddMB'); 
	 var v6 = require('devicemanage/SeIRDevList');
	 var v7 = require('devicemanage/SeGatewayChoice');
	  var v8 = require('devicemanage/SeAddZigBee');
	  var v9 = require('devicemanage/SeAutoMatch');
	  var v10 = require('devicemanage/SeBrandChoice');
	  var v11 = require('devicemanage/SeCustom');
	  var v12 = require('devicemanage/SeModelChoice');
	  var v13 = require('devicemanage/SeRemoteCopy');
	  var v14 = require('devicemanage/SeZigBeeList');
	 // var v15 = require('devicemanage/SeIRWay');
          var v16 = require('devicemanage/SeAddMBAuto'); 
     return {
         'Ehome': v1,
		 'SeAddDev': v2,
         'index': v3,
		 'SeDevReName':v4,
		 'SeAddMB':v5,
		 'SeIRDevList':v6,
		 'SeGatewayChoice':v7,
		 'SeAddZigBee':v8,
		 'SeAutoMatch':v9,
		 'SeBrandChoice':v10,
		 'SeCustom':v11,
		 'SeModelChoice':v12,
		 'SeRemoteCopy':v13,
		 'SeZigBeeList':v14,
		 // 'SeIRWay':v15,
                 'SeAddMBAuto':v16,
      };
});