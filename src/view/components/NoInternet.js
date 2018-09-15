import React, { Component } from 'react';
import {
  View,
  ActivityIndicator,
  Text
 } from 'react-native';

 import Styles from '../../utils/Styles';

 export default class NoInternet extends Component {
   render() {
     try {
       return(
         <View style={{height: 40, flexDirection: 'row', alignItems: 'center'}}>
           <Text style={Styles.text_no_internet}>{"No hi ha connexió a internet"}</Text>
         </View>
       );
     }
     catch (e) {
       console.log("Error: ",e);
       return null;
     }
   }
 }
