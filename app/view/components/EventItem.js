import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity
 } from 'react-native';

export default class HeaderBar extends Component {
  render() {
    return(
      <TouchableOpacity style={{backgroundColor: '#CED0CE', margin: 5, padding: 10}}>
        <Text>
          {"\n\n\n\n\n\n\n\n"}{this.props.item.id}{"\n\n\n\n\n\n\n\n"}
        </Text>
      </TouchableOpacity>
    )
  }
}
