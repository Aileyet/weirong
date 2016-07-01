define(function(require) {
     var v1  = require('ehome/Ehome');
     var v2  = require('ehome/CoSocket');
     var v3  = require('ehome/CoFanSetup');
     var v4  = require('ehome/CoLamp');
     var v5  = require('ehome/CoProjector');
     var v6  = require('ehome/CoCurtain');
     var v7  = require('ehome/CoToilet');
     var v8  = require('ehome/CoSwitch');
     var v9  = require('ehome/CoKitchen');
     var v10 = require('ehome/CoFastOper');
     var v11 = require('ehome/CoTV');
     var v12 = require('ehome/CoAir');
     var v13 = require('ehome/CoClean');
     var v15 = require('ehome/CoSTB');
     var v16 = require('ehome/CoRecipe');
     var v17 = require('ehome/CoSDVD');
     var v18 = require('ehome/SeRemoteCopy');
	 var v19 = require('ehome/CoIPTV');
	 

     return {
         'Ehome'               : v1,
         'CoSocket'            : v2,
         'CoFanSetup'   	   : v3,
         'CoLamp'              : v4,
         'CoProjector'         : v5,
         'CoCurtain'           : v6,
         'CoToilet'            : v7,
         'CoSwitch'            : v8,
         'CoKitchen'           : v9,
         'CoFastOper'          : v10,
         'CoTV'    			   : v11,
         'CoAir'			   : v12,
         'CoClean'  		   : v13,
         'CoSTB'               : v15,
         'CoRecipe'            : v16,
         'CoSDVD'              : v17,
         'SeRemoteCopy'        : v18,
		 'CoIPTV'              : v19
		 
      };
});