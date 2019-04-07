
import React from "react";
import {View, ScrollView, Text, StyleSheet, AsyncStorage, ListView, Image, Platform } from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons'
import Button from "react-native-button";
import LeftMenuItem from './LeftMenuItem';
import * as constans from '../constants/GlobalConstans'
import {getDocumentsTitle, getDocumentsContext} from '../utils/documentsUtils'
import * as accessActions from '../actions/Access'
import * as navActions from '../actions/navActions'
import * as documentsActions from '../actions/documentsActions'
import {connect} from 'react-redux'
import { createIconSetFromFontello } from  'react-native-vector-icons'
import MartialExtendedConf from '../assets/icons/config.json';
const KenestoIcon = createIconSetFromFontello(MartialExtendedConf);

const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
        backgroundColor: "#fff"
    },
    headerContainer: {
        height: 100,
        flexDirection: 'row',
        justifyContent: "flex-start",
        alignItems: "center",
        backgroundColor: "#F5F6F8",
        borderBottomWidth: 2,
        borderBottomColor: '#EbEbEb',
        ...Platform.select({
                ios:{
                    paddingTop:25
                    },
                android:{
                        marginBottom: 10
                    }
            }),  
    },
    avatarContainer: {
        margin: 15
    },
    avatar: {
        height: 50,
        width: 50,
        borderRadius: 25,
    },
    icon: {
    fontSize: 40,
    color: '#888',    
  },
  userIcon: {
      fontSize: 50
  },
    userInfoContainer: {
        flex: 1
    },
    rowSeparator: {
        backgroundColor: 'rgba(0, 0, 0, 0)',
        height: 1,
        marginLeft: 4,
    },
    rowSeparatorSelected: {
        opacity: 1,
    },
    rowSeparatorHide: {
        opacity: 0
    }
});



class TabView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
        }
    }

    componentWillMount() {
        this.loadMenu(this.props);
    }

 componentWillReceiveProps(nextProps) {
   this.loadMenu(nextProps);
  }


    getDataSource(menuItems: Array<any>): ListView.DataSource {
        return this.state.dataSource.cloneWithRows(menuItems);
    }

    loadMenu(props, selectedIndex = 0) {
        const {navReducer,accessReducer} = props
        
        var documentlist = getDocumentsContext(navReducer);
        switch (documentlist.catId) {
            case constans.MY_DOCUMENTS:
                selectedIndex = 0;
                break;
            case constans.DOCUMENTS_SHARE_WITH_ME:
                selectedIndex = 1;
                break;
            case constans.ALL_DOCUMENTS:
                selectedIndex = 2;
                break;
            case constans.CHECKED_OUT_DOCUMENTS:
                selectedIndex = 3;
                break;
            case constans.ARCHIVED_DOCUMENTS:
                selectedIndex = 4;
                break;
            default:
                break;
        }

        var menuItems = [
            {
                Index: 0,
                itemTitle: getDocumentsTitle(constans.MY_DOCUMENTS),
                itemCount: accessReducer.statistics.totalMyDocuments,
                itemIcon: 'folder',
                iconType: 'regular',
                selected: documentlist.catId == constans.MY_DOCUMENTS ? true : false,
                customStyle: ''
            },
            {
                Index: 1,
                itemTitle: getDocumentsTitle(constans.DOCUMENTS_SHARE_WITH_ME),
                itemCount: accessReducer.statistics.totalSharedWithMe,
                itemIcon: 'folder',
                iconType: 'regular',
                selected: documentlist.catId == constans.DOCUMENTS_SHARE_WITH_ME ? true : false,
                customStyle: ''
            },
            {
                Index: 2,
                itemTitle: getDocumentsTitle(constans.ALL_DOCUMENTS),
                itemCount: accessReducer.statistics.totalAllDocuments,
                itemIcon: 'folder',
                iconType: 'regular',
                selected: documentlist.catId == constans.ALL_DOCUMENTS ? true : false,
                customStyle: ''
            },
            {
                Index: 3,
                itemTitle: getDocumentsTitle(constans.CHECKED_OUT_DOCUMENTS),
                itemCount: accessReducer.statistics.totalCheckedoutDocuments,
                itemIcon: 'checkout',
                iconType: 'custom',
                selected: documentlist.catId == constans.CHECKED_OUT_DOCUMENTS ? true : false,
                customStyle: {marginRight: 16, marginLeft: -1}
            },
            // {
            //     Index: 4,
            //     itemTitle: getDocumentsTitle(constans.ARCHIVED_DOCUMENTS),
            //     itemCount: accessReducer.statistics.totalArchivedDocuments,
            //     itemIcon: 'restore',
            //     selected: documentlist.catId == constans.ARCHIVED_DOCUMENTS ? true : false,
            //     customStyle: ''
            // },
            {
                Index: 5,
                itemTitle: 'My usage space '+accessReducer.statistics.totalUsageSpace,
                itemCount: null,
                itemIcon: 'disk-usage',
                iconType: 'custom',
                selected: false,
                customStyle: ''
            },
            {
                Index: 6,
                itemTitle: 'Logout',
                itemCount: null,
                itemIcon: 'power-settings-new',
                iconType: 'regular',
                selected: false,
                customStyle: { color: "#FA8302" }
            }
        ];

        this.setState({
            dataSource: this.getDataSource(menuItems),
            selectedItem: selectedIndex
        });

    }


    render() {
     
        const drawer = this.context.drawer;
        const {accessReducer} = this.props
        var fullName = `${accessReducer.firstName} ${accessReducer.lastName}`
        var email = accessReducer.email;
        return (
            <View style={styles.screenContainer}>
                <View style={[styles.headerContainer, this.props.sceneStyle]}>
                    <View style={styles.avatarContainer}>
                        {!accessReducer.hasProfilePicture ?
                            <Icon name="account-circle" style={styles.userIcon} /> :
                            <Image source={{ uri: accessReducer.thumbnailPath }} style={styles.avatar} />
                        }
                    </View>
                    <View  style={styles.userInfoContainer}>
                        <Text style={{ color: '#000' }}>{fullName}</Text>
                        <Text>{email}</Text>
                    </View>

                </View>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <ListView
                        ref="MenuList"
                        renderSeparator={this.renderSeparator.bind(this) }
                        dataSource={this.state.dataSource}
                        renderFooter={null}
                        renderRow={this.renderRow.bind(this) }
                        onEndReached={null}
                        automaticallyAdjustContentInsets={false}
                        keyboardDismissMode="on-drag"
                        keyboardShouldPersistTaps="always"
                        showsVerticalScrollIndicator={false}
                        />
                </ScrollView>
            </View>
        );
    }



    SelectItem(menuitem: Object) {
         this.props.closeDrawer();
        const {dispatch, navReducer, closeDrawer} = this.props
        var routeData =
            {
                name: getDocumentsTitle(constans.MY_DOCUMENTS),
                catId: constans.MY_DOCUMENTS,
                fId: "",
                sortDirection: constans.DESCENDING,
                sortBy: constans.MODIFICATION_DATE,
                keyboard:"",
                isSearch: false, 
                isVault: false
            }
       
        switch (menuitem.Index) {
            case 0:
                routeData.catId = constans.MY_DOCUMENTS;
                routeData.name = getDocumentsTitle(constans.MY_DOCUMENTS);
                dispatch(documentsActions.refreshTable(routeData, true));
                break;
            case 1:
                routeData.catId = constans.DOCUMENTS_SHARE_WITH_ME;
                routeData.name = getDocumentsTitle(constans.DOCUMENTS_SHARE_WITH_ME);
                dispatch(documentsActions.refreshTable(routeData, true));
                break;
            case 2:
                routeData.catId = constans.ALL_DOCUMENTS;
                routeData.name = getDocumentsTitle(constans.ALL_DOCUMENTS);
                 dispatch(documentsActions.refreshTable(routeData, true));
                 break;
            case 3:
                routeData.catId = constans.CHECKED_OUT_DOCUMENTS;
                routeData.name = getDocumentsTitle(constans.CHECKED_OUT_DOCUMENTS);
                 dispatch(documentsActions.refreshTable(routeData, true));
                 break;
            case 4:
                routeData.catId = constans.ARCHIVED_DOCUMENTS;
                routeData.name = getDocumentsTitle(constans.ARCHIVED_DOCUMENTS);
                dispatch(documentsActions.refreshTable(routeData, true));
                 break;
            case 6:
                dispatch(navActions.emitConfirm("Log Out", "Are you sure you want to Log Out?", () => dispatch(accessActions.logOut())))
                 break;
            default:
                break;
        }        
    }


    renderSeparator(sectionID: number | string,
        rowID: number | string,
        adjacentRowHighlighted: boolean) {
        var style = styles.rowSeparator;
        if (adjacentRowHighlighted) {
            style = [style, styles.rowSeparatorHide];
        }
        return (
            <View key={'SEP_' + sectionID + '_' + rowID}  style={style}/>
        );
    }


    renderRow(listItem: Object,
        sectionID: number | string,
        rowID: number | string,
        highlightRowFunc: (sectionID: ?number | string, rowID: ?number | string) => void) {

        return (
            <LeftMenuItem
                key={listItem.Id}
                onSelect={() => this.SelectItem(listItem) }
                onHighlight={() => highlightRowFunc(sectionID, rowID) }
                onUnhighlight={() => highlightRowFunc(null, null) }
                listItem={listItem}
                IsSelected = {listItem.Index == this.state.selectedItem}
                />
        );
    }
}

function mapStateToProps(state) {
    const { documentsReducer, navReducer, accessReducer} = state

    return {
        documentsReducer,
        navReducer,
        accessReducer
    }
}

export default connect(mapStateToProps)(TabView)

// TabView.contextTypes = {
//     drawer: React.PropTypes.object
// };
