import React from "react";
import {View, Text, TextInput, StyleSheet, ScrollView, Platform} from "react-native";
import Tcomb from "tcomb-form-native";
import Button from "react-native-button";
import config from '../utils/app.config';
import ProggressBar from "../components/ProgressBar";
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as accessActions from '../actions/Access'
import * as navActions from '../actions/navActions'

import stricturiEncode from 'strict-uri-encode';

var Form = Tcomb.form.Form;
var Email = Tcomb.refinement(Tcomb.String, function (s) {
  return /\S+@\S+\.\S+/.test(s);
});
Email.getValidationErrorMessage = function (value, path, context) {
  if (value == null)
     return 'The Email address field is required'; 
  return 'Email Address is not valid';
};

import _ from 'lodash';
const formStylesheet = _.cloneDeep(Form.stylesheet);
var User = Tcomb.struct({      
  username: Email,  //required email
});
var options = {
    stylesheet: formStylesheet,
    fields: {
        username: {
            placeholder: 'Enter your email address',
            label: ' ',
            autoFocus: true,
            placeholderTextColor: '#ccc',
            underlineColorAndroid: "#ccc",
            selectionColor: "orange",
        }
    }
};

formStylesheet.textbox.normal = {
    height: 50,
    marginBottom:21,                
    fontSize: 17,
    ...Platform.select({
            ios:{
                marginLeft:19,
                marginRight:19,
            },
            android:{
                marginLeft:15,
                marginRight:15,
            }
    }),
}
formStylesheet.textbox.error = {
    height: 50,            
    fontSize: 17,
    marginLeft:15,
    marginRight:15,
    marginBottom:21,     
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        marginLeft:20,marginRight:20,marginTop:40
    },
    titleContainer: {        
        backgroundColor: "#F5FCFF",
        alignItems: "center",
        padding: 14,
        borderBottomWidth: 2,
        borderBottomColor: "#e6e6e6",
        marginBottom: 14,
   },
   title: {
       color: "#000",
       fontSize: 20,
   },
   form: {
    ...Platform.select({
            ios:{
                paddingLeft:5,
                paddingRight:5,
                paddingBottom:10,
                borderColor:"#fff",
                borderWidth:1
            },
            android:{
               padding: 0
            }
    }),
   },
   instructions: {
        textAlign: "center",
        fontSize: 17,
        marginBottom: 32,
   },
    buttonsContainer: {
        marginLeft:19,
        marginRight:19,
        flex: 1,
        flexDirection: "row",
        justifyContent: 'space-between',
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
   messageContainer: {
       flex: 1, 
       justifyContent: "center",
   },
   message: {
       textAlign: "center",
        fontSize: 17,
   },
      
  
});


 class ForgotPassword  extends React.Component { 
     
    // componentDidMount() {
    //     // give focus to the name textbox
    //     this.refs.form.getComponent('username').refs.input.focus();
    // }
      constructor(props) {
         
            super(props)
            this.state = {
             value:{
                username: props.userName,
                password: "",
            },   
            env: props.env, 
            isLoading: false,
           responseStatus:''
         }
      }
    onChange(value) {
        this.setState({value});
    }
    _makeForgotPassword(){
        var { username } = this.state.value;
        var value = this.refs.form.getValue();
        if (value == null) { // if validation fails, value will be null
            return false; // value here is an instance of Person
        }

        this.props.dispatch(accessActions.ActivateForgotPassword(username, this.props.env));

    }

    _renderProgressBar(){
        if (this.props.isFetching){
            return(
            <ProggressBar isLoading={true} />
            )
        }
        else{
            return(
                <ProggressBar isLoading={false} />
            )
            
            }
        
        }

    render(){
        return (
         <ScrollView style={{flex:1, backgroundColor: "#fff"}} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="always">
          <View style={[styles.container]}>
            <View style={{flex: 1}}>
                        <View style={styles.form}>
                            {this._renderProgressBar()}
                            <Text style={styles.instructions}>Enter your email address to request a password reset</Text>
                       
                            <Form
                                ref="form"
                                type={User}
                                value={this.state.value}
                                onChange={this.onChange.bind(this)}
                                options={options}
                            />
                            <View style={styles.buttonsContainer}>
                                <Button containerStyle={styles.singleBtnContainer} style={styles.button} onPress={() => this.props._goBack()}>Cancel</Button>
                                <Button containerStyle={styles.singleBtnContainer} style={styles.button} onPress={this._makeForgotPassword.bind(this)}>Reset</Button>
                            </View>
                        </View>
                    </View>
          </View>
       </ScrollView>
        );
    }
}

function mapStateToProps(state) {
  const {isLoggedIn, hasError, errorMessage, isFetching, passwordSent} = state.accessReducer; 
  const accessReducer = state.accessReducer;

  return {
    isLoggedIn, 
    isFetching,
    hasError,
    passwordSent,
  }
}




export default connect(mapStateToProps)(ForgotPassword)