import React, { Component } from 'react';
import EventsView from "../view/EventsView";

export default class EventsController extends Component<{}> {
  buttonPressedCB(){
    this.props.navigation.navigate('EventDetails');
  }

  render() {
    return (
      <EventsView
        buttonPressedCB={this.buttonPressedCB.bind(this)}
      />
    );
  }
}
