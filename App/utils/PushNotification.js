import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import { PermissionsAndroid, Platform } from 'react-native';



export async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    getFcmToken();
  }

 if( Platform.OS == 'android'){
  PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
 }
}


const getFcmToken=async()=>{
    let fcmToken=await AsyncStorage.getItem('fcmToken');
    if(!fcmToken){
        try{
           const fcmToken=await messaging().getToken();
           if(fcmToken){
            await AsyncStorage.setItem('fcmToken',fcmToken);
           }
        }catch(error){
        }
    }
}

export const NotificationServices=()=>{
  //Assume a message-notification contains a "type" property in the data payload of the screen to open

  messaging().onNotificationOpenedApp(remoteMessage => {
    navigation.navigate(remoteMessage.data.type);
  });

  //Foreground
  messaging().onMessage(async remoteMessage => {
  });
   // Check whether an initial notification is available
   messaging()
   .getInitialNotification()
   .then(remoteMessage => {
     if (remoteMessage) {
       setInitialRoute(remoteMessage.data.type); // e.g. "Settings"
     }
   });

}

// Handle foreground notifications
const handleNotification = async (remoteMessage) => {
  console.error('handling notification:', remoteMessage);
  try {
    const notification = remoteMessage.notification || {};
    const data = remoteMessage.data || {};

    const title = notification.title || data.title || 'Notification';
    const body = notification.body || data.body || 'You have a new message!';
    const message = data.message;

    PushNotification.createChannel(
      {
        channelId: "raagachannel", // You can use a different channel ID
        channelName: "com-raaga",
        channelDescription: "A default channel for notifications",
        soundName: "default",
        importance: 4, // Ensure the importance is high
        vibrate: true,
      },
      (created) => console.log(`createChannel returned '${created}'`)
    );

    // Use the channelId in your notification
    PushNotification.localNotification({
      channelId: "raagachannel",
      title: title || 'Notification',
      message: body || message || 'You have a new message!',
      soundName: 'default',
      playSound: true,
      priority: 'high',
      importance: 'high',
    });

  } catch (error) {
    console.error('Error handling notification:', error);
  }
};

// Configure Firebase Cloud Messaging (FCM)
const configure = async () => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {

    // const token = await messaging().getToken();
    // store.dispatch(pnActions.getDeviceToken(token));
    messaging().onMessage(handleNotification);

    // Handle background notifications
    messaging().setBackgroundMessageHandler(handleNotification);
  } else {
    console.warn('Notification permissions not granted');
  }
};

export {
  configure,
  // You may need to implement localNotification if required
};

