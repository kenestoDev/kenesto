import React from 'react'
import * as accessActions from '../actions/Access'

let {
  Component
} = React
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import KenestoLauncher from '../components/KenestoLauncher'

class LauncherContainer extends Component {
  render() {
  
    return (
      <KenestoLauncher {...this.props} />
    )
  }

  


}





function mapStateToProps(state) {

  const {isFetching, env  } = state.accessReducer; 
  return {
    isFetching,
    env
  }
}


export default connect(mapStateToProps)(LauncherContainer)
