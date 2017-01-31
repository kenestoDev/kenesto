// import React, { Component } from 'react';
// import PushNotification from 'react-native-push-notification';
// import { getDocumentsContext } from '../utils/documentsUtils'
// export default class PushController extends Component {
//   componentDidMount() {
//     PushNotification.configure({
//       onNotification: function(notification) {
//         alert('hey')
//        // alert(JSON.stringify(notification));
//           // alert(JSON.stringify(notification));
//         //    const {dispatch, navReducer} = this.props
//         //    var documentlist = getDocumentsContext(navReducer);
//         //    var data = {
//         //       key: "document",
//         //       name: notification.userInfo.ObjetDisplayName,
//         //       documentId: notification.userInfo.ObjectContextId,
//         //       familyCode: notification.userInfo.ObjectFamilyCode,
//         //       catId: documentlist.catId,
//         //       fId: documentlist.fId,
//         //       viewerUrl: this.getViewerUrl(notification.userInfo), 
//         //       isExternalLink : document.IsExternalLink,
//         //       isVault:document.IsVault,
//         //       ThumbnailUrl : notification.userInfo.ThumbnailUrl,
//         //       env: this.props.env, 
//         //       dispatch: this.props.dispatch
//         //     }
//         //     this.props._handleNavigate(routes.documentRoute(data));

//          // alert(JSON.stringify(notification));
//         // PushNotification.getApplicationIconBadgeNumber((number) => {

//         // })
//       },
//       senderID: "504053097092"
//     });
//   }

// //   getViewerUrl(message){
// //    if(document.isExternalLink)
// //     {
// //       return document.ViewerUrl;
// //     }
// //     else
// //     {
// //       var longDimension = window.width > window.height ? window.width : window.height;
// //       var shortDimension = window.height > window.width ? window.width : window.height;
// //       var width = this.props.navReducer.orientation === 'PORTRAIT' ? shortDimension : longDimension;
// //       var height = this.props.navReducer.orientation === 'PORTRAIT' ? longDimension : shortDimension;
// //       var url = document.ViewerUrl.replace('localhost', getEnvIp(this.props.env)) + "&w=" + width + "&h=" + height;
// //       return url;
// //     }
// // }

//   render() {
//     return null;
//   }
// }
