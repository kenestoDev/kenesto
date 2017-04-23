import * as types from '../constants/ActionTypes';
import {getAuthUrl, getLoginUrl, getForgotPasswordUrl,getSignUpUrl, clearCredentials, setCredentials, getRetrieveStatisticsUrl,UpdateFcmTokenUrl,getLeadSourceCode, getLicneseAgreementUrl } from '../utils/accessUtils';
import { push, pop, emitInfo, emitError, emitToast, navigateReset, updateIsProcessing} from './navActions'
import * as textResource from '../constants/TextResource'
import * as routes from '../constants/routes'
import * as constans from '../constants/GlobalConstans'
import {clearAllDocumentlists} from '../actions/documentsActions'
import {getDocumentsTitle} from '../utils/documentsUtils'
import {writeToLog} from '../utils/ObjectUtils'
import  stricturiEncode  from 'strict-uri-encode';
import _ from 'lodash'
export function updateIsFetching(isFetching: boolean){
    return {
        type: types.UPDATE_IS_FETCHING_ACCESS, 
        isFetching
    }
}

export function updateFCMTokenInApp(token: string){
    return {
        type: types.UPDATE_FCM_TOKEN, 
        token
    }
}

export function updateFCMToken(env: string, token: string){
    return (dispatch, getState) => {
        var url = UpdateFcmTokenUrl(env,token); 
        fetch(url);
        return  updateFCMTokenInApp(token)    
    }


}



export function setEnv(env: string){
    return {
        type: types.SetEnv, 
        env
    }
}

export function updateLoginInfo(isLoggedIn: boolean, sessionToken: string, env: string, email: string, firstName: string, lastName: string, thumbnailPath: string, tenantId:number) {

    return {
        type: types.UPDATE_LOGIN_INFO,
        isLoggedIn: isLoggedIn,
        sessionToken: sessionToken,
        tenantId:tenantId,
        env: env,
        email: email,
        firstName: firstName,
        lastName: lastName,
        thumbnailPath: thumbnailPath
    }
}

function updateStatistics(totalMyDocuments: number, totalAllDocuments: number, totalSharedWithMe: number, totalCheckedoutDocuments: number, totalArchivedDocuments: number, totalUsageSpace: number) {
  return {
    type: types.UPDATE_STATISTICS,
    totalMyDocuments,
    totalAllDocuments,
    totalSharedWithMe,
    totalCheckedoutDocuments,
    totalArchivedDocuments,
    totalUsageSpace
  }
}
function updateLicneseAgreement(licenseAgreement: string) {
  return {
    type: types.UPDATE_LICENSE_AGREEMENT,
    licenseAgreement,
  }
}

function Authenticate(userId : string, password: string) {
    return {
        type: types.AUTHENTICATE,  
        password
    }
}

function PasswordSent(sent: boolean) {
    return {
        type: types.PASSWORD_SENT,  
        sent
    }
}


function GetSessionToken(accessToken : string) {
    return {
        type: types.AUTHENTICATE, 
        accessToken
    }
}

function SubmitSuccess(message : string) {
    return {
        type: types.SUBMIT_SUCCESS, 
        message: message, 
        isFetching : false
    }
}


function DoNothing(message : string) {
    return {
        type: types.DO_NOTHING
    }
}

export function UpdateConnectionState(isConnected : boolean){
    return {
        type : types.UPDATE_CONNECTION_STATE, 
        isConnected : isConnected
    }
}

export function retrieveStatistics() {
  return (dispatch, getState) => {
    if (!getState().accessReducer.isConnected)
        return dispatch(emitToast("info", textResource.NO_INTERNET)); 

    const url = getRetrieveStatisticsUrl(getState().accessReducer.env, getState().accessReducer.sessionToken, getState().accessReducer.tenantId)
    let env =  getState().accessReducer.env;
    let token = getState().accessReducer.sessionToken;
    let email = getState().accessReducer.email;
    writeToLog(email, constans.DEBUG, `function retrieveStatistics- fetch url:${url}`)
    return fetch(url)
      .then(response => response.json())
      .then(json => {
        
        if (json.ResponseStatus == "FAILED") {
           dispatch(emitError("Failed to retrieve statistics",""))
           writeToLog(email, constans.ERROR, `function retrieveStatistics- Failed to retrieve statistics - url: ${url}`)
        }
        else {
         var totalMyDocuments = json.ResponseData.MyDocuments;
         var totalAllDocuments = json.ResponseData.AllDocuments;
         var totalSharedWithMe = json.ResponseData.DocumentsSharedWithMe;
         var totalCheckedoutDocuments = json.ResponseData.DocumentsCheckedOutByMe;
         var totalArchivedDocuments = json.ResponseData.TotalArchivedDocuments;
         var totalUsageSpace = json.ResponseData.TotalUsageSpace;
         dispatch(updateStatistics(totalMyDocuments, totalAllDocuments, totalSharedWithMe, totalCheckedoutDocuments,totalArchivedDocuments,totalUsageSpace))
        }
      })
      .catch((error) => {
        dispatch(emitError("Failed to retrieve statistics",""))

        writeToLog(email, constans.ERROR, `function retrieveStatistics- Failed to retrieve statistics - url: ${url}`, error)
      })
  }
}

export function retrieveLicneseAgreement() {
  return (dispatch, getState) => {
    if (!getState().accessReducer.isConnected)
        return dispatch(emitToast("info", textResource.NO_INTERNET)); 

    const url = getLicneseAgreementUrl(getState().accessReducer.env)

    writeToLog("", constans.DEBUG, `function getLicneseAgreement- fetch url:${url}`)
    return fetch(url)
      .then(response => response.json())
      .then(json => {
        if (json.ResponseStatus == "FAILED") {
           dispatch(emitError("Failed to get licnese agreement",""))
           writeToLog("", constans.ERROR, `function getLicneseAgreement- failed to get licnese agreement - url: ${url}`)
        }
        else {
         var licenseAgreement = json.ResponseData.LicenseAgreement;
         dispatch(updateLicneseAgreement(licenseAgreement))
        }
      })
      .catch((error) => {
        dispatch(emitError("Failed to get licnese agreement",""))
        writeToLog("", constans.ERROR, `function getLicneseAgreement- Failed to get licnese agreement - url: ${url}`, error)
      })
  }
}
export function ActivateForgotPassword(username : string, env : string = 'dev') {
     return (dispatch, getState) => {
         if (!getState().accessReducer.isConnected)
            return dispatch(emitToast("info", textResource.NO_INTERNET)); 
        let token = getState().accessReducer.sessionToken;
        if (env == null)
        {
             const {stateEnv} = getState().accessReducer; 
             env = stateEnv;
        }
        dispatch(updateIsFetching(true)); 
       
        var forgotPasswordUrl = getForgotPasswordUrl(env, username);
         writeToLog(username, constans.DEBUG, `function ActivateForgotPassword - url:${forgotPasswordUrl}`)
        return fetch(forgotPasswordUrl)
        .then((response) => response.json())
        .catch((error) => {
             dispatch(emitError('Failed to reset password'))
              writeToLog(username, constans.ERROR, `function ActivateForgotPassword- Failed to reset password - url: ${forgotPasswordUrl}`,error)
        })
        .then( (responseData) => {
            if (responseData.ForgotPasswordResult.ResponseStatus == "FAILED")
            {
                 dispatch(updateIsFetching(false)); 
                 dispatch(emitError("Reset password failed", ""))
                 writeToLog(username, constans.ERROR, `function ActivateForgotPassword- Reset password failed - url: ${forgotPasswordUrl}`)
            }
            else{
                   dispatch(updateIsFetching(false)); 
                   dispatch(emitInfo("Password reset email sent", "Follow the instructions in the email to reset your password",() => dispatch(pop())))
            }
         
        }).done();

        
    }
}

export function ActivateSignUp(firstName:string, lastName:string, company:string, email:string, password: string, env : string = 'dev') {
     return (dispatch, getState) => {
         if (!getState().accessReducer.isConnected)
            return dispatch(emitToast("info", textResource.NO_INTERNET)); 
        let token = getState().accessReducer.sessionToken;
        if (env == null)
        {
             const {stateEnv} = getState().accessReducer; 
             env = stateEnv;
        }
       dispatch(updateIsProcessing(true));
       
        var signUpUrl = getSignUpUrl(env);
               writeToLog(email, constans.DEBUG, `function ActivateSignUp - url: ${signUpUrl}, First Name: ${firstName}, Last Name: ${lastName}, company${company}, Email :${email}`)
      
        const jsonObject = {
            user: {
                FirstName: firstName,
                LastName: lastName,
                Company:company,
                Email: email,
                Password:password,
                LeadSourceCode:getLeadSourceCode()
            }
        }

        var request = new Request(signUpUrl, {
            method: 'post',
            headers: new Headers({
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify(jsonObject)
        });

        fetch(request)
        .then((response) => response.json())
        .catch((error) => {
             dispatch(updateIsProcessing(false));
             dispatch(emitError('Failed to Sign Up'))
              writeToLog("", constans.ERROR, `function ActivateSignUp- Failed to Sign Up - url: ${signUpUrl}, First Name: ${firstName}, Last Name: ${lastName}, Email :${email} `,error)
        })
        .then( (responseData) => {
            if (responseData.SignUpResult.ResponseStatus == "FAILED")
            {
                
                 dispatch(updateIsProcessing(false));
                 dispatch(emitError("Failed to create account.", "Please try again later"))
                 writeToLog("", constans.ERROR, `function ActivateSignUp- Failed to Sign Up - url: ${signUpUrl}`)
            }
            else{
                  
                 dispatch(updateIsProcessing(false));
                   dispatch(emitInfo("Thank you for registering", "To activate your Kenesto account please look for your activation email, including spam or junk folders",() => dispatch(pop())))
            }
         
        }).done();
    }
}


export function logOut() {
    return (dispatch, getState) => {
        let env =  getState().accessReducer.env;
        let token = getState().accessReducer.sessionToken;
        let email = getState().accessReducer.email;
        writeToLog(email, constans.DEBUG, `function logOut - clearCredentials`) 

       // var clear = clearCredentials();
        clearCredentials().then(() => {
            dispatch(navigateReset('root', [{ key: 'login', title: 'login'}], 0));
           try {
               dispatch(clearAllDocumentlists());
           } catch (error) {
               
           }
            
        });
    
    
       
      


    }
}

export function login(userId : string, password: string, env: string = 'dev')  {
  
    return (dispatch, getState) => {
        if (!getState().accessReducer.isConnected)
            return dispatch(emitToast("info", textResource.NO_INTERNET)); 
        writeToLog(userId, constans.DEBUG, `function login - userId: ${userId}, password:${"*****"}`)
        dispatch(updateIsFetching(true)); 
            if (env == null)
            {
                const {stateEnv} = getState(); 
                env = stateEnv;
            }
   
         var authUrl = getAuthUrl(env,stricturiEncode(userId), stricturiEncode(password), constans.ACCESS_KEY);
        return fetch(authUrl)
            .then((response) => response.json())
            .catch((error) => {
                 dispatch(emitError('Failed to login : The authentication servers are currently down for maintenance')); 
                 writeToLog(userId, constans.ERROR, `function login - Failed to Login - userId: ${userId}, password:${"*****"}`, error)
            })
            .then( (responseData) => {
                if (typeof responseData == 'undefined')
                    return; 

                if (responseData.ResponseStatus == "FAILED")
                {
                    clearCredentials();
                     dispatch(emitError('Failed to authenticate')); 
                     writeToLog(userId, constans.ERROR, `function login - Failed to Login - userId: ${userId}, password:${"*****"}`)
                }
                else if(responseData.AuthenticateJsonResult.ErrorMessage != "" && responseData.AuthenticateJsonResult.ErrorMessage != null &&  responseData.AuthenticateJsonResult.ErrorMessage != 'null')
                {
                     var errorMessage = responseData.AuthenticateJsonResult.ErrorMessage.indexOf('ACCESS_DENIED') > -1?
                                 'Failed to login: The e-mail address or password you entered is incorrect' : 
                                responseData.AuthenticateJsonResult.ErrorMessage.indexOf('Could not connect')? 'Failed to login : The authentication servers are currently down for maintenance' 
                                : "Failed to login"; 
                      dispatch(emitError(errorMessage)); 
                   //  dispatch(emitError('Failed to login : The authentication are currently down for maintenance')); 
                     writeToLog(userId, constans.ERROR, `function login - Failed to Login - userId: ${userId}, password:${"*****"}`,responseData.AuthenticateJsonResult.ErrorMessage)
                }
                else
                {


                        var defaultOrg = _.find(responseData.AuthenticateJsonResult.Organizations, {'IsDefault' : true});
                    
                        var organizationId = defaultOrg.OrganizationIdentifier; 
                      
                        var token = responseData.AuthenticateJsonResult.Token;
                        const loginUrl = getLoginUrl(env, organizationId, token);
                       fetch(loginUrl).then((response) => response.json())
                        .catch((error) => {
                             dispatch(emitError('Failed to Login'));
                             writeToLog(userId, constans.ERROR, `function login - Failed to Login, loginUrl:${loginUrl}`, error) 
                        })
                        .then( (responseData) => {
                            if (responseData == null || typeof (responseData.LoginJsonResult) == 'undefined' || responseData.LoginJsonResult.ResponseStatus == 'FAILED')
                                return  dispatch(emitError('Failed to Login'));
                            setCredentials(userId, password, env);
                            var sessionToken =  typeof (responseData.LoginJsonResult) != 'undefined'? responseData.LoginJsonResult.Token : "";
                            dispatch(updateLoginInfo(true, 
                                                    encodeURIComponent(sessionToken), 
                                                    env, responseData.LoginJsonResult.User.EmailAddress,
                                                    responseData.LoginJsonResult.User.FirstName,
                                                    responseData.LoginJsonResult.User.LastName,
                                                    responseData.LoginJsonResult.User.ThumbnailPath,
                                                    responseData.LoginJsonResult.User.TenantID));
                            dispatch(retrieveStatistics());
                            dispatch(clearAllDocumentlists());
                               var data = {
                                                key : "documents",
                                                name: getDocumentsTitle(constans.MY_DOCUMENTS),
                                                catId: constans.MY_DOCUMENTS,
                                                fId: "",
                                                sortDirection: constans.ASCENDING,
                                                sortBy: constans.ASSET_NAME, 
                                                isSearch: false, 
                                                isVault: false
                                            }
                                var rr = routes.documentsRoute(data)
                            
                           dispatch(push(rr.route));
                        })
                }
            
        })

          

    }
}
