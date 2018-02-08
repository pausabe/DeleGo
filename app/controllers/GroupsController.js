import React, { Component } from 'react';
import GroupsTabView from "../views/GroupsTabView";
import GroupsModel from "../models/GroupsModel";

export default class GroupsController extends Component<{}> {
  constructor(props){
    super(props);

    this.groupsData = new GroupsModel();
  }

  render() {
    return (
      <GroupsTabView textToShow={this.groupsData.getTextToShow()}/>
    );
  }
}
