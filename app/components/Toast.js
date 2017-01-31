import React from "react"; 
import {View, Text,TextInput, StyleSheet, Animated, Dimensions, Image} from "react-native";
import Button from "react-native-button";
import Icon from 'react-native-vector-icons/MaterialIcons';
import ProgressBar from './ProgressBar'
import config from '../utils/app.config';
import * as documentsActions from '../actions/documentsActions'
import * as navActions from '../actions/navActions'
import {createFolder} from '../actions/documentsActions'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as constans from '../constants/GlobalConstans'
import errorImage from '../assets/icn_error_toast.png'
var styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "row",
        padding: 7,
        alignSelf: "stretch",
        justifyContent: "center",
        alignItems: "center"
    },
    icon: {
        color: '#000',
        fontSize: 20,
        marginRight: 5,
    },
    message: {
        // flex: 1,
        color: "#fff",          
        fontSize: 17,
        textAlign: "center",
    },
    errorIconContainer: {
        marginRight: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    errorIcon: {
         height: 20, 
         width: 20,
    }
});

class Toast extends React.Component {
    constructor(props){
        super (props);

         this.state = {
            message: this.props.toastMessage,
            type: this.props.toastType
        };
    }

    render(){
        
        let bgColor = '';
        
        switch(this.state.type){
            case constans.ERROR:
                bgColor = '#f00';
                break;
            case constans.SUCCESS:
                bgColor = '#3290F1';
                break;
            case constans.INFO:
                bgColor = '#333';
                break;
            default:
                bgColor = '#333';
                break;
        }
        
        
        return (
           
                <View style={[styles.container, {backgroundColor: bgColor}]}>
                {
                    this.state.type === constans.ERROR &&
                    <View style={styles.errorIconContainer}>
                        <Image source={errorImage } style={styles.errorIcon}></Image>
                    </View>
                }
                        <Text style={styles.message}>{this.state.message}</Text>     
                </View>
        );
    }
}

export default Toast