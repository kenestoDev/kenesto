import * as types from '../constants/ActionTypes'
import _ from "lodash";
function peopleReducer(state = {isFetching: true, UsersAndGroups: null, ObjectInfo: null, fetchingList: [], fetchingListChanged : 0},  action){
     switch (action.type) {
        case types.UPDATE_IS_FETCHING_PEOPLE:
            return {
                ...state,
                isFetching: action.isFetching
            }
        case types.ADD_TO_FETCHING_LIST:
        var fetchingList = state.fetchingList; 
        fetchingList.push(action.id);
            return {
                ...state,
                fetchingList : fetchingList
            }
        case types.REMOVE_FROM_FETCHING_LIST:
       // alert(action.id + ' ' + state.fetchingList + ' ' + state.fetchingList.filter(obj => obj.id != action.id) )
           _.remove(state.fetchingList, function (id) {
                return action.id === id
                });

            return {
                ...state,
                fetchingListChanged : state.fetchingListChanged + 1
            //    fetchingList :  state.fetchingList.filter(obj => obj.id !== action.id)
            }
        case types.RETRIEVE_SHARE_OBJECT_INFO:
            return {
                ...state,
                UsersAndGroups: action.UsersAndGroups, 
                ObjectInfo: action.ObjectInfo, 
                isFetching: false

            }
         case types.REMOVE_FROM_SHARING_LIST:
     //    alert(state.ObjectInfo.UsersPermissions)
     
     var permissions = state.ObjectInfo.UsersPermissions.slice();
         _.remove(permissions, function (permission) {
                return action.id === permission.ParticipantUniqueID
                });
                state.ObjectInfo.UsersPermissions = permissions;
                return {
                    ...state,
                  //   fetchingListChanged : state.fetchingListChanged + 1
                    }
            
        default:
        return state
     }
   
}

export default peopleReducer