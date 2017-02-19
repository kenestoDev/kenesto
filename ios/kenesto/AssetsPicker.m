//
//  AssetsPicker.m
//  RNFilePicker
//
//  Created by KenestoDev on 08/02/2017.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import "AssetsPicker.h"
#import "FPPicker.h"
@implementation AssetsPicker


- (void)fpPickerControllerDidCancel:(FPPickerController *)pickerController
{
  NSLog(@"FP Cancelled Open");
  
  [self.pickerController dismissViewControllerAnimated:YES
                           completion:nil];
}

- (void)       fpPickerController:(FPPickerController *)pickerController
    didFinishPickingMediaWithInfo:(FPMediaInfo *)info
{
  NSLog(@"FILE CHOSEN: %@", info);
  
  
 //@try{
//  
  [self.pickerController dismissViewControllerAnimated:YES
                                            completion:^() {
                                              NSDictionary *result = @{
                                                                       @"mediaPath":info.mediaURL.path,
                                                                       @"mediaMimeType":info.mediaType,
                                                                       @"mediaSize":info.filesize,
                                                                       @"mediaName":info.filename
                                                                       };
                                              self.resolve(result);
                                            }];
 // }
 // @catch(NSException* e){
 //   self.reject(@"ERROR_OPENING", @"error closing assets picker", nil);
 // }
}


RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(PickAsset:(NSDictionary *)options
                 
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject){
 // self.callback = callback;
  self.resolve = resolve;
  self.reject = reject;
//  
//  [FPLibrary uploadDataToFilepicker:nil
//                              named:nil
//                         ofMimetype:nil
//                       shouldUpload:NO
//                           progress:nil];
  
 UIViewController *ctrl = [[[[UIApplication sharedApplication] delegate] window] rootViewController];
 
 self.pickerController = [FPPickerController new];
 
 // Set the delegate
 
 self.pickerController.fpdelegate = self;
 	
 // Ask for specific data types. (Optional) Default is all files
 
 
  self.pickerController.dataTypes = @[
                                 @"*/*"
                                 ];
 
  // Select and order the sources (Optional) Default is all sources
 
  self.pickerController.sourceNames = @[
                                   FPSourceFilesystem,
                                   FPSourceCameraRoll,
                                   FPSourceImagesearch,
                                   FPSourceDropbox,
                                   FPSourceGoogleDrive,
                                   ];
 
 // You can set some of the in built Camera properties as you would with UIImagePicker
 
 self.pickerController.allowsEditing = NO;
 
 // Allowing multiple file selection
 
 self.pickerController.selectMultiple = NO;
  
  //self.pickerController.shouldUpload = NO;
 
 // Limiting the maximum number of files that can be uploaded at one time
 

 
 
 /* Control if we should upload or download the files for you.
  * Default is YES.
  * When a user selects a local file, we'll upload it and return a remote URL.
  * When a user selects a remote file, we'll download it and return the filedata to you.
  */
 

 
 // Display it

 // @try{
 
  dispatch_async(dispatch_get_main_queue(), ^{
              [ctrl presentViewController:self.pickerController
                              animated:YES
                            completion: nil];
  });
 // }
 // @catch(NSException* e){
 //   self.reject(@"ERROR_OPENING", @"error openning assets picker", nil);
 // }
  


}

@end
