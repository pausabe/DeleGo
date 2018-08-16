import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Platform
 } from 'react-native';

var Dimensions = require('Dimensions');
var { width, height } = Dimensions.get('window');

export default class HeaderBar extends Component {
  render() {
    return(
      <View style={{height: null, width: null, paddingVertical: 0, marginLeft: Platform.OS === 'android'? -width/1.5 : 0}}>
        <Image source={require('../../utils/assets/images/logo-name.png')}
                style={{flex: 1, resizeMode:'contain'}}/>
      </View>
    )
  }
}
