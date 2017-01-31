import React from "react"; 
import {NetInfo} from "react-native";
import { UpdateConnectionState } from '../actions/Access'
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
         this.props.dispatch(UpdateConnectionState(isConnected));
  };



    render(){

        return (
           null
        );
    }
}



export default NetInfoManager