import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  NativeModules
} from 'react-native'
import Button from './Button'
import Icon from 'react-native-vector-icons/MaterialIcons'
import {connect} from 'react-redux'
import fontelloConfig from '../assets/icons/config.json';
import { createIconSetFromFontello } from  'react-native-vector-icons'
import * as navActions from '../actions/navActions'
import {getFileUploadUrl, getDocumentsContext} from '../utils/documentsUtils'
import {uploadToKenesto} from '../actions/documentsActions'
var ImagePicker = NativeModules.ImageCropPicker;
const KenestoIcon = createIconSetFromFontello(fontelloConfig);
import * as constans from '../constants/GlobalConstans'

let styles = StyleSheet.create({
    container: {
        flex: 1,
        flexWrap: "wrap",
        flexDirection: 'row',
        paddingTop: 35,
               
        // FOR LANDSCAPE ORIENTATION:
        
        // alignSelf: 'stretch',
        // justifyContent: 'space-between',
        // paddingHorizontal: 20,        
    },
    actionButtonIcon: {
        fontSize: 45,
    },
    actionHolder: {        
        width: 90,
        height: 90,
        margin: 5,
        alignItems: "center",
        justifyContent: "center",
    },
    actionName: {
        textAlign: "center",
        fontSize: 13,
        color: "#000", 
    },
    
})

class PlusMenu extends React.Component{
      constructor(props){
        super (props);
         this.state = {
            file: null,
            documentsContext: getDocumentsContext(this.props.navReducer), 
            readyForUpload: false
            };
    }

        bytesToSize(bytes) {
        var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (bytes == 0) return '0 Byte';
        var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
        };

    
  upload(){
      
     const url = getFileUploadUrl(this.props.env, this.props.sessionToken, this.state.file.name, "", "",  this.state.documentsContext.fId);
    const fileName = this.state.file.path.substring(this.state.file.path.lastIndexOf('/') + 1); 
    //const name = fileName.substring(0,  fileName.lastIndexOf('.'));
    this.props.dispatch(uploadToKenesto({name: this.state.file.name, uri : this.state.file.path, type: this.state.file.type, size: this.state.file.size, fileExtension: this.state.file.extension}, url, false));
     this.props.closeMenuModal("modalPlusMenu");
    
  }

    takePhoto(cropping : boolean){

        ImagePicker.openCamera({
        cropping: cropping,
        width: 400,
        height: 400,
            includeBase64: false
        }).then(image => {
        var date = new Date(); 
        const fileExtension =  image.path.substring(image.path.lastIndexOf("."));

        const fileName = "scanned_" + date.getTime() + '.' + fileExtension;

       
        

          this.setState({
                file: { name: fileName, path: image.path, type: image.mime, size: this.bytesToSize(image.size), extension: fileExtension},
            });

       this.upload();
   
        }).catch(e => console.log(JSON.stringify(e)));

    
  }

  

  
    selectFromLib(cropping : boolean){

            ImagePicker.openPicker({
            width: 400,
            height: 400,
            cropping : false,
            includeBase64: false
            }).then(file => {


             const fileName = file.path.substring(file.path.lastIndexOf("/") + 1);

             const fileExtension =  file.path.substring(file.path.lastIndexOf("."));

            this.setState({
                file: { name: fileName, path: file.path, type: file.mime, size: this.bytesToSize(file.size), extension: fileExtension},
            });

             this.upload();

            }).catch(e => {
                if (e != 'Error: User cancelled image selection')
                {
                    this.props.dispatch(navActions.emitToast(constans.ERROR, "File selection failed"))
                }
                            
            }
        
            );
  }


    addFolder(){
        this.props.closeMenuModal("modalPlusMenu");
       // this.props.createError();
        this.props.openCreateFolder();
    }

    // scan(isCameraScan : boolean){
    //       this.props.closeMenuModal("modalPlusMenu");
    //        const documentsContext = getDocumentsContext(this.props.navReducer);

    //             var data = {
    //                     key: "scan",
    //                     baseFileId:"",
    //                     catId: documentsContext.catId,
    //                     fId: documentsContext.fId,
    //                     sortDirection: documentsContext.sortDirection,
    //                     sortBy: documentsContext.sortBy, 
    //                     isCameraScan: isCameraScan, 
    //                     name: 'Image to upload'
    //   }


    //     //  this.props.dispatch(navActions.push(scanRoute(data).route));
    // }
    

    render(){

        

        return(
            <View style={styles.container}>
                <View style={styles.actionHolder}>
                    <Icon name="create-new-folder" style={styles.actionButtonIcon} onPress={this.addFolder.bind(this)} />
                    <Text style={styles.actionName}>Add Folder</Text>
                </View>
                
                <View style={styles.actionHolder}>
                    <Icon name="file-upload" style={styles.actionButtonIcon} onPress={()=> {this.selectFromLib.bind(this)(false)}}/>
                    <Text style={styles.actionName}>Add Document</Text>
                </View>
                
                <View style={styles.actionHolder}>
                    <Icon name="photo-camera" style={styles.actionButtonIcon} onPress={()=> {this.takePhoto.bind(this)(true)}} />
                    <Text style={styles.actionName}>Scan</Text>
                </View>                
            </View>
        )
    }

}

PlusMenu.contextTypes = {
    plusMenuContext:  React.PropTypes.object
}

function mapStateToProps(state) {
  const { navReducer } = state
  
  return {
      navReducer: navReducer,
        env: state.accessReducer.env, 
      sessionToken: state.accessReducer.sessionToken,

  }
}


export default connect(mapStateToProps)(PlusMenu)