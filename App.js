import React, { Component } from 'react';
import {TabNavigator, TabBarBottom} from "react-navigation";
import Ionicons from 'react-native-vector-icons/Ionicons';

import Colors from './app/constants/Colors';
import EventsTab from './app/controllers/EventsController';
import GroupsTab from './app/controllers/GroupsController';

export default TabNavigator(
  {
    Events: {screen: EventsTab},
    Groups: {screen: GroupsTab},
  },
  {
    navigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, tintColor }) => {
        const { routeName } = navigation.state;
        let iconName;
        if (routeName === 'Events') {
          iconName = `ios-calendar${focused ? '' : '-outline'}`;
        } else if (routeName === 'Groups') {
          iconName = `ios-people${focused ? '' : '-outline'}`;
        }

        // You can return any component that you like here!
        return <Ionicons name={iconName} size={25} color={tintColor} />;
      },
    }),
    tabBarOptions: {
      activeTintColor: Colors.brandBlue,
      inactiveTintColor: Colors.tabBarBackgound,
    },
    tabBarComponent: TabBarBottom,
    tabBarPosition: 'bottom',
    animationEnabled: false,
    swipeEnabled: false,
  }
);
