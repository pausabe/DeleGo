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
import Styles from '../utils/Styles';
import Constants from '../utils/Constants';
import FilterBar from './components/FilterBar';

export default class EventsView extends Component {
  componentWillMount() {
    this.props.navigation.setParams({
      scrollToTop: this._onPressGoToTop.bind(this),
    });
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

    this.mAdapter = new ModelAdapter();

    this.state = {
      data: [],
      refreshing: false,
      internet: null,
      firstLoad: true,
      coolInternet: true,
    };

    this.current_refresh_is_by_button = false;
    this.last_refresh_was_by_pull = false;

    this.page = 1;
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
      // this.page = 1;
      this.setState({/*data: [],*/internet: connectionInfo.type!=='none'},()=>{
        if(this.state.firstLoad) this._handleRefresh();
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


        /*for(i=0;i<res.eventsData.length;i++){
          this.realImageSaved.push(res.realImageSaved[i]);
        }*/
        this._updateNewData(res.eventsData);
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
          for(i=0;i<error.localData.length;i++){
            ids.push(parseInt(error.localData[i].id));
          }
          var trueReturn = {};
          for(i=0;i<ids.length;i++){
            this.realImageSaved[ids[i]] = true;
          }

          this.setState({ coolInternet: false, data: error.localData });
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
        this.last_refresh_was_by_pull = !this.current_refresh_is_by_button;
        this.current_refresh_is_by_button = false;

        setTimeout(this._handleRefreshBeforeGetEvents.bind(this), 500);
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
  }

  _onPressGoToTop(){
    if(!this.state.refreshing){
      if(this.hasScroll){
        console.log("SCROLL INFO: scroll to top");
        this.flatListRef.scrollToOffset({index: 0});
      }
      else{
        this.Button_Refresh();
      }
      this.hasScroll = false;
    }
  }

  Button_Refresh(){
    try {
      console.log("button refresh");

      if(this.last_refresh_was_by_pull){
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
      <View>
        <Text>carregant...</Text>
      </View>
    );
  }

  render() {
    console.log("super render",this.state.data);
    //if(this.state.data.length > 0)
    //return null;

    try {
      return (



        <View >
          {false?
            <View >
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
            </View>
            : null}

          <FilterBar Refresh_List={this.Refresh_List.bind(this)}/>

          <View style={Styles.eventsListConainer}>


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
                    onPressItem={this.onPressItem.bind(this,item)}
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
        </View>
      );
    }
    catch (e) {
      console.log("Error: ", e);
    }
  }

  Refresh_List(first_selected, second_selected, third_selected, fourth_selected){
    try {
      this.Button_Refresh();
    }
    catch (e) {
      console.log("Error: ", e);
    }
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
