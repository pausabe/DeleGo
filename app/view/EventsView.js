import React, { Component } from 'react';
import { List, ListItem } from "react-native-elements";
import {
  TouchableOpacity,
  Text,
  View,
  ScrollView,
  FlatList,
  ActivityIndicator
} from 'react-native';

import ModelAdapter from "./adapters/EventsModelAdapter";
import Styles from '../constants/Styles';

export default class EventsView extends Component<{}> {
  constructor(props){
    super(props);

    this.mAdapter = new ModelAdapter();

    this.state = {
      loading: false,
      data: [],
      page: 1,
      seed: 1,
      error: null,
      refreshing: false
    };
  }

  componentDidMount(){
    this.makeRemoteRequest();
  }

  makeRemoteRequest(){
    const { page, seed } = this.state;
    const url = `https://randomuser.me/api/?seed=${seed}&page=${page}&results=20`;
    this.setState({ loading: true });

    fetch(url)
     .then(res => res.json())
     .then(res => {
       this.setState({
         data: page === 1 ? res.results : [...this.state.data, ...res.results],
         error: res.error || null,
         loading: false,
         refreshing: false
       });
     })
     .catch(error => {
       this.setState({ error, loading: false });
     });
  }

  handleRefresh(){
    this.setState(
      {
        page: 1,
        seed: this.state.seed + 1,
        refreshing: true
      },
      () => {
        this.makeRemoteRequest();
      }
    );
  }

  handleLoadMore(){
    this.setState(
      {
        page: this.state.page + 1
      },
      () => {
        this.makeRemoteRequest();
      }
    );
  };

  renderSeparator(){
    return (
      <View
        style={{
          height: 1,
          width: "86%",
          backgroundColor: "#CED0CE",
          marginLeft: "14%"
        }}
      />
    );
  }

  renderFooter(){
    if (!this.state.loading) return null;

    return (
      <View
        style={{
          paddingVertical: 20,
          borderTopWidth: 1,
          borderColor: "#CED0CE"
        }}
      >
        <ActivityIndicator animating size="large" />
      </View>
    );
  }

  render() {
    /*return (
      <List containerStyle={{ borderTopWidth: 0, borderBottomWidth: 0 }}>
        <FlatList
          data={this.state.data}
          renderItem={({ item }) => (
            <ListItem
              roundAvatar
              title={`${item.name.first} ${item.name.last}`}
              subtitle={item.email}
              avatar={{ uri: item.picture.thumbnail }}
              containerStyle={{ borderBottomWidth: 0 }}
            />
          )}
          keyExtractor={item => item.email}
          ItemSeparatorComponent={this.renderSeparator.bind(this)}
          ListFooterComponent={this.renderFooter.bind(this)}
          onRefresh={this.handleRefresh.bind(this)}
          refreshing={this.state.refreshing}
          onEndReached={this.handleLoadMore.bind(this)}
          onEndReachedThreshold={50}
        />
      </List>
    );*/
    return (
      <View style={Styles.tabContainer}>
          <ScrollView>
            <Text style={Styles.normalText}>
              {this.mAdapter.getTextToShow()}
            </Text>
            <TouchableOpacity onPress={this.props.buttonPressedCB}>
              <Text style={Styles.normalText}>{this.mAdapter.getButtonText()}</Text>
            </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }
}
