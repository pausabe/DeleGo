import React, { Component } from 'react';
import {
  Text,
  View
} from 'react-native';

import Styles from '../utils/Styles';
import Colors from '../utils/Colors';
import GroupItem from './components/GroupItem';
import CustomList from './components/CustomList';
import ModelAdapter from "./adapters/GroupsModelAdapter";

export default class GroupsView extends Component {
  constructor(props){
    super(props);

    this.mAdapter = new ModelAdapter();
  }

  render() {
    try {
      return (
        <View style={Styles.groupsTabContainer}>
          <CustomList
              ListType={"Groups"}
              navigation={this.props.navigation}
              mAdapter={this.mAdapter}
              onPressItem={this.props.onPressItem.bind(this)}
              FilterBackgroundColor={Colors.filter_background_groups}
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
