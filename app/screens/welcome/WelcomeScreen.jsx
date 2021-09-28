import * as React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import ButtonWithIcon from '../../components/ButtonWithIcon';

export default class WelcomeScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      markers: [],
      places: [],
      email: "",
      password: ""
    };
    this.props.navigation.setOptions({ headerShown: false });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          {/* <Image style={styles.logo} source={require('../../assets/images/logo.png')} /> */}
          <Image style={styles.image} source={require('../../assets/images/login-signup/mainIcon.png')} />
        </View>
        <Text style={styles.welcomeMessage}>Welcome to Squeet!</Text>
        <View style={styles.buttonsContainer}>
          <ButtonWithIcon text="SIGN UP" action={this.register}></ButtonWithIcon>
          {/* <TouchableOpacity style={[styles.button, styles.appleButton]} title="Sign in with Apple" onPress={this.register}>
            <Text style={styles.appleButtonText}>🍏 Sign in with Apple</Text>
          </TouchableOpacity> */}
        </View>
        <View style={styles.loginContainer}>
          <TouchableOpacity style={styles.logInButton} title="LOG IN" onPress={this.login}>
            <Text style={styles.logInButtonText}>LOG IN</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  register = () => {
    this.props.navigation.navigate("Register");
  }
  login = () => {
    this.props.navigation.navigate("Login");
  }
}

WelcomeScreen.navigationOptions = () => {
  return {
    headerVisible: false
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center'
  },
  imageContainer: {
    alignItems: 'center'
  },
  image: {
    resizeMode: 'contain',
    height: 280,
  },
  welcomeMessage: {
    color: '#A6A6A6',
    fontSize: 32,
    marginTop: 50,
    alignSelf: 'center',
    fontWeight: 'bold'
  },
  buttonsContainer: {
    alignItems: 'center',
    marginTop: 20,
  },

  loginContainer: {
    width: '100%',
    position: 'absolute',
    alignItems: 'center',
    bottom: 30
  },
  logInButtonText: {
    color: '#BBB',
    fontSize: 15,
    textDecorationLine: 'underline',
  },
  button: {
    width: 300
  }

});
