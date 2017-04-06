import React, { Component } from "react";
import { View, Text, TextInput, StyleSheet, TouchableWithoutFeedback, AsyncStorage, Image, Keyboard, Picker } from "react-native";
import Button from "react-native-button";
import Tcomb from "tcomb-form-native";
import config from '../utils/app.config';
import ProggressBar from "../components/ProgressBar";
import * as routes from '../constants/routes';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import * as constans from '../constants/GlobalConstans'
import * as accessActions from '../actions/Access'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { clearCredentials, setCredentials, getCredentials } from '../utils/accessUtils';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as navActions from '../actions/navActions'
const Item = Picker.Item;
import logoImage from '../assets/kenesto_logo.png';
import stricturiEncode from 'strict-uri-encode';
import MartialExtendedConf from '../assets/icons/config.json';
import { createIconSetFromFontello } from 'react-native-vector-icons';
import customConfig from '../assets/icons/customConfig.json';
import TermsofServiceModal from './TermsofServiceModal'
import Modal from 'react-native-modalbox';
import * as uiActions from '../actions/uiActions'
const KenestoIcon = createIconSetFromFontello(MartialExtendedConf);
const CustomIcon = createIconSetFromFontello(customConfig);


var Form = Tcomb.form.Form;

import _ from 'lodash';
const formStylesheet = _.cloneDeep(Form.stylesheet);

var FirstName = Tcomb.refinement(Tcomb.String, function (s) {
    return s.length >= 0;
});

FirstName.getValidationErrorMessage = function (value, path, context) {
    return 'Please enter your first name.';
};

var LastName = Tcomb.refinement(Tcomb.String, function (s) {
    return s.length >= 0;
});


LastName.getValidationErrorMessage = function (value, path, context) {
    return 'Please enter your last name.';
};

var Company = Tcomb.refinement(Tcomb.String, function (s) {
    return true;
});

var Email = Tcomb.refinement(Tcomb.String, function (s) {
    return /\S+@\S+\.\S+/.test(s);
});


Email.getValidationErrorMessage = function (value, path, context) {
    return 'Please enter a valid email address.';
};

var Password = Tcomb.refinement(Tcomb.String, function (s) {
    var passRegex = new RegExp("((?=.*[a-zA-Z])(?=.*[^a-zA-Z]).{6,20})");
    return passRegex.test(s);
});

Password.getValidationErrorMessage = function (value, path, context) {
    return 'Password must be at least 6 characters.';
};

var User = Tcomb.struct({
    firstName: FirstName,
    lastName: LastName,
    company: Company,
    email: Email,  //required email
    password: Password,
});

var firstNameIconStyle = {}
var lastNameIconStyle = {}
var companyIconStyle = {}
var emailIconStyle = {}
var passwordIconStyle = {}

// CUSTOM FIELDS TEMPLATE FOR DRAWING ICON. ref:  https://github.com/gcanti/tcomb-form-native/blob/master/lib/templates/bootstrap/textbox.js


formStylesheet.textbox.normal = {
    height: 50,
    fontSize: 17,
    paddingLeft: 40,
    paddingBottom: 15,
}
formStylesheet.textbox.error = {
    height: 50,
    fontSize: 17,
    paddingLeft: 40
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    modal: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    createTerms: {
        height: 200,
        width: 320
    },
    titleContainer: {
        backgroundColor: "#F5FCFF",
        alignItems: "center",
        padding: 14,
        borderBottomWidth: 2,
        borderBottomColor: "#e6e6e6",
        marginBottom: 14,
    },
    title: {
        color: "#000",
        fontSize: 20,
    },
    form: {
        padding: 15,
    },
    formIcon: {
        fontSize: 32,
        height: 30,
        color: '#ddd',
        position: "absolute",
        top: 5
    },
    instructions: {
        textAlign: "center",
        fontSize: 17,
        marginBottom: 32,
    },
    buttonsContainer: {
        flex: 1,
        flexDirection: "row",
        justifyContent: 'space-between',
        marginTop: 30,
    },
    singleBtnContainer: {
        width: 135,
        justifyContent: "space-around",
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
    messageContainer: {
        flex: 1,
        justifyContent: "center",
    },
    message: {
        textAlign: "center",
        fontSize: 17,
    },


});


class SignUp extends React.Component {

    // componentDidMount() {
    //     // give focus to the name textbox
    //     this.refs.form.getComponent('username').refs.input.focus();
    // }
    constructor(props) {

        super(props)
        this.state = {
            value: {
                firstName: "",
                lastName: "",
                company: "",
                email: "",
                password: "",
            },
            env: props.env,
            isLoading: false,
            responseStatus: ''
        }
    }
    onChange(value) {
        if (value.firstName != false) {
            firstNameIconStyle = { color: "#000" }
        }
        else {
            firstNameIconStyle = { color: "#ddd" }
        }

        if (value.lastName != false) {
            lastNameIconStyle = { color: "#000" }
        }
        else {
            lastNameIconStyle = { color: "#ddd" }
        }

        if (value.company != false) {
            companyIconStyle = { color: "#000" }
        }
        else {
            companyIconStyle = { color: "#ddd" }
        }

        if (value.email != false) {
            emailIconStyle = { color: "#000" }
        }
        else {
            emailIconStyle = { color: "#ddd" }
        }

        if (value.password != false) {
            passwordIconStyle = { color: "#000" }
        }
        else {
            passwordIconStyle = { color: "#ddd" }
        }
        this.setState({ value });
    }
    _openTermsofService() {
        this.openTermsofServiceModal();
    }

    goToPword() {
        this.refs.form.getComponent('password').refs.inputPword.focus();
    }
    goToLastName() {
        this.refs.form.getComponent('lastName').refs.inputLastName.focus();
    }
    goToEmail() {
        this.refs.form.getComponent('email').refs.inputEmail.focus();
    }
    goToCompany() {
        this.refs.form.getComponent('company').refs.inputCompany.focus();
    }

    firstNameTemplate(locals) {
        var stylesheet = locals.stylesheet;
        var formGroupStyle = stylesheet.formGroup.normal;
        var textboxStyle = stylesheet.textbox.normal;
        var errorBlockStyle = stylesheet.errorBlock;


        if (locals.hasError) {
            formGroupStyle = stylesheet.formGroup.error;
            textboxStyle = stylesheet.textbox.error;
        }
        var error = locals.hasError && locals.error ? <Text accessibilityLiveRegion="polite" style={errorBlockStyle}>{locals.error}</Text> : null;
        return (
            <View style={formGroupStyle}>
                <Icon name="person" style={[styles.formIcon, firstNameIconStyle]} />
                <TextInput
                    ref="inputFirstname"
                    onEndEditing={() => { locals.onEndEditing(); }}
                    returnKeyType="next"
                    placeholderTextColor={locals.placeholderTextColor}
                    selectionColor={locals.selectionColor}
                    underlineColorAndroid={locals.underlineColorAndroid}
                    onKeyPress={locals.onKeyPress}
                    placeholder={locals.placeholder}
                    style={textboxStyle}
                    value={locals.value}
                    onChangeText={(value) => { locals.onChange(value) }}
                />
                {error}
            </View>
        )
    }
    lastNameTemplate(locals) {
        var stylesheet = locals.stylesheet;
        var formGroupStyle = stylesheet.formGroup.normal;
        var textboxStyle = stylesheet.textbox.normal;
        var errorBlockStyle = stylesheet.errorBlock;


        if (locals.hasError) {
            formGroupStyle = stylesheet.formGroup.error;
            textboxStyle = stylesheet.textbox.error;
        }
        var error = locals.hasError && locals.error ? <Text accessibilityLiveRegion="polite" style={errorBlockStyle}>{locals.error}</Text> : null;
        return (
            <View style={formGroupStyle}>
                <Icon name="person" style={[styles.formIcon, lastNameIconStyle]} />
                <TextInput
                    ref="inputLastName"
                    onEndEditing={() => { locals.onEndEditing(); }}
                    returnKeyType="next"
                    placeholderTextColor={locals.placeholderTextColor}
                    selectionColor={locals.selectionColor}
                    underlineColorAndroid={locals.underlineColorAndroid}
                    onKeyPress={locals.onKeyPress}
                    placeholder={locals.placeholder}
                    style={textboxStyle}
                    value={locals.value}
                    onChangeText={(value) => { locals.onChange(value) }}
                />
                {error}
            </View>
        )
    }
    companyTemplate(locals) {
        var stylesheet = locals.stylesheet;
        var formGroupStyle = stylesheet.formGroup.normal;
        var textboxStyle = stylesheet.textbox.normal;
        var errorBlockStyle = stylesheet.errorBlock;

        if (locals.hasError) {
            formGroupStyle = stylesheet.formGroup.error;
            textboxStyle = stylesheet.textbox.error;
        }
        var error = locals.hasError && locals.error ? <Text accessibilityLiveRegion="polite" style={errorBlockStyle}>{locals.error}</Text> : null;
        return (
            <View style={formGroupStyle}>
                <CustomIcon name="building-filled" style={[styles.formIcon, companyIconStyle]} />
                <TextInput
                    ref="inputCompany"
                    onEndEditing={() => { locals.onEndEditing(); }}
                    returnKeyType="next"
                    placeholderTextColor={locals.placeholderTextColor}
                    selectionColor={locals.selectionColor}
                    underlineColorAndroid={locals.underlineColorAndroid}
                    onKeyPress={locals.onKeyPress}
                    placeholder={locals.placeholder}
                    style={textboxStyle}
                    value={locals.value}
                    onChangeText={(value) => { locals.onChange(value) }}
                />
                {error}
            </View>
        )
    }
    emailTemplate(locals) {
        var stylesheet = locals.stylesheet;
        var formGroupStyle = stylesheet.formGroup.normal;
        var textboxStyle = stylesheet.textbox.normal;
        var errorBlockStyle = stylesheet.errorBlock;

        if (locals.hasError) {
            formGroupStyle = stylesheet.formGroup.error;
            textboxStyle = stylesheet.textbox.error;
        }
        var error = locals.hasError && locals.error ? <Text accessibilityLiveRegion="polite" style={errorBlockStyle}>{locals.error}</Text> : null;
        return (
            <View style={formGroupStyle}>
                <Icon name="email" style={[styles.formIcon, emailIconStyle]} />
                <TextInput
                    ref="inputEmail"
                    onEndEditing={() => { locals.onEndEditing(); }}
                    returnKeyType="next"
                    placeholderTextColor={locals.placeholderTextColor}
                    selectionColor={locals.selectionColor}
                    underlineColorAndroid={locals.underlineColorAndroid}
                    onKeyPress={locals.onKeyPress}
                    placeholder={locals.placeholder}
                    style={textboxStyle}
                    value={locals.value}
                    onChangeText={(value) => { locals.onChange(value) }}
                />
                {error}
            </View>
        )
    }
    passwordTemplate(locals) {
        var stylesheet = locals.stylesheet;
        var formGroupStyle = stylesheet.formGroup.normal;
        var textboxStyle = stylesheet.textbox.normal;
        var errorBlockStyle = stylesheet.errorBlock;

        if (locals.hasError) {
            formGroupStyle = stylesheet.formGroup.error;
            textboxStyle = stylesheet.textbox.error;
        }
        var error = locals.hasError && locals.error ? <Text accessibilityLiveRegion="polite" style={locals.stylesheet.errorBlock}>{locals.error}</Text> : null;
        return (
            <View style={formGroupStyle}>

                <CustomIcon name="key-inv" style={[styles.formIcon, passwordIconStyle]} />
                <TextInput
                    ref="inputPword"
                    onSubmitEditing={() => { locals.onEndEditing(); }}
                    returnKeyType="done"
                    placeholderTextColor={locals.placeholderTextColor}
                    selectionColor={locals.selectionColor}
                    underlineColorAndroid={locals.underlineColorAndroid}
                    secureTextEntry={locals.secureTextEntry}
                    onKeyPress={locals.onKeyPress}
                    placeholder={locals.placeholder}
                    style={textboxStyle}
                    value={locals.value}
                    onChangeText={(value) => { locals.onChange(value) }}
                />
                {error}
            </View>
        )
    }


    openTermsofServiceModal() {
        this.openModal("termsofServiceModal");
    }
    closeModal(ref: string) {
        this.refs[ref].close();
    }
    setClosedModal() {
        this.props.dispatch(uiActions.setOpenModalRef(''))
    }

    setOpenedModal(ref: string) {
        this.props.dispatch(uiActions.setOpenModalRef(ref))
    }

    openModal(ref: string) {
        this.refs[ref].open();
    }

    _renderProgressBar() {
        if (this.props.isFetching) {
            return (
                <ProggressBar isLoading={true} />
            )
        }
        else {
            return (
                <ProggressBar isLoading={false} />
            )

        }

    }

    _renderSignUp() {
        var modalStyle = [styles.modal, styles.createTerms];
        var options = {
            stylesheet: formStylesheet,
            fields: {
                firstName: {
                    template: this.firstNameTemplate,
                    onEndEditing: this.goToLastName.bind(this),
                    placeholder: 'First Name',
                    label: ' ',
                    autoFocus: true,
                    placeholderTextColor: '#ccc',
                    underlineColorAndroid: "#ccc",
                    selectionColor: "orange",
                },
                lastName: {
                    template: this.lastNameTemplate,
                    onEndEditing: this.goToCompany.bind(this),
                    placeholder: 'Last Name',
                    label: ' ',
                    autoFocus: true,
                    placeholderTextColor: '#ccc',
                    underlineColorAndroid: "#ccc",
                    selectionColor: "orange",
                },
                company: {
                    template: this.companyTemplate,
                    onEndEditing: this.goToEmail.bind(this),
                    placeholder: 'company',
                    label: ' ',
                    autoFocus: true,
                    placeholderTextColor: '#ccc',
                    underlineColorAndroid: "#ccc",
                    selectionColor: "orange",
                },
                email: {
                    template: this.emailTemplate,
                    onEndEditing: this.goToPword.bind(this),
                    placeholder: 'Email',
                    label: ' ',
                    autoFocus: true,
                    placeholderTextColor: '#ccc',
                    underlineColorAndroid: "#ccc",
                    selectionColor: "orange",
                },
                password: {
                    template: this.passwordTemplate,
                    onEndEditing: this._openTermsofService.bind(this),
                    placeholder: 'Password',
                    label: ' ',
                    secureTextEntry: true,
                    placeholderTextColor: '#ccc',
                    underlineColorAndroid: "#ccc",
                    selectionColor: "orange",
                }
            }
        };
        return (

            <KeyboardAwareScrollView style={{ flex: 1, backgroundColor: "#fff" }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="always">
                <View style={[styles.container, this.props.style]}>
                    <View style={{ flex: 1 }}>
                        <View style={styles.titleContainer}>
                            <Text style={styles.title}>Sign Up for KENESTO</Text>
                        </View>
                        <View style={styles.form}>
                            <Form
                                ref="form"
                                type={User}
                                value={this.state.value}
                                onChange={this.onChange.bind(this)}
                                options={options}
                            />
                            <View style={styles.buttonsContainer}>
                                <Button containerStyle={styles.singleBtnContainer} style={styles.button} onPress={() => this.props._goBack()}>Cancel</Button>
                                <Button containerStyle={styles.singleBtnContainer} style={styles.button} onPress={this._openTermsofService.bind(this)}>Sign up</Button>
                            </View>
                        </View>
                    </View>
                </View>
                <Modal style={modalStyle} position={"center"} ref={"termsofServiceModal"} isDisabled={false} onClosed={() => { this.setClosedModal() }} onOpened={() => { this.setOpenedModal('termsofServiceModal') }}>
                    <TermsofServiceModal value={this.state.value} closeModal={() => this.closeModal("termsofServiceModal")} openModal={() => this.openModal("termsofServiceModal")} />
                </Modal>
            </KeyboardAwareScrollView>
        )
    }

    render() {

        return (
            <View style={[styles.container, this.props.style]}>
                {this._renderSignUp()}
            </View>
        );
    }
}

function mapStateToProps(state) {
    const {isLoggedIn, hasError, errorMessage, isFetching, passwordSent} = state.accessReducer;
    const accessReducer = state.accessReducer;

    return {
        isLoggedIn,
        isFetching,
        hasError,
        passwordSent,
    }
}




export default connect(mapStateToProps)(SignUp)