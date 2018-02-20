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


    if(!props.local){
      this.position = 'absolute';

    }
    else {
      this.position = 'relative';
    }

    this.uriPathThumb = `${introPath}${this.RNFS.DocumentDirectoryPath}/events/thumbnailEvent${props.item.id}.jpg`;
    this.uriPathReal = `${introPath}${this.RNFS.DocumentDirectoryPath}/events/local/imageEvent${props.item.id}.jpg`;

    this.state = {
      opaThumb: new Animated.Value(0),
      opaItem: 0,
      imageSaved: false
    }
  }

  componentDidMount(){
    //saving image in local storage (id doesnt exists yet)
    this.props.mAdapter.saveLocalImage(this.props.item.id,this.props.item.picture.real)
      .then(()=>{
        console.log("setstate (inside item) 1");
        this.setState({imageSaved:true});
      })
      .catch(error => {
        console.log("error on saving image", error);
      });
  }

  _onLoadError(type,error){
    console.log("error on loading "+type+" image", error);
  }

  _onRealLoad(event){
    console.log("real "+this.props.item.id+" loaded. thumb loaded? "+this.thumbnailLoaded);

    this.realLoaded = true;

    if(this.thumbnailLoaded){
      console.log("setstate animated (inside item) 1");
      Animated.timing(this.state.opaThumb,{
        toValue: 0,
        duration: 250
      }).start()
    }
    else{
      // console.log("setstate (inside item) 2");
      // this.setState({opaItem:1});
    }
  }

  _onThumbnailLoad(event){
    console.log("thumb "+this.props.item.id+" loaded. real loaded? "+this.realLoaded);

    if(!this.realLoaded){
      this.thumbnailLoaded = true;
      console.log("setstate animated (inside item) 2");
      Animated.timing(this.state.opaThumb,{
        toValue: 1,
        duration: 0
      }).start()
    }
    console.log("setstate (inside item) 3");
    this.setState({opaItem:1});
  }

  render(){
    console.log("rendering item ("+this.props.item.id+"). Local:",this.props.local);
    return(
      <View style={[{opacity:1},Styles.eventItemConainer]}>
        <TouchableOpacity
          onPress={this.props.onPressItem}>
          <View style={Styles.eventItemImageContainer}>
            {this.state.imageSaved?
              <Animated.Image
                style={[{position:this.position},Styles.eventItemImage]}
                source={{isStatic:true,uri:this.uriPathReal}}
                onError={this._onLoadError.bind(this,"real")}
                onLoad={this._onRealLoad.bind(this)}
              />
              :
              null
            }
            {this.props.local && !this.state.imageSaved?
              <Animated.Image
                style={[{opacity:this.state.opaThumb},Styles.eventItemImage]}
                blurRadius={2}
                source={{isStatic:true, uri:this.uriPathThumb}}
                onError={this._onLoadError.bind(this,"thumb")}
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
