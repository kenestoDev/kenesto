import React, { Component } from "react";
import { View, Text, StyleSheet, ScrollView, Platform } from "react-native";

import Button from "react-native-button";
import Icon from 'react-native-vector-icons/MaterialIcons';
import MartialExtendedConf from '../assets/icons/config.json';
import customConfig from '../assets/icons/customConfig.json';
import { createIconSetFromFontello } from 'react-native-vector-icons'
import { getDocumentPermissions } from '../actions/documentsActions'
import * as uiActions from '../actions/uiActions'
import { connect } from 'react-redux'
import { getIconNameFromExtension } from '../utils/documentsUtils'
const KenestoIcon = createIconSetFromFontello(MartialExtendedConf);
const CustomIcon = createIconSetFromFontello(customConfig);
import * as accessActions from '../actions/Access'
import _ from "lodash";
import * as Progress from 'react-native-progress';
import { writeToLog } from '../utils/ObjectUtils'
import * as constans from '../constants/GlobalConstans'
import getImageSource from './GetImageSource';
import { getTime } from '../utils/KenestoHelper';
import { hideToast, emitToast, pop } from '../actions/navActions'
import imageSource from '../assets/thumbnail_img.png';
import HTMLView from 'react-native-htmlview';
class TermsOfService extends React.Component {

    constructor(props) {

        super(props)
        this.state = {
            env: props.env,
            isLoading: false,
        }
    }

  _openTermsofService() {
     const {firstName,lastName,company,email,password} = this.props
      this.props.dispatch(pop())
     this.props.dispatch(accessActions.ActivateSignUp(firstName, lastName, company, email, password, this.props.env));
  }
  render() {
    const {accessReducer} = this.props

    return (
      <View style={styles.container}>
        <View style={styles.textContainer}>

          <ScrollView keyboardShouldPersistTaps="always" showsVerticalScrollIndicator={true}>
            <View style={{ margin: 15 }}>
              <HTMLView
                value={accessReducer.licenseAgreement}
                stylesheet={styles}
              />
            </View>
          </ScrollView>

        </View>
        <View style={styles.buttonsContainer}>
          <Button containerStyle={styles.singleBtnContainer} style={styles.button} onPress={this._openTermsofService.bind(this)}>I Agree</Button>
        </View>
      </View>

    );
  }
};

var styles = StyleSheet.create({

  container: {
    flex: 1,
  },
  textContainer: {
    flex: 5,
  },
  buttonsContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: 'center',
    alignItems: "center",
    alignSelf: "stretch",
  },
  singleBtnContainer: {
    width: 140,
    justifyContent: "center",
    height: 50,
    backgroundColor: "#F5F6F8",
    
    borderRadius: 10,
        //padding: 10,
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 3 },
        shadowRadius: 10,
        shadowOpacity: 0.25,
        // ...Platform.select({
        //     ios:{
        //             borderRadius: 10,
        //             //padding: 10,
        //             shadowColor: '#000000',
        //             shadowOffset: {
        //             width: 0,
        //             height: 3 },
        //                 shadowRadius: 10,
        //                 shadowOpacity: 0.25
        //             },
        //             android:{
        //                 borderWidth: 0.5,
        //                 borderColor: "#BEBDBD",
        //             }
        //     }),
  },
  button: {
    color: "#666666",
    fontWeight: "normal",
    fontSize: 18,
  },
  a: {
    fontWeight: '300',
    color: '#0366d6', // make links coloured pink
  },

});

function mapStateToProps(state) {
  const { accessReducer} = state
  return {
    accessReducer
  }
}
export default connect(mapStateToProps)(TermsOfService)

