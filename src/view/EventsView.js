import React, { Component } from 'react';
import {
  Text,
  View
} from 'react-native';

import Styles from '../utils/Styles';
import EventItem from './components/GroupItem';
import CustomList from './components/CustomList';
import ModelAdapter from "./adapters/EventsModelAdapter";

export default class EventsView extends Component {
  constructor(props){
    super(props);

    this.mAdapter = new ModelAdapter();
  }

  render() {
    try {
      return (
        <View style={Styles.eventsTabContainer}>
          <CustomList
              ListType={"Events"}
              navigation={this.props.navigation}
              mAdapter={this.mAdapter}
              onPressItem={this.props.onPressItem.bind(this)}
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
