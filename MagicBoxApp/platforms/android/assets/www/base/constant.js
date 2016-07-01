define(function(require){
	var ERR_MSG_ARRAY = new Array();
	ERR_MSG_ARRAY["07"]= "数据库数据异常";
	ERR_MSG_ARRAY["08"]= "预约已满";
	ERR_MSG_ARRAY["09"]= "网点未上班或已下班";
	ERR_MSG_ARRAY["10"]= "无此预约信息";
	ERR_MSG_ARRAY["11"]= "操作异常";
	ERR_MSG_ARRAY["12"]= "预约时间已过期";
	ERR_MSG_ARRAY["13"]= "无效的预约";
	ERR_MSG_ARRAY["14"]= "预约的日期不是今天";
	return {
		BAIDU_API_AK:"MUdZ6DYEde27znMafGzlCn6n",// 百度地图api秘钥
		
		MAP_NEARBY_SEAECH_RADIUS: 1000, // 周边搜索时的半径大小，单位：米
		MAP_SEARCH_WORDS_LEN:25, // 搜索历史关键字最大条数
		MAP_TRAF_EVENT_SPAN:1*60*60*1000, // 交通事件更新频率
		SEARCH_BPS_DISTANCE_DIFF: 20, // 网点搜索时，规定多大距离内不再重新搜索
		
		MAP_GEOLOCATION_FAILED: "定位失败",
		MAP_GET_HOT_CITY_LIST_FAILED: "获取热门城市名称失败！",
		MAP_GET_CITY_LIST_FAILED: "获取城市名称失败！",
		MAP_GET_PROVINCE_LIST_FAILED:"获取省份名称失败！",
		MAP_GET_DISTRICT_FAILED:"获取区失败",
		MAP_GET_BANK_NAMES_FAILED:"获取银行名称失败",
		MAP_CITY_SUFFIX_REG:/(市|(特别行政区)|(自治州))$/, // 城市名后缀正则表达式
		
		CONNECT_NET_FAILED:"网络已经断开，请打开网络",
		NET_OFFLINE_TIP:"网络已经断开，请打开网络",
		NET_ONLINE_TIP:"网络连接成功",
		
		QUIT_SYSTEM_DLG_TITLE:"提示",
		QUIT_SYSTEM_DLG_TIP:"确定要退出程序吗？",
		QUIT_SYSTEM_DLG_BT_OK:"确定",
		QUIT_SYSTEM_DLG_BT_CANCEL:"取消",
		
		MAP_GET_AROUND_ERROR:"获取周边设施失败",
		MAP_NEARBY_SEARCH_FAILED:"周边搜索失败",
		MAP_LOCATE_FAILED:"定位失败，请检查网络和GPS是否打开",
		MAP_LOCATE_SUCCESSFULL:"定位成功",
		MAP_SEARCH_NO_PATH:"没有搜索到路径",
		MAP_START_MAP_SEL_POINT:"开启点击选点",
		MAP_GET_TRAFFIC_EVENT_FAILED:"获取交通事件失败",
		MAP_HAS_SEL_EXPECTED_PT:"您在选中了期望位置",
		MAP_NO_ANY_BANK:"没有任何银行",
		MAP_CANOT_SUBS_BY_ATM:"ATM机不可预约",
		MAP_LAT_LNG_DISABLE:"无效的经纬度",
		
		// 网点搜索相关
		MAP_INPUT_FILTER_REG:/[^\u4e00-\u9fa5a-z0-9 ]{1,}/g, // 输入关键字过滤正则表达式，把非中文、英文、数字、空格的字符去掉
		
		//天气方面
		MAP_WEATHER_OK:"更新天气成功",
		MAP_WEATHER_FAILED:"更新天气失败",
		MAP_WEATHER_UPDATE_INTERVAL:1000*60*60, // 更新间隔
		
		/*关于数据库表的常量*/
		// 表facilities_type
		FACI_TYPE_MARKET:"MARKET",
		FACI_TYPE_SUPERMARKET:"SUPERMARKET",
		FACI_TYPE_PARKINGLOT:"PARKING_LOT",

		/* WebSocket通信命令格式 */
		//                 指令|     内容|         发送源|          中转站|          接收源(1)|      应答与否
		CMD_HEART_BEAT   :"000",   // 心跳包          网点系统分配器|                    服务器|          √
		CMD_NUM_SUBS     :"001",   // 预约"           APP|           服务器|          网点系统分配器|     √
		CMD_SUBS_ABORT   :"002",   // 预约中止"       网点系统分配器|     服务器|          APP|           ×
		CMD_TEMP_ISSUED  :"003",   // 模板下发"       服务器|                         网点系统分配器|     √
		CMD_TEMP_DELETE  :"004",   // 模板废弃"       服务器|                         网点系统分配器|     √
		CMD_FORM_ISSUED  :"005",   // 表单下发"       服务器|                         网点系统分配器|     √
		CMD_FORM_DELETE  :"006",   // 表单删除"       服务器|                         网点系统分配器|     √
		CMD_FORM_PRINT   :"007",   // 表单打印"       服务器|                         网点系统分配器|     √
		CMD_NUM_PRINT    :"008",   // 号码打印"       服务器|                         网点系统分配器|     √
		CMD_SYS_UPDATE   :"009",   // 系统更新"       服务器|                         网点系统分配器|     √
		CMD_AD_ISSUED    :"010",   // 广告下发"       服务器|                         网点系统分配器|     ×
		CMD_DATA_SYNC    :"011",   // 数据同步"       网点系统分配器|                    服务器|          √
		CMD_TIME_SYNC    :"012",   // 时间同步"       服务器|                         网点系统分配器|     √
		REMAIN_NOTIFY    :"018",   // 提前几位通知"     服务器|                               APP|     ×
		CMD_UNSUPPORTED  :"999",   // 未支持命令

		DESTINATION_APP        : "A",    // APP客户端
		DESTINATION_BANKPOINT  : "B",    // 网点
		DESTINATION_SERVER     : "S",    // 服务器

		SUBS_S_CREATE    : "SUBS_S_CREATE",   // 未下发
		SUBS_S_SUCCESS   : "SUBS_S_SUCCESS",  // 预约成功
		SUBS_S_FAILURE   : "SUBS_S_FAILURE",  // 预约失败
		SUBS_S_CANCEL    : "	",   // 预约取消
		SUBS_S_ABORT     : "SUBS_S_ABORT",    // 预约中止
		SUBS_S_REVIEWED  : "SUBS_S_REVIEWED", // 已评价"
		SUBS_S_CLOSED    : "SUBS_S_CLOSED",   // 已关闭"
		SUBS_S_OTHER     : "SUBS_S_OTHER",    // 其他"
		
		SUBS_OPERATE_INSERT : "01",  // 新建预约
		SUBS_OPERATE_UPDATE : "02",  // 更新预约
		SUBS_OPERATE_DELETE : "03",  // 删除预约
		
		/* 通信结果返回值 */
		RESULT_SUCCESS        : 00,         // 正常   空
		RESULT_UNSUPPORT      : 01,         // 不支持指令	不支持指令
		RESULT_ANALYZE_ERR    : 02,         // 指令解析错误	“●●”字段解析异常
		RESULT_SRV_BUSY       : 03,         // 服务器忙	服务器处理繁忙，请稍后重试
		RESULT_OVER_DATA_SIZE : 04,         // 请求数据过大	请求数据过大，请重新设置条件
		RESULT_NO_RESPONSE    : 05,         // 网点无应答	“●●”网点无应答
		RESULT_PAUSE          : 06,         // 服务暂停	“●●”网点在[时间区间]暂停服务
		RESULT_DB_DATA_ERROR  : 07,
		RESULT_SUBS_IS_FULL   : 08,
		RESULT_BP_NOT_WORK    : 09,
		RESULT_NO_SUBS_RECORD : 10,
		RESULT_OPERATE_ABNORMAL : 11,
		RESULT_SUBS_TIME_EXCEED : 12,
		RESULT_INVALID_SUBS     : 13,
		RESULT_NOT_SUBS_TODAY  : 14,

		ERR_MSG_ARRAY : ERR_MSG_ARRAY,

		RESULT_UNKOWN_MSG: "未知的消息:",
		STMOP_NO_CONNECTED:"服务器未连接成功，请确认！",
		STMOP_RECONNECT:"与服务器断开连接，连接中...",
		RESULT_PRINT_SUCCESS_MSG: "打印命令发送成功！",
		RESULT_PRINT_FAILURE_MSG: "打印命令发送失败！",

		// 通知内容
		NOTIFY_TITLE:"银行排队",
		NOTIFY_ICON:"icon",
		NOTIFY_REMAIN_COUNT_MSG: "温馨提示：您在{0}预约号码({1})前面已经只剩下{2}位，请及时到网点办理！",

		SUBS_ID_ALL : "FFFFFFFF",            // 所有预约
		
		/*用户更改密码*/
		CHANGEPWD_STRING_ERROR  : "密码设置不正确",
		CHANGEPWD_SUCCESS 		: "更改密码成功",	
		CHANGEPWD_FAILED 		: "更改密码失败",
		
		/*二维码解析*/
		SCAN_BARCODE_FAILED         : "二维码解析失败",
		SCAN_BARCODE_FORMAT_ERROR 	: "二维码错误",	
		SCAN_BARCODE_OUT 		    : "非本系统二维码",
		SCAN_DOWNLOAD_URL			: "vBank/download.do?",
		
		PRINT_NO_DATA               : "无打印数据",
		
		/**网点搜搜条件*/
		BMAP_SORT_TYPE_SMART:     "SMART",
		BMAP_DEFAULT_DISTRICT_ID: "all",
		BMAP_DEFAULT_MAX_NUM:     "9999999",
		BMAP_DEFAULT_SORT_TYPE:   "DISTANCE",
		BMAP_DEFAULT_IS_ATM:      "all",
		/*用户注册*/
		REGISTER_SUCCESS		:"用户注册成功",
		REGISTER_FAILED			:"用户注册失败",
		REGISTER_PASSWORD_UNMATCHED		:"新设密码不匹配",
		REGISTER_USERLOGIN_REPEAT		:"该手机号码已被注册",
		REGISTER_SEND_MSG_FAILED		:"发送短信失败",
		REGISTER_CAPTCHA_UNMATCHED		:"验证码错误",
		REGISTER_CAPTCHA_OUTTIME		:"验证码超时",
		REGISTER_CAPTCHA_NOTNULL		:"验证码不能为空",
		
		
		MODULE_SYS:"SYS0",
		MODULE_ZB:"ZB00",
		MODULE_IRRC:"IRRC",
		Rspn_Suc:"Rspn0000",
		Socket_Comd:"Comd",
		Comd_Add:"AddD",
		Comd_Get:"Get ",
		
		/*红外自动匹配间隔(单位秒)*/
		AutoMatchTime:3,
	};
});