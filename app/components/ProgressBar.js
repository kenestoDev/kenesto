import React from "react";
import {View, StyleSheet, Platform, ActivityIndicator, ActivityIndicatorIOS} from "react-native";

var styles = StyleSheet.create({
  spinner: {
    alignSelf: "center",
    width: 30,
    height: 30,
  },
});

export default class extends React.Component {

    constructor(props){
        super(props);
    }
    
    render(){
            if (this.props.isLoading) {
                return (
                    <ActivityIndicator
                        style={styles.spinner}
                        color={this.props.color || "#000"}
                        />
                )
            }
            else{
                return (
                    <View style={styles.spinner} />
                )
            }

         
    }
}
