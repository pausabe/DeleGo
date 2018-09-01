import React, { Component } from 'react';
import {
  Text,
  View,
  ScrollView,
  Platform,
  Image,
  Dimensions,
  StyleSheet
} from 'react-native';

import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

import Styles from '../utils/Styles';
import GF from '../utils/GlobalFunctions';
import Constants from '../utils/Constants';
import HR from './components/HR';

export default class EventDetailsView extends Component {
  constructor(props){
    super(props);

    this.RNFS = require('react-native-fs');

    this.state = {
      real_image_checked: false,
    }

    var introPath = "file://";
    if(Platform.OS==='ios')
      introPath += "/";

    uriPathThumb = `${introPath}${this.RNFS.DocumentDirectoryPath}/events/thumbnailEvent${props.event.id}.jpg`;
    uriPathReal = `${introPath}${this.RNFS.DocumentDirectoryPath}/events/local/images/image-${props.event.id}.jpg`;

    this.imagePath = uriPathThumb;
    this.RNFS.exists(uriPathReal)
    .then((exists) => {
      if(exists){
        this.imagePath = uriPathReal;
      }
      this.setState({real_image_checked: true});
    });
  }

  render() {
    try {
      return (
        <View style={Styles.eventsTabContainer}>
          {this.state.real_image_checked?
            <ScrollView >
              <Image
                style={{resizeMode: "cover", width: Dimensions.get('window').width, height: 200}}
                source={{isStatic: true, uri: this.imagePath}}
              />
              <View style={{paddingHorizontal: 15, paddingBottom: 15}}>
                <View style={{paddingTop: 10}}>
                  <Text style={Styles.text_event_title}>
                    {this.props.event.title}
                  </Text>
                  <Text style={Styles.text_event_subtitle}>
                    {/*this.props.event.subtitle*/"Subtitle!!"}
                  </Text>
                </View>
                <View style={{flexDirection: 'row', paddingTop: 10,}}>
                  <View style={{alignItems: 'center', alignContent: 'center', }}>
                    <Image source={require('../utils/assets/images/calendar-pressed.png')}
                            style={{height: 40, width: 40, alignContent: 'center', alignSelf: 'center',}}
                            resizeMode="contain"/>
                  </View>
                  <View style={{flex: 6, paddingLeft: 10, flexDirection: 'column', alignContent: 'center', alignSelf: 'center', }}>
                    <Text style={Styles.text_events_details_day}>
                      {this.props.event.duration.start.day}{" "}
                      {GF.Month_To_String(this.props.event.duration.start.month)}{" "}
                      {this.props.event.duration.start.year}
                    </Text>
                    <Text style={Styles.text_events_details_hour}>
                      {this.props.event.duration.start.hour}{":"}
                      {this.props.event.duration.start.minute}
                    </Text>
                  </View>
                </View>
                <View style={{flexDirection: 'row', paddingBottom: 10}}>
                  <View style={{alignItems: 'center', alignContent: 'center', }}>
                    <Image source={require('../utils/assets/images/place.png')}
                            style={{height: 40, width: 40, alignContent: 'center', alignSelf: 'center',}}
                            resizeMode="contain"/>
                  </View>
                  <View style={{flex: 6, paddingLeft: 15, flexDirection: 'column', alignContent: 'center', alignSelf: 'center', }}>
                    <Text style={Styles.text_events_details_day}>{this.props.event.organizer.name}</Text>
                    <Text style={Styles.text_events_details_hour}>{this.props.event.location.address.long}</Text>
                  </View>
                </View>
                <HR />
                <View style={{paddingVertical: 15}}>
                  <Text style={Styles.text_events_details_subtitle}>
                    {"Descripció"}
                  </Text>
                  <Text style={Styles.text_events_details_description}>
                    {"Cultivated who resolution connection motionless did occasional. Journey promise if it colonel. Can all mirth abode nor hills added. Them men does for body pure. Far end not horses remain sister. Mr parish is to he answer roused piqued afford sussex. It abode words began enjoy years no do ﻿no. Tried spoil as heart visit blush or. "}
                  </Text>
                </View>
                <HR />
              </View>
              <View style={{paddingHorizontal: 15, paddingBottom: 15}}>
                <Text style={Styles.text_events_details_subtitle}>
                  {"Com arribar-hi"}
                </Text>
              </View>
              <View style={{width: Dimensions.get('window').width, height: 200}}>
                <MapView
                  style={{...StyleSheet.absoluteFillObject}}
                  initialRegion={{
                    latitude: this.props.event.location.longitude,
                    longitude: this.props.event.location.longitude,
                    latitudeDelta: Constants.maps_latitude_delta,
                    longitudeDelta: Constants.maps_longitude_delta,
                  }}
                />
              </View>
            </ScrollView>
            :
            null
          }
        </View>
      );
    }
    catch (e) {
      console.log("Error:",e);
    }
  }
}

/*
{
  "id": 1,
  "title":
  "Cum Sociis Foundation",
  "subtitle": "",
  "description": "",
  "duration": {
    "start": {
      "day": "30",
      "month": "03",
      "year": "2019",
      "hour": "16",
      "minute": "24"
    },
    "end": {
      "day": "01",
      "month": "01",
      "year": "1970",
      "hour": "00",
      "minute": "00"
    }
  },
  "image": {
    "url_real": "",
    "url_thumbnail": ""
  },
  "price": null,
  "location": {
    "latitude": -4.68371,
    "longitude": -45.2476,
    "address": {
      "short": "",
      "long": "P.O. Box 899, 398 Libero St."
    }
  },
  "url_info": "http:\/\/www.google.es",
  "organizer": {
    "id": 40,
    "name": "Donec LLC",
    "email": "ligula.Aliquam@tinciduntpede.com",
    "mobile": "696969696"
  }
}
*/
