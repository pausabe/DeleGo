import React, { Component } from 'react';
import {TabNavigator, TabBarBottom, StackNavigator} from "react-navigation";
import Ionicons from 'react-native-vector-icons/Ionicons';

import HeaderBar from './app/components/HeaderBar';
import Styles from './app/constants/Styles';
import Colors from './app/constants/Colors';
import LanguagesSelector from './app/languages/selector';
import EventsTab from './app/controller/EventsController';
import EventDetailsView from './app/controller/EventDetailsController';
import GroupsTab from './app/controller/GroupsController';

const lang = new LanguagesSelector("ca");

const EventsStack = StackNavigator({
  EventsTab: {
    screen: EventsTab,
    navigationOptions: {
      title: lang.events.tabTitle,
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
    screen: EventDetailsView,
    navigationOptions: ({navigation}) => ({
      tabBarVisible: false,
      headerStyle: Styles.headerBarContainer
    })
  }
});

const GroupsStack = StackNavigator({
  GroupsTab: {
    screen: GroupsTab,
    navigationOptions: {
      title: lang.groups.tabTitle,
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
      inactiveTintColor: Colors.tabBarInactive,
    },
    tabBarComponent: TabBarBottom,
    tabBarPosition: 'bottom',
    animationEnabled: false,
    swipeEnabled: false,
  }
);
