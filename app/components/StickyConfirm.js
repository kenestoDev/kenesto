import React from "react"; 
import {View, Text,TextInput, StyleSheet, Animated, Dimensions, Platform} from "react-native";
import Button from "react-native-button";
import Icon from 'react-native-vector-icons/MaterialIcons';
import ProgressBar from './ProgressBar'
import config from '../utils/app.config';
import * as documentsActions from '../actions/documentsActions'
import * as navActions from '../actions/navActions'
import {connect} from 'react-redux'

var styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        backgroundColor:"white",
         ...Platform.select({
         ios:{
            marginBottom:15,
        //marginTop:10,
            marginLeft:10,
            marginRight:10,  
         },
          android:{
            marginBottom:25,
            marginLeft:35,
            marginRight:35,
          }
        })
        //
        
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
        // borderWidth:0.5,
        // borderColor:"green",
    },
    messageText: {
        flex: 1,
        color: "#888",
        // height: 50,            
        fontSize: 17,
        textAlign: "center"
    },
    buttonsContainer: {
         ...Platform.select({
            ios:{ 
                flex: 1,
                flexDirection: "row",
                alignItems: "flex-end",
              
                justifyContent: "center",
                alignSelf: "stretch",
                padding: 10,
            },
            android:{
                flex: 2,
                flexDirection: "row",
                alignItems: "flex-end",
                justifyContent: 'space-between',
                alignSelf: "stretch"
            }})
    
   },
   singleBtnContainer: {
        width: 135,
        height: 50,
        backgroundColor: "#F5F6F8",
        ...Platform.select({
            ios:{
                    borderRadius: 10,
                     justifyContent: "center",
                    shadowColor: '#000000',
                    shadowOffset: {
                    width: 0,
                    height: 3 },
                        shadowRadius: 10,
                        shadowOpacity: 0.25
                    },
                    android:{
                         justifyContent: "space-around",
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

class StickyConfirm extends React.Component {
    constructor(props){
        super (props);

        this.state = {
            confirmTitle: this.props.confirmTitle,
            confirmDetails: this.props.confirmDetails
        };
    }

  handleCancel(){
         this.props.dispatch(navActions.clearStickyConfirm());
         if (this.props.cancelAction != null && typeof this.props.cancelAction != 'undefined')
            this.props.cancelAction();
        this.props.closeModal();   
    }

    async handleOk(){
       
        this.props.dispatch(navActions.clearStickyConfirm());
        if (this.props.okAction != null && typeof this.props.okAction != 'undefined')
            this.props.okAction();
        this.props.closeModal();   
    }

    componentDidMount(){
          //this.props.dispatch(navActions.clearConfirm());
    }
     

    render(){
        if(Platform.OS === 'ios')
        {
            return (
                        <View style={styles.container}>
                            <View style={styles.messageContainer}>
                                <Text style={styles.messageText} numberOfLines={1}>{this.state.confirmDetails}</Text>
                            </View>
                            <View style={styles.buttonsContainer}>
                                <Button onPress={this.handleOk.bind(this)} containerStyle={styles.singleBtnContainer} style={styles.button}>Done</Button>
                            </View>
                        </View>
            );
        }
        else
        {
            return (
                <View style={styles.container}>
                        <View style={styles.messageContainer}>
                             <Text style={styles.messageText} numberOfLines={1}>{this.state.confirmDetails}</Text>
                        </View>
                        <View style={styles.buttonsContainer}>
                            <Button onPress={this.handleOk.bind(this)} containerStyle={styles.singleBtnContainer} style={styles.button}>Add</Button>
                            <Button containerStyle={styles.singleBtnContainer} style={styles.button} onPress={this.handleCancel.bind(this)}>Cancel</Button>
                        </View>
                    </View> 
             );
        }

    }
}


function mapStateToProps(state) {    
  return {
      hasStickyConfirm : state.navReducer.HasStickyConfirm, 
      confirmTitle : state.navReducer.GlobalConfirmTitle, 
      confirmDetails: state.navReducer.GlobalConfirmDetails, 
      okAction: state.navReducer.GlobalConfirmOkAction,
      cancelAction: state.navReducer.GlobalConfirmCancelAction
      
  }
}


export default connect(mapStateToProps)(StickyConfirm)