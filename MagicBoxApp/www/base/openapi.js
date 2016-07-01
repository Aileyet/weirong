define(['zepto'], function($) {
	//var ip ="http://183.128.186.32:8899/MagicBox";
	//var ip = "http://115.195.55.93:8899/MagicBox";
	//var ip = "http://125.118.61.131:8899/MagicBox";
	var ip = "http://192.168.0.105:8899/MagicBox";
	var OpenAPI = {
		"IP" : ip,
		"dataType": "jsonp",
		"pageSize": 10,
		"clientId": "1a33f063-d1da-4920-bceb-00cf718db2ab",
		"clientSecret": "99b38d75-4ed9-4eca-8648-920c3bffe3d2",

		"access_token": ip + "/action/oath2/token.do",
		"access_user": ip + "/action/oath2/user.do",
		"websocketEndPoint": ip + "/magicboxSEP",
		
		"findProvinceNames": ip + "/action/map/findProvinceNames.do",
		"findInferiorGeos": ip + "/action/map/findInferiorGeos.do",
		"findHotCityNames": ip + "/action/map/findHotCityNames.do",
		"findAroundFaci":ip + "/action/map/findFacilitiesByTypeAndIds.do",
		"findDistricts":ip + "/action/map/findDistrictsByCityName.do",
		"searchBankPoints":ip + "/action/bankpoint/searchBankPointsApp.do",
		"findBankNames":ip + "/action/bankpoint/findBankNames.do",
		"findBankBusinesses":ip + "/action/bankpoint/findBankBusinesses.do",
		"findGeoByName" : ip + "/action/map/findGeoByName.do",
		"findDistrictGeos" : ip + "/action/map/findDistrictGeos.do",
		
		"findBpNamesList":ip + "/action/bankpoint/findBpNamesList.do",
		
		"getBriefBankpoint" : ip +"/action/bankpoint/briefBankpoint.do",
		"getBankpointDetail" : ip +"/action/bankpoint/bankpointDetail.do",
		
		"getAppraiseInfo":  ip + "/action/appraise/appraiseInfo.do",
		"getAppraisePage":  ip + "/action/appraise/appraisePage.do",
		"saveAppraise" : ip + "/action/appraise/saveAppraise.do",
		"getSubscribePage" : ip + "/action/subscribes/subscribePage.do",
		"getSubscribeForm" : ip + "/action/subscribes/subscribeForm.do",
		"getGoSubscribeForm" : ip + "/action/subscribes/goSubscribeForm.do",
		"updateSubscribe" : ip + "/action/subscribes/updateSubscribe.do",
		"getBankFormPage" : ip + "/action/subscribes/bankTempletePage.do",
		"getBusinessPage" : ip +"/action/subscribes/businessType.do",
		
		"getPersonal" : ip + "/action/userJ/personalForm.do",
		"savePersonal" : ip + "/action/userJ/savePersonal.do",
		"portrait_update" : ip + "/action/userJ/uploadPortrait.do",
		
		
		"getSubsFormPage" : ip + "/action/form/SubsFormList.do",
		"searchFormPage" : ip + "/action/form/searchFormList.do",
		"businessPage" : ip + "/action/form/businessList.do",
		"tempItemList" : ip + "/action/form/tempItemList.do",
		"getcomponent": ip + "/action/forms/findAllComponentTypes.do",
		"saveForm": ip + "/action/forms/saveForm.do",
		"saveContacts": ip + "/action/forms/saveContacts.do",		
		"getTempItemContents": ip + "/action/forms/findTempItemContents.do",
		"getFrequentContacts": ip + "/action/forms/findFrequentContacts.do",
		"getUserName" : ip + "/action/forms/findUserName.do",
		"getCardNumber" : ip + "/action/forms/findCardNumber.do",
		"getLoginCardNumber": ip + "/action/forms/findLoginCardNumber.do",
		
		"obtainSubscribeForm" : ip + "/action/subscribes/obtainSubscribeForm.do",
		"obtainFormInfo" : ip + "/action/forms/obtainFormInfo.do",
		
		"changePwd":ip + "/action/oauth2/changePassword.do",
		"sendCaptcha":ip + "/action/oauth2/sendCaptcha.do",
		"addUserLogin":ip + "/action/oauth2/addUserLogin.do",

                "readIRCBrands":ip + "/api/action/dev/readIRCBrands.do",
                "readIRCModels":ip + "/api/action/dev/readIRCModels.do",
				"readAllMagicBox":ip+"/api/action/dev/readAllGateway.do",
				"readUserDevices":ip+"/api/action/dev/readUserDevices.do",
				"readIRCAutoSearchIndexs":ip+"/api/action/dev/readIRCAutoSearchIndexs.do",
				"changGatewayName":ip+"/api/action/dev/changGatewayName.do",
				"delGateway":ip+"/api/action/dev/delGateway.do",
				"addGateway":ip+"/api/action/dev/addGateway.do",
				"readMyShareUsers":ip+"/api/action/dev/readMyShareUsers.do",
				"addMyShareUsers":ip+"/api/action/dev/addMyShareUsers.do",
				"readShareUserDevices":ip+"/api/action/dev/readShareUserDevices.do",
				"delMyShareUsers":ip+"/api/action/dev/delMyShareUsers.do",
				"getWeather":"http://open.weather.com.cn/data/",
				"getWthrcdn":"http://wthrcdn.etouch.cn/WeatherApi",
				"readCityPM25":ip+"/action/dev/readCityPM25.do",
		 "readAllAppMenu":ip+"/api/action/dev/readAllAppMenu.do",
		 "addAppMenu":ip+"/api/action/dev/addAppMenu.do"
	};

	return OpenAPI;

});