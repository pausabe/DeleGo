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
      refreshing: false
    };
  }

  componentDidMount(){
    this.makeRemoteRequest();
  }

  makeRemoteRequest(){
    console.log("request page n: "+this.state.page);
    this.mAdapter.getEventsData(this.state.page)
      .then(res => {
        this.setState({
          data: this.state.page === 1 ? res.results : [...this.state.data, ...res.results],
          error: res.error || null,
          loading: false,
          refreshing: false
        });
      })
      .catch(error => {
        console.log("getEventsData Error: ",error);
        this.setState({ error, loading: false, refreshing: false });
      });
  }

  handleRefresh(){
    this.setState(
      {
        page: 1,
        refreshing: true
      },
      () => {
        this.makeRemoteRequest();
      }
    );
  }

  handleLoadMore(){
    console.log("loading more and more");
    this.setState(
      {
        page: this.state.page + 1,
        loading: true
      },
      () => {
        this.makeRemoteRequest();
      }
    );
  };

  renderFooter(){
    if (!this.state.loading || this.state.refreshing) return null;

    return (
      <View style={{paddingVertical: 20,}}>
        <ActivityIndicator animating size="large" />
      </View>
    );
  }

  render() {
    return (
      <FlatList
        data={this.state.data}
        renderItem={({ item }) => (
          <EventItem
            item={item}
          />
        )}
        keyExtractor={item => item.id}
        ListFooterComponent={this.renderFooter.bind(this)}
        onRefresh={this.handleRefresh.bind(this)}
        refreshing={this.state.refreshing}
        onEndReached={this.handleLoadMore.bind(this)}
        onEndReachedThreshold={0}
      />
    );
  }
}
