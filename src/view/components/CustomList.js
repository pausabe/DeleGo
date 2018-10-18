import React, { Component } from 'react';
import { List } from "react-native-elements";
import {
  TouchableOpacity,
  Text,
  View,
  ScrollView,
  FlatList,
  NetInfo,
  RefreshControl,
  Animated,
  AsyncStorage
} from 'react-native';

import EventEmitter from 'EventEmitter';
import EventItem from "./EventItem";
import GroupItem from "./GroupItem";
import Styles from '../../utils/Styles';
import Constants from '../../utils/Constants';
import FilterBar from './FilterBar';
import LoadingFooter from './LoadingFooter';
import NoInternet from './NoInternet';

export default class CustomList extends Component {
  componentWillMount() {
    this.props.navigation.setParams({
      scrollToTop: this._onPressGoToTop.bind(this),
    });

    this.eventEmitter = new EventEmitter();
  }

  componentDidMount(){
    this.props.navigation.setParams({
      scrollToTop: this._onPressGoToTop.bind(this),
    });
    NetInfo.addEventListener('connectionChange',this._handleConnectionChange.bind(this));
  }

  componentWillUnmount(){
    NetInfo.removeEventListener('connectionChange',this._handleConnectionChange.bind(this));
  }

  constructor(props){
    super(props);

    this.mAdapter = props.mAdapter;

    this.state = {
      data: [],
      refreshing: false,
      internet: null,
      firstLoad: true,
      coolInternet: true,
      scroll_enabled: true,
      filter_hidden: new Animated.Value(0)
    };

    AsyncStorage.getItem("filter_values").then((filter_values) => {
      if(filter_values != null){
        this.filter_selection = {
          first: filter_values[0] == '1'? true : false,
          second: filter_values[1] == '1'? true : false,
          third: filter_values[2] == '1'? true : false,
          fourth: filter_values[3] == '1'? true : false
        }
      }
      else{
        this.filter_selection = {
          first: false,
          second: false,
          third: false,
          fourth: false
        }
      }

      console.log("FILTER SELECTION", this.filter_selection);
    });

    this.current_refresh_is_by_button = false;
    this.need_forced_animation = false;
    this.refreshing_by_bottom_bar = false;
    this.refreshing_by_filter = false;
    this.refreshing_manually = false;

    this.page = 1;
    this.realImageSaved = {};
    this.noMorePages = false;
    this.loadingMore = false;
    this.hasScroll = false;

    //Force Groups to update internet connection info at first load
    if(this.props.ListType == "Groups"){
      NetInfo.getConnectionInfo().then((connectionInfo) => this._handleConnectionChange(connectionInfo));
    }
  }

  _handleConnectionChange(connectionInfo){
    //console.log("Firs load or connection get changed:",connectionInfo.type);
    if(this.state.internet && connectionInfo.type==='none'){
      //console.log("Firs load or lost internet connection");
      this.loadingMore = false;
      //console.log("setState 6");
      this.setState({internet: connectionInfo.type!=='none'});
    }
    else if(!this.state.internet && connectionInfo.type!=='none'){
      //console.log("Firs load or recupered internet connection");

      //console.log("setState 7");
      this.setState({internet: connectionInfo.type!=='none'},()=>{
        if(this.state.firstLoad) {
          this._handleRefresh();
        }
      });

    }
    else if(this.state.internet === null && connectionInfo.type==='none'){
      //first load no internet.. load local data
      this.setState({internet: connectionInfo.type!=='none'},()=>{
          this._handleRefresh();
      });
    }
  }

  _getItemsData(){
    switch (this.props.ListType) {
      case "Events":
        this._getEventsData();
        break;
      case "Groups":
      console.log("["+this.props.ListType+"] (2) page", this.page);
        this._getGroupsData();
        break;
    }
  }

  _getGroupsData(){
    console.log("[Groups] requested page n: "+this.page);
    this.mAdapter.getGroupsData(this.page, this.state.internet, this.filter_selection)
    .then((res)=>{
      if(res){
        console.log("[Groups] data page "+this.page,res);

        if(res.groupsData.length == 0)
          this.noMorePages = true;
        else
          this.noMorePages = false;

        this._updateNewData(res.groupsData);
      }
      else{
        //No internet connection and no local data
        console.log("[Groups] No internet connection and no local data");
      }
    })
    .catch((error) => {
      this._manage_Get_Items_Data_Error(error);
    });
  }

  _getEventsData(){
    //console.log("[Events] requested page n: "+this.page);
    this.mAdapter.getEventsData(this.page, this.state.internet, this.filter_selection)
    .then((res)=>{
      if(res){
        console.log("[Events] data page "+this.page,res);

        if(res.eventsData.length == 0)
          this.noMorePages = true;
        else
          this.noMorePages = false;

        for(var key in res.realImageSaved){
          if(res.realImageSaved.hasOwnProperty(key)){
            // console.log(key + " -> " + res.realImageSaved[key]);
            this.realImageSaved[key] = res.realImageSaved[key]
          }
        }
        this._updateNewData(res.eventsData);
      }
      else{
        //No internet connection and no local data
        //console.log("No internet connection and no local data");
      }
    })
    .catch((error) => {
      this._manage_Get_Items_Data_Error(error);
    });
  }

  _manage_Get_Items_Data_Error(error){
    if(error.errCode === 'no-page'){
      //console.log("getEventsData Catch -> no-page",error);
      this.noMorePages = true;
      //console.log("setState 2");
      this.page -= 1;
      this.setState({ refreshing: false });
    }
    else if(error.errCode === 'time-out'){
      //console.log("getEventsData Catch -> time-out",error);
      //si és la "primera carregada" mostrar contingut offline
      if(this.state.firstLoad && error.localData){
        //console.log("time-out first load and data not null");

        var ids = [];
        for(i=0;i<error.localData.length;i++){
          ids.push(parseInt(error.localData[i].id));
        }
        var trueReturn = {};
        for(i=0;i<ids.length;i++){
          this.realImageSaved[ids[i]] = true;
        }

        this.setState({ coolInternet: false, data: error.localData });
        this._getItemsData();
      }
      else{
        this.setState({ coolInternet: false });
        this._getItemsData();
      }
    }
    else{
      //console.log("getEventsData Error: ",error);
      this.setState({ internet: false, refreshing: false });
    }
  }

  _updateNewData(data){
    //console.log("this.realImageSaved",this.realImageSaved);

    //console.log("setState 1");
    this.setState({
      data: this.page === 1 ? data : [...this.state.data, ...data],
      refreshing: false,
      firstLoad: false,
      coolInternet: true,
      scroll_enabled: true,
    },()=>{
      setTimeout(() => this.loadingMore = false, 500);
    });
  }

  _handleManualRefresh(){
    this.refreshing_manually = true;
    this._handleRefresh();
  }

  _handleRefresh(){
    //console.log("handle refresssssssh!!");
    if(this.refreshing_manually || this.refreshing_by_bottom_bar)
      this.eventEmitter.emit('cant_refresh');
    this.page = 1;
    console.log("["+this.props.ListType+"] (1) page", this.page);
    this.setState(
      {
        scroll_enabled: this.refreshing_manually,
        refreshing: true
      },
      () => {
        this.need_forced_animation = !this.current_refresh_is_by_button;
        this.current_refresh_is_by_button = false;

        setTimeout(this._handleRefreshBeforeGetItemsData.bind(this), 500);
      }
    );
  }

  _handleRefreshBeforeGetItemsData(){
    this.eventEmitter.emit('finish_refreshing');
    this.refreshing_by_bottom_bar = false;
    this.refreshing_by_filter = false;
    this.refreshing_manually = false;

    this.noMorePages = false;
    this.hasScroll = false;
    this.realImageSaved = {};
    this._getItemsData();
  }

  _handleLoadMore(data){
    console.log("["+this.props.ListType+"] they are asking me to load more: ",data.distanceFromEnd);

    if(!this.state.refreshing && !this.loadingMore && !this.noMorePages && this.state.internet /*&& data.distanceFromEnd>parseFloat("-200")*/){
      this.loadingMore = true;
      console.log("["+this.props.ListType+"] handle load more");
      this.page += 1;
      this._getItemsData();
    }
  }

  _renderFooter(){
    if(this.state.refreshing || !this.state.internet || this.noMorePages) return null;

    return (
      <LoadingFooter/>
    );
  }

  onPressItem(item){
    this.props.onPressItem(item);
  }

  _handleOnScroll(e){
    var offset = e.nativeEvent.contentOffset.y;
    //console.log("offset: " + offset);
    if(!this.hasScroll && offset>0){
      this.hasScroll = true;
    }
    else if(this.hasScroll && offset === 0){
      this.hasScroll = false;
    }

    //console.log("filter_hidden",this.state.filter_hidden);

    if(!this.state.refreshing && this.state.filter_hidden._value == 0 && offset > 1){
      Animated.timing(this.state.filter_hidden,{
        toValue: -48,
        duration: 250
      }).start();
    }

    if(!this.state.refreshing && this.state.filter_hidden._value == -48 && offset < 1){
      Animated.timing(this.state.filter_hidden,{
        toValue: 0,
        duration: 500
      }).start();
    }
  }

  _onPressGoToTop(){
    if(!this.state.refreshing){
      this.refreshing_by_bottom_bar = true;
      if(this.hasScroll){
        //console.log("SCROLL INFO: scroll to top");
        this.flatListRef.scrollToOffset({index: 0});
      }
      else{
        if(!(this.refreshing_manually || this.refreshing_by_filter)){
          setTimeout(() => {
            this.Button_Refresh();
          }, 250);
        }
      }
      this.hasScroll = false;
    }
  }

  Button_Refresh(){
    try {
      if(this.need_forced_animation){
        this.flatListRef.scrollToOffset({index: 0});
        this.flatListRef.scrollToOffset({offset: -60, animated: true });
      }

      this.current_refresh_is_by_button = true;

      this._handleRefresh();
    }
    catch (e) {
      console.log("Error:",e);
    }
  }

  _firstLoadComponent(){
    return(
      <LoadingFooter />
    );
  }

  Refresh_List(first_selected, second_selected, third_selected, fourth_selected){
    try {
      this.filter_selection = {
        first: first_selected,
        second: second_selected,
        third: third_selected,
        fourth: fourth_selected
      }
      console.log("FILTER SELECTION", this.filter_selection);
      this.refreshing_by_filter = true;
      this.Button_Refresh();
    }
    catch (e) {
      console.log("Error: ", e);
    }
  }

  render() {
    try {
      console.log("internet: ", this.state.internet);
      return (
        <View >
          <View>
            {this.state.internet == false?
              <NoInternet/>
            :
            <Animated.View style={{marginTop: this.state.filter_hidden}}>
              <FilterBar
                Refresh_List={this.Refresh_List.bind(this)}
                Event_Emitter={this.eventEmitter}
                BackgroundColor={this.props.FilterBackgroundColor}/>
            </Animated.View>
            }
          </View>

          <View style={{paddingBottom: 0}}>
            {this.state.firstLoad && !this.state.data.length?
              this._firstLoadComponent()
              :
              <FlatList
                ref={(ref) => { this.flatListRef = ref; }}
                data={this.state.data}
                renderItem={({ item, index }) => (
                  <View>
                    {this.props.ListType === "Events"?
                      <EventItem
                        realImageSaved={this.realImageSaved[item.id]}
                        item={item}
                        index={index}
                        mAdapter={this.mAdapter}
                        onPressItem={this.onPressItem.bind(this,item)}
                      />
                    :
                      <GroupItem
                        item={item}
                        index={index}
                      />
                    }
                  </View>
                )}
                scrollEnabled={this.state.scroll_enabled}
                onScroll={this._handleOnScroll.bind(this)}
                keyExtractor={item => item.id.toString()}
                ListFooterComponent={this._renderFooter.bind(this)}
                onRefresh={this._handleManualRefresh.bind(this)}
                refreshing={this.state.refreshing}
                onEndReached={this._handleLoadMore.bind(this)}
                onEndReachedThreshold={0.01}
              />
            }
          </View>
        </View>
      );
    }
    catch (e) {
      console.log("Error: ", e);
    }
  }
}
