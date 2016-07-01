var icon;
define(['zepto'], function($) {
	    icon = {
	    Color:{
	 		 	barColor:"#ffffff",   //默认背景颜色（黑色或者白色）
	 		 	checkbarColor:"#e2b858", //选中背景颜色（金色或者粉色）
	 		 	iconColor:"#e7c25c",    //图标颜色，（白色活着黑色）
	 		 	textColor:"#585c64",
	 		 	sliderBgColor:"#282828"
	  	},
		magicbox_CoStageSet:{
			BackHomeIcon:"&#xe61a;",  //回家图标
			ExitHomeIcon:"&#xe619;",  //离家图标
			Schedule:"&#xe62e;",	 //日程
			leftIcon:"&#xe661;", //头部左面图标
			rightIcon:"&#xe65f;",        //头部右面图标
		},
		home_InUserInfoL:{
			leftIcon:"&#xe661;", //头部左面图标
			wb:"&#xe697;",
			wbColor:"#a0a0a0",
			qq:"&#xe698;",
			qqColor:"#a0a0a0",
			wx:"&#xe699;",
			wxColor:"#a0a0a0"
		},
		magicbox_PlBTMain:{
			BT_icon:"&#xe628;", //蓝牙(图标)
			BT_iconColor:"#e2b858", //蓝牙(图标)颜色
			readCard_icon:"&#xe629;",//读卡(图标)
			readCard_iconColor:"#e2b858", //读卡(图标)颜色
			musicList_icon:"&#xe62a;",//曲目(图标)
			musicList_iconColor:"#e2b858", //曲目(图标)颜色
			sleep_icon:"&#xe62b;",//睡眠助理(图标)
			sleep_iconColor:"#e2b858", //睡眠助理(图标)颜色
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

			 back_iconColor:"#e2b858",//上一曲图标颜色
			 ahead_iconColor:"#e2b858",//下一曲图标颜色
			 play_iconColor:"#e2b858",//播放图标颜色
			 pause_iconColor:"#e2b858",//暂停图标颜色
			 cycle_iconColor:"#fff",//循环播放模式图标颜色
			 oneSong_iconColor:"#fff",//单曲循环模式图标颜色
			 random_iconColor:"#fff",//随机播放模式图标颜色
			 vol_iconColor:"#fff",//音量图标颜色
			 mute_iconColor:"#fff",//静音图标颜色
		},
		ehome_Lamp:{
			onbkColor:"#e2b858",
			onColor:"#e2b858",
			offbkColor:"#dcdde0",	
			offColor:"#d0d0d0",
			icon:"&#xe687;",
		},
		ehome_Air:{
			onbkColor:"#e2b858",
			 onColor:"#fff",
			 offbkColor:"#2d2e2e",	
			 offColor:"#ffffff",
		},
		ehome_CoSocket:{
			openbkColor:"#e2b858",
			 closebkColor:"#dcdde0",	
             sliColor:"e2b858",
			 icon:"&#xe683;",
			 icon2:"&#xe60a;",
		},
		ehome_CoSwitch:{
			openbkColor:"#e2b858",
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
			checkColor:"#e2b858",
	 		checkColorRgb:"rgb(226, 184, 88)",
	 		QQIcon:"&#xe698;",
	 		weiXinIcon:"&#xe699;",
	 		weiBoIcon:"&#xe697;",
		},
		magicbox_InShareUser:{
			leftIcon:"&#xe661;", //头部左面图标
		},
		ehome_CoSDVD:{
			openbkColor:"#282828"
		}
	};
	return icon;
});
function getIcon(){
	return icon;
}
