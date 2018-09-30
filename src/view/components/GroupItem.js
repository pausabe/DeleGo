import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  Platform,
  TouchableOpacity,
  Linking
 } from 'react-native';
import getDirections from 'react-native-google-maps-directions';

import Styles from '../../utils/Styles';
import GF from '../../utils/GlobalFunctions';
import Constants from '../../utils/Constants';
import HR from './HR';

const IMAGE_SIZE = 100;
const BUTTON_SIZE = 25;

export default class GroupItem extends Component {
  constructor(props){
    super(props);

    this.RNFS = require('react-native-fs');

    var introPath = "file://";
    if(Platform.OS==='ios')
      introPath += "/";

    this.uriPathImage = `${introPath}${this.RNFS.DocumentDirectoryPath}/groups/group${props.item.id}.jpg`;
  }

  onPlacePress(){
    try {
      console.log("Place Pressed");

      const data = {
        source: {
        },
        destination: {
          latitude: -33.8600024,
          longitude: 18.697459
        },
        params: [
          {
            key: "travelmode",
            value: "driving" // may be "walking", "bicycling" or "transit" as well
          },
          {
            key: "dir_action",
            value: "navigate" // this instantly initializes navigation using the given travel mode
          }
        ]
      }

      getDirections(data);
    }
    catch (e) {
      console.log("Error: ", e);
    }
  }

  onMailPress(){
    try {
      console.log("Mail Pressed");

      Linking.openURL('mailto:support@example.com?subject=SendMail&body=Description');
    }
    catch (e) {
      console.log("Error: ", e);
    }
  }

  onLinkPress(){
    try {
      console.log("Link Pressed");

      Linking.openURL('https://google.com');
    }
    catch (e) {
      console.log("Error: ", e);
    }
  }

  render() {
    try {
      return(
        <View style={Styles.groupItemContainer}>
          <View style={{flexDirection: 'row'}}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Image
                style={{resizeMode: "cover", width: IMAGE_SIZE, height: IMAGE_SIZE, borderRadius: 10,}}
                source={{isStatic: true, uri: this.uriPathImage}}
              />
            </View>
            <View style={{paddingHorizontal: 15, paddingRight: IMAGE_SIZE}}>
              <Text style={Styles.text_group_title}>{this.props.item.name}</Text>
              <Text style={Styles.text_group_subtitle}>{this.props.item.description}</Text>
              <View style={{alignItems: 'center'}}>
                <View style={{paddingTop: 5, flexDirection: 'row', alignItems: 'center'}}>
                  <TouchableOpacity
                    onPress={this.onPlacePress.bind(this)}>
                      <Image source={require('../../utils/assets/images/place.png')}
                              style={{paddingRight: 70, height: BUTTON_SIZE, width: BUTTON_SIZE,}}
                              resizeMode="contain"/>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={this.onMailPress.bind(this)}>
                      <Image source={require('../../utils/assets/images/megaphone-pressed.png')}
                              style={{height: BUTTON_SIZE, width: BUTTON_SIZE,}}
                              resizeMode="contain"/>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={this.onLinkPress.bind(this)}>
                      <Image source={require('../../utils/assets/images/plane.png')}
                              style={{paddingLeft: 70, height: BUTTON_SIZE, width: BUTTON_SIZE,}}
                              resizeMode="contain"/>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={{paddingTop: 15}}>
                <HR/>
              </View>
            </View>
          </View>
        </View>
      );
    }
    catch (e) {
      console.log("Error: ", e);
      return null;
    }
  }
}

/*
{
  "id": 1,
  "name": "Curabitur Sed Tortor Consulting",
  "place": 1,
  "description": "nonummy ultricies ornare, elit elit fermentum risus, at fringilla purus mauris a nunc. In at pede. Cras vulputate",
  "url_image": "image_1",
  "contact_email": "volutpat.Nulla.dignissim@Curabiturconsequatlectus.com",
  "district": "BA"
}
*/
