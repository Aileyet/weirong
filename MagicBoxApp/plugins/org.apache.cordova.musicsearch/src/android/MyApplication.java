package cn.weirong.magicbox.app;

import android.app.Application;
import android.content.Context;

public class MyApplication extends Application{
    private static MyApplication mcontext;
    @Override
    public void onCreate() {
        // TODO Auto-generated method stub
        super.onCreate();
        mcontext=this;
    }
    public static Context getAppContext(){
        return mcontext;
    }
}
