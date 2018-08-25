import React, { Component } from 'react';
import EventsView from "../view/EventsView";

export default class EventsController extends Component {
  onPressItem(item){
    this.props.navigation.navigate('EventDetails',{event: item});
  }

  render() {
    return (
      <EventsView
        onPressItem={this.onPressItem.bind(this)}
        navigation={this.props.navigation}
      />
    );
  }
}
