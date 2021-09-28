import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import * as React from 'react';
import { Alert, AsyncStorage, Button, FlatList, Image, Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Dialog from "react-native-dialog";
import { authHeader } from '../../auth';
import apiBase from '../../constants/Api';
import * as Linking from 'expo-linking';

export default class FriendScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      markers: [],
      friends: [],
      showPrompt: false,
      friendCode: ''
    };
    this.loadUser();
    this.loadFriends();

    Linking.addEventListener('url', this.handleLink);
    Linking.getInitialURL().then((url) => this.handleLink({url}));

    this.props.navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={this.props.navigation.openDrawer} style={{ marginLeft: 10 }}>
          <Ionicons
            name="ios-menu-outline"
            size={37}
            // style={}
            color={"#FF9704"}
          />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity onPress={this.showPrompt} style={{ marginRight: 20 }}>
          <Ionicons
            name="md-add"
            size={33}
            style={{ marginTop: -7 }}
            color={"#FF9704"}
          />
        </TouchableOpacity>
      )
    })
  }



  render() {
    const addPrompt = [{ name: 'friendCode', friendCode: this.state.friendCode }];
    return (
      <View style={styles.container}>
        <Dialog.Container visible={this.state.showPrompt}>
          <Dialog.Title>Add a friend</Dialog.Title>
          <Dialog.Description>
            Enter your friend's email adddress or 6 character invite code to add them as a friend.
            As friends, you can compare your likes to find the places you have in common!
          </Dialog.Description>
          <Dialog.Input keyboardType="email-address"
            textContentType="emailAddress"
            autoCapitalize='none'
            selectionColor="#FF9405" autoCompleteType="email" importantForAutofill="yes" placeholder="email or friend code" placeholderTextColor="#A6A6A6" style={styles.input} onChangeText={text => this.onChangeEmail(text)} value={this.state.email} />
          <Dialog.Button label="Cancel" color="grey" onPress={this.handleCancel} />
          <Dialog.Button label="Add" bold color="#FF9704" onPress={this.handleAdd} />
        </Dialog.Container>
        <FlatList
          data={addPrompt.concat(this.state.friends)}
          renderItem={({ item }) => {
            if (item.friendCode) {
              console.log(1);
              return (<FriendCodeItem code={item.friendCode} />)
            } else {
              return (<TouchableOpacity onPress={null}/*() => this.props.navigation.navigate('Matches', { friend: item })}*/><FriendItem friend={item} /></TouchableOpacity>)
            }
          }}
          keyExtractor={item => item.name}
        />
      </View>
    );
  }
  onChangeEmail = (email) => {
    this.setState({ email: email });
  }

  handleAdd = async () => {
    try {
      const resp = await axios.post(apiBase.apiBase + "addFriend", { username: this.state.email }, { headers: await authHeader() });
      // this.setState({ showPrompt: false });
      if (!resp.data) {
        Alert.alert("Error", "Unable to add this user as a friend. Did you enter the correct email or code?");
      } else {
        Alert.alert("Added", "You've added " + resp.data.name + " as a friend!",
          [
            { text: "OK", onPress: () => this.setState({ showPrompt: false }) }
          ]);
      }
      this.loadFriends();
    } catch (err) {
      // this.setState({ showPrompt: false });
      Alert.alert("Error", "Unable to add this user as a friend. Did you enter the correct email or code?");
      console.log(err);
    }
  };

  handleCancel = () => {
    this.setState({ showPrompt: false });
  };

  showPrompt = () => {
    this.setState({ showPrompt: true });
  };

  loadFriends = async () => {
    try {
      const response = await axios.get(apiBase.apiBase + "friends", { headers: await authHeader() });
      // console.log(response.data.length)
      this.setState({ friends: response.data })
    } catch (err) {
      console.log(err)
    }
  }

  loadUser = async () => {
    const friendCode = await AsyncStorage.getItem("friendCode");
    console.log(friendCode);
    this.setState({ friendCode: friendCode });
  }

  handleLink = (event) => {
    let { path, queryParams } = Linking.parse(event.url);
    if (path == "friends") {
      if (queryParams.addFriend) {
        this.setState({ showPrompt: true, email: queryParams.addFriend });
      }
    }
  }
}

FriendScreen.navigationOptions = () => {
  return {
    headerStyle: {
      backgroundColor: 'black'
    },
    headerVisible: false,
    headerTintColor: 'black'
  }
}


function FriendCodeItem({ code }) {
  if (!code) { return null; }
  const onShare = async () => {
    try {
      await Share.share({
        message: 'Add me as a friend on Squeet so we can make group decisions faster! ' + Linking.makeUrl('/', { addFriend: code }),
      });
    } catch (error) {
      alert(error.message);
    }
  }
  return (
    <View style={styles.friendCodeContainer}>
      <Text style={styles.friendCodeHeader}>Your friend code:</Text>
      <Text style={styles.friendCodeText} selectable>{code}</Text>
      <Button onPress={onShare} title="Share" />
    </View>
  );
}

function FriendItem({ friend }) {
  if (!friend) {
    return null;
  }
  console.log(friend);
  return (
    <View style={styles.profileFlex}>
      <View>
        {friend.image_url != '' &&
          <Image
            source={{
              uri: friend.image_url
            }}
            style={{ height: 60, width: 60, backgroundColor: '#eeee', borderRadius: 30, marginRight: 15 }}
          />
        }
      </View>
      <View>
        <Text style={styles.email}>{friend.name}</Text>
      </View>
    </View>);
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1
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
  friendCodeContainer: {
    width: '90%',
    marginLeft: '5%',
    backgroundColor: '#fafafa',
    padding: 10
  },
  friendCodeHeader: {
    color: '#FF9B04',
    fontWeight: 'bold',
    fontSize: 22
  },
  friendCodeText: {
    fontSize: 40
  },
  profileFlex: {
    marginLeft: '5%',
    padding: 10,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  email: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#FF9405"
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
});
