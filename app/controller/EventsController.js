import React, { Component } from 'react';
import EventsView from "../view/EventsView";

export default class EventsController extends Component<{}> {
  onItemPress(itemId){
    this.props.navigation.navigate('EventDetails',{itemId:itemId});
  }

  render() {
    return (
      <EventsView
        onItemPress={this.onItemPress.bind(this)}
      />
    );
  }
}
