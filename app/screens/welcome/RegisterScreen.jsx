import * as React from 'react';
import { Text, TouchableOpacity, Image, Button, StyleSheet, View, Dimensions, TextInput, AsyncStorage, Alert, Switch } from 'react-native';
import axios from 'axios';
import apiBase from '../../constants/Api';
import { onSignIn, isSignedIn, LoginContext } from '../../auth';
import * as Linking from 'expo-linking';
import ButtonWithIcon from '../../components/ButtonWithIcon';

export default class RegisterScreen extends React.Component {

  static contextType = LoginContext;

  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      name: "",
      friendCode: "",
      marketing: true,
      groupCode: "",
      registrationStatus: false,
    };

    Linking.addEventListener('url', this.handleLink);
    Linking.getInitialURL().then((url) => this.handleLink({ url }));
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
            keyboardType="default"
            textContentType="name"
            autoCapitalize="words"
            selectionColor="#ff8c00"
            autoCompleteType="name"
            importantForAutofill="yes"
            placeholder="ENTER YOUR NAME"
            placeholderTextColor="#A6A6A6"
            style={styles.input}
            onChangeText={text => this.onChangeName(text)}
            value={this.state.name}
          />

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
            <ButtonWithIcon text="SIGN UP" action={this.register}></ButtonWithIcon>
          </View>
        </View>
        <View style={styles.legalContainer}>
          <TouchableOpacity style={styles.legalButton} title="Terms of Service" onPress={() => { this.props.navigation.navigate('Web', { url: "https://squeet.co/terms", title: "Terms of Service" }); }}>
            <Text style={styles.legalButtonText}>Terms of Service</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.legalButton} title="Privacy Policy" onPress={() => { this.props.navigation.navigate('Web', { url: "https://squeet.co/privacy", title: "Privacy Policy" }); }}>
            <Text style={styles.legalButtonText}>Privacy Policy</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  onChangeEmail(text) {
    this.setState({ email: text })
  }
  onChangeName(text) {
    this.setState({ name: text })
  }
  onChangePassword(text) {
    this.setState({ password: text })
  }
  // onChangeFriendCode(text) {
  //   // console.log(text);
  //   this.setState({ friendCode: text })
  // }
  // onContinue() {
  //   this.setState({ registrationStatus: true })
  // }
  // onBack() {
  //   this.setState({ registrationStatus: false })
  // }

  register = async () => {
    try {
      const response = await axios.post(apiBase.apiBase + "register", {
        email: this.state.email,
        name: this.state.name,
        password: this.state.password,
        friendCode: this.state.friendCode,
        groupCode: this.state.groupCode,
      });
      // console.log(response.data);
      if (response.data.token) {
        window.analytics.track('signup');
        onSignIn(response.data.token);
        isSignedIn();
        await AsyncStorage.setItem("email", this.state.email);
        if (response.data.friendCode) {
          await AsyncStorage.setItem("friendCode", response.data.friendCode);
        }
        if (response.data.imageUrl) {
          await AsyncStorage.setItem("imageUrl", response.data.imageUrl);
        }

        this.context.setSigninState(true);
      }
    } catch (err) {
      window.analytics.track('signup_error');
      if (err.msg) {
        Alert.alert("Unable to sign up", err.msg);
      } else {
        Alert.alert("Unable to sign up", "Please try again later.");
      }
      // console.log(err);
      console.log(err.msg);
    }
  }

  handleLink = (event) => {
    let { queryParams } = Linking.parse(event.url);
    if (queryParams.addFriend) {
      this.setState({ friendCode: queryParams.addFriend });
    }
    if (queryParams.joinGroup) {
      this.setState({ groupCode: queryParams.joinGroup });
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
    height: 45,
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
  },
  legalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    position: 'absolute',
    bottom: 20
  },
  legalButtonText: {
    color: '#ff8c00',
    marginHorizontal: 20,
    fontWeight: '500',
  }
});