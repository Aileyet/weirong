
var templateID = localStorage.getItem("templateID");
var path = "";
if(templateID){
	path = "../../base/templates/templateIcon_"+templateID;
}else{
	 path = "../../base/templates/templateIcon_1";
}
define(['zepto',path], function($,_icon) {
	
	 var icon = _icon;
	 return icon;
});