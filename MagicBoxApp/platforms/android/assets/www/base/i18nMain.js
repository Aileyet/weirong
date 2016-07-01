var lang = "";
//lang = Piece.I18n.getLocale();
var lang = !+[1,] ? navigator.userLanguage : navigator.language;
if(lang){
	lang=lang.substring(0,2);
}
var url ="";
if(lang=="zh"){
	url ="../base/i18n/language_zh";
}else if(lang=="en"){
	url ="../base/i18n/language_en";
}
define(['zepto',url, "../base/openapi"], function($,_i18n, OpenAPI) {
	 var I18n = _i18n;
	 return I18n;
});