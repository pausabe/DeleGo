import React, { Component } from 'react';
import {
  View,
  ActivityIndicator,
 } from 'react-native';

 export default class LoadingFooter extends Component {
   render() {
     return(
       <View style={{paddingVertical: 20,}}>
         <ActivityIndicator animating size="large" />
       </View>
     );
   }
 }
