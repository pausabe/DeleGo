import React, { Component } from 'react';
import { List } from "react-native-elements";
import {
  TouchableOpacity,
  Text,
  View,
  ScrollView,
  FlatList,
  ActivityIndicator,
  NetInfo
} from 'react-native';

import ModelAdapter from "./adapters/EventsModelAdapter";
import EventItem from "./components/EventItem";
import Styles from '../constants/Styles';
import Constants from '../constants/Constants';

export default class EventsView extends Component<{}> {
  componentDidMount(){
    NetInfo.addEventListener('connectionChange',this._handleConnectionChange.bind(this));
  }

  componentWillUnmount(){
    NetInfo.removeEventListener('connectionChange',this._handleConnectionChange.bind(this));
  }

  constructor(props){
    super(props);

    this.mAdapter = new ModelAdapter();

    this.state = {
      data: [],
      refreshing: false,
      internet: null,
      firstLoad: true
    };

    this.page = 0;
    this.realImageSaved = [];
    this.noMorePages = false;
  }

  _handleConnectionChange(connectionInfo){
    console.log("connection get changed:",connectionInfo.type);
    if(this.state.internet && connectionInfo.type==='none'){
      console.log("lost internet connection");
      console.log("setState 6");
      this.setState({internet: connectionInfo.type!=='none'});
    }
    else if(!this.state.internet && connectionInfo.type!=='none'){
      console.log("recupered internet connection");
      console.log("setState 7");
      this.setState({internet: connectionInfo.type!=='none'},()=>{
        this._handleRefresh();
      });
    }
  }

  _getEventsData(){
    console.log("requested page n: "+this.page);
    this.mAdapter.getEventsData(this.page,this.state.internet).then(eventsData=>{
      if(eventsData!=="no-page"){
        if(this.realImageSaved.length >= (Constants.eventsPerPage*Constants.localPages)){
          for(i=0;i<eventsData.results.length;i++){
            this.realImageSaved.push(false);
          }
          this._updateNewData(eventsData.results);
        }
        else{
          var promises = [];
          for(i=0;i<eventsData.results.length;i++){
            var singleProm = this.mAdapter.checkRealImage(eventsData.results[i].id);
            promises.push(singleProm);
          }
          Promise.all(promises).then((results) => {
            console.log("promises results",results);
            for(i=0;i<results.length;i++){
              this.realImageSaved.push(results[i]);
            }
            this._updateNewData(eventsData.results);
          });
        }
      }
      else{
        this.noMorePages = true;
        console.log("setState 2");
        this.page -= 1;
        this.setState({ refreshing: false });
      }
    })
    .catch(error => {
      console.log("getEventsData Error: ",error);
      console.log("setState 3");
      this.setState({ refreshing: false });
    });
  }

  _updateNewData(eventsData){
    console.log("this.realImageSaved",this.realImageSaved);

    console.log("setState 1");
    this.setState({
      data: this.page === 1 ? eventsData : [...this.state.data, ...eventsData],
      refreshing: false,
      firstLoad: false
    });
  }

  _handleRefresh(){
    console.log("handle refresssssssh!!");
    console.log("setState 4");
    this.page = 1;
    this.setState(
      {
        refreshing: true
      },
      () => {
        this.noMorePages = false;
        this.realImageSaved = [];
        this._getEventsData();
      }
    );
  }

  _handleLoadMore(data){
    console.log("they are asking me to load more: ",data.distanceFromEnd);
    var boolResult = data.distanceFromEnd>parseFloat("-150");
    console.log("checking... ",boolResult);

    if(!this.noMorePages && this.state.internet && data.distanceFromEnd>parseFloat("-150")){
      console.log("handle load more");
      this.page +=1;
      this._getEventsData();
    }
  }

  _renderFooter(){
    if (this.state.refreshing) return null;

    return (
      <View style={{paddingVertical: 20,}}>
        <ActivityIndicator animating size="large" />
      </View>
    );
  }

  onPressItem(itemId){
    this.props.onPressItem(itemId);
  }

  _firstLoadComponent(){
    return(
      <View>
        <Text>carregant...</Text>
      </View>
    );
  }

  render() {
    console.log("Im rendering in upper view",this.state.data);
    return (
      <View style={Styles.eventsListConainer}>
        {this.state.internet?
          <Text>hi ha internet</Text>
          :
          <Text>NO hi ha internet</Text>
        }
        {this.state.firstLoad?
          this._firstLoadComponent()
          :
          <FlatList
            data={this.state.data}
            renderItem={({ item, index }) => (
              <EventItem
                realImageSaved={this.realImageSaved[index]}
                item={item}
                index={index}
                mAdapter={this.mAdapter}
                onPressItem={this.onPressItem.bind(this,item.id)}
              />
            )}
            keyExtractor={item => item.id}
            ListFooterComponent={this._renderFooter.bind(this)}
            onRefresh={this._handleRefresh.bind(this)}
            refreshing={this.state.refreshing}
            onEndReached={this._handleLoadMore.bind(this)}
            onEndReachedThreshold={0.01}
          />
        }
      </View>
    );
  }
}
