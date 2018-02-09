import React, { Component } from 'react';
import EventsTabView from "../views/EventsTabView";
import EventsModel from "../models/EventsModel";

export default class EventsController extends Component<{}> {
  constructor(props){
    super(props);

    this.eventsData = new EventsModel();
  }

  buttonPressedCB(){
    this.props.navigation.navigate('EventDetails');
  }

  render() {
    return (
      <EventsTabView
        textToShow={this.eventsData.getTextToShow()}
        buttonText={this.eventsData.getButtonText()}
        buttonPressedCB={this.buttonPressedCB.bind(this)}
      />
    );
  }
}
