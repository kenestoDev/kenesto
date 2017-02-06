'use strict';
var React = require('react');
var ReactNative = require('react-native');
import {connect} from 'react-redux'
var {
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  TouchableOpacity,
  View,
  WebView,
  Dimensions,
} = ReactNative;
import Button from './Button'
import {getEnvIp} from '../utils/accessUtils'
var HEADER = '#3b5998';
var BGWASH = 'rgba(255,255,255,0.8)';
var DISABLED_WASH = 'rgba(255,255,255,0.25)';
const window = Dimensions.get('window');
var TEXT_INPUT_REF = 'urlInput';
var WEBVIEW_REF = 'webview';
import ProggressBar from "../components/ProgressBar";
import Icon from 'react-native-vector-icons/MaterialIcons';
import {createResponder} from 'react-native-gesture-responder';
import { writeToLog } from '../utils/ObjectUtils'
import * as constans from '../constants/GlobalConstans'
import * as navActions from '../actions/navActions'

class Document extends React.Component{
  constructor(props){
  
    super(props);
 
    this.documentProps = this.props.data// _.filter(routes, function(o) { return o.key == 'document'; })[0];
   
    this.state = {  
      isLoading: !this.props.data.isExternalLink,
      scalingEnabled: true,
      prevPinch: null, 
      pinchDirection : null, 
      thumbnailUrl: this.props.data.ThumbnailUrl, 
      toolbarVisible: true,
      clearId : null
    };
  }

   webview = null;

  componentWillMount(){

    this.gestureResponder = createResponder({
      onStartShouldSetResponder: (evt, gestureState) => true,
      onStartShouldSetResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetResponder: (evt, gestureState) => true,
      onMoveShouldSetResponderCapture: (evt, gestureState) => true,
      onResponderGrant: (evt, gestureState) => { },
      onResponderMove: (evt, gestureState) => {

        if (typeof (gestureState.pinch) != 'undefined' && typeof (gestureState.previousPinch) != 'undefined') {
          var diff = gestureState.pinch - gestureState.previousPinch;
          if (this.state.zoomCorrection == null) {
            this.setState({ zoomCorrection: 1 })
          }
          if (this.state.startPinch == null) {
            this.setState({
              startPinch: gestureState.pinch,
            })
          }

          const absDistance = Math.round(gestureState.pinch - this.state.startPinch);
          const mod = absDistance % 5;
          if (mod == 0) {
            
            const zoom = Math.round(gestureState.pinch / this.state.startPinch * 100) == Infinity? 100 : Math.round(gestureState.pinch / this.state.startPinch * 100);
            if(zoom * this.state.zoomCorrection < 25){
              this.setZoom(25);
            }
            else if (zoom * this.state.zoomCorrection > 400){
              this.setZoom(400);
            }
            else {
              this.setZoom(zoom * this.state.zoomCorrection);
            }         
            this.setState({
              tempPinch: gestureState.pinch,
              absDistance: absDistance
            })
          }
        }
      },

      onResponderTerminationRequest: (evt, gestureState) => false,
      onResponderRelease: (evt, gestureState) => {
        var zoomCorrection;
        if (!gestureState.singleTapUp && !gestureState.doubleTapUp && this.state.absDistance != null) {
          zoomCorrection = Math.round(this.state.tempPinch / this.state.startPinch * 100 * this.state.zoomCorrection) / 100;
          if (zoomCorrection < 0.25) {
            zoomCorrection = 0.25;
          }
          else if (zoomCorrection > 4) {
            zoomCorrection = 4;
          }
          this.setState({
            startPinch: null,
            zoomCorrection: zoomCorrection,
            absDistance: null
          })
        }
        
        else if (gestureState.doubleTapUp) {
          this.setZoom(100);
          zoomCorrection = 1;
          
          this.setState({
            startPinch: null,
            zoomCorrection: zoomCorrection,
            absDistance: null
          })
        }
        
      },

      onResponderTerminate: (evt, gestureState) => {
      },

      onResponderSingleTapConfirmed: (evt, gestureState) => {
    
        if (this.state.toolbarVisible) {
          this.hideToolBar();
          //  this.props.dispatch(navActions.hideToolbar(true));
        }

        else {
          this.showToolBar();
          // this.props.dispatch(navActions.showToolbar(true));
        }

        this.setState({ toolbarVisible: !this.state.toolbarVisible });

      },
      moveThreshold: 2,
      debug: false
    });
      
  }

  componentDidMount(){
     var clearId = setTimeout(() =>{  if (this.state.isLoading) this.setState({isLoading: false});}, 9000); 
      this.setState({clearId : clearId})
    
  }
  componentWillUnmount(){
    if (!this.state.toolbarVisible)
        this.showToolBar();
     if (this.state.clearId != null)
        clearTimeout(this.state.clearId);
  }

   showToolBar(){
    this.context.toolBar.fadeInDown();
  }
  
  hideToolBar(){
    this.context.toolBar.fadeOutUp();
  }


 onLoadEnd(){
    // this.setState({isLoading: false});
 }
 
 renderLoading(){
   return (
     this.state.isLoading ?
       <View style={styles.loading}>
         <ProggressBar isLoading={true} size={50} color={"#3490EF"} />
       </View>
       :
       <View></View>
   )
 }

 sendToBridge(message){
       if (this.webview) {
            this.webview.postMessage(message);
    }
 }
 

    onMessage( event ) {
        console.log( "On Message", event.nativeEvent.data );
    }

hideLoading(){
  this.setState({isLoading: false});
}
  zoomIn(){
     // const { webviewbridge } = this.refs;
     this.sendToBridge("zoomIn");
  }
   zoomOut(){
     //  const { webviewbridge } = this.refs;
      this.sendToBridge("zoomOut");

  }
  setZoom(value){
    //  const { webviewbridge } = this.refs;
      this.sendToBridge("setZoom_" + value.toString());
  }
  orientationChanged(orientation){
     //const { webviewbridge } = this.refs;
     this.sendToBridge("onDeviceOrientationChanged_" + orientation);
  }


  componentDidMount(){
     var clearId = setTimeout(() =>{  if (this.state.isLoading) this.setState({isLoading: false});}, 9000); 
      this.setState({clearId : clearId})
    
  }
  componentWillUnmount(){
     if (this.state.clearId != null)
        clearTimeout(this.state.clearId);
  }


  render(){
    console.log('zabubu')
    writeToLog("", constans.DEBUG, `Document Component - url: ${this.props.data.viewerUrl}`)
    const injectScript = `
      (function () {
            window.addEventListener('message', function (event) {
                var message = event.data;
                if (message.indexOf("setZoom") >  -1)
                {
                      var zoomLevel = parseInt(message.split("_")[1]);
                      activateSetZoom(zoomLevel);
                } 
                else if (message.indexOf("onDeviceOrientationChanged") >  -1)
                {
                      var orientation = message.split("_")[1];
                      onDeviceOrientationChanged(orientation);
                } 
                else
                  switch (message) {
                            case "zoomIn":
                                activateZoomIn();
                            break;
                            case "zoomOut":
                                    activateZoomOut();
                            break;
                            case "setZoom":
                                    activateSetZoom(100);
                            break;

                            
                        }
                

            })
                 
       }());
    
    `; 

            //  ref={webview => { this.webview = webview; }}
            //   style={styles.webview_body}
            //   source={{ uri: this.props.data.viewerUrl }}
      // onLoadEnd={this.onLoadEnd.bind(this) }
      //         javaScriptEnabled={true}
      //         domStorageEnabled={true}
      //         startInLoadingState={true}
      //         scalesPageToFit={true}
      //         onMessage={this.onMessage}
      //              {...this.gestureResponder}
    return(

      <View style={{ flex: 1 }}>
        
          
            <WebView

             style={styles.webview_body}
                    source={{uri: this.props.data.viewerUrl}}
                    ref={( webView ) => this.webView = webView}
                    onMessage={this.onMessage}

                              javaScriptEnabled={true}
              domStorageEnabled={true}
  {...this.gestureResponder}
          
            
              />

      </View>

        
    )
  }
  
  
  
  
}

var styles = StyleSheet.create({
   title: {
    marginBottom: 20,
    fontSize: 22,
    textAlign: 'center'
  },
  container: {
    flex: 1,
    backgroundColor: HEADER,
  },
  addressBarRow: {
    flexDirection: 'row',
    padding: 8,
  },
  webView: {
    backgroundColor: BGWASH,
    height: 350,
  },
  addressBarTextInput: {
    backgroundColor: BGWASH,
    borderColor: 'transparent',
    borderRadius: 3,
    borderWidth: 1,
    height: 24,
    paddingLeft: 10,
    paddingTop: 3,
    paddingBottom: 3,
    flex: 1,
    fontSize: 14,
  },
  navButton: {
    width: 20,
    padding: 3,
    marginRight: 3,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BGWASH,
    borderColor: 'transparent',
    borderRadius: 3,
  },
  disabledButton: {
    width: 20,
    padding: 3,
    marginRight: 3,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: DISABLED_WASH,
    borderColor: 'transparent',
    borderRadius: 3,
  },
  goButton: {
    height: 24,
    padding: 3,
    marginLeft: 8,
    alignItems: 'center',
    backgroundColor: BGWASH,
    borderColor: 'transparent',
    borderRadius: 3,
    alignSelf: 'stretch',
  },
  statusBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 5,
    height: 22,
  },
  statusBarText: {
    color: 'white',
    fontSize: 13,
  },
  spinner: {
    width: 20,
    marginRight: 6,
  },
  buttons: {
    flexDirection: 'row',
    height: 30,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  button: {
    flex: 0.5,
    width: 0,
    margin: 5,
    borderColor: 'gray',
    borderWidth: 1,
    backgroundColor: 'gray',
    
  },
  
  webview_header: {
    paddingLeft: 10,
    backgroundColor: '#FF6600',
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row'
  },
  header_item: {
    paddingLeft: 10,
    paddingRight: 10,
    justifyContent: 'center'
  },
  webview_body: {
    flex: 1,
    backgroundColor: 'transparent',
    // width: 300,
    // height: 400,
  },

  page_title: {
    color: '#FFF'
  },
  moreMenu: {
    fontSize: 22,
    color: '#888',
  },
  loading: {
    justifyContent: 'center', 
    alignItems: 'center', 
    // backgroundColor: '#fefefe',
    backgroundColor: '#000', 
    position: "absolute", 
    zIndex: 1, 
    top: 0, left: 0, bottom: 0, right: 0
  }

});

Document.contextTypes = {
  toolBar: React.PropTypes.object
};

function mapStateToProps(state) {

 
  const { navReducer } = state;
  return {
    toolbarVisible: navReducer.toolbarVisible,
    orientation: navReducer.orientation,
  }
}

export default connect(mapStateToProps)(Document)