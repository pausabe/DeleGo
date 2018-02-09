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
  }
});
