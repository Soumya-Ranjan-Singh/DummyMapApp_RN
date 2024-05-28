import messaging from '@react-native-firebase/messaging';

// Initialize Firebase Messaging
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Background Message:', remoteMessage);
});

export default messaging;
