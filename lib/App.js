Object.defineProperty(exports,"__esModule",{value:true});var _jsxFileName='app/App.js';var _react=require('react');var _react2=_interopRequireDefault(_react);var _reactNative=require('react-native');var _reactNavigation=require('react-navigation');var _Ionicons=require('react-native-vector-icons/Ionicons');var _Ionicons2=_interopRequireDefault(_Ionicons);var _HeaderBar=require('./view/components/HeaderBar');var _HeaderBar2=_interopRequireDefault(_HeaderBar);var _Styles=require('./constants/Styles');var _Styles2=_interopRequireDefault(_Styles);var _Colors=require('./constants/Colors');var _Colors2=_interopRequireDefault(_Colors);var _selector=require('./languages/selector');var _selector2=_interopRequireDefault(_selector);var _EventsController=require('./controller/EventsController');var _EventsController2=_interopRequireDefault(_EventsController);var _EventDetailsController=require('./controller/EventDetailsController');var _EventDetailsController2=_interopRequireDefault(_EventDetailsController);var _GroupsController=require('./controller/GroupsController');var _GroupsController2=_interopRequireDefault(_GroupsController);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}var lang=new _selector2.default("ca");var EventsStack=(0,_reactNavigation.StackNavigator)({EventsTab:{screen:_EventsController2.default,navigationOptions:{title:lang.events.tabTitle,headerTitle:_react2.default.createElement(_HeaderBar2.default,{__source:{fileName:_jsxFileName,lineNumber:21}}),headerStyle:_Styles2.default.headerBarContainer,tabBarIcon:function tabBarIcon(_ref){var focused=_ref.focused,tintColor=_ref.tintColor;var iconName=void 0;iconName='ios-calendar'+(focused?'':'-outline');return _react2.default.createElement(_Ionicons2.default,{name:iconName,size:25,color:tintColor,__source:{fileName:_jsxFileName,lineNumber:26}});},tabBarOnPress:function tabBarOnPress(values){var previousScene=values.previousScene,scene=values.scene,jumpToIndex=values.jumpToIndex;if(scene.focused){scene.route.routes[0].params.scrollToTop();}jumpToIndex(scene.route.index);}}},EventDetails:{screen:_EventDetailsController2.default,navigationOptions:function navigationOptions(_ref2){var navigation=_ref2.navigation;return{tabBarVisible:false};}}});var GroupsStack=(0,_reactNavigation.StackNavigator)({GroupsTab:{screen:_GroupsController2.default,navigationOptions:{title:lang.groups.tabTitle,headerTitle:_react2.default.createElement(_HeaderBar2.default,{__source:{fileName:_jsxFileName,lineNumber:54}}),headerStyle:_Styles2.default.headerBarContainer,headerStyle:_Styles2.default.headerBarContainer,tabBarIcon:function tabBarIcon(_ref3){var focused=_ref3.focused,tintColor=_ref3.tintColor;var iconName=void 0;iconName='ios-people'+(focused?'':'-outline');return _react2.default.createElement(_Ionicons2.default,{name:iconName,size:25,color:tintColor,__source:{fileName:_jsxFileName,lineNumber:60}});}}}});exports.default=(0,_reactNavigation.TabNavigator)({Events:{screen:EventsStack},Groups:{screen:GroupsStack}},{tabBarOptions:{activeTintColor:_Colors2.default.brandBlue,inactiveTintColor:_Colors2.default.tabBarInactive},tabBarComponent:_reactNavigation.TabBarBottom,tabBarPosition:'bottom',animationEnabled:false,swipeEnabled:false});