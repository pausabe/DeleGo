import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Animated,
  Platform
 } from 'react-native';

import Styles from '../../constants/Styles';

export default class EventItem extends Component {
  constructor(props){
    super(props);

    this.RNFS = require('react-native-fs');

    this.uriPath = `events/thumbnailEvent${props.item.id}.jpg`;
    if(Platform.OS==='android')
      this.uriPath = `file://${this.RNFS.DocumentDirectoryPath}/events/thumbnailEvent${props.item.id}.jpg`;

    this.state = {
      thumbnailOpacity: new Animated.Value(1)
    }
  }

  _onError(error){
    console.log("error on loding image", error);
  }

  _onRealLoad(event){
    console.log("real loaded");
    Animated.timing(this.state.thumbnailOpacity,{
      toValue: 0,
      duration : 1
    }).start()
  }

  _onThumbnailLoad(event){
    console.log("thumbs loaded");
  }

  render(){
    return(
      <TouchableOpacity
        style={Styles.eventItemConainer}
        onPress={this.props.onPressItem}>
        <View style={Styles.eventItemImageContainer}>
          <Animated.Image
            style={[{position: 'absolute'},Styles.eventItemImage]}
            source={{uri:this.props.item.picture.real}}
            onError={this._onError.bind(this)}
            onLoad={this._onRealLoad.bind(this)}
          />
          <Animated.Image
            style={[{opacity:this.state.thumbnailOpacity},Styles.eventItemImage]}
            blurRadius={2}
            source={{uri:this.uriPath}}
            onError={this._onError.bind(this)}
            onLoad={this._onThumbnailLoad.bind(this)}
          />
        </View>
        <View style={Styles.eventItemTextContainer}>
          <Text>
            {this.props.item.title}
          </Text>
          <Text>
            {this.props.item.subtitle}
          </Text>
          <Text>
            {
              this.props.item.date.day+"/"+
              this.props.item.date.month+"/"+
              this.props.item.date.year
            }
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}
