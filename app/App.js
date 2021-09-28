import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';

import useCachedResources from './hooks/useCachedResources';
import DrawerNavigator from './navigation/DrawerNavigator';
import LoginScreen from './screens/welcome/LoginScreen';
import RegisterScreen from './screens/welcome/RegisterScreen';
import WelcomeScreen from './screens/welcome/WelcomeScreen';
import PolicyScreen from './screens/welcome/PolicyScreen';
import LinkingConfiguration from './navigation/LinkingConfiguration';
import { isSignedIn, LoginContext } from './auth';
import PreferencesContext from './contexts/PreferencesContext';
import ExpoMixpanelAnalytics from '@benawad/expo-mixpanel-analytics';
import axios from 'axios';
import { authHeader } from './auth';
import apiBase from './constants/Api';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
import * as Linking from 'expo-linking';
import { LogBox } from 'react-native';

LogBox.ignoreLogs([
  'Warning: Cannot update a component from inside the function body of a different component.'
]);
const Stack = createStackNavigator();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function App(props) {
  const analytics = new ExpoMixpanelAnalytics("532931d70cf7b0d6c3825b4742c47158");
  analytics.track('launch');
  // analytics.identify(1);
  window.analytics = analytics;
  const [signedin, setSignedin] = React.useState(0);
  const [signinChecked, setSigninChecked] = React.useState(0);
  const [initialRouteLogin, setInitialRouteLogin] = React.useState(0);
  const [user, setUser] = React.useState(0);
  const [expoPushToken, setExpoPushToken] = React.useState('');
  const [notification, setNotification] = React.useState(false);
  const notificationListener = React.useRef();
  const responseListener = React.useRef();
  const [friendCode, setFriendCode] = React.useState(null);

  const [deck, setDeck] = React.useState(null);
  const [places, setPlaces] = React.useState(null);

  var first = true;
  function handleLink(event) {
    let { path, queryParams } = Linking.parse(event.url);
    if (path != "") {
      return;
    }
    if (signinChecked && signedin) {
      first = false;
      if (queryParams.addFriend && queryParams.joinGroup) {
        Linking.openURL(Linking.makeUrl('/Group', queryParams));
      }
      if (queryParams.addFriend) {
        Linking.openURL(Linking.makeUrl('/friends', queryParams));
      }
      if (queryParams.joinGroup) {
        Linking.openURL(Linking.makeUrl('/Group', queryParams));
      }
    } else if (signinChecked && !signedin) {
      first = false;
      if (queryParams.addFriend || queryParams.joinGroup) {
        Linking.openURL(Linking.makeUrl('/Register', queryParams));
      }
    }
  }

  // var [filters, setFilters] = React.useState({food: true, drink: true, fun: true, deals: true});
  const isLoadingComplete = useCachedResources();
  isSignedIn().then(async (res) => {

    setSignedin(res);

    if (signedin && !signinChecked) {
      try {
        console.log('SIGNED IN');
        registerForPushNotificationsAsync().then(token => setExpoPushToken(token));
      } catch (err) {
        console.log('errorr');
        console.log(err);
      }
    }
    setSigninChecked(true);


  });

  React.useEffect(() => {
    if (first) {
      Linking.getInitialURL().then((url) => handleLink({ url }));
      Linking.addEventListener('url', handleLink);
    }
  }, [signinChecked]);

  React.useEffect(() => {

    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);


  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <LoginContext.Provider value={{ user: user, setSigninState: setSignedin, setUser: setUser }}>
        <PreferencesContext.Provider value={{ deck, setDeck, places, setPlaces }}>
          <View style={styles.container}>
            {Platform.OS === 'ios' && <StatusBar barStyle="dark-content" />}
            <NavigationContainer linking={LinkingConfiguration}>
              {signinChecked && signedin &&
                <Stack.Navigator>
                  <Stack.Screen name="Root" component={DrawerNavigator} />
                </Stack.Navigator>
              }
              {signinChecked && !signedin
                &&
                <Stack.Navigator initialRouteName={initialRouteLogin}>
                  <Stack.Screen name="Squeet" component={WelcomeScreen} />
                  <Stack.Screen
                    name="Login"
                    component={LoginScreen}
                    options={{
                      headerStyle: {
                        elevation: 0,
                        shadowOpacity: 0
                      },
                      headerTitleStyle: {
                        color: 'white',
                      },
                    }} />
                  <Stack.Screen
                    name="Register"
                    component={RegisterScreen}
                    options={{
                      headerStyle: {
                        elevation: 0,
                        shadowOpacity: 0,
                      },
                      headerTitleStyle: {
                        color: 'white',
                      },
                      
                    }}
                  />
                  <Stack.Screen name="Web" component={PolicyScreen} />
                </Stack.Navigator>
              }

            </NavigationContainer>
          </View>
        </PreferencesContext.Provider>
      </LoginContext.Provider>
    );
  }

  async function registerForPushNotificationsAsync() {
    console.log("REGISTERING!");
    let token;
    if (Constants.isDevice) {
      const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      // update with axios
      var payload = {};
      console.log(Constants.platform);
      if (Constants.platform.ios != null) {
        payload = { ios: token };
      } else if (Constants.platform.android != null) {
        payload = { android: token };
      }
      try {
        // console.log(apiBase.apiBase);
        await axios.post(apiBase.apiBase + "user/registerPush", payload, { headers: await authHeader() });
      } catch (err) {
        console.log(err);
      }
    } else {
      // alert('Must use physical device for Push Notifications');
    }

    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    return token;
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

