import React from 'react'
import * as accessActions from '../actions/Access'

let {
  Component
} = React
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import Login from '../components/Login'

class LoginContainer extends Component {

  render() {
    return (
      <Login {...this.props} />
    )
  }

}




function mapStateToProps(state) {
  const {isLoggedIn, env, hasError, errorMessage,isFetching  } = state.accessReducer; 
   const { navReducer } = state
  return {
    navReducer,
    isLoggedIn, 
    env, 
    isFetching, 
    hasError
  }
}

export default connect(mapStateToProps)(LoginContainer)
