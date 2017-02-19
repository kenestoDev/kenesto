import React, { Component } from "react";
import {View, Text, TextInput, StyleSheet, TouchableWithoutFeedback, AsyncStorage, Image, Keyboard,Picker} from "react-native";
import Button from "react-native-button";
import Tcomb from "tcomb-form-native";
import config from '../utils/app.config';
import ProggressBar from "../components/ProgressBar";
import * as routes from '../constants/routes';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import * as constans from '../constants/GlobalConstans'
import * as accessActions from '../actions/Access'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import {clearCredentials, setCredentials, getCredentials} from '../utils/accessUtils';
const Item = Picker.Item;
import logoImage from '../assets/kenesto_logo.png';
import stricturiEncode from 'strict-uri-encode';

var Form = Tcomb.form.Form;

import _ from 'lodash';
const formStylesheet = _.cloneDeep(Form.stylesheet);

var Email = Tcomb.refinement(Tcomb.String, function (s) {
  return /\S+@\S+\.\S+/.test(s);
});
Email.getValidationErrorMessage = function (value, path, context) {
  return 'Email Address is not valid';
};

var Password = Tcomb.refinement(Tcomb.String, function (s) {
  return s.length >= 0;
});

Password.getValidationErrorMessage = function (value, path, context) {
  return 'Field is required!';
};

var User = Tcomb.struct({      
  username: Email,  //required email
  password: Password,
});

var usernameIconStyle = {}
var passwordIconStyle = {}
// CUSTOM FIELDS TEMPLATE FOR DRAWING ICON. ref:  https://github.com/gcanti/tcomb-form-native/blob/master/lib/templates/bootstrap/textbox.js


formStylesheet.textbox.normal = {
    height: 50,            
    fontSize: 17,
    paddingLeft: 40,
    paddingBottom: 15,  
}
formStylesheet.textbox.error = {
    height: 50,            
    fontSize: 17,
    paddingLeft: 40  
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: "#fff",
        padding: 36,
    },
    formContainer: {
        flex: 1,
    },
    logoContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: "space-between",
    },
    logo: {
        width: 184,
        height: 61, 
    },
    loginBtn: {       
        color: "#fff",
        fontWeight: "bold",
        fontSize: 18,
    },
    loginBtnContainer: {
        height: 50,
        backgroundColor: "#F6841F",
        justifyContent: "center",
        marginTop: 20,
    },
    forgotPwd: {
        alignSelf: "center",
        fontSize: 16,   
        marginTop: 12,    
    },
    form: {
        flex: 2,
        paddingTop: 20,
    },
    formIcon: {
        fontSize: 32,
        height: 30,
        color: '#ddd',
        position: "absolute",
        top: 5
    },  
    formIcon2: {
        fontSize: 32,
        height: 30,
        color: '#000',
        position: "absolute",
        top: 5
    },  
    loading: {
        justifyContent: 'center', 
        alignItems: 'center', 
        // backgroundColor: '#fefefe',

        position: "absolute", 

        top: 0, left: 0, bottom: 0, right: 0
    },
     picker: {
     width: 130
    }
});


 export default class Login  extends React.Component { 
     constructor(props) {
         var initialEnv = __DEV__ ? 'dev' : 'production'
         super(props)
         this.state = {
             selectedEnv: initialEnv,
             value: {
                 username: "",
                 password: "",
             },
         }
     }
    
    onChange(value) {
        if(value.username != false){
            usernameIconStyle = { color: "#000" }
        }
        else {
            usernameIconStyle = { color: "#ddd" }
        }
        if(value.password != false){
            passwordIconStyle = { color: "#000" }
        }
        else {
            passwordIconStyle = { color: "#ddd" }
        }
        // this.props.Update
        this.setState({value});
    }


   NavigateToForgotPassword(){

      const  forgotPasswordRoute = {
                type: 'push',
                route: {
                    key: 'forgotPassword',
                    title: 'forgotPassword',
                    userName: this.state.value.username,
                    env: this.state.selectedEnv
                }
                }
        this.props._handleNavigate(forgotPasswordRoute)
   }

    directLogin(uName: string, pWord: string , env : string){
      // this.updateIsLoading(true); 
       Keyboard.dismiss();
       this.props.dispatch(accessActions.login( uName, pWord, env))
     
   }

   _makeLogin(){
       var value = this.refs.form.getValue();
        if (value == null) { // if validation fails, value will be null
            return false; // value here is an instance of Person
        }
     //   this.updateIsLoading(true); 
       Keyboard.dismiss();
       this.props.dispatch(accessActions.login(this.state.value.username,this.state.value.password, this.state.selectedEnv));
     
   }

   goToPword(){
       this.refs.form.getComponent('password').refs.inputPword.focus();
   }

//    updateIsLoading(isLoading : boolean){
//         this.setState({isLoading : isLoading})
//    }

   onEnvChange = (key: string) => {
        this.setState({selectedEnv : key});
    };
    renderLoading(){
            
            return (

                <View style={{height: 460}}>
                    <View style={styles.logoContainer}><Image source={logoImage} style={styles.logo}></Image></View>
                    <View style={styles.loading}>
                        <ProggressBar isLoading={true} size={50} color={"#3490EF"} />
                    </View>

            </View>
            )
    }


    renderEnvPicker(){
        if (!__DEV__)
            return null; 
            
            return(
                 <Picker
                    style={styles.picker}
                    selectedValue={this.state.selectedEnv}
                    onValueChange={this.onEnvChange.bind(this)}
                    mode="dropdown"
                    >
                    <Item label="Dev" value="dev" />
                    <Item label="QA" value="qa" />
                    <Item label="Staging" value="staging" />
                    <Item label="Production" value="production" />
                 </Picker>
            )
    }


   usernameTemplate(locals) {
       var stylesheet = locals.stylesheet;
       var formGroupStyle = stylesheet.formGroup.normal;
       var textboxStyle = stylesheet.textbox.normal;
       var errorBlockStyle = stylesheet.errorBlock;


       if (locals.hasError) {
           formGroupStyle = stylesheet.formGroup.error;
           textboxStyle = stylesheet.textbox.error;
       }
       var error = locals.hasError && locals.error ? <Text accessibilityLiveRegion="polite" style={errorBlockStyle}>{locals.error}</Text> : null;
       return (
           <View style={formGroupStyle}>
               <Icon name="person" style={[styles.formIcon, usernameIconStyle]} />
               <TextInput
                   ref="inputUname"
                   onEndEditing={() => {locals.onEndEditing(); }}
                   returnKeyType ="next"
                   placeholderTextColor={locals.placeholderTextColor}
                   selectionColor={locals.selectionColor}
                   underlineColorAndroid={locals.underlineColorAndroid}
                   onKeyPress={locals.onKeyPress}
                   placeholder={locals.placeholder}
                   style={textboxStyle}
                   value={locals.value}
                   onChangeText={(value) => { locals.onChange(value) } }
                   />
               {error}
           </View>
       )
   }

     passwordTemplate(locals) {
         var stylesheet = locals.stylesheet;
         var formGroupStyle = stylesheet.formGroup.normal;
         var textboxStyle = stylesheet.textbox.normal;
         var errorBlockStyle = stylesheet.errorBlock;

         if (locals.hasError) {
             formGroupStyle = stylesheet.formGroup.error;
             textboxStyle = stylesheet.textbox.error;
         }
         var error = locals.hasError && locals.error ? <Text accessibilityLiveRegion="polite" style={locals.stylesheet.errorBlock}>{locals.error}</Text> : null;
         return (
             <View style={formGroupStyle}>
                 <Icon name="https" style={[styles.formIcon, passwordIconStyle]} />
                 <TextInput
                     ref="inputPword"
                     onSubmitEditing ={() => {locals.onEndEditing();}}
                     returnKeyType ="done"
                     placeholderTextColor={locals.placeholderTextColor}
                     selectionColor={locals.selectionColor}
                     underlineColorAndroid={locals.underlineColorAndroid}
                     secureTextEntry={locals.secureTextEntry}
                     onKeyPress={locals.onKeyPress}
                     placeholder={locals.placeholder}
                     style={textboxStyle}
                     value={locals.value}
                     onChangeText={(value) => { locals.onChange(value) } }
                     />
                 {error}
             </View>
         )
     }
    
    _renderLogin(){
       
       var options = {
    stylesheet: formStylesheet,
    fields: {
        username: {
            template: this.usernameTemplate,
            onEndEditing: this.goToPword.bind(this),
            placeholder: 'Email',
            label: ' ',
            autoFocus: true,
            placeholderTextColor: '#ccc',
            underlineColorAndroid: "#ccc",
            selectionColor: "orange",
        },
        password: {
            template: this.passwordTemplate,
            onEndEditing: this._makeLogin.bind(this),
            placeholder: 'Password',
            label: ' ',
            secureTextEntry: true,
            placeholderTextColor: '#ccc',
            underlineColorAndroid: "#ccc",
            selectionColor: "orange",
        }
    }
};

                            
            return(

                <KeyboardAwareScrollView style={{flex:1}} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="always">
                    <View style={{height: 460}}>
                        <View style={styles.logoContainer}><Image source={logoImage} style={styles.logo}></Image></View>
                        <View style={styles.form}><Form
                                    ref="form"
                                    type={User}
                                    value={this.state.value}
                                    onChange={this.onChange.bind(this)}
                                   
                                    options={options}
                                />
                            {this.renderEnvPicker()}
                            
                            <Button containerStyle={styles.loginBtnContainer} onPress={this._makeLogin.bind(this)} style={styles.loginBtn}>Login</Button>

                            <TouchableWithoutFeedback onPress={ this.NavigateToForgotPassword.bind(this)} >
                                <View>
                                    <Text style={styles.forgotPwd}>Forgot Your Password?</Text>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>     
                    </View>                
                </KeyboardAwareScrollView>
              )
    }
   componentWillMount(){
        getCredentials().then((storedCredentials) => {
            if (storedCredentials.hasCredentials)
            {
                this.directLogin(storedCredentials.storedUserName, storedCredentials.storedPassword, storedCredentials.env);
            }
 
        });

   }


    render(){
        if (this.props.isFetching ){
            return (
                <View style = {styles.container}>
                      {this.renderLoading()}
                </View>
            )
        }
        
        return (
          <View style={[styles.container, this.props.style]}>
            {this._renderLogin()}
          </View>
       
        );
    }
}


Login.contextTypes = {
    errorModal:  React.PropTypes.object
};

// export default Login;


// // module.exports = Login;