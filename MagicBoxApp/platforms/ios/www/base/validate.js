define(['zepto', "../base/openapi", "sockjs", "../base/constant"], function($, OpenAPI, SockJs, Cons) {
	var Validate  = {
			require: function(elem, errmsg){
	            elem = $(elem);
	            elem.on("change", function(){
	                var value = this.value;
	                var tipCon = $(this).parents("td").find("span");
	                if(value == ""){
	                    tipCon.html(errmsg);
	                }else{
	                    tipCon.html("");
	                }
	            });
	        },
	        phone: function(elem, errmsg){
	            elem = $(elem);
	            var tipCon = elem.parent().find("span");
	            elem.on("change", function(){
	                var value = $.trim(this.value);
	                if(!/^(0|86|17951)?(13[0-9]|15[012356789]|18[0-9]|14[57]|17[0-9])[0-9]{8}$/.test(value)){
	                    tipCon.html(errmsg);
	                }else{
	                    tipCon.html("");
	                }
	            });
	        },
	        email: function(elem, errmsg){
	            elem = $(elem);
	            var tipCon = elem.parent().find("span");
	            elem.on("change", function(){
	                var value = $.trim(this.value);
	                if(!/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/.test(value)){
	                    tipCon.html(errmsg);
	                }else{
	                    tipCon.html("");
	                }
	            });
	        },
	        compare: function(elem1, elem2, errmsg){
	            elem1 = $(elem1);
	            elem2 = $(elem2);
	            var tipCon = elem2.parent().find("span");
	            elem2.on("change", function(){
	                var value1 = $.trim(elem1[0].value);
	                var value2 = $.trim(this.value);
	                if(value1 !== value2){
	                    tipCon.html(errmsg);
	                }else{
	                    tipCon.html("");
	                }
	            });
	        },
	        emailV: function(elem){
	            elem = $(elem);
	            var value = $.trim($(elem).val());
	            if(!/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/.test(value)){
	                return false;
	            }else{
	                return true;
	            }
	        },
	        phoneV: function(elem, errmsg){
	            elem = $(elem);
	            var value = $.trim($(elem).val());
	            if(!/^(0|86|17951)?(13[0-9]|15[012356789]|18[0-9]|14[57]|17[0-9])[0-9]{8}$/.test(value)){
	                return false;
	           }else{
	                return true;
	           }
	        }
	};
	return Validate;
});