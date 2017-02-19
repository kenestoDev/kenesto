import React from 'react'
import { Provider } from 'react-redux'
import configureStore from './store/configure-store'

import App from './containers/app'

const store = configureStore()

<<<<<<< HEAD
class Kenesto extends React.Component {
=======
class kenesto extends React.Component {
>>>>>>> origin/master
constructor(props){
        super(props);
    }

    
  render () {
    return (
      <Provider store={store}>
            <App />
      </Provider>
    )
  }
}

<<<<<<< HEAD
export default Kenesto
=======
export default kenesto
>>>>>>> origin/master
