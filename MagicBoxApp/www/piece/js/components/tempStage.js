define(['zepto', 'components/cache', 'components/store'], function($, Cache, Store){
	
	/**
	 * 获取登陆用户id
	 */
	function loginId(value) {
		return _handleLocal("loginId", value);
	}
	
	/**
	 * 获取登陆用户信息
	 */
	function loginUser(value) {
		return _handleLocal("user_info", value)
	}
	
	
	function _handleCache(key, value){
		if (value) {
			Cache.put(key, value);
		}
		return Cache.get(key);
	}
	
	function _handleLocal(key, value){
		if (value) {
			Piece.Store.saveObject(key, value, true);
		}
		return Piece.Store.loadObject(key, true);
	}
	return {
		loginId : loginId,
		loginUser : loginUser
	}
});