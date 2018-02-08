import { Platform, StyleSheet } from 'react-native'
const styles = StyleSheet.create({
  container: {
    fontFamily: 'Arial',

    ...Platform.select({
      ios: {
        color: '#333',
      },
      android: {
        color: '#ccc',
      },
    }),
  },
});
