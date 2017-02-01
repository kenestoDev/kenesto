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
* react-native-material-kit ??
    problem: npm not synced with latest version 
    solution: replace \node_modules\react-native-material-kit\lib\internal\MKTouchable.js 
    with the one in \appendix
* react-native-fetch-blob
    problem: SupportsRtl definitions colides with general definition.
    soution: change the value of parameter "android:supportsRtl" from "true" to "false", 
             in \kenestotogo\node_modules\react-native-fetch-blob\android\src\main\AndroidManifest.xml  
* react-native-message-bar ??
    problem: plugin doesn't allow customizing toast layout (aligning icon with centered text).
    solution: in render() function inside MessageBar.js replace the TouchableOpacity content with:
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-end', padding: 10 }} >
                <View style={{ flex: 1, flexDirection: 'row', alignSelf: 'stretch', justifyContent: 'center', marginLeft: 0 }} >
                    { this.renderImage() }
                    { this.renderMessage() }
                </View>
            </View>