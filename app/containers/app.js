import React from "react";
import {Platform} from 'react-native'
import TabView from "../components/TabView";
import Drawer from "react-native-drawer";
import Main from '../components/Main';
import {connect} from 'react-redux'
import * as uiActions from '../actions/uiActions'
import {navigateReset,navigateJumpToKey} from '../actions/navActions'
import ShareExtension from 'react-native-share-extension'
import _ from 'lodash'

const kenestoGroup = 'group.com.kenesto.KenestoWorkouts'
class App extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            isActionSend : false
        }
    }

isDrawerOpen()
{

 return this._drawer._open;
}
closeDrawer(){
    this._drawer.close()
}

setDrawerState(isDrawerOpen: boolean){
    this.props.dispatch(uiActions.setDrawerState(isDrawerOpen));
}

async componentDidMount() {
    try { 
        if(Platform.OS === 'android')
        {
            const {intentAction, isActionSend} = await ShareExtension.getIntentAction()
            this.setState({
            isActionSend: isActionSend})
        }
    
    } catch(e) {
      alert(e)
    }
  }

getMediaInfo()
{
    
}

render(){
        return (
            <Drawer
                ref={(ref) => this._drawer = ref}
                type="overlay"
                open= {false}
                content={<TabView loggedUser = {this.props.loggedUser} closeDrawer={this.closeDrawer.bind(this)} />}
                tapToClose={true}
                onOpen={()=>{this.setDrawerState(true)}}
                onClose={()=>{this.setDrawerState(false)}}
                openDrawerOffset={0.15}
                panCloseMask={0.2}
                negotiatePan={true}
                tweenHandler={(ratio) => ({
                 main: { opacity:Math.max(0.54,1-ratio) }
                })}>
                 
                   <Main closeDrawer={this.closeDrawer.bind(this)} isDrawerOpen={this.isDrawerOpen.bind(this)} isActionSend = {this.state.isActionSend}  />
            </Drawer>
        );
    }
}

function mapStateToProps(state) {
  return {}
}

export default connect(mapStateToProps)(App)

//export default App