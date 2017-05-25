import * as types from '../constants/ActionTypes'
import * as navActions from '../actions/navActions'
import * as Access from '../actions/Access'
import * as peopleActions from '../actions/peopleActions'
import { writeToLog } from '../utils/ObjectUtils'
import * as constans from '../constants/GlobalConstans'
import * as textResource from '../constants/TextResource'
import {
    constructRetrieveDocumentsUrl, constructRetrieveStatisticsUrl, getCreateFolderUrl,
    getDownloadFileUrl, getDocumentsContext, getUploadFileCompletedUrl,
    getDeleteAssetUrl, getDeleteFolderUrl, getSelectedDocument, getShareDocumentUrl,getShareFolderUrl,
    getObjectInfoUrl, getCheckOutDocumentUrl, getCheckInDocumentUrl, getEditFolderUrl,
    getDocumentlistByCatId, getEditDocumentUrl, getDiscardCheckOutDocumentUrl, parseUploadUserData, constrcutUploadUSerData,
    isDocumentsContextExists, getDocumentsContextByCatId, getDocumentIdFromUploadUrl, getViewerUrl
} from '../utils/documentsUtils'
import * as routes from '../constants/routes'
import _ from "lodash";
const Android_Download_Path = '/storage/emulated/0/download';
import RNFetchBlob from 'react-native-fetch-blob'

const android = RNFetchBlob.android
import {
    Alert,
    Platform,
    ListView
} from 'react-native'

export function updateIsFetching(isFetching: boolean) {
    return {
        type: types.UPDATE_IS_FETCHING_DOCUMENTS,
        isFetching
    }
}

export function updateIsFetchingSelectedObject(isFetching: boolean) {
    return {
        type: types.UPDATE_IS_FETCHING_SELECTED_OBJECT,
        isFetchingSelectedObject: isFetching
    }
}

export function updateIsFetchingCurrentFolderPermissions(isFetching: boolean) {
    return {
        type: types.UPDATE_IS_FETCHING_CURRENT_FOLDER_PERMISSIONS,
        isFetchingCurrentFolderPermissions: isFetching
    }
}

export function getCurrentFolderPermissions(folderId : string){
    return (dispatch, getState) => {
          if (!getState().accessReducer.isConnected)
            return dispatch(navActions.emitToast("info", textResource.NO_INTERNET)); 
          dispatch(updateIsFetchingCurrentFolderPermissions(true))
         const {sessionToken, env, email} = getState().accessReducer;
         var url = getObjectInfoUrl(env, sessionToken, folderId, "FOLDER",false);

          return fetch(url)
            .then(response => response.json())
            .then(json => {
                if (json.ResponseStatus == "FAILED") {
                    dispatch(navActions.emitError(json.ErrorMessage, 'error details'))
                    dispatch(navActions.emitError(json.ErrorMessage, ""))
                    dispatch(updateIsFetchingCurrentFolderPermissions(false))
                    writeToLog(email, constans.ERROR, `function getCurrentFolderPermissions - error details- url: ${url}`)
                }
                else {
                    var permissions = json.ResponseData.ObjectPermissions;
                    dispatch(updateCurrentFolder(folderId, permissions))
                    dispatch(updateIsFetchingCurrentFolderPermissions(false))
                }
            })
            .catch((error) => {
                dispatch(navActions.emitError("Failed to get folder permissions", ""))
                dispatch(updateIsFetchingCurrentFolderPermissions(false))
                writeToLog(email, constans.ERROR, `function getCurrentFolderPermissions - Failed to get document permissions , url: ${url}`, error)
            })

    }
}

export function getDocumentPermissions(document) {
    return (dispatch, getState) => {
          if (!getState().accessReducer.isConnected)
            return dispatch(navActions.emitToast("info", textResource.NO_INTERNET)); 
        const {sessionToken, env, email} = getState().accessReducer;
        var documentlist = getDocumentsContext(getState().navReducer);
        dispatch(updateIsFetchingSelectedObject(true))
        var id = document.SharedObjectId != "" ? document.SharedObjectId: document.Id != "" ? document.Id : document.documentId;
        var token = document.ExternalToken === "" ? sessionToken :  encodeURIComponent(document.ExternalToken);
        var familyCode = document.familyCode != "" ? document.familyCode : document.FamilyCode ;
        var url = getObjectInfoUrl(env, token, id, familyCode, document.ExternalToken != "");
        writeToLog(email, constans.DEBUG, `function getDocumentPermissions - url: ${url}`)
        return fetch(url)
            .then(response => response.json())
            .then(json => {
                if (json.ResponseStatus == "FAILED") {
                    dispatch(navActions.emitError(json.ErrorMessage, 'error details'))
                    dispatch(navActions.emitError(json.ErrorMessage, ""))
                    dispatch(updateIsFetchingSelectedObject(false))
                    writeToLog(email, constans.ERROR, `function getDocumentPermissions - error details- url: ${url}`)
                }
                else {
                    var permissions = json.ResponseData.ObjectPermissions;
                    var documentId = document.Id != "" ? document.Id : document.documentId;
                 
                    dispatch(updateSelectedObject(documentId, familyCode, permissions))
                    dispatch(updateIsFetchingSelectedObject(false))
                }
            })
            .catch((error) => {
                dispatch(navActions.emitError("Failed to get document permissions", ""))
                dispatch(updateIsFetchingSelectedObject(false))
                writeToLog(email, constans.ERROR, `function getDocumentPermissions - Failed to get document permissions , url: ${url}`, error)
            })
    }
}


export function getDocumentInfo(documentId: string, familyCode: string, actionType : string = types.UPDATE_ROUTE_DATA, updateViewer : boolean = true){
    return (dispatch, getState) => {
        if (!getState().accessReducer.isConnected)
            return dispatch(navActions.emitToast("info", textResource.NO_INTERNET)); 

        const {sessionToken, env, email} = getState().accessReducer;
        var documentlist = getDocumentsContext(getState().navReducer);
        // var id = document.SharedObjectId === "" ? document.Id :document.SharedObjectId;
        // var token = document.ExternalToken === "" ? sessionToken :  encodeURIComponent(document.ExternalToken);
        // var familyCode = document.familyCode;
        dispatch(updateIsFetchingSelectedObject(true))
        var url = getObjectInfoUrl(env, sessionToken, documentId, familyCode, false);
        writeToLog(email, constans.DEBUG, `function getDocumentInfo - url: ${url}`)
        return fetch(url)
            .then(response => response.json())
            .then(json => {
                if (json.ResponseStatus == "FAILED") {
                    dispatch(navActions.emitError(json.ErrorMessage, 'error details'))
                    dispatch(navActions.emitError(json.ErrorMessage, ""))
                    dispatch(updateIsFetchingSelectedObject(false))
                    writeToLog(email, constans.ERROR, `function getDocumentInfo - error details- url: ${url}`)
                }
                else {
                    var document = json.ResponseData.DocumentInfo;
                    var currRoute = getState().navReducer.routes[ getState().navReducer.index].data; 
                    const viewerUrl = updateViewer ?  getViewerUrl(env, document, getState().navReducer.orientation) : currRoute.viewerUrl;
                    var data = {
                        key: "document",
                        name: document.Name,
                        documentId: document.Id,
                        SharedObjectId: document.SharedObjectId,
                        ExternalToken:  document.ExternalToken,
                        familyCode: json.ResponseData.FamilyCode,
                        catId: documentlist.catId,
                        fId: documentlist.fId,
                        viewerUrl:viewerUrl,
                        isExternalLink: document.IsExternalLink,
                        externalLinkType: document.ExternalLinkType,
                        isVault: document.IsVault,
                        ThumbnailUrl: document.ThumbnailUrl,
                        env: env,
                        dispatch: dispatch
                    }

                    switch (actionType) {
                        case types.UPDATE_ROUTE_DATA:
                            dispatch(navActions.updateRouteData(data))
                            break;
                        case types.PUSH_ROUTE:
                              this.props.dispatch(navActions.push(routes.documentRoute(data).route));
                            break;
                    }
                    
                    
                }
            })
            .catch((error) => {
                dispatch(updateIsFetchingSelectedObject(false))
                writeToLog(email, constans.ERROR, `function getDocumentInfo - Failed to get document info , url: ${url}`, error)
            })
    }
}


function AssembleTableDatasource(items, uploadItems, totalFiles, totalFolders, isSearch = false) {
    try {
        var dataBlob = {},
            sectionIDs = [],
            rowIDs = [],
            foldersSection,
            docuemntsSection,
            folders,
            documents,
            i,
            j;

        folders = _.filter(items, function(o) { return o.FamilyCode == 'FOLDER'; });
        documents = _.filter(items, function(o) { return o.FamilyCode != 'FOLDER'; });




        if (totalFolders > 0 && totalFiles > 0) {
            if (uploadItems.length > 0 && !isSearch) {
                dataBlob["ID1"] = `Uploads (${uploadItems.length})`
                dataBlob["ID2"] = `Folders (${totalFolders})`
                dataBlob["ID3"] = `Files (${totalFiles})`
                sectionIDs[0] = "ID1";
                sectionIDs[1] = "ID2";
                sectionIDs[2] = "ID3";

                rowIDs[0] = [];
                for (j = 0; j < uploadItems.length; j++) {
                    uploadItem = uploadItems[j];

                    rowIDs[0].push(uploadItem.Id);
                    dataBlob['ID1:' + uploadItem.Id] = uploadItem;
                }
                rowIDs[1] = [];
                for (j = 0; j < folders.length; j++) {
                    folder = folders[j];
                    // Add Unique Row ID to RowID Array for Section
                    rowIDs[1].push(folder.Id);
                    // Set Value for unique Section+Row Identifier that will be retrieved by getRowData
                    dataBlob['ID2:' + folder.Id] = folder;
                }


                rowIDs[2] = [];
                for (j = 0; j < documents.length; j++) {
                    document = documents[j];
                    // Add Unique Row ID to RowID Array for Section
                    rowIDs[2].push(document.Id);

                    // Set Value for unique Section+Row Identifier that will be retrieved by getRowData
                    dataBlob['ID3:' + document.Id] = document;
                }

            }
            else {


                dataBlob["ID1"] = `Folders (${totalFolders})`
                dataBlob["ID2"] = `Files (${totalFiles})`
                sectionIDs[0] = "ID1";
                sectionIDs[1] = "ID2";
                rowIDs[0] = [];
                for (j = 0; j < folders.length; j++) {
                    folder = folders[j];
                    // Add Unique Row ID to RowID Array for Section
                    rowIDs[0].push(folder.Id);

                    // Set Value for unique Section+Row Identifier that will be retrieved by getRowData
                    dataBlob['ID1:' + folder.Id] = folder;
                }

                rowIDs[1] = [];
                for (j = 0; j < documents.length; j++) {
                    document = documents[j];
                    // Add Unique Row ID to RowID Array for Section
                    rowIDs[1].push(document.Id);

                    // Set Value for unique Section+Row Identifier that will be retrieved by getRowData
                    dataBlob['ID2:' + document.Id] = document;

                }
            }

        }
        else if (totalFolders > 0 && totalFiles == 0) {
            if (uploadItems.length > 0 && !isSearch) {
                dataBlob["ID1"] = `Uploads (${uploadItems.length})`
                dataBlob["ID2"] = `Folders (${totalFolders})`
                sectionIDs[0] = "ID1";
                sectionIDs[1] = "ID2";
                rowIDs[0] = [];
                for (j = 0; j < uploadItems.length; j++) {
                    uploadItem = uploadItems[j];
                    rowIDs[0].push(uploadItem.Id);
                    dataBlob['ID1:' + uploadItem.Id] = uploadItem;
                }
                rowIDs[1] = [];
                for (j = 0; j < folders.length; j++) {
                    folder = folders[j];
                    // Add Unique Row ID to RowID Array for Section
                    rowIDs[1].push(folder.Id);

                    // Set Value for unique Section+Row Identifier that will be retrieved by getRowData
                    dataBlob['ID2:' + folder.Id] = folder;
                }
            }
            else {
                dataBlob["ID1"] = `Folders (${totalFolders})`
                sectionIDs[0] = "ID1";
                rowIDs[0] = [];
                for (j = 0; j < folders.length; j++) {
                    folder = folders[j];
                    // Add Unique Row ID to RowID Array for Section
                    rowIDs[0].push(folder.Id);

                    // Set Value for unique Section+Row Identifier that will be retrieved by getRowData
                    dataBlob['ID1:' + folder.Id] = folder;
                }
            }

        }
        else if (totalFiles > 0 && totalFolders == 0) {
            if (uploadItems.length > 0 && !isSearch) {
                dataBlob["ID1"] = `Uploads (${uploadItems.length})`
                dataBlob["ID2"] = `Files (${totalFiles})`
                sectionIDs[0] = "ID1";
                sectionIDs[1] = "ID2";
                rowIDs[0] = [];
                for (j = 0; j < uploadItems.length; j++) {
                    uploadItem = uploadItems[j];
                    rowIDs[0].push(uploadItem.Id);
                    dataBlob['ID1:' + uploadItem.Id] = uploadItem;
                }
                rowIDs[1] = [];
                for (j = 0; j < documents.length; j++) {
                    document = documents[j];
                    // Add Unique Row ID to RowID Array for Section
                    rowIDs[1].push(document.Id);

                    // Set Value for unique Section+Row Identifier that will be retrieved by getRowData
                    dataBlob['ID2:' + document.Id] = document;
                }
            }
            else {
                dataBlob["ID1"] = `Files (${totalFiles})`
                sectionIDs[0] = "ID1";
                rowIDs[0] = [];
                for (j = 0; j < documents.length; j++) {
                    document = documents[j];
                    // Add Unique Row ID to RowID Array for Section
                    rowIDs[0].push(document.Id);

                    // Set Value for unique Section+Row Identifier that will be retrieved by getRowData
                    dataBlob['ID1:' + document.Id] = document;
                }
            }

        }
        else if (totalFiles == 0 && totalFolders == 0) {
            if (uploadItems.length > 0 && !isSearch) {

                dataBlob["ID1"] = `Uploads (${uploadItems.length})`
                sectionIDs[0] = "ID1";

                rowIDs[0] = [];
                for (j = 0; j < uploadItems.length; j++) {
                    uploadItem = uploadItems[j];
                    rowIDs[0].push(uploadItem.Id);
                    dataBlob['ID1:' + uploadItem.Id] = uploadItem;
                }
            }
        }


        var getSectionData = (dataBlob, sectionID) => {
            return dataBlob[sectionID];

        }
        var getRowData = (dataBlob, sectionID, rowID) => {

            return dataBlob[sectionID + ':' + rowID];

        }

        let ds = new ListView.DataSource({

            getSectionData: getSectionData,

            getRowData: getRowData,

            rowHasChanged: (row1, row2) => {
                row1["Id"] !== row2["Id"] || row1["uploadStatus"] !== row2["uploadStatus"] || r1["IsUploading"] !== r2["IsUploading"]
            },

            sectionHeaderHasChanged: (s1, s2) => s1 !== s2

        })
        return { ret: ds.cloneWithRowsAndSections(dataBlob, sectionIDs, rowIDs) }
    } catch (err) {
        writeToLog("", constans.ERROR, `function AssembleTableDatasource - Failed! , items: ${JSON.stringify(items)}, uploadItems: ${JSON.stringify(uploadItems)}`, err)
    }


}

function fetchDocumentsTable(url: string, documentlist: Object, actionType: string) {
    return (dispatch, getState) => {
        if (!getState().accessReducer.isConnected)
            return dispatch(navActions.emitToast("info", textResource.NO_INTERNET)); 
        dispatch(requestDocumentsList(documentlist))
        const {sessionToken, env, email} = getState().accessReducer;
        writeToLog(email, constans.DEBUG, `function fetchDocumentsTable - url: ${url}`)
        return fetch(url)
            .then(response => response.json())
            .then(json => {
              if (json.ResponseStatus == 'FAILED')
                    return; 
                
                const nextUrl = json.ResponseData.next_href
                if (json.ResponseStatus == "FAILED") {
                    //dispatch(failedToFetchDocumentsList(documentlist, url, json.ErrorMessage))
                    dispatch(navActions.emitError(json.ErrorMessage, 'error details'))
                    dispatch(navActions.emitError(json.ErrorMessage, ""))
                    writeToLog(email, constans.ERROR, `function fetchDocumentsTable - error details  - url: ${url}`)
                }
                else {
                    var prevState = getState();
                    var items,
                        totalFiles,
                        dataBlob = {},
                        sectionIDs = [],
                        rowIDs = [],
                        foldersSection,
                        docuemntsSection,
                        folders,
                        documents,
                        i,
                        j;

                    var totalFiles = json.ResponseData.TotalFiles;
                    var totalFolders = json.ResponseData.TotalFolders;
                    if (actionType == types.RECEIVE_DOCUMENTS) {
                        items = [...prevState.documentsReducer[documentlist.catId].items, ...json.ResponseData.DocumentsList]
                    }
                    else {
                        items = [...json.ResponseData.DocumentsList]
                    }
                    var uploadItems = getState().documentsReducer[documentlist.catId].uploadItems;
                    var datasource = AssembleTableDatasource(items, uploadItems, totalFiles, totalFolders, documentlist.isSearch).ret;

                    switch (actionType) {
                        case types.RECEIVE_DOCUMENTS:
                            dispatch(receiveDocumentsList(items, nextUrl, documentlist, datasource, totalFiles, totalFolders))
                            break
                        case types.REFRESH_DOCUMENTS_LIST:
                            dispatch(refreshDocumentsList(items, nextUrl, documentlist, datasource, totalFiles, totalFolders))
                            break
                    }


                }
            })
            .catch((error) => {
                dispatch(navActions.emitError("Failed to retrieve documents", ""))
                writeToLog(email, constans.ERROR, `function fetchDocumentsTable - Failed to retrieve documents - url: ${url}`, error)
            })
    }
}


export function fetchTableIfNeeded() {
    return (dispatch, getState) => {
        if (!getState().accessReducer.isConnected)
            return dispatch(navActions.emitToast("info", textResource.NO_INTERNET)); 

        var documentlist = getDocumentsContext(getState().navReducer);
        const {documentsReducer} = getState()

        if (getState().navReducer.routes[getState().navReducer.index].key.indexOf('documents') == -1)
                return null;
                
        if (shouldFetchDocuments(documentsReducer, documentlist)) {
            const nextUrl = getNextUrl(getState().accessReducer.env, getState().accessReducer.sessionToken, documentsReducer, documentlist)
            dispatch(updateLastUploadId(documentlist.catId, ""));
            return dispatch(fetchDocumentsTable(nextUrl, documentlist, types.RECEIVE_DOCUMENTS))
        }
    }
}
export function refreshTable(documentlist: Object, updateRouteData: boolean = true, getStatistics = false) {
    return (dispatch, getState) => {
        try {
            if (!getState().accessReducer.isConnected)
                 return dispatch(navActions.emitToast("info", textResource.NO_INTERNET)); 

            const url = constructRetrieveDocumentsUrl(getState().accessReducer.env, getState().accessReducer.sessionToken, documentlist.fId, documentlist.sortBy, documentlist.sortDirection, documentlist.catId, documentlist.keyboard, documentlist.isSearch, documentlist.isVault)
            const {sessionToken, env, email} = getState().accessReducer;
            writeToLog(email, constans.DEBUG, `function refreshTable - url: ${url}`)
            if (updateRouteData) {
                dispatch(navActions.updateRouteData(documentlist))
            }
           // if (getStatistics)
            dispatch(Access.retrieveStatistics());
            return dispatch(fetchDocumentsTable(url, documentlist, types.REFRESH_DOCUMENTS_LIST))


        }
        catch (error) {
            writeToLog(email, constans.ERROR, `function refreshTable - Failed to refreshTable - documentlist: ${JSON.stringify(documentlist)}`, error)
        }
    }

}


export function toggleSearchBox(active: boolean) {
    return (dispatch, getState) => {
        var documentlist = getDocumentsContext(getState().navReducer);
       
        documentlist.isSearch = active;
        if (!active)
            return dispatch(refreshTable(documentlist, true))
        else 
        {
              return  dispatch(clearDocuments(documentlist));
                // dispatch(clearDocuments(documentlist));
                //  return dispatch(navActions.updateRouteData(documentlist));
                
        }
       
       // return dispatch(navActions.push(routes.documentsRoute(documentlist).route));
    }
}

export function clearAllDocumentlists() {
    return {
        type: types.CLEAR_ALL_DOCUMENTS_LIST
    }
}

export function clearDocuments(documentlist: Object, isSearch : boolean = false) {
    return (dispatch, getState) => {
        var items = [];
        var nextUrl = ""
        var dataSource = {};
        dispatch(refreshDocumentsList(items, nextUrl, documentlist, dataSource))
    }
}

function getNextUrl(env: string, sessionToken: string, documentsReducer: Object, documentlist: Object) {
    const activeDocumentsList = documentsReducer[documentlist.catId]
    if (!activeDocumentsList || activeDocumentsList.nextUrl === false || activeDocumentsList.nextUrl == "false" || activeDocumentsList.nextUrl == "" || activeDocumentsList.nextUrl == null || activeDocumentsList.nextUrl == 'null') {
        return constructRetrieveDocumentsUrl(env, sessionToken, documentlist.fId, documentlist.sortBy, documentlist.sortDirection, documentlist.catId, documentlist.keyboard, documentlist.isSearch, documentlist.isVault)
    }
    return activeDocumentsList.nextUrl
}


function receiveDocumentsList(documents: Object, nextUrl: string, documentlist: Object, dataSource: Object, totalFiles: number, totalFolders: number) {
    return {
        type: types.RECEIVE_DOCUMENTS,
        nextUrl,
        catId: documentlist.catId,
        documents,
        dataSource,
        totalFiles,
        totalFolders
    }
}


function refreshDocumentsList(documents: Object, nextUrl: string, documentlist: Object, dataSource: Object, totalFiles: number, totalFolders: number) {

    return {
        type: types.REFRESH_DOCUMENTS_LIST,
        nextUrl,
        catId: documentlist.catId,
        documents,
        dataSource,
        totalFiles,
        totalFolders
    }
}


function failedToFetchDocumentsList(documentlist: Object, url: string, errorMessage: string) {
    return {
        type: types.SUBMIT_ERROR,
        catId: documentlist.catId,
        errorMessage: errorMessage,
        nextUrl: url
    }
}

function requestDocumentsList(documentlist: Object) {
    return {
        type: types.REQUEST_DOCUMENTS,
        catId: documentlist.catId
    }
}

function shouldFetchDocuments(documentsReducer: Object, documentlist: Object) {
    const activeDocumentsList = documentsReducer[documentlist.catId]
    if (documentsReducer.isFetching)
        return false;
    if (typeof (activeDocumentsList) == 'undefined' || activeDocumentsList.items.length == 0 || !activeDocumentsList.isFetching && (activeDocumentsList.nextUrl !== null) && (activeDocumentsList.nextUrl !== "")) {
        return true
    }
    return false
}

export function updateSelectedObject(id: string, familyCode: string, permissions: object) {
    return {
        type: types.UPDATE_SELECTED_OBJECT,
        selectedObject: {
            id: id,
            familyCode: familyCode,
            permissions: permissions
        }
    }
}

export function updateCurrentFolder(id: string, permissions: object) {

    return {
        type: types.UPDATE_CURRENT_FOLDER,
        currentFolder: {
            id: id,
            permissions: permissions
        }
    }
}

export function resetCurrentFolder() {
    return {
        type: types.UPDATE_CURRENT_FOLDER,
        currentFolder: null
    }
}

export function createFolder(folderName: string, isVault: boolean) {

    return (dispatch, getState) => {
       if (!getState().accessReducer.isConnected)
            return dispatch(navActions.emitToast("info", textResource.NO_INTERNET)); 

        var documentlist = getDocumentsContext(getState().navReducer);
        const {sessionToken, env, email} = getState().accessReducer;
        const folderId = documentlist.fId;
        const createFolderUrl = getCreateFolderUrl(env, sessionToken, documentlist.fId, folderName, isVault);
        writeToLog(email, constans.DEBUG, `function createFolder - url: ${createFolderUrl}`)
        return fetch(createFolderUrl)
            .then(response => response.json())
            .then(json => {
                if (json.ResponseStatus == "FAILED") {
                    
                    // dispatch(failedToFetchDocumentsList(documentlist, "", json.ResponseData.ErrorMessage))

                    if (json.ErrorMessage.indexOf('VAL10357') > -1) {
                        dispatch(navActions.emitError("Folder Name already exists"))
                        writeToLog(email, constans.ERROR, `function createFolder - Folder Name already exists - url: ${createFolderUrl}`)
                    }
                    else {
                        dispatch(navActions.emitError("Error creating new folder"))
                        writeToLog(email, constans.ERROR, `function createFolder - Error creating new folder - url: ${createFolderUrl}`)
                    }

                }
                else {
                    //dispatch(UpdateCreateingFolderState(2))
                    dispatch(navActions.emitToast(constans.SUCCESS, 'Folder successfully created'));
                    dispatch(refreshTable(documentlist, false, true))

                }
               
            })
            .catch((error) => {
                dispatch(navActions.emitError("Error creating new folder"))
                //dispatch(UpdateCreateingFolderState(0))
            //    dispatch(navActions.updateIsProcessing(false));
                writeToLog(email, constans.ERROR, `function createFolder - Error creating new folder - url: ${createFolderUrl}`, error)
            })
            
    }
}


export function downloadDocument( document:object) {
    return (dispatch, getState) => {
        if (!getState().accessReducer.isConnected)
            return dispatch(navActions.emitToast("info", textResource.NO_INTERNET)); 
        const {sessionToken, env, email} = getState().accessReducer;
        var id = document.SharedObjectId === "" ? document.Id :document.SharedObjectId;
        var token = document.ExternalToken === "" ? sessionToken :  encodeURIComponent(document.ExternalToken);
        var isExternal = document.ExternalToken === ""?  false : true;
        var fileName = document.FileName;
        var mimeType = document.MimeType;
        
        //dispatch(updateIsFetching(true)); 
        dispatch(navActions.emitToast(constans.INFO, 'Document will be downloaded shortly'));
        const url = getDownloadFileUrl(env ,token, id, isExternal);

        writeToLog(email, constans.DEBUG, `function downloadDocument - url: ${url}`)
        fetch(url)
            .then(response => response.json())
            .then(json => {
                var downloadUrl = json.ResponseData.AccessUrl;
                RNFetchBlob.config({
                    //    path : Android_Download_Path + "/" + fileName,
                    fileCache: true,
                    // android only options, these options be a no-op on IOS
                    addAndroidDownloads: {
                        useDownloadManager: true,
                        mime: mimeType,
                        // Show notification when response data transmitted
                        notification: true,
                        // Title of download notification
                        title: fileName,
                        // File description (not notification description)
                        description: 'Download completed',
                        //  mime : 'vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                        // Make the file scannable  by media scanner
                        meidaScannable: true,

                    }
                })
                    .fetch('GET', downloadUrl)
                    .then((res) => {
                        //  RNFetchBlob.android.actionViewIntent( res.path(), 'image/jpg')
                    }
                    // RNFetchBlob.fs.scanFile([ { path : res.path(), mime : 'audio/mpeg' } ]

                    // )
                    )

                    .catch((err) => {
                        // scan file error
                    })

            }).catch(error => {
                dispatch(navActions.emitToast(constans.ERROR, 'error downloading document'))
                writeToLog(email, constans.ERROR, `function downloadDocument - error downloading document - url: ${url}`, error)

            })
            .done();
    }
}



function uploadFile(data, file) {

    return new Promise((resolve, reject) => {
        data.xhr.onerror = function(e) {
            writeToLog("", constans.ERROR, `function uploadFile - error upload File - url: ${data.url}`, e)
            reject(e);
        };
        data.xhr.onreadystatechange = function() {
            if (data.xhr.readyState === XMLHttpRequest.DONE) {
                if ((data.xhr.status >= 200 && data.xhr.status <= 299) || data.xhr.status == 0) {
                    resolve(data);
                } else {
                    // failed with error messge from server
                    writeToLog("", constans.ERROR, `function uploadFile - error upload File - url: ${data.url}  status:${data.xhr.status}`)
                    reject(data.xhr.status + ": " + data.url);
                }
            }
        };
        data.xhr.open('PUT', data.url, true);
        data.xhr.setRequestHeader('Content-Type', 'multipart/form-data');

        data.xhr.upload.addEventListener('progress', function(e) {
            console.log('upload progress = ' + e.loaded + "/" + e.total);
            if (e.total > 0){
                  var progress = Math.round( e.loaded/e.total)
                  //this.updateUploadProgress(file.uploadId, progress);
            }
          
            writeToLog("", constans.DEBUG, `function uploadFile - upload progress = : ${e.loaded} /${e.total}`)
        }, false);

        //   var formData = new FormData(); 
        //   formData.append('file', file);
        data.xhr.send(file);
    });
}

export function updateUploadDocument(datasource: object, uploadItems: object, catId: string, documentId: string = "") {
    return {
        type: types.UPDATE_UPLOAD_LIST,
        datasource,
        uploadItems,
        catId,
        lastUploadId: documentId
    }
}

export function updateItems(datasource: object, items: object, catId: string) {
    return {
        type: types.UPDATE_UPLOAD_LIST,
        datasource,
        items,
        catId
    }
}

export function clearDocumentList(catId: string) {
    return {
        type: types.CLEAR_DOCUMENT_LIST,
        catId
    }
}

export function removeUploadDocument(Id: string, catId: string, documentId: string = "") {
    return (dispatch, getState) => {
        try {
            if (!getState().accessReducer.isConnected)
                return dispatch(navActions.emitToast("info", textResource.NO_INTERNET)); 
            const {navReducer} = getState()
            const items = getState().documentsReducer[catId].items;
            const totalFiles = getState().documentsReducer[catId].totalFiles;
            const totalFolders = getState().documentsReducer[catId].totalFolders;

            var uploads = [...getState().documentsReducer[catId].uploadItems];

            var uploadObj = _.find(uploads, 'Id', Id);
            //  uploadObj.xhr = null;

            _.remove(uploads, {
                Id: Id
            });

              var documentlist = getDocumentsContext(getState().navReducer);


            var datasource = AssembleTableDatasource(items, uploads, totalFiles, totalFolders,documentlist.isSearch).ret;
            dispatch(updateUploadDocument(datasource, uploads, catId, documentId));
            
            documentlist = getDocumentsContext(getState().navReducer);
          
            if (catId == documentlist.catId) {
                dispatch(refreshTable(documentlist, false, true));
            }
            else {
                if (isDocumentsContextExists(getState().navReducer, catId)) {
                    documentlist = getDocumentsContextByCatId(getState().navReducer, catId)
                    dispatch(refreshTable(documentlist, false, true));
                }
                else {
                    dispatch(clearDocumentList(catId));
                }
            }

        }
        catch (err) {
            writeToLog("", constans.ERROR, `function removeUploadDocument - Failed! `, err)
        }
    }

}


function uploadDocumentObject(fileObject: object, uploadId: string) {
    return (dispatch, getState) => {
        if (!getState().accessReducer.isConnected)
            return dispatch(navActions.emitToast("info", textResource.NO_INTERNET)); 

        var documentlist = getDocumentsContext(getState().navReducer);
        let uploadObj = _.find(getState().documentsReducer[documentlist.catId].uploadItems, { 'Id': uploadId });
        const {sessionToken, env, email} = getState().accessReducer;

        fetch(uploadObj.url)
            .then(response => response.json())
            .then(json => {
                if (json.ResponseStatus == "FAILED") {
                    
                    var userData = parseUploadUserData(json.UserData);
                    dispatch(removeUploadDocument(userData.uploadId, userData.catId));
                    dispatch(navActions.emitToast(constans.ERROR, "Error. failed to upload file"))
                    writeToLog(email, constans.ERROR, `function uploadToKenesto(1) - Failed to upload file  3- uploadId:${userData.uploadId}`)

                }
                else {
                    var AccessUrl = json.ResponseData.AccessUrl;
                    var userData = parseUploadUserData(json.UserData);
                    var currUploadId = userData.uploadId;
                    var currCatId = userData.catId;
                    uploadFile({ xhr: uploadObj.xhr, uploadId: currUploadId, url: AccessUrl, catId: currCatId }, fileObject)
                        .then((data) => {

                            if (data.xhr.status == 0)  // xhr.abort was triggered from out side => upload paused 
                            {
                                dispatch(updateUploadItems(data.uploadId, data.catId, 0));
                                return;
                            }
                            const thisCompletedUrl = getUploadFileCompletedUrl(getState().accessReducer.env, getState().accessReducer.sessionToken, data.url, constrcutUploadUSerData(encodeURIComponent(data.uploadId), encodeURIComponent(data.catId)));
                            const documentId = getDocumentIdFromUploadUrl(thisCompletedUrl);
                            fetch(thisCompletedUrl)
                                .then(response => response.json())
                                .then(json => {
                                   
                                    // alert(JSON.stringify(json.UserData));
                                    var userData = parseUploadUserData(json.UserData);
                                    var finalUploadId = decodeURIComponent(userData.uploadId);
                                    var finalCatId = userData.catId;
                                    
                                    dispatch(removeUploadDocument(finalUploadId, finalCatId, documentId));
                                    if (json.ResponseStatus == 'OK') {

                                        let message = ""
                                        // if(isUpdateVersion)
                                        //   message = "Successfully updated document version"
                                        // else
                                        message = "File successfully uploaded"

                                        dispatch(navActions.emitToast(constans.SUCCESS, message));

                                    }
                                    else {

                                        var userData = parseUploadUserData(json.UserData);
                                        dispatch(removeUploadDocument(userData.uploadId, userData.catId));
                                        message = "Error uploading file"
                                        dispatch(navActions.emitToast(constans.ERROR, message));
                                        writeToLog(email, constans.ERROR, `function uploadToKenesto(1) - Error. failed to upload file 0, ${JSON.stringify(json)}`)
                                    }



                                })
                                .catch((error) => {
                                      
                                    dispatch(removeUploadDocument(uploadId, documentlist.catId));
                                    dispatch(navActions.emitToast(constans.ERROR, "Error. failed to upload file"))
                                    writeToLog(email, constans.ERROR, `function uploadToKenesto(2) - Error. failed to upload file 1 - uploadId: ${userData.uploadId}`, error)
                                })

                        })
                        .catch(err => {
                            dispatch(removeUploadDocument(uploadId, documentlist.catId));
                            dispatch(navActions.emitToast(constans.ERROR, "Error. failed to upload file"))
                            writeToLog(email, constans.ERROR, `function uploadToKenesto(3) - Failed to upload file  2- url: ${uploadObj.url}`, err)

                        });


                }
            })
            .catch((error) => {
                
                dispatch(removeUploadDocument(uploadId, documentlist.catId));
                dispatch(navActions.emitToast(constans.ERROR, "Error. failed to upload file"))
                writeToLog(email, constans.ERROR, `function uploadToKenesto(4) - Failed to upload file  3- uploadId:${userData.uploadId}`, error)
            })
    }
}


export function resumeUploadToKenesto(uploadId: string) {
    return (dispatch, getState) => {
        try {
            const {email} = getState().accessReducer;
            var documentlist = getDocumentsContext(getState().navReducer);
            let existingObj = _.find(getState().documentsReducer[documentlist.catId].uploadItems, { 'Id': uploadId });
            dispatch(updateUploadItems(existingObj.Id, existingObj.catId, -1));
            dispatch(uploadDocumentObject(existingObj.fileObject, existingObj.Id));
        }
        catch (err) {
            writeToLog(email, constans.ERROR, `function resumeUploadToKenesto - Failed! existingObj ${JSON.stringify(existingObj)}`, err)
        }
    }
}


export function updateUploadProgress(uploadId: string, uploadProgress : number){
   
      return (dispatch, getState) => {
        try {
            const {email} = getState().accessReducer;
            var documentlist = getDocumentsContext(getState().navReducer);
            let existingObj = _.find(getState().documentsReducer[documentlist.catId].uploadItems, { 'Id': uploadId });
            existingObj.uploadProgress = uploadProgress;
            dispatch(updateUploadItems(existingObj.Id, existingObj.catId, -1));
            dispatch(uploadDocumentObject(existingObj.fileObject, existingObj.Id));
        }
        catch (err) {
            writeToLog(email, constans.ERROR, `function resumeUploadToKenesto - Failed! existingObj ${JSON.stringify(existingObj)}`, err)
        }
    }
}



export function uploadToKenesto(fileObject: object, url: string) {
    return (dispatch, getState) => {
        try {
            const uploadId = fileObject.name + "_" + Date.now();
            var documentlist = getDocumentsContext(getState().navReducer);
            if (url != '')
                url = url + "&ud=" + constrcutUploadUSerData(encodeURIComponent(uploadId), encodeURIComponent(documentlist.catId));
            const items = getState().documentsReducer[documentlist.catId].items;
            const totalFiles = getState().documentsReducer[documentlist.catId].totalFiles;
            const totalFolders = getState().documentsReducer[documentlist.catId].totalFolders;
            var xhr = new XMLHttpRequest();
            xhr.status = -1;
            var newUploadItems = [...getState().documentsReducer[documentlist.catId].uploadItems, { Id: uploadId, uploadProgress: 0, catId: documentlist.catId, FamilyCode: 'UPLOAD_PROGRESS', Name: fileObject.name, Size: fileObject.size, fileExtension: fileObject.fileExtension, uploadStatus: -1, xhr: xhr, fileObject: fileObject, url: url }];
            var datasource = AssembleTableDatasource(items, newUploadItems, totalFiles, totalFolders, documentlist.isSearch).ret;
            dispatch(updateUploadDocument(datasource, newUploadItems, documentlist.catId, ""));
            dispatch(uploadDocumentObject(fileObject, uploadId));

        }
        catch (err) {
            writeToLog(email, constans.ERROR, `function uploadToKenesto - Failed! fileObject: ${JSON.stringify(fileObject)} url${url}`, err)
        }
    }
}
export function updateDocumentVersion(catId: string, fileObject: object, url: string, baseFileId: string, isUploading: boolean) {
    return (dispatch, getState) => {
        try {
            if (!getState().accessReducer.isConnected)
                return dispatch(navActions.emitToast("info", textResource.NO_INTERNET)); 

            if (url != '')
                url = url + "&ud=" + constrcutUploadUSerData(encodeURIComponent(baseFileId), encodeURIComponent(catId));
            const {navReducer} = getState()
            const items = getState().documentsReducer[catId].items;
            const uploadItems = getState().documentsReducer[catId].uploadItems;
            const totalFiles = getState().documentsReducer[catId].totalFiles;
            const totalFolders = getState().documentsReducer[catId].totalFolders;
            var xhr = new XMLHttpRequest();
            xhr.status = -1;
            for (var i = 0; i < items.length; i++) {
                if (items[i].Id == baseFileId) {
                    items[i].IsUploading = isUploading;
                    items[i].UploadUrl = url,
                        items[i].xhr = xhr,
                        items[i].fileObject = fileObject
                }
            }
             var documentlist = getDocumentsContext(getState().navReducer);
            var datasource = AssembleTableDatasource(items, uploadItems, totalFiles, totalFolders, documentlist.isSearch).ret;
            dispatch(updateItemsState(datasource, items, catId));
            if (isUploading) {
                dispatch(uploadNewVersion(fileObject, baseFileId));
            }
            else {
                documentlist = getDocumentsContext(getState().navReducer);
                if (catId == documentlist.catId) {
                    var isDocumentPage = navReducer.routes[navReducer.index].key == 'document';
                    if (isDocumentPage) {
                        dispatch(getDocumentInfo(baseFileId, constans.GENERAL_FAMILY));
                    }
                    dispatch(refreshTable(documentlist, false));

                }
                else {
                    if (isDocumentsContextExists(getState().navReducer, catId)) {
                        documentlist = getDocumentsContextByCatId(getState().navReducer, catId)
                        dispatch(refreshTable(documentlist, false));
                    }
                    else {
                        dispatch(clearDocumentList(catId));
                    }
                }
            }


        }
        catch (err) {
            writeToLog(email, constans.ERROR, `function uploadToKenesto - Failed! fileObject: ${JSON.stringify(fileObject)} url${url}`, err)
        }
    }
}
function uploadNewVersion(fileObject: object, baseFileId: string) {
    return (dispatch, getState) => {
       if (!getState().accessReducer.isConnected)
            return dispatch(navActions.emitToast("info", textResource.NO_INTERNET)); 

        var documentlist = getDocumentsContext(getState().navReducer);
        let uploadObj = _.find(getState().documentsReducer[documentlist.catId].items, { 'Id': baseFileId });
        const {sessionToken, env, email} = getState().accessReducer;
        fetch(uploadObj.UploadUrl)
            .then(response => response.json())
            .then(json => {
                if (json.ResponseStatus == "FAILED") {

                    dispatch(emitToast(constans.ERROR, "failed to upload file"))
                    writeToLog(email, constans.ERROR, `function uploadDocumentVersion(0) -failed to upload file, UploadUrl: ${uploadObj.UploadUrl}`)
                }
                else {
                    var AccessUrl = json.ResponseData.AccessUrl;
                    var userData = parseUploadUserData(json.UserData);
                    var currUploadId = userData.uploadId;
                    //alert(currUploadId)
                    var currCatId = userData.catId;
                    uploadFile({ xhr: uploadObj.xhr, uploadId: currUploadId, url: AccessUrl, catId: currCatId }, fileObject)
                        .then((data) => {

                            // if (data.xhr.status == 0)  // xhr.abort was triggered from out side => upload paused 
                            // {
                            //     dispatch(updateUploadItems(data.uploadId, 0));
                            //     return;
                            // }

                            const thisCompletedUrl = getUploadFileCompletedUrl(getState().accessReducer.env, getState().accessReducer.sessionToken, data.url, constrcutUploadUSerData(encodeURIComponent(data.uploadId), encodeURIComponent(data.catId)));

                            fetch(thisCompletedUrl)
                                .then(response => response.json())
                                .then(json => {
                                    var userData = parseUploadUserData(json.UserData);
                                    var finalUploadId = userData.uploadId;
                                    var finalCatId = userData.catId;
                                    //alert(finalUploadId)
                                    dispatch(updateDocumentVersion(finalCatId, fileObject, "", finalUploadId, false));
                                    if (json.ResponseStatus == 'OK') {
                                        let message = "Successfully updated document version"
                                        dispatch(navActions.emitToast(constans.SUCCESS, message));
                                    }
                                    else {
                                        let message = "Error. failed to update version"
                                        dispatch(navActions.emitToast(constans.ERROR, message));
                                        writeToLog(email, constans.ERROR, `function uploadNewVersion(1) - Failed to upload file to kenesto - AccessUrl: ${AccessUrl}`, JSON.stringify(fileObject))
                                    }



                                })
                                .catch((error) => {
                                    writeToLog(email, constans.ERROR, `function uploadDocumentVersion(2) -failed to upload file`, error)
                                    var userData = parseUploadUserData(json.UserData);
                                    dispatch(updateDocumentVersion(userData.catId, fileObject, "", userData.uploadId, false));
                                    dispatch(navActions.emitToast(constans.ERROR, "Error. failed to update version"))
                                })

                        })
                        .catch(err => {
                            writeToLog(email, constans.ERROR, `function uploadDocumentVersion(3) -failed to upload file`, err)
                            var userData = parseUploadUserData(json.UserData);
                            dispatch(updateDocumentVersion(userData.catId, fileObject, "", userData.uploadId, false));
                            dispatch(navActions.emitToast(constans.ERROR, "Error. failed to update version"))
                        });


                }
            })
            .catch((error) => {
                writeToLog(email, constans.ERROR, `function uploadDocumentVersion(4) -failed to upload file`, error)
                var userData = parseUploadUserData(json.UserData);
                dispatch(updateDocumentVersion(userData.catId, fileObject, "", userData.uploadId, false));
                dispatch(navActions.emitToast(constans.ERROR, "Error. failed to update version"))
            })
    }
}

// getDeleteFolderUrl
export function deleteAsset(id: string, familyCode: string) {
    return (dispatch, getState) => {
        if (!getState().accessReducer.isConnected)
            return dispatch(navActions.emitToast("info", textResource.NO_INTERNET)); 

        dispatch(navActions.updateIsProcessing(true));

        const {navReducer} = getState()
        const {sessionToken, env, email} = getState().accessReducer;

        const url = getDeleteAssetUrl(env, sessionToken, id, familyCode);
        writeToLog(email, constans.DEBUG, `function deleteAsset - url: ${url}`)
        return fetch(url)
            .then(response => response.json())
            .then(json => {
                dispatch(navActions.updateIsProcessing(false));
                if (json.ResponseStatus == "FAILED") {
                    dispatch(navActions.emitToast(constans.ERROR, "", "Error deleting document"))
                    writeToLog(email, constans.ERROR, `function deleteAsset - Error deleting asset - url: ${url}`)
                }
                else {
                   
                    var isDocumentPage = navReducer.routes[navReducer.index].key == 'document';
                    if (isDocumentPage) {
                        dispatch(navActions.pop());
                    }
                    var documentlist = getDocumentsContext(navReducer);
                    dispatch(refreshTable(documentlist, false, true));
                    dispatch(navActions.emitToast(constans.SUCCESS, "successfully deleted the document"))
                    
                }
            })
            .catch((error) => {
                 dispatch(navActions.updateIsProcessing(false));
                dispatch(navActions.emitToast(constans.ERROR, "Failed to delete document"))
                writeToLog(email, constans.ERROR, `function deleteAsset - Failed to delete asset - url: ${url}`, error)
            })
    }
}

export function deleteFolder(id: string) {
    return (dispatch, getState) => {
        dispatch(navActions.updateIsProcessing(true));
        const {sessionToken, env, email} = getState().accessReducer;
        const url = getDeleteFolderUrl(env, sessionToken, id);
        writeToLog(email, constans.DEBUG, `function deleteFolder - url: ${url}`)
        return fetch(url)
            .then(response => response.json())
            .then(json => {
                if (json.ResponseStatus == "FAILED") {
                    dispatch(navActions.emitToast(constans.ERROR, "Error deleting folder"))
                    writeToLog(email, constans.ERROR, `function deleteFolder - Failed to delete folder - url: ${url}`)
                }
                else {
                    dispatch(navActions.emitToast(constans.SUCCESS, "successfully deleted the folder"))
                    var documentlist = getDocumentsContext(getState().navReducer);
                    dispatch(refreshTable(documentlist, false, true))
                }
                
            })
            .catch((error) => {
                dispatch(navActions.emitToast(constans.ERROR, error, "Failed to delete folder"))
                writeToLog(email, constans.ERROR, `function deleteFolder - Failed to delete folder - url: ${url}`, error)
            })

    }
}



export function SetSharingPermissions(tags: object) {

    var permissions = [];
    tags.map((t) => (
        permissions.push({
            ParticipantUniqueID: t.tagID, FamilyCode: t.aditionalData, AccessLinkID: '00000000-0000-0000-0000-000000000000',
            ForUpdate: "true", PermissionTypeValue: 'VIEW_ONLY', AllowShare: "false", AllowUpload: "false"
        })
    ))

    return {
        type: types.SET_SHARING_PERMISSIONS,
        sharingPermissions: permissions
    }
}


export function UpdateDocumentSharingPermission() {
    return (dispatch, getState) => {
        if (!getState().accessReducer.isConnected)
            return dispatch(navActions.emitToast("info", textResource.NO_INTERNET)); 
        const documentLists = getState().documentsReducer;
        const navReducer = getState().navReducer;
        const document = getSelectedDocument(documentLists, navReducer);
        const triggerSelectedValue = getState().uiReducer.triggerSelectedValue;
        const uersDetails = getState().uiReducer.clickedTrigger.split('_');
        const ParticipantUniqueID = uersDetails[1];
        const familyCode = uersDetails[2];
        const triggerId = 'trigger_' + ParticipantUniqueID;

        var sharingPermissions = [];
        sharingPermissions.push({
            ParticipantUniqueID: ParticipantUniqueID, FamilyCode: familyCode, AccessLinkID: '00000000-0000-0000-0000-000000000000',
            ForUpdate: "true", PermissionTypeValue: triggerSelectedValue, AllowShare: "false", AllowUpload: "false"
        });

        const sharingObject = {
            asset: {
                ID: document.Id,
                FamilyCode: document.FamilyCode,
                UsersPermissions: sharingPermissions
            }
        }

        const {sessionToken, env, email} = getState().accessReducer;
        var url = getShareDocumentUrl(env, sessionToken);
        writeToLog(email, constans.DEBUG, `function UpdateDocumentSharingPermission - ParticipantUniqueID:${ParticipantUniqueID} ID:${document.Id} url: ${url}`)

        var request = new Request(url, {
            method: 'post',
            mode: 'cors',
            redirect: 'follow',
            processData: false,
            cache: false,
            headers: new Headers({
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify(sharingObject)
        });

        fetch(request).then(response => {
            //  setTimeout(function(){ dispatch(peopleActions.RemoveFromFetchingList(triggerId));}, 3000);
            dispatch(peopleActions.RemoveFromFetchingList(triggerId));
            dispatch(navActions.emitToast(constans.SUCCESS, "Sharing settings updated", ""));
            //     alert(JSON.stringify(response))

        }).catch((error) => {
            dispatch(navActions.emitError(error, ""))
            writeToLog(email, constans.ERROR, `function UpdateDocumentSharingPermission - Failed! ParticipantUniqueID:${ParticipantUniqueID} ID:${document.Id} url: ${url}`, error)
        }).done();



    }
}

export function DiscardCheckOut() {

    return (dispatch, getState) => {
        if (!getState().accessReducer.isConnected)
            return dispatch(navActions.emitToast("info", textResource.NO_INTERNET)); 

        dispatch(navActions.updateIsProcessing(true));
        const documentLists = getState().documentsReducer;
        const navReducer = getState().navReducer;
        var document = getSelectedDocument(documentLists, navReducer);
        const {sessionToken, env, email} = getState().accessReducer;
        const url = getDiscardCheckOutDocumentUrl(env, sessionToken, document.Id);
        writeToLog(email, constans.DEBUG, `function DiscardCheckOut - url: ${url}`)

        dispatch(updateIsFetching(true));
        fetch(url)
            .then(response => response.json())
            .then(json => {
                dispatch(navActions.updateIsProcessing(false));
                if (json.ResponseStatus == "FAILED") {
                    dispatch(navActions.emitError("Failed to discard Check-Out document", ""))
                    writeToLog(email, constans.ERROR, `function DiscardCheckOut - Failed to discard Check-Out document! - url: ${url}`)
                }
                else {
                    dispatch(navActions.emitToast(constans.SUCCESS, "Check-Out successfully discarded", ""));
                     var documentlist = getDocumentsContext(navReducer);
                    dispatch(refreshTable(documentlist, false, true));
                  
                }

            }).catch((error) => {
               
                dispatch(navActions.emitError("Failed to discard Check-Out document", ""))
                writeToLog(email, constans.ERROR, `function DiscardCheckOut - Failed to discard Check-Out document! - url: ${url}`, error)

            }).done();
           
    }

}
export function CheckOut() {

    return (dispatch, getState) => {
        if (!getState().accessReducer.isConnected)
            return dispatch(navActions.emitToast("info", textResource.NO_INTERNET)); 

        dispatch(navActions.updateIsProcessing(true));
        const documentLists = getState().documentsReducer;
        const navReducer = getState().navReducer;
        var document = getSelectedDocument(documentLists, navReducer);
        const {sessionToken, env, email} = getState().accessReducer;
        const url = getCheckOutDocumentUrl(env, sessionToken, document.Id);
        writeToLog(email, constans.DEBUG, `function CheckOut - url: ${url}`)
        fetch(url)
            .then(response => response.json())
            .then(json => {
                 dispatch(navActions.updateIsProcessing(false));
                if (json.ResponseStatus == "FAILED") {
                    dispatch(navActions.emitError("Failed to Check-Out document", ""))
                    writeToLog(email, constans.ERROR, `function CheckOut - Failed to Check-Out document! - url: ${url}`)
                }
                else {
                    dispatch(navActions.emitToast(constans.SUCCESS, "Document successfully checked out.", ""));
                    var documentlist = getDocumentsContext(navReducer);
                    dispatch(refreshTable(documentlist, false, true));
                  //  dispatch(Access.retrieveStatistics());

                }

            }).catch((error) => {
                dispatch(navActions.emitError("Failed to Check-Out document", ""))
                writeToLog(email, constans.ERROR, `function CheckOut - Failed to Check-Out document! - url: ${url}`, error)

            }).done();
       
    }

}


export function CheckIn(comment: string) {

    return (dispatch, getState) => {
        if (!getState().accessReducer.isConnected)
            return dispatch(navActions.emitToast("info", textResource.NO_INTERNET)); 

        dispatch(navActions.updateIsProcessing(true));
        const documentLists = getState().documentsReducer;
        const navReducer = getState().navReducer;
        var document = getSelectedDocument(documentLists, navReducer);
        const {sessionToken, env, email} = getState().accessReducer;
        const url = getCheckInDocumentUrl(env, sessionToken);
        writeToLog(email, constans.DEBUG, `function CheckIn - url: ${url}`)
      
        const jsonObject = {
            asset: {
                ID: document.Id,
                Comment: comment
            }
        }
        var request = new Request(url, {
            method: 'post',
            headers: new Headers({
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify(jsonObject)
        });

        fetch(request)
            .then(response => response.json())
            .then(json => {
                 dispatch(navActions.updateIsProcessing(false));
                if (json.ResponseStatus == "FAILED") {
                    dispatch(navActions.emitError("Failed to Check-In document", ""))
                    writeToLog(email, constans.ERROR, `function CheckIn - Failed to Check-In document! - url: ${url}`)
                }
                else {
                    dispatch(navActions.emitToast(constans.SUCCESS, "Document successfully checked in.", ""));
                     var documentlist = getDocumentsContext(navReducer);
                      dispatch(refreshTable(documentlist, false, true));
                   // dispatch(Access.retrieveStatistics());

                }

            }).catch((error) => {
                dispatch(navActions.emitError("Failed to Check-In document", ""))
                writeToLog(email, constans.ERROR, `function CheckIn - Failed to Check-In document! - url: ${url}`, error)
                dispatch(navActions.updateIsProcessing(false));
            }).done();
        
    }

}

export function EditFolder(fId: string, folderName: string, isVault: boolean) {

    return (dispatch, getState) => {
        if (!getState().accessReducer.isConnected)
            return dispatch(navActions.emitToast("info", textResource.NO_INTERNET)); 

        const {navReducer} = getState()
        var documentlist = getDocumentsContext(navReducer);
        const {sessionToken, env, email} = getState().accessReducer;
        const url = getEditFolderUrl(env, sessionToken, fId, folderName, isVault);
        writeToLog(email, constans.DEBUG, `function EditFolder - url: ${url}`)
        //dispatch(navActions.updateIsProcessing(true));
        //dispatch(updateIsFetching(true));
        fetch(url)
            .then(response => response.json())
            .then(json => {
               //  dispatch(updateIsFetching(false));
              //  dispatch(navActions.updateIsProcessing(false));
                if (json.ResponseStatus == "FAILED") {
                   
                    if (json.ErrorMessage.indexOf('VAL10357') > -1) {
                        dispatch(navActions.emitError("Folder Name already exists"))
                        writeToLog(email, constans.ERROR, `function EditFolder - Folder Name already exists! - url: ${url}`)
                    }
                    else {
                        dispatch(navActions.emitError("Failed to edit folder", ""))
                        writeToLog(email, constans.ERROR, `function EditFolder - Failed to edit folder! - url: ${url}`)
                    }

                }
                else {
                      dispatch(navActions.emitToast(constans.SUCCESS, "folder successfully updated.", ""));
                      var documentlist = getDocumentsContext(navReducer);
                      dispatch(clearDocuments(documentlist));
                      dispatch(refreshTable(documentlist, false));
                }
               
            }).catch((error) => {
               // dispatch(navActions.updateIsProcessing(false));
                dispatch(navActions.emitError("Failed to edit folder", ""))
                writeToLog(email, constans.ERROR, `function EditFolder - Failed to edit folder! - url: ${url}`, error)
            }).done();
    }

}

export function EditDocument(documentId: string, documentName: string) {
   

    return (dispatch, getState) => {          
         if (!getState().accessReducer.isConnected)
            return dispatch(navActions.emitToast("info", textResource.NO_INTERNET)); 
        var documentlist = getDocumentsContext(getState().navReducer);
        const {sessionToken, env, email} = getState().accessReducer;
        const url = getEditDocumentUrl(env, sessionToken, documentId, documentName);
        writeToLog(email, constans.DEBUG, `function EditDocument - url: ${url}`)
        var isDocumentPage = getState().navReducer.routes[getState().navReducer.index].key == 'document';
        // if (isDocumentPage) {
        //     dispatch(navActions.updateIsProcessing(true));
        // }
        fetch(url)
            .then(response => response.json())
            .then(json => {
               
                if (json.ResponseStatus == "FAILED") {
                    dispatch(navActions.emitError("Failed to edit document", ""))
                    writeToLog(email, constans.ERROR, `function EditFolder - Failed to edit document! - url: ${url}`)
                }
                else {
                    
                    if (isDocumentPage) {
                          dispatch(getDocumentInfo(documentId, constans.GENERAL_FAMILY,  types.UPDATE_ROUTE_DATA, false));
                    }

                   dispatch(refreshTable(documentlist, false));

                    
                   
                    dispatch(navActions.emitToast(constans.SUCCESS, "document successfully updated.", ""));
                }
             
            }).catch((error) => {
                dispatch(navActions.updateIsProcessing(false));
                dispatch(navActions.emitError("Failed to edit document", ""))
                writeToLog(email, constans.ERROR, `function EditFolder - Failed to edit document! - url: ${url}`, error)
            }).done();
    }

}


export function ShareDocument() {
    
    return (dispatch, getState) => {
        if (!getState().accessReducer.isConnected)
            return dispatch(navActions.emitToast("info", textResource.NO_INTERNET)); 

        const documentLists = getState().documentsReducer;
        const navReducer = getState().navReducer;
        var document = getSelectedDocument(documentLists, navReducer);
        var addPeopleTriggerValue = getState().uiReducer.addPeopleTriggerValue;
        const sharingPermissions = documentLists.sharingPermissions;
        const {sessionToken, env, email} = getState().accessReducer;

        for (var i = 0; i < sharingPermissions.length; i++) {
            if (addPeopleTriggerValue == '')
                addPeopleTriggerValue = 'VIEW_ONLY';
            sharingPermissions[i].PermissionTypeValue = addPeopleTriggerValue;
        }

        const sharingObject = {
            asset: {
                ID: document.Id,
                FamilyCode: document.FamilyCode,
                UsersPermissions: sharingPermissions
            }
        }
        var url = getShareDocumentUrl(env, sessionToken);
       // if (document.FamilyCode == 'FOLDER')
       //     url = getShareFolderUrl(env, sessionToken);
        writeToLog(email, constans.DEBUG, `function ShareDocument - ID:${document.Id} url: ${url}`)


        var request = new Request(url, {
            method: 'post',
            mode: 'cors',
            redirect: 'follow',
            processData: false,
            cache: false,
            headers: new Headers({
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify(sharingObject)
        });

        fetch(request)
            .then(response => response.json())
            .then(json => {
                dispatch(navActions.updateIsProcessing(false));
                if (json.ResponseStatus == "FAILED") {
                    dispatch(navActions.emitError("Failed to share document", ""))
                    writeToLog(email, constans.ERROR, `function ShareDocument -Failed to share document! - ID:${document.Id} url: ${url}`)
                }
                else {
                    dispatch(navActions.pop());
                    
                    dispatch(navActions.emitToast(constans.SUCCESS, "Sharing settings updated", ""));
                    
                }

            }).catch((error) => {
                 dispatch(navActions.updateIsProcessing(false));
                dispatch(navActions.emitError("Failed to share object", ""))
                writeToLog(email, constans.ERROR, `function ShareDocument -Failed to share document! - ID:${document.Id} url: ${url}`, error)
            }).done();
       
    }

}


export function updateLastUploadId(lastUploadId: object, catId: string) {
    return {
        type: types.UPDATE_LAST_UPLOAD_ID,
        lastUploadId,
        catId
    }
}
export function updateUploadItemsState(datasource: object, uploadItems: object, catId: string) {
    return {
        type: types.UPDATE_UPLOAD_ITEM,
        datasource,
        uploadItems,
        catId
    }
}

export function updateItemsState(datasource: object, items: object, catId: string) {
    return {
        type: types.UPDATE_ITEMS,
        datasource,
        items,
        catId
    }
}

export function updateUploadItems(uploadId: string, catId: string, status: number) {

    return (dispatch, getState) => {
        try {
            const items = getState().documentsReducer[catId].items;
            const uploadItems = getState().documentsReducer[catId].uploadItems;
            const totalFiles = getState().documentsReducer[catId].totalFiles;
            const totalFolders = getState().documentsReducer[catId].totalFolders;


            var obj = _.find(uploadItems,
                { 'Id': uploadId }
            );

            obj.uploadStatus = status
             var documentlist = getDocumentsContext(getState().navReducer);

            var datasource = AssembleTableDatasource(items, uploadItems, totalFiles, totalFolders, documentlist.isSearch).ret;

            dispatch(updateUploadItemsState(datasource, uploadItems, catId));

        } catch (err) {
            writeToLog("", constans.ERROR, `function updateUploadItems - Failed! , uploadId: ${JSON.stringify(uploadId)}, catId: ${JSON.stringify(catId)}`, err)
        }
    }
}

