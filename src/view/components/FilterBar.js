import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity
 } from 'react-native';

import Styles from '../../utils/Styles';

const MARGIN_RIGHT = 10;
const ITEM_OPACITY_SELECTION = 0.85;

export default class FilterBar extends Component {
  /************************
   * 1/4 - DELE
   * 2/4 - 14-17
   * 3/4 - 18-25
   * 4/4 - 26-35
   ************************/

  constructor(props){
    super(props);

    this.state = {
      first_selected: false,
      second_selected: false,
      third_selected: false,
      fourth_selected: false,
    }
  }

  render() {
    try {
      return(
        <View style={Styles.filterBar_container}>
          {this.state.first_selected?
            <TouchableOpacity style={[Styles.filter_name_container_selected, {marginRight: MARGIN_RIGHT}]} activeOpacity={ITEM_OPACITY_SELECTION} onPress={this.First_Pressed.bind(this)}>
              <Text style={Styles.text_filter_name_selected}>{'DELE'}</Text>
            </TouchableOpacity>
            :
            <TouchableOpacity style={[Styles.filter_name_container_normal, {marginRight: MARGIN_RIGHT}]} activeOpacity={ITEM_OPACITY_SELECTION} onPress={this.First_Pressed.bind(this)}>
              <Text style={Styles.text_filter_name_normal}>{'DELE'}</Text>
            </TouchableOpacity>
          }
          {this.state.second_selected?
            <TouchableOpacity style={[Styles.filter_name_container_selected, {marginRight: MARGIN_RIGHT}]} activeOpacity={ITEM_OPACITY_SELECTION} onPress={this.Second_Pressed.bind(this)}>
              <Text style={Styles.text_filter_name_selected}>{'14-17'}</Text>
            </TouchableOpacity>
            :
            <TouchableOpacity style={[Styles.filter_name_container_normal, {marginRight: MARGIN_RIGHT}]} activeOpacity={ITEM_OPACITY_SELECTION} onPress={this.Second_Pressed.bind(this)}>
              <Text style={Styles.text_filter_name_normal}>{'14-17'}</Text>
            </TouchableOpacity>
          }
          {this.state.third_selected?
            <TouchableOpacity style={[Styles.filter_name_container_selected, {marginRight: MARGIN_RIGHT}]} activeOpacity={ITEM_OPACITY_SELECTION} onPress={this.Third_Pressed.bind(this)}>
              <Text style={Styles.text_filter_name_selected}>{'18-25'}</Text>
            </TouchableOpacity>
            :
            <TouchableOpacity style={[Styles.filter_name_container_normal, {marginRight: MARGIN_RIGHT}]} activeOpacity={ITEM_OPACITY_SELECTION} onPress={this.Third_Pressed.bind(this)}>
              <Text style={Styles.text_filter_name_normal}>{'18-25'}</Text>
            </TouchableOpacity>
          }
          {this.state.fourth_selected?
            <TouchableOpacity style={[Styles.filter_name_container_selected, {marginRight: 0}]} activeOpacity={ITEM_OPACITY_SELECTION} onPress={this.Fourth_Pressed.bind(this)}>
              <Text style={Styles.text_filter_name_selected}>{'26-35'}</Text>
            </TouchableOpacity>
            :
            <TouchableOpacity style={[Styles.filter_name_container_normal, {marginRight: 0}]} activeOpacity={ITEM_OPACITY_SELECTION} onPress={this.Fourth_Pressed.bind(this)}>
              <Text style={Styles.text_filter_name_normal}>{'26-35'}</Text>
            </TouchableOpacity>
          }
        </View>
      );
    }
    catch (e) {
      console.log("error",e)
    }
  }

  First_Pressed(){
    try {
      this.setState({first_selected: !this.state.first_selected});
      this.props.Refresh_List(this.state.first_selected, this.state.second_selected, this.state.third_selected, this.state.fourth_selected);
    }
    catch (e) {
      console.log("error",e)
    }
  }

  Second_Pressed(){
    try {
      this.setState({second_selected: !this.state.second_selected});
      this.props.Refresh_List(this.state.first_selected, this.state.second_selected, this.state.third_selected, this.state.fourth_selected);
    }
    catch (e) {
      console.log("error",e)
    }
  }

  Third_Pressed(){
    try {
      this.setState({third_selected: !this.state.third_selected});
      this.props.Refresh_List(this.state.first_selected, this.state.second_selected, this.state.third_selected, this.state.fourth_selected);
    }
    catch (e) {
      console.log("error",e)
    }
  }

  Fourth_Pressed(){
    try {
      this.setState({fourth_selected: !this.state.fourth_selected});
      this.props.Refresh_List(this.state.first_selected, this.state.second_selected, this.state.third_selected, this.state.fourth_selected);
    }
    catch (e) {
      console.log("error",e)
    }
  }
}
