var icon;
define(['zepto'], function($) {
	    icon = {
	    Color:{
	 		 	barColor:"#a7a7a7",   //默认背景颜色（黑色或者白色）
	 		 	checkbarColor:"#de3d96", //选中背景颜色（金色或者粉色）
	 		 	iconColor:"#585c64",	//图标颜色，（白色活着黑色）
	 		 	sliderBgColor: "#de3d96",  //打开颜色
	 		 	sliderBgUnColor: "#dcdde0",//关闭颜色
	  	},
		magicbox_CoStageSet:{
		    BackHomeIcon: "&#xe61a;",  //回家图标
			ExitHomeIcon:"&#xe619;",      //离家图标
			Schedule:"&#xe62e;",		//日程
			leftIcon:"&#xe661;", //头部左面图标
			rightIcon:"&#xe65f;",        //头部右面图标
		},
		home_InUserInfoL:{
			leftIcon:"&#xe661;", //头部左面图标
			wb:"&#xe697;",
			wbColor:"#e96767",
			qq:"&#xe698;",
			qqColor:"#09a4dd",
			wx:"&#xe699;",
			wxColor:"#7dc62e"
		},
		magicbox_PlBTMain:{
			BT_icon:"&#xe628;", //蓝牙(图标)
			BT_iconColor:"#585c64", //蓝牙(图标)颜色
			readCard_icon:"&#xe629;",//读卡(图标)
			readCard_iconColor:"#585c64", //读卡(图标)颜色
			musicList_icon:"&#xe62a;",//曲目(图标)
			musicList_iconColor:"#585c64", //曲目(图标)颜色
			sleep_icon:"&#xe62b;",//睡眠助理(图标)
			sleep_iconColor:"#585c64", //睡眠助理(图标)颜色
		},
		magicbox_PlBTSongList:{
			back_icon:"&#xe68f;",//上一曲图标
			 ahead_icon:"&#xe690;",//下一曲图标
			 play_icon:"&#xe692;",//播放图标
			 pause_icon:"&#xe691;",//暂停图标
			 cycle_icon:"&#xe694;",//循环播放模式图标
			 oneSong_icon:"&#xe693;",//单曲循环模式图标
			 random_icon:"&#xe695;",//随机播放模式图标
			 vol_icon:"&#xe629;",//音量图标
			 mute_icon:"&#xe696;",//静音图标

			 back_iconColor:"#F967B9",//上一曲图标颜色
			 ahead_iconColor:"#F967B9",//下一曲图标颜色
			 play_iconColor:"#F967B9",//播放图标颜色
			 pause_iconColor:"#F967B9",//暂停图标颜色
			 cycle_iconColor:"#F967B9",//循环播放模式图标颜色
			 oneSong_iconColor:"#F967B9",//单曲循环模式图标颜色
			 random_iconColor:"#F967B9",//随机播放模式图标颜色
			 vol_iconColor:"#F967B9",//音量图标颜色
			 mute_iconColor:"#F967B9",//静音图标颜色
		},
		ehome_Lamp:{
			onbkColor:"#33c24e",
			onColor:"#de3d96",
			offbkColor:"#dcdde0",	
			offColor:"#d0d0d0",
			icon:"&#xe687;",
		},
		ehome_Air:{
			onbkColor:"#de3d96",
			 onColor:"#fff",
			 offbkColor:"#efefef",	
			 offColor:"#585c65",
		},
		ehome_CoSocket:{
			openbkColor:"#33c24e",
			 closebkColor:"#dcdde0",	
             sliColor:"7E807E",
			 icon:"&#xe683;",
			 icon2:"&#xe60a;",
		},
		ehome_CoSwitch:{
			openbkColor:"#de3d96",
			 openColor:"de3d96",
			 closebkColor:"#a7a7a7",	
			 timeOnColor:"#fff",
			 timeOffColor:"#efefef",
			 timeColor:"585c64",
             sliColor:"7E807E",
			 icon:"&#xe62e;",
			icon2:"&#xe670;",
			icon3:"&#xe660;",
		},
		magicbox_addInShareUser:{
			leftIcon:"&#xe661;", //头部左面图标
			checkColor:"#de3d96",
	 		checkColorRgb:"rgb(222, 61, 150)",
	 		QQIcon:"&#xe698;",
	 		weiXinIcon:"&#xe699;",
	 		weiBoIcon:"&#xe697;",
		},
		magicbox_InShareUser:{
			leftIcon:"&#xe661;", //头部左面图标
		},
		ehome_CoSDVD:{
			openbkColor:"#e44aac"
		}
	};
	return icon;
});
function getIcon(){
	return icon;
}
