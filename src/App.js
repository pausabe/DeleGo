import React, { Component } from 'react';
import {View, Text, TouchableOpacity, Button, Image} from 'react-native';
import {TabNavigator, TabBarBottom, StackNavigator} from "react-navigation";
import Ionicons from 'react-native-vector-icons/Ionicons';

import HeaderBar from './view/components/HeaderBar';
import Styles from './utils/Styles';
import Colors from './utils/Colors';
import LanguagesSelector from './languages/selector';
import EventsTab from './controller/EventsController';
import EventDetailsView from './controller/EventDetailsController';
import GroupsTab from './controller/GroupsController';

const lang = new LanguagesSelector("ca");

const EventsStack = StackNavigator({
  EventsTab: {
    screen: EventsTab,
    navigationOptions: {
      //title: lang.events.tabTitle,
      headerTitle: <HeaderBar />,
      headerStyle: Styles.headerBarContainer,
      tabBarIcon: ({ focused, tintColor }) => {
        //let iconName;
        //iconName = `ios-calendar${focused ? '' : '-outline'}`;
        //return <Ionicons name={iconName} size={25} color={tintColor} />;
        return (
          <View style={{padding: 10}}>
            {focused?
              <Image source={require('./utils/assets/images/calendar-pressed.png')}
                          style={{flex: 1, resizeMode:'contain',}}/>
                          :
              <Image source={require('./utils/assets/images/calendar.png')}
                          style={{flex: 1, resizeMode:'contain',}}/>
            }
          </View>
        )

      },
      tabBarOnPress: (values) => {
        const { previousScene, scene, jumpToIndex } = values;

        // console.log("scene",scene);

        if(scene.focused){
          scene.route.routes[0].params.scrollToTop();
        }

        jumpToIndex(scene.route.index);
      },
    },
  },
  EventDetails: {
    screen: EventDetailsView,
    navigationOptions: ({navigation}) => ({
      tabBarVisible: false,
    })
  }
});

const GroupsStack = StackNavigator({
  GroupsTab: {
    screen: GroupsTab,
    navigationOptions: {
      //title: lang.groups.tabTitle,
      headerTitle: <HeaderBar />,
      headerStyle: Styles.headerBarContainer,
      tabBarIcon: ({ focused, tintColor }) => {
        //let iconName;
        //iconName = `ios-people${focused ? '' : '-outline'}`;
        //return <Ionicons name={iconName} size={25} color={tintColor} />;

        return (
          <View style={{padding: 10}}>
            {focused?
              <Image source={require('./utils/assets/images/people-pressed.png')}
                          style={{flex: 1, resizeMode:'contain'}}/>
              :
              <Image source={require('./utils/assets/images/people.png')}
                          style={{flex: 1, resizeMode:'contain'}}/>
            }
          </View>
        )
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
      showLabel: false,
    },
    tabBarComponent: TabBarBottom,
    tabBarPosition: 'bottom',
    animationEnabled: false,
    swipeEnabled: false,
  }
);
