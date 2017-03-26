'use strict';
import React, {Component} from 'react';
import KenestoTagAutocomplete from './KenestoTagAutocomplete';
import DropDownTrigger from './DropDownTrigger';
import ViewContainer from '../components/ViewContainer';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {connect} from 'react-redux'
import * as peopleAcions from '../actions/peopleActions'
import {getSelectedDocument} from '../utils/documentsUtils';
import ProgressBar from './ProgressBar'
import * as navActions from '../actions/navActions'
import * as docActions from '../actions/documentsActions'
import * as uiActions from '../actions/uiActions'
import  {
  View,
  Text,
  StyleSheet,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Image,
  Dimensions
} from 'react-native';
var {height, width} = Dimensions.get('window');
import ProggressBar from "../components/ProgressBar";

var globalOptions = [
  {
    name: "VIEW_ONLY",
    icon: "remove-red-eye",
    title: "View only",
  
  },
  {
    name: "ALLOW_DOWNLOAD",
    icon: "file-download",
    title: "Download"
  },
  {
    name: "ALLOW_UPDATE_VERSIONS",
    icon: "update",
    title: "Update"
  }
];

var userOptions = [
  {
    name: "VIEW_ONLY",
    icon: "remove-red-eye",
    title: "View only"
  },
  {
    name: "ALLOW_DOWNLOAD",
    icon: "file-download",
    title: "Download"
  },
  {
    name: "ALLOW_UPDATE_VERSIONS",
    icon: "update",
    title: "Update"
  },
  {
    name: "NONE",
    icon: "not-interested",
    title: "Delete share"
  }
]

class AddPeople extends Component {

  constructor(props) {
    super(props)

    this.state = {
      showSharingList: true,
      globalPermissions: 'VIEW_ONLY',
      UsersPermissions : this.props.UsersPermissions
    };
  }

  componentDidMount() {
     var tags = [];
     this.props.dispatch(docActions.SetSharingPermissions(tags));
  }
  
    shouldComponentUpdate(nextProps, nextState){
      const {navReducer} = nextProps
      if (navReducer.routes[navReducer.index].key != 'addPeople')
         return false; 
        return true;
  }

  componentWillReceiveProps(nextprops){
     this.setState( {UsersPermissions : typeof nextprops.UsersPermissions  != 'undefined' ?nextprops.UsersPermissions : [] });
  }


  _onChange(tags) {
      this.props.dispatch(docActions.SetSharingPermissions(tags));
  }

  _onUpdateLayout() {

  }

  _onUpdateTags() {

  }

  showSharingList() {
    this.setState({ showSharingList: true })
  }

  hideSharingList() {
    this.setState({ showSharingList: false })
  }

  formatNewTag(tag) {
    // trim spaces, check for email correct format etc. 
    // If the formatted text is not a correct email - return false
    tag = tag.trim();
    return /\S+@\S+\.\S+/.test(tag) ? tag : false;
  }

  onErrorAddNewTag(tag) {     // show error message/toast
    var errorMessage = tag + ' is not a valid email!'
    //this.refs.mainContainer2.showMessage("info", errorMessage);
    this.props.dispatch(navActions.emitToast("info", errorMessage));
  }

  submitSelectedTags() {
    // VALIDATE TAGS, COMBINE this.state.selected WITH PERMISSIONS AND SEND TO SERVER
  }

  componentWillMount() {
    //  alert(JSON.stringify(this.props.navReducer));
    var document = getSelectedDocument(this.props.documentsReducer, this.props.navReducer);
    this.setState({ document: document });

    this.props.dispatch(peopleAcions.RequestShareObjectInfo(document.Id, document.FamilyCode, document.Name));
    //alert(document)
    // alert('document = ' + document.Name)
    //  alert(this.props.UsersAndGroups)


  }

  // EXAMPLE OF CUSTOM AUTOCOMPLETE ROW TEMPLATE. rowData INCLUDES ALL FIELDS.
  // 
  getAutocompleteRowTemplate(searchedtext, iconType, iconName, rowData) {   
    
    return (
      <View style={styles.autocompleteRow}>
        {searchedtext}
        <View style={[styles.roundIcon, {marginLeft: 10}]}>
            {iconType == 'icon' ? <Icon name={iconName} style={styles.iconMedium} /> : <Image source = {{ uri: rowData.ThumbnailPath }} style={styles.thumbnail} />}
          </View>
      </View>
    )
  }

  // EXAMPLE OF CUSTOM TAG TEMPLATE
  // 
  getTagTemplate(tag, removeTag) {
    return (
      <View style={styles.tagInnerContainer}>
        <View style={[styles.roundIcon, { marginLeft: -5.5 }]}>
          {tag.iconType == 'icon' ? <Icon name={tag.iconName} style={styles.iconMedium} /> : <Image source = {{ uri: tag.ThumbnailPath }} style={styles.thumbnail} />}
        </View>
        <View style={{maxWidth: width - 132}}><Text style={styles.tagText} numberOfLines={1}>{tag.tagName}</Text></View>
        <Icon name="close" style={styles.closeIcon} onPress={removeTag.bind(this, tag)} />
      </View>
    )
  }


  renderPermissionsTrigger(permissionName : string, isFetching: boolean) {

    var iconName;
    switch (permissionName) {
      case "VIEW_ONLY":
        iconName = "remove-red-eye";
        break;
      case "ALLOW_DOWNLOAD":
        iconName = "file-download";
        break;
      case "ALLOW_UPDATE_VERSIONS":
        iconName = "update";
        break;
    }

    const content = isFetching? <View style={styles.creatingFolder}><ProgressBar isLoading={true}/></View> :  <Icon name={iconName} style={styles.icon} />; 

    return (
      <View style={styles.dropDownTriggerTemplateContainer}>
        <View style={styles.dropDownTriggerTemplate}>
         {content}
          <Icon name="keyboard-arrow-down" style={[styles.icon, styles.iconDown]} />
        </View>
      </View>
    )
  }

 onMenuSelect(name: string){
     if (this.props.clickedTrigger != 'addPeopleTrigger')
     {
       this.props.dispatch(navActions.requestUpdateTrigger(name));
       this.props.dispatch(docActions.UpdateDocumentSharingPermission());
       
     }
     else
       this.props.dispatch(uiActions.updateAddPeopleTrigerValue(name));
       
 }
 removeFromSharingList(ParticipantUniqueID : string){
     this.props.dispatch(peopleAcions.removeFromSharingList(ParticipantUniqueID));
 }

  renderOptionTemplate(rowData) {
    return (
      <View>
      <TouchableWithoutFeedback onPress={() => (this.onMenuSelect(rowData.name))}>
      <View style={styles.optionRow}>
    
        
            <Icon name={rowData.icon} style={styles.icon} />
            <Text style={styles.optionTitle}>{rowData.title}</Text>
     
      </View>
         </TouchableWithoutFeedback>
         </View>
    )
  }


  renderCurrentPermissions() {

    var permissions = this.state.UsersPermissions.map(function (permission) {
      var iconName;
      if (!permission.ThumbnailPath) {
        if (permission.IsGroup) {
          iconName = 'group';
        }
        else {
          iconName = permission.IsExternal ? 'person-outline' : 'person'
        }
      }
     
      var textWidth = (this.props.navReducer.orientation == 'PORTRAIT') ? width - 140 : height - 140;
      return (
        <View style={styles.sharingRow} key={permission.UserId}>
          <View style={styles.roundIcon}>
            {!permission.ThumbnailPath ? <Icon name={iconName} style={styles.iconMedium} /> : <Image source = {{ uri: permission.ThumbnailPath }} style={styles.thumbnail} />}
          </View>
          <View style={{ maxWidth: textWidth }}>
            <Text key={permission.ParticipantUniqueID} numberOfLines={1}>{permission.Name}</Text>
          </View>
          <DropDownTrigger
            dropDownTriggerTemplate={this.renderPermissionsTrigger.bind(this) }
            dropDownTriggerStyle={styles.dropDownTriggerStyle}
            activeTriggerStyle={styles.activeTriggerStyle}
            optionTemplate={this.renderOptionTemplate.bind(this) }
            removeOption={this.removeFromSharingList.bind(this)}
            options={userOptions}
            aligningOptionsWithTrigger={"right"}
            openingDirection={"down"}
            selected={permission.PermissionType}
            id= {'trigger_' + permission.ParticipantUniqueID}
            />
        </View>

      );
    }, this);

    if (permissions.length == 0)
      return(
         <View style={[styles.container, styles.centerText]}>
            <View style={styles.textContainer}>
              <Text style={styles.noDocumentsText}>No users are shared yet</Text>
            </View>
          </View>
      )
      else return permissions

  }

  render() {
    if (this.props.isFetching) {
      return (<View style={styles.creatingFolder}>
        <ProgressBar isLoading={true}/>
      </View>
      )
    }
    return (
      <ViewContainer ref="mainContainer">
        <View style={styles.container}>
          <KenestoTagAutocomplete
            ref='tagInput'
            suggestions={this.props.UsersAndGroups}
            containerStyle={styles.autocompleteContainer}
            inputContainerStyle={styles.tagsInputContainer}
            listStyle={styles.listStyle}
            newTagContainerStyle={styles.newTagContainerStyle}
            newTagStyle={styles.newTagStyle}
            rowContainerStyle={styles.rowContainerStyle}
            autocompleteTextStyle={styles.autocompleteTextStyle}
            tagContainerStyle={styles.tagContainerStyle}
            onChange={this._onChange.bind(this) }
            onUpdateLayout={this._onUpdateLayout.bind(this) }
            onUpdateTags={this._onUpdateTags.bind(this) }
            onHideTagsList={this.showSharingList.bind(this) }
            onShowTagsList={this.hideSharingList.bind(this) }
            onSubmit={this.submitSelectedTags.bind(this) }
            title={"Add Users"}
            minCharsToStartAutocomplete={1}
            allowAddingNewTags={true}
            addNewTagTitle={"Add a new user: "}
            formatNewTag={this.formatNewTag.bind(this) }
            onErrorAddNewTag={this.onErrorAddNewTag.bind(this) }
            autocompleteRowTemplate={this.getAutocompleteRowTemplate.bind(this) }
            tagTemplate={this.getTagTemplate.bind(this)}
            autocompleteField={"Name"}
            uniqueField={"ParticipantUniqueID"}
            aditionalField={"FamilyCode"}
            />

          <DropDownTrigger
            dropDownTriggerTemplate={this.renderPermissionsTrigger.bind(this) }
            dropDownTriggerStyle={styles.dropDownGlobalTriggerStyle}
            dropDownTriggerContainer={styles.dropDownTriggerContainer}
            activeTriggerStyle={styles.activeTriggerStyle}
            optionTemplate={this.renderOptionTemplate.bind(this) }
            removeOption={this.removeFromSharingList.bind(this)}
            options={globalOptions}
            aligningOptionsWithTrigger={"right"}
            openingDirection={"down"}
            selected={this.state.globalPermissions}
            id="addPeopleTrigger"
            />

          {this.state.showSharingList == true ?
            <ScrollView keyboardShouldPersistTaps="always" showsVerticalScrollIndicator={false}>
              <View style={{ flex: 1 }}>
                <View style={styles.sharingTitleContainer}>
                  <Text style={styles.sharingTitle}>Sharing</Text>
                </View>

                <View>
                  {this.renderCurrentPermissions.bind(this)() }
                </View>
              </View>
            </ScrollView>
            :
            <View style={{}}></View>
          }

        </View>
      </ViewContainer>

    );
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  autocompleteContainer: {

  },
  tagsInputContainer: {},
  listStyle: {},
  newTagContainerStyle: {},
  newTagStyle: {},
  rowContainerStyle: {},
  autocompleteTextStyle: {},
  tagContainerStyle: {},
  sharingTitleContainer: {
    height: 45,
    backgroundColor: '#F5F6F8',
    justifyContent: 'center',
    paddingLeft: 25
  },
  sharingTitle: {
    fontWeight: '400',
    color: '#000',
  },
  icon: {
    fontSize: 15,
    color: '#999',
    paddingLeft: 3,
    paddingRight: 3
  },
  iconDown: {
    fontSize: 18,
    paddingRight: 0,
    color: "#000"
  },
  iconMedium: {
    fontSize: 22,
    color: "#999",
    // borderWidth: 1,
    // marginLeft: 2
  },
  roundIcon: {
    borderWidth: 0.5,
    borderColor: "#999",
    borderRadius: 16,
    width: 31,
    height: 31,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 7,
    // overflow: "hidden",
    zIndex: 100
  },
  dropDownTriggerStyle: {
    borderColor: "transparent"
  },
  dropDownGlobalTriggerStyle: {
    borderColor: "#ccc"
  },
  dropDownTriggerContainer: {
    position: 'absolute',
    top: 13,
    right: 0,
  },
  activeTriggerStyle: {
    borderColor: "#000"
  },
  dropDownTriggerTemplateContainer: {
    flex: 1,
    alignItems: "center",
  },
  dropDownTriggerTemplate: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  sharingRow: {
    flexDirection: "row",
    height: 50,
    alignItems: "center",
    marginLeft: 30,
    borderWidth: 1,
    borderColor: "transparent"
  },
  thumbnail: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    height: 45,
    paddingHorizontal: 12,
  },
  optionTitle: {
    paddingLeft: 8
  },
  autocompleteRow: { 
    flexDirection: "row", 
    alignItems: "center", 
    flex: 1, 
    justifyContent: "space-between" 
  },
  tagInnerContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  userIcon: {
    fontSize: 34,
    left: -7,
  },
  tagText: {
    fontSize: 14,
    color: '#000',
    padding: 0,
    margin: 0
  },
  closeIcon: {
    fontSize: 15,
    ...Platform.select({
      ios:{
        marginTop: 0,
        marginRight: 0,
      },
      android:{
        marginTop: 2,
        marginRight: -7,
      }
    }),

    padding: 6,
  },
  avatar: {
    height: 30,
    width: 30,
    borderRadius: 15,
  },
 centerText: {
    alignItems: 'center',
    marginTop: 30
  },
});

function mapStateToProps(state) {

  const { peopleReducer, documentsReducer, navReducer, uiReducer } = state
  var thisUsersPermission = peopleReducer.ObjectInfo === null ||  peopleReducer.ObjectInfo.UsersPermissions === null ? [] : peopleReducer.ObjectInfo.UsersPermissions

  return {
    isFetching: peopleReducer.isFetching,
    documentsReducer,
    navReducer,
    UsersPermissions:  thisUsersPermission,
    UsersAndGroups: peopleReducer.UsersAndGroups,
    clickedTrigger: uiReducer.clickedTrigger,
  }
}

export default connect(mapStateToProps)(AddPeople)