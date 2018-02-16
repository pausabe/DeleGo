import React, { Component } from 'react';
import EventsView from "../view/EventsView";

export default class EventsController extends Component<{}> {
  onPressItem(itemId){
    this.props.navigation.navigate('EventDetails',{itemId:itemId});
  }

  render() {
    return (
      <EventsView
        onPressItem={this.onPressItem.bind(this)}
      />
    );
  }
}
