import React, { Component } from 'react'
import Icon from 'react-native-vector-icons/MaterialIcons'
import {getDocumentsContext} from '../utils/documentsUtils'
import * as constans from '../constants/GlobalConstans'
import * as documentsActions from '../actions/documentsActions'
import * as navActions from '../actions/navActions'
import * as uiActions from '../actions/uiActions'
import {getDocumentsTitle} from '../utils/documentsUtils'
import * as routes from '../constants/routes'
import {hideToast, emitToast} from '../actions/navActions'
import * as Animatable from 'react-native-animatable';

import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ToolbarAndroid,
  TouchableHighlight,
  TouchableNativeFeedback,
  Platform
} from 'react-native'

let styles = StyleSheet.create({
  toolbar: {
    backgroundColor: '#fff',
    height: 50,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 9,
  },

  iconStyle: {
    fontSize: 24,
    padding: 3,
    color: "#000",
    textAlign: "center",
    textAlignVertical: "center",
  },
  iconDisabled: {
    color: "#ccc",
  },
  arrowUp: {
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 5,
    paddingRight: 5,
    marginBottom: -10,
    fontSize: 20,
  },
  arrowDown: {
    paddingTop: 0,
    paddingBottom: 0,
    fontSize: 20,
    marginBottom: -2,
  },
  shareIconContainer: {
    marginRight: 5,
  },
  shareIcon: {
    color: "#888",
    fontSize: 20
  },
  folderName: {
    justifyContent: "flex-start",
    flex: 1,
    paddingLeft: 10,
  },
  searchBoxContainer: {
    paddingLeft: 9,
    paddingRight: 9,
    flexDirection: "row",
    height: 50,
    alignItems: "center",
    backgroundColor: "#fff"
  },
  textInputContainer: {
    flex: 1,
  },
  textInput: {
    flex: 1,
    flexDirection: "row",
  },
  popupInactive: {
    marginRight: 1
  },
  popupActive: {
    borderWidth: 1,
    borderColor: "#999",
    borderRightColor: "#999",
    marginRight: -1,
    backgroundColor: "#fff"
  },
  sortingInactive: {
    borderWidth: 1,
    borderLeftColor: "transparent",
    borderColor: "#ccc",
  },
  buttonsInactive: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  buttonsActive: {
    flexDirection: "row",
  },
  moreMenu: {
    fontSize: 22,
    color: '#888',
  },
  fakeTextInput: {
    opacity: 0,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 50,
    paddingLeft: 9,
    paddingRight: 9,
    flexDirection: "row",
    alignItems: "center",
  },
  fakeTextInputCover: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  searchBoxFakeToolbar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0,
    borderWidth: 1
  },
  fakeSortingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,

    height: 50,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 9,
    // opacity: 0
  }
})


class KenestoToolbar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isSearchBoxOpen: false,
      animateToolBar: false,
      searchText: ""
    }
  }

  onPressSearchBox() {
    const {navReducer} = this.props
    var showGoBack = navReducer.routes[navReducer.index].data.fId != "" ? true : false;
    this.props.dispatch(documentsActions.toggleSearchBox(true));
    this.openingSearchBoxAnimation(showGoBack).then(() => {

      var documentlist = getDocumentsContext(navReducer);
     documentlist.isSearch = true;
    
      this.props.dispatch(navActions.updateRouteData(documentlist));
      this.props.dispatch(uiActions.setSearchboxState(true));
      this.setState({
        isSearchBoxOpen: true,
        searchText: ""
      })
    });
  }

  openingSearchBoxAnimation(showGoBack) {
    return new Promise((resolve, reject) => {
      var counter = 0;
      var updateCounter = function () {
        counter++;
        if (counter >= 3) {
          resolve(counter);
        }
      }

      if (!showGoBack) {
        this.refs.hamburgerMenu.transition({ opacity: 1, rotate: '0deg' }, { opacity: 0, rotate: '180deg' }, 400);
        this.refs.arrowBack.transition({ opacity: 0, rotate: '180deg' }, { opacity: 1, rotate: '360deg' }, 400);
      }
      this.refs.folderTitle.fadeOut(400).then(() => updateCounter()).catch(() => updateCounter());
      this.refs.fakeTextInput.fadeIn(400).then(() => updateCounter()).catch(() => updateCounter());
      this.refs.searchIcon.transition({ translateX: 0 }, { translateX: 63 }, 400);
      this.refs.sorting.slideOutRight(400).then(() => updateCounter()).catch(() => updateCounter());
    })
  }

  onGoBack() {
    this.props.onActionSelected(1)
    this.props.dispatch(hideToast());
  }

  onSort() {
    this.props.onActionSelected(2)
  }

  onSortBy(value) {
    this.props.onActionSelected(3, value)
  }

  onPressPopupMenu() {
    this.props.onPressPopupMenu();
  }

  hidePopupMenu() {
    this.props.hidePopupMenu();
  }

  hideSearchBox() {
    const {navReducer} = this.props;
    var showGoBack = navReducer.routes[navReducer.index].data.fId != "" ? true : false;
    this.props.dispatch(documentsActions.toggleSearchBox(false));
    // this.closingSearchBoxAnimation(showGoBack).then(()=>{
    // this.props.dispatch(documentsActions.toggleSearchBox(false));
    var documentlist = getDocumentsContext(navReducer);
    this.props.dispatch(uiActions.setSearchboxState(false));
    // this.props.dispatch(navActions.updateRouteData(documentlist));
    this.setState({
      isSearchBoxOpen: false,
    })
    // })
  }

  // closingSearchBoxAnimation(showGoBack){
  //   return new Promise((resolve, reject) => {
  //     var counter = 0;
  //     var updateCounter = function () {
  //       counter++;
  //       if (counter >= 2) {
  //         console.log('resolve')
  //         resolve(counter);
  //       }
  //     }

  //     if (!showGoBack) {
  //       this.refs.fakeHamburgerMenu.transition({ opacity: 0, rotate: '180deg' }, { opacity: 1, rotate: '0deg' }, 400);
  //       this.refs.searchArrowBack.transition({ opacity: 1, rotate: '0deg' }, { opacity: 0, rotate: '-180deg' }, 400);
  //     }
  //     // this.refs.fakeFolderTitle.fadeIn(600).then(() => updateCounter()).catch(() => updateCounter());
  //     this.refs.textInput.fadeOut(400).then(() => updateCounter()).catch(()=>updateCounter());
  //     this.refs.searchBoxSearchIcon.transition({translateX: 0}, {translateX: -63}, 400);
  //     this.refs.fakeSorting.fadeInRight(400).then(() => updateCounter()).catch(() => updateCounter());
  //   })
  // }

  _submitSearch(text) {
   
    const {navReducer} = this.props
    var documentlist = getDocumentsContext(navReducer);
    documentlist.keyboard = text;
    documentlist.sortDirection = constans.ASCENDING;
    documentlist.sortBy = constans.ASSET_NAME;
    this.props.dispatch(documentsActions.refreshTable(documentlist, true));
    this.setState({
      searchText: text
    });

  }

  menuPressed(id, familyCode) {
    var {dispatch} = this.props;
      if (!this.props.isConnected){
        dispatch(emitToast("info", "No internet connection")); 
        return false;
      }
    dispatch(documentsActions.updateSelectedObject(id, familyCode, ""));
    dispatch(documentsActions.getDocumentPermissions(id, familyCode))
    this.context.itemMenuContext.open();
    dispatch(uiActions.setOpenModalRef('modalItemMenu'));
  }

  renderSearchBox() {
    const {navReducer} = this.props
    var documentlist = getDocumentsContext(navReducer);
    const sortDirection = documentlist.sortDirection != undefined ? documentlist.sortDirection : "";

    return (
      <View style={styles.searchBoxContainer}>

        <View>
          <Animatable.View ref="fakeHamburgerMenu" style={{ opacity: 0 }}><Icon name="menu" style={[styles.iconStyle, { color: "orange" }]} /></Animatable.View>
          <Animatable.View ref="searchArrowBack" style={[{ position: 'absolute', top: 0, left: 0, opacity: 1 }]}><Icon name="arrow-back" onPress={this.hideSearchBox.bind(this) } style={styles.iconStyle} /></Animatable.View>
        </View>

        <Animatable.View style={styles.textInputContainer} ref="textInput"><TextInput autoFocus={true} style={styles.textInput} onChangeText={(text) => this._submitSearch(text) } value={this.state.searchText}/></Animatable.View>

        <View><Animatable.View ref="searchBoxSearchIcon"><Icon name="search" style={[styles.iconStyle]} /></Animatable.View></View>

        <Animatable.View ref="fakeSorting" style={[{ opacity: 0, position: 'absolute', right: 9, top: 0, marginVertical: 9 }, this.props.isPopupMenuOpen ? styles.buttonsActive : styles.buttonsInactive]}>
          <View style={[styles.popupInactive, this.props.isPopupMenuOpen ? styles.popupActive : {}]}>
            <Icon name="more-vert" style={[styles.iconStyle]} />
          </View>

          <View style={this.props.isPopupMenuOpen ? styles.sortingInactive : {}}>
            {sortDirection == constans.ASCENDING ?
              <View>
                <Icon name="keyboard-arrow-up" style={[styles.iconStyle, styles.arrowUp]} />
                <Icon name="keyboard-arrow-down" style={[styles.iconStyle, styles.arrowDown, styles.iconDisabled]} />
              </View>
              :
              <View>
                <Icon name="keyboard-arrow-up" style={[styles.iconStyle, styles.arrowUp, styles.iconDisabled]} />
                <Icon name="keyboard-arrow-down" style={[styles.iconStyle, styles.arrowDown]} />
              </View>
            }
          </View>
        </Animatable.View>

      </View>
    )
  }

  renderDocumentsToolbar() {
    const {navReducer} = this.props
    var documentlist = getDocumentsContext(navReducer);
    // const sortBy = documentlist.sortBy;
    const sortDirection = documentlist.sortDirection != undefined ? documentlist.sortDirection : "";
    var title = navReducer.routes[navReducer.index].data != null ? navReducer.routes[navReducer.index].data.name : navReducer.routes[navReducer.index].title;
    var showGoBack = navReducer.routes[navReducer.index].data.fId != "" ? true : false;
    console.log('showGoBack = '  + showGoBack + ' title = ' + title )
    return (
      <View style= {styles.toolbar}>

        <Animatable.View style={styles.fakeTextInput} ref="fakeTextInput">
          <View><Icon name="arrow-back" style={[styles.iconStyle, { opacity: 0 }]} /></View>
          <TextInput style={styles.textInput} />
          <View style={styles.fakeTextInputCover} />
          <Icon name="search" style={[styles.iconStyle, { opacity: 0 }]} />
        </Animatable.View>

        {showGoBack ?
          <Icon name="arrow-back" style={[styles.iconStyle]} onPress={this.onGoBack.bind(this) } />
          :
          <View style={{ flexDirection: 'row' }}>
            <Animatable.View ref="arrowBack" style={{ opacity: 0, position: 'absolute' }}><Icon name="arrow-back" style={styles.iconStyle} /></Animatable.View>
            <Animatable.View ref="hamburgerMenu"><Icon name="menu" style={[styles.iconStyle, { color: "orange" }]} onPress={this.props.onIconClicked} /></Animatable.View>
          </View>
        }

        <Animatable.View ref="folderTitle" style={[styles.folderName]}>
          <Text style={{ fontSize: 20 }} numberOfLines={1}>{title}</Text>
        </Animatable.View>

        <View><Animatable.View ref="searchIcon"><Icon name="search" style={[styles.iconStyle]}  onPress={this.onPressSearchBox.bind(this) }/>
        </Animatable.View></View>

        <Animatable.View ref="sorting" style={[this.props.isPopupMenuOpen ? styles.buttonsActive : styles.buttonsInactive]}>
          <View style={[styles.popupInactive, this.props.isPopupMenuOpen ? styles.popupActive : {}]}>
            <Icon name="more-vert" style={[styles.iconStyle]} onPress={this.onPressPopupMenu.bind(this) } />
          </View>

          <View style={this.props.isPopupMenuOpen ? styles.sortingInactive : {}}>
            {sortDirection == constans.ASCENDING ?
              <View>
                <Icon name="keyboard-arrow-up" style={[styles.iconStyle, styles.arrowUp]}  onPress={this.onSort.bind(this) }/>
                <Icon name="keyboard-arrow-down" style={[styles.iconStyle, styles.arrowDown, styles.iconDisabled]} onPress={this.onSort.bind(this) }/>
              </View>
              :
              <View>
                <Icon name="keyboard-arrow-up" style={[styles.iconStyle, styles.arrowUp, styles.iconDisabled]}  onPress={this.onSort.bind(this) }/>
                <Icon name="keyboard-arrow-down" style={[styles.iconStyle, styles.arrowDown]} onPress={this.onSort.bind(this) }/>
              </View>
            }
          </View>
        </Animatable.View>
      </View>
    )
  }

  renderDocumentToolbar() {

    var TouchableElement = TouchableHighlight;
    if (Platform.OS === 'android') {
      TouchableElement = TouchableNativeFeedback;
    }

    const {navReducer} = this.props
    var documentlist = getDocumentsContext(navReducer);
    var title = navReducer.routes[navReducer.index].data != null ? navReducer.routes[navReducer.index].data.name : navReducer.routes[navReducer.index].title;
    var currDoc = navReducer.routes[navReducer.index].data;
    return (
      <View style= {styles.toolbar} >
        <View>
          <Icon name="arrow-back" style={[styles.iconStyle]} onPress={this.onGoBack.bind(this) } />
        </View>
        <View style={styles.folderName}>
          <Text style={{ fontSize: 20 }} numberOfLines={1}>{title}</Text>
        </View>
        <TouchableElement onPress={ (() => { this.menuPressed(currDoc.documentId, currDoc.familyCode) }).bind(this) }>
          <View style={styles.iconContainer}>
            <Icon name="more-vert" style={styles.moreMenu} />
          </View>
        </TouchableElement>
      </View>
    )
  }

  renderAddPeopleToolbar() {
    const {navReducer} = this.props
    var documentlist = getDocumentsContext(navReducer);
    var title = navReducer.routes[navReducer.index].data != null ? navReducer.routes[navReducer.index].data.name : navReducer.routes[navReducer.index].title;

    return (
      <View style= {styles.toolbar} >
        <View>
          <Icon name="arrow-back" style={[styles.iconStyle]} onPress={this.onGoBack.bind(this) } />
        </View>
        <View style={styles.folderName}>
          <Text style={{ fontSize: 20 }} numberOfLines={1}>{title}</Text>
        </View>
        <View style={styles.shareIconContainer}><Icon name="send" style={[styles.iconStyle, styles.shareIcon]} onPress={this.addPeople.bind(this) } /></View>
      </View>
    )
  }

  // renderItemMenu(){

  //    var currDoc = navReducer.routes[navReducer.index].data != null? navReducer.routes[navReducer.index].data.name: navReducer.routes[navReducer.index];

  //   return (


  //       navReducer.routes[navReducer.index].key === 'document'?
  //          <TouchableElement onPress={ (()=> { this.menuPressed(currDoc.Id, currDoc.FamilyCode)}).bind(this) }>
  //               <View style={styles.iconContainer}>
  //                 <Icon name="more-vert" style={styles.moreMenu} />
  //               </View>
  //          </TouchableElement> :  <View></View>
  //   )

  // }

  addPeople() {
    const {documentsReducer} = this.props
    if (documentsReducer.sharingPermissions.length === 0) {
      return false;
    }
    this.props.dispatch(navActions.updateIsProcessing(true));
    setTimeout(() => {
        this.props.dispatch(documentsActions.ShareDocument());
    }, 100);
    
  }

  render() {
    const {navReducer} = this.props
    var documentlist = getDocumentsContext(navReducer);
    const sortBy = documentlist.sortBy;
    const sortDirection = documentlist.sortDirection != undefined ? documentlist.sortDirection : "";
    var isDocumentsTollbar = (navReducer.routes[navReducer.index].key.indexOf('documents') > -1) ? true : false;
    var isDocumentTollbar = navReducer.routes[navReducer.index].key == 'document';
    var isAddPeoplePage = (navReducer.routes[navReducer.index].key.indexOf('addPeople') > -1) ? true : false;
    var isSearchToolbar = this.state.isSearchBoxOpen || (typeof navReducer.routes[navReducer.index].data != 'undefined'
      && typeof navReducer.routes[navReducer.index].data.isSearch != 'undefined'
      && navReducer.routes[navReducer.index].data.isSearch);
    console.log('isDocumentsTollbar = ' + isDocumentsTollbar)

    if (isSearchToolbar)
      return (<View>
        {this.renderSearchBox() }
      </View>)
    else if (isDocumentsTollbar)
      return (
        <View>
          {this.renderDocumentsToolbar() }
        </View>
      )
    else if (isDocumentTollbar)
      return (
        <View>
          {this.renderDocumentToolbar() }
        </View>
      )
    else if (isAddPeoplePage)
      return (
        <View>
          {this.renderAddPeopleToolbar() }
        </View>
      )

      return null;
  }
}

KenestoToolbar.contextTypes = {
  itemMenuContext: React.PropTypes.object,
};

// function mapStateToProps(state) {
// alert(name)
 
//   const { navReducer } = state
//   var currRoute = navReducer.routes[navReducer.index];
 
//   return {
//       name : currRoute.data.name

//   }
// }

//export default connect(mapStateToProps)(KenestoToolbar)
export default KenestoToolbar
