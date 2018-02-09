import React, { Component } from 'react';
import EventDetailsView from "../views/EventDetailsView";
import EventDetailsModel from "../models/EventDetailsModel";

export default class EventDetailsController extends Component<{}> {
  constructor(props){
    super(props);
    
    this.eventData = new EventDetailsModel();
  }

  render() {
    return (
      <EventDetailsView textToShow={this.eventData.getTextToShow()}/>
    );
  }
}
