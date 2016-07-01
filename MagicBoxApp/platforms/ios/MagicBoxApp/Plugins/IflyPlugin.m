//
//  MyPlugin.m
//  WPCordova
//
//  Created by chenyao on 15/12/17.
//
//

#import "IflyPlugin.h"

@implementation IflyPlugin
{
    NSString* _callBackId;
    NSMutableString *contents;
}

- (void) startListerToText:(CDVInvokedUrlCommand*)command {
    @try {
        //设置sdk的log等级，log保存在下面设置的工作路径中
        [IFlySetting setLogFile:LVL_ALL];
        //打开输出在console的log开关
        [IFlySetting showLogcat:NO];
        //设置sdk的工作路径
        [IFlySetting setLogFilePath:[NSSearchPathForDirectoriesInDomains(NSCachesDirectory, NSUserDomainMask, YES) objectAtIndex:0]];
        //所有服务启动前，需要确保执行createUtility
        [IFlySpeechUtility createUtility:@"appid=56727969"];
        if(_iflyRecognizerView == nil){
            CGSize size = [UIScreen mainScreen].bounds.size;
            //UI显示剧中
            _iflyRecognizerView= [[IFlyRecognizerView alloc] initWithCenter: CGPointMake(size.width / 2, size.height / 2)];
            [_iflyRecognizerView setParameter:@"" forKey:[IFlySpeechConstant PARAMS]];
            //设置听写模式
            [_iflyRecognizerView setParameter:@"iat" forKey:[IFlySpeechConstant IFLY_DOMAIN]];
            _iflyRecognizerView.delegate = self;
            //设置最长录音时间
            [_iflyRecognizerView setParameter:@"30000" forKey:[IFlySpeechConstant SPEECH_TIMEOUT]];
            //设置后端点
            [_iflyRecognizerView setParameter:@"1000" forKey:[IFlySpeechConstant VAD_EOS]];
            //设置前端点
            [_iflyRecognizerView setParameter:@"1000" forKey:[IFlySpeechConstant VAD_BOS]];
            //网络等待时间
            [_iflyRecognizerView setParameter:@"20000" forKey:[IFlySpeechConstant NET_TIMEOUT]];
            //设置采样率，推荐使用16K
            [_iflyRecognizerView setParameter:@"16000" forKey:[IFlySpeechConstant SAMPLE_RATE]];
            //设置语言
            [_iflyRecognizerView setParameter:@"zh_cn" forKey:[IFlySpeechConstant LANGUAGE]];
            //设置是否返回标点符号
            [_iflyRecognizerView setParameter:@"1" forKey:[IFlySpeechConstant ASR_PTT]];
            //设置音频来源为麦克风
            [_iflyRecognizerView setParameter:IFLY_AUDIO_SOURCE_MIC forKey:@"audio_source"];
            //设置听写结果格式为json
            [_iflyRecognizerView setParameter:@"plain" forKey:[IFlySpeechConstant RESULT_TYPE]];
            //保存录音文件，保存在sdk工作路径中，如未设置工作路径，则默认保存在library/cache下
            [_iflyRecognizerView setParameter:@"asr.pcm" forKey:[IFlySpeechConstant ASR_AUDIO_PATH]];
            if ([_iflyRecognizerView start]) {
                _callBackId = command.callbackId;
            } else {
                [self writeJavascript:[[CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR] toErrorCallbackString:command.callbackId]];
            }
        }
    } @catch (NSException* exception) {
        [self writeJavascript:[[CDVPluginResult resultWithStatus:CDVCommandStatus_JSON_EXCEPTION messageAsString:[exception reason]] toErrorCallbackString:command.callbackId]];
    }
}

/*******************************CallBack********************************/
/**
 有界面，听写结果回调
 resultArray：听写结果
 isLast：表示最后一次
 ****/
- (void)onResult:(NSArray *)resultArray isLast:(BOOL)isLast
{
    NSMutableString *result = [[NSMutableString alloc] init];
    NSDictionary *dic = [resultArray objectAtIndex:0];
    
    for (NSString *key in dic) {
        [result appendFormat:@"%@",key];
    }
    if(contents == nil)
        contents = [[NSMutableString alloc] init];
    [contents appendString: result];
    if(isLast){
        [_iflyRecognizerView cancel];
        [_iflyRecognizerView removeFromSuperview];
        _iflyRecognizerView = nil;
        CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:contents];
        contents = nil;
        [self writeJavascript:[pluginResult toSuccessCallbackString:_callBackId]];
        
    }
}

- (void) onError:(IFlySpeechError *)error
{
    if (error.errorCode != 0) {
        NSLog(@"%@", error.errorDesc);
        CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:error.errorDesc];
        [self writeJavascript:[[CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR] toErrorCallbackString:_callBackId]];
    }
}
@end