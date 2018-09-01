import React, { Component } from 'react';
import {
  Text,
  View
} from 'react-native';

import Styles from '../utils/Styles';
import GroupItem from './components/GroupItem';

export default class GroupsView extends Component {
  render() {
    try {
      return (
        <View style={Styles.groupsTabContainer}>
          <GroupItem
            id={1}
            name={"Worship Dele"}
            description={'We want to worship Jeses throw the most wonderful conntection in earth'}
          />
          <GroupItem
            id={1}
            name={"Safor Bonaigua"}
            description={'We want to worship Jeses throw the most wonderful conntection in earth'}
          />
          <GroupItem
            id={1}
            name={"Alpha Joves '19'"}
            description={'We want to worship Jeses throw the most wonderful conntection in earth'}
          />
        </View>
      );
    }
    catch (e) {
      console.log("Error: ", e);
      return null;
    }
  }
}
