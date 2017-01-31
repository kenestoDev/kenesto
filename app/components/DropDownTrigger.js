'use strict';
import * as uiActions from '../actions/uiActions'
import ProgressBar from './ProgressBar'
import React, { Component, PropTypes} from 'react';
import {
    StyleSheet,
    View,
    TouchableWithoutFeedback,
} from 'react-native';
import {connect} from 'react-redux'
import Icon from 'react-native-vector-icons/MaterialIcons';
import _ from "lodash";
import {getTime} from '../utils/KenestoHelper'
class DropDownTrigger extends Component {

    constructor(props) {
        super(props);

        this.state = {
            selected: this.props.selected,
            triggerIsActive: false
        }
    }
    

    openDropDown() {
        this.refs.DropDownTrigger.measure((fx, fy, width, height, px, py) => {
            var triggerSettings = {
                top: py,
                left: px,
                width: width,
                height: height,
                aligning: this.props.aligningOptionsWithTrigger,
                direction: this.props.openingDirection
            }

          this.props.dispatch(uiActions.updateDropdownData(this.props.id, triggerSettings, this.props.options, this.props.optionTemplate))
        })
        
        this.setState({
            triggerIsActive: true,
        })
    }

       componentWillReceiveProps(nextprops){
           if (!nextprops.IsDropdownOptionsOpen && this.props.IsDropdownOptionsOpen) {
            this.setState({
                triggerIsActive: false
            })
        }
          var indexOfId = nextprops.fetchingList.indexOf(this.props.id);
          
         var needToChange = this.props.clickedTrigger != nextprops.clickedTrigger || this.props.triggerSelectedValue != nextprops.triggerSelectedValue;
            if (this.props.id == 'addPeopleTrigger' && nextprops.clickedTrigger == 'addPeopleTrigger' && nextprops.addPeopleTriggerValue != this.props.addPeopleTriggerValue){
                  this.setState({ selected: nextprops.addPeopleTriggerValue, isFetching: false})
            }
           else if (needToChange && nextprops.clickedTrigger == this.props.id && nextprops.triggerSelectedValue != '')
           {   
               if (nextprops.triggerSelectedValue == 'NONE')
               {    
                   var xx = this.props.id.split('_'); 
                   if (typeof xx != 'undefined' && xx.length > 1)
                    {
                        this.setState({isFetching: indexOfId > -1})
                        this.props.removeOption(xx[1])
                    }
                 
                 
               }
               else
                   
                    this.setState({ selected: nextprops.triggerSelectedValue, isFetching: indexOfId > -1})
                        this.props.dispatch(uiActions.updatedSelectedTrigerValue(''));
           }
           else{
                this.setState({ isFetching: indexOfId > -1})
           }
               
        }


    render() {
        const {dropDownTriggerTemplate, dropDownTriggerStyle, dropDownTriggerContainer, activeTriggerStyle, id} = this.props;
        return (
            <View style={[styles.dropDownTriggerContainer, dropDownTriggerContainer]}>
                <View style={[styles.dropDownTriggerStyle, dropDownTriggerStyle, this.state.triggerIsActive && activeTriggerStyle]} ref={"DropDownTrigger"}>
                    <TouchableWithoutFeedback onPress={this.openDropDown.bind(this) }>
                        
                            { dropDownTriggerTemplate(this.state.selected, this.state.isFetching)}
                        
                    </TouchableWithoutFeedback>
                </View>
            </View>
        )

      
    }

}

const styles = StyleSheet.create({
    dropDownTriggerContainer: {
        flex: 1,
        minWidth: 55,
        alignItems: "flex-end",
        paddingRight:13,
    },
    dropDownTriggerStyle: {
        height: 35,
        width: 55,        
        borderWidth: 0.5,
        // borderColor: '#F5F6F8',
        borderColor: '#000',   
    }
})

DropDownTrigger.contextTypes = {
    dropDownContext: React.PropTypes.object 
}

function mapStateToProps(state) {
  //const { navReducer, peopleReducer } = state
  const { uiReducer,peopleReducer } = state
  return {
      clickedTrigger: uiReducer.clickedTrigger, 
      triggerSelectedValue: uiReducer.triggerSelectedValue, 
       IsDropdownOptionsOpen: uiReducer.IsDropdownOptionsOpen,
      addPeopleTriggerValue: uiReducer.addPeopleTriggerValue,
      fetchingList : peopleReducer.fetchingList,
      fetchingListChanged : peopleReducer.fetchingListChanged

  }
}

export default connect(mapStateToProps)(DropDownTrigger)