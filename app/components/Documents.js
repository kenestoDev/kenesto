import React, { Component } from 'react'
import {
  View,
  ScrollView,
  Text,
  TextInput,
  StyleSheet,
  TouchableHighlight,
  Dimensions,
  Image,
  ListView,
  TouchableOpacity,
  ActivityIndicatorIOS,
  Platform,
  ActivityIndicator,
  RefreshControl,
  Keyboard,
  Linking
} from 'react-native'
import { RNSKBucket } from 'react-native-swiss-knife'
import { emitToast, clearToast,updateIsProcessing, emitConfirm, updateRouteData,emitStickyConfirm, emitError, clearError } from '../actions/navActions'
import * as uiActions from '../actions/uiActions'
import ProggressBar from "../components/ProgressBar";
import Icon from 'react-native-vector-icons/MaterialIcons'
import { createIconSetFromFontello } from 'react-native-vector-icons'
import fontelloConfig from '../assets/icons/config.json';
import * as constans from '../constants/GlobalConstans'
import Button from "react-native-button";
import InteractionManager from 'InteractionManager'
import { getDownloadFileUrl, getIconNameFromMimeType, getViewerUrl, getFileUploadUrl } from '../utils/documentsUtils'
import { writeToLog } from '../utils/ObjectUtils'
import { getEnvIp } from '../utils/accessUtils'

import dismissKeyboard from 'dismissKeyboard';
import DocumentCell from '../components/DocumentCell';
import DocumentUploadCell from '../components/DocumentUploadCell';
const splitChars = '|';

import _ from "lodash";
import { fetchTableIfNeeded, refreshTable,getDocumentPermissions, getCurrentFolderPermissions,resetCurrentFolder, downloadDocument, uploadToKenesto, uploadToCurrentFolder, deleteTempFiles} from '../actions/documentsActions'
import ViewContainer from '../components/ViewContainer';
import {bytesToSize} from '../utils/KenestoHelper'
import ActionButton from 'react-native-action-button';
import * as routes from '../constants/routes'
import firebaseClient from  "./FirebaseClient";
import { getDocumentsContext, getDocumentsTitle } from '../utils/documentsUtils'
import ShareExtension from 'react-native-share-extension'
const kenestoGroup = 'group.com.kenesto.KenestoWorkouts'
class Documents extends Component {
  constructor(props) {
    super(props)
    this.documentsProps = this.props.data

    this.state = {
      isFetchingTail: false, 
      uploadItemsLength : 0,
      AllowUpload: true
      
    }

    this.onEndReached = this.onEndReached.bind(this)
    this.selectItem = this.selectItem.bind(this)
    this._onRefresh = this._onRefresh.bind(this)
    // this._onSort = this._onSort.bind(this)
  }


  getSortByName(sortBy) {
    switch (sortBy) {
      case constans.ASSET_NAME:
        return "Name"
      case constans.MODIFICATION_DATE:
        return "Modification Date"
      case constans.ASSET_TYPE:
        return "Type"
      default:
        return "";
    }
  }


 async componentWillMount() {
   
    const {dispatch, documentsReducer,navReducer} = this.props
   
    if(this.props.data.fId != '' && typeof (this.props.data.fId) != 'undefined')
    { 
        dispatch(getCurrentFolderPermissions(this.props.data.fId))
    }

       
    dispatch(fetchTableIfNeeded())
    if(Platform.OS === 'ios')
    {
      RNSKBucket.get('file', constans.KENESTO_GROUP_ID).then( (mediaInfo) =>  {  
            console.log("*********"+JSON.stringify(mediaInfo)+"***************")
                  if(!(_.isEmpty(mediaInfo)))
                  {
                    //const fileExtension =  mediaInfo.mediaName.substring(mediaInfo.mediaName.lastIndexOf("."));
                    //var mediaPath = mediaInfo.mediaPath;
                    //const url = getFileUploadUrl(this.props.env, this.props.sessionToken, mediaInfo.mediaName, "", "",  "");
                    //const fileName = mediaInfo.mediaPath.substring(mediaInfo.mediaPath.lastIndexOf('/') + 1); 
                    //dispatch(uploadToKenesto({name: mediaInfo.mediaName, uri : mediaInfo.mediaPath, type: mediaInfo.mediaMimeType, size: bytesToSize(mediaInfo.mediaSize), fileExtension: fileExtension}, url, false));
                    if(typeof (mediaInfo.mediaPath) == 'undefined' || mediaInfo.mediaPath == "undefined" || mediaInfo.mediaPath == "")
                    {
                      dispatch(emitError("Failed to import to Kenesto, please try again later"));
                    }
                    else
                    {
                      const fileExtension =  mediaInfo.mediaName.substring(mediaInfo.mediaName.lastIndexOf("."));
                      const fileName = mediaInfo.mediaPath.substring(mediaInfo.mediaPath.lastIndexOf('/') + 1); 
                      var fileObject = {name: mediaInfo.mediaName, uri : mediaInfo.mediaPath, type: mediaInfo.mediaMimeType, size: bytesToSize(mediaInfo.mediaSize), fileExtension: fileExtension}
                      dispatch(emitStickyConfirm("Import to Kenesto", "Add "+mediaInfo.mediaName+" to...", () =>{ dispatch(uploadToCurrentFolder(fileObject))},() =>{ShareExtension.deleteTempFiles(constans.KENESTO_GROUP_ID);}, true))
                    } 
                    RNSKBucket.set('file', {}, constans.KENESTO_GROUP_ID)
                  }
                });
    }
    else
    {
       
        const {intentAction, isActionSend} = await ShareExtension.getIntentAction()
        if(isActionSend)
        {
            const {mediaId ,mediaMimeType, mediaPath, mediaSize, mediaName,data} = await ShareExtension.data(kenestoGroup)
            var mediaInfo = {
            mediaId:mediaId,
            mediaMimeType:mediaMimeType,
            mediaPath:mediaPath,
            mediaSize:mediaSize,
            mediaName:mediaName
           }
         
          if(typeof (mediaPath) == 'undefined' || mediaPath == "undefined" || mediaPath == "")
          {
            if(data == 'url')
            {
                dispatch(emitError("Currently cannot share link to Kenesto"));
            }
            else
            {
                dispatch(emitError("Failed to import to Kenesto, please try again later"));
            }
            
              setTimeout(() => {
                  dispatch(clearError());
                  ShareExtension.close(kenestoGroup);
              }, 3000);
          }
          else
          {
            const fileExtension =  mediaInfo.mediaName.substring(mediaInfo.mediaName.lastIndexOf("."));
            const fileName = mediaInfo.mediaPath.substring(mediaInfo.mediaPath.lastIndexOf('/') + 1); 
            var fileObject = {name: mediaInfo.mediaName, uri : mediaInfo.mediaPath, type: mediaInfo.mediaMimeType, size: bytesToSize(mediaInfo.mediaSize), fileExtension: fileExtension}
            dispatch(emitStickyConfirm("Import to Kenesto", "Add "+mediaInfo.mediaName+" to...", () =>{ dispatch(uploadToCurrentFolder(fileObject)) 
                                                                                                      setTimeout(() => {
                                                                                                        ShareExtension.close(kenestoGroup);}, 4000) }, () =>{setTimeout(() => {
                                                                                                        ShareExtension.close(kenestoGroup);}, 1000) }, true))
          } 
         


      }
    }
  }
  
  startDownloadDocument(document: object) {
        this.props.dispatch(downloadDocument(document));
    }
  shouldComponentUpdate(nextProps, nextState){
      const {navReducer} = nextProps
      if (navReducer.routes[navReducer.index].key.indexOf('documents') == -1)
         return false; 
        return true;
  }

  componentDidUpdate(prevProps, prevState) {
    const {documentsReducer, navReducer} = this.props
      
    var  allowUpload = true;

    if (this.props.data.fId != '' && typeof (this.props.data.fId) != 'undefined' &&   documentsReducer.currentFolder != null)
        allowUpload = documentsReducer.currentFolder.permissions.AllowUpload;
  if (allowUpload != this.state.AllowUpload)
      this.setState({AllowUpload : allowUpload});

    var documentlist = getDocumentsContext(navReducer);
    this._showStatusBar()
    if (documentlist.catId in documentsReducer) {

    if(documentsReducer[documentlist.catId].uploadItems.length > this.state.uploadItemsLength)
    {   
          let ds = new ListView.DataSource({
          rowHasChanged: (r1, r2) => {
            r1["Id"] !== r2["Id"] || r1["uploadStatus"] !== r2["uploadStatus"] || r1["IsUploading"] !== r2["IsUploading"]
          }
        })
        let dataSource = documentlist.catId in documentsReducer ? documentsReducer[documentlist.catId].dataSource : ds.cloneWithRows([]);
        if (dataSource.getSectionLengths(0) != '' && !documentlist.isSearch) {
               this.scrollToTop(); 
              this.setState({ uploadItemsLength :documentsReducer[documentlist.catId].uploadItems.length})
             
              
        }

    }

    }
  }

  onEndReached() {
    const {dispatch} = this.props
    dispatch(fetchTableIfNeeded())
  }


  selectItem(document) {
    const {dispatch, navReducer} = this.props
    var documentlist = getDocumentsContext(navReducer);
    if (document.FamilyCode == 'UPLOAD_PROGRESS')
      return false;
    else if (document.FamilyCode == 'FOLDER') {
      var newId;
      var newName = document.Name;
      var fId = document.Id;
      if (documentlist.catId.indexOf(splitChars) >= 0) {
        var dtlStr = documentlist.catId.split(splitChars);
        var newId = `${dtlStr[0]}${splitChars}${document.Id}`//i.e all_docuemnts|{folderID}
      }
      else {
        var newId = `${documentlist.catId}${splitChars}${document.Id}`
      }

      var data = {
        key: "documents|" + fId,
        name: newName,
        catId: newId,
        fId: fId,
        sortDirection: constans.ASCENDING,
        sortBy: constans.ASSET_NAME, 
        isVault: document.IsVault, 
        isSearch: false
      }
      this.props._handleNavigate(routes.documentsRoute(data));
    }
    else {
      if (document.FileExtension === ".zip" || document.FileExtension ===".rar" || document.FileExtension ===".7z" || document.FileExtension ===".gz")
      {
        this.startDownloadDocument(document);
      }
      else
      {
        var data = {
          key: "document",
          name: document.Name,
          documentId: document.Id,
          SharedObjectId:document.SharedObjectId,
          ExternalToken: document.ExternalToken,
          familyCode: document.FamilyCode,
          catId: documentlist.catId,
          fId: documentlist.fId,
          viewerUrl: getViewerUrl(this.props.env, document, this.props.navReducer.orientation),
          isExternalLink: document.IsExternalLink,
          externalLinkType: document.ExternalLinkType,
          isVault: document.IsVault,
          ThumbnailUrl: document.ThumbnailUrl,
          fileExtension: document.FileExtension,
          chekcedOutBy: document.ChceckedOutBy,
          env: this.props.env,
          dispatch: this.props.dispatch
        }
        //this.props._handleNavigate(routes.documentRoute(data));
         Linking.openURL(getViewerUrl(this.props.env, document, this.props.navReducer.orientation)).catch(err => console.error('An error occurred', err));
      }

    }
    Keyboard.dismiss();
  }

  onSearchChange(event) {
    var filter = event.nativeEvent.text.toLowerCase();

    this.clearTimeout(this.timeoutID);
    this.timeoutID = this.setTimeout(() => this.searchDocuments(filter), 100);
  }

  renderSeparator(
    sectionID,
    rowID,
    adjacentRowHighlighted
  ) {
    var style = styles.rowSeparator;
    if (adjacentRowHighlighted) {
      style = [style, styles.rowSeparatorHide];
    }
    return (
      <View key={'SEP_' + sectionID + '_' + rowID} style={style} />
    );
  }



  _onRefresh(type, message) {
    const {dispatch, navReducer} = this.props
    var documentlist = getDocumentsContext(navReducer);
    dispatch(refreshTable(documentlist, false))
  }

  // _onSort(sortDirection, sortBy) {
  //   const {dispatch} = this.props
  //   var documentlist = getDocumentsContext(this.props);
  //   documentlist.sortDirection = sortDirection;
  //   documentlist.sortBy;
  //   dispatch(refreshTable(documentlist));
  // }

  _renderSectionHeader(sectionData, sectionID) {

    return (
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionLabel}>{sectionData}</Text>
      </View>
    )
  }

  _showStatusBar() {
    const {documentsReducer, navReducer} = this.props
    var documentlist = getDocumentsContext(navReducer);
    const hasError = documentlist.catId in documentsReducer ? documentsReducer[documentlist.catId].hasError : false;
    const errorMessage = documentlist.catId in documentsReducer ? documentsReducer[documentlist.catId].errorMessage : "";
    if (hasError && this.refs.masterView != undefined) {
      //this.refs.masterView.showMessage("success", errorMessage);
      this.props.dispatch(emitToast(constans.ERROR, "Error loading documents list"));
      this.peops.dispatch(clearToast());
    }
  }


  openModal() {

    if (!this.props.isConnected){
        this.props.dispatch(emitToast("info", "No internet connection")); 
        return false;
    }
    if (!this.state.AllowUpload)
      return false; 

    this.context.plusMenuContext.open();
    this.props.dispatch(uiActions.setOpenModalRef('modalPlusMenu'))
  }

  scrollToTop() {
    const {documentsReducer, navReducer} = this.props
    var documentlist = getDocumentsContext(navReducer);
    if (documentsReducer[documentlist.catId].uploadItems.length > 0) {
      var uploadingScrollPosition = documentsReducer[documentlist.catId].uploadItems.length > 3 ? (documentsReducer[documentlist.catId].uploadItems.length - 1) * 67 + 52 : 0;
      this.refs.listview.scrollTo({ y: uploadingScrollPosition })
    }

  }

  scrollToItem(id) {
    const {documentsReducer, navReducer, dispatch} = this.props;
    var documentlist = getDocumentsContext(navReducer);
    try {
      const documents = documentsReducer[documentlist.catId].items;
      const document = documents.find(d => (d.Id === id));
      if (typeof (document) != 'undefined') {

        const index = documents.indexOf(document);
        const sectionHeaderHeights = index > 0 && documents[0].FamilyCode != document.FamilyCode ? 104 : 52
        const position = index * 67 + sectionHeaderHeights;
        this.refs.listview.scrollTo({ y: position });
      }

    }
    catch (err) {
      writeToLog("", constans.ERROR, `function scrollToItem - Failed! `, err)
    }

  }


  _renderTableContent(isFetching) {

    const {documentsReducer, navReducer} = this.props
    var documentlist = getDocumentsContext(navReducer);
    let ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => {
        r1["Id"] !== r2["Id"] || r1["uploadStatus"] !== r2["uploadStatus"] || r1["IsUploading"] !== r2["IsUploading"]
      }
    })
 
    let dataSource = documentlist.catId in documentsReducer ? documentsReducer[documentlist.catId].dataSource : ds.cloneWithRows([]);
   
    if (typeof dataSource.getSectionLengths == 'undefined' || dataSource.getSectionLengths(0) == '' || dataSource.getSectionLengths(0) == 0) {
      return (<NoDocuments
        filter={this.state.filter}
        isFetching={isFetching}
        onRefresh={this._onRefresh.bind(this)}
        documentlist={documentlist} />)
    }
    else {
      return (
        <ListView
          ref="listview"
          refreshControl={
            <RefreshControl
              refreshing={isFetching}
              onRefresh={this._onRefresh.bind(this)}
              />
          }
          enableEmptySections={true}
          renderSeparator={this.renderSeparator}
          dataSource={dataSource}
          renderSectionHeader={this._renderSectionHeader.bind(this)}
          renderRow={(document, sectionID, rowID, highlightRowFunc) => {

            //alert('documents ' + this.props.isConnected)

            var documentCell = document.FamilyCode == 'UPLOAD_PROGRESS' ? <DocumentUploadCell
              key={document.Id}
              onSelect={this.selectItem.bind(this, document)}
              dispatch={this.props.dispatch}
              document={document} documentsReducer={this.props.documentsReducer} /> :
              <DocumentCell
                key={document.Id}
                onSelect={this.selectItem.bind(this, document)}
                isConnected={this.props.isConnected}
                dispatch={this.props.dispatch}
                documentsReducer={this.props.documentsReducer}
                document={document} />

            return (documentCell)
          } }
          renderFooter={() => {
            return <View style={{ height: 100 }}>


            </View>
          } }
          onEndReached={this.onEndReached}
          automaticallyAdjustContentInsets={false}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="always"
          showsVerticalScrollIndicator={false}
          stickySectionHeaderEnabled={false}
          />

      )
    }
  }

  // showToolBar(){
  //   alert(this.context.toolBar)
  //  // this.context.toolBar.fadeInDown();
  // }
  


  render() {
   
    try {
      const {dispatch, documentsReducer, navReducer } = this.props
      var documentlist = getDocumentsContext(navReducer);
      //const isFetching = documentlist.catId in documentsReducer ? documentsReducer[documentlist.catId].isFetching : false
      const isFetching = documentsReducer.isFetching;
      const isFetchingFolder = documentsReducer.isFetchingCurrentFolderPermissions;
      var additionalStyle = {};
      let showCustomButton = documentlist.isSearch ? false : true
      const buttonColor = this.state.AllowUpload ? "#FF811B" : "#d3d3d3"
      return (

        <ViewContainer ref="masterView" style={[styles.container, additionalStyle]}>
          {this._renderTableContent(isFetching || isFetchingFolder)}
          
          {showCustomButton ? <ActionButton style={ {opacity : 0.1} }  buttonColor={buttonColor} onPress={() => this.openModal()} >
          </ActionButton> : <View></View>}

        </ViewContainer>
      )
    } catch (error) {
      return null;
    }

  }

}


var NoDocuments = React.createClass({
  render: function () {
    var text = 'No documents found';
    if (this.props.isFetching) {
      return (
        <View style={[styles.container, styles.centerText]}>
          <View style={styles.textContainer}>
            <Text>Please wait...</Text>
            <ProggressBar isLoading={true} />
          </View>
        </View>)
    }
    else {
      if (this.props.documentlist.isSearch) {
        return (
          <View style={[styles.container, styles.centerText]}>
            <View style={styles.textContainer}>
              <Text style={styles.noDocumentsText}>{text}</Text>
            </View>
          </View>
        );
      }
      else {
        return (
          <View style={[styles.container, styles.centerText]}>
            <View style={styles.textContainer}>
              <Text style={styles.noDocumentsText}>{text}</Text>
            </View>
            <View style={styles.buttonContainer}>
              <Button onPress={this.props.onRefresh} containerStyle={styles.singleBtnContainer} style={styles.button}>Refresh</Button>
            </View>
          </View>
        );
      }

    }
  }
});




var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6F8',
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
  },
  buttonContainer: {
    flex: 1,
  },
  centerText: {
    alignItems: 'center',
  },
  noDocumentsText: {
    color: '#888888',
    fontSize: 16
  },
  separator: {
    height: 1,
    backgroundColor: '#fff',
  },
  rowSeparator: {
    backgroundColor: "#eee",
    height: 1,
  },
  rowSeparatorHide: {
    opacity: 0.0,
  },
  actionButtonIcon: {
    fontSize: 24,
    height: 22,
    color: 'white',
  },
  arrowButtonIcon: {
    fontSize: 20,
    height: 22,
    color: '#2f2f2f',
  },
  sectionHeader: {
    padding: 15,
    paddingLeft: 20,
    backgroundColor: '#F5F6F8',
    alignSelf: 'stretch',
  },
  sortContainer: {
    padding: 0,
    backgroundColor: '#eeeeee',
    flex: 0,
    flexDirection: "row-reverse",
  },
  sectionLabel: {
    color: '#2f2f2f',
    textAlign: 'left'
  },
  singleBtnContainer: {
    width: 140,
    marginTop: 15,
    justifyContent: "center",
    height: 50,
    backgroundColor: "#F5F6F8",
    
    ...Platform.select({
            ios:{
                    borderRadius: 10,
                    //padding: 10,
                    shadowColor: '#000000',
                    shadowOffset: {
                    width: 0,
                    height: 3 },
                        shadowRadius: 10,
                        shadowOpacity: 0.25
                    },
                    android:{
                        borderWidth: 0.5,
                        borderColor: "#BEBDBD",
                    }
            }),
  },
  button: {
    color: "#666666",
    fontWeight: "normal",
    fontSize: 18,
  },
   buttonFCM: {
    backgroundColor: "teal",
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginVertical: 15,
    borderRadius: 10
  },
  buttonTextFCM: {
    color: "white",
    backgroundColor: "transparent"
  },
});

Documents.contextTypes = {
  plusMenuContext: React.PropTypes.object,
  toolBar: React.PropTypes.object
};

export default Documents
