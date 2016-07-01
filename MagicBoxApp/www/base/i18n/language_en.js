define(['zepto'], function($) {
	var i18n_zh = {
		Common:{
			tip:"tip",
			needlogin:'hi,you need login~' ,
			ok:"ok",
			cancel:"cancel",
			getUserMagicboxError:"get magicbox info error",
			getUserDeviceError:"get device info error",
			edit:"edit",
			delete:"delete",
			operate:"operate",
			deleteSucess:"delete sucess",
			deleteError:"delete error",
			editDeviceName:"edit device name",
			save:"save",
			editSucess:"edit sucess",
			editError:"edit error",
			zigbeeIsLoading:"zigbee is for loading,can not use now.",
			getUserMagicboxDeviceTimeOut:"get magicbox device timeout.",
			updateTimeOut:"update timeout , you can try agian.",
			updateSucess:"update sucess",

			inputMsg:"请输入名称",
			addMsg:"添加",
			customDevice:"自定义设备",
			magicboxError:"请先添加一个魔方！",
			saveSuccess:"保存成功",
			functionUnable:"该功能还未实现！",
			addMbAutoError:"扫描遇到错误，正在重试...",
			deviceIsExitsError:"该设备已经存在!",
			deviceAddError:"未获取到所添加设备的类别名称",
			repeatError:"请勿重复提交!",
			confirmBarCode:"请确认是正确的产品码!",
            serverError:"无法连接服务器，请重试...",
			timeOut:"操作超时，请重试...",
			noMagicBoxError:"未获取到该设备所属魔方编号！",
			noDeviceSeriError:"未获取到设备序列号！",
			noDeviceOfSeriError:"未找到相关序列号设备！",
			noMagicBoxIdError:"未获取到魔方编号！",
			choiceTimeError:"开始时间不可大于结束时间！",	
			enterAccountPrompt:"登录名请输入手机号/邮箱",	
			inShareUserConfirm:"确定共享给该用户吗?",
			inShareUserSuccess:"共享成功",
			inShareUserFail:"共享失败",
			choiceBeginTime:"请选择开始时间",
			choiceEndTime:"请选择结束时间",
			delSuccess:"删除成功",
			delFail:"删除失败",
			mapGeolocationFailed:"定位失败",
			mapWeatherOK:"更新天气成功",
			mapWeatherFailed:"更新天气失败",
			AuthorizationFailed:"授权失败",
			wxClientNotInstalled:"未安装微信客户端",
			enterPasswordMsg:"请输入密码",
			accounMsg:"账号为手机号或邮箱",
			passwordErrorMsg:"密码为6~12位",
			connectNetFailed:"网络已经断开，请打开网络",
			signInError:"登录失败用户名或密码错误！",
			signInSuccess:"登陆成功",
			phoneNoRrror:"手机号输入格式错误",
			passwordLength:"密码为6~12位",
			registerCaptchaOuttime	:"验证码超时",
			inputValidIpError: "请输入合法的IP地址！",	
			inputValidNetMaskError : "请输入合法的子网掩码！",
			inputValidGatewayError : "请输入合法的网关！",
			inputValidDns1Error : "请输入合法的DNS！",
			magicboxUsableError  : "魔方不可用，请重试",
			setIpNetworkSuc :"设置IP地址、子网掩码、网关、DNS成功！",
			inputSSID:"请输入SSID！",
			inputPassword:"请输入密码！",
			addWifiFailed : "添加WIFI失败，请重试",
			setModeSSIDPasswordSuc : "设置模式、SSID、密码成功！",
			setCameraBrightnessFailed : "设置魔方摄像头亮度失败，请重试",
			setCameraContrastFailed : "设置魔方摄像头对比度失败，请重试",
			areUSuresetCameraContrast : "确定修改摄像头对比度为",
			setMagixboxCameraFailed : "设置魔方摄像头失败，请重试",
			setMbVedioConnectionFailed : "魔方视频连接错误，请重试",
			registerSuccess		:"用户注册成功",
			registerFailed		:"用户注册失败",
			registerPasswordUnmatched	:"新设密码不匹配",
			registerUserloginRepeat	:"该手机号码已被注册",
			registerSendMsgFailed	:"发送短信失败",
			registerCaptchaUnmatched	:"验证码错误",
			registerCaptchaOuttime	:"验证码超时",
			registerCaptchaNotnull	:"验证码不能为空",
			phoneNoNotnull:"手机号输入格式错误",
			shortMessageSending:"验证码短信已经发送至",
			surplus:"剩余",
			second:"秒"
		},
		InUserInfoL:{
			title:"Smart Home",
			subtitle:"Intelligent assistant to your side", 
			accountNumber:"Account number",
			password:"Password",
			land:"login",
			fTPassword:"forget password",
			nAccount:"have no account number？",
			regAccount:"regist account number",
			passwordPlaceholder:"login Password",
			accountPlaceholder:"TEL/email"
		},
		InUserInfoReg:{
			accountNumber:"account number",
			register_password:"set password",
			register_password_confirm:"confirm password",
			register_phoneNO:"TEL",
			register_captcha:"verification code",
			submit_register_info:"register",
			register_password_placeholder:"6-12 bit letter&NO",
			register_password_confirm_placeholder:"input password again",
			register_phoneNO_placeholder:"please input TEL NO",
			register_captcha_placeholder:"SMS verification code",
			time_CAPTCHA:"Get verification code in 50s",
			accountNumber_placeholder:"TEL/email"
		},
		magicbox_Infraredremotecontrol:{
			CoTV:"TV",
			CoSTB:"set top box",
			CoAir:"Air conditioner",
			CoFanSetup:"CoFan",
			CoLamp:"CoLamp",
			CoSDVD:"DVD",
			CoClean:"purifier",
			SeAddDev:"add equipment"
		},
		InMBSetup:{
			SeAddDev:"add configured smart devices",
			add:"add",
			NetSetup:"Network settings",
			msgSub:"Message subscription",
			BluSet:"Bluetooth settings",
			EquDetails:"Equipment details",
			upgrade:"Firmware upgrade",
			DeviceRestart:"Restart device ",
			about:"About smart cube"
		},
		addInShareUser:{
			choiceTime:"Please select a valid date",
			loginName:"login name",
			QQ:"QQ",
			weiXin:"WeChat",
			weiBo:"wei bo",
			remarks:"note",
			save:"Save"
		},
		InShareUser:{
			alreadyShare:"Already shared",
			userText:"User"
		},
		magicbox_InProfileSet:{
			title:"Scene mode",
			businessAffairs:"Business affairs",
			fashionDynamic:"Fashion dynamic",
			charmYouth:"Charm youth"
		},
		magicbox_PhoneticFunction:{
			title:"Voice function",
			prompt:"Hello, may I ask what help?",
			warning:"Recording time is too short"
		},
		CameraSetup:{
			cSwitch:"Switch",
			timingSwitch:"timing Switch",
			photoRecord:"Photo record",
			emptyPhoto:"Empty photo",
			empty:"Empty"
		},
		StCharger:{
			situation:"Can charge for this machine",
			frequency:"1.5",
			frequencyText:"frequency",
			status:"Free medium",
			presentSituation:"In charge",
			ratedCurrent:"Rated current",
			percentage:"当前电流比",
			electricCurrent:"USB-电流",
			geterror:"get error!",
			getload:"get loading!"
		},
		MeIndex:{
			MobilePhone: "not logged in",
			NickName: "please log in",
			title: "SmartHome",
			intelligentFinance: "wisdom finance",
			healthManagement: "health management",
			myEhome: "my E home",
			homeSecurity: "home security",
			smallSquidCube: "small squid cube",
			layoutScene: "layout scene",
			crackRepair: "Crack repair",
			financialFish: "financial fish",
			yunYizhen: "cloud is easy to examine",
			messageCenter: "message center",
			equipmentSharing: "equipment sharing",
			controlPanel: "control panel",
			intelligentLinkage: "intelligent linkage",
			scene :"scene",
			functionSetting: "function settings",
			helpCenter: "help center",
			about: "about"
		},
		CoLinkedDetails:{
			ifText:"if",
			pm2Check:"pm2.5 detecting instrument",
			condition:"condition",
			value:"value",
		    pleaseInput:"(please input)",
		    then:"then",
		    purifier:"purifier",
		    excute:"excute",
		    pushMsg:"push msg\“open air purifier\”",
		    cancle:"Cancle",
		    save:"Save"
		},
		CoLinkedList:{
			smartLinkageGanged:"Intelligent linkage",
			pollutionAlarm:"Pollution alarm",
			alarmMsg:"Indoor purifier PM2.5>95，push\“smoking\”",
			edit:"edit",
			deleteText:"delete",
			scurityAlarm:"Security alarm",
			purifierTreaterMsg:"Indoor purifierPM2.5>95，push\“smoking\”",
			turnonLight:"Drive off the porch light"
		},
		MeControlPanel:{
			controlPanel:"control panel",
			setUp:"setUp",
			open:"open",
			study:"study",
			bathroom:"bathroom",
			livingroom:"livingroom",
			kitchen:"kitchen",
			bedroom:"bedroom"
		},
		MeFuncSet:{
			funcSetup:"func setup",
			myMenue:"My menu",
			smartFinance:"Smart finance",
			healthManage:"Health manage",
			myEhome:"My Ehome",
			homeSecurity:"Home security",
			smallSquidCube:"Small SquidCube",
			layoutScene:"Layout Scene",
			crackRepair:"Crack repair",
			financialFish:"Financial fish",
			yunYizhen:"yunYizhen",
			extentionFunc:"Extention func",
			newFunc:"Add new func",
			find:"find",
			mormalUse:"mormal use",
			wrSmartCamera:"wr mart camera"
		},
		SeAlertList:{
			msgCenter:"Msg center"
		},
		magicbox_PlBTMain:{
			onBT:"onBT",
			offBT:"offBT",
			noPlay:"no Play",
			BT:"Bluetooth",
			readCard:"Read card",
			musicList:"music list",
			sleep:"sleep assistant"
		},
		ehome_Ehome:{
			title:"my Ehome",
			coswitch:"Switch",
			socket:"socket",
			lamp:"CoLamp",
			air:"Air conditioner",
			projector:"projector",
			fansetup:"coFan",
			tv:"TV",
			entertainment:"entertainment",
			clean:"purifier",
			kitchen:"smart kitchen",
			toilet:"smart toilet",
			curtain:"curtain",
			stb:"set top box",
			recipe:"food spectrum",
			fastoper:"fast operation",
			sdvd:"DVD"
		},
		ehome_Air:{
			title:"air conditioner",
			mode:"mode",
			airVolume:"air Volume",
			airDir:"air dir",
			autoDir:"auto dir"
		},
		magicbox_PlBTMain:{
			title:"bluetooth loudspeaker box",
			onBT:"on",
			offBT:"off",
			noPlay:"no play",
			BT:"Bluetooth",
			readCard:"Read card",
			musicList:"music list",
			sleep:"sleep assistant"
		},
		magicbox_CoBTSetup:{
			title:"Bluetooth settings",
			switch_title:"Switch",
			phoneBT:"TEL bluetooth",
			switch_on:"switch on",
			switch_off:"switch off",
			pairedDevice:"paired device",
			unPairedDevice:"unpaired device"
		},
		magicbox_PlBTSongList:{
			title:"music file"
		},
		ehome_CoSocket:{
			title:'socket',
			startTime:"start time",
			today:'today'
		},
		ehome_Lamp:{
			title:"CoLamp",
			brightness:'brightness',
			color:"color"
		},
		ehome_CoSwitch:{
			title:"Switch",
			off:'OFF',
			on:"ON",
			timing:"timing",
			room:"room"
		},
		ehome_CoProjector:{
			title:'projector',
			computer:"computer",
			video:"video",
			signalSource:"signal source",
			zoom:"zoom",
			confirm:"confirm",
			frame:"frame"
		},
		ehome_CoFanSetup:{
			title:'coFan',
			stall:"stall",
			head:"head",
			files:"files",
			off:"off",
			on:"on",
			height:"height",
			low:"low"
		},
		Ehome:{
			title:"equipment list",
			remark:"equipment list"
		},
		ZegBeeList:{
			title:"ZigBee",
			remark:"ZigBee",
			Switch:"Switch",
			Socket:"socket",
			Lamp:"CoLamp"
		},
		remotecopy:{
			title:"remote learning",
			remark:"remote learning"
		},
		ModelChoice:{
			title:"choice model",
			remark:"",
			type:"choice model",
			auto:"automatic matching"
		},
		magicbox:{
			name:"cube"
		},
		IR_Ac:{
			name:"Air conditioner",
			type:"AC00"
		},
		IR_Prj:{
			name:"projector",
			type:"PJT0"
		},
		IR_Fan:{
			name:"CoFan",
			type:"FAN0"
		},
		IR_Stb:{
			name:"set top box",
			type:"STB0"
		},
		IR_Dvd:{
			name:"DVD",
			type:"DVD0"
		},
		IR_Tv:{
			name:"TV",
			type:"TV00"
		},
		IR_Iptv:{
			name:"IPTV",
			type:"IPTV"
		},
		ZB_Sw:{
			name:"smart witch",
			type:"SW00"
		},
		ZB_Ss:{
			name:"smart socket",
			type:"SS00"
		},
		ZB_Slb:{
			name:"smart bulb",
			type:"SLB0"
		},
		Period:{
			second:{name:"second"},
			minute:{name:"minute"},
			hour:{name:"hour"},
			day:{name:"day"},
			week:{name:"week"},
			month:{name:"month"},
			year:{name:"year"},
			manual:{name:"manual"},
			none:{name:"none"}
		},
		IRDevList:{
			title:"infrared equipment",
			remark:"",
			custom:"custom"
		},
		gataway_choice:{
			title:"getway select",
			remark:"getway select"
		},
		Dev_Rename:{
			title:"setup name",
			remark:"setup"
		},
		brandChoice:{
			title:"select brand",
			remark:"select brand"
		},
		AutoMatch:{
			title:"automatic matching equipment",
			remark:"automatic matching equipment",
			btnYes:"yes",
			btnNo:"no",
			loadGetSearchIndex:"load search index from remote server!",
			thisBrandDeviceHaveNoSearchIndex:"this brand device has no search index",
			checkSearchIndexFor:"start device checkk(group%d),please press the key for check,press no to next group!",
			checkLastSearchIndexFinish:"it was finish check device，press back to restart!",
			waitForLoadSearchIndex:"please wait for get search index!"
		},
		AddDev:{
			title:"add equipment",
			remark:"add equipment",
			MB:"little fish cube",
			IR:"infrared equipment",
			ZB:"ZigBee"
		},
		AddMB:{
			title:"addlittle fish cube",
			remark:"addlittle fish cube",
		    autoscan:"auto scan",
		    barcord:"scan barcord"
		},
		AddMBAuto:{
			title:"add cube",
			remark:"add cube"
		},
		AddZigBee:{
			title:"add",
			remark:"add",
			msg1:"direct input identification code",
			msg2:"scan code recognition"
		},
		ehome_CoTV:{
			title:"TV",
			volume:"volume",
			channel:"channel",
			source:"source"
		},
		ehome_CoClean:{
			title:'purifier',
			currentState_tab:"current state",
			historyRecord_tab:"history record",
			timingSwitch_tab:"timing switch",
			text_1: "current indoor air conditions",
			text_2: "good",
			text_3: "temperature",
			text_4: "humidity",
			text_5: "at the breath, my master",
			text_6: "wind speed"
		},
		ehome_Kitchen:{
			title:"smart kitchen",
			microwaveOven:"microwave oven",
			refrigerator:"refrigerator",
			oven:"oven",
			rangeHood:"range hood",
			riceCooker:"rice cooker",
			notBound:"not bound",
			open:"open"
		},
		ehome_CoToilet:{
			title:'smart toilet',
			someone:"someone",
			notSomeone:"notSomeone",
			temperature:"temperature",
			water:"water",
			close:"close",
			low:"low",
			middle:"middle",
			height:"height",
			small:"small",
			large:"large"
		},
		ehome_CoCurtain:{
			title:'curtain',
			opening:"opening",
			close:"close",
			halfOpen:"half open",
			open:"open"
		},
		ehome_CoSTB:{
			title:'set top box',
			tv:'TV'
		},
		ehome_CoSDVD:{
			title:"DVD",
			power:'power',
			mute:"mute",
			switchBin:"Switch仓",
			volume:"volume",
			fastForward:"forward",
			rewind:"rewind",
			lastSong:"last song",
			nextSong:"next song",
			play:"play",
			menu:"menu",
			returning:"returning"
		},
		magicbox_InAboutMB:{
			title:'about cube',
			loadConfigTimeOut:"load config timeout!",
			loadConfigSucess:"load config sucess!"
		},
		magicbox_InConfBackup:{
			title:'config backup',
			remark_text:'note：',
			saveConfigTimeOut:"save config timeout!",
			saveConfigSucess:"save config sucess!"
		},
		footer_menu:{
			 home:"home page",
			 equipment:"equipment",
			 mall:"dare to shang mall",
			 my:"mine"
		 },
		magicbox_PlRealTimeVideo:{
			title:"camera"
		},
		magicbox_CameraSetup:{
			title:"camera setup",
			cSwitch:"switch",
			timingSwitch:"timing switch",
			photoRecord:"photo record",
			emptyPhoto:"empty photo",
			empty:"empty"
		},
		magicbox_PlCaptureRec:{
			title:"photo record"
		},
		magicbox_PhotoDetail:{
			title:"photo enlargement"
		},
		magicbox_StCharger:{
			title:"charging treasure",
			situation:"",
			frequency:"93",
			frequencyText:"%",
			status:"free medium",
			presentSituation:"in charge",
			ratedCurrent:"rated current",
			percentage:"percent age",
			electricCurrent:"USB-ele-current"
		},
		magicbox_InShareUser:{
			title:"equipment share",
			alreadyShare:"Already shared",
			userText:"User"
		},
		magicbox_addInShareUser:{
			title:"equipment share",
			choiceTime:"Please select a valid date",
			loginName:"login name",
			QQ:"QQ",
			weiXin:"WeChat",
			weiBo:"wei bo",
			remarks:"note",
			save:"Save",
			to:"to"
		},
		magicbox_InMBSetup:{
			title:"setup",
			SeAddDev:"Add configured smart devices",
			add:"add",
			NetSetup:"Network settings",
			msgSub:"Message subscription",
			BluSet:"Bluetooth settings",
			EquDetails:"Equipment details",
			upgrade:"Firmware upgrade",
			DeviceRestart:"Restart device ",
			about:"About smart cube"
		},
		magicbox_InNetSetup:{
			title:"Network settings",
			networkMode:"Network mode",
			router:"Router",
			relay:"relay",
			wifiSettings:"WIFI setup",
			ssid:"SSID",
			ssidPlaceholder:"input SSID",
			password:"password",
			passwordPlaceholder:"input assword",
			networkSettings:"network setup",
			ipAddress:"address",
			ipAddressPlaceholder:"input address",
			netMask:"netmask",
			netMaskPlaceholder:"input netMask",
			gateway:"gateway",
			gatewayPlaceholder:"input gateway",
			dns:"DNS",
			dnsPlaceholder:"input DNS",
			ssidDefultValue:"magicboxwifi"
		},
		magicbox_InMBRestart:{
			title:"restart cube",
			restart:"restart",
			restartPrompt:"restart system，please wait...",
			restartTimeOut:"magicbox restart timeout!",
			restartSucess:"magicbox restart sucess!"
		},
		magicbox_InUpgrade:{
			title:"firmware upgrade",
			Prompt:"executing the update, please wait a moment..."
		},
		magicbox_StMBMain:{
			title:"smart cube",
			HW:"HW",
			CDB:"CDB",
			YX:"YX",
			SXT:"SXT",
			CJ:"CJ",
			QJ:"QJ",
			GX:"GX",
			comfortableDegree:"SXD",
			temperature:"WD",
			humidity:"SD",
			methanol:"JC",
			chemicalPollutants:"WYW",
			quantized:"空气质量"
		},
		magicbox_SeSubscribe:{
			title:"message subscription",
			ldDetection:"low battery detection",
			repeatedAlarm:"repeated alarm",
			no:"no",
			yes:"yes",
			alarmInterval:"alarmInterval(s)",
			aqDetection:"air quality detection",
			ihDetection:"infrared human detection",
			tempDetection:"temp  detection",
			tempMax:"temp max",
			tempMin:"temp min",
			thDetection:"humidity detection",
			thMax:"humidity max",
			thMin:"humidity mini"
		}
	};
	return i18n_zh
});