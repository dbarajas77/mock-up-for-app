import { AppRegistry } from 'react-native';
import App from '../App';
import { name as appName } from '../app.json';

// Register the app
AppRegistry.registerComponent(appName, () => App);

// Web-specific setup
if (window.document) {
  AppRegistry.runApplication(appName, {
    rootTag: document.getElementById('root')
  });
}
