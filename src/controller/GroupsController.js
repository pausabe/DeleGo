import React, { Component } from 'react';
import GroupsView from "../view/GroupsView";

export default class GroupsController extends Component {
  onPressItem(item){
    console.log("Item pressed", item);
  }

  render() {
    return (
      <GroupsView
        onPressItem={this.onPressItem.bind(this)}
        navigation={this.props.navigation}
      />
    );
  }
}
