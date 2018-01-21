import React from 'react'

let {
  Component
} = React
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import Documents from '../components/Documents'

class DocumentsContainer extends Component {
  render() {
  
    return (
      <Documents {...this.props} />
    )
  }

}

function mapStateToProps(state) {
 
  const { documentsReducer,navReducer, accessReducer } = state
  const {env, sessionToken, fcmToken, isLoggedIn, isActionSend } = state.accessReducer; 
  return {
    navReducer,
    documentsReducer,
    env,
    sessionToken, 
    isConnected : accessReducer.isConnected,
    fcmToken,
    isLoggedIn,
    isActionSend
  }
}

export default connect(mapStateToProps)(DocumentsContainer)
