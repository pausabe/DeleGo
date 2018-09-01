import { AppRegistry, YellowBox } from 'react-native';
import App from './src/App.js';
YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);
YellowBox.ignoreWarnings(['Remote debugger']);

AppRegistry.registerComponent('CBCN', () => App);
