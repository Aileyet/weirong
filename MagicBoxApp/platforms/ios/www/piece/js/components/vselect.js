
// 直接写参数方法
//$("#scroller").mobiscroll(opt).date(); 
// Shorthand for: $("#scroller").mobiscroll({ preset: 'date' });
//具体参数定义如下
//{
//preset: 'date', //日期类型--datatime --time,
//theme: 'ios', //皮肤其他参数【android-ics light】【android-ics】【ios】【jqm】【sense-ui】【sense-ui】【sense-ui】
							//【wp light】【wp】
//mode: "scroller",//操作方式【scroller】【clickpick】【mixed】
//display: 'bubble', //显示方【modal】【inline】【bubble】【top】【bottom】
//dateFormat: 'yyyy-mm-dd', // 日期格式
//setText: '确定', //确认按钮名称
//cancelText: '清空',//取消按钮名籍我
//dateOrder: 'yymmdd', //面板中日期排列格
//dayText: '日', 
//monthText: '月',
//yearText: '年', //面板中年月日文字
//startYear: (new Date()).getFullYear(), //开始年份
//endYear: (new Date()).getFullYear() + 9, //结束年份
//showNow: true,
//nowText: "明天",  //
//showOnFocus: false,
//height: 45,
//width: 90,
//rows: 3
// defaultValue: [Math.floor($('#treelist li').length/2)],  
// headerText: function (valueText) { return "选择车型"; },  
//        formatResult: function (array) { //返回自定义格式结果  
define(['zepto', 'mobiscroll'],
	function($, mobiscroll){
	var VSelect  = function(params) {
		var currYear = (new Date()).getFullYear();	
		//opts.datetime = { preset : 'datetime', minDate: new Date(2012,3,10,9,22), maxDate: new Date(2014,7,30,15,44), stepMinute: 5  };
		var _default = {
			preset : 'datetime',
			theme: 'android-ics light', //皮肤样式
	        display: 'modal', //显示方式 
	        mode: 'scroller', //日期选择模式
			lang:'zh',
			animate:"slidevertical",
	        startYear:currYear - 10, //开始年份
	        endYear:currYear + 10 //结束年份
		};
	
	  	this.opts = $.extend(_default, params);
	  	var oprId = this.opts.preset == "select" ?  this.opts.id + "_dummy" :  this.opts.id;
	  		
		$("#"+oprId).live("click", function(){
			$(this).focus();
		})
		$("#" + this.opts.id).scroller('destroy').scroller(this.opts);
		

//	  	$("#appDate").val('').scroller('destroy').scroller(optDate);
//	  	$("#" + this.opts.id).mobiscroll(this.opts);
	}
	
//	VSelect.prototype.setValue = function(defaultValue) {
//		this.opts = $.extend(this.opts, defaultValue);
//		$("#" + this.opts.id).mobiscroll(this.opts);
//	}
	return VSelect;
});
