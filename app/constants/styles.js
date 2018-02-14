import { Platform, StyleSheet } from 'react-native';

import Colors from './Colors';

module.exports = StyleSheet.create({
  tabContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.tabBackground,
  },
  normalText: {
    ...Platform.select({
      ios: {
        fontSize: 20,
      },
      android: {
        fontSize: 18,
      },
    }),
    textAlign: 'center',
    margin: 10,
  },
  headerBarContainer: {
    backgroundColor: Colors.headerBarBackground,
  },
  eventsListConainer:{

  },
  eventItemConainer:{
    backgroundColor: Colors.backgroundEventItem,
    // margin: 5,
    // marginHorizontal: 10,
    marginBottom:10
  },
  eventItemImageContainer:{
    backgroundColor:Colors.tabBackground
  },
  eventItemImage:{
    resizeMode:"cover",
    height:200
  },
  eventItemTextContainer:{
    padding: 10
  }
});
