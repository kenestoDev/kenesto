import * as types from '../constants/ActionTypes'

function accessReducer(state =
  {
    isActionSend:false,
    isLoggedIn: false,
    token: "",
    fcmToken:"",
    env: 'dev',
    tenantId:"",
    isFetching: false,
    email: "",
    firstName: "",
    lastName: "",
    thumbnailPath: "",
    hasProfilePicture: false,
    isConnected : true,
    licenseAgreement:"",
    statistics: {
      totalMyDocuments: 0,
      totalAllDocuments: 0,
      totalSharedWithMe: 0,
      totalCheckedoutDocuments: 0,
      totalArchivedDocuments: 0,
      totalUsageSpace: 0,
    }
  }, action) {
  switch (action.type) {
  
    case types.UPDATE_IS_FETCHING_ACCESS:
      return {
          ...state,
        isFetching: action.isFetching
      }
    case types.UPDATE_FCM_TOKEN:
          return {
              ...state,
            fcmToken: action.token
          }
    case types.SUBMIT_ERROR:
      return {
          ...state,
        isFetching: false,
        HasError: true,
        GlobalErrorMessage: action.message
      }
    case types.SUBMIT_SUCCESS:
      return {
          ...state,
        isFetching: false,
        HasError: false,
        GlobalErrorMessage: "",
        GlobalSuccessMessage: action.messge
      }
    case types.SetEnv:
      return {
          ...state,
        env: action.env
      }
    case types.PASSWORD_SENT:
      return {
          ...state,
        passwordSent: action.sent,
        isFetching: false
      }
    case types.LOGIN: {
      return {
            ...state,
        accessToken: action.accessToken
      }

    }
    case types.UPDATE_ACTION_TYPE: {
    
      return {
            ...state,
        isActionSend: action.isActionSend
      }

    }
    case types.UPDATE_LOGIN_INFO: {
      return {
            ...state,
        isLoggedIn: action.isLoggedIn,
        sessionToken: action.sessionToken,
        isFetching: false,
        tenantId:action.tenantId,
        env: action.env,
        email: action.email,
        firstName: action.firstName,
        lastName: action.lastName,
        hasProfilePicture: action.thumbnailPath != '',
        thumbnailPath: action.thumbnailPath + "?t=" + Date.now()
      }

    }
    
     case types.UPDATE_LICENSE_AGREEMENT: {
      return {
          ...state,
          licenseAgreement:action.licenseAgreement
      }
    }
    case types.UPDATE_STATISTICS: {
      return {
          ...state,
        statistics: {
          totalMyDocuments: action.totalMyDocuments,
          totalAllDocuments: action.totalAllDocuments,
          totalSharedWithMe: action.totalSharedWithMe,
          totalCheckedoutDocuments: action.totalCheckedoutDocuments,
          totalArchivedDocuments: action.totalArchivedDocuments,
          totalUsageSpace: action.totalUsageSpace,
        }
      }

    }
    case types.UPDATE_CONNECTION_STATE: {
      return {
        ...state, 
        isConnected : action.isConnected
      }
    }
    default:
      return state
  }
}

export default accessReducer