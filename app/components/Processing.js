import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  NativeModules
} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { connect } from 'react-redux'
import fontelloConfig from '../assets/icons/config.json';
import { createIconSetFromFontello } from 'react-native-vector-icons'
import ProggressBar from "../components/ProgressBar";

var ImagePicker = NativeModules.ImageCropPicker;
const KenestoIcon = createIconSetFromFontello(fontelloConfig);

let styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor:"white",
    },
    proggressBarHolder: {
        width: 50,
        height: 90,
        margin: 5,
        alignItems: "center",
        justifyContent: "center",
    },

})

class Processing  extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    render() {
        return (
            <View style={styles.container}> 
             <View style={styles.proggressBarHolder}>               
                <ProggressBar isLoading={true} /> 
              </View>
                <Text>Processing, Please wait...</Text> 
            </View>
        )
    }

}

function mapStateToProps(state) {
    const { navReducer } = state
    return {
        navReducer: navReducer,
    }
}


export default connect(mapStateToProps)(Processing)