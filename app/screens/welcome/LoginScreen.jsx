import axios from 'axios';
import * as React from 'react';
import { Alert, AsyncStorage, Dimensions, Image, StyleSheet, Text, TextInput, View, TouchableOpacity } from 'react-native';
import { LoginContext } from '../../auth';
import ButtonWithIcon from '../../components/ButtonWithIcon';
import apiBase from '../../constants/Api';

export default class LoginScreen extends React.Component {

  static contextType = LoginContext;

  constructor(props) {
    super(props);
    this.state = {
      markers: [],
      places: [],
      email: "",
      password: ""
    };
    this.props.navigation.setOptions({ headerShown: true });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <Image
            style={styles.image}
            source={require('../../assets/images/login-signup/signUp.png')}>
          </Image>
        </View>
        <View style={styles.formContainer}>
          <TextInput
            keyboardType="email-address"
            textContentType="emailAddress"
            autoCapitalize='none'
            selectionColor="#FF9405"
            autoCompleteType="email"
            importantForAutofill="yes"
            placeholder="ENTER YOUR EMAIL"
            placeholderTextColor="#A6A6A6"
            style={styles.input}
            onChangeText={text => this.onChangeEmail(text)}
            value={this.state.email}
          />
          <TextInput
            textContentType="password"
            secureTextEntry
            selectionColor="#FF9405"
            placeholder="ENTER YOUR PASSWORD"
            placeholderTextColor="#A6A6A6"
            style={styles.input}
            onChangeText={text => this.onChangePassword(text)}
            value={this.state.password}
          />
          <View style={styles.buttonContainer}>
            <ButtonWithIcon text="LOG IN" action={this.login}></ButtonWithIcon>
          </View>
        </View>
      </View>
    );
  }

  onChangeEmail(text) {
    this.setState({ email: text })
  }
  onChangePassword(text) {
    this.setState({ password: text })
  }
  register = () => {
    this.props.navigation.navigate("Register");
  }
  static contextType = LoginContext;
  login = async () => {
    try {
      const response = await axios.post(apiBase.apiBase + "login", {
        username: this.state.email,
        password: this.state.password
      })
      if (response.data.token) {
        window.analytics.track('login');
        AsyncStorage.setItem("email", this.state.email);
        if (response.data.imageUrl) {
          await AsyncStorage.setItem("imageUrl", response.data.imageUrl);
        }
        if (response.data.friendCode) {
          AsyncStorage.setItem("friendCode", response.data.friendCode);
        }
        await AsyncStorage.setItem("token", response.data.token);
        this.context.setSigninState(response.data.token);
      }
    } catch (err) {
      window.analytics.track('signup_error');
      // console.log('ERR');
      Alert.alert("Unable to log in", "Incorrect username or password.");
      console.log(err);
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
    width: '100%',
    backgroundColor: 'white',
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  image: {
    width: 320,
    height: 260
  },
  formContainer: {
    alignItems: 'center',
  },
  input: {
    height: 50,
    borderBottomColor: '#F6E8B2',
    borderBottomWidth: 1,
    width: '80%',
    color: '#ff8c00',
    fontSize: 19,
    marginTop: 5,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginTop: 40,
  }
});
