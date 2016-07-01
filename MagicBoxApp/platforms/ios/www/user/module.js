define(function(require) {
     var v1 = require('user/user-info');
     var v2 = require('user/systemSettings');
     var v3 = require('user/about-us');
     var v4 = require('user/user-changepwd');
     var v5 = require('user/register');
     return {
         'user-info': v1,
         'systemSettings': v2,
         'about-us':v3,
         'user-changepwd':v4,
         'register':v5
      };
});