import React, { Component } from 'react';
import {
  Text,
  View
} from 'react-native';

import Styles from '../constants/Styles';

export default class GroupsView extends Component<{}> {
  render() {
    return (
      <View style={Styles.tabContainer}>
        <Text style={Styles.normalText}>
          {"yeah"}
        </Text>
      </View>
    );
  }
}
