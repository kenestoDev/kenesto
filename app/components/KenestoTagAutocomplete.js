'use strict';

import React, { Component, PropTypes } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  ListView,
  TouchableHighlight,
  Dimensions,
  Keyboard
} from 'react-native';
import {connect} from 'react-redux'
import Tag from './Tag';
import * as Animatable from 'react-native-animatable';
var {height, width} = Dimensions.get('window');
class KenestoTagAutocomplete extends Component {

  static defaultProps = {
    initialTags: [],
    suggestions: [],
    placeholder: 'Select tag or enter tag name...',
    addNewTagTitle: 'Add a new tag',
    onUpdateTags: () => { },
    onUpdateLayout: () => { },
    containerStyle: null,
    inputContainerStyle: null,
    textInputStyle: null,
    listStyle: null,
    minCharsToStartAutocomplete: 0
  }

  constructor(props) {
    super(props);

    var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

    this.state = {
      dataSource: ds.cloneWithRows(this._filterList(props.initialTags)),
      showlist: false,
      tags: props.initialTags,
      userInput: '',
      orientation: this.props.orientation,
      listPosition: {
        top: 100,
        left: 0,
        right: 0,
      }
    }

  }

  componentDidMount() {

    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (e) => {
      if (this.state.userInput != '') {
        this.setState({ showList: true });
        this.props.onShowTagsList();
      } 
    })
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', (e) => {
      this.setState({ showList: false });
      this.props.onHideTagsList();
    })
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    //Keyboard.removeListener('keyboardDidShow', (message) => console.log('\n\nremoveListener keyboardDidShow'));
    this.keyboardDidHideListener.remove();
    //Keyboard.removeListener('keyboardDidHide', (message) => console.log('\n\nremoveListener keyboardDidHide'))
  }


  blur() {
    this.refs.textInput.blur();
  }

  focus() {
    this.refs.textInput.focus();
  }

  clearText() {
    this.setState({ userInput: '' });
    this.refs.textInput.setNativeProps({ text: '' });
  }

  _filterList(newTags) {
    var filteredList = this.props.suggestions.filter((listElement) => {
      if (this.props.autocompleteField && this.props.uniqueField) {
        return listElement[this.props.uniqueField] !== newTags.find((t) => (t.tagID === listElement[this.props.uniqueField]))
      }
      else if (this.props.autocompleteField) {
        return listElement[this.props.autocompleteField] !== newTags.find((t) => (t.tagName === listElement[this.props.autocompleteField]))
      }
      else {
        return listElement !== newTags.find((t) => (t.tagName === listElement))
      }

    });
    return filteredList;
  }

  _addTag(tagName, tagID, iconType, iconName, aditionalData, ThumbnailPath) {
    var newTags = this.state.tags.concat({
      tagName: tagName,
      tagID: tagID,
      iconType: iconType,
      iconName: iconName,
      aditionalData: aditionalData, 
      ThumbnailPath: ThumbnailPath + '?t=' + Date.now()
    });
    var filteredList = this._filterList(newTags);
    this.setState({
      tags: newTags,
      dataSource: this.state.dataSource.cloneWithRows(filteredList),
      showList: false
    });
    
    this.props.onHideTagsList();

    this.clearText();

    this.props.onChange(newTags);
  }

  _addNewTag(tagName) {
    var _tagName = tagName;
    if (this.props.formatNewTag) {
      tagName = this.props.formatNewTag(tagName)
    }

    if (tagName === false) {
      if (this.props.onErrorAddNewTag) {
        this.props.onErrorAddNewTag(_tagName);
      }
    }
    else {
      this._addTag(tagName, tagName, 'icon', 'person-outline', 'EXTERNAL_USER', '');
    }
  }

  _renderRow(rowData, sectionID, rowID) {
    const {rowContainerStyle, autocompleteTextStyle} = this.props;
    var autocompleteString = rowData[this.props.autocompleteField] || rowData;
    var tagID = rowData[this.props.uniqueField] || autocompleteString;
    var aditionalData = rowData["FamilyCode"]
    var searchedTextLength = this.state.userInput.length;
    var searchedIndex = autocompleteString.toLowerCase().indexOf(this.state.userInput.toLowerCase());
    var textBefore = autocompleteString.substr(0, searchedIndex);
    var textAfter = autocompleteString.substr(searchedIndex + searchedTextLength);
    var autocompleteFormattedString = (<View style={{ flexDirection: "row" }}><Text style={styles.text}>{textBefore}</Text>
      <Text style={[styles.searchedText, autocompleteTextStyle]}>{autocompleteString.substr(searchedIndex, searchedTextLength)}</Text>
      <Text style={styles.text}>{textAfter}</Text></View>)
    var iconType, iconName;
    iconType = rowData.ThumbnailPath ? 'thumbnail' : 'icon';
    if (!rowData.ThumbnailPath) {
      if (rowData.IsGroup) {
        iconName = 'group';
      }
      else {
        iconName = rowData.IsExternal ? 'person-outline' : 'person'
      }
    }

    return (
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} keyboardShouldPersistTaps="always" >
        <TouchableHighlight onPress={this._addTag.bind(this, autocompleteString, tagID, iconType, iconName, aditionalData, rowData.ThumbnailPath) }>
          <View style={[styles.rowContainer, { minWidth: this.state.orientation == "PORTRAIT" ? width : height }, rowContainerStyle]}>
            {this.props.autocompleteRowTemplate ?
              this.props.autocompleteRowTemplate(autocompleteFormattedString, iconType, iconName, rowData)
              :
              autocompleteFormattedString
            }

          </View>
        </TouchableHighlight>
      </ScrollView>
    )
  }

  // _renderFooter() {
  //   const { userInput, tags } = this.state;
  //   const shouldRender = (userInput && !tags.includes(userInput) && this.props.allowAddingNewTags) ? true : false;
  //   const { addNewTagTitle, newTagStyle, newTagContainerStyle } = this.props
  //   if (shouldRender) {
  //     return (
  //       <TouchableHighlight onPress={this._addNewTag.bind(this, userInput) } underlayColor={"#efefef"}>
  //         <View style={[styles.newTagContainer, newTagContainerStyle]}>
  //           <Text style={[styles.newTagText, newTagStyle]}>{addNewTagTitle + ' \"' + userInput + '\"'}</Text>
  //         </View>
  //       </TouchableHighlight>
  //     )
  //   }

  //   return null;
  // }

  _renderSeparator(sectionID, rowID, adjacentRowHighlighted) {
    return (
      <View key={rowID} style={styles.separator}/>
    )
  }

  _onBlur() {
    this.blur();
    this.setState({ showList: false });
    this.props.onHideTagsList();
  }

  _onFocus() {
    if (this.state.userInput != '') {
      this.showTagsList();
    }
  }
  
  showTagsList(){
    this.setState({ showList: true });
    this.props.onShowTagsList();
  }

  _onChangeText(text) {
    var filteredList = this.props.suggestions.filter((listElement) => {
      if (this.props.autocompleteField && this.props.uniqueField) {
        return !this.state.tags.find(t => (t.tagID === listElement[this.props.uniqueField])) && listElement[this.props.autocompleteField].toLowerCase().includes(text.toLowerCase());
      }
      else if (this.props.autocompleteField) {
        return !this.state.tags.find(t => (t.tagName === listElement[this.props.autocompleteField])) && listElement[this.props.autocompleteField].includes(text);
      }
      else {
        return !this.state.tags.find(t => (t.tagName === listElement)) && listElement.includes(text);
      }

    })

    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(filteredList),
      userInput: text
    });

    if (text == '') {
      this.setState({ showList: false });
      this.props.onHideTagsList();
    }
    else {
      this.showTagsList();
    }
  }
  
  _onAddNewTag(){
    const { userInput, tags } = this.state;
    const shouldAdd = (userInput && !tags.includes(userInput) && this.props.allowAddingNewTags) ? true : false;
    if(shouldAdd){
      this._addNewTag(this.state.userInput);
    }
  }

  _getListView() {
    const { dataSource, listPosition } = this.state;
    const { listStyle, minCharsToStartAutocomplete } = this.props;

    if (!this.state.showList || this.state.userInput == "" || this.state.userInput.length < minCharsToStartAutocomplete) {
      return null;
    }

    return (
      <View style={{ flex: 1 }}>
        <ScrollView keyboardShouldPersistTaps="always" showsVerticalScrollIndicator={false} style={{ flex: 1 }} contentContainerStyle={{ flex: 1, alignItems: 'center', flexDirection: 'row' }}>
          <TouchableHighlight onPress={this._onAddNewTag.bind(this) } underlayColor={"#efefef"} style={{ flex: 1 }}>
            <ListView
              style={[styles.list, listStyle]}
              ref='listView'
              keyboardShouldPersistTaps="always"
              dataSource={dataSource}
              enableEmptySections={true}
              renderRow={this._renderRow.bind(this) }
              renderSeparator={this._renderSeparator.bind(this) }
              // renderFooter={this._renderFooter.bind(this) }
              key={this.state.userInput + this.state.orientation}
              />
          </TouchableHighlight>
        </ScrollView>
      </View>
    )
  }

  _removeTag(tagID) {
    var newTags = this.state.tags.filter((t) => (t.tagID !== tagID));
    var filteredList = this.props.suggestions.filter((listElement) => {
      if (this.props.autocompleteField && this.props.uniqueField) {
        return !newTags.find(t => (t.tagID === listElement[this.props.uniqueField])) && listElement[this.props.autocompleteField].includes(this.state.userInput);
      }
      else if (this.props.autocompleteField) {
        return !newTags.find(t => (t.tagName === listElement[this.props.autocompleteField])) && listElement[this.props.autocompleteField].includes(this.state.userInput);
      }
      else {
        return !newTags.find(t => (t.tagName === listElement)) && listElement.includes(this.state.userInput);
      }

    })
    this.setState({
      tags: newTags,
      dataSource: this.state.dataSource.cloneWithRows(filteredList),
    });


    this.props.onChange(newTags);

  }

  _onChangeLayout(e) {
    let layout = e.nativeEvent.layout;

    this.setState({
      listPosition: {
        top: layout.height + 10,
        left: 0,
        right: 0,
      }
    })

    this.props.onUpdateLayout(layout);
  }

  renderTags() {
    var tagTemplate = this.props.tagTemplate;
    if (this.props.uniqueField) {
      return (
        tagTemplate ? this.state.tags.map((t) => (
          <TouchableHighlight key={t.tagID} style={[styles.tagContainerStyle, this.props.tagContainerStyle]} >
            {tagTemplate(t, this._removeTag.bind(this, t.tagID)) }
          </TouchableHighlight>
        ))
          :
          this.state.tags.map((t) => (
            <Tag key={t.tagID} onPress={this._removeTag.bind(this, t.tagID) } data={t} />
          ))

      )
    }
    else {
      return (
        tagTemplate ? this.state.tags.map((t) => (
          <TouchableHighlight key={t.tagName} style={[styles.tagContainerStyle, this.props.tagContainerStyle]} >
            {tagTemplate(t.tagName, this._removeTag.bind(this, t.tagID)) }
          </TouchableHighlight>
        ))
          :
          this.state.tags.map((t) => (
            <Tag key={t.tagName} text={t.tagName} onPress={this._removeTag.bind(this, t.tagID) } />
          ))

      )
    }
  }

  render() {
    const { placeholder, containerStyle, inputContainerStyle, textInputStyle, tagTemplate } = this.props;
    var flex = (this.state.showList) ? { flex: 1 } : { flex: 0 }


    return (
      <View style={[flex, containerStyle]}>
        <View style={styles.headerContainer}>
          {this.props.title && <Text style={styles.autocompleteTitle}>{this.props.title}</Text>}
          <View ref='tagInput' style={[styles.inputContainer, inputContainerStyle]} onLayout={this._onChangeLayout.bind(this) }>

            {this.renderTags() }

            <View style={styles.textinputWrapper}>
              <TextInput
                returnKeyType = "next"
                ref='textInput'
                autoFocus={true}
                blurOnSubmit={false}
                onSubmitEditing ={() => {const { userInput } = this.state; this._addNewTag(userInput); }}
                style={[styles.textinput, textInputStyle]}
                underlineColorAndroid='transparent'
                placeholder={this.state.tags.length > 0 ? '' : this.props.placeholder}
                placeholderTextColor = {"#bbb"}
                onChangeText={this._onChangeText.bind(this) }
                onFocus={this._onFocus.bind(this) }
                onBlur={this._onBlur.bind(this) }
                autoCorrect={false}
                autoCapitalize='none'
                />
            </View>
          </View>

        </View>
        {this._getListView() }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  headerContainer: {

  },
  inputContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 30,
    paddingTop: 15,
    paddingBottom: 3,
    borderColor: '#999',
    borderBottomWidth: 1,
    alignItems: 'center'
  },
  textinputWrapper: {
    height: 30, 
    justifyContent: 'center', 
    minWidth: width-60
  },
  textinput: {
    padding: 0,
    flex: 1,
    fontSize: 14,
    height: 29,
    margin: 3,
    color: "#000",
  },
  rowContainer: {
    flexDirection: "row",
    backgroundColor: 'white',
    paddingVertical: 15,
    paddingHorizontal: 30,
  },
  newTagText: {
    fontSize: 14,
  },
  separator: {
    height: 0.5,
    alignSelf: 'stretch',
    backgroundColor: '#aaa',
  },
  list: {},
  searchedText: {
    color: "#000",
    fontWeight: "bold"
  },
  text: {
    color: "#888"
  },
  autocompleteTitle: {
    color: "#999",
    fontSize: 14,
    backgroundColor: "#fff",
    marginTop: 20,
    marginLeft: 30,
  },
  newTagContainer: {

  },
  tagContainerStyle: {
    backgroundColor: '#fff',
    paddingLeft: 5,
    paddingRight: 7,
    paddingVertical: 0,
    margin: 3,
    borderRadius: 16,
    borderWidth: 0.5,
    borderColor: "#ccc",
    height: 31
  },

});


function mapStateToProps(state) {
  const { navReducer } = state
  return {
        orientation : navReducer.orientation
  }
}

export default connect(mapStateToProps)(KenestoTagAutocomplete)