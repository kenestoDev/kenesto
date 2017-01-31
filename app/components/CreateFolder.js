import React from "react"; 
import {View, Text,TextInput, StyleSheet, Animated, Dimensions, Switch} from "react-native";
import Button from "react-native-button";
import Icon from 'react-native-vector-icons/MaterialIcons';
import ProgressBar from './ProgressBar'
import config from '../utils/app.config';
import * as documentsActions from '../actions/documentsActions'
import * as navActions from '../actions/navActions'
import {createFolder} from '../actions/documentsActions'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import { getDocumentsContext } from '../utils/documentsUtils'
import Tcomb from "tcomb-form-native";
import _ from 'lodash'

var Form = Tcomb.form.Form;

var ileagleChars = Tcomb.refinement(Tcomb.String, function (s) {
    if (s.length > 200)
        return false;
    var test =  /^[^;<>:\"/\\\\|?*]+$/.test(s);
    return test;
});

ileagleChars.getValidationErrorMessage = function (value, path, context) {
    if (value == '' || value == null)
        return 'Folder name cannot be empty';
     if (value.length > 200)
        return 'Folder Name is limited to 200 chars';
  return 'Name cannot contain any of the following characters: /\;*?"<>|';
  //return 'Name cannot contain special characters'
};
let formStylesheet = _.cloneDeep(Form.stylesheet);
formStylesheet.textbox.normal = {
      color: "#000000",
      fontSize: 17,
      height: 40,
      padding: 7,
      marginBottom: 5
}
formStylesheet.textbox.error = {
      color: "#000000",
      fontSize: 17,
      height: 40,
      padding: 7,
      marginBottom: 5,
}

formStylesheet.formGroup= {
    normal: {
      marginTop: -15
    },
    error: {
      marginTop: -15, 
    }
}

var inputFolder = Tcomb.struct({      
  folderName: ileagleChars,  //required email
});


var options = {
    stylesheet: formStylesheet,
    fields: {
        folderName: {
            placeholder: 'Folder Name',
            label: ' ',
            autoFocus: true,
            placeholderTextColor: '#ccc',
            underlineColorAndroid: "#ccc",
            selectionColor: "orange",
        }
    }
};

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
    creatingFolder: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor:"white",
   },
    processingMessage: {
        fontSize: 16,
        marginRight: 40
    },
    form: {
        alignSelf: 'stretch'
    }
});

class CreateFolder extends React.Component {
    constructor(props){
        super (props);

        this.state = {
            isVault: false,
            value:{
                 folderName: ''
            },   
          
        };

       // alert(this.state.folderName)
    }


    create() {
       //alert(this.state.folderName  != '')

        var value = this.refs.form.getValue();
        if (value == null) { // if validation fails, value will be null
            return false; // value here is an instance of Person
        }

        var {folderName} = this.state.value;

      if (folderName != '') {
            // this.props.setCreateFolderStyle();
            this.props.closeCreateFolder();
             this.props.dispatch(navActions.updateIsProcessing(true));
            setTimeout(() => {
                this.props.dispatch(createFolder(folderName, this.state.isVault || this.props.isParentVault));
            }, 100); 
 
 
        }

    }

     onChange(value) {
            this.setState({value});
    }

    render(){

        if (this.props.creatingFolder == 1){
            return(         
                    <View style={styles.creatingFolder}>
                        <Text style={styles.processingMessage}>Creating a new folder</Text> 
                        <ProgressBar isLoading={true}/>
                    </View>
          
            )
        }

                        //     <TextInput
                        // ref="folderName"
                        // value={this.state.folderName}
                        // onChangeText={folderName => this.setState({ folderName }) }
                        // style={styles.textEdit}
                        // placeholder="Folder Name"
                        // placeholderTextColor={"#ccc"}
                        // selectionColor={"orange"}
                        // underlineColorAndroid={"#ccc"}
                        // />

        return (
           
            <View style={styles.container}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Add Folder</Text>
                </View>
                <View style={styles.form}>
                    <Form
                        ref="form"
                        type={inputFolder}
                        value={this.state.value}
                        onChange={this.onChange.bind(this)}
                        options={options}
                    />
                </View>
                <View style={styles.nameContainer}>
                    <Text style={styles.textEdit}>Vault folder</Text>
                    <Switch
                        onValueChange={(value) => this.setState({ isVault: value }) }
                        disabled={this.props.isParentVault}
                        value={this.state.isVault || this.props.isParentVault} />
                </View>
                <View style={styles.buttonsContainer}>
                    <Button onPress={this.create.bind(this) } containerStyle={styles.singleBtnContainer} style={styles.button}>Add</Button>
                    <Button onPress={this.props.closeCreateFolder.bind(this) } containerStyle={styles.singleBtnContainer} style={styles.button}>Cancel</Button>
                </View>

            </View>
        );
    }
}


 
function mapStateToProps(state) {    

 var documentlist = getDocumentsContext(state.navReducer);

  return {
    isParentVault : documentlist.isVault,
    creatingFolder : state.documentsReducer.creatingFolder
  }
}

// function  matchDispatchToProps(dispatch) {
//     return bindActionCreators({
//        createFolder : documentsActions.createFolder, 
       
//         dispatch,
       
//     }, dispatch)
    
// }

export default connect(mapStateToProps)(CreateFolder)