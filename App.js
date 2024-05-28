// /**
//  * Sample React Native App
//  * https://github.com/facebook/react-native
//  *
//  * @format
//  */

// import React from 'react';
// import type {PropsWithChildren} from 'react';
// import {
//   SafeAreaView,
//   ScrollView,
//   StatusBar,
//   StyleSheet,
//   Text,
//   useColorScheme,
//   View,
// } from 'react-native';

// import {
//   Colors,
//   DebugInstructions,
//   Header,
//   LearnMoreLinks,
//   ReloadInstructions,
// } from 'react-native/Libraries/NewAppScreen';

// type SectionProps = PropsWithChildren<{
//   title: string;
// }>;

// function Section({children, title}: SectionProps): JSX.Element {
//   const isDarkMode = useColorScheme() === 'dark';
//   return (
//     <View style={styles.sectionContainer}>
//       <Text
//         style={[
//           styles.sectionTitle,
//           {
//             color: isDarkMode ? Colors.white : Colors.black,
//           },
//         ]}>
//         {title}
//       </Text>
//       <Text
//         style={[
//           styles.sectionDescription,
//           {
//             color: isDarkMode ? Colors.light : Colors.dark,
//           },
//         ]}>
//         {children}
//       </Text>
//     </View>
//   );
// }

// function App(): JSX.Element {
//   const isDarkMode = useColorScheme() === 'dark';

//   const backgroundStyle = {
//     backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
//   };

//   return (
//     <SafeAreaView style={backgroundStyle}>
//       <StatusBar
//         barStyle={isDarkMode ? 'light-content' : 'dark-content'}
//         backgroundColor={backgroundStyle.backgroundColor}
//       />
//       <ScrollView
//         contentInsetAdjustmentBehavior="automatic"
//         style={backgroundStyle}>
//         <Header />
//         <View
//           style={{
//             backgroundColor: isDarkMode ? Colors.black : Colors.white,
//           }}>
//           <Section title="Step One">
//             Edit <Text style={styles.highlight}>App.tsx</Text> to change this
//             screen and then come back to see your edits.
//           </Section>
//           <Section title="See Your Changes">
//             <ReloadInstructions />
//           </Section>
//           <Section title="Debug">
//             <DebugInstructions />
//           </Section>
//           <Section title="Learn More">
//             Read the docs to discover what to do next:
//           </Section>
//           <LearnMoreLinks />
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   sectionContainer: {
//     marginTop: 32,
//     paddingHorizontal: 24,
//   },
//   sectionTitle: {
//     fontSize: 24,
//     fontWeight: '600',
//   },
//   sectionDescription: {
//     marginTop: 8,
//     fontSize: 18,
//     fontWeight: '400',
//   },
//   highlight: {
//     fontWeight: '700',
//   },
// });

// export default App;

// import React, {useEffect, useState} from 'react';
// import {View, StyleSheet, Button, ActivityIndicator} from 'react-native';
// import MapView, {Marker, Polyline, PROVIDER_GOOGLE} from 'react-native-maps';
// import Geolocation from '@react-native-community/geolocation';
// import PushNotification from 'react-native-push-notification';
// import messaging from './Firebase';

// const App = () => {
//   const [currentPosition, setCurrentPosition] = useState(null);
//   const [locationTraces, setLocationTraces] = useState([]);
//   const [isTracking, setIsTracking] = useState(false);

//   const config = {
//     skipPermissionRequests: false,
//     authorizationLevel: 'always',
//     locationProvider: 'auto',
//   };

//   Geolocation.setRNConfiguration(config);

//   const requestUserPermission = async () => {
//     const authStatus = await messaging().requestPermission();
//     const enabled =
//       authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
//       authStatus === messaging.AuthorizationStatus.PROVISIONAL;

//     if (enabled) {
//       console.log('Authorization status:', authStatus);
//     }
//   };

//   const handlePushNotification = () => {
//     messaging().onMessage(async remoteMessage => {
//       console.log('Foreground Message:', remoteMessage);
//     });

//     // Handle notification taps for Android
//     messaging().onNotificationOpenedApp(remoteMessage => {
//       console.log('Notification Tapped:', remoteMessage);
//     });

//     // Check for initial notification taps for iOS
//     if (Platform.OS === 'ios') {
//       messaging()
//         .getInitialNotification()
//         .then(remoteMessage => {
//           if (remoteMessage) {
//             console.log('Initial Notification Tapped:', remoteMessage);
//           }
//         });
//     }
//   }

//   useEffect(() => {
//     Geolocation.requestAuthorization();
//     getCurrentPosition();
//     createChannels();
//     // requestUserPermission();
//     // handlePushNotification();
//   }, []);

//   const createChannels = () => {
//     PushNotification.createChannel(
//       {
//         channelId: 'reminders',
//         channelName: 'Task Reminder Notification',
//         channelDescription: 'Reminder for any task',
//       },
//       () => {},
//     );
//   };

//   const getCurrentPosition = () => {
//     Geolocation.getCurrentPosition(
//       position => {
//         const {latitude, longitude} = position.coords;
//         setCurrentPosition({latitude, longitude});
//       },
//       error => {
//         console.log('Error getting current position:', error);
//       },
//     );
//   };

//   const startTracking = () => {
//     setIsTracking(true);
//     setLocationTraces([]);
//     Geolocation.watchPosition(
//       position => {
//         const {latitude, longitude} = position.coords;
//         const newTrace = {latitude, longitude};
//         setLocationTraces(prevTraces => [...prevTraces, newTrace]);
//       },
//       error => {
//         console.log('Location tracking error:', error);
//       },
//       {enableHighAccuracy: true, distanceFilter: 10},
//     );
//   };

//   const stopTracking = () => {
//     setIsTracking(false);
//     Geolocation.clearWatch();
//   };

//   return (
//     <View style={styles.container}>
//       {currentPosition ? (
//         <>
//           <MapView
//             provider={PROVIDER_GOOGLE}
//             style={styles.map}
//             initialRegion={{
//               latitude: currentPosition?.latitude,
//               longitude: currentPosition?.longitude,
//               latitudeDelta: 0.0922,
//               longitudeDelta: 0.0421,
//             }}>
//             {currentPosition && (
//               <Marker
//                 coordinate={{
//                   latitude: currentPosition.latitude,
//                   longitude: currentPosition.longitude,
//                 }}
//                 title="You are here"
//               />
//             )}
//             <Polyline
//               coordinates={locationTraces}
//               strokeColor="#000"
//               strokeWidth={3}
//             />
//           </MapView>
//           <Button
//             title={isTracking ? 'Stop Tracking' : 'Start Tracking'}
//             onPress={isTracking ? stopTracking : startTracking}
//           />
//         </>
//       ) : (
//         <ActivityIndicator color={'blue'} size={'large'} />
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   map: {
//     flex: 1,
//   },
// });

// export default App;

// App.js
import React, {useState, useRef, useMemo} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import BottomSheet from '@gorhom/bottom-sheet';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

navigator.geolocation = require('@react-native-community/geolocation');
const App = () => {
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [markers, setMarkers] = useState([]);
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ['25%', '50%'], []);

  const handleLongPress = event => {
    const coordinate = event.nativeEvent.coordinate;
    const newMarker = {
      id: markers.length + 1,
      title: `Location ${markers.length + 1}`,
      description: `Description for Location ${markers.length + 1}`,
      coordinate,
    };
    setMarkers([...markers, newMarker]);
    setSelectedMarker(newMarker);
    bottomSheetRef.current?.expand();
  };

  const handleMarkerPress = marker => {
    setSelectedMarker(marker);
    bottomSheetRef.current?.expand();
  };

  const handlePlaceSelect = (data, details) => {
    if (details) {
      const coordinate = {
        latitude: details.geometry.location.lat,
        longitude: details.geometry.location.lng,
      };
      const newMarker = {
        id: markers.length + 1,
        title: data.description,
        description: details.formatted_address,
        coordinate,
      };
      setMarkers([...markers, newMarker]);
      setSelectedMarker(newMarker);
      bottomSheetRef.current?.expand();
    }
  };

  return (
    <GestureHandlerRootView>
      <View style={styles.container}>
        <GooglePlacesAutocomplete
          placeholder="Search"
          onPress={(data, details = null) => handlePlaceSelect(data, details)}
          fetchDetails={true}
          query={{
            key: 'YOUR_GOOGLE_MAPS_API_KEY',
            language: 'en',
          }}
          currentLocation={true}
          currentLocationLabel="Current location"
          styles={{
            container: {
              flex: 0,
              position: 'absolute',
              width: '100%',
              zIndex: 1,
            },
          }}
        />
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          onLongPress={handleLongPress}>
          {markers.map(marker => (
            <Marker
              key={marker.id}
              coordinate={marker.coordinate}
              title={marker.title}
              description={marker.description}
              onPress={() => handleMarkerPress(marker)}
            />
          ))}
        </MapView>
        <BottomSheet ref={bottomSheetRef} index={-1} snapPoints={snapPoints}>
          <View style={styles.contentContainer}>
            {selectedMarker ? (
              <>
                <Text style={styles.title}>{selectedMarker.title}</Text>
                <Text style={styles.description}>
                  {selectedMarker.description}
                </Text>
              </>
            ) : (
              <Text>Tap on a marker to see details</Text>
            )}
          </View>
        </BottomSheet>
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 16,
    marginTop: 8,
  },
});

export default App;
