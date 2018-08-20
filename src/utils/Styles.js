import { Platform, StyleSheet } from 'react-native';

import Colors from '../utils/Colors';

//var Dimensions = require('Dimensions');
//var { width, height } = Dimensions.get('window');

const EVENT_ITEM_PADDING = 12;
const FILTER_TITLE_RADIUS = 15;

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
    //paddingTop: event_item_padding,
  },
  eventItemContainer:{
    backgroundColor: Colors.backgroundEventItem,
    marginHorizontal: EVENT_ITEM_PADDING,
    marginBottom: EVENT_ITEM_PADDING,
    borderWidth: 1,
    borderColor: Colors.light_gray
  },
  eventItemImageContainer:{
    backgroundColor: Colors.backgroundItemImage,
  },
  eventItemImage:{
    resizeMode:"cover",
    height: 200,
  },
  eventItemTextContainer:{
    flexDirection: 'row',
  },
  text_event_month:{
    fontSize: 13,
    fontFamily: 'Futura-Medium',
    color: Colors.brand_purple,
  },
  text_event_day:{
    fontSize: 25,
    fontFamily: 'Futura-Medium',
    color: Colors.text_black,
  },
  text_event_title:{
    fontSize: 25,
    fontFamily: 'Futura-CondensedMedium',
    color: Colors.text_black,
  },
  text_event_subtitle:{
    fontSize: 15,
    color: Colors.text_gray,
    fontFamily: 'Futura-Medium',
  },
  filterBar_container: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: EVENT_ITEM_PADDING
  },
  filter_name_container_normal:{
    flex: 1,
    paddingVertical: 1,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.text_black,
    borderRadius: FILTER_TITLE_RADIUS,
  },
  filter_name_container_selected:{
    flex: 1,
    paddingVertical: 1,
    alignItems: 'center',
    backgroundColor: Colors.brand_yellow,
    borderWidth: 1,
    borderColor: Colors.brand_yellow,
    borderTopRightRadius: FILTER_TITLE_RADIUS,
    borderTopLeftRadius: FILTER_TITLE_RADIUS,
    borderBottomRightRadius: FILTER_TITLE_RADIUS,
  },
  text_filter_name_normal:{
    fontSize: 15,
    fontFamily: 'Futura-Medium',
    color: Colors.text_black,
  },
  text_filter_name_selected:{
    fontSize: 15,
    fontFamily: 'Futura-Medium',
    color: Colors.text_white,
  }
});
