/*
       Licensed to the Apache Software Foundation (ASF) under one
       or more contributor license agreements.  See the NOTICE file
       distributed with this work for additional information
       regarding copyright ownership.  The ASF licenses this file
       to you under the Apache License, Version 2.0 (the
       "License"); you may not use this file except in compliance
       with the License.  You may obtain a copy of the License at          http://www.apache.org/licenses/LICENSE-2.0        Unless required by applicable law or agreed to in writing,
       software distributed under the License is distributed on an
       "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
       KIND, either express or implied.  See the License for the
       specific language governing permissions and limitations
       under the License.
 */ 
package cn.weirong.magicbox.app; 
import android.annotation.SuppressLint;
import android.graphics.Rect;
import android.os.Bundle;
import android.view.MotionEvent;
import android.view.View;
import android.view.View.OnLongClickListener;
import android.view.View.OnTouchListener;
import android.view.ViewTreeObserver;
import android.view.WindowManager;

import org.apache.cordova.*;

import com.iflytek.cloud.SpeechUtility;
public class MainActivity extends CordovaActivity implements OnTouchListener
{
	private View rootView;
	private int mLastHeightDifferece;
	private float eventX;
	private float eventY;
	
    @Override
    public void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
  
         SpeechUtility.createUtility(this, "appid=" + getString(R.string.app_id));
        // Set by <content src="index.html" /> in config.xml
         loadUrl(launchUrl);
         
        
        rootView = this.findViewById(android.R.id.content);
        rootView.getViewTreeObserver().addOnGlobalLayoutListener(new ViewTreeObserver.OnGlobalLayoutListener() {
   	 	public void onGlobalLayout() {
           	 checkHeightDifference();
            }
        });
        
        super.appView.getView().setOnLongClickListener(new View.OnLongClickListener() {

            public boolean onLongClick(View v) {
            	return true;
            }
        });
    }

    @Override
    public boolean onTouch(View v, MotionEvent event) {
	    if (event.getAction() == MotionEvent.ACTION_DOWN) { 
		    eventX = event.getRawX() ;
		    eventY = event.getRawY() ;
	    }
	    return false;
    }
	
	@SuppressLint("NewApi")
    private void checkHeightDifference(){
            Rect r = new Rect();
            rootView.getWindowVisibleDisplayFrame(r);
            int screenHeight = rootView.getRootView().getHeight();
            int heightDifference = screenHeight - r.bottom;
            if (heightDifference > screenHeight/3 && heightDifference != mLastHeightDifferece) {
            	int transHeight = Math.round(heightDifference - ( screenHeight - eventY)+20);
            	rootView.getLayoutParams().height = (screenHeight-r.top)-heightDifference/2;//screenHeight - Math.abs(transHeight); 
//            	System.out.println("transHeight=="+transHeight);
//            	rootView.setTranslationY(-100);
                rootView.requestLayout();
                appView.sendJavascript("onKeyBoardShow(" + r.height() + ");");
                mLastHeightDifferece = heightDifference;
            } else if (heightDifference != mLastHeightDifferece) {
            	rootView.getLayoutParams().height = r.height();
//            	rootView.setTranslationY(heightDifference);
                rootView.requestLayout();
                mLastHeightDifferece = heightDifference;
            }
    }
}
