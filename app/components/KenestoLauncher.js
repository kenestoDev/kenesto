import React from "react";
import {View, Text, TextInput, StyleSheet, AsyncStorage, TouchableHighlight, PixelRatio} from "react-native";
import Button from "react-native-button";
import config from '../utils/app.config';
import {clearCredentials, setCredentials, getCredentials} from '../utils/accessUtils';

import ModalPicker from 'react-native-modal-picker'
import ProggressBar from "../components/ProgressBar";
import * as routes from '../constants/routes'
import * as actions from '../actions/Access'
import * as constans from '../constants/GlobalConstans'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "transparent",
    },
    container2: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#532860',
  },
     button: {
        borderRadius: 4,
        padding: 10,
        marginLeft: 10,
        marginRight: 10,
        backgroundColor: "#B8C",
  },
});


class KenestoLauncher extends React.Component {
    
    
      constructor(props){
        super(props);
    //    this.state = {
    //         textInputValue: '',
    //         isloggedIn: false, 
    //         env: 'staging'
    //     }
     
    
      
    }

    //   componentWillReceiveProps(nextProps) {
    //       alert(nextProps.isLoggedIn)
    //       if (nextProps.isLoggedIn) {
    //           var data = {
    //               key : "documents",
    //               name: "All Documents",
    //               catId: constans.ALL_DOCUMENTS,
    //               fId: "",
    //               sortDirection: constans.ASCENDING,
    //               sortBy: constans.ASSET_NAME
    //           }
    //           this.props._handleNavigate(routes.documentsRoute(data));
    //       }
    //   }




   componentWillMount(){



        var creadetiails = getCredentials({ dispatch: this.props.dispatch, login: actions.login, updateIsFetching : actions.updateIsFetching, _handleNavigate : this.props._handleNavigate});
        
    
         creadetiails.then(function(storedCredentials) {

       //      storedCredentials.props.dispatch(storedCredentials.props.login("scott@kenestodemo.com", "!QAZ@WSX" , storedCredentials.env));
             
            if (storedCredentials.hasCredentials)
            {
               storedCredentials.props.dispatch(storedCredentials.props.login(storedCredentials.storedUserName, storedCredentials.storedPassword, storedCredentials.env));
            }
            else{
                storedCredentials.props.dispatch(storedCredentials.props.updateIsFetching(false));
              
            }
        });

     

            
   }
   
  
  _renderModalPicker(){
        let index = 0;
        const data = [
            { key: index++, section: true, label: 'Environments' },
            { key: "devDudu", label: 'Dudu Dev' },
            { key: "devAdam", label: 'Adam Dev' },
            { key: "devKonstya", label: 'Konstya Dev' },
            { key: "qa", label: 'QA' },
            { key: "staging", label: 'Staging' },
            { key: "production", label: 'Production' },
        ];

        return (
            <View style={{flex:1, justifyContent:'space-around', padding:50}}>

                <ModalPicker
                    data={data}
                    initValue="Select Environment"
                    onChange={(option)=>{ this.props.dispatch(actions.setEnv(option.key))}}
                    selectStyle={{backgroundColor:"white", borderColor:"#888", borderWidth:2/PixelRatio.get()}}
                    selectTextStyle={{color:"#ff6a00"}}
                    sectionStyle={{height:130}}
                    sectionTextStyle={{color:"#000"}}
                    optionTextStyle={{color:"#ff6a00"}}
                    cancelStyle={{backgroundColor:"#fff"}}
                    cancelTextStyle={{color:"#000"}}
                     />

            </View>
        );
  }

//  <Button onPress={()=>Actions.login({isLoggnedIn: this.state.isLoggedIn, env: this.state.env, sessionToken: this.state.sessionToken, updateLoginInfo: this.props.updateLoginInfo})}>Go to login</Button>
    
   
    render(){
            if (this.props.isFetching)
            return(
                    <View {...this.props}  style={styles.container}>
                <Text>Welcome to Kenesto</Text>
                <Text>Please wait...</Text>
                    <ProggressBar isLoading={true} />
            </View>   
            )
            
            else return (
                <View {...this.props}  style={styles.container}>
                    <Text>Welcome to Kenesto</Text>
                    <View style={{flexDirection:"row"}}>
                        <Text>Current environment: </Text>
                        <Text style={{color:"#ff6a00"}}>{this.props.env}</Text>
                    </View>
                    <Text>select environment</Text>
                    {this._renderModalPicker()}
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                          <Button onPress={() => this.props._handleNavigate(routes.loginRoute)}>Go to login</Button>
                          
                         </View>
                </View>
            );
   
    }
}

module.exports = KenestoLauncher;