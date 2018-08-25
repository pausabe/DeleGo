import React, { Component } from 'react';
import {
  View,
 } from 'react-native';

 import Colors from "../../utils/Colors";

 export default class HRComponent extends Component {
   render() {
     return(
       <View
         style={{
           borderBottomColor: Colors.HR,
           borderBottomWidth: 1,
         }}
       />
     );
   }
 }
