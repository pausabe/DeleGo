import { Platform, StyleSheet } from 'react-native';

import Colors from './Colors';

var Dimensions = require('Dimensions');
var { width, height } = Dimensions.get('window');

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
  eventItemContainer:{
    backgroundColor: Colors.backgroundEventItem,
    // margin: 5,
    marginHorizontal: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.light_gray
  },
  eventItemImageContainer:{
    backgroundColor: Colors.backgroundItemImage,
  },
  eventItemImage:{
    resizeMode:"cover",
    //width:width,
    height:200,
  },
  eventItemTextContainer:{
    flexDirection: 'row',
  },
  text_event_month:{
    fontSize: 15,
    fontFamily: 'Futura-Medium',
    color: Colors.brand,
  },
  text_event_day:{
    fontSize: 25,
    fontFamily: 'Futura-Medium'
  },
  text_event_title:{
    fontSize: 25,
    fontFamily: 'Futura-CondensedMedium'
  },
  text_event_subtitle:{
    fontSize: 15,
    color: 'gray',
    fontFamily: 'Futura-Medium'
  },
});
