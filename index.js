/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';
import firebase from '@react-native-firebase/app';
import {Constants} from './App/common'

if(firebase.apps.length === 0){
    firebase.initializeApp(Constants.firebaseConfig)
}

messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message in backgroung', remoteMessage)
})

AppRegistry.registerComponent(appName, () => App);
