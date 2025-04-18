import { AppRegistry } from 'react-native';
import App from '../App';
import { name as appName } from '../app.json';

// Import the touchable polyfill to fix the hasTouchableProperty error
import './utils/touchablePolyfill';

// Register the app
AppRegistry.registerComponent(appName, () => App);

// Web-specific setup
if (window.document) {
  AppRegistry.runApplication(appName, {
    rootTag: document.getElementById('root')
  });
}
