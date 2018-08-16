import React, { Component } from 'react';
import {
  Text,
  View,
  ScrollView
} from 'react-native';

import Styles from '../utils/Styles';

export default class EventDetailsView extends Component {
  render() {
    return (
      <View style={Styles.tabContainer}>
        <ScrollView>
          <Text style={Styles.normalText}>
            {"Event"+this.props.itemId}
          </Text>
        </ScrollView>
      </View>
    );
  }
}
