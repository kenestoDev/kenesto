
import React from "react";
import {DeviceEventEmitter} from 'react-native'
import {NativeModules} from 'react-native'
var Orientation = NativeModules.Orientation;
var listeners = {};
var id = 0;
var META = '__listener_id';


class KenestoDeviceOrientation  extends React.Component 
{

   constructor(props){
        super(props);

    }
    render(){
      return null;
    }
  getOrientation(cb) {
    Orientation.getOrientation((error,orientation) =>{
      cb(error, orientation);
    });
  }

  getSpecificOrientation(cb) {
    Orientation.getSpecificOrientation((error,orientation) =>{
      cb(error, orientation);
    });
  }

  lockToPortrait() {
    Orientation.lockToPortrait();
  }

  lockToLandscape() {
    Orientation.lockToLandscape();
  }

  lockToLandscapeRight() {
    Orientation.lockToLandscapeRight();
  }

  lockToLandscapeLeft() {
    Orientation.lockToLandscapeLeft();
  }

  unlockAllOrientations() {
    Orientation.unlockAllOrientations();
  }

  addOrientationListener(callback) {
    return DeviceEventEmitter.addListener(
      'orientationDidChange', function (data) {
        callback(data.orientation);
      }
    );
  }

  removeOrientationListener(listener) {
    DeviceEventEmitter.removeListener('orientationDidChange', listener);
  }
 
  getInitialOrientation() {
    return Orientation.initialOrientation;
   
  }

}



export default KenestoDeviceOrientation;