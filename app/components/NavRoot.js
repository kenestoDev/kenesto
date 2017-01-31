import React, { Component } from 'react'
import Home from './Home'
import About from './About'
import ForgotPassword from './ForgotPassword'
import AddPeopleContainer from '../containers/AddPeopleContainer'
import Documents from './Documents'
import Document from './Document'
import LoginContainer from '../containers/LoginContainer'
import DocumentsContainer from '../containers/DocumentsContainer'
import LauncherContainer from '../containers/LauncherContainer'
import AddPeople from './AddPeople'
import Scan from './Scan';
import * as uiActions from '../actions/uiActions'
import * as textResource from '../constants/TextResource'
import { emitToast} from '../actions/navActions'
import {
  BackAndroid,
  NavigationExperimental
} from 'react-native'

const {
  Reducer: NavigationTabsReducer,
  CardStack: NavigationCardStack
} = NavigationExperimental

class NavRoot extends Component {
  constructor(props) {
    super(props)
    this._renderScene = this._renderScene.bind(this)
    this._handleBackAction = this._handleBackAction.bind(this)
  }
  componentDidMount() {
    BackAndroid.addEventListener('hardwareBackPress', this._handleBackAction)
  }
  componentWillUnmount() {
    BackAndroid.removeEventListener('hardwareBackPress', this._handleBackAction)
  }
  _renderScene(props) {


    const { route } = props.scene

    if (route.key === 'KenestoLauncher') {
      return <LauncherContainer _handleNavigate={this._handleNavigate.bind(this) }/>
    }
    if (route.key === 'home') {
      return <Home  _handleNavigate={this._handleNavigate.bind(this) }  />
    }
    if (route.key === 'about') {
      return <About _goBack={this._handleBackAction.bind(this) } />
    }

    if (route.key === 'forgotPassword') {
      return <ForgotPassword userName={route.userName} _goBack={this._handleBackAction.bind(this)} env={route.env}  />
    }
    if (route.key === 'scan') {
      return <Scan _handleNavigate={this._handleNavigate.bind(this) } isCameraScan={route.data.isCameraScan}  baseFileId={route.data.baseFileId} />
    }
    if (route.key === 'login') {
      return <LoginContainer _handleNavigate={this._handleNavigate.bind(this)} />
    }

    if (route.key != "" && typeof route.key != 'undefined' && (route.key.indexOf('documents') > -1)) {
      return <DocumentsContainer _goBack={this._handleBackAction.bind(this) } _handleNavigate={this._handleNavigate.bind(this) } data={route.data}/>
    }

    if (route.key === 'document') {
      return <Document _goBack={this._handleBackAction.bind(this) } data={route.data} _handleNavigate={this._handleNavigate.bind(this) }/>
    }
    if (route.key === 'addPeople') {
      return <AddPeople _goBack={this._handleBackAction.bind(this) } data={route.data} _handleNavigate={this._handleNavigate.bind(this) }/>
    }
  }
  // _isItemMenuModalOpen() {
  //   return this.props.isItemMenuModalOpen();
  // }
  // _isMenuModalOpen() {
  //   return this.props.isMenuModalOpen();
  // }
  // _isDrawerOpen() {
  //   return this.props.isDrawerOpen();
  // }

  // _isSearch(){
  //     return this.props.isSearch();
  // }

  _closeItemMenuModal() {
    this.props.closeItemMenuModal();
  }
  _closeDrawer() {
    this.props.closeDrawer();
  }
  _closeMenuModal() {
    this.props.closeMenuModal();
  }

  _handleBackAction() {
  //  //   alert(JSON.stringify(this.props.uiReducer));
  //  // alert(this.props.openedDialogModalref())
  //   //console.log(this.props.openedDialogModalref()); 

  //  // return true;
  //   if (this._isSearch()){
  //    //  alert(this._isSearch());
  //         this.props.hideSearchBox();
  //       return true;
  //   }
  //   if (this._isItemMenuModalOpen()) {
  //     this._closeItemMenuModal();
  //     return true;
  //   }
  //   if (this._isMenuModalOpen()) {
  //     this._closeMenuModal();
  //     return true;
  //   }
  //   // else if (this._isDrawerOpen()) {
  //   //   this._closeDrawer();
  //   //   return true;
  //   // }

   if (this.props.uiReducer.showDropDown){
        this.props.dispatch(uiActions.forceCloseDropdownOptions()); 
        return true;
   }
   if (this.props.uiReducer.openedDialogModalref != ''){
     this.props.closeModal(this.props.uiReducer.openedDialogModalref)
      return true; 
   }
  if (this.props.uiReducer.isDrawerOpen){
     this._closeDrawer();
     return true;
   }
   if (this.props.uiReducer.isPopupMenuOpen){
       this.props.hidePopupMenu();
       return true;
   }
   if (this.props.uiReducer.isSearchboxOpen){
       this.props.hideSearchBox();
       return true;
   }
    else {
      if (this.props.navigation.routes[this.props.navigation.routes.length - 1].key == 'forgotPassword') {
        this.props.popRoute()
        return true
      }

      if ((this.props.navigation.routes[this.props.navigation.index].key.indexOf('documents') > -1 && this.props.navigation.routes[this.props.navigation.index].data.fId != "") || this.props.navigation.routes[this.props.navigation.index].key === 'document') {
        this.props.popRoute()
        return true
      }
      
      if (this.props.navigation.routes[this.props.navigation.routes.length - 1].key == 'addPeople') {
        this.props.popRoute()
        return true
      }
      
      else {
        return false
      }
    }

  }

  _handleNavigate(action) {
      if (!this.props.isConnected)
        return this.props.dispatch(emitToast("info", textResource.NO_INTERNET)); 

    switch (action && action.type) {
      case 'push':
        this.props.pushRoute(action.route)
        return true
      case 'back':
      case 'pop':
        return this._handleBackAction()
      default:
        return false
    }
  }
  render() {
    return (
      <NavigationCardStack
        style={{ flex: 1 }}
        navigationState={this.props.navigation}
        onNavigate={this._handleNavigate.bind(this) }
        renderScene={this._renderScene} />
    )
  }
}

export default NavRoot
