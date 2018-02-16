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

    this.realLoaded = false;
    this.thumbnailLoaded = false;

    var introPath = "file://";
    if(Platform.OS==='ios')
      introPath += "/";


    if(props.online){
      imageSavedAux = false;
      this.position = 'absolute';

    }
    else {
      imageSavedAux = true;
      this.position = 'relative';
    }

    this.uriPathThumb = `${introPath}${this.RNFS.DocumentDirectoryPath}/events/thumbnailEvent${props.item.id}.jpg`;
    this.uriPathReal = `${introPath}${this.RNFS.DocumentDirectoryPath}/events/offline/imageEvent${props.item.id}.jpg`;

    this.state = {
      opaThumb: new Animated.Value(0),
      opaItem: 0,
      imageSaved: imageSavedAux
    }
  }

  componentDidMount(){
    if(this.props.online){
      //saving image in local storage
      this.props.mAdapter.saveOfflineImage(this.props.item.id,this.props.item.picture.real)
        .then(()=>{
          console.log("image saved succesfully");
          this.setState({imageSaved:true});
        })
        .catch(error => {
          this._onError(error);
        });
    }
  }

  _onError(error){
    console.log("error on loding or saving image", error);
  }

  _onRealLoad(event){
    console.log("real "+this.props.item.id+" loaded. thumb loaded? "+this.thumbnailLoaded);

    this.realLoaded = true;

    if(this.thumbnailLoaded){
      Animated.timing(this.state.opaThumb,{
        toValue: 0,
        duration: 250
      }).start()
    }
    else{
      this.setState({opaItem:1});
    }
  }

  _onThumbnailLoad(event){
    console.log("thumb "+this.props.item.id+" loaded. real loaded? "+this.realLoaded);

    if(!this.realLoaded){
      this.thumbnailLoaded = true;
      Animated.timing(this.state.opaThumb,{
        toValue: 1,
        duration: 0
      }).start()
    }
    this.setState({opaItem:1});
  }

  render(){
    return(
      <View style={[{opacity:this.state.opaItem},Styles.eventItemConainer]}>
        <TouchableOpacity
          onPress={this.props.onPressItem}>
          <View style={Styles.eventItemImageContainer}>
            {this.state.imageSaved?
              <Animated.Image
                style={[{position:this.position},Styles.eventItemImage]}
                source={{isStatic:true, uri:this.uriPathReal}}
                onError={this._onError.bind(this)}
                onLoad={this._onRealLoad.bind(this)}
              />
              :
              null
            }
          {this.props.online?
            <Animated.Image
              style={[{opacity:this.state.opaThumb},Styles.eventItemImage]}
              blurRadius={2}
              source={{isStatic:true, uri:this.uriPathThumb}}
              onError={this._onError.bind(this)}
              onLoad={this._onThumbnailLoad.bind(this)}
            />
            :
            null
          }
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
      </View>
    );
  }
}
