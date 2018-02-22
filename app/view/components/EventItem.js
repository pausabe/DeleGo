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
import Constants from '../../constants/Constants';

export default class EventItem extends Component {
  constructor(props){
    super(props);

    this.RNFS = require('react-native-fs');

    this.realLoaded = false;
    this.thumbnailLoaded = false;
    this.imageOverLocal = props.index >= (Constants.eventsPerPage*Constants.localPages);

    var introPath = "file://";
    if(Platform.OS==='ios')
      introPath += "/";


    if(props.realImageSaved){
      auxPos = 'relative';
      auxOpaItem = 1;
    }
    else {
      auxPos = 'absolute';
      auxOpaItem = 0;
    }

    this.uriPathThumb = `${introPath}${this.RNFS.DocumentDirectoryPath}/events/thumbnailEvent${props.item.id}.jpg`;
    this.uriPathReal = `${introPath}${this.RNFS.DocumentDirectoryPath}/events/local/imageEvent${props.item.id}.jpg`;

    this.state = {
      opaThumb: new Animated.Value(0),
      opaItem: new Animated.Value(auxOpaItem),
      needThumb: !props.realImageSaved,
      realImageSaved: props.realImageSaved,
      realPosition: auxPos,
    }
  }

  componentDidMount(){
    if(!this.props.realImageSaved && !this.imageOverLocal){
      //saving image in local storage
      this.props.mAdapter.saveLocalImage(this.props.item.id,this.props.item.picture.real)
      .then((alreadySaved)=>{
        console.log("setstate (inside item) 1");
        Animated.timing(this.state.opaItem,{
          toValue: 1,
          duration: 0
        }).start();
        if(alreadySaved){
          //with actual changes, neger should go here
          console.log("never here");
          this.setState({realImageSaved:true,needThumb:false,realPosition:'relative'});
        }
        else{
          this.setState({realImageSaved:true,needThumb:true,realPosition:'absolute'});
        }

      })
      .catch(error => {
        console.log("error on saving image", error);
      });
    }
  }

  _onLoadError(type,error){
    console.log("error on loading "+type+" image", error);
  }

  _onRealLoad(event){
    console.log("real "+this.props.item.id+" loaded. thumb loaded? "+this.thumbnailLoaded);

    this.realLoaded = true;

    // if(this.thumbnailLoaded){
      Animated.timing(this.state.opaItem,{
        toValue: 1,
        duration: 0
      }).start();
      console.log("heeeeree sshiiit (thumb)",this.props.item.id);
      Animated.timing(this.state.opaThumb,{
        toValue: 0,
        duration: 250
      }).start();
    // }
  }

  _onThumbnailLoad(event){
    console.log("thumb "+this.props.item.id+" loaded. real loaded? "+this.realLoaded);

    if(!this.props.realImageSaved && !this.realLoaded){
      this.thumbnailLoaded = true;
      Animated.timing(this.state.opaItem,{
        toValue: 1,
        duration: 0
      }).start();
      console.log("heeeeree sshiiit (real)",this.props.item.id);
      Animated.timing(this.state.opaThumb,{
        toValue: 1,
        duration: 0
      }).start()
    }
  }

  render(){
    console.log("SUPER RENDER ADVISE",this.props.realImageSaved);

    renderType = ""

    if(this.imageOverLocal){
      renderType += "| online image";
      if(this.state.needThumb) renderType += "| thumb";
    }
    else{
      if(this.state.realImageSaved) renderType += "| real saved";
      if(this.state.needThumb) renderType += "| thumb";
    }

    console.log("rendering item ("+this.props.item.id+") - "+renderType+". Container Opacity: "+this.state.opaItem._value);

    return(
      <Animated.View style={[{opacity:this.state.opaItem},Styles.eventItemConainer]}>
        <TouchableOpacity
          onPress={this.props.onPressItem}>
          <View style={Styles.eventItemImageContainer}>
            {this.imageOverLocal?
              <Animated.Image
                style={[{position:this.state.realPosition},Styles.eventItemImage]}
                source={{uri:this.props.item.picture.real}}
                onError={this._onLoadError.bind(this,"real")}
                onLoad={this._onRealLoad.bind(this)}
              />
            :
              <View>
                {this.state.realImageSaved?
                  <Animated.Image
                    style={[{position:this.state.realPosition},Styles.eventItemImage]}
                    source={{isStatic:true,uri:this.uriPathReal}}
                    onError={this._onLoadError.bind(this,"real")}
                    onLoad={this._onRealLoad.bind(this)}
                  />
                  :
                  null
                }
              </View>
            }
            {this.state.needThumb?
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
      </Animated.View>
    );
  }
}
