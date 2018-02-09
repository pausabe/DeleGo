import React, { Component } from 'react';
import {
  TouchableOpacity,
  Text,
  View
} from 'react-native';

import Styles from '../constants/Styles';

export default class EventsTabView extends Component<{}> {
  render() {
    return (
      <View style={Styles.tabContainer}>
        <Text style={Styles.normalText}>
          {this.props.textToShow}
        </Text>
        <TouchableOpacity onPress={this.props.buttonPressedCB}>
          <Text style={Styles.normalText}>{this.props.buttonText}</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
