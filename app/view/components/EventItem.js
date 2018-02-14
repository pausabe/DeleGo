import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image
 } from 'react-native';

import Styles from '../../constants/Styles';

export default class EventItem extends Component {
  _manageError(error){
    console.log("error on loding image", error);
  }

  render() {
    return(
      <TouchableOpacity
        style={Styles.eventItemConainer}
        onPress={this.props.onPressItem}>
        <View style={Styles.eventItemImageContainer}>
          <Image
            style={Styles.eventItemImage}
            source={{uri: this.props.item.picture}}
            onError={this._manageError.bind(this)}
          />
        </View>
        <View style={Styles.eventItemTextContainer}>
          <Text>
            {this.props.item.title}
          </Text>
          <Text>
            {this.props.item.subtitle}
          </Text>
          <Text>
            {
              this.props.item.date.day+"/"+
              this.props.item.date.month+"/"+
              this.props.item.date.year
            }
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}
