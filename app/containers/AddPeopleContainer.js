
import React from 'react'
import  {
  View,
  Text,
  // TextInput,
  StyleSheet,
  ScrollView,
  // TouchableOpacity,
  // Dimensions,
  // TouchableWithoutFeedback
} from 'react-native'
let {
  Component
} = React
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import AddPeople from '../components/AddPeople'

class AddPeopleContainer extends Component {
  render() {
  
    return (
      <AddPeople {...this.props} />
    )
  }

}


