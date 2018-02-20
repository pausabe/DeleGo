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
    this.itemLocal = [];
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
        if(this.page<=1){
          //firs refresh
          this._handleRefresh();
        }
      });
    }
  }

  _getEventsData(){
    console.log("requested page n: "+this.page);
    this.mAdapter.getEventsData(this.page,this.state.internet).then(res=>{
      if(res!=="no-page"){
        var eventsData = res.eventsData;
        for(i=0;i<eventsData.results.length;i++){
          this.itemLocal.push(res.local);
        }
        console.log("itemLocal",this.itemLocal);
        console.log("setState 1");
        this.setState({
          data: this.page === 1 ? eventsData.results : [...this.state.data, ...eventsData.results],
          refreshing: false,
          firstLoad: false
        });
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
        this.itemLocal = [];
        this._getEventsData();
      }
    );
  }

  _handleLoadMore(){
    console.log("handle load more?");
    if(!this.noMorePages && this.state.internet){
      this.page +=1;
      this._getEventsData();

      /*console.log("setState 5");
      this.setState(
        {
          page: this.state.page + 1,
        },
        () => {
          this._getEventsData();
        }
      );*/
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
                local={this.itemLocal[index]}
                item={item}
                mAdapter={this.mAdapter}
                onPressItem={this.onPressItem.bind(this,item.id)}
              />
            )}
            keyExtractor={item => item.id}
            ListFooterComponent={this._renderFooter.bind(this)}
            onRefresh={this._handleRefresh.bind(this)}
            refreshing={this.state.refreshing}
            onEndReached={this._handleLoadMore.bind(this)}
            onEndReachedThreshold={0.5}
          />
        }
      </View>
    );
  }
}
