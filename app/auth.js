import { AsyncStorage } from "react-native";
import * as React from 'react';

export const USER_KEY = "token";

export const onSignIn = (token) => AsyncStorage.setItem(USER_KEY, token);

export const onSignOut = () => AsyncStorage.removeItem(USER_KEY);

export const isSignedIn = () => {
  return new Promise((resolve, reject) => {
    AsyncStorage.getItem(USER_KEY)
      .then(res => {
        if (res !== null) {
          resolve(true);
        } else {
          resolve(false);
        }
      })
      .catch(err => reject(err));
  });
};

export const authHeader = async () => {
  try {
    const key = await AsyncStorage.getItem(USER_KEY);
    return {
      Token: key
    };
  } catch (err) {
    console.log(err);
  }
};

export const LoginContext = React.createContext('login');
