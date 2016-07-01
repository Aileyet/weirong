/**
 * 全局变量定义
 * 
 */
var All = {
	test : {},
	bt_cnn_status : 1, // 蓝牙连接状态0:连接;1:断开
	music_list : {},
	music_no : null, // 播放音乐播放
	music_cycle : 0, // 播放模式
	my_media : {},
	mediaTimer : null, // 媒体播放到的位置
	mediaPosition : 0,
	media_vol : 0.5,
	media_status : "",
	vol_status : "",
	progressId : 0, // 播放进度条
	timeoutId : 0, // 播放时长计数器
	moveTotal : 0, // 进度条位置
	played_time : 0, // 已播放进度
	music_len : "" // 歌曲时长
};