package com.mediatek.elian;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaArgs;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaWebView;
import org.json.JSONException;

public class ElianPlugin extends CordovaPlugin{

	private ElianNative elian;
	
	public ElianPlugin() {
		// TODO Auto-generated constructor stub
	}
	
	@Override
	public void initialize(CordovaInterface cordova, CordovaWebView webView) {
		super.initialize(cordova, webView);
		
	}
	
	@Override
	public boolean execute(String action, CordovaArgs args,
			CallbackContext callbackContext) throws JSONException {
		
		boolean result = ElianNative.LoadLib();
		if (!result)
		{
			callbackContext.error("can't load elianjni lib");
			return true;
		}
        
        elian = new ElianNative();
		
		if("StartSmartConnection".equals(action)){
			String ssid = args.getString(0);
			String password = args.getString(1);
			int initSmart = elian.InitSmartConnection(null, 1, 1);
			int startSmart = elian.StartSmartConnection(ssid, password, "");		
			callbackContext.success(initSmart+",success,"+startSmart);
		}
		
		return super.execute(action, args, callbackContext);
	}
}
