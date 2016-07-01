#import <UIKit/UIKit.h>
#import <Cordova/CDVPlugin.h>
#import <TencentOpenAPI/TencentOAuth.h>

@interface QQLogin : CDVPlugin <TencentLoginDelegate>
{
	TencentOAuth* _tencentOAuth;
    NSMutableArray* _permissions;

}


- (void)authLogin:(CDVInvokedUrlCommand*)command;

@end
