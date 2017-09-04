//
//  KenestoShareEx.m
//  kenesto
//
//  Created by KenestoDev on 07/08/2017.
//  Copyright © 2017 Kenesto. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "ReactNativeShareExtension.h"
#import "React/RCTBundleURLProvider.h"
#import "React/RCTRootView.h"

@interface KenestoShareEx : ReactNativeShareExtension
@end

@implementation KenestoShareEx

RCT_EXPORT_MODULE();

- (UIView*) shareView {
  NSURL *jsCodeLocation;
  
  jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index.ios" fallbackResource:nil];
  
  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"KenestoShareEx"
                                               initialProperties:nil
                                                   launchOptions:nil];
  rootView.backgroundColor = nil;
  return rootView;
}

@end
