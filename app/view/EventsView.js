import React, { Component } from 'react';
import { List } from "react-native-elements";
import {
  TouchableOpacity,
  Text,
  View,
  ScrollView,
  FlatList,
  ActivityIndicator,
  NetInfo,
  RefreshControl
} from 'react-native';

import ModelAdapter from "./adapters/EventsModelAdapter";
import EventItem from "./components/EventItem";
import Styles from '../constants/Styles';
import Constants from '../constants/Constants';

export default class EventsView extends Component<{}> {
  componentWillMount() {
    this.props.navigation.setParams({
      scrollToTop: this._onPressGoToTop.bind(this),
    });
  }

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
      firstLoad: true,
      coolInternet: true
    };

    this.page = 0;
    this.realImageSaved = {};
    this.noMorePages = false;
    this.loadingMore = false;
    this.hasScroll = false;
  }

  _handleConnectionChange(connectionInfo){
    console.log("Firs load or connection get changed:",connectionInfo.type);
    if(this.state.internet && connectionInfo.type==='none'){
      console.log("Firs load or lost internet connection");
      this.loadingMore = false;
      console.log("setState 6");
      this.setState({internet: connectionInfo.type!=='none'});
    }
    else if(!this.state.internet && connectionInfo.type!=='none'){
      console.log("Firs load or recupered internet connection");
      console.log("setState 7");
      this.page = 1;
      this.setState({data: [],internet: connectionInfo.type!=='none'},()=>{
        this._handleRefresh();
      });
    }
    else if(this.state.internet === null && connectionInfo.type==='none'){
      //first load no internet.. load local data
      this._handleRefresh();
    }
  }

  _getEventsData(){
    console.log("requested page n: "+this.page);
    this.mAdapter.getEventsData(this.page,this.state.internet)
    .then((res)=>{
      if(res){
        console.log("data page "+this.page,res);

        for(var key in res.realImageSaved){
          if(res.realImageSaved.hasOwnProperty(key)){
            // console.log(key + " -> " + res.realImageSaved[key]);
            this.realImageSaved[key] = res.realImageSaved[key]
          }
        }


        /*for(i=0;i<res.eventsData.results.length;i++){
          this.realImageSaved.push(res.realImageSaved[i]);
        }*/
        this._updateNewData(res.eventsData.results);
      }
      else{
        //No internet connection and no local data
        console.log("No internet connection and no local data");
      }
    })
    .catch((error) => {
      if(error.errCode === 'no-page'){
        console.log("getEventsData Catch -> no-page",error);
        this.noMorePages = true;
        console.log("setState 2");
        this.page -= 1;
        this.setState({ refreshing: false });
      }
      else if(error.errCode === 'time-out'){
        console.log("getEventsData Catch -> time-out",error);
        //si és la "primera carregada" mostrar contingut offline
        if(this.state.firstLoad && error.localData){
          console.log("time-out first load and data not null");

          var ids = [];
          for(i=0;i<error.localData.results.length;i++){
            ids.push(parseInt(error.localData.results[i].id));
          }
          var trueReturn = {};
          for(i=0;i<ids.length;i++){
            this.realImageSaved[ids[i]] = true;
          }

          this.setState({ coolInternet: false, data: error.localData.results });
          this._getEventsData();
        }
        else{
          this.setState({ coolInternet: false });
          this._getEventsData();
        }
      }
      else{
        console.log("getEventsData Error: ",error);
        this.setState({ internet: false, refreshing: false });
      }
    });
  }

  _updateNewData(eventsData){
    console.log("this.realImageSaved",this.realImageSaved);

    console.log("setState 1");
    this.setState({
      data: this.page === 1 ? eventsData : [...this.state.data, ...eventsData],
      refreshing: false,
      firstLoad: false,
      coolInternet: true,
    },()=>{
      this.loadingMore = false;
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
        // if(this.state.internet){
          this._handleRefreshBeforeGetEvents();
        // }
        /*else{
          NetInfo.isConnected.fetch().then(isConnected => {
            console.log('First, is ' + (isConnected ? 'online' : 'offline'));
            if(isConnected){
              this._handleRefreshBeforeGetEvents();
            }
            else{
              this.setState({refreshing: false});
            }
          });
        }*/
      }
    );
  }

  _handleRefreshBeforeGetEvents(){
    this.noMorePages = false;
    this.hasScroll = false;
    this.realImageSaved = {};
    this._getEventsData();
  }

  _handleLoadMore(data){
    console.log("they are asking me to load more: ",data.distanceFromEnd);
    var boolResult = data.distanceFromEnd>parseFloat("-150");
    console.log("checking... ",boolResult);

    if(!this.noMorePages && this.state.internet && data.distanceFromEnd>parseFloat("-150")){
      this.loadingMore = true;
      console.log("handle load more");
      this.page +=1;
      this._getEventsData();
    }
  }

  _renderFooter(){
    if(this.state.refreshing || !this.state.internet || this.noMorePages) return null;

    return (
      <View style={{paddingVertical: 20,}}>
        <ActivityIndicator animating size="large" />
      </View>
    );
  }

  onPressItem(itemId){
    this.props.onPressItem(itemId);
  }

  _handleOnScroll(e){
    var offset = e.nativeEvent.contentOffset.y;
    if(!this.hasScroll && offset>0){
      this.hasScroll = true;
    }
    else if(this.hasScroll && offset === 0){
      this.hasScroll = false;
    }
  }

  _onPressGoToTop(){
    if(!this.state.refreshing){
      if(this.hasScroll){
        console.log("SCROLL INFO: scroll to top");
        this.flatListRef.scrollToOffset({index: 0});
      }
      else{
        //in a future I wish I could handle refresh here, but there is a bug and no always works (see trello)
        /*console.log("SCROLL INFO: refresh (no scroll top nop)");
        this._handleRefresh();*/
      }
      this.hasScroll = false;
    }
  }

  _firstLoadComponent(){
    return(
      <View>
        <Text>carregant...</Text>
      </View>
    );
  }

  render() {
    console.log("super render",this.state.data);
    return (
      <View style={Styles.eventsListConainer}>
        {this.state.internet?
          <Text>hi ha internet</Text>
          :
          <Text>NO hi ha internet</Text>
        }
        {this.state.refreshing?
          <Text>refreshing...</Text>
          :
          null
        }
        {!this.state.coolInternet?
          <Text>Not cool internet</Text>
          :
          null
        }
        {this.state.firstLoad && !this.state.data.length?
          this._firstLoadComponent()
          :
          <FlatList
            ref={(ref) => { this.flatListRef = ref; }}
            data={this.state.data}
            renderItem={({ item, index }) => (
              <EventItem
                realImageSaved={this.realImageSaved[item.id]}
                item={item}
                index={index}
                mAdapter={this.mAdapter}
                onPressItem={this.onPressItem.bind(this,item.id)}
              />
            )}
            onScroll={this._handleOnScroll.bind(this)}
            keyExtractor={item => item.id}
            ListFooterComponent={this._renderFooter.bind(this)}
            onRefresh={this._handleRefresh.bind(this)}
            refreshing={this.state.refreshing}
            onEndReached={this._handleLoadMore.bind(this)}
            onEndReachedThreshold={0.8}
          />
        }
      </View>
    );
  }
}

/*comentant onRefresh i refreshing:
refreshControl={
   <RefreshControl
       refreshing={this.state.refreshing}
       onRefresh={this._handleRefresh.bind(this)}
       tintColor="#000"
       titleColor="#000"
    />
 }
 */

/*onViewableItemsChanged={({ viewableItems, changed }) => {
    console.log("Visible items are", viewableItems);
    console.log("Changed in this iteration", changed);
  }}*/

/*getItemLayout={(data, index) => (
  { length: 50, offset: 50 * index, index }
)}*/
