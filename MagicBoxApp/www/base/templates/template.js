define(['zepto','../../base/i18nMain','../../base/templates/tempUtil','../../base/templates/templateIcon'], function($,I18n,_U,icon) {
	 var _T={
	 		 Color:{
	 		 	barColor:icon.Color.barColor,   //默认背景颜色（黑色或者白色）
	 		 	checkbarColor:icon.Color.checkbarColor, //选中背景颜色（金色或者粉色）
	 		 	iconColor:icon.Color.iconColor,		//图标颜色，（白色活着黑色）
	 		 	sliderBgColor:icon.Color.sliderBgColor
	 		 },
			 home_MeIndex : {
				 id:'home_MeIndex',    //页面ID
				 remark:"首页",         //备注
				 title:I18n.MeIndex.title, //标题
				 leftIcon:"&#xe660;", //头部左面图标
				 rightIcon:"",        //头部右面图标
				 data:{
					 login:{
						 account:I18n.MeIndex.mobilePhone,
						 info:I18n.MeIndex.nickName,
						 photo:"&#xe66c;",
						 icon:"&#xe682;"
					 },
					 menus_1:[            //菜单集合 1
					        {
					        	name:I18n.MeIndex.intelligentFinance,              //菜单名称
					        	order:1,    //菜单顺序
					        	icon:"&#xe600;",           //菜单图标
					        	data_module:"",            //跳转模块
					        	data_view:"",			   //跳转视图
					        	bgcolor:"menu-bg-black" //菜单背景色
					        		
					        },{
					        	name:I18n.MeIndex.healthManagement,
					        	order:2,    //菜单顺序
					        	icon:"&#xe601;",
					        	data_module:"",            
					        	data_view:"",
					        	bgcolor:"menu-bg-pink"
					        },{
					        	name:I18n.MeIndex.myEhome,
					        	order:3,    //菜单顺序
					        	icon:"&#xe602;",
					        	data_module:"devicemanage",
					        	data_view:"Ehome",
					        	bgcolor:"menu-bg-pink"
					        },{
					        	name:I18n.MeIndex.homeSecurity,
					        	order:4,    //菜单顺序
					        	icon:"&#xe603;",
					        	data_module:"",            
					        	data_view:"",
					        	bgcolor:"menu-bg-pink"
					        },{
					        	name:I18n.MeIndex.layoutScene,
					        	order:5,    //菜单顺序
					        	icon:"&#xe605;",
					        	data_module:"scene",
					        	data_view:"CoStageSet",
					        	bgcolor:"menu-bg-pink"
					        },{
					        	name:I18n.MeIndex.crackRepair,
					        	order:6,    //菜单顺序
					        	icon:"&#xe606;",
					        	data_module:"",            
					        	data_view:"",
					        	bgcolor:"menu-bg-black"
					        },{
					        	name:I18n.MeIndex.financialFish,
					        	order:7,    //菜单顺序
					        	icon:"&#xe607;",
					        	data_module:"",            
					        	data_view:"",
					        	bgcolor:"menu-bg-pink"
					        },{
					        	name:I18n.MeIndex.yunYizhen,
					        	order:8,    //菜单顺序
					        	icon:"&#xe608;",
					        	data_module:"",            
					        	data_view:"",
					        	bgcolor:"menu-bg-black"
					        }
							,{
					        	name:I18n.MeIndex.smallSquidCube,
					        	order:9,    //菜单顺序
					        	icon:"&#xe604;",
					        	data_module:"magicbox",            
					        	data_view:"StMBMain",
					        	bgcolor:"menu-bg-pink"
					        }
					 ],
				     menus_2:[
				              {
				            	  name:I18n.MeIndex.messageCenter,
						          icon:"&#xe67b;",
						          data_module:"home",            
						          data_view:"SeAlertList",
						          bgcolor:"",
						          color:"",
						          num:"5"
				              },{
				            	  name:I18n.MeIndex.equipmentSharing,
						          icon:"&#xe67c;",
						          data_module:"magicbox",            
						          data_view:"InShareUser",
						          bgcolor:"",
						          color:"",
						          num:""
				              },{
				            	  name:I18n.MeIndex.controlPanel,
						          icon:"&#xe67d;",
						          data_module:"home",            
						          data_view:"MeControlPanel",
						          bgcolor:"",
						          color:"",
						          num:""
				              },{
				            	  name:I18n.MeIndex.intelligentLinkage,
						          icon:"&#xe67e;",
						          data_module:"home",            
						          data_view:"CoLinkedList",
						          bgcolor:"",
						          color:"",
						          num:""
				              },{
				            	  name:I18n.MeIndex.sceneMode,
						          icon:"&#xe67f;",
						          data_module:"magicbox",            
						          data_view:"InProfileSet",
						          bgcolor:"",
						          color:"",
						          num:""
				              },{
				            	  name:I18n.MeIndex.functionSetting,
						          icon:"&#xe676;",
						          data_module:"home",            
						          data_view:"MeFuncSet",
						          bgcolor:"",
						          color:"",
						          num:""
				              },{
				            	  name:I18n.MeIndex.helpCenter,
						          icon:"&#xe680;",
						          data_module:"",            
						          data_view:"",
						          bgcolor:"",
						          color:"",
						          num:""
				              },{
				            	  name:I18n.MeIndex.about,
						          icon:"&#xe681;",
						          data_module:"",            
						          data_view:"",
						          bgcolor:"",
						          color:"",
						          num:""
				              }
				     ]
				 }
			 },
			 home_CoLinkedDetails : {
				 id:'home_CoLinkedDetails',    //页面ID
				 remark:"联动条件",         //备注
				 title:"联动条件",       //标题
				 leftIcon:"&#xe661;", //头部左面图标
				 rightIcon:"",        //头部右面图标
				 data:{
					 ifText:I18n.CoLinkedDetails.ifText,
			         pm2Check:I18n.CoLinkedDetails.pm2Check,
			         condition:I18n.CoLinkedDetails.condition,
			         value:I18n.CoLinkedDetails.value,
			         pleaseInput:I18n.CoLinkedDetails.pleaseInput,
			         then:I18n.CoLinkedDetails.then,
			         purifier:I18n.CoLinkedDetails.purifier,
					 excute:I18n.CoLinkedDetails.excute,
					 pushMsg:I18n.CoLinkedDetails.pushMsg,
					 cancle:I18n.CoLinkedDetails.cancle,
					 save:I18n.CoLinkedDetails.save
				 }
			 },	        
			 home_CoLinkedList : {
				 id:'home_CoLinkedList',    //页面ID
				 remark:I18n.CoLinkedList.smartLinkageGanged,         //备注
				 title:I18n.CoLinkedList.smartLinkageGanged,       //标题
				 leftIcon:"&#xe661;", //头部左面图标
				 rightIcon:"&#xe61d;",        //头部右面图标
				 data:{
					 pollutionAlarm:I18n.CoLinkedList.pollutionAlarm,
					 alarmMsg:I18n.CoLinkedList.alarmMsg,
					 edit:I18n.CoLinkedList.edit,
					 deleteText:I18n.CoLinkedList.deleteText,
					 scurityAlarm:I18n.CoLinkedList.scurityAlarm,
					 purifierTreaterMsg:I18n.CoLinkedList.purifierTreaterMsg,
					 turnonLight:I18n.CoLinkedList.turnonLight
				 }
			 },
			 home_InUserInfoL : {
				 id:'home_InUserInfoL',    //页面ID
				 remark:"登录",        //备注
				 title:"",       //标题
				 leftIcon:icon.home_InUserInfoL.leftIcon, //头部左面图标
				 rightIcon:"",       //头部右面图标
				 data:{
					   title:I18n.InUserInfoL.title,
					   subtitle:I18n.InUserInfoL.subtitle,
					   accountNumber:I18n.InUserInfoL.accountNumber,
					   password:I18n.InUserInfoL.password,
					   land:I18n.InUserInfoL.land,
					   fTPassword:I18n.InUserInfoL.fTPassword,
					   nAccount:I18n.InUserInfoL.nAccount,
					   regAccount:I18n.InUserInfoL.regAccount,
					   passwordPlaceholder:I18n.InUserInfoL.passwordPlaceholder,
					   accountPlaceholder:I18n.InUserInfoL.accountPlaceholder,
					   wb:icon.home_InUserInfoL.wb,
					   wbColor:icon.home_InUserInfoL.wbColor,
					   qq:icon.home_InUserInfoL.qq,
					   qqColor:icon.home_InUserInfoL.qqColor,
					   wx:icon.home_InUserInfoL.wx,
					   wxColor:icon.home_InUserInfoL.wxColor
				 }
			 },
			 home_InUserInfoReg: {
				 id:'home_InUserInfoReg',    //页面ID
				 remark:"注册",        //备注
				 title:I18n.InUserInfoReg.submit_register_info,       //标题
				 leftIcon:"&#xe661;", //头部左面图标
				 rightIcon:"",       //头部右面图标
				 data:{
					 accountNumber:I18n.InUserInfoReg.accountNumber,
					 register_password:I18n.InUserInfoReg.register_password,
					 register_password_confirm:I18n.InUserInfoReg.register_password_confirm,
					 register_phoneNO:I18n.InUserInfoReg.register_phoneNO,
					 register_captcha:I18n.InUserInfoReg.register_captcha,
					 submit_register_info:I18n.InUserInfoReg.submit_register_info,
					 register_password_placeholder:I18n.InUserInfoReg.register_password_placeholder,
					 register_password_confirm_placeholder:I18n.InUserInfoReg.register_password_confirm_placeholder,
					 register_phoneNO_placeholder:I18n.InUserInfoReg.register_phoneNO_placeholder,
					 register_captcha_placeholder:I18n.InUserInfoReg.register_captcha_placeholder,
					 time_CAPTCHA:I18n.InUserInfoReg.time_CAPTCHA,
					 accountNumber_placeholder:I18n.InUserInfoReg.accountNumber_placeholder
				 }
			 },
			 home_MeControlPanel: {
				 id:'home_MeControlPanel',    //页面ID
				 remark:"控制面板",        //备注
				 title:I18n.MeControlPanel.controlPanel,       //标题
				 leftIcon:"&#xe661;", //头部左面图标
				 rightIcon:"",       //头部右面图标
				 data:{
					 controlPanel:I18n.MeControlPanel.controlPanel,
					 setUp:I18n.MeControlPanel.setUp,
					 open:I18n.MeControlPanel.open,
					 study:I18n.MeControlPanel.study,
					 bathroom:I18n.MeControlPanel.bathroom,
					 livingroom:I18n.MeControlPanel.livingroom,
					 kitchen:I18n.MeControlPanel.kitchen,
					 bedroom:I18n.MeControlPanel.bedroom
				 }
			 },
			 home_MeFuncSet: {
				 id:'home_MeFuncSet',    //页面ID
				 remark:"功能设置",        //备注
				 title:I18n.MeControlPanel.controlPanel,       //标题
				 leftIcon:"&#xe661;", //头部左面图标
				 rightIcon:"",       //头部右面图标
				 data:{
					 body:{
						 funcSetup:I18n.MeFuncSet.controlPanel,
						 myMenue:I18n.MeFuncSet.myMenue,
						 extentionFunc:I18n.MeFuncSet.extentionFunc,
						 newFunc:I18n.MeFuncSet.newFunc
					 },
					 menus:{
						 find:I18n.MeFuncSet.find,
						 mormalUse:I18n.MeFuncSet.mormalUse
					 }/*[
				        {
				        	name:I18n.MeFuncSet.smartFinance,
				        	find:I18n.MeFuncSet.find,
							mormalUse:I18n.MeFuncSet.mormalUse
				        	
				        },{
				        	name:I18n.MeFuncSet.healthManage,
				        	find:I18n.MeFuncSet.find,
							mormalUse:I18n.MeFuncSet.mormalUse
				        	
				        },{
				        	name:I18n.MeFuncSet.myEhome,
				        	find:I18n.MeFuncSet.find,
							mormalUse:I18n.MeFuncSet.mormalUse
				        	
				        },{
				        	name:I18n.MeFuncSet.homeSecurity,
				        	find:I18n.MeFuncSet.find,
							mormalUse:I18n.MeFuncSet.mormalUse
				        	
				        },{
				        	name:I18n.MeFuncSet.smallSquidCube,
				        	find:I18n.MeFuncSet.find,
							mormalUse:I18n.MeFuncSet.mormalUse
				        	
				        },{
				        	name:I18n.MeFuncSet.layoutScene,
				        	find:I18n.MeFuncSet.find,
							mormalUse:I18n.MeFuncSet.mormalUse
				        	
				        },{
				        	name:I18n.MeFuncSet.crackRepair,
				        	find:I18n.MeFuncSet.find,
							mormalUse:I18n.MeFuncSet.mormalUse
				        	
				        },{
				        	name:I18n.MeFuncSet.financialFish,
				        	find:I18n.MeFuncSet.find,
							mormalUse:I18n.MeFuncSet.mormalUse
				        	
				        },{
				        	name:I18n.MeFuncSet.yunYizhen,
				        	find:I18n.MeFuncSet.find,
							mormalUse:I18n.MeFuncSet.mormalUse
				        }
					 ]*/
				 }
			 },
			 home_SeAlertList: {		        
				 id:'home_SeAlertList',    //页面ID
				 remark:"消息中心",        //备注
				 title:I18n.SeAlertList.msgCenter,       //标题
				 leftIcon:"&#xe661;", //头部左面图标
				 rightIcon:"",       //头部右面图标
				 data:{
					 msgCenter:I18n.SeAlertList.msgCenter
				 }
			 },
			 ehome_Ehome:{
				 id:'ehome_Ehome',    //页面ID
				 remark:"我的E家",         //备注
				 title:I18n.ehome_Ehome.title,       //标题
				 leftIcon:"", //头部左面图标
				 rightIcon:"",        //头部右面图标
				 data:{
					 menus:[
						{
							name:I18n.ehome_Ehome.coswitch,   
							order:1,
							icon:"&#xe609;",           
							data_module:"ehome",            
							data_view:"CoSwitch",			   
							bgcolor:"" 
								
						},{
							name:I18n.ehome_Ehome.socket,   
							order:2,
							icon:"&#xe60a;",           
							data_module:"ehome",            
							data_view:"CoSocket",			   
							bgcolor:"" 
								
						},{
							name:I18n.ehome_Ehome.lamp,       
							order:3,
							icon:"&#xe60b;",           
							data_module:"ehome",            
							data_view:"CoLamp",			   
							bgcolor:"" 
								
						},{
							name:I18n.ehome_Ehome.air,  
							order:4,
							icon:"&#xe60c;",           
							data_module:"ehome",            
							data_view:"CoAir",			   
							bgcolor:"" 
								
						},{
							name:I18n.ehome_Ehome.projector,
							order:5,
							icon:"&#xe60d;",           
							data_module:"ehome",            
							data_view:"CoProjector",			   
							bgcolor:"" 
								
						},{
							name:I18n.ehome_Ehome.fansetup,
							order:6,
							icon:"&#xe610;",           
							data_module:"ehome",            
							data_view:"CoFanSetup",			   
							bgcolor:"" 
								
						},{
							name:I18n.ehome_Ehome.tv,
							order:7,
							icon:"&#xe611;",           
							data_module:"ehome",            
							data_view:"CoTV",			   
							bgcolor:"" 
								
						},{
							name:I18n.ehome_Ehome.entertainment, 
							order:8,
							icon:"&#xe60e;",           
							data_module:"",            
							data_view:"",			   
							bgcolor:"" 
								
						},{
							name:I18n.ehome_Ehome.clean,    
							order:9,
							icon:"&#xe60f;",           
							data_module:"ehome",            
							data_view:"CoClean",			   
							bgcolor:"" 
								
						},{
							name:I18n.ehome_Ehome.kitchen,    
							order:10,
							icon:"&#xe612;",           
							data_module:"ehome",            
							data_view:"CoKitchen",			   
							bgcolor:"" 
								
						},{
							name:I18n.ehome_Ehome.toilet,     
							order:11,
							icon:"&#xe613;",           
							data_module:"ehome",            
							data_view:"CoToilet",			   
							bgcolor:"" 
								
						},{
							name:I18n.ehome_Ehome.curtain,   
							order:12,
							icon:"&#xe614;",           
							data_module:"ehome",            
							data_view:"CoCurtain",			   
							bgcolor:"" 
								
						},{
							name:I18n.ehome_Ehome.stb, 
							order:13,
							icon:"&#xe663;",           
							data_module:"ehome",            
							data_view:"CoSTB",			   
							bgcolor:"" 
								
						},/*{
							name:I18n.ehome_Ehome.recipe,   
							order:15,           
							icon:"&#xe65e;",           
							data_module:"ehome",            
							data_view:"CoRecipe",			   
							bgcolor:"" 
								
						},{
							name:I18n.ehome_Ehome.fastOper,    
							order:16,         
							icon:"&#xe65d;",           
							data_module:"ehome",            
							data_view:"CoFastOper",			   
							bgcolor:"" 
								
						},*/{
							name:I18n.ehome_Ehome.sdvd,     
							order:14,
							icon:"&#xe665;",           
							data_module:"ehome",            
							data_view:"CoSDVD",			   
							bgcolor:"" 
								
						}
					 ]
				 }
			 },
			 ehome_Air:{
				 id:'ehome_Air',   
				 remark:"空调",         
				 title:I18n.ehome_Air.title,
                 titleHide:I18n.ehome_Air.titleHide,     				 
				 leftIcon:"&#xe661;", 
				 rightIcon:"&#xe641;", 
                 rightIconHide:I18n.Common.save,
				 data:{
					 onbkColor:icon.ehome_Air.onbkColor,
					 onColor:icon.ehome_Air.onColor,
					 offbkColor:icon.ehome_Air.offbkColor,	
					 offColor:icon.ehome_Air.offColor,
					 power:{
						name:"",
						icon:"&#xe63f;",
						id:"power",
						style:""
					 },
					 mode:{
						name:I18n.ehome_Air.mode,
						icon:"&#xe623;",
						id:"mode",
						style:"margin-right:-20px;"
					 },
					 airVolume:{
						name:I18n.ehome_Air.airVolume,
						icon:"&#xe68a;",
						id:"airVolume",
						style:""
					 },
					 airDir:{
						name:I18n.ehome_Air.airDir,
						icon:"&#xe689;",
						id:"airDir",
						style:""
					 },
					 autoDir:{
						name:I18n.ehome_Air.autoDir,
						icon:"&#xe688;",
						id:"autoDir",
						style:""
					 }
				 }
			 },
			 magicbox_PlBTMain : {
				 id:'magicbox_PlBTMain',    //页面ID
				 remark:"",         //备注
				 title:I18n.magicbox_PlBTMain.title,       //标题
				 leftIcon:"&#xe661;", //头部左面图标
				 rightIcon:"",        //头部右面图标
				 data:{
					 icon_color:"#EC6DB4;", //图标颜色
					 switch_text:I18n.magicbox_PlBTMain.onBT, //蓝牙音箱开
					 switchOff_text:I18n.magicbox_PlBTMain.offBT, //蓝牙音箱关
					 music_noPlay:I18n.magicbox_PlBTMain.noPlay, //无播放
					 music_name:I18n.magicbox_PlBTMain.play, //播放歌曲名称
					 addVol_icon:"&#xe643;",//增加音量图标
					 subVol_icon:"&#xe649;",//降低音量图标
					 BT_text:I18n.magicbox_PlBTMain.BT, //蓝牙(文字)
					 BT_icon:icon.magicbox_PlBTMain.BT_icon, //蓝牙(图标)
					 BT_iconColor:icon.magicbox_PlBTMain.BT_iconColor, //蓝牙(图标)颜色
					 readCard_text:I18n.magicbox_PlBTMain.readCard, //读卡(文字)
					 readCard_icon:icon.magicbox_PlBTMain.readCard_icon,//读卡(图标)
					 readCard_iconColor:icon.magicbox_PlBTMain.readCard_iconColor, //读卡(图标)颜色

					 musicList_text:I18n.magicbox_PlBTMain.musicList, //曲目(文字)
					 musicList_icon:icon.magicbox_PlBTMain.musicList_icon,//曲目(图标)
					 musicList_iconColor:icon.magicbox_PlBTMain.musicList_iconColor, //曲目(图标)颜色

					 sleep_text:I18n.magicbox_PlBTMain.sleep, //睡眠助理(文字)
					 sleep_icon:icon.magicbox_PlBTMain.sleep_icon,//睡眠助理(图标)
					 sleep_iconColor:icon.magicbox_PlBTMain.sleep_iconColor, //睡眠助理(图标)颜色
					 msg1:I18n.magicbox_PlBTMain.msg1,//魔方不支持此功能
					 msg2:I18n.magicbox_PlBTMain.msg2//此功能还未完成
				 }
			 },
			 magicbox_PlBTSongList : {
				 id:'magicbox_PlBTSongList',    //页面ID
				 remark:"",         //备注
				 title:I18n.magicbox_PlBTSongList.title,       //标题
				 leftIcon:"&#xe661;", //头部左面图标
				 rightIcon:"",        //头部右面图标
				 data:{
				 	
					 back_icon:icon.magicbox_PlBTSongList.back_icon,//上一曲图标
					 ahead_icon:icon.magicbox_PlBTSongList.ahead_icon,//下一曲图标
					 play_icon:icon.magicbox_PlBTSongList.play_icon,//播放图标
					 pause_icon:icon.magicbox_PlBTSongList.pause_icon,//暂停图标
					 cycle_icon:icon.magicbox_PlBTSongList.cycle_icon,//循环播放模式图标
					 oneSong_icon:icon.magicbox_PlBTSongList.oneSong_icon,//单曲循环模式图标
					 random_icon:icon.magicbox_PlBTSongList.random_icon,//随机播放模式图标
					 vol_icon:icon.magicbox_PlBTSongList.vol_icon,//音量图标
					 mute_icon:icon.magicbox_PlBTSongList.mute_icon,//静音图标

					 back_iconColor:icon.magicbox_PlBTSongList.back_iconColor,//上一曲图标颜色颜色颜色
					 ahead_iconColor:icon.magicbox_PlBTSongList.ahead_iconColor,//下一曲图标颜色
					 play_iconColor:icon.magicbox_PlBTSongList.play_iconColor,//播放图标颜色
					 pause_iconColor:icon.magicbox_PlBTSongList.pause_iconColor,//暂停图标颜色
					 cycle_iconColor:icon.magicbox_PlBTSongList.cycle_iconColor,//循环播放模式图标颜色
					 oneSong_iconColor:icon.magicbox_PlBTSongList.oneSong_iconColor,//单曲循环模式图标颜色
					 random_iconColor:icon.magicbox_PlBTSongList.random_iconColor,//随机播放模式图标颜色
					 vol_iconColor:icon.magicbox_PlBTSongList.vol_iconColor,//音量图标颜色
					 mute_iconColor:icon.magicbox_PlBTSongList.mute_iconColor,//静音图标颜色

					 noSelect_msg:I18n.magicbox_PlBTSongList.noSelect_msg,//未选择播放歌曲
					 noPlay_msg:I18n.magicbox_PlBTSongList.noPlay_msg,//未播放歌曲
					 last_msg:I18n.magicbox_PlBTSongList.last_msg,//已经是最后一首歌曲
					 first_msg:I18n.magicbox_PlBTSongList.first_msg//已经是第一首歌曲
				 }
			 },
			 magicbox_CoBTSetup : {
				 id:'magicbox_CoBTSetup',    //页面ID
				 remark:"",         //备注
				 title:I18n.magicbox_CoBTSetup.title,       //标题
				 leftIcon:"&#xe661;", //头部左面图标
				 rightIcon:"",        //头部右面图标
				 data:{
					 switch_text:I18n.magicbox_CoBTSetup.switch_title, //开关
					 phoneBT_text:I18n.magicbox_CoBTSetup.phoneBT, //手机蓝牙
					 switchOn_text:I18n.magicbox_CoBTSetup.switch_on, //已开启（文字）
					 switchOff_text:I18n.magicbox_CoBTSetup.switch_off, //已关闭（文字）
					 pairedDevice_text:I18n.magicbox_CoBTSetup.pairedDevice, //已配对设备
					 unPairedDevice_text:I18n.magicbox_CoBTSetup.unPairedDevice, //未配对设备
					 edit_icon:"&#xe62d;"//编辑图标
				 }
			 },
			 ehome_CoSocket:{
				 id:'ehome_CoSocket',   
				 remark:"插座",         
				 title:I18n.ehome_CoSocket.title,       
				 leftIcon:"&#xe661;", 
				 rightIcon:"",  
				 data:{
					 openbkColor:icon.ehome_CoSocket.openbkColor,
					 closebkColor:icon.ehome_CoSocket.closebkColor,	
                     sliColor:icon.ehome_CoSocket.sliColor,
					 icon:icon.ehome_CoSocket.icon,
					 icon2:icon.ehome_CoSocket.icon2,
					 startTime:I18n.ehome_CoSocket.startTime,
					 times:I18n.ehome_CoSocket.today
				 }
			 },
			 ehome_Lamp:{
				 id:'ehome_Lamp',   
				 remark:"电灯",         
				 title:I18n.ehome_Lamp.title,   
                 icon:"&#xe687;",				 
				 leftIcon:"&#xe661;", 
				 rightIcon:"",    
				 data:{
					 onbkColor:icon.ehome_Lamp.onbkColor,
					 onColor:icon.ehome_Lamp.onColor,
					 offbkColor:icon.ehome_Lamp.offbkColor,	
					 offColor:icon.ehome_Lamp.offColor,
					 icon:icon.ehome_Lamp.icon,
					 brightness:I18n.ehome_Lamp.brightness,
					 color:I18n.ehome_Lamp.color
				 }
			 },
			 ehome_CoSwitch:{
				 id:'ehome_CoSwitch',   
				 remark:"开关",         
				 title:I18n.ehome_CoSwitch.title,       
				 leftIcon:"&#xe661;", 
				 rightIcon:"",        
				 data:{
					 openbkColor:icon.ehome_CoSwitch.openbkColor,
					 openColor:icon.ehome_CoSwitch.openColor,
					 closebkColor:icon.ehome_CoSwitch.closebkColor,	
					 timeOnColor:icon.ehome_CoSwitch.timeOnColor,
					 timeOffColor:icon.ehome_CoSwitch.timeOffColor,
					 timeColor:icon.ehome_CoSwitch.timeColor,
                     sliColor:icon.ehome_CoSwitch.sliColor,
					 icon:icon.ehome_CoSwitch.icon,
					 off:I18n.ehome_CoSwitch.off,
					 on:I18n.ehome_CoSwitch.on,
					 icon2:icon.ehome_CoSwitch.icon2,
					 timing:I18n.ehome_CoSwitch.timing,
					 icon3:icon.ehome_CoSwitch.icon3,
					 room:I18n.ehome_CoSwitch.room
				 }
			 },
			 magicbox_PlRealTimeVideo : {
				 id:'magicbox_PlRealTimeVideo',    //页面ID
				 remark:"摄像头",         //备注
				 title:I18n.magicbox_PlRealTimeVideo.title,       //标题
				 leftIcon:"&#xe661;", //头部左面图标
				 rightIcon:"",        //头部右面图标
				 data:{     
					 
				 }
			 }, 
			 magicbox_CameraSetup : {
				 id:'magicbox_CameraSetup',    //页面ID
				 remark:"摄像头设置",         //备注
				 title:I18n.magicbox_CameraSetup.title,       //标题
				 leftIcon:"&#xe661;", //头部左面图标
				 rightIcon:"",        //头部右面图标
				 data:{
					 menus:{
						cSwitch:I18n.magicbox_CameraSetup.cSwitch,
						timingSwitch:I18n.magicbox_CameraSetup.timingSwitch,
						photoRecord:I18n.magicbox_CameraSetup.photoRecord,
						photoRecordIcon:"&#xe682;",
						emptyPhoto:I18n.magicbox_CameraSetup.emptyPhoto,
						empty:I18n.magicbox_CameraSetup.empty
					 }
				 }
			 }, 
			 magicbox_PlCaptureRec : {
				 id:'magicbox_PlCaptureRec',    //页面ID
				 remark:"照片记录",         //备注
				 title:I18n.magicbox_PlCaptureRec.title,       //标题
				 leftIcon:"&#xe661;", //头部左面图标
				 rightIcon:"选择",        //头部右面图标
				 data:{
						choiceIcon:"&#xe676;",
						data_module:"home",            
						data_view:"MeFuncSet",
						delIcon:"&#xe64e;"
				 }
			 },
			 magicbox_PhotoDetail : {
				 id:'magicbox_PhotoDetail',    //页面ID
				 remark:"照片放大",         //备注
				 title:I18n.magicbox_PhotoDetail.title,       //标题
				 leftIcon:"&#xe661;", //头部左面图标
				 rightIcon:"",        //头部右面图标
				 data:{
						downloadIcon:"&#xe676;",
						delIcon:"&#xe64e;"
				 }
			 },
			 magicbox_StCharger : {
				 id:'magicbox_StCharger',    //页面ID
				 remark:"充电宝",         //备注
				 title:I18n.magicbox_StCharger.title,       //标题
				 leftIcon:"&#xe661;", //头部左面图标
				 rightIcon:"",        //头部右面图标
				 data:{
						situation:I18n.magicbox_StCharger.situation,
						frequency:I18n.magicbox_StCharger.frequency,
						frequencyText:I18n.magicbox_StCharger.frequencyText,
						status:I18n.magicbox_StCharger.status,
						presentSituation:I18n.magicbox_StCharger.presentSituation,
						ratedCurrent:I18n.magicbox_StCharger.ratedCurrent,
						percentage:I18n.magicbox_StCharger.percentage,
						electricCurrent:I18n.magicbox_StCharger.electricCurrent,
						circleBackground:"circleBackground",
						fontColor:"fontColor"
				 }
			 },
			 magicbox_InShareUser : {
				 id:'magicbox_InShareUser',    //页面ID
				 remark:"设备共享",         //备注
				 title:I18n.magicbox_InShareUser.title,       //标题
				 leftIcon:icon.magicbox_InShareUser.leftIcon, //头部左面图标
				 rightIcon:"",        //头部右面图标
				 data:{
						alreadyShare:I18n.magicbox_InShareUser.alreadyShare,
						userText:I18n.magicbox_InShareUser.userText
				 }
			 },
			 magicbox_addInShareUser : {
				 id:'magicbox_addInShareUser',    //页面ID
				 remark:"设备共享",         //备注
				 title:I18n.magicbox_addInShareUser.title,       //标题
				 leftIcon:icon.magicbox_addInShareUser.leftIcon, //头部左面图标
				 rightIcon:"",        //头部右面图标
				 data:{
				 		checkColor:icon.magicbox_addInShareUser.checkColor,
				 		checkColorRgb:icon.magicbox_addInShareUser.checkColorRgb,
						choiceTime:I18n.magicbox_addInShareUser.choiceTime,
						loginName:I18n.magicbox_addInShareUser.loginName,
						QQ:I18n.magicbox_addInShareUser.QQ,
						QQIcon:icon.magicbox_addInShareUser.QQIcon,
						weiXin:I18n.magicbox_addInShareUser.weiXin,
						weiXinIcon:icon.magicbox_addInShareUser.weiXinIcon,
						weiBo:I18n.magicbox_addInShareUser.weiBo,
						weiBoIcon:icon.magicbox_addInShareUser.weiBoIcon,
						remarks:I18n.magicbox_addInShareUser.remarks,
						save:I18n.magicbox_addInShareUser.save,
						to:I18n.magicbox_addInShareUser.to
				 }
			 },
			  magicbox_InProfileSet : {
				 id:'magicbox_InProfileSet',    //页面ID
				 remark:"情景模式",         //备注
				 title:I18n.magicbox_InProfileSet.title,       //标题
				 leftIcon:"&#xe661;", //头部左面图标
				 rightIcon:"",        //头部右面图标
				 data:{
				 	  checkColor:"#de3d96",
				 	  checkIcon:"&#xe69a;",
					  menus:[
				              {
				            	  name:I18n.magicbox_InProfileSet.businessAffairs,
				            	  order:1,
						          icon:"&#xe62c;",
						          bgcolor:"",
						          data_module:"",            //跳转模块
						          data_view:"",
						          templateID:"1"			   //跳转视图
				              },{
				            	  name:I18n.magicbox_InProfileSet.fashionDynamic,
				            	  order:2,
						          icon:"&#xe62a;",
						          bgcolor:"",
						          data_module:"",            //跳转模块
						          data_view:"",			   //跳转视图
						          templateID:"2"
				              },{
				            	  name:I18n.magicbox_InProfileSet.charmYouth,
				            	  order:3,
						          icon:"&#xe62d;",
						          bgcolor:"",
						          data_view:"",			   //跳转视图
						          templateID:"0"
				              }
				     ]
				 }
			 },
			 magicbox_Infraredremotecontrol : {
				 id:'magicbox_Infraredremotecontrol',    //页面ID
				 remark:"",         //备注
				 title:"红外遥控",       //标题
				 leftIcon:"&#xe661;", //头部左面图标
				 rightIcon:"",        //头部右面图标
				 data:{
					  menus:[
				              {
				            	  name:I18n.magicbox_Infraredremotecontrol.CoTV,
				            	  order:1,
						          icon:"&#xe611;",
						          bgcolor:"",
						          data_module:"ehome",            //跳转模块
						          data_view:"CoTV"			   //跳转视图
				              },{
				            	  name:I18n.magicbox_Infraredremotecontrol.CoSTB,
				            	  order:2,
						          icon:"&#xe663;",
						          bgcolor:"",
						          data_module:"ehome",            //跳转模块
						          data_view:"CoSTB"			   //跳转视图
				              },{
				            	  name:I18n.magicbox_Infraredremotecontrol.CoAir,
				            	  order:3,
						          icon:"&#xe664;",
						          bgcolor:"",
						          data_module:"ehome",            //跳转模块
						          data_view:"CoAir"			   //跳转视图
				              },{
				            	  name:I18n.magicbox_Infraredremotecontrol.CoFanSetup,
				            	  order:4,
						          icon:"&#xe66e;",
						          bgcolor:"",
						          data_module:"ehome",            //跳转模块
						          data_view:"CoFanSetup"			   //跳转视图
				              },{
				            	  name:I18n.magicbox_Infraredremotecontrol.CoLamp,
				            	  order:5,
						          icon:"&#xe60b;",
						          bgcolor:"",
						          data_module:"ehome",            //跳转模块
						          data_view:"CoLamp"			   //跳转视图
				              },{
				            	  name:I18n.magicbox_Infraredremotecontrol.CoSDVD,
				            	  order:6,
						          icon:"&#xe665;",
						          bgcolor:"",
						          data_module:"ehome",            //跳转模块
						          data_view:"CoSDVD"			   //跳转视图
				              },{
				            	  name:I18n.magicbox_Infraredremotecontrol.CoClean,
				            	  order:7,
						          icon:"&#xe666;",
						          bgcolor:"",
						          data_module:"ehome",            //跳转模块
						          data_view:"CoClean"			   //跳转视图
				              },{
				            	  name:I18n.magicbox_Infraredremotecontrol.SeAddDev,
				            	  order:8,
						          icon:"&#xe667;",
						          bgcolor:"",
						          data_module:"devicemanage",            //跳转模块
						          data_view:"SeAddDev"			   //跳转视图
				              }
				     ]
				 }
			 },
			  magicbox_InMBSetup : {
				 id:'magicbox_InMBSetup',    //页面ID
				 remark:"设置",         //备注
				 title:I18n.magicbox_InMBSetup.title,       //标题
				 leftIcon:"&#xe661;", //头部左面图标
				 rightIcon:"",        //头部右面图标
				 data:{
						SeAddDev:I18n.magicbox_InMBSetup.SeAddDev,
						add:I18n.magicbox_InMBSetup.add,
						NetSetup:I18n.magicbox_InMBSetup.NetSetup,
						msgSub:I18n.magicbox_InMBSetup.msgSub,
						BluSet:I18n.magicbox_InMBSetup.BluSet,
						EquDetails:I18n.magicbox_InMBSetup.EquDetails,
						upgrade:I18n.magicbox_InMBSetup.upgrade,
						DeviceRestart:I18n.magicbox_InMBSetup.DeviceRestart,
						about:I18n.magicbox_InMBSetup.about,
						icon:"&#xe682;"
				 }
			 },
			 magicbox_InNetSetup : {
				 id:'magicbox_InNetSetup',    //页面ID
				 remark:"网络设置",         //备注
				 title:I18n.magicbox_InNetSetup.title,       //标题
				 leftIcon:"&#xe661;", //头部左面图标
				 rightIcon:"&#xe65f;",        //头部右面图标
				 data:{
						networkMode:I18n.magicbox_InNetSetup.networkMode,
						router:I18n.magicbox_InNetSetup.router,
						routerIcom:"&#xe68c;",
						relay:I18n.magicbox_InNetSetup.relay,
						relayIcon:"&#xe68b;",
						wifiSettings:I18n.magicbox_InNetSetup.wifiSettings,
						ssid:I18n.magicbox_InNetSetup.ssid,
						ssidPlaceholder:I18n.magicbox_InNetSetup.ssidPlaceholder,
						password:I18n.magicbox_InNetSetup.password,
						passwordPlaceholder:I18n.magicbox_InNetSetup.passwordPlaceholder,
						networkSettings:I18n.magicbox_InNetSetup.networkSettings,
						ipAddress:I18n.magicbox_InNetSetup.ipAddress,
						ipAddressPlaceholder:I18n.magicbox_InNetSetup.ipAddressPlaceholder,
						netMask:I18n.magicbox_InNetSetup.netMask,
						netMaskPlaceholder:I18n.magicbox_InNetSetup.netMaskPlaceholder,
						gateway:I18n.magicbox_InNetSetup.gateway,
						gatewayPlaceholder:I18n.magicbox_InNetSetup.gatewayPlaceholder,
						dns:I18n.magicbox_InNetSetup.dns,
						dnsPlaceholder:I18n.magicbox_InNetSetup.dnsPlaceholder,
						ssidDefultValue:I18n.magicbox_InNetSetup.ssidDefultValue
				 }
			 },
			  magicbox_InAboutMB : {
				 id:'magicbox_InAboutMB',    //页面ID
				 remark:"关于魔方",         //备注
				 title:I18n.magicbox_InAboutMB.title,       //标题
				 leftIcon:"&#xe661;", //头部左面图标
				 rightIcon:"备份",        //头部右面图标
				 data:{

				 }
			 },
			  magicbox_InMBRestart : {
				 id:'magicbox_InMBRestart',    //页面ID
				 remark:"重启魔方",         //备注
				 title:I18n.magicbox_InMBRestart.title,       //标题
				 leftIcon:"&#xe661;", //头部左面图标
				 rightIcon:"",        //头部右面图标
				 data:{
						restart:I18n.magicbox_InMBRestart.restart,
						restartPrompt:I18n.magicbox_InMBRestart.restartPrompt
				 }
			 },
			 magicbox_InUpgrade : {
				 id:'magicbox_InUpgrade',    //页面ID
				 remark:"固件升级",         //备注
				 title:I18n.magicbox_InUpgrade.title,       //标题
				 leftIcon:"&#xe661;", //头部左面图标
				 rightIcon:"",        //头部右面图标
				 data:{
						Prompt:I18n.magicbox_InUpgrade.Prompt,
						src:"../images/5-121204194028.gif"
				 }
			 },
			 magicbox_StMBMain:{
			 	id:'magicbox_StMBMain',    //页面ID
				 remark:"小尤鱼魔方",         //备注
				 title:I18n.magicbox_StMBMain.title,       //标题
				 leftIcon:"&#xe661;", //头部左面图标
				 rightIcon:"&#xe65f;",        //头部右面图标

				 data:{
				 		top:{
				 			refresh:"&#xe675;",
				 			outdoorSportIcon:"&#xe65c;",
				 			openWindowIcon:"&#xe65b;",
				 			wearMasksIcon:"&#xe65a;",
				 			openPurifierIcon:"&#xe65d;",
							comfortableDegree:I18n.magicbox_StMBMain.comfortableDegree,
							temperature:I18n.magicbox_StMBMain.temperature,
							humidity:I18n.magicbox_StMBMain.humidity,
							methanol:I18n.magicbox_StMBMain.methanol,
							chemicalPollutants:I18n.magicbox_StMBMain.chemicalPollutants,
							quantized:I18n.magicbox_StMBMain.quantized
				 		},
				 		menu:[
				 			{
				 				name:I18n.magicbox_StMBMain.HW,              
								icon:"&#xe639;",           
								data_module:"devicemanage",            
								data_view:"Ehome?prePage=magicbox/StMBMain",			   
								bgcolor:"" 
				 			},
				 			{
				 				name:I18n.magicbox_StMBMain.CDB,              
								icon:"&#xe64e;",           
								data_module:"magicbox",            
								data_view:"StCharger",			   
								bgcolor:"" 
				 			},
				 			{
				 				name:I18n.magicbox_StMBMain.YX,              
								icon:"&#xe64d;",           
								data_module:"magicbox",            
								data_view:"PlBTMain",			   
								bgcolor:"" 
				 			},
				 			{
				 				name:I18n.magicbox_StMBMain.SXT,              
								icon:"&#xe679;",           
								data_module:"magicbox",            
								data_view:"PlRealTimeVideo",			   
								bgcolor:"" 
				 			}
				 		]
							
				 }
			 },
			 magicbox_SeSubscribe:{
			 	 id:'magicbox_SeSubscribe',    //页面ID
				 remark:"消息订阅",         //备注
				 title:I18n.magicbox_SeSubscribe.title,       //标题
				 leftIcon:"&#xe661;", //头部左面图标
				 rightIcon:"" ,       //头部右面图标
				 data:{
						ldDetectionIcon:"&#xe68d;",
						ldDetection:I18n.magicbox_SeSubscribe.ldDetection,
						repeatedAlarm:I18n.magicbox_SeSubscribe.repeatedAlarm,
						no:I18n.magicbox_SeSubscribe.no,
						yes:I18n.magicbox_SeSubscribe.yes,
						alarmInterval:I18n.magicbox_SeSubscribe.alarmInterval,
						aqDetectionIcon:"&#xe68d;",
						aqDetection:I18n.magicbox_SeSubscribe.aqDetection,
						ihDetectionIcon:"&#xe68d;",
						ihDetection:I18n.magicbox_SeSubscribe.ihDetection,
						tempDetection:I18n.magicbox_SeSubscribe.tempDetection,
			            tempMax:I18n.magicbox_SeSubscribe.tempMax,
			            tempMin:I18n.magicbox_SeSubscribe.tempMin,
			            thDetection:I18n.magicbox_SeSubscribe.thDetection,
			            thMax:I18n.magicbox_SeSubscribe.thMax,
			            thMin:I18n.magicbox_SeSubscribe.thMin
				 }
			 },
			 ehome_CoProjector:{
				 id:'ehome_CoProjector',    //页面ID
				 remark:"投影仪",         //备注
				 title:I18n.ehome_CoProjector.title,       //标题
				 leftIcon:"&#xe661;", //头部左面图标
				 rightIcon:"&#xe641;",        //头部右面图标
				 data:{
					 power_icon:"&#xe63f;",
					 signout_icon:"&#xe618;",
					 computer:I18n.ehome_CoProjector.computer,
					 video:I18n.ehome_CoProjector.video,
					 signalSource:I18n.ehome_CoProjector.signalSource,
					 zoom:I18n.ehome_CoProjector.zoom,
					 confirm:I18n.ehome_CoProjector.confirm,
					 chang_icon:"&#xe685;",
					 frame:I18n.ehome_CoProjector.frame,
					 up_icon:"&#xe61d;",
					 down_icon:"&#xe649;",
					 voice_up_icon:"&#xe61e;",
					 voice_mute_icon:"&#xe640;",
					 voice_down_icon:"&#xe61f;"
				 }
			 },
			 ehome_CoFanSetup:{
				 id:'ehome_CoFanSetup',    //页面ID
				 remark:"电风扇",         //备注
				 title:I18n.ehome_CoFanSetup.title,       //标题
				 titleHide:I18n.ehome_CoFanSetup.titleHide,
				 leftIcon:"&#xe661;", //头部左面图标
				 rightIcon:"&#xe641;",        //头部右面图标
				 rightIconHide:I18n.Common.save,
				 data:{
					 onbkColor:"#de3d96",
				     onColor:"#fff",
                     offbkColor:"#efefef",	
				     offColor:"#585c65",
					 power_icon:"&#xe63f;",
					 time_icon:"&#xe652;",
					 stall:I18n.ehome_CoFanSetup.stall,
					 head:I18n.ehome_CoFanSetup.head,
					 files:I18n.ehome_CoFanSetup.files,
					 off:I18n.ehome_CoFanSetup.off,
					 on:I18n.ehome_CoFanSetup.on,
					 height:I18n.ehome_CoFanSetup.height,
					 low:I18n.ehome_CoFanSetup.low
				 }
			 },
			 devicemanage_Ehome : {
				 id:'devicemanage_Ehome',    //页面ID
				 remark:I18n.Ehome.remark,         //备注
				 title:I18n.Ehome.title,       //标题
				 leftIcon:"&#xe661;", //头部左面图标
				 rightIcon:"&#xe61d;"        //头部右面图标
			 },
			 devicemanage_ZegBeeList : {
				 id:'devicemanage_seZegBeeList',    //页面ID
				 remark:I18n.ZegBeeList.remark,         //备注
				 title:I18n.ZegBeeList.title,       //标题
				 leftIcon:"&#xe661;", //头部左面图标
				 rightIcon:"",        //头部右面图标
				 data:{
					 menus:[            //菜单集合 
					        {
					        	name:I18n.ZegBeeList.Switch,              //菜单名称
					        	id:"1",
					        	type:"SW00",
					        	icon:"&#xe609;",           //菜单图标
					        	data_module:"",            //跳转模块
					        	data_view:"",			   //跳转视图
					        	bgcolor:"menu-module-bg-1" //菜单背景色

					        		
					        },{
					        	name:I18n.ZegBeeList.Socket,
					        	id:"2",
					        	type:"SS00",
					        	icon:"&#xe60a;",
					        	data_module:"",            
					        	data_view:"",
					        	bgcolor:"menu-module-bg-2"
					        },{
					        	name:I18n.ZegBeeList.Lamp,
					        	id:"3",
					        	type:"SLB0",
					        	icon:"&#xe60b;",
					        	data_module:"",
					        	data_view:"",
					        	bgcolor:"menu-module-bg-2"
					        }
					 ]
				 }
			 } ,
			 devicemanage_remotecopy : {
				 id:'devicemanage_remotecopy',    //页面ID
				 remark:I18n.remotecopy.remark,         //备注
				 title:I18n.remotecopy.title,       //标题
				 leftIcon:"", //头部左面图标
				 rightIcon:"&#xe61d;"        //头部右面图标
			 },
			 model_choice:{
				 id:'devicemanage_seModelChoice',    //页面ID
				 remark:I18n.ModelChoice.remark,         //备注
				 title:I18n.ModelChoice.title,       //标题
				 leftIcon:"&#xe661;", //头部左面图标
				 rightIcon:"",        //头部右面图标
				 data:{
					 type:I18n.ModelChoice.type,
					 auto:I18n.ModelChoice.auto
				 }
			 },
			ir_dev_list:{
				 id:'devicemanage_seIRDevList',    //页面ID
				 remark:I18n.IRDevList.remark,         //备注
				 title:I18n.IRDevList.title,       //标题
				 leftIcon:"&#xe661;", //头部左面图标
				 rightIcon:"",        //头部右面图标
				 data:{
					 custom:I18n.IRDevList.custom,
					 menus:[            //菜单集合 1
						   {
					            isShow:true,	
 							    name:I18n.IR_Ac.name,              //菜单名称
					        	icon:"&#xe60c;",
					        	type:I18n.IR_Ac.type,
					        	data_module:"",            //跳转模块
					        	data_view:"",			   //跳转视图
					        	bgcolor:"" //菜单背景色
					        	
					        },{
								isShow:false,
					        	name:I18n.IR_Prj.name,            //菜单名称
					        	icon:"&#xe60d;",
					        	type:I18n.IR_Prj.type,
					        	data_module:"",            //跳转模块
					        	data_view:"",			   //跳转视图
					        	bgcolor:"" //菜单背景色
					        },{
								isShow:true,
					        	name:I18n.IR_Dvd.name,              //菜单名称
					        	icon:"&#xe665;",
					        	type:I18n.IR_Dvd.type,
					        	data_module:"",            //跳转模块
					        	data_view:"",			   //跳转视图
					        	bgcolor:"" //菜单背景色
					        },
					        {
								isShow:true,
					        	name:I18n.IR_Stb.name,              //菜单名称
					        	icon:"&#xe663;",
					        	type:I18n.IR_Stb.type,
					        	data_module:"",            //跳转模块
					        	data_view:"",			   //跳转视图
					        	bgcolor:"" //菜单背景色
					        		
					        },{
								isShow:true,
					        	name:I18n.IR_Fan.name,            //菜单名称
					        	icon:"&#xe66e;",
					        	type:I18n.IR_Fan.type,
					        	data_module:"",            //跳转模块
					        	data_view:"",			   //跳转视图
					        	bgcolor:"" //菜单背景色
					        },{
								isShow:true,
					        	name:I18n.IR_Tv.name,              //菜单名称
					        	icon:"&#xe611;",
					        	type:I18n.IR_Tv.type,
					        	data_module:"",            //跳转模块
					        	data_view:"",			   //跳转视图
					        	bgcolor:"" //菜单背景色
					        },
							 {
							    isShow:true,
					        	name:"自定义",              //菜单名称
					        	icon:"&#xe69d;",
					        	type:"Custom",
					        	data_module:"",            //跳转模块
					        	data_view:"",			   //跳转视图
					        	bgcolor:"" //菜单背景色
					        	
					        },
					    ]
				 }
			 },
			 gataway_choice : {
				 id:'devicemanage_seGatawayChoice',    //页面ID
				 remark:I18n.gataway_choice.remark,         //备注
				 title:I18n.gataway_choice.title,       //标题
				 leftIcon:"&#xe661;", //头部左面图标
				 rightIcon:""        //头部右面图标
			 },
			 Dev_Rename : {
				 id:'devicemanage_seDevReName',    //页面ID
				 remark:I18n.Dev_Rename.remark,         //备注
				 title:I18n.Dev_Rename.title,       //标题
				 leftIcon:"&#xe661;", //头部左面图标
				 rightIcon:"&#xe69a;",        //头部右面图标
			     inputMsg:I18n.Common.inputMsg,
				 sure:I18n.Common.ok,
				 cancel:I18n.Common.cancel,
				 
			},
			 custom : {
			 	 id:'devicemanage_SeCustom',    //页面ID
				 remark:I18n.Common.customDevice,         //备注
				 title:I18n.Common.customDevice,       //标题
				 leftIcon:"&#xe661;", //头部左面图标
				 rightIcon:"",        //头部右面图标
				 menus:[            //菜单集合 1
					       {
					        	isShow:true,
								name:I18n.IR_Ac.name,              //菜单名称
					        	id:"1",           //菜单图标
					        	icon:"&#xe60c;",
					        	type:I18n.IR_Ac.type,
					        	data_module:"",            //跳转模块
					        	data_view:"",			   //跳转视图
					        	bgcolor:"" //菜单背景色
					        		
					        },{
								isShow:false,
					        	name:I18n.IR_Prj.name,            //菜单名称
					        	id:"2",                          //菜单图标
					        	icon:"&#xe60d;",
					        	type:I18n.IR_Prj.type,
					        	data_module:"",            //跳转模块
					        	data_view:"",			   //跳转视图
					        	bgcolor:"" //菜单背景色
					        },{
								isShow:true,
					        	name:I18n.IR_Dvd.name,              //菜单名称
					        	id:"3",           //菜单图标
					        	icon:"&#xe665;",
					        	type:I18n.IR_Dvd.type,
					        	data_module:"",            //跳转模块
					        	data_view:"",			   //跳转视图
					        	bgcolor:"" //菜单背景色
					        },
					        {
								isShow:true,
					        	name:I18n.IR_Stb.name,              //菜单名称
					        	id:"4",           //菜单图标
					        	icon:"&#xe663;",
					        	type:I18n.IR_Stb.type,
					        	data_module:"",            //跳转模块
					        	data_view:"",			   //跳转视图
					        	bgcolor:"" //菜单背景色
					        		
					        },{
								isShow:true,
					        	name:I18n.IR_Fan.name,            //菜单名称
					        	id:"5",                          //菜单图标
					        	icon:"&#xe66e;",
					        	type:I18n.IR_Fan.type,
					        	data_module:"",            //跳转模块
					        	data_view:"",			   //跳转视图
					        	bgcolor:"" //菜单背景色
					        },{
								isShow:true,
					        	name:I18n.IR_Tv.name,              //菜单名称
					        	id:"6",           //菜单图标
					        	icon:"&#xe611;",
					        	type:I18n.IR_Tv.type,
					        	data_module:"",            //跳转模块
					        	data_view:"",			   //跳转视图
					        	bgcolor:"" //菜单背景色
					        }
					    ]
			 },
			 brandChoice : {
				 id:'devicemanage_seBrandchoice',    //页面ID
				 remark:I18n.brandChoice.remark,         //备注
				 title:I18n.brandChoice.title,       //标题
				 leftIcon:"&#xe661;", //头部左面图标
				 rightIcon:""        //头部右面图标
			 },
			 seAutoMatch: {
				 id:'devicemanage_seAutoMatch',    //页面ID
				 remark:I18n.AutoMatch.remark,         //备注
				 title:I18n.AutoMatch.title,       //标题
				 leftIcon:"&#xe661;", //头部左面图标
				 rightIcon:""        //头部右面图标
			 },
			 seAddDev: {
				 id:'devicemanage_seAddDev',    //页面ID
				 remark:I18n.AddDev.remark,         //备注
				 title:I18n.AddDev.title,       //标题
				 leftIcon:"&#xe661;", //头部左面图标
				 rightIcon:"",        //头部右面图标
				 data:{
					 menus:[            //菜单集合 
					        {
					        	name:I18n.AddDev.MB,              //菜单名称
					        	id:"SeAddMB",
					        	icon:"&#xe604;",           //菜单图标
					        	data_module:"",            //跳转模块
					        	data_view:"",			   //跳转视图
					        	bgcolor:"" //菜单背景色
					        		
					        },{
					        	name:I18n.AddDev.IR,              //菜单名称
					        	id:"SeIRDevList",
					        	icon:"&#xe639;",           //菜单图标
					        	data_module:"",            //跳转模块
					        	data_view:"",			   //跳转视图
					        	bgcolor:"" //菜单背景色
					        		
					        },{
					        	name:I18n.AddDev.ZB,              //菜单名称
					        	id:"SeZigBeeList",
					        	icon:"&#xe61a;",           //菜单图标
					        	data_module:"",            //跳转模块
					        	data_view:"",			   //跳转视图
					        	bgcolor:"" //菜单背景色
					        		
					        }
					    ]
				 }
			 },
			 seAddMB: {
				 id:'devicemanage_seAddMB',    //页面ID
				 remark:I18n.AddMB.remark,         //备注
				 title:I18n.AddMB.title,       //标题
				 leftIcon:"&#xe661;", //头部左面图标
				 rightIcon:"",       //头部右面图标
				 data:{
					 menus:[            //菜单集合 
					        {
					        	name:I18n.AddMB.autoscan,              //菜单名称
					        	id:"SeAddMBAuto",
					        	icon:"&#xe621;",           //菜单图标
					        	data_module:"",            //跳转模块
					        	data_view:"",			   //跳转视图
					        	bgcolor:"" //菜单背景色
					        		
					        },{
					        	name:I18n.AddMB.barcord,              //菜单名称
					        	id:"",
					        	icon:"&#xe620;",           //菜单图标
					        	data_module:"",            //跳转模块
					        	data_view:"",			   //跳转视图
					        	bgcolor:"" //菜单背景色
					        		
					        }
					    ]
				 }
			 },
			 seAddMBAuto: {
				 id:'devicemanage_seAddMBAuto',    //页面ID
				 remark:I18n.AddMBAuto.remark,         //备注
				 title:I18n.AddMBAuto.title,       //标题
				 leftIcon:"&#xe661;", //头部左面图标
				 rightIcon:"" ,       //头部右面图标
			     waitMsg:I18n.AddMBAuto.waitMsg
			 },
			 seAddZigBee: {
				 id:'devicemanage_seAddZigBee',    //页面ID
				 remark:I18n.AddZigBee.remark,         //备注
				 title:I18n.AddZigBee.title,       //标题
				 leftIcon:"&#xe661;", //头部左面图标
				 rightIcon:"&#xe69a;" ,       //头部右面图标
			     scanIcon:"&#xe63d;",
			},
			 ehome_CoTV: {
				 id:'ehome_CoTV',    //页面ID
				 remark:"电视机",         //备注
				 title:I18n.ehome_CoTV.title,       //标题
				 titleHide:I18n.ehome_CoTV.titleHide,
				 leftIcon:"&#xe661;", //头部左面图标
				 rightIcon:"&#xe641;",        //头部右面图标
				 rightIconHide:I18n.Common.save,        //头部右面图标
				 rightMenu:{
					  Menu:[
					       {
					        	name:I18n.DeviceRightMenu.Study,    
					        	icon:"&#xe61d;",           //菜单图标
					        	data_type:"study",            //跳转模块
					        	data_index:"",			   //跳转视图
					        	div_style:"opera" //菜单背景色
					        },
							{
					        	name:I18n.DeviceRightMenu.Add,        
					        	icon:"&#xe61d;",           //菜单图标
					        	data_type:"add",            //跳转模块
					        	data_index:"",			   //跳转视图
					        	div_style:"opera" //菜单背景色
					        },
							{
					        	name:I18n.DeviceRightMenu.Edit,       
					        	icon:"&#xe61d;",           //菜单图标
					        	data_type:"edit",            //跳转模块
					        	data_index:"",			   //跳转视图
					        	div_style:"opera" //菜单背景色
					        },
							{
					        	name:I18n.DeviceRightMenu.Delete,      
					        	icon:"&#xe61d;",           //菜单图标
					        	data_type:"delete",            //跳转模块
					        	data_index:"",			   //跳转视图
					        	div_style:"opera" //菜单背景色
					        }
				         ]},
				 data:{
					 onbkColor:"#de3d96",//按键状态颜色
					 onColor:"#fff",
					 offbkColor:"#efefef",	
					 offColor:"#585c65",
					 power_icon:"&#xe63f;",
					 source:I18n.ehome_CoTV.source,
					 volume:I18n.ehome_CoTV.volume,
					 volume_up_icon:"&#xe643;",
					 volume_down_icon:"&#xe649;",
					 channel:I18n.ehome_CoTV.channel,
					 channel_up_icon:"&#xe647;",
					 channel_down_icon:"&#xe648;",
					 mute_icon:"&#xe640;",
					 return_icon:"&#xe64b;"
				 }
			 },
			 ehome_CoClean:{
				 id:'ehome_CoTV',    //页面ID
				 remark:"电视机",         //备注
				 title:I18n.ehome_CoClean.title,       //标题
				 titleHide:I18n.ehome_CoClean.titleHide,
				 leftIcon:"&#xe661;", //头部左面图标
				 rightIcon:"&#xe641;",        //头部右面图标
				 rightIconHide:I18n.Common.save,        //头部右面图标
				 data:{
					 power_icon:"&#xe63f;",
					 up_icon:"&#xe647;",
					 down_icon:"&#xe648;",
					 currentState_tab:I18n.ehome_CoClean.currentState_tab,
					 historyRecord_tab:I18n.ehome_CoClean.historyRecord_tab,
					 timingSwitch_tab:I18n.ehome_CoClean.timingSwitch_tab,
					 text_1:I18n.ehome_CoClean.text_1,
					 text_2:I18n.ehome_CoClean.text_2,
					 text_3:I18n.ehome_CoClean.text_3,
					 text_4:I18n.ehome_CoClean.text_4,
					 text_5:I18n.ehome_CoClean.text_5,
					 text_6:I18n.ehome_CoClean.text_6
				 }
			 },
			 magicbox_InConfBackup:{
				 id:'magicbox_InConfBackup',    //页面ID
				 remark:"",         //备注
				 title:I18n.magicbox_InConfBackup.title,       //标题
				 leftIcon:"&#xe661;", //头部左面图标
				 rightIcon:I18n.Common.save,        //头部右面图标
				 data:{
					 remark_text:I18n.magicbox_InConfBackup.remark_text
				 }
			 },
			 magicbox_PhoneticFunction:{
				 id:'magicbox_PhoneticFunction',    //页面ID
				 remark:"",         //备注
				 title:I18n.magicbox_PhoneticFunction.title,       //标题
				 leftIcon:"&#xe661;", //头部左面图标
				 rightIcon:"",        //头部右面图标
				 data:{
					 prompt_text:I18n.magicbox_PhoneticFunction.prompt,
					 warning_text:I18n.magicbox_PhoneticFunction.warning,
					 warning_icon:"&#xe652;",
					 last_icon:"&#xe651;"
				 }
			 },
			 ehome_Kitchen:{
				 id:'ehome_Kitchen',    //页面ID
				 remark:"智能厨房",         //备注
				 title:I18n.ehome_Kitchen.title,       //标题
				 titleHide:I18n.ehome_Kitchen.titleHide,
				 leftIcon:"&#xe661;", //头部左面图标
				 rightIcon:"",        //头部右面图标
                 rightIconHide:I18n.Common.save,				
				data:{
					 menus:[
					        {
					        	name:I18n.ehome_Kitchen.microwaveOven,
					        	icon:"&#xe655;",
					        	notBound:I18n.ehome_Kitchen.notBound,
					        	open:""
					        },
					        {
					        	name:I18n.ehome_Kitchen.refrigerator,
					        	icon:"&#xe656;",
					        	notBound:"",
								open:I18n.ehome_Kitchen.open 
					        },
					        {
					        	name:I18n.ehome_Kitchen.oven,
					        	icon:"&#xe657;",
					        	notBound:I18n.ehome_Kitchen.notBound,
					        	open:""
					        },
					        {
					        	name:I18n.ehome_Kitchen.rangeHood,
					        	icon:"&#xe658;",
					        	notBound:I18n.ehome_Kitchen.notBound,
					        	open:""
					        },
					        {
					        	name:I18n.ehome_Kitchen.riceCooker,
					        	icon:"&#xe65b;",
					        	notBound:I18n.ehome_Kitchen.notBound,
					        	open:""
					        }
					 ]
				 }
			 },
			 ehome_CoToilet:{
				 id:'ehome_CoToilet',    //页面ID
				 remark:"智能卫生间",         //备注
				 title:I18n.ehome_CoToilet.title,       //标题
				 titleHide:I18n.ehome_CoToilet.titleHide,
				 leftIcon:"&#xe661;", //头部左面图标
				 rightIcon:"",        //头部右面图标
				 rightIconHide:I18n.Common.save,
				 data:{
					 icon:"&#xe613;",
					 time_icon:"&#xe617;",
					 someone:I18n.ehome_CoToilet.someone,
					 notSomeone:I18n.ehome_CoToilet.notSomeone,
					 temperature:I18n.ehome_CoToilet.temperature,
					 water:I18n.ehome_CoToilet.water,
					 close:I18n.ehome_CoToilet.close,
					 low:I18n.ehome_CoToilet.low,
					 middle:I18n.ehome_CoToilet.middle,
					 height:I18n.ehome_CoToilet.height,
					 small:I18n.ehome_CoToilet.small,
					 large:I18n.ehome_CoToilet.large
				 }
			 },
			 ehome_CoCurtain:{
				 id:'ehome_CoCurtain',    //页面ID
				 remark:"窗帘",         //备注
				 title:I18n.ehome_CoCurtain.title,       //标题
				 titleHide:I18n.ehome_CoCurtain.titleHide,
				 leftIcon:"&#xe661;", //头部左面图标
				 rightIcon:"",        //头部右面图标
				  rightIconHide:I18n.Common.save,
				 data:{
					 icon:"&#xe66d;",
					 opening:I18n.ehome_CoCurtain.opening,
					 close:I18n.ehome_CoCurtain.close,
					 halfOpen:I18n.ehome_CoCurtain.halfOpen,
					 open:I18n.ehome_CoCurtain.open
				 }
			 },
			 ehome_CoSTB:{
				 id:'ehome_CoSTB',    //页面ID
				 remark:"机顶盒",         //备注
				 title:I18n.ehome_CoSTB.title,       //标题
				 titleHide:I18n.ehome_CoSTB.titleHide,
				 leftIcon:"&#xe661;", //头部左面图标
				 rightIcon:"&#xe641;",        //头部右面图标
				 rightIconHide:I18n.Common.save,
				data:{
					 power_icon:"&#xe63f;",
					 return_icon:"&#xe64b;",
					 left_icon_1:"&#xe685;",
					 left_icon_2:"&#xe646;",
					 play_icon:"&#xe685;",
					 mute_icon:"&#xe640;",
					 volume_up_icon:"&#xe61e;",
					 volume_down_icon:"&#xe61f;",
					 tv:I18n.ehome_CoSTB.tv,
					 up_icon:"&#xe642;",
					 down_icon:"&#xe645;",
					 left_icon:"&#xe644;",
					 ok_icon:"&#xe686;"
				 }
			 },
			 ehome_CoSDVD:{
				 id:'ehome_CoSDVD',    //页面ID
				 remark:"DVD",         //备注
				 title:I18n.ehome_CoSDVD.title,       //标题
				 titleHide:I18n.ehome_CoSDVD.titleHide,
				 leftIcon:"&#xe661;", //头部左面图标
				 rightIcon:"&#xe641;",        //头部右面图标
				 rightIconHide:I18n.Common.save,
				 data:{
					 onbkColor:"#de3d96",//按键状态颜色
					 onColor:"#fff",
					 offbkColor:"#efefef",	
					 offColor:"#585c65",
					 openbkColor:icon.ehome_CoSDVD.openbkColor,//开关仓按键颜色
					 openColor:"#de3d96",
					 closebkColor:"#dcdde0",
					 closeColor:"#d0d0d0",
					 power_icon:'&#xe63f;',
					 mute_icon:"&#xe640;",
					 volume_up_icon:"&#xe643;",
					 volume_down_icon:"&#xe649;",
					 fastForward_icon:"&#xe646;",
					 cancle_icon:"&#xe685;",
					 lastSong_icon:"&#xe647;",
					 nextSong_icon:"&#xe648;",
					 play_icon:"&#xe686;",
					 stop_icon:"&#xe691;",
					 menu_icon:"&#xe64a;",
					 returning_icon:"&#xe64b;",
					 up_icon:"&#xe642;",
					 down_icon:"&#xe645;",
					 left_icon:"&#xe644;",
					 power:I18n.ehome_CoSDVD.power,
					 mute:I18n.ehome_CoSDVD.mute,
					 switchBin:I18n.ehome_CoSDVD.switchBin,
					 volume:I18n.ehome_CoSDVD.volume,
					 fastForward:I18n.ehome_CoSDVD.fastForward,
					 rewind:I18n.ehome_CoSDVD.rewind,
					 lastSong:I18n.ehome_CoSDVD.lastSong,
					 nextSong:I18n.ehome_CoSDVD.nextSong,
					 play:I18n.ehome_CoSDVD.play,
					 menu:I18n.ehome_CoSDVD.menu,
					 returning:I18n.ehome_CoSDVD.returning
				 }
			 },
			 footer_menu:{
				 home_icon:"&#xe668;",
				 home:I18n.footer_menu.home,
				 equipment_icon:"&#xe669;",
				 equipment:I18n.footer_menu.equipment,
				 microphone_icon:"&#xe66a;",
				 mall_icon:"&#xe66b;",
				 mall:I18n.footer_menu.mall,
				 my_icon:"&#xe66c;",
				 my:I18n.footer_menu.my
			 },
			 CoStageSet: {
				 id:'magicbox_CoStageSet',    //页面ID
				 remark:'',         //备注
				 title:I18n.CoStageSet.title,       //标题
				 leftIcon:icon.magicbox_CoStageSet.leftIcon, //头部左面图标
				 rightIcon:icon.magicbox_CoStageSet.rightIcon,        //头部右面图标
				 backgroundColor:"backgroundColor",
				 rightMenu:{
					  Menu:[
					       {
					        	name:I18n.StageRightMenu.Start,    
					        	icon:"&#xe61d;",           //菜单图标
					        	data_type:"start",            //跳转模块
					        	data_index:"",			   //跳转视图
					        	div_style:"opera" //菜单背景色
					        },
							{
					        	name:I18n.StageRightMenu.End,        
					        	icon:"&#xe61d;",           //菜单图标
					        	data_type:"end",            //跳转模块
					        	data_index:"",			   //跳转视图
					        	div_style:"opera" //菜单背景色
					        },
							{
					        	name:I18n.StageRightMenu.Edit,       
					        	icon:"&#xe61d;",           //菜单图标
					        	data_type:"edit",            //跳转模块
					        	data_index:"",			   //跳转视图
					        	div_style:"opera" //菜单背景色
					        },
							{
					        	name:I18n.StageRightMenu.Delete,      
					        	icon:"&#xe61d;",           //菜单图标
					        	data_type:"delete",            //跳转模块
					        	data_index:"",			   //跳转视图
					        	div_style:"opera" //菜单背景色
					        }
				         ]},
				 data:{
					 div_style:"div-box", 
					 name_style:"modeName",
					 delete_icon:"&#xe69b;",
					 start_icon:"&#xe69a;",
					 start_color:"#df489c;",
					 add_icon:"&#xe61d;",
					 add_name:I18n.Common.addMsg,
					 add_div_style:"div-box-add",
					 menus:[            //菜单集合 
					        {
					        	name:I18n.FixStage.BackHome,              //菜单名称
					        	id:"",
					        	icon:icon.magicbox_CoStageSet.BackHomeIcon,           //菜单图标
					        	data_type:"4",            //跳转模块
					        	data_index:"60",			   //跳转视图
					        	div_style:"div-box", //菜单背景色
								name_style:"modeName",
								iconColor:"iconColor",
								fontColor:"fontColor",
								menuDivColor:"menuDivColor"
					        		
					        },{
					        	name:I18n.FixStage.ExitHome,              //菜单名称
					        	id:"",
					        	icon:icon.magicbox_CoStageSet.ExitHomeIcon,           //菜单图标
					        	data_type:"3",            //跳转模块
					        	data_index:"61",			   //跳转视图
					        	div_style:"div-box", //菜单背景色
								name_style:"modeName",
								iconColor:"iconColor",
								fontColor:"fontColor",
								menuDivColor:"menuDivColor"
					        		
					        },{
					        	name:I18n.FixStage.Schedule,              //菜单名称
					        	id:"",
					        	icon:icon.magicbox_CoStageSet.Schedule,           //菜单图标
					        	data_type:"0",            //跳转模块
					        	data_index:"62",			   //跳转视图
					        	div_style:"div-box", //菜单背景色
								name_style:"modeName",
								iconColor:"iconColor",
								fontColor:"fontColor",
								menuDivColor:"menuDivColor"
					        		
					        },
							// {
					        	// name:I18n.Common.addMsg,              //菜单名称
					        	// id:"",
					        	// icon:"&#xe61d;",           //菜单图标
					        	// data_type:"",            //跳转模块
					        	// data_index:"",			   //跳转视图
					        	// div_style:"div-box-add", //菜单背景色
								// name_style:""
					        		
					        // },
					    ]
				 }
			 },
			 CoSchedule:{
				 id:'scene_CoSchedule',    //页面ID
				 remark:"",         //备注
				 title:"",       //标题
				 leftIcon:"&#xe661;", //头部左面图标
				 rightIcon:I18n.CoSchedule.nextBtn,        //头部右面图标
				 rightIconHide:"&#xe69a;",
				 priod_icon:"&#xe64a;",
				 priod:I18n.Common.choicePeriod,
				 add_icon:"&#xe61d;",
				 add:I18n.Common.addMsg,
				 data:{
					 onbkColor:"#de3d96",//按键状态颜色
					 onColor:"#fff",
					 offbkColor:"#efefef",	
					 offColor:"#585c65",
					 powerOnbkColor:"#e44aac",
					 powerOffColor:"#d0d0d0",
					 powerOffbkColor:"#dcdde0",
				 }
			 },
			CoChoice:{
				 id:'scene_CoChoice',    //页面ID
				 remark:"",         //备注
				 title:I18n.CoChoice.title,       //标题
				 leftIcon:"&#xe661;", //头部左面图标
				 rightIcon:"",        //头部右面图标
				 	 data:{
					 div_style:"div-box", 
					 name_style:"modeName",
					 delete_icon:"&#xe69b;",
					 start_icon:"&#xe69a;",
					 start_color:"#df489c;",
					 menus:[            //菜单集合 
					        {
					        	name:I18n.CoChoice.stageTitle,   
					        	icon:"&#xe61c;",           //菜单图标
					        	data_type:"1",            //跳转模块
					        	div_style:"", //菜单背景色
								name_style:""
					        		
					        },{
					        	name:I18n.CoChoice.scheduleTitle,   
					        	icon:"&#xe62e;",           //菜单图标
					        	data_type:"0",            //跳转模块
					        	div_style:"", //菜单背景色
								name_style:""
					        		
					        }
					    ]
				 }
			 },
			 tooltip_tooltip:{
				 	study_title:I18n.tooltip_tooltip.study_title,//学习-标题
					study_content1:I18n.tooltip_tooltip.study_content1,//学习-内容1
					study_content2:I18n.tooltip_tooltip.study_content2,//学习-内容2
					study_noprompt:I18n.tooltip_tooltip.study_noprompt,//学习-不再提示（文字）
					study_noprompt_icon:"&#xe68d;",//学习-不再提示（图标）
					study_submit:I18n.tooltip_tooltip.study_submit,//学习-确定（文字）
					study_cancle:I18n.tooltip_tooltip.study_cancle,//学习-取消（文字）
					btcnn_text:I18n.tooltip_tooltip.btcnn_text,//蓝牙连接-正在连接
					btcnn_icon:"&#xe69b;"//蓝牙连接-关闭（图标）
				 },
			CoSetName:{
				 id:'scene_CoSetName',    //页面ID
				 remark:"",         //备注
				 title:I18n.CoSetName.title,       //标题
				 leftIcon:"&#xe661;", //头部左面图标
				 rightIcon:"&#xe69a;",        //头部右面图标
				 inputMsg:I18n.Common.inputMsg
			 },
			 ehome_SeRemoteCopy:{
				 id:'ehome_SeRemoteCopy',    //页面ID
				 remark:"",         //备注
				 title:I18n.ehome_SeRemoteCopy.title,       //标题
				 leftIcon:"&#xe661;", //头部左面图标
				 rightIcon:"",        //头部右面图标
				 message1:I18n.ehome_SeRemoteCopy.message1,
				 message2:I18n.ehome_SeRemoteCopy.message2,
				 message3:I18n.ehome_SeRemoteCopy.message3,
				 message4:I18n.ehome_SeRemoteCopy.message4,
				 reStudy:I18n.ehome_SeRemoteCopy.reStudy,
				 cancel:I18n.Common.cancel,
				 save:I18n.Common.save,
			 },
		     dialog_Style:{
				 backColor:icon.Color.checkbarColor,//弹出框的颜色统一为粉色
				 fontColor:icon.Color.barColor,
				 cancelColor:icon.Color.iconColor,
			 },
			 setIcon:function(_icon){
			 	alert(icon);
			 	icon = _icon;
			 }
	 };
	 
	 return {_T:_T,_U:_U,I18n:I18n};
});