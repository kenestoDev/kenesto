//to delete 

// import React, {Component} from 'react';
// import {View, Text, StyleSheet, ScrollView, Image, TouchableOpacity} from 'react-native';
// import {getFileUploadUrl,getDocumentsContext} from '../utils/documentsUtils'
// import {uploadToKenesto} from '../actions/documentsActions'
// import {NativeModules, Dimensions} from 'react-native';
// import {connect} from 'react-redux'
// import RNFetchBlob from 'react-native-fetch-blob'
// import ProggressBar from "../components/ProgressBar";
// var ImagePicker = NativeModules.ImageCropPicker;
// var FilePickerModule = NativeModules.FilePickerModule;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center'
//   },
//   button: {
//     backgroundColor: 'blue',
//     marginBottom: 10
//   },
//   text: {
//     color: 'white',
//     fontSize: 20,
//     textAlign: 'center'
//   }
// });



// class Scan extends React.Component {

//   constructor() {
//     super();
//     this.state = {
//       image: null,
//       images: null, 
//       initial: true, 
//     };
//   }

//   scaledHeight(oldW, oldH, newW) {
//     return (oldH / oldW) * newW;
//   }


//   upload(){
  
//   const documentsContext = getDocumentsContext(this.props.navReducer);
//   const url = getFileUploadUrl(this.props.env, this.props.sessionToken, this.state.image.name, "", "",  documentsContext.fId, this.props.baseFileId);

//   const fileName = this.state.image.path.substring(this.state.image.path.lastIndexOf('/') + 1); 
//   const name = fileName.substring(0,  fileName.lastIndexOf('.'));
 
//   this.setState({uploading : true});

// this.props.dispatch(uploadToKenesto({name: name, uri : this.state.image.path, type: this.state.image.type},url));

    
//   }

//   takePhoto(cropping : boolean){
//     ImagePicker.openCamera({
//       cropping: cropping,
//       width: 400,
//       height: 400,
//         includeBase64: true
//     }).then(image => {
//           alert('kuku');

//     }).catch(e => alert(JSON.stringify(e)));

    
//   }

//     selectFromLib(cropping : boolean){

//     ImagePicker.openPicker({
//       width: 400,
//       height: 400,
//       cropping : false,
//        includeBase64: true
//     }).then(file => {
    
//      const fileName = file.path.substring(file.path.lastIndexOf("/") + 1);
//       this.setState({
//         initial: false, 
//         image: { name: fileName, path: file.path, type: file.mime},
//         images: null});

//     }).catch(e => alert(JSON.stringify(e)));

    
//   }

// updateImage(image : Object){
//   //var ff = this.camera.capture;
//        //   const img = await ff(true);
//        //alert(this.camera)
// }

// componentDidMount(){
//   if (this.props.isCameraScan)
//       this.takePhoto(true);
//   else 
//   this.selectFromLib(true);

// }
//    render() {

//      if (this.state.uploading){
//         return(
//           <View>
//             <Text>uploading file....</Text>
//             <ProggressBar isLoading={true} />
//            </View>
//             )

//      }

//        const buttons = this.state.initial? null : (<View>
//             <TouchableOpacity onPress={() => {this.takePhoto.bind(this)(true)}} style={styles.button}>
//                 <Text style={styles.text}>Shoot again</Text>
//             </TouchableOpacity>
//             <TouchableOpacity onPress={this.upload.bind(this)} style={styles.button}>
//                 <Text style={styles.text}>Upload to Kenesto</Text>
//             </TouchableOpacity>
//           </View>);

//     return <View style={styles.container}>
     
//       <Text>
//         {this.state.initial}
//       </Text>
//     {buttons}

//     </View>;
//   }
// }

// function mapStateToProps(state) {    
// var {navReducer} = state; 


//   return {
//       env: state.accessReducer.env, 
//       sessionToken: state.accessReducer.sessionToken,
//       isFetching: state.documentsReducer.isFetching,
//       navReducer : navReducer
  
//   }
// }

// export default connect(mapStateToProps)(Scan)