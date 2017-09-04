packages with special handling: 

* react-native-orientation
    problem: npm not synced with latest version 
    solution: instead of installing with npm install, copy folder from master to node_modules folder 
    and run: react-native link react-native-orientation
    then replace the content of index.js with the content of KenestoDeviceOrientation.js OR use require('./KenestoDeviceOrientation') instead require('react-native-orientation');
* react-native-crop-picker 
    problem: No support for all file types in the picker module. 
    solution: replace \node_modules\react-native-image-crop-picker\android\src\main\java\com\reactnative\ivpusic\imagepicker\PickerModule.js 
    with the one in \appendix
* react-native-fetch-blob
    problem: SupportsRtl definitions colides with general definition.
    soution: change the value of parameter "android:supportsRtl" from "true" to "false", 
             in \kenestotogo\node_modules\react-native-fetch-blob\android\src\main\AndroidManifest.xml  
*   react-native-image-crop-picker
    problem : RSKImageCropper Redefinition of module cause by bug in Xcode 8.3 https://github.com/ivpusic/react-native-image-crop-picker/issues/286
    soution: under kenesto project go to
            node_modules/react-native-image-crop-picker/ios/RSKImageCropper/RSKImageCropper
            and change mv module.modulemap RSKImageCropper.modulemap
* react-native-share-extension and react-native-swiss-knife
    problem : Not suport for import file to kenesto(IOS)
    soution : replace the two folders(react-native-share-extension and react-native-swiss-knife) under folder 'node_modules' with these under folder 'node_modules_fix'