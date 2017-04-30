import React from "react"; 
import {View, Text,TextInput, StyleSheet, Platform } from "react-native";
import Button from "react-native-button";
import Icon from 'react-native-vector-icons/MaterialIcons';
import ProgressBar from './ProgressBar'
import TermsOfService from './TermsOfService'
import config from '../utils/app.config';
import * as accessActions from '../actions/Access'
import {CheckIn} from '../actions/documentsActions'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

var styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        backgroundColor:"white",
        padding: 10,
    },
    titleContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10,
    },
    title: {
        fontSize: 20,
        color: "#000",
        alignSelf: "center",
    },
    nameContainer: {
        flex: 1,
        flexDirection:'row',
        alignItems: "center",
        marginBottom:20
    },
    icon: {
        color: '#000',
        fontSize: 32,
        height: 30,
        position: "absolute",
        top: 18
    },
    textEdit: {
        flex: 1,
        color: "#000",
        // height: 50,            
        fontSize: 17,
        paddingLeft: 5,
        // paddingBottom: 15,
    },
    buttonsContainer: {
        flex: 1,
        flexDirection: "row",
        justifyContent: 'space-between',
       
        paddingLeft:3,
        paddingRight:3,
        paddingTop:3,
        marginBottom:3,
        alignSelf: "stretch",  
    },
    singleBtnContainer: {
         ...Platform.select({
            ios:{
                width: 127,
            },
            android:{
                width: 140,
            }
        }),
        justifyContent: "center",
        height: 50,
        backgroundColor: "#F5F6F8",
        borderWidth: 0.5,
        borderColor: "#BEBDBD",      
   },
    button: {
      
        color: "#666666",
        fontWeight: "normal",
        fontSize: 18, 
   },

});

class TermsofServiceModal extends React.Component {
    constructor(props){
        super (props);
    }

    componentDidMount() {
         
    }
   
   _navigateToTermsOfService(){
      var { firstName, lastName, email, password, company, env } = this.props.value;
      const  termsOfServiceRoute = {
                type: 'push',
                route: {
                    key: 'termsOfService',
                    title: 'termsOfService',
                    firstName: firstName,
                    lastName: lastName, 
                    email: email, 
                    password: password,
                    company: company,
                    env: this.props.env
                }
        }
        this.props._handleNavigate(termsOfServiceRoute)
         this.props.closeModal();
   }
    _makeSignUp() {
        var { firstName, lastName, email, password, company, env } = this.props.value;
        this.props.dispatch(accessActions.ActivateSignUp(firstName, lastName, company, email, password, this.props.env));
        this.props.closeModal();
    }
   
    render(){
        return (
            <View style={styles.container}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Terms of Service</Text>
                </View>
                <View style={styles.nameContainer}>
                  <Text>Before you can complete your registration, you must accept the Kenesto Terms of Service.</Text>
                </View>
                <View style={styles.buttonsContainer}>
                    <Button onPress={this._makeSignUp.bind(this) } containerStyle={styles.singleBtnContainer} style={styles.button}>I Agree</Button>
                    <Button onPress={this._navigateToTermsOfService.bind(this)} containerStyle={styles.singleBtnContainer} style={styles.button}>View Terms</Button>
                </View>
            </View>
        );
    }
}


function mapStateToProps(state) {
   // const { documentsReducer} = state
    return {
        //documentsReducer
    }
}

export default connect(mapStateToProps)(TermsofServiceModal)