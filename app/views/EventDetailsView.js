import React, { Component } from 'react';
import {
  Text,
  View,
  ScrollView
} from 'react-native';

import Styles from '../constants/Styles';

export default class EventDetailsView extends Component<{}> {
  render() {
    return (
      <View style={Styles.tabContainer}>
        <ScrollView>
          <Text style={Styles.normalText}>
            {this.props.textToShow}
          </Text>
        </ScrollView>
      </View>
    );
  }
}
