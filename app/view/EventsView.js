import React, { Component } from 'react';
import { List } from "react-native-elements";
import {
  TouchableOpacity,
  Text,
  View,
  ScrollView,
  FlatList,
  ActivityIndicator
} from 'react-native';

import ModelAdapter from "./adapters/EventsModelAdapter";
import EventItem from "./components/EventItem";
import Styles from '../constants/Styles';

export default class EventsView extends Component<{}> {
  constructor(props){
    super(props);

    this.mAdapter = new ModelAdapter();

    this.state = {
      loading: false,
      data: [],
      page: 1,
      error: null,
      refreshing: false,
    };

    this.itemOffline = [];
    this.noMorePages = false;
  }

  componentDidMount(){
    this.getEventsData();
  }

  getEventsData(){
    console.log("requested page n: "+this.state.page);
    this.mAdapter.getEventsData(this.state.page).then(res=>{
      if(res!=="no-page"){
        var eventsData = res.eventsData;
        for(i=0;i<eventsData.results.length;i++){
          this.itemOffline.push(res.offline);
        }
        this.setState({
          data: this.state.page === 1 ? eventsData.results : [...this.state.data, ...eventsData.results],
          error: res.error || null,
          loading: false,
          refreshing: false,
        });
      }
      else{
        this.noMorePages = true;
        this.setState({ error: "no-page", loading: false, refreshing: false });
      }
    })
    .catch(error => {
      console.log("getEventsData Error: ",error);
      this.setState({ error: error, loading: false, refreshing: false });
    });
  }

  handleRefresh(){
    this.noMorePages = false;
    this.setState(
      {
        page: 1,
        refreshing: true
      },
      () => {
        this.getEventsData();
      }
    );
  }

  handleLoadMore(){
    if(!this.state.loading && !this.noMorePages){
      console.log("loading more and more");
      this.setState(
        {
          page: this.state.page + 1,
          loading: true
        },
        () => {
          this.getEventsData();
        }
      );
    }
  }

  renderFooter(){
    if (!this.state.loading || this.state.refreshing) return null;

    return (
      <View style={{paddingVertical: 20,}}>
        <ActivityIndicator animating size="large" />
      </View>
    );
  }

  onPressItem(itemId){
    this.props.onPressItem(itemId);
  }

  render() {
    return (
      <View style={Styles.eventsListConainer}>
        <FlatList
          data={this.state.data}
          renderItem={({ item, index }) => (
            <EventItem
              offline={this.itemOffline[index]}
              item={item}
              mAdapter={this.mAdapter}
              onPressItem={this.onPressItem.bind(this,item.id)}
            />
          )}
          keyExtractor={item => item.id}
          ListFooterComponent={this.renderFooter.bind(this)}
          onRefresh={this.handleRefresh.bind(this)}
          refreshing={this.state.refreshing}
          onEndReached={this.handleLoadMore.bind(this)}
          onEndReachedThreshold={1}
        />
      </View>
    );
  }
}
