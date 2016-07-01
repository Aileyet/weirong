/**
 * HTML5本地存储模块，DB实例
 */
define(['zepto'], function($){

	var Store = function(){
		
	}
	
	/**
	 * 存放信息
	 * 根据登陆用户存储信息，登陆信息存在公共部分
	 * @example
	 *     {
	 *         001 : {
	 *         		cub-list-submit-data-list : {},
	 *         		cub-obj-subs-detail-obj : {},
	 *         }
	 *         002: {
	 *         		cub-list-submit-data-list : {},
	 *         		cub-obj-subs-detail-obj : {},
	 *         }
	 *         loginId: 001,
	 *         user_token:0x545615s5
	 *     }
	 * 
	 * @param key 关键字 请使用类型开头如果列表会cub-list
	 * @param object 值 存放的值
	 * @param isLoginInfo 是否是存放用户信息 若是存在第一层中
	 */
	Store.saveObject = function(key, object, isLoginInfo) {
		if (isLoginInfo) {
			window.localStorage[key] = JSON.stringify(object);
		} else {
			var loginId = window.localStorage["loginId"];
			var json =  Store.loadObject(loginId, true)  || {};
			json[key] = object
			window.localStorage[loginId] = JSON.stringify(json);
		}
		
	}

	Store.loadObject = function(key, isLoginInfo) {
		if (isLoginInfo) {
			var objectString =  window.localStorage[key];
			return objectString == null ? null : JSON.parse(objectString);
		} 
		
		var loginId = window.localStorage["loginId"];
		if (window.localStorage[loginId]) {
			var json = JSON.parse(window.localStorage[loginId]);
			return json[key] || null;
		}
		return null;
	}

	Store.deleteObject = function(key, isLoginInfo) {
		if (isLoginInfo) {
			window.localStorage.removeItem(key);
			return;
		}
		var loginId = window.localStorage["loginId"];
		if (window.localStorage[loginId]) {
			var json = JSON.parse(window.localStorage[loginId]);
			delete json[key];
			Store.saveObject(loginId, json, true);
		}
		 
	}

	Store.clear = function() {
		window.localStorage.clear();
	}

	return Store;
});