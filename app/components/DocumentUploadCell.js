'use strict';

import React from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableNativeFeedback,
  View
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import MartialExtendedConf from '../assets/icons/config.json';
import customConfig from '../assets/icons/customConfig.json';
import { createIconSetFromFontello } from  'react-native-vector-icons'
import {updateSelectedObject,getDocumentPermissions, removeUploadDocument,resumeUploadToKenesto} from '../actions/documentsActions'
import {connect} from 'react-redux'
import {getIconNameFromExtension} from '../utils/documentsUtils';
import * as Progress from 'react-native-progress';
import imageSource from '../assets/thumbnail_img.png'; 
const KenestoIcon = createIconSetFromFontello(MartialExtendedConf);
const CustomIcon = createIconSetFromFontello(customConfig);

var DocumentUploadCell = React.createClass({
    pauseUpload: function(){
        this.props.document.xhr.abort();
    },
    toggleUpload: function (id, familyCode){
      //var {dispatch} = this.props; 
   
    //  dispatch(updateSelectedObject(id, familyCode, ""));
    //  dispatch(getDocumentPermissions(id, familyCode))
      // this.context.itemMenuContext.open();
    },
    
    cancelUpload: function(){
      //alert('cancel: \n\n'+id)
        this.props.document.xhr.abort();
      this.props.dispatch(removeUploadDocument(this.props.document.Id, this.props.document.catId));
    },

    resumeUpload : function(){
            this.props.dispatch(resumeUploadToKenesto(this.props.document.Id));
       //  this.props.dispatch(resumeUploadDocument(this.props.document.Id));
    },
    renderActions: function (TouchableElement, uploadingInProgress) {
      return (
        uploadingInProgress ?
          <TouchableElement onPress={ () => { this.pauseUpload() }}>
            <View style={styles.actionContainer}>
              <Icon name="pause" style={styles.moreMenu} />
            </View>
          </TouchableElement>
          :
          <View style={styles.actions}>
            <TouchableElement onPress={ () => { this.cancelUpload() }}>
              <View style={styles.actionContainer}>
                <Icon name="close" style={styles.moreMenu} />
              </View>
            </TouchableElement>

            <TouchableElement onPress={ () => { this.resumeUpload() }}>
              <View style={styles.actionContainer}>
                <Icon name="refresh" style={styles.moreMenu} />
              </View>
            </TouchableElement>
          </View>
      )
    },

  render: function() {

   
              // * * * * * * * * DUMMY STATIC VALUES, PER DOCUMENT * * * * * * * *
          var uploadingInProgress = true;//                                  *
          var documentSize = Math.floor(Math.random()*100)//                 *
          var progress = Math.random();//                                    *
        
          var uploaded = Math.floor(documentSize * progress);//              *
          // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
          
          
          var progressBar = <View style={styles.progressBarContainer}><Progress.Bar indeterminate={true}  width={75} height={4} borderRadius={0} borderWidth={0} unfilledColor={"#e8e8e8"} color={"#3490EF"} /></View>

          var TouchableElement = TouchableHighlight;
          if (Platform.OS === 'android') {
            TouchableElement = TouchableNativeFeedback;
          }
          else{
          //  progressBar = <View style={styles.progressBarContainer}><Progress.Bar progress={this.props.document.uploadProgress} width={75} height={4} borderRadius={0} borderWidth={0} unfilledColor={"#ccc"} /></View>
          }
          
         

          
        var iconName = getIconNameFromExtension(this.props.document.fileExtension).iconName;
        var customStyle = getIconNameFromExtension(this.props.document.fileExtension).customStyle;
        var elementIcon = <View style={styles.iconFiletype}>
          { iconName === 'solidw' ? 
            <CustomIcon name={iconName} style={[styles.icon, customStyle]} />
            :
            <KenestoIcon name={iconName} style={[styles.kenestoIcon, customStyle]} />
          }
        </View>

 
    return (

      <View>  
        <TouchableElement>
          <View style={styles.row}>
            <View style={styles.iconContainer}>
              {elementIcon}
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.documentTitle} numberOfLines={1}>
                {this.props.document.Name}
              </Text>
              <View style={{ flexDirection: "row" }}>
                {this.props.document.uploadStatus == -1 ?
                  <Text style={styles.documentYear} numberOfLines={1}>
                    File Size:  {this.props.document.Size} 
                  </Text>
                  :
                  <Text style={styles.documentYear} numberOfLines={1}>
                    Upload paused
                  </Text>
                }
                 {this.props.document.uploadStatus == -1 ? progressBar: null}
              </View>
            </View>
            {this.renderActions(TouchableElement, this.props.document.uploadStatus == -1)}            
          </View>
        </TouchableElement>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  textContainer: {
    flex: 1,
    marginLeft: 7,
  },
  documentTitle: {
    //flex: 1,
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  documentYear: {
    color: '#999999',
    fontSize: 12,
  },
  row: {
    alignItems: 'center',
    backgroundColor: 'white',
    flexDirection: 'row',
    padding: 5,    
  },
  iconContainer: {
    height: 57,
    width: 57,
    alignItems: 'center',
    justifyContent: "center",
    marginLeft: 10,    
  },
  actionContainer: {
    marginHorizontal: 10
  },
  previewThumbnail: {
    height: 40,
    width: 55,
    borderWidth: 0.5,
    borderColor: "#bbb"
  },
  icon: {
    fontSize: 22,
    color: '#888',    
  },
  kenestoIcon: {
        fontSize: 22,
        color: '#888',
        marginTop: -12
    },
  iconFiletype: {
    height: 40,
    width: 55,
    alignItems: 'center',
    justifyContent: "center",
    // borderWidth: 0.5,
    // borderColor: "#999"
  },
  moreMenu: {
    fontSize: 22,
    color: '#888', 
  },
  actions: {
    flexDirection: "row"
  },
  progressBarContainer: {
    justifyContent: "center",
    marginHorizontal: 15,
  },
  
});

DocumentUploadCell.contextTypes = {
    itemMenuContext:  React.PropTypes.object,
};

export default DocumentUploadCell

//module.exports = DocumentUploadCell // connect(mapStateToProps)(DocumentUploadCell)