import React, { Component } from 'react';
import {TabNavigator, TabBarBottom} from "react-navigation";

import EventsTab from './app/controllers/EventsController';
import GroupsTab from './app/controllers/GroupsController';

export default TabNavigator(
  {
    Events: {screen: EventsTab},
    Groups: {screen: GroupsTab},
  },
  {
    tabBarOptions: {
      activeTintColor: 'tomato',
      inactiveTintColor: 'gray',
    },
    tabBarComponent: TabBarBottom,
    tabBarPosition: 'bottom',
    animationEnabled: false,
    swipeEnabled: false,
  }
);
