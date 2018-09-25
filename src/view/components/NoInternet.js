import React, { Component } from 'react';
import {
  View,
  ActivityIndicator,
  Text
 } from 'react-native';

 import Styles from '../../utils/Styles';
 var Dimensions = require('Dimensions');
 var { width, height } = Dimensions.get('window');

 export default class NoInternet extends Component {
   render() {
     try {
       return(
         <View style={{height: 40, flexDirection: 'row', alignItems: 'center',}}>
           <View style={{width: width, flexDirection: 'column', alignItems: 'center',}}>
             <Text style={Styles.text_no_internet}>{"No hi ha connexió a internet"}</Text>
           </View>
         </View>
       );
     }
     catch (e) {
       console.log("Error: ",e);
       return null;
     }
   }
 }
