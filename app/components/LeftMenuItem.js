import React from "react";
import {View, Text, StyleSheet,Image,Platform, TouchableHighlight, TouchableNativeFeedback} from "react-native";
import Button from "react-native-button";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { createIconSetFromFontello } from  'react-native-vector-icons';
import customConfig from '../assets/icons/customConfig.json';
const CustomIcon = createIconSetFromFontello(customConfig);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F5FCFF",
    },
    row: {
        alignItems: 'center',
        backgroundColor: 'white',
        flexDirection: 'row',
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 25,
        paddingRight: 15,
    },
    selectedRow: {
        backgroundColor: "#E9EAEC",
    },
    selectedItem: {
        fontWeight : '900'
    },
    itemIcon: {
        backgroundColor: 'transparent',
        fontSize: 24,
        marginRight: 15,
        color: "#999",
    },
    selectedItemIcon: {
        color: "#000",
    },
    itemTitle: {
        fontSize: 14,
        marginRight: 10,
    },
    itemCount: {
      flex: 1,
      textAlign: 'right', 
    },
    customIconContainer: {
        alignItems: 'center', 
        marginLeft: 1
    },
});


export default class LeftMenuItem extends React.Component {

     constructor(props){
         if (typeof props == 'undefined')
           
            props = null;
            
        super(props);
       
    }
    render(){
       
    
       var TouchableElement = TouchableHighlight;
        if (Platform.OS === 'android') {
                TouchableElement = TouchableNativeFeedback;
        }
 
        var rowStyle = this.props.IsSelected ? [styles.row,  styles.selectedRow] : styles.row; 
        var iconStyle = this.props.IsSelected ? [styles.itemIcon,  styles.selectedItemIcon, this.props.listItem.customStyle] : [styles.itemIcon, this.props.listItem.customStyle]; 
        var itemTitleStyle = this.props.IsSelected ? [styles.itemTitle,  styles.selectedItem, this.props.listItem.customStyle] : [styles.itemTitle, this.props.listItem.customStyle]; 
        var itemCountStyle = this.props.IsSelected ? [styles.itemCount,  styles.selectedItem] : styles.itemCount; 

        return (
            <View>
                <TouchableElement
                        onPress={this.props.onSelect}
                        onShowUnderlay={this.props.onHighlight}
                        onHideUnderlay={this.props.onUnhighlight}>
                        <View style={rowStyle}>
                        {
                            this.props.listItem.iconType === 'regular' ?
                            <Icon name={this.props.listItem.itemIcon} style={iconStyle} />
                            :
                            <View style={styles.customIconContainer}><CustomIcon name={this.props.listItem.itemIcon} style={iconStyle} /></View>
                        }
                            
                            <Text style={itemTitleStyle} >
                                {this.props.listItem.itemTitle}
                            </Text>
                            <Text style={itemCountStyle}>
                                {this.props.listItem.itemCount}
                            </Text>
                        </View>
                </TouchableElement>
            </View>
            
        );
    }
}

