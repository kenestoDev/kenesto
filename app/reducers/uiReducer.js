import * as types from '../constants/ActionTypes'
function uiReducer(
    state = {
        openedDialogModalref: '',
        isSearchboxOpen: false, 
        isDrawerOpen: false, 
        isPopupMenuOpen: false,
        IsDropdownOptionsOpen: false,
        dropDownTrigger : null, 
        dropDownOptions: null,
        dropDownOptionTemplate: null,
        showDropDown: false, 
        clickedTrigger: null,
        triggerSelectedValue: '',
        addPeopleTriggerValue: 'VIEW_ONLY'
    }, action){
       switch (action.type) {
           case types.SET_DRAWER_STATE:
               return {
                   ...state, 
                   isDrawerOpen : action.isDrawerOpen
               }
            case types.SET_POPUP_MENU_STATE:
               return {
                   ...state, 
                   isPopupMenuOpen : action.isPopupMenuOpen
               }
            case types.SET_SEARCHBOX_STATE:
                return {
                    ...state, 
                    isSearchboxOpen : action.isSearchboxOpen
               }
            case types.SET_DROPDOWN_OPTIONS_STATE:
                return {
                    ...state, 
                    IsDropdownOptionsOpen : action.IsDropdownOptionsOpen
               }
            case types.SET_OPEN_MODAL_REF:
                return {
                    ...state, 
                    openedDialogModalref : action.openedDialogModalref
               }
            case  types.UPDATE_DROPDOWN_DATA: 
                return{
                    ...state,
                    dropDownTrigger : action.triggerSettings, 
                    dropDownOptions: action.options,
                    dropDownOptionTemplate: action.optionTemplate,
                    showDropDown: action.showDropDown, 
                    clickedTrigger: action.clickedTrigger
                }
            case  types.UPDATE_SELECTED_TRIGGER_VALUE: 
                addPeopleTriggerValue = state.clickedTrigger == 'addPeopleTrigger' || action.value == 'NONE' ? action.value : '';
                return{
                    ...state,
                    triggerSelectedValue: action.value,
                    showDropDown: false,
                    addPeopleTriggerValue: addPeopleTriggerValue
                }
           case  types.UPDATE_ADD_PEOPLE_TRIGGER_VALUE: 
                return{
                    ...state,
                    showDropDown: false,
                    addPeopleTriggerValue: action.addPeopleTriggerValue
                }
            case  types.FORCE_CLOSE_DROPDOWN_OPTIONS: 
            return{
                ...state,
                showDropDown: false,

            }
           default:
               return state;
       }
    }

export default uiReducer