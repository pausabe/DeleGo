import React, { Component } from 'react';
import {TabNavigator, TabBarBottom, StackNavigator} from "react-navigation";
import Ionicons from 'react-native-vector-icons/Ionicons';

import HeaderBar from './app/components/HeaderBar';
import Styles from './app/constants/Styles';
import Colors from './app/constants/Colors';
import Labels from './app/constants/Labels';
const labels = new Labels();
import EventsTab from './app/controllers/EventsController';
import EventDetailsController from './app/controllers/EventDetailsController';
import GroupsTab from './app/controllers/GroupsController';

const harcodedLang = "ca";

const EventsStack = StackNavigator({
  EventsTab: {
    screen: EventsTab,
    navigationOptions: {
      title: labels.eventsTabTitle(harcodedLang),
      headerTitle: <HeaderBar />,
      headerStyle: Styles.headerBarContainer,
      tabBarIcon: ({ focused, tintColor }) => {
        let iconName;
        iconName = `ios-calendar${focused ? '' : '-outline'}`;
        return <Ionicons name={iconName} size={25} color={tintColor} />;
      },
    },
  },
  EventDetails: {
    screen: GroupsTab,
    navigationOptions: {
      tabBarVisible: false,
      headerStyle: Styles.headerBarContainer
    }
  }
});

const GroupsStack = StackNavigator({
  GroupsTab: {
    screen: GroupsTab,
    navigationOptions: {
      title: labels.groupsTabTitle(harcodedLang),
      headerTitle: <HeaderBar />,
      headerStyle: Styles.headerBarContainer,
      headerStyle: Styles.headerBarContainer,
      tabBarIcon: ({ focused, tintColor }) => {
        let iconName;
        iconName = `ios-people${focused ? '' : '-outline'}`;
        return <Ionicons name={iconName} size={25} color={tintColor} />;
      },
    }
  },
});

export default TabNavigator(
  {
    Events: { screen: EventsStack },
    Groups: { screen: GroupsStack },
  },
  {
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
