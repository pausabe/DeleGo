import React, { Component } from 'react';
import EventsTabView from "../views/EventsTabView";
import EventsModel from "../models/EventsModel";

export default class EventsController extends Component<{}> {
  constructor(props){
    super(props);

    this.eventsData = new EventsModel();
  }

  render() {
    return (
      <EventsTabView textToShow={this.eventsData.getTextToShow()}/>
    );
  }
}
