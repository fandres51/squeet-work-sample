import * as React from 'react';
import { Button, StyleSheet, Text, View, AsyncStorage, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { onSignOut, LoginContext } from '../../auth';

export default class SettingsScreen extends React.Component {

  constructor({ navigation }) {
    super();
    this.state = {
      markers: [],
      places: [],
      imageUrl: ''
    };

    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={navigation.openDrawer} style={{ marginLeft: 10 }}>
          <Ionicons
            name="ios-menu-outline"
            size={37}
            // style={}
            color={"#FF9704"}
          />
        </TouchableOpacity>
      )
    });

    this.loadUser();
  }


  static contextType = LoginContext;
  render() {
    // const whatisthis = this;
    // console.log(this.state.places)
    return (
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>

          <View style={styles.profile}>
            <View style={styles.profileFlex}>
              <View>
                { this.state.imageUrl != '' &&
                <Image
                  source={{
                    uri: this.state.imageUrl
                  }}
                  style={{height: 60, width: 60, backgroundColor: '#eeee', borderRadius: 30, marginRight: 15}}
                />
                }
                {/* <Ionicons
                  name="md-person"
                  size={30}
                  color="#E4B90C"
                  style={styles.personCircle}
                /> */}
              </View>
              <View>
                <Text style={styles.email}>{this.state.email}</Text>
                <Text style={styles.city}>Atlanta, GA</Text>
              </View>
            </View>
          </View>
          <Button onPress={() => { onSignOut(); this.context.setSigninState(false); }} title="Sign out" color="red" />

        </ScrollView>
      </View>
    );
  }

  loadUser = async () => {
    const email = await AsyncStorage.getItem("email");
    const imageUrl = await AsyncStorage.getItem("imageUrl");
    console.log(imageUrl);
    this.setState({ email: email, imageUrl: imageUrl || "" });
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  profile: {
    padding: 40,
    height: 100
  },
  profileFlex: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  email: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#FF9B04"
  },
  city: {
    color: "#FF9B04"
  },
  icon: {

  },
  personCircle: {
    padding: 14,
    paddingStart: 19,
    marginRight: 12,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#FEDF63",
    overflow: "hidden"
  },
  pencilCircle: {
    padding: 10,
    paddingStart: 13,
    marginStart: 30,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#cdf5b6",
    overflow: "hidden"
  },
  header: {
    height: 50,
    marginTop: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  headerText: {
    textAlign: 'center',
    color: 'gray',
    maxWidth: '60%',
  },
  navImage: {
    width: 30,
    height: 30,
    resizeMode: 'contain'
  },

});
