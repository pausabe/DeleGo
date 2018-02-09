import React, { Component } from 'react';
import {
  Text,
  View
} from 'react-native';

import Styles from '../constants/Styles';

export default class EventDetailsView extends Component<{}> {
  render() {
    return (
      <View style={Styles.tabContainer}>
        <Text style={Styles.normalText}>
          {this.props.textToShow}
        </Text>
      </View>
    );
  }
}
