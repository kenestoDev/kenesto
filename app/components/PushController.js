import React, { Component } from "react";

import { Platform } from "react-native"

//import FCM, { FCMEvent, RemoteNotificationResult, WillPresentNotificationResult, NotificationType } from "react-native-fcm";

import firebaseClient from "./FirebaseClient";

export default class PushController extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {

    //FCM.subscribeToTopic('/topics/scottkenestodemo.com')
    /*
    FCM.requestPermissions();

    FCM.getFCMToken().then(token => {
      console.log("TOKEN (getFCMToken)", token);
      if (token != '')
        this.props.onChangeToken(token);
    });

    FCM.getInitialNotification().then(notif => {
      console.log("INITIAL NOTIFICATION", notif)
    });

    this.notificationListner = FCM.on(FCMEvent.Notification, notif => {

      console.log("Notification", notif);
      if (notif.local_notification) {
        return;
      }

      if (notif.opened_from_tray) {
        return;
      }

      if (Platform.OS === 'ios') {
        console.log(notif);
        //optional
        //iOS requires developers to call completionHandler to end notification process. If you do not call it your background remote notifications could be throttled, to read more about it see the above documentation link.
        //This library handles it for you automatically with default behavior (for remote notification, finish with NoData; for WillPresent, finish depend on "show_in_foreground"). However if you want to return different result, follow the following code to override
        //notif._notificationType is available for iOS platfrom
        switch (notif._notificationType) {
          case NotificationType.Remote:
            notif.finish(RemoteNotificationResult.NewData) //other types available: RemoteNotificationResult.NewData, RemoteNotificationResult.ResultFailed
            break;
          case NotificationType.NotificationResponse:
            notif.finish();
            break;
          case NotificationType.WillPresent:
            notif.finish(WillPresentNotificationResult.All) //other types available: WillPresentNotificationResult.None
            break;
        }
      }
      this.showLocalNotification(notif);
    });

    this.refreshTokenListener = FCM.on(FCMEvent.RefreshToken, token => {
      console.log("TOKEN (refreshUnsubscribe)", token);
      this.props.onChangeToken(token);
    });
  }

  showLocalNotification(notif) {
    
  //  alert(notif.click_action)
    FCM.presentLocalNotification({
      title: 'kuku', // notif.title,
      body: 'zbabur', // notif.body,
      priority: "high",
      click_action: "fcm.ACTION.HELLO", //notif.click_action,
      show_in_foreground: true,
      local: true
    });
    */
  }

  componentWillUnmount() {
    this.notificationListner.remove();
    this.refreshTokenListener.remove();
    //FCM.unsubscribeToTopic('/topics/scottkenestodemo.com')
  }


  render() {
    return null;
  }
}