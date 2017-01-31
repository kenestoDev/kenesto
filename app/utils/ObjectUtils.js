import _ from 'lodash'
import {config} from './app.config'
import moment from 'moment';
import DeviceInfo from 'react-native-device-info';
import * as constans from '../constants/GlobalConstans'
import PubNub from 'pubnub'


const pubnub = new PubNub(
    {
        publishKey: config.pubnub.publishKey,
        subscribeKey: config.pubnub.subscribeKey,
        ssl: config.pubnub.ssl,
});
 


export function getRetrieveShareObjectInfoUrl(env: string, token: string, objectId: string, familyCode: string){
    var urls = _.find(config.urls, { 'env': env });
    var apiBaseUrl = urls.ApiBaseUrl;
    var url
    if (urls == null)
        return null;
    
    return `${apiBaseUrl}/KObject.svc/RetrieveShareObjectInfo?t=${token}&oi=${objectId}&fc=${familyCode}`; 
}

export function getWriteToLogUrl(env: string, sessionToken: string, userData: string = ''){
    var urls = _.find(config.urls, { 'env': env });
    var apiBaseUrl = urls.ApiBaseUrl;
    var url
    if (urls == null)
        return null;
    
    return `${apiBaseUrl}/KObject.svc/WriteToLog?t=${sessionToken}&ud=${userData}`; 
}

export function isRouteKeyExists(key:string, routes:Object)
{
      for (index = 0; index < routes.length; ++index) {
          if(routes[index].key == key)
          return true;
      }
      return false;
}


export function writeToLog(userEmail: string, category: string = "", ...values) {
    try {

        var date = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
        // var logRow = `${DeviceInfo.getUniqueID()} - ${userEmail} [${date}][${category}] ${values.join(';')} ; Device Info: ${DeviceInfo.getUserAgent()} ${DeviceInfo.getDeviceCountry()}`
        var data = {
            Date: date,
            Id: DeviceInfo.getUniqueID(),
            Message: values.join(';'),
            Email: userEmail,
            Category: category,
            UserAgent: DeviceInfo.getUserAgent(),
            DeviceCountry: DeviceInfo.getDeviceCountry(),
        }


        pubnub.publish({
            channel: category == constans.ERROR ? config.pubnub.channel_error : config.pubnub.channel_info,
            message: data
        });
    }
    catch (err) {
        //alert(err)
    }
}
