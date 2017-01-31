import React from 'react'

let {
  Component
} = React
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import Modal from 'react-native-modalbox';


class CreateFolderContainer extends Component {
  render() {
  
    return (
      <Modal {...this.props} />
    )
  }

  


}





function mapStateToProps(state) {

  const {isLoggedIn, env  } = state.accessReducer; 
  return {
    isLoggedIn, 
    env
  }
}

export default connect(mapStateToProps)(CreateFolderContainer)
