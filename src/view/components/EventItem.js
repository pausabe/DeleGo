import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Animated,
  Platform
 } from 'react-native';

import Styles from '../../utils/Styles';
import GF from '../../utils/GlobalFunctions';
import Constants from '../../utils/Constants';

export default class EventItem extends Component {
  constructor(props){
    super(props);

    this.RNFS = require('react-native-fs');

    this.realLoaded = false;
    this.thumbnailLoaded = false;
    this.imageOverLocal = props.index >= (Constants.eventsPerPage*Constants.local_event_pages);

    var introPath = "file://";
    if(Platform.OS==='ios')
      introPath += "/";

    if(props.realImageSaved){
      auxRealPos = 'relative';
      auxOpaItem = 1;
    }
    else {
      auxRealPos = 'absolute';
      auxOpaItem = 0;
    }

    this.uriPathThumb = `${introPath}${this.RNFS.DocumentDirectoryPath}/events/thumbnailEvent${props.item.id}.jpg`;
    // this.uriPathReal = `${introPath}${this.RNFS.DocumentDirectoryPath}/events/local/images/${props.index}-image-${props.item.id}.jpg`;
    this.uriPathReal = `${introPath}${this.RNFS.DocumentDirectoryPath}/events/local/images/image-${props.item.id}.jpg`;

    this.state = {
      opaThumb: new Animated.Value(0),
      opaItem: new Animated.Value(auxOpaItem),
      needThumb: !props.realImageSaved,
      realImageSaved: props.realImageSaved,
    }
  }

  componentDidMount(){
    if(!this.props.realImageSaved && !this.imageOverLocal){
      this.props.mAdapter.saveLocalImage(this.props.item.id, /*`https://pausabe.com/apps/CBCN/images/prova1.jpg`*/this.props.item.image.url_real)
      .then(()=>{
        console.log("guapo");
        Animated.timing(this.state.opaItem,{
          toValue: 1,
          duration: 0
        }).start();

        this.setState({
          realImageSaved: true,
        });
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

    Animated.timing(this.state.opaItem,{
      toValue: 1,
      duration: 0
    }).start();
    Animated.timing(this.state.opaThumb,{
      toValue: 0,
      duration: 250
    }).start();
  }

  _onThumbnailLoad(event){
    // console.log("thumb "+this.props.item.id+" loaded. real loaded? "+this.realLoaded);

    if(!this.props.realImageSaved && !this.realLoaded){
      this.thumbnailLoaded = true;
      Animated.timing(this.state.opaItem,{
        toValue: 1,
        duration: 0
      }).start();
      // console.log("heeeeree sshiiit (real)",this.props.item.id);
      Animated.timing(this.state.opaThumb,{
        toValue: 1,
        duration: 0
      }).start()
    }
  }

  render(){
    try {
      // console.log("SUPER RENDER ADVISE",this.props.realImageSaved);

      renderType = "";

      if(this.imageOverLocal){
        renderType += "| imageOverLocal ";
        if(this.state.needThumb) renderType += "| needThumb ";
      }
      else{
        if(this.state.realImageSaved) renderType += "| realImageSaved ";
        if(this.state.needThumb) renderType += "| needThumb ";
      }

      //console.log("rendering item ("+this.props.item.id+") - |"+renderType+" || opaItem: "+this.state.opaItem._value);

      return(
        <Animated.View style={[{opacity:this.state.opaItem},Styles.eventItemContainer]}>
          <TouchableOpacity
            onPress={this.props.onPressItem}
            activeOpacity={1}>
            <View style={Styles.eventItemImageContainer}>
              {this.imageOverLocal?
                <Animated.Image
                  style={[{position: 'relative'},Styles.eventItemImage]}
                  source={{uri: this.props.item.image.url_real}}
                  onError={this._onLoadError.bind(this,"real")}
                  onLoad={this._onRealLoad.bind(this)}
                />
              :
                <View>
                  {this.state.realImageSaved?
                    <Animated.Image
                      style={[{position:'relative'},Styles.eventItemImage]}
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
                  style={[{position:this.state.realImageSaved? 'absolute':'relative', opacity:this.state.opaThumb},Styles.eventItemImage]}
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
              <View style={{flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 10}}>
                <Text style={Styles.text_event_month}>
                  {GF.Month_To_String(this.props.item.duration.start.month)}
                </Text>
                <Text style={Styles.text_event_day}>
                  {this.props.item.duration.start.day}
                </Text>
              </View>
              <View style={{flex: 7, flexDirection: 'column', padding: 10,}}>
                <Text style={Styles.text_event_title}>
                  {this.props.item.title}
                </Text>
                <Text style={Styles.text_event_subtitle}>
                  {/*this.props.item.subtitle*/"Subtitle!!"}
                </Text>
              </View>
            </View>



          </TouchableOpacity>
        </Animated.View>
      );
    }
    catch (e) {
      console.log("Error: ", e);
    }
  }
}
