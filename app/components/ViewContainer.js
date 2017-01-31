'use strict'

import React from 'react';
import { View,Text, StyleSheet } from 'react-native'


class ViewContainer extends React.Component {

 constructor(props) {
    super(props)

    this.state = {
    };
  }

  render() {
    return (
      <View style={[styles.viewContainer, this.props.style || {}]}>
      
      
        {this.props.children}
      
      </View>
    )
  }
}

const styles = StyleSheet.create({

  viewContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "stretch"
  }
})

export default ViewContainer;
