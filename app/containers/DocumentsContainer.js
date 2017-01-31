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
  const {env, sessionToken } = state.accessReducer; 
  return {
    navReducer,
    documentsReducer,
    env,
    sessionToken, 
    isConnected : accessReducer.isConnected
    
  }
}

export default connect(mapStateToProps)(DocumentsContainer)
