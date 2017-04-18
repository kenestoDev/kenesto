/**
 * The examples provided by Facebook are for non-commercial testing and
 * evaluation purposes only.
 *
 * Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
 * OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NON INFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN
 * AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * @flow
 */
'use strict';

import React from 'react'
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  TouchableNativeFeedback,
  View
} from 'react-native';
import moment from 'moment';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MartialExtendedConf from '../assets/icons/config.json';
import customConfig from '../assets/icons/customConfig.json';
import { createIconSetFromFontello } from 'react-native-vector-icons'
import { updateSelectedObject, getDocumentPermissions } from '../actions/documentsActions'
import * as uiActions from '../actions/uiActions'
import { connect } from 'react-redux'
import { getIconNameFromExtension } from '../utils/documentsUtils'
const KenestoIcon = createIconSetFromFontello(MartialExtendedConf);
const CustomIcon = createIconSetFromFontello(customConfig);
import _ from "lodash";
import * as Progress from 'react-native-progress';
import { writeToLog } from '../utils/ObjectUtils'
import * as constans from '../constants/GlobalConstans'
import getImageSource from './GetImageSource';
import { getTime } from '../utils/KenestoHelper';
import { hideToast, emitToast } from '../actions/navActions'
import imageSource from '../assets/thumbnail_img.png';
var DocumentCell = React.createClass({

  menuPressed: function (id, familyCode) {
    var {dispatch} = this.props;
    if (!this.props.isConnected) {
      dispatch(emitToast("info", "No internet connection"));
      return false;
    }
    //   console.log('menu pressed ' + getTime());
    dispatch(updateSelectedObject(id, familyCode, ""));
    // dispatch(getDocumentPermissions(id, familyCode))
    this.context.itemMenuContext.open();
    // dispatch(uiActions.setOpenModalRef('modalItemMenu'))
  },

  render: function () {
    var {documentsReducer} = this.props;
    var dummyProgressBar = <View style={styles.progressBarContainer}><Progress.Bar indeterminate={true} width={75} height={4} borderRadius={0} borderWidth={0} unfilledColor={"#ccc"} /></View>
    var uploadingInProgress = this.props.document.IsUploading
    var TouchableElement = TouchableHighlight;

    var fileExtension = this.props.document.FileExtension; // this.props.document.IsExternalLink? 'link' : this.props.document.FileExtension;
    if (this.props.document.IsExternalLink){
      if (this.props.document.ExternalLinkType == 'DROPBOX')
      {
           fileExtension = 'dropbox'; 
      }
           
      else 
            fileExtension = 'link';
    }

    var documentName = (this.props.document.IsExternalLink && this.props.document.ExternalLinkType != 'DROPBOX') || this.props.document.FileExtension == '' || this.props.document.FileExtension == null ? this.props.document.Name : this.props.document.Name + this.props.document.FileExtension;

    if (Platform.OS === 'android') {
      TouchableElement = TouchableNativeFeedback;
    }
    var elementIcon;
    if (this.props.document.HasThumbnail) {
      elementIcon = <Image source={{ uri: this.props.document.ThumbnailUrl }} style={styles.previewThumbnail} />
    }
    else {
      if (this.props.document.FamilyCode == 'FOLDER') {
        if (this.props.document.IsVault)
          elementIcon = <CustomIcon name="vault" style={styles.icon} />
        else
          elementIcon = <KenestoIcon name="folder" style={styles.kenestoIcon} />
      }
      else {
        if (typeof this.props.document.IconName != 'undefined') {
      
          var iconName = getIconNameFromExtension(fileExtension).iconName;
          var customStyle = getIconNameFromExtension(fileExtension).customStyle;
          elementIcon = <View style={styles.iconFiletype}>
            {iconName === 'solidw' ?
              <CustomIcon name={iconName} style={[styles.icon, customStyle]} />
              :
              <KenestoIcon name={iconName} style={[styles.kenestoIcon, customStyle]} />
            }

          </View>
        }
        else
          elementIcon = <View style={styles.iconFiletype}><KenestoIcon name="description" style={styles.kenestoIcon} /></View>
      }
    }

    return (
      <View>
        <TouchableElement
          onPress={this.props.onSelect}
          onShowUnderlay={this.props.onHighlight}
          onHideUnderlay={this.props.onUnhighlight}>
          <View style={styles.row}>
            <View style={styles.iconContainer}>
              {elementIcon}
            </View>
            <View style={styles.textContainer}>
              <View style={{ flexDirection: "row" }}>
                {this.props.document.IsCheckedOut && <View style={styles.customIconContainer}>
                  <CustomIcon name="checkout" style={[styles.icon, styles.smallIcon]} />
                </View>}
                <Text style={styles.documentTitle} numberOfLines={2}>
                  {documentName}
                </Text>
              </View>
              <Text style={styles.documentYear} numberOfLines={1}>
                {"Modified " + moment(this.props.document.ModificationDate).format('MMM DD, YYYY')}
              </Text>
              {uploadingInProgress ?
                <View style={styles.progressBarContainer}><Progress.Bar indeterminate={true} width={75} height={4} borderRadius={0} borderWidth={0} unfilledColor={"#ccc"} /></View>
                :
                <View></View>
              }
            </View>
            {uploadingInProgress ?
              <View></View>
              :
              <TouchableOpacity  onPress={(() => { this.menuPressed(this.props.document.Id, this.props.document.FamilyCode) }).bind(this)}>
                <View style={styles.iconContainer}>
                  <Icon name="more-vert" style={styles.moreMenu} />
                </View>
              </TouchableOpacity >
            }
          </View>
        </TouchableElement>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  textContainer: {
    flex: 1,
    marginLeft: 7,
  },
  documentTitle: {
    //flex: 1,
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  documentYear: {
    color: '#999999',
    fontSize: 12,
  },
  row: {
    alignItems: 'center',
    backgroundColor: 'white',
    flexDirection: 'row',
    padding: 5,
  },
  iconContainer: {
    height: 57,
    width: 57,
    alignItems: 'center',
    justifyContent: "center",
    marginLeft: 10
  },
  previewThumbnail: {
    height: 40,
    width: 55,
    borderWidth: 0.5,
    borderColor: "#bbb"
  },
  icon: {
    fontSize: 22,
    color: '#888',
  },
  kenestoIcon: {
    fontSize: 22,
    color: '#888',
    marginTop: -12
  },
  iconFiletype: {
    height: 40,
    width: 55,
    alignItems: 'center',
    justifyContent: "center",
    // borderWidth: 0.5,
    // borderColor: "#999"
  },
  moreMenu: {
    fontSize: 22,
    color: '#888',
  },
  progressBarContainer: {
    justifyContent: "center",
    marginHorizontal: 15,
  },
  customIconContainer: {
    justifyContent: 'center',
    marginTop: 3,
    marginRight: 5,
    width: 16,
    height: 16,
  },
  smallIcon: {
    fontSize: 16,
    color: "#fa8302"
  }
});

DocumentCell.contextTypes = {
  itemMenuContext: React.PropTypes.object,
};

export default DocumentCell;

//module.exports = DocumentCell // connect(mapStateToProps)(DocumentCell)