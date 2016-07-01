//
//  IflyPlugin.h
//  WPCordova
//
//  Created by chenyao on 15/12/18.
//
//

#import <Cordova/CDV.h>
#import "ISRDataHelper.h"
#import "iflyMSC/iflyMSC.h"

@interface IflyPlugin : CDVPlugin<IFlyRecognizerViewDelegate>
@property (nonatomic, strong) NSString *pcmFilePath;//音频文件路径
@property (nonatomic, strong) IFlyRecognizerView *iflyRecognizerView;//带界面的识别对象

- (void) startListerToText:(CDVInvokedUrlCommand*)command;
@end