import { combineReducers } from 'redux'
import navReducer from './navReducer'
import documentsReducer from './documentsReducer'
import tabReducer from './tabReducer'
import accessReducer from './accessReducer'
import peopleReducer from './peopleReducer'
import uiReducer from './uiReducer'
const rootReducer = combineReducers({
  navReducer, 
  accessReducer,
  documentsReducer, 
  peopleReducer, 
  uiReducer
})

export default rootReducer
