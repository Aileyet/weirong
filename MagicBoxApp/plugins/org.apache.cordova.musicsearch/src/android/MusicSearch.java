/*
       Licensed to the Apache Software Foundation (ASF) under one
       or more contributor license agreements.  See the NOTICE file
       distributed with this work for additional information
       regarding copyright ownership.  The ASF licenses this file
       to you under the Apache License, Version 2.0 (the
       "License"); you may not use this file except in compliance
       with the License.  You may obtain a copy of the License at

         http://www.apache.org/licenses/LICENSE-2.0

       Unless required by applicable law or agreed to in writing,
       software distributed under the License is distributed on an
       "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
       KIND, either express or implied.  See the License for the
       specific language governing permissions and limitations
       under the License.
 */
package org.apache.cordova.musicsearch;

import java.util.List;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import cn.weirong.magicbox.app.MyApplication;

public class MusicSearch extends CordovaPlugin {
	private CallbackContext callbackContext; // The callback context from which
												// we were invoked.

	@Override
	public boolean execute(String action, JSONArray args,
			CallbackContext callbackContext) throws JSONException {
		this.callbackContext = callbackContext;
System.out.println("0000000...........");

		JSONObject options = args.optJSONObject(0);
		if (options != null) {
			// limit = options.optLong("limit", 1);
			// duration = options.optInt("duration", 0);
			// quality = options.optInt("quality", 1);
		}
System.out.println("开始查找歌曲...........");
		if (action.equals("musicSearch")) {
			// 执行音乐查找处理
			JSONArray jArray = this.musicSearch();
			if (null == jArray) {
				return false;
			}
			callbackContext.success(jArray);
		} else {
			return false;
		}

		return true;
	}

	/**
	 * 音乐查找处理
	 */
	public JSONArray musicSearch() {
		MusicLoader ml = MusicLoader.instance(MyApplication.getAppContext()
				.getContentResolver());
		List<MusicInfo> mlList = ml.getMusicList();
		if (null != mlList && mlList.size() > 0) {
			JSONArray ja = listToJsonArray(mlList);
			if (null == ja) {
				return null;
			}
System.out.println("已查找歌曲..........."+mlList.size()+"首。");
			return ja;
		} else {
			return null;
		}
	}

	/**
	 * 将list转为JSONArray
	 */
	public JSONArray listToJsonArray(List<MusicInfo> mList) {
		if (null == mList || mList.size() == 0) {
			return null;
		}
		JSONArray jsonarray = new JSONArray();
		for (MusicInfo m : mList) {
			JSONObject jObject = obToJsonObject(m);
			if (null == jObject) {
				return null;
			}
			jsonarray.put(jObject);
		}
		return jsonarray;
	}

	/**
	 * 将实体对象转为JSONObject
	 */
	public JSONObject obToJsonObject(MusicInfo m) {
		if (null == m) {
			return null;
		}

		JSONObject job = new JSONObject();

		try {
			job.put("id", m.getId());// 歌曲 id
			job.put("title", m.getTitle());// 歌曲名称
			job.put("singer", m.getSinger());// 歌手
			job.put("album", m.getAlbum());// 专辑
			job.put("size", m.getSize());// 大小
			job.put("length", m.getLength());// 时长
			job.put("url", m.getUrl());// 歌曲路径
		} catch (JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		return job;
	}
}
