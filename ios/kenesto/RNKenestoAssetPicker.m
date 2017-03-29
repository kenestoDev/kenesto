#import "RNKenestoAssetPicker.h"
#import <React/RCTConvert.h>
#import <React/RCTBridgeModule.h>

@interface RNKenestoAssetPicker () <UIDocumentMenuDelegate,UIDocumentPickerDelegate>
@end


@implementation RNKenestoAssetPicker {
    NSMutableArray *composeViews;
    NSMutableArray *composeCallbacks;
}

@synthesize bridge = _bridge;

- (instancetype)init
{
    if ((self = [super init])) {
        composeCallbacks = [[NSMutableArray alloc] init];
        composeViews = [[NSMutableArray alloc] init];
    }
    return self;
}

- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}

RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(show:(NSDictionary *)options
                  callback:(RCTResponseSenderBlock)callback) {

    NSArray *allowedUTIs = [RCTConvert NSArray:options[@"filetype"]];
    UIDocumentPickerViewController *documentPicker = [[UIDocumentPickerViewController alloc] initWithDocumentTypes:(NSArray *)allowedUTIs inMode:UIDocumentPickerModeImport];

    [composeCallbacks addObject:callback];

    documentPicker.delegate = self;


    documentPicker.modalPresentationStyle =  UIModalPresentationFormSheet; //  UIModalPresentationPopover;
         //documentPicker.modalTransitionStyle = 	UIModalTransitionStyleCrossDissolve;
    UIViewController *rootViewController = [[[[UIApplication sharedApplication]delegate] window] rootViewController];

    documentPicker.popoverPresentationController.sourceView = rootViewController.view;
    CGRect myFrame = [rootViewController.view frame];
    documentPicker.popoverPresentationController.sourceRect = myFrame;  //rootViewController.view.bounds;
    [rootViewController presentViewController:documentPicker animated:YES completion:nil];
    
}


- (void)documentMenu:(UIDocumentMenuViewController *)documentMenu didPickDocumentPicker:(UIDocumentPickerViewController *)documentPicker {
    documentPicker.delegate = self;
    UIViewController *rootViewController = [[[[UIApplication sharedApplication]delegate] window] rootViewController];
    [rootViewController presentViewController:documentPicker animated:YES completion:nil];
}

- (void)documentPicker:(UIDocumentPickerViewController *)controller didPickDocumentAtURL:(NSURL *)url {
    if (controller.documentPickerMode == UIDocumentPickerModeImport) {
        RCTResponseSenderBlock callback = [composeCallbacks lastObject];
        [composeCallbacks removeLastObject];
        [url startAccessingSecurityScopedResource];
        NSFileCoordinator *coordinator = [[NSFileCoordinator alloc] init];
        __block NSError *error;
        [coordinator coordinateReadingItemAtURL:url options:NSFileCoordinatorReadingResolvesSymbolicLink error:&error byAccessor:^(NSURL *newURL) {
            NSNumber *fileSizeValue = nil;
            NSError *fileSizeError = nil;
            NSString * fileNameValue = @"";

            [newURL getResourceValue:&fileSizeValue
                               forKey:NSURLFileSizeKey
                                error:&fileSizeError];
            [newURL getResourceValue:&fileNameValue
                              forKey:NSURLNameKey
                               error:&fileSizeError];

            NSURLRequest* fileUrlRequest = [[NSURLRequest alloc] initWithURL:newURL cachePolicy:NSURLCacheStorageNotAllowed timeoutInterval:.1];
            
            NSError* error = nil;
            NSURLResponse* response = nil;
            NSData* fileData = [NSURLConnection sendSynchronousRequest:fileUrlRequest returningResponse:&response error:&error];
            NSString* mimeType = [response MIMEType];
            NSString* suggestedName = [response suggestedFilename];
            NSDictionary *result = @{
                                     @"mediaPath":newURL.absoluteString,
                                     @"mediaMimeType":mimeType,
                                     @"mediaSize":fileSizeValue,
                                     @"mediaName":suggestedName
                                     };
            
            callback(@[[NSNull null], result]);
        }];
        [url stopAccessingSecurityScopedResource];

    }
}

@end
