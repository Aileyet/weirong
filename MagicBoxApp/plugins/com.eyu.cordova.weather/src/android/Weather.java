package com.eyu.cordova.weather;


import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.text.SimpleDateFormat;
import java.util.Date;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.http.HttpResponse;
import org.apache.http.ParseException;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.protocol.HTTP;
import org.apache.http.util.EntityUtils;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.util.Base64;

public class Weather extends CordovaPlugin {
	public static final String NATIVE_ACTION_STRING = "";
	private static final String HMAC_SHA1 = "HmacSHA1";  
	@Override
	public boolean execute(String action, JSONArray args,
		CallbackContext callbackContext) throws JSONException {
		if(action.equals("getWeather")){
			String weatherJsonF = queryStringForGet(getUrl("forecast_v",args));
			System.out.print(weatherJsonF);
			callbackContext.success(weatherJsonF);
		}else if(action.equals("getindex")){
			String weatherJsonI = queryStringForGet(getUrl("index_v",args));
			System.out.print(weatherJsonI);
			callbackContext.success(weatherJsonI);
		}else if(action.equals("getindexXml")){
			String thisUrl2 = "http://wthrcdn.etouch.cn/WeatherApi?citykey="+ args.getString(0);
			String str = getHttpContent(thisUrl2, "UTF-8");
			callbackContext.success(str);
		}
		
		return super.execute(action, args, callbackContext);
	}
	
	public  String getHttpContent(String url, String charSet) {
        HttpURLConnection connection = null;
        String content = "";
        try {
            URL address_url = new URL(url);
            connection = (HttpURLConnection) address_url.openConnection();
//            connection.setRequestMethod("GET");
            //设置访问超时时间及读取网页流的超市时间,毫秒值
            System.setProperty("sun.net.client.defaultConnectTimeout","30000");
            System.setProperty("sun.net.client.defaultReadTimeout", "30000");

            //after JDK 1.5
//            connection.setConnectTimeout(10000);
//            connection.setReadTimeout(10000);
            //得到访问页面的返回值
            int response_code = connection.getResponseCode();
            if (response_code == HttpURLConnection.HTTP_OK) {
                InputStream in = connection.getInputStream();
//                InputStreamReader reader = new InputStreamReader(in,charSet);
                BufferedReader reader = new BufferedReader(new InputStreamReader(in, charSet));
                String line = null;
                while ((line = reader.readLine()) != null) {
                    content+=line;
                }
                return content;
            }
        } catch (MalformedURLException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            if(connection !=null){
                connection.disconnect();
            }
        }
        return "";
    }
	
	//获取URL
	private String getUrl(String type,JSONArray args){
		try {
			SimpleDateFormat df = new SimpleDateFormat("yyyyMMddHHmm");//设置日期格式
			
			String appid = "d3986f468cee45b8";
			String private_key = "0f846a_SmartWeatherAPI_70b8a4c";
			String thisCity = args.getString(0);
			String date = df.format(new Date());
			
			String api_head = "http://open.weather.com.cn/data/?areaid="+thisCity+"&type="+type+"&date="+date;
			String publickey = api_head + "&appid="+appid;
			
			
			SecretKeySpec signingKey = new SecretKeySpec(private_key.getBytes(), HMAC_SHA1);  
		    Mac mac = Mac.getInstance(HMAC_SHA1);  
		    mac.init(signingKey);  
		    byte[] rawHmac = mac.doFinal(publickey.getBytes());  
		    String key =  Base64.encodeToString(rawHmac,Base64.DEFAULT); 
		    String UrlAppid = appid.substring(0, 6).toString();
		    String thisUrl = api_head + "&appid="+UrlAppid+"&key="+key;
		    URL url = new URL(thisUrl); 
		    return url.toString();
		} 
		catch (NoSuchAlgorithmException e) {
			e.printStackTrace();
		} catch (InvalidKeyException e) {
			e.printStackTrace();
		} catch (MalformedURLException e) {
			e.printStackTrace();
		} catch (JSONException e) {
			e.printStackTrace();
		}
		return null;
	}
	private String queryStringForGet(String url) {
		HttpGet request = new HttpGet(url);

		String result = null;

		try {
			HttpResponse response = new DefaultHttpClient().execute(request);
			if (response.getStatusLine().getStatusCode() == 200) {
				result = EntityUtils.toString(response.getEntity(), HTTP.UTF_8);
				return result;
			}
		} catch (ClientProtocolException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		return result;
	}
}
