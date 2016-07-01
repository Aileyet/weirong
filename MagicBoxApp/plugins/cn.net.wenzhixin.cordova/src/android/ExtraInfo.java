package cn.net.wenzhixin.cordova;


import java.util.HashMap;
import java.util.LinkedHashMap;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;




import cn.weirong.vbank.app.subs.JsonParser;
import cn.weirong.vbank.app.subs.UdpUtil;


import com.iflytek.cloud.ErrorCode;
import com.iflytek.cloud.InitListener;
import com.iflytek.cloud.RecognizerResult;
import com.iflytek.cloud.SpeechConstant;
import com.iflytek.cloud.SpeechError;
import com.iflytek.cloud.SpeechRecognizer;
import com.iflytek.cloud.SpeechSynthesizer;
import com.iflytek.cloud.SpeechUtility;
import com.iflytek.cloud.ui.RecognizerDialog;
import com.iflytek.cloud.ui.RecognizerDialogListener;

import android.app.Activity;
import android.content.Intent;
import android.media.AudioRecord;
import android.os.Handler;
import android.util.Log;
import android.widget.EditText;
import android.widget.Toast;


public class ExtraInfo extends CordovaPlugin {

	// 语音合成对象
	private SpeechSynthesizer mTts;
	private HashMap<String, String> mIatResults = new LinkedHashMap<String, String>();
	private RecognizerDialog iatDialog =null;
	
    public boolean execute(String action, final JSONArray args, final CallbackContext callbackContext) 

            throws JSONException {
    	
    	final Activity activity = this.cordova.getActivity();
    	
		
    	//启用科大讯飞语音识别
        if (action.equals("getExtra")) {
        	activity.runOnUiThread(new Runnable() {
			@Override
			public void run() {
				// TODO Auto-generated method stub
	        	//调用语音
	        	//SpeechRecognizer mIat= SpeechRecognizer.createRecognizer(activity, null);    
	        	
	            //2.设置听写参数，详见《科大讯飞MSC API手册(Android)》SpeechConstant类    
	            //mIat.setParameter(SpeechConstant.DOMAIN, "iat");    
	            //mIat.setParameter(SpeechConstant.LANGUAGE, "zh_cn");    
	            //mIat.setParameter(SpeechConstant.ACCENT, "mandarin ");    
	            //mIat.startListening(mRecoListener);
	         if(iatDialog==null){
	            iatDialog = new RecognizerDialog(activity,new InitListener() {
	        		@Override
	        		public void onInit(int code) {
	        			if (code != ErrorCode.SUCCESS) {
	        				//editText.setText("初始化失败，错误码：" + code);
	        			}
	        		}
	        	});
				}
				
				  iatDialog.setListener(new RecognizerDialogListener() {
	            	
					@Override
	    			public void onError(SpeechError arg0) {
	    				callbackContext.error(""+arg0);
	    				iatDialog.dismiss();
	    			}
					@Override
	    			public void onResult(RecognizerResult results, boolean arg1) {			
	    				String text = JsonParser.parseIatResult(results.getResultString());
	    				String sn = null;
	    				// 读取json结果中的sn字段
	    				try {
	    					JSONObject resultJson = new JSONObject(results.getResultString());
	    					sn = resultJson.optString("sn");
	    				} catch (JSONException e) {
	    					e.printStackTrace();
	    				}
	    				
	    				mIatResults.put(sn, text);
	    				StringBuffer resultBuffer = new StringBuffer();
	    				for (String key : mIatResults.keySet()) {
	    					resultBuffer.append(mIatResults.get(key));
	    				}
	    				callbackContext.success(resultBuffer.toString());
	    				iatDialog.dismiss();
	    			}
	            });
			 

	          
	            
	            iatDialog.show();
			}
			});
         }
        
        //启用发现设备udp
        if (action.equals("getMagicBox")) {
        	activity.runOnUiThread(new Runnable() {
    			@Override
    			public void run() {
    				try{
    					UdpUtil udp=new UdpUtil(activity);
    					
    					int BroadcastPort=4321;//固定
    					int BroadresultPort=4322;//返回端口
    					String BroadcastIP="239.255.255.255";//组播地址
    					
    					BroadcastPort=args.getInt(0);
    					BroadresultPort=args.getInt(1);
    					BroadcastIP=args.getString(2);
    					
    					callbackContext.success(udp.sendDataResult("WRJW0044        0000                ComdDscv    &IP="+udp.getLocalIp()+"&PORT="+BroadresultPort,BroadcastIP,BroadcastPort));
    				}catch(Exception e){
    					callbackContext.error(e.getMessage());
    				}
    			}
            });
        }
        
        return true;
    }
    
}