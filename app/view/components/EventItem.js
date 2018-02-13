import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity
 } from 'react-native';

import Styles from '../../constants/Styles';

export default class HeaderBar extends Component {
  render() {
    return(
      <TouchableOpacity
        style={Styles.eventItemConainer}
        onPress={this.props.onPressItem}>
        <Text>
          {'\n\n\n\n\n\n\n\n'}
        </Text>
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
      </TouchableOpacity>
    )
  }
}
