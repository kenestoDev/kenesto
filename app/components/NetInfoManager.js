import React from "react"; 
import {NetInfo} from "react-native";
import { UpdateConnectionState } from '../actions/Access'
import {writeToLog} from '../utils/ObjectUtils'
import * as constans from '../constants/GlobalConstans'
import { emitToast } from '../actions/navActions'

class NetInfoManager extends React.Component {
    constructor(props){
        super (props);

         this.state = {
            // isConnected : true
        };
    }

    componentDidMount() {
        NetInfo.isConnected.addEventListener(
            'change',
            this._handleConnectivityChange
        );
        NetInfo.isConnected.fetch().done(
            (isConnected) => { 
                writeToLog("", constans.DEBUG, `Component NetInfoManager function componentDidMount - isConnected:${isConnected}`)
                this.props.dispatch(UpdateConnectionState(isConnected));
             }
        );
    }

    componentWillUnmount() {
        NetInfo.isConnected.removeEventListener(
            'change',
            this._handleConnectivityChange
        );
    }

     _handleConnectivityChange = (isConnected) => {
     //   console.log('_handleConnectivityChange ' + isConnected)
       // const message = isConnected? "you are conntected!" : "No internet for you!"; 
       // this.props.dispatch(emitToast("info", message))
       writeToLog("", constans.DEBUG, `Component NetInfoManager function _handleConnectivityChange - isConnected:${isConnected}`)
         this.props.dispatch(UpdateConnectionState(isConnected));
  };



    render(){

        return (
           null
        );
    }
}



export default NetInfoManager