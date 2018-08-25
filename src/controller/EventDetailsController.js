import React, { Component } from 'react';
import EventDetailsView from "../view/EventDetailsView";

export default class EventDetailsController extends Component {
  render() {
    return (
      <EventDetailsView event={this.props.navigation.state.params.event}/>
    );
  }
}
