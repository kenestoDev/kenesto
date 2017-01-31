import React from "react"; 
import {View, Text,TextInput, StyleSheet, Animated, Dimensions, Switch} from "react-native";
import Button from "react-native-button";
import Icon from 'react-native-vector-icons/MaterialIcons';
import ProgressBar from './ProgressBar'
import config from '../utils/app.config';
import * as documentsActions from '../actions/documentsActions'
import {getSelectedDocument} from '../utils/documentsUtils'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as constans from '../constants/GlobalConstans'
var styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        backgroundColor:"white",
        padding: 15,
    },
    titleContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10,
    },
    title: {
        fontSize: 20,
        color: "#000",
        alignSelf: "center",
    },
    nameContainer: {
        flex: 1,
        flexDirection:'row',
        alignItems: "center",
    },
    icon: {
        color: '#000',
        fontSize: 32,
        height: 30,
        position: "absolute",
        top: 18
    },
    textEdit: {
        flex: 1,
        color: "#000",
        // height: 50,            
        fontSize: 17,
        paddingLeft: 5,
        // paddingBottom: 15,
    },
    buttonsContainer: {
        flex: 1,
        flexDirection: "row",
        justifyContent: 'space-between',
        marginTop: 20, 
        alignSelf: "stretch",   
    },
    singleBtnContainer: {
        width: 140,
        justifyContent: "center",
        height: 50,
        backgroundColor: "#F5F6F8",
        borderWidth: 0.5,
        borderColor: "#BEBDBD"
   },
    button: {
        color: "#666666",
        fontWeight: "normal",
        fontSize: 18, 
   },
    creatingDocument: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor:"white",
   },
    processingMessage: {
        fontSize: 16,
        marginRight: 40
    },
    // modal: {
    //     justifyContent: 'center',
    //     alignItems: 'center'
    // },
    // InProggress: {
    //     height: 500, 
    //     width: 500
    // },
});

class EditDocument extends React.Component {
    constructor(props){
        super (props);
        var document = getSelectedDocument(this.props.documentsReducer, this.props.navReducer); 
        this.state = {
            documentName: document.Name,
            documentId:document.Id
        };
    }

 

    _edit() {
        if (this.state.documentName != false) {
           
            this.props.dispatch(documentsActions.EditDocument(this.state.documentId ,this.state.documentName));
            this.props.closeModal();
        }
    }

   componentWillReceiveProps(nextprops){
        var document = getSelectedDocument(nextprops.documentsReducer, nextprops.navReducer); 
         this.state = {
            documentName: document.Name,
            documentId:document.Id
        };
  }


     

    render(){
        return (
            <View style={styles.container}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Edit Document</Text>
                </View>
                <View style={styles.nameContainer}>
                    <TextInput
                        ref="documentName"
                        value={this.state.documentName}
                        onChangeText={documentName => this.setState({ documentName }) }
                        style={styles.textEdit}
                        placeholder="Document Name"
                        placeholderTextColor={"#ccc"}
                        selectionColor={"orange"}
                        underlineColorAndroid={"#ccc"}
                        />
                </View>
                <View style={styles.buttonsContainer}>
                    <Button onPress={this._edit.bind(this) } containerStyle={styles.singleBtnContainer} style={styles.button}>Edit</Button>
                   <Button onPress={this.props.closeModal.bind(this) } containerStyle={styles.singleBtnContainer} style={styles.button}>Cancel</Button>
                </View>

            </View>
        );
    }
}


 
function mapStateToProps(state) {
    const { documentsReducer,navReducer} = state
    return {
        documentsReducer,
        navReducer
    }
}


export default connect(mapStateToProps)(EditDocument)