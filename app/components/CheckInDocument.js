import React from "react"; 
import {View, Text,TextInput, StyleSheet, Animated, Dimensions} from "react-native";
import Button from "react-native-button";
import Icon from 'react-native-vector-icons/MaterialIcons';
import ProgressBar from './ProgressBar'
import config from '../utils/app.config';
import * as documentsActions from '../actions/documentsActions'
import {CheckIn} from '../actions/documentsActions'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

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

});

class CheckInDocument extends React.Component {
    constructor(props){
        super (props);
        this.state = {
             comment: '',
        };
    }

    componentDidMount() {
         this.refs.comment.focus();
    }

    checkIn() {
        this.props.dispatch(documentsActions.CheckIn(this.state.comment));
        this.props.closeModal();
    }

    render(){
        return (
            <View style={styles.container}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Check-in</Text>
                </View>
                <View style={styles.nameContainer}>
                    <TextInput
                        ref="comment"
                        value={this.state.comment}
                        onChangeText={comment => this.setState({ comment }) }
                        style={styles.textEdit}
                        placeholder="Add a comment"
                        placeholderTextColor={"#ccc"}
                        selectionColor={"orange"}
                        underlineColorAndroid={"#ccc"}
                        />
                </View>
                <View style={styles.buttonsContainer}>
                    <Button onPress={this.checkIn.bind(this) } containerStyle={styles.singleBtnContainer} style={styles.button}>Check-in</Button>
                    <Button onPress={this.props.closeModal.bind(this) } containerStyle={styles.singleBtnContainer} style={styles.button}>Cancel</Button>
                </View>
            </View>
        );
    }
}


function mapStateToProps(state) {
    const { documentsReducer} = state
    return {
        documentsReducer
    }
}

export default connect(mapStateToProps)(CheckInDocument)