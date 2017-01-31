import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  NativeModules
} from 'react-native'
import Button from './Button'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { connect } from 'react-redux'
import fontelloConfig from '../assets/icons/config.json';
import { createIconSetFromFontello } from 'react-native-vector-icons'
import * as navActions from '../actions/navActions'
import { getDocumentsContext, getSelectedDocument, getFileUploadUrl } from '../utils/documentsUtils'
import {updateDocumentVersion} from '../actions/documentsActions'
var ImagePicker = NativeModules.ImageCropPicker;
const KenestoIcon = createIconSetFromFontello(fontelloConfig);

let styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor:"white",
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
        fontSize: 14,
        color: "#000",
    },


})

class UpdateVersions extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            file: null
        };
    }


  upload(){
    this.props.closeModal();
    if (this.props.navReducer.routes[this.props.navReducer.index].key == 'document')
        this.props.dispatch(navActions.updateIsProcessing(true));
     setTimeout(() => {
                 const documentsContext = getDocumentsContext(this.props.navReducer);
    var document = getSelectedDocument(this.props.documentsReducer, this.props.navReducer);
    const url = getFileUploadUrl(this.props.env, this.props.sessionToken, this.state.file.name, "", "",  documentsContext.fId, document.Id);
    
    const fileName = this.state.file.path.substring(this.state.file.path.lastIndexOf('/') + 1); 
   
    const name = fileName.substring(0,  fileName.lastIndexOf('.'));
    this.props.dispatch(updateDocumentVersion(documentsContext.catId, {name: name, uri : this.state.file.path, type: this.state.file.type, size: this.state.file.size, fileExtension: this.state.file.extension}, url, document.Id, true));
           }, 100); 
  

  }

 takePhoto(cropping : boolean){

        ImagePicker.openCamera({
        cropping: cropping,
        width: 400,
        height: 400,
            includeBase64: true
        }).then(image => {
//alert(image.path);
        const imageName = image.path.substring(image.path.lastIndexOf("/") + 1);
            
        this.setState({
            file: {uri: `data:${image.mime};base64,`+ image.data, width: image.width, height: image.height, name: imageName, data: image.data, path: image.path, type: image.mime},
        });

       this.upload();

        }).catch(e => alert(JSON.stringify(e)));

    
  }

  
    selectFromLib(cropping : boolean){

            ImagePicker.openPicker({
            width: 400,
            height: 400,
            cropping : false,
            includeBase64: true
            }).then(file => {
           
             const fileName = file.path.substring(file.path.lastIndexOf("/") + 1);

          
            this.setState({
                file: { name: fileName, path: file.path, type: file.mime},
            });

             this.upload();

            }).catch(e => alert(JSON.stringify(e)));

    
  }
    render() {

        return (
            <View style={styles.container}>                
                <View style={styles.actionHolder}>
                    <Icon name="file-upload" style={styles.actionButtonIcon} onPress={()=> {this.selectFromLib.bind(this)(true)}}/>
                    <Text style={styles.actionName}>Update Version</Text>
                </View>
                
                <View style={styles.actionHolder}>
                    <Icon name="photo-camera" style={styles.actionButtonIcon} onPress={()=> {this.takePhoto.bind(this)(false)}} />
                    <Text style={styles.actionName}>Scan</Text>
                </View>                
            </View>
        )
    }

}

UpdateVersions.contextTypes = {
    plusMenuContext: React.PropTypes.object
}

function mapStateToProps(state) {
    const { navReducer, documentsReducer } = state

    return {
        navReducer: navReducer,
        documentsReducer:documentsReducer,
        env: state.accessReducer.env, 
        sessionToken: state.accessReducer.sessionToken,
    }
}


export default connect(mapStateToProps)(UpdateVersions)