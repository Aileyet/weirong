define( function(){
String.prototype.getPreSplit = function(strReg, index){
	var subArr = this.split(strReg, index);
	var subStr = subArr[0];
	for(var i = 1; i < index; i++) {
		subStr += "_" + subArr[i];
	}
	return subStr;
};
String.prototype.getSplit = function(strReg, index) {
	return this.split(strReg)[index];
};
String.prototype.isEqual = function(str1, str2) {
	return str1 == str2;
};


/**
* 一些常用的javascript函数(方法)
*
* 为便于使用，均书写成String对象的方法
* 把他保存为.js文件，可方便的扩展字符串对象的功能
*
* 方法名 功 能
* ----------- --------------------------------
* Trim 删除首位空格
* Occurs 统计指定字符出现的次数
* isDigit 检查是否由数字组成
* isAlpha 检查是否由数字字母和下划线组成
* isNumber 检查是否为数
* lenb 返回字节数
* isInChinese 检查是否包含汉字
* isEmail 简单的email检查
* isDate 简单的日期检查，成功返回日期对象
* isInList 检查是否有列表中的字符字符
* isInList 检查是否有列表中的字符字符
*/
/*** 删除首尾空格 ***/
String.prototype.Trim = function() {
	return this.replace(/(^\s*)|(\s*$)/g, "");
}
/*** 统计指定字符出现的次数 ***/
String.prototype.Occurs = function(ch) {
	// var re = eval("/[^"+ch+"]/g");
	// return this.replace(re, "").length;
	return this.split(ch).length-1;
}

/*** 检查是否由数字组成 ***/
String.prototype.isDigit = function() {
	var s = this.Trim();
	return (s.replace(/\d/g, "").length == 0);
}
/*** 检查是否由数字字母和下划线组成 ***/
String.prototype.isAlpha = function() {
	return (this.replace(/\w/g, "").length == 0);
}
/*** 检查是否为数 ***/
String.prototype.isNumber = function() {
	var s = this.Trim();
	return (s.search(/^[+-]?[0-9.]*$/) >= 0);
}
   
/*** 返回字节数 ***/
String.prototype.lenb = function() {
	return this.replace(/[^\x00-\xff]/g,"**").length;
}
/*** 检查是否包含汉字 ***/
String.prototype.isInChinese = function() {
	return (this.length != this.replace(/[^\x00-\xff]/g,"**").length);
}

/*** 简单的日期检查，成功返回日期对象 ***/
String.prototype.isDate = function() {
	var p;
	var re1 = /(\d{4})[年./-](\d{1,2})[月./-](\d{1,2})[日]?$/;
	var re2 = /(\d{1,2})[月./-](\d{1,2})[日./-](\d{2})[年]?$/;
	var re3 = /(\d{1,2})[月./-](\d{1,2})[日./-](\d{4})[年]?$/;
	if(re1.test(this)) {
		p = re1.exec(this);
		return new Date(p[1],p[2],p[3]);
	}
	if(re2.test(this)) {
		p = re2.exec(this);
		return new Date(p[3],p[1],p[2]);
	}
	if(re3.test(this)) {
		p = re3.exec(this);
		//return new Date(p[3],p[1],p[2]);
	}
	return false;
};

/*** 检查是否有列表中的字符字符 ***/
String.prototype.isInList = function(list) {
	var re = eval("/["+list+"]/");
	return re.test(this);
};

});