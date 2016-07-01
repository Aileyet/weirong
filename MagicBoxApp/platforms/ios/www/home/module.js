define(function(require) {
     var v1 = require('home/home-list');
     var v2 = require('home/index');
     var v3 = require('home/InUserInfoReg');
     var v4 = require('home/home-controlPanel');
     var v5 = require('home/home-wirelessDoorbell');
     var v6 = require('home/MeIndex');
     var v7 = require('home/MeControlPanel');
     var v8 = require('home/InUserInfoL');
     var v9 = require('home/MeFuncSet');
     var v10 = require('home/SeAlertList');
     var v11 = require('home/CoLinkedList');
     var v12 = require('home/CoLinkedDetails');
     var v13 = require('home/OneKeyConfig');
     return {
         'home-list'             : v1,
         'index'                 : v2,
         'InUserInfoReg'         : v3,
         'home-controlPanel'     : v4,
         'home-wirelessDoorbell' : v5,
         'MeIndex'               : v6,
         'MeControlPanel'        : v7,
         'InUserInfoL'           : v8,
         'MeFuncSet'             : v9,
         'SeAlertList'           : v10,
         'CoLinkedList'          : v11,
         'CoLinkedDetails'       : v12,
         'OneKeyConfig'          : v13
      };
});