import React from "react"; 
import {View, Text,TextInput, StyleSheet, Animated, Dimensions, Platform} from "react-native";
import Button from "react-native-button";
import Icon from 'react-native-vector-icons/MaterialIcons';
import ProgressBar from './ProgressBar'
import config from '../utils/app.config';
import * as documentsActions from '../actions/documentsActions'
import * as navActions from '../actions/navActions'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

var styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        backgroundColor:"white",
        padding: 20,
    },
    titleContainer: {
        flex: 3,
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        fontSize: 20,
        alignSelf: "center",
        color: "#FA8302"
    },
    messageContainer: {
        flex: 2,
        flexDirection:'row',
        alignItems: "center",
    },
    messageText: {
        flex: 1,
        color: "#888",
        // height: 50,            
        fontSize: 17,
        textAlign: "center"
    },
    buttonsContainer: {
        flex: 2,
        flexDirection: "row",
        alignItems: "flex-end",
        marginTop: 30,
        justifyContent: 'space-between',
        alignSelf: "stretch", 
   },
   singleBtnContainer: {
        width: 135,
        justifyContent: "space-around",
        height: 50,
        backgroundColor: "#F5F6F8",
        ...Platform.select({
            ios:{
                    borderRadius: 10,
                    //padding: 10,
                    shadowColor: '#000000',
                    shadowOffset: {
                    width: 0,
                    height: 3 },
                        shadowRadius: 10,
                        shadowOpacity: 0.25
                    },
                    android:{
                        borderWidth: 0.5,
                        borderColor: "#BEBDBD",
                    }
            }),
   },
   button: {
        color: "#666666",
        fontWeight: "normal",
        fontSize: 18, 
   },
});

class Confirm extends React.Component {
    constructor(props){
        super (props);

        this.state = {
           
            confirmTitle: this.props.confirmTitle,
            confirmDetails: this.props.confirmDetails
        };
    }

  handleCancel(){
         this.props.dispatch(navActions.clearConfirm());
         if (this.props.cancelAction != null && typeof this.props.cancelAction != 'undefined')
            this.props.cancelAction();
        this.props.closeModal();   
    }

    async handleOk(){
       
        this.props.dispatch(navActions.clearConfirm());
        if (this.props.okAction != null && typeof this.props.okAction != 'undefined')
            this.props.okAction();
        this.props.closeModal();   
    }

    componentDidMount(){
          //this.props.dispatch(navActions.clearConfirm());
    }
     

    render(){

        return (
                <View style={styles.container}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>{this.state.confirmTitle}</Text>
                    </View>
                    <View style={styles.messageContainer}>
                         <Text style={styles.messageText}>{this.state.confirmDetails}</Text>
                    </View>
                      <View style={styles.buttonsContainer}>
                        <Button onPress={this.handleOk.bind(this)} containerStyle={styles.singleBtnContainer} style={styles.button}>OK</Button>
                        <Button containerStyle={styles.singleBtnContainer} style={styles.button} onPress={this.handleCancel.bind(this)}>Cancel</Button>
                     </View>
                </View>
        );
    }
}


function mapStateToProps(state) {    
  return {
      hasConfirm : state.navReducer.HasConfirm, 
      confirmTitle : state.navReducer.GlobalConfirmTitle, 
      confirmDetails: state.navReducer.GlobalConfirmDetails, 
      okAction: state.navReducer.GlobalConfirmOkAction,
      cancelAction: state.navReducer.GlobalConfirmCancelAction
      
  }
}


export default connect(mapStateToProps)(Confirm)