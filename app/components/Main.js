import React from 'react'
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ToolbarAndroid,
  TouchableWithoutFeedback,
  TouchableOpacity,
  AppState,
  Animated,
  DeviceEventEmitter,
  NativeModules,
  Platform
} from 'react-native'

import { RNSKBucket } from 'react-native-swiss-knife'
import NavigationRootContainer from '../containers/navRootContainer'
import PlusMenu from './PlusMenu'
import ItemMenu from './ItemMenu'
import Modal from 'react-native-modalbox';
import Icon from 'react-native-vector-icons/MaterialIcons'
import CreateFolder from './CreateFolder'
import EditDocument from './EditDocument'
import EditFolder from './EditFolder'
import UpdateVersions from './UpdateVersions'
import Processing from './Processing'
import {connect} from 'react-redux'
import KenestoToolbar from './KenestoToolbar'
import * as documentsActions from '../actions/documentsActions'
import * as uiActions from '../actions/uiActions'
import * as accessActions from '../actions/Access'
import _ from 'lodash'
import {pop, updateRouteData, clearToast,updatedOrientation, navigateReset, navigateJumpToKey, clearConfirm, clearError} from '../actions/navActions'
import * as constans from '../constants/GlobalConstans'
import {getDocumentsContext, getFileUploadUrl, getDocumentsTitle} from '../utils/documentsUtils'
import Error from './Error'
import Toast from './Toast'
import Info from './Info'
import Confirm from './Confirm'
import StickyConfirm from './StickyConfirm'
import CheckInDocument from './CheckInDocument'
import { writeToLog } from '../utils/ObjectUtils'
import * as Animatable from 'react-native-animatable';
import {config} from '../utils/app.config'
import NetInfoManager from './NetInfoManager'
import PushController from './PushController';
import  stricturiEncode  from 'strict-uri-encode';
import {bytesToSize} from '../utils/KenestoHelper'
const kenestoGroup = 'group.com.kenesto.KenestoWorkouts'
// var AssetsPicker = NativeModules.AssetsPicker; 
//import PubNub from 'pubnub'
//import PushController from './PushController';
//import PushNotification from 'react-native-push-notification';
//import OneSignal from 'react-native-onesignal';
import msBar from 'react-native-message-bar';
var MessageBarAlert = msBar.MessageBar ; 
import DropDownOptions from './DropDownOptions';
var Orientation = NativeModules.Orientation;
import Dimensions from 'Dimensions';
var { width, height } = Dimensions.get('window');

let styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  topModal: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop:20
  },
  plusMenu: {
    height: 150
  },
  itemMenu: {
    height: 235
  },
  error: {
    height: 280,
    width: 320
  },
  toast: {
    height: 50,
  },
  stickyConfirm: {
    height: 140,
    borderTopWidth: 1.5,
    borderColor: "#FA8302",
    
  },
  createFolder: {
    height: 280,
    width: 320
  },
  ifProcessing: {
    height: 90,
    width: 320,
    justifyContent: 'center',
    alignItems: 'center',
  },
  processingModal: {
    height: 90,
    width: 320,
    justifyContent: 'center',
    alignItems: 'center',
  },
  updateVersionsModal: {
    height: 90,
    width: 320,
    justifyContent: 'center',
    alignItems: 'center',
  },
  popupMenuContainer: {
    position: "absolute",
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  },
  toolbarContainer:{
      backgroundColor: "#fff",
      height: 50,
      opacity: 1
  },
  popupMenu: {
    flex: 1,
    alignItems: "flex-end",
  },
  popupMenuContent: {
    borderWidth: 1,
    borderColor: "#999",
    backgroundColor: "#fff",
    marginTop: 40,
    marginRight: 40,
    width: 170,
  },
  optionContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  inactiveOption: {
    color: "#ccc",
  },
  activeOption: {
    color: "#000",
  },
  iconStyle: {
    fontSize: 22,
    color: "#000",
    textAlign: "center",
    textAlignVertical: "center",
    marginRight: 15,
  },
  disabledIcon: {
    color: "#ccc"
  },
  toast2: {
    height: 60, 
    position: 'absolute',
    left: 0, 
    bottom: 0, 
    right: 0, 
    justifyContent:  'center'
  },
  toastMessage: { 
     color: 'white',  
     fontSize:16, 
     fontWeight: 'bold',
     textAlign: "center"
  }
})

class Main extends React.Component {



  getChildContext() {

    return {
      plusMenuContext: this.refs.modalPlusMenu,
      itemMenuContext: this.refs.modalItemMenu,
      errorModal: this.refs.errorModal,
      dropDownContext: this.refs.dropDownOptionsContainer, 
      toolBar: this.refs.toolBar, 
      kToolbar: this.refs.kToolbar
    };
  }

  constructor(props) {
    super(props)

        this.state = {
       //   ifCreatingFolder: false,
          openedDialogModalref: '',
          isPopupMenuOpen: false,
          isDropDownOpen: true,
          // toastMessage: '',
          toastType: '' ,
          
          modalShown: false,
          toastColor: '#333',
          toastMessage: '', 
          token: '',         
        };
         this.onActionSelected = this.onActionSelected.bind(this);
         this.onPressPopupMenu = this.onPressPopupMenu.bind(this);
        
         this.animatedValue = new Animated.Value(60);
        const {dispatch} = this.props

  }

  onPressPopupMenu() {
    this.props.dispatch(uiActions.setPopupMenuState(true));
    this.setState({
      isPopupMenuOpen: true
    })
  }

  hidePopupMenu() {
    this.props.dispatch(uiActions.setPopupMenuState(false));
    this.setState({
      isPopupMenuOpen: false
    });
  }

  onActionSelected(position, value) {
    const {dispatch, navReducer} = this.props
    switch (position) {
      case 0:
        // this.refs.modalPlusMenu.open();
        break;
      case 1:
        if (navReducer.index > 1) {
          dispatch(pop())
        }
        break;
      case 2:
        this.onSortDirection();
        break;
      case 3:
        this.onSortBy(value);
        break;
      case 4:
         dispatch(pop())
        break;
      default:
        break;
    }
  }
  onSortBy(sortBy) { 
    const {dispatch, navReducer} = this.props
    var currRouteData = getDocumentsContext(navReducer);
    var routeData =
      {
        name: currRouteData.name,
        catId: currRouteData.catId,
        fId: currRouteData.fId,
        sortDirection: currRouteData.sortDirection,
        sortBy: sortBy
      }
    dispatch(documentsActions.refreshTable(routeData, true));
    this.hidePopupMenu();
  }

  onSortDirection() {
    const {dispatch, navReducer} = this.props
    var currRouteData = getDocumentsContext(navReducer);
    var sortDirection = currRouteData.sortDirection == constans.ASCENDING ? constans.DESCENDING : constans.ASCENDING;
    var routeData =
      {
        name: currRouteData.name,
        catId: currRouteData.catId,
        fId: currRouteData.fId,
        sortDirection: sortDirection,
        sortBy: currRouteData.sortBy
      }

    dispatch(documentsActions.refreshTable(routeData, true));
  }

  closeModal(ref: string) {
 if (typeof this.refs[ref] != 'undefined')
      this.refs[ref].close();
  }


  openModal(ref: string) {
    this.refs[ref].open();
  }

  onNavIconClicked() {
    this.context.drawer.open();
  }

  closeDrawer() {
    return this.props.closeDrawer();
    
  }

  closeMenuModal() {
    this.refs.modalPlusMenu.close();
  }

  closeItemMenuModal() {
    this.refs.modalItemMenu.close();
  }

  isItemMenuModalOpen() {
    return this.refs.modalItemMenu.state.isOpen;
  }

  isMenuModalOpen() {
    return this.refs.modalPlusMenu.state.isOpen;
     
  }

  openMenuModal() {
    this.refs.modalPlusMenu.open();
  }


  openCheckInModal()
  {
    this.openModal("checkInModal");
  }

  openEditFolderModal()
  {
    this.openModal("editFolderModal");
    
  }

  openEditDocumentModal()
  {
    this.openModal("editDocumentModal");
  }

  openUpdateVersionsModal()
  {
    this.openModal("updateVersionsModal");
  }

  isSearch(){
       var currContext = getDocumentsContext(this.props.navReducer);
       return currContext.isSearch;
  }

  openedDialogModalref(){
    return this.state.openedDialogModalref;
  }

  
  openCreateFolder() {
    this.refs.CreateFolder.open();

  }

  closeCreateFolder() {
    this.refs.CreateFolder.close();
  }


  // setProcessingStyle() {
  //   this.setState({ ifCreatingFolder: true })

  // }

  componentWillReceiveProps(nextprops) {
   
    if(nextprops.isActionSend && this.props.isActionSend != nextprops.isActionSend)
    {
       nextprops.dispatch(accessActions.updateActionType(nextprops.isActionSend))
    }

    if(nextprops.documentsReducer.selectedObject){
      var permissions = nextprops.documentsReducer.selectedObject.permissions;
      var itemMenuPermissions = ['AllowShare', 'IsOwnedByRequestor', 'AllowUpdateVersions', 'AllowCheckin', 'AllowCheckout', 'AllowDiscardCheckout'];
      var visibleActions = 0;
      for (var i = 0; i < 6; i++) {
        permissions[itemMenuPermissions[i]] == true && visibleActions++;
      }
      if (permissions['IsOwnedByRequestor'] == true) visibleActions++;
      this.setState({ visibleActions: visibleActions })

    }
    
    if (nextprops.navReducer.isProcessing) {
      this.openModal("processingModal");
    }
    else 
    {
      this.closeModal("processingModal")
    }

    if (nextprops.navReducer.HasError) {
      this.openModal("errorModal");
    }
    if (nextprops.navReducer.HasInfo) {
      this.openModal("infoModal");
    }
    
    if(nextprops.navReducer.HasConfirm != this.props.navReducer.HasConfirm)
    {
      if (nextprops.navReducer.HasConfirm ) {
          this.openModal("confirmModal");    
      }
      else{
          this.closeModal("confirmModal");
        }
        
      }

      if(nextprops.navReducer.HasStickyConfirm != this.props.navReducer.HasStickyConfirm)
        {
          if (nextprops.navReducer.HasStickyConfirm ) {
            this.openModal("stickyConfirmModal");
          }
          else{
            this.closeModal("stickyConfirmModal");
          }
        }
  
    if (nextprops.navReducer.HasToast)
    {
      // this.setState({
      //   toastType: nextprops.navReducer.GlobalToastType,
      //   toastMessage: nextprops.navReducer.GlobalToastMessage
      // })
this.callToast2(nextprops.navReducer.GlobalToastMessage, nextprops.navReducer.GlobalToastType)
    //   this.openModal("toastModal")
    // //   setTimeout(()=> this.openModal("toastModal"), 2000)
    //   setTimeout(this.closeToast.bind(this), 4000)

      this.props.dispatch(clearToast());
    }
   

  }
  
  closeToast(){
    this.refs.toastModal.close();
  }
  
  handleAppStateChange(nextAppState) {
     if (nextAppState === 'active') {
       if(Platform.OS === 'ios')
       {
        RNSKBucket.get('file', constans.KENESTO_GROUP_ID).then( (mediaInfo) =>  {  
          console.log("*********"+JSON.stringify(mediaInfo)+"***************")
                if(!(_.isEmpty(mediaInfo)))
                {
                  var documentlist = getDocumentsContext(this.props.navReducer);
                  if(_.isEmpty(documentlist))
                  {
                    return;
                  }
                  const fileExtension =  mediaInfo.mediaName.substring(mediaInfo.mediaName.lastIndexOf("."));
                  var mediaPath = mediaInfo.mediaPath;
                  const url = getFileUploadUrl(this.props.env, this.props.sessionToken, mediaInfo.mediaName, "", "",  "");
                  const fileName = mediaInfo.mediaPath.substring(mediaInfo.mediaPath.lastIndexOf('/') + 1); 
                 
                  if(documentlist.catId != constans.MY_DOCUMENTS)
                  {
                    var routeData =
                    {
                        name: getDocumentsTitle(constans.MY_DOCUMENTS),
                        catId: constans.MY_DOCUMENTS,
                        fId: "",
                        sortDirection: constans.ASCENDING,
                        sortBy: constans.ASSET_NAME,
                        keyboard:"",
                        isSearch: false, 
                        isVault: false
                    }
                     this.props.dispatch(updateRouteData(routeData));
                  }
                  this.props.dispatch(documentsActions.uploadToKenesto({name: mediaInfo.mediaName, uri : mediaInfo.mediaPath, type: mediaInfo.mediaMimeType, size: bytesToSize(mediaInfo.mediaSize), fileExtension: fileExtension}, url, false));
                  RNSKBucket.set('file', {}, constans.KENESTO_GROUP_ID)
                }
              })
        }
        else
        {
          // this.props.dispatch(clearConfirm());
          // this.props.dispatch(clearToast());
          // this.props.dispatch(clearError());
        }
    }

      // if (nextAppState === 'background') {
      //   let date = new Date(Date.now() + (5000));

      //   if (Platform.OS === 'ios') {
      //     date = date.toISOString();
      //   }

      //   PushNotification.localNotificationSchedule({
      //     message: "My Notification Message",
      //     date,
      //   });
      // }
    }





  componentDidMount() {
  //  Orientation.addOrientationListener(this._orientationDidChange.bind(this));
    DeviceEventEmitter.addListener('orientationDidChange', () => { this._orientationDidChange})
    AppState.addEventListener('change', (nextAppState) => {this.handleAppStateChange(nextAppState)});
    // OneSignal.configure({});
   // AppState.addEventListener('change', this.handleAppStateChange);
    // MessageBarManager.registerMessageBar(this.refs.alert);

  //    AssetsPicker.PickAsset(null).then(mediaInfo =>{

  //             alert(JSON.stringify(mediaInfo));
  //               // const fileName = fPath.substring(fPath.lastIndexOf("/") + 1);

  //               // const fileExtension =  fPath.substring(fPath.lastIndexOf("."));

  //               // this.setState({
  //               //     file: { name: fileName, path: fPath, type: file.mime, size: bytesToSize(file.size), extension: fileExtension},
  //               // });

  //               // this.upload();
  //               // }
            
  //         })


   }

  componentWillUnmount(){
      DeviceEventEmitter.removeListener('orientationDidChange');
      AppState.removeEventListener('change', this.handleAppStateChange);
  }

  _orientationDidChange(orientation) {
    var o =  orientation == 'LANDSCAPE' ? 'LANDSCAPE' : 'PORTRAIT';
    this.props.dispatch(updatedOrientation(o));
  }

  
  showToolBar(){
    this.refs.toolBar.fadeInDown(0);
  }
  
  hideToolBar(){
    this.refs.toolBar.fadeOutUp(0);
  }

  hideSearchBox(){
      this.refs.kToolbar.hideSearchBox();
  }

  setClosedModal(){
    this.props.dispatch(uiActions.setOpenModalRef(''))
  }

  setOpenedModal(ref : string){
    this.props.dispatch(uiActions.setOpenModalRef(ref))
  }
  
  callToast2(message, type) {
    if (this.state.modalShown) return;
    this.setToastType(message, type);
    this.setState({ modalShown: true })
    Animated.timing(
      this.animatedValue,
      { 
        toValue: 0,
        duration: 550
      }).start(this.closeToast2())
  }
  
  closeToast2() {
    setTimeout(() => {
      this.setState({ modalShown: false });
      Animated.timing(
        this.animatedValue,
        {
          toValue: 60,
          duration: 350
        }).start()
    }, 3000)
  }
  
  setToastType(toastMessage, type) {
    let color;
    if (type == 'Error') color = '#f00';
    if (type == 'Info') color = '#333';
    if (type == 'warning') color = '#ec971f';
    if (type == 'success') color = '#3290F1';
    this.setState({ toastColor: color, toastMessage: toastMessage });
  }

  render() {
    
    const {navReducer} = this.props
    var BContent = <Text style={styles.text}>error message</Text>
    //var modalStyle = this.state.ifCreatingFolder ? styles.ifProcessing : [styles.modal, styles.createFolder]
   var modalStyle =  [styles.topModal, styles.createFolder]; 
    var showPopupMenu = this.state.isPopupMenuOpen;
  
    var documentlist = getDocumentsContext(navReducer);
    // var toolbarStyle = navReducer.routes[navReducer.index].key === 'document' ? styles.toolbarContainer : null;
    const sortBy = documentlist.sortBy;
    var toolBarHeight = (Platform.OS === 'ios')? 65 : 50;
    return (
      <View style={styles.container}>
          <Animatable.View ref={"toolBar"} easing="ease-in-out-cubic" style={[styles.toolbarContainer, { height: toolBarHeight }]} duration={600}> 
            <KenestoToolbar ref={"kToolbar"}
              onActionSelected={this.onActionSelected}
              onPressPopupMenu={this.onPressPopupMenu}
              onIconClicked = {this.onNavIconClicked.bind(this) }
              navReducer={this.props.navReducer}
              documentsReducer = {this.props.documentsReducer}
              isPopupMenuOpen={this.state.isPopupMenuOpen}
              dispatch={this.props.dispatch}
              isConnected ={this.props.isConnected}
              />
          </Animatable.View>


        <NavigationRootContainer closeItemMenuModal ={this.closeItemMenuModal.bind(this) }  dispatch={this.props.dispatch.bind(this)}  hideSearchBox ={this.hideSearchBox.bind(this)} hidePopupMenu ={this.hidePopupMenu.bind(this)} 
         closeDrawer ={this.closeDrawer.bind(this) } closeMenuModal={this.closeMenuModal.bind(this)} openedDialogModalref = {() => this.openedDialogModalref()} 
         closeModal={this.closeModal.bind(this) } openModal={this.openModal.bind(this) } />
         <Modal style= {styles.processingModal} position={"center"}  ref={"processingModal"} isDisabled={false} animationDuration={0} backdropPressToClose={false}>
          <Processing  closeModal = {() => this.closeModal("processingModal") }  openModal = {() => this.openModal("processingModal")}  />
        </Modal>
        <Modal style={[styles.modal, styles.plusMenu]} position={"bottom"}  ref={"modalPlusMenu"} isDisabled={false} onClosed={()=> {this.setClosedModal()}} onOpened={()=> {this.setOpenedModal('modalPlusMenu')}}>
          <PlusMenu closeMenuModal = {this.closeMenuModal.bind(this) }
            openCreateFolder = {this.openCreateFolder.bind(this) }  createError={() => this.openModal("errorModal") }
            closeCreateFolder={this.closeCreateFolder.bind(this) }/>
        </Modal>
        <Modal style={[styles.modal, styles.itemMenu, this.state.visibleActions>3&&{height: 250}]} position={"bottom"}  ref={"modalItemMenu"} isDisabled={false} onClosed={()=> {this.setClosedModal()}} onOpened={()=> {this.setOpenedModal('modalItemMenu')}}>
          <ItemMenu closeItemMenuModal = {this.closeItemMenuModal.bind(this) }
             createError={() => this.openModal("errorModal") }
            closeCreateFolder={this.closeCreateFolder.bind(this) } openUpdateVersionsModal={this.openUpdateVersionsModal.bind(this) } openCheckInModal={this.openCheckInModal.bind(this) } openEditDocumentModal={this.openEditDocumentModal.bind(this) } openEditFolderModal={this.openEditFolderModal.bind(this)}/>
        </Modal>
        <Modal style= {modalStyle} position={"top"}  ref={"CreateFolder"} isDisabled={false} onClosed={()=> {this.setClosedModal()}} onOpened={()=> {this.setOpenedModal('CreateFolder')}}>
          <CreateFolder closeMenuModal = {this.closeMenuModal.bind(this) } openMenuModal = {this.closeCreateFolder.bind(this) }
            closeCreateFolder={this.closeCreateFolder.bind(this)} openProcessingModal={() => this.openModal("processingModal")} 
            closeProcessingModal={() => this.closeModal("processingModal") }
            />
        </Modal>
        <Modal style= {modalStyle} position={"top"}  ref={"checkInModal"} isDisabled={false} onClosed={()=> {this.setClosedModal()}} onOpened={()=> {this.setOpenedModal('checkInModal')}}>
          <CheckInDocument closeModal = {() => this.closeModal("checkInModal") } openModal = {() => this.openModal("checkInModal") }/>
        </Modal>
        <Modal style= {modalStyle} position={"top"}  ref={"editFolderModal"} isDisabled={false} onClosed={()=> {this.setClosedModal()}} onOpened={()=> {this.setOpenedModal('editFolderModal')}}>
          <EditFolder closeModal = {() => this.closeModal("editFolderModal") } openModal = {() => this.openModal("editFolderModal") }/>
        </Modal>
        <Modal style= {modalStyle} position={"top"}  ref={"editDocumentModal"} isDisabled={false} onClosed={()=> {this.setClosedModal()}} onOpened={()=> {this.setOpenedModal('editDocumentModal')}}>
          <EditDocument closeModal = {() => this.closeModal("editDocumentModal") } openModal = {() => this.openModal("editDocumentModal") }/>
        </Modal>
        <Modal style= {styles.updateVersionsModal} position={"center"}  ref={"updateVersionsModal"} isDisabled={false} onClosed={()=> {this.setClosedModal()}} onOpened={()=> {this.setOpenedModal('updateVersionsModal')}}>
          <UpdateVersions closeModal = {() => this.closeModal("updateVersionsModal") } openModal = {() => this.openModal("updateVersionsModal") }/>
        </Modal>
       
        <Modal style={[styles.modal, styles.error]} position={"center"}  ref={"errorModal"} isDisabled={false} onClosed={()=> {this.setClosedModal()}} onOpened={()=> {this.setOpenedModal('errorModal')}}>
          <Error closeModal = {() => this.closeModal("errorModal") } openModal = {() => this.openModal("errorModal") }/>
        </Modal>
        <Modal style={[styles.modal, styles.error]} position={"center"}  ref={"infoModal"} isDisabled={false} onClosed={()=> {this.setClosedModal()}} onOpened={()=> {this.setOpenedModal('infoModal')}}>
          <Info closeModal = {() => this.closeModal("infoModal") } openModal = {() => this.openModal("infoModal") }/>
        </Modal>
        <Modal style={[styles.modal, styles.error]} position={"center"}  ref={"confirmModal"} isDisabled={false} onClosed={()=> {this.setClosedModal()}} onOpened={()=> {this.setOpenedModal('confirmModal')}}>
          <Confirm closeModal = {() => this.closeModal("confirmModal") } openModal = {() => this.openModal("confirmModal") }/>
        </Modal>
        <Modal style={[styles.modal, styles.stickyConfirm]} position={"bottom"} entry ={"bottom"} swipeToClose={false} ref={"stickyConfirmModal"} isDisabled={false} backdrop={false}>
          <StickyConfirm closeModal = {() => this.closeModal("stickyConfirmModal") } openModal = {() => this.openModal("stickyConfirmModal") }/>
        </Modal>
        <Modal style={[styles.modal, styles.toast]} position={"bottom"}  ref={"toastModal"} isDisabled={false} backdrop={false}>
          <Toast closeModal = {() => this.closeModal("toastModal") } openModal = {() => this.openModal("toastModal")} toastType={this.state.toastType} toastMessage={this.state.toastMessage} />
        </Modal>
        <Animated.View  style={[styles.toast2, { transform: [{ translateY: this.animatedValue }], backgroundColor: this.state.toastColor}]}>
          <Text style={styles.toastMessage}>
            { this.state.toastMessage }
          </Text>
        </Animated.View>
        {showPopupMenu ?
          <View style={styles.popupMenuContainer}>
            <TouchableWithoutFeedback onPress={this.hidePopupMenu.bind(this) } >
              <View style={styles.popupMenu}>
                <View style={styles.popupMenuContent}>

                  <View>
                    <TouchableWithoutFeedback onPress={(value) => this.onSortBy(constans.ASSET_NAME) } disabled={sortBy == constans.ASSET_NAME}>
                      <View style={styles.optionContainer}>
                        <Icon name="sort-by-alpha" style={[styles.iconStyle, sortBy != constans.ASSET_NAME ? {} : styles.disabledIcon]} />
                        <Text style={sortBy != constans.ASSET_NAME ? styles.activeOption : styles.inactiveOption}>Sort by Name</Text>
                      </View>
                    </TouchableWithoutFeedback>
                  </View>

                  <View>
                    <TouchableWithoutFeedback onPress={(value) => this.onSortBy(constans.MODIFICATION_DATE) } disabled={sortBy == constans.MODIFICATION_DATE}>
                      <View style={styles.optionContainer}>
                        <Icon name="date-range" style={[styles.iconStyle, sortBy != constans.MODIFICATION_DATE ? {} : styles.disabledIcon]} />
                        <Text style={sortBy != constans.MODIFICATION_DATE ? styles.activeOption : styles.inactiveOption}>Sort by Date</Text>
                      </View>
                    </TouchableWithoutFeedback>
                  </View>

                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
          :
          <View></View>
        }
    
      <MessageBarAlert ref="alert" />
      <DropDownOptions ref={"dropDownOptionsContainer"} />
      <NetInfoManager dispatch={this.props.dispatch} />
        
      </View>
    )
  }
}


Main.childContextTypes = {
  plusMenuContext: React.PropTypes.object,
  itemMenuContext: React.PropTypes.object,
  errorModal: React.PropTypes.object,
  dropDownContext: React.PropTypes.object, 
  toolBar: React.PropTypes.object, 
  kToolbar: React.PropTypes.object
}

Main.contextTypes = {
  drawer: React.PropTypes.object
};

function mapStateToProps(state) {
  
  const { documentsReducer, navReducer} = state
  const {env, sessionToken, email, isConnected, isLoggedIn} = state.accessReducer;
  return {
    documentsReducer,
    navReducer,
    env,
    sessionToken,
    isConnected,
    isLoggedIn
  }
}

export default connect(mapStateToProps)(Main)

