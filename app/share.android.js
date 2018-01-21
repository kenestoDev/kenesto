/**
 * Sample React Native Share Extension
 * @flow
 */

import React, { Component } from 'react'
import Modal from 'react-native-modalbox'
import ShareExtension from 'react-native-share-extension'
import Button from "react-native-button";
import {
  Text,
  TextInput,
  View,
  StyleSheet,
  TouchableOpacity
} from 'react-native'

const styles = StyleSheet.create({
    modal: {
    justifyContent: 'center',
    alignItems: 'center',
    },
    share: {
        height: 190,
        width: 320
    },
   container: {
        flex: 1,
        alignItems: "center",
        backgroundColor:"white",
        padding: 20,
        borderWidth: 0.5,
        borderColor: '#666666',
    },
    titleContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        fontSize: 20,
        alignSelf: "center",
        color: "#FA8302"
    },
    messageContainer: {
        flex: 1,
        flexDirection:'row',
        alignItems: "center",
 
    },
    messageText: {
        flex: 1,
        color: "#888",
        // height: 50,            
        fontSize: 17,
        textAlign: "center"
    },
    doubleButtonsContainer: {
        flex: 1,
        flexDirection: "row",
        alignItems: "flex-end",
        marginTop: 30,
        justifyContent: 'space-between',
        alignSelf: "stretch", 
   },
   doubleBtnContainer: {
        width: 135,
        justifyContent: "space-around",
        height: 50,
        backgroundColor: "#F5F6F8",
        borderRadius: 10,
        shadowColor: '#000000',
        shadowOffset: {
                    width: 0,
                    height: 3 
                  },
        shadowRadius: 10,
        shadowOpacity: 0.25 
   },
    singleButtonContainer: {
         flex: 1,
        flexDirection: "row",
        alignItems: "center",
        marginTop: 30,
        justifyContent: 'center',
       
    },
    singleBtnContainer: {
        width: 135,
        justifyContent: "center",
        height: 50,
        backgroundColor: "#F5F6F8",
         borderRadius: 10,
         shadowColor: '#000000',
        shadowOffset: {
                      width: 0,
                      height: 3 
                    },
        shadowRadius: 10,
        shadowOpacity: 0.25
    },   
    button: {
        color: "#666666",
        fontWeight: "normal",
        fontSize: 18, 
    },
})
const kenestoGroup = 'group.com.kenesto.KenestoWorkouts'
export default class Share extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      file : {
        mediaId:"",
        mediaMimeType:"",
        mediaPath:"",
        mediaSize:"",
        mediaName:""
      }
    }
  }

//   async componentDidMount() {
//     try { 
//      const {mediaId ,mediaMimeType, mediaPath, mediaSize, mediaName} = await ShareExtension.data(kenestoGroup)
//       var file = {
//         mediaId:mediaId,
//         mediaMimeType:mediaMimeType,
//         mediaPath:mediaPath,
//         mediaSize:mediaSize,
//         mediaName:mediaName
//       }
// console.log("ShareExtension.data exe" + JSON.stringify(file))
//       this.setState({
//         file:file,
//         isOpen:true
//       })

//     } catch(e) {
//       console.log('errrr', e)

//     }
//   }

  onClose() {
     ShareExtension.close(kenestoGroup);
  }
  
  onOpenMainApp() {
  this.props.openModal();
  // try
  // {
  //  if(!(_.isEmpty(mediaPath) && mediaPath != "")) 
  //    {
  //         var documentlist = getDocumentsContext(this.props.navReducer);
  //                 if(_.isEmpty(documentlist))
  //                 {
  //                   return;
  //                 }
                    
  //                 const fileExtension =  mediaName.substring(mediaName.lastIndexOf("."));
                 
  //                 const url = getFileUploadUrl(this.props.env, this.props.sessionToken, mediaName, "", "",  "");
  //                 const fileName = mediaPath.substring(mediaPath.lastIndexOf('/') + 1); 
                 
  //                 if(documentlist.catId != constans.MY_DOCUMENTS)
  //                 {
  //                   var routeData =
  //                   {
  //                       name: getDocumentsTitle(constans.MY_DOCUMENTS),
  //                       catId: constans.MY_DOCUMENTS,
  //                       fId: "",
  //                       sortDirection: constans.ASCENDING,
  //                       sortBy: constans.ASSET_NAME,
  //                       keyboard:"",
  //                       isSearch: false, 
  //                       isVault: false
  //                   }
  //                    this.props.dispatch(updateRouteData(routeData));
  //                 }
  //                 this.props.dispatch(documentsActions.uploadToKenesto({name: mediaName, uri : mediaPath, type: mediaMimeType, size: bytesToSize(mediaSize), fileExtension: fileExtension}, url, false));
  //    }
  //   } catch(e) {
  //    alert('errrr', e)
  //   }
  }

  closing = () => {
    this.setState({
      isOpen: false
    })
  }

  render() {
     var modalStyle = [styles.modal, styles.share];
     var confirmTitle = "Import to Kenesto";
    var canImport = typeof (this.state.file.mediaName) != 'undefined' && this.state.file.mediaName != "" && this.state.file.mediaName != undefined
     var confirmDetails = "Save file to Kenesto documents";
  
        return (
                
                        <View style={styles.container}>
                          <View style={styles.titleContainer}>
                              <Text style={styles.title}>{confirmTitle}</Text>
                          </View>
                        
                          <View style={styles.messageContainer}>
                              <Text style={styles.messageText}>{confirmDetails}</Text>
                          </View>
                            <View style={styles.doubleButtonsContainer}>
                              <Button onPress={this.onOpenMainApp.bind(this)} containerStyle={styles.doubleBtnContainer} style={styles.button}>Save</Button>
                              <Button containerStyle={styles.doubleBtnContainer} style={styles.button} onPress={this.onClose.bind(this)}>Cancel</Button>
                          </View>
                      </View>  
      
        );
    
  }
}