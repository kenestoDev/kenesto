import * as types from '../constants/ActionTypes';

export function setDrawerState(isDrawerOpen: bool){
    return {
        type: types.SET_DRAWER_STATE, 
        isDrawerOpen : isDrawerOpen
    }
}

export function setSearchboxState(isSearchboxOpen: bool){
    return {
        type: types.SET_SEARCHBOX_STATE, 
        isSearchboxOpen : isSearchboxOpen
    }
}
export function setPopupMenuState(isPopupMenuOpen: bool){
    return {
        type: types.SET_POPUP_MENU_STATE, 
        isPopupMenuOpen : isPopupMenuOpen
    }
}
export function setDropdownOptionsState(IsDropdownOptionsOpen: bool){
    return {
        type: types.SET_DROPDOWN_OPTIONS_STATE, 
        IsDropdownOptionsOpen : IsDropdownOptionsOpen
    }
}
export function setOpenModalRef(openedDialogModalref: string){
    return {
        type: types.SET_OPEN_MODAL_REF, 
        openedDialogModalref : openedDialogModalref
    }
}
export function updateDropdownData(clickedTrigger: string, triggerSettings: object, options: object, optionTemplate: object, showDropDown: boolean = true){

  return {
      type: types.UPDATE_DROPDOWN_DATA, 
      clickedTrigger: clickedTrigger,
      triggerSettings: triggerSettings, 
      options: options,
      optionTemplate: optionTemplate,
      showDropDown : showDropDown
    }
  }
export function updatedSelectedTrigerValue(value: string){  
  return{
    type: types.UPDATE_SELECTED_TRIGGER_VALUE,
    value: value
  }
}
export function updateAddPeopleTrigerValue(value: string){  
  return{
    type: types.UPDATE_ADD_PEOPLE_TRIGGER_VALUE,
    addPeopleTriggerValue: value
  }
}
export function forceCloseDropdownOptions(){  
  return{
    type: types.FORCE_CLOSE_DROPDOWN_OPTIONS,
  }
}


