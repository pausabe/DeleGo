import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';
// import Icons from 'react-native-vector-icons/Ionicons';

export default class GroupsTabView extends Component<{}> {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          {this.props.textToShow}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});
