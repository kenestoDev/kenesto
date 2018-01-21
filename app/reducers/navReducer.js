import * as actionTypes from '../constants/ActionTypes'
import { NavigationExperimental } from 'react-native'
//import {KenestoDeviceOrientation} from '../components/KenestoDeviceOrientation';
import {NativeModules} from 'react-native'
var Orientation = NativeModules.Orientation;
const {
  StateUtils: NavigationStateUtils
} = NavigationExperimental

const initialState = {
  index: 0,
  key: 'root',
  lastActionType:"",
  routes: [
    {
      key: 'login',
      title: 'login',
      data:{
        isLoading: false
      }
    }
  ], 

  toolbarVisible: true,
  isProcessing:false,
  isRouting: false,
  orientation: Orientation.initialOrientation
}

function navigationState(state = initialState, action) {
  switch (action.type) {
   
    case actionTypes.PUSH_ROUTE:
      if (state.routes[state.index].key === (action.route && action.route.key)) return state
      state.lastActionType =  actionTypes.PUSH_ROUTE;
      state.toolbarVisible = true;
      state.isRouting = true;
      return NavigationStateUtils.push(state, action.route)
    case  actionTypes.POP_ROUTE:
      if (state.index === 0 || state.routes.length === 1) return state
      state.lastActionType =  actionTypes.POP_ROUTE;
      state.toolbarVisible = true;
      state.isRouting = true;
      return NavigationStateUtils.pop(state)

    case  actionTypes.NAV_JUMP_TO_KEY:
     state.lastActionType =  actionTypes.NAV_JUMP_TO_KEY;
      state.toolbarVisible = true;
      state.isRouting = true;
      return NavigationStateUtils.jumpTo(state, action.key)

    case  actionTypes.NAV_JUMP_TO_INDEX:
      state.lastActionType = actionTypes.NAV_JUMP_TO_INDEX;
      state.toolbarVisible = true;
      return NavigationStateUtils.jumpToIndex(state, action.index)

    case  actionTypes.NAV_RESET:
      return {
			  ...state,
        key: action.key,
        index: action.index,
        routes: action.routes,
        lastActionType: actionTypes.NAV_RESET
      }

    case  actionTypes.UPDATE_ROUTE_DATA:
      state.routes[state.index].data = action.routeData;
      return {
        ...state,
        lastActionType:  actionTypes.UPDATE_ROUTE_DATA
      }
    case  actionTypes.SUBMIT_INFO:
      return {
        ...state,
        HasInfo: true,
        GlobalInfoTitle: action.infoTitle,
        GlobalInfoDetails: action.infoDetails,
        GlobalInfoOkAction: action.infoOkAction,
        isProcessing: action.isProcessing

      }
    case actionTypes.CLEAR_INFO:
      return {
        ...state,
        HasInfo: false,
      }
    case  actionTypes.SUBMIT_ERROR:
      return {
        ...state, 
        HasError: true, 
        GlobalErrorTitle: action.errorTitle, 
        GlobalErrorDetails: action.errorDetails,
        GlobalErrorOkAction: action.errorOkAction,
        isProcessing: action.isProcessing
      }

    case  actionTypes.SUBMIT_CONFIRM:
      return {
        ...state,
        HasConfirm: true, 
        GlobalConfirmTitle: action.confirmTitle, 
        GlobalConfirmDetails: action.confirmDetails,
        GlobalConfirmOkAction: action.confirmOkAction,
        GlobalConfirmCancelAction: action.confirmCancelAction,
        isProcessing: action.isProcessing
      }
    case  actionTypes.CLEAR_CONFIRM:
      return {
        ...state,
        HasConfirm: false,
      }
    
    case  actionTypes.SUBMIT_STICKY_CONFIRM:
      return {
        ...state,
        HasStickyConfirm: true, 
        GlobalConfirmTitle: action.confirmTitle, 
        GlobalConfirmDetails: action.confirmDetails,
        GlobalConfirmOkAction: action.confirmOkAction,
        GlobalConfirmCancelAction: action.confirmCancelAction,
        isProcessing: action.isProcessing
      }
    case  actionTypes.CLEAR_STICKY_CONFIRM:
      return {
        ...state,
        HasStickyConfirm: false,
      }

    case  actionTypes.CLEAR_ERROR:
      return {
        ...state, 
        HasError: false, 
        GlobalErrorTitle:null, 
        GlobalErrorDetails: null,
        GlobalErrorOkAction: null
      }
    case  actionTypes.SUBMIT_TOAST:
        return {
          ...state, 
          HasToast: true, 
          GlobalToastType: action.toastType,
          GlobalToastTitle:action.toastTitle, 
          GlobalToastMessage: action.toastMessage, 
          isProcessing: action.isProcessing
        }
   case  actionTypes.CLEAR_TOAST:
        return {
          ...state, 
          HasToast: false, 
          HideToast: false, 
          GlobalToastType: null,
          GlobalToastTitle:null, 
          GlobalToastMessage: null
        }
   case  actionTypes.HIDE_TOAST:
     return {
          ...state,
       HideToast: true,
       GlobalToastType: null,
       GlobalToastTitle: null,
       GlobalToastMessage: null
     }
    case  actionTypes.TOGGLE_TOOLBAR: 
      var thistoolbarVisible = action.toolbarVisible == null? !state.toolbarVisible: action.toolbarVisible; 
      return{
          ...state,
          toolbarVisible: thistoolbarVisible,
      }
    case  actionTypes.UPDATE_ORIENTATION:
      return{
          ...state,
          orientation: action.orientation,
      }
   case actionTypes.UPDATE_IS_PROCESSING:

      return {
        ...state,
        isProcessing: action.isProcessing,
      }
       case actionTypes.UPDATE_IS_ROUTING:

      return {
        ...state,
        isRouting: action.isRouting,
      }
      
    default:
      return state
  }
  
}

export default navigationState


