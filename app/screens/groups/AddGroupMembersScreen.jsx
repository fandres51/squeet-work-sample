import * as React from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Image, Alert, ScrollView, FlatList, Share, AsyncStorage } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import { authHeader } from '../../auth';
import apiBase from '../../constants/Api';
import { TextInput } from 'react-native-gesture-handler';
import { useEffect, useState } from "react";
import * as Linking from 'expo-linking';

export default function AddGroupMembersScreen(props) {

  const navigation = useNavigation();
  const route = useRoute();
  navigation.setOptions({ title: "Add Admin" });

  const [friends, setFriends] = useState([]);
  const [members, setMembers] = useState([]);
  const [friendTextbox, setFriendTextbox] = useState("");
  const [filteredFriends, setFilteredFriends] = useState([]);

  useEffect(function () {
    // console.log('group' + route.params.group);
    refresh();
  }, []);

  useEffect(
    () => {
      var filteredFriends = friends.filter(friend => {
        return friend.name.toLowerCase().includes(friendTextbox.toLowerCase());
      });
      if (filteredFriends.length == 0) {
        filteredFriends = friends;
      }
      setFilteredFriends(filteredFriends);
    },
    [friendTextbox],
  );

  async function friendCode() {
    try {
      let code = await AsyncStorage.getItem('friendCode');
      await Share.share({
        message: 'https://app.squeet.co/groups/' + route.params.group.code,
      });
    } catch (error) {
      alert(error.message);
    }
  }

  async function addToGroup(friend) {
    try {
      const resp = await axios.post(apiBase.apiBase + "groups/" + route.params.group.id + "/add", { friend_id: friend.id }, { headers: await authHeader() });
      Alert.alert('Added ' + friend.name + ' to your group');
      setFriendTextbox('');
    } catch (error) {
      alert(error.message);
    }
  }

  const refresh = async () => {
    try {
      const memberResp = await axios.get(apiBase.apiBase + "groups/" + route.params.group.id, { headers: await authHeader() });
      setMembers(memberResp.members);

      const friendResp = await axios.get(apiBase.apiBase + "friends", { headers: await authHeader() });
      var friends = friendResp.data;
      friends.map(obj => ({ ...obj, selected: 'false', inGroup: 'false' }));

      friends.filter(friend => {
        if (members.find(member => member.id === friend.id)) {
          friend.inGroup = true;
        } else {
          friend.inGroup = false;
        }
        console.log(friend);
      })

      setFriends(friends);
    } catch (err) {
      console.log(err);
    }
  };


  return (
    <View style={styles.container}>
      <View style={styles.friendList}>
        {/* <Text style={styles.subheader}>Friends</Text> */}
        <TextInput style={styles.searchBox} value={friendTextbox} placeholder={' Search'} onChangeText={text => setFriendTextbox(text)} />
        <TouchableOpacity style={[styles.friend]} onPress={friendCode}>
          <Image
            source={require('../../assets/images/link.png')}
            style={{ height: 60, width: 60, backgroundColor: '#ccc', borderRadius: 30, marginRight: 15 }}
          />
          <Text style={styles.inviteFriendText}>Invite friend to Squeet via Link</Text>
        </TouchableOpacity>
        <View style={({ backgroundColor: '#ccc', height: 1, })} />
        <FlatList
          data={(friendTextbox === '' ? friends : filteredFriends)}
          numColumns={1}
          ItemSeparatorComponent={() =>
            <View style={({ backgroundColor: '#ccc', height: 1, })} />
          }
          renderItem={({ item }) => (
            <View style={[styles.friend]}>
              {item?.image_url != '' &&
                <Image
                  source={item?.image_url
                    ? { uri: item.image_url }
                    : require('../../assets/images/defaultProfilePic.png')}
                  style={{ height: 60, width: 60, backgroundColor: '#ccc', borderRadius: 30, marginRight: 15 }}
                />}
              <Text>{item.name}</Text>
              <TouchableOpacity style={{
                position: 'absolute', right: 0, marginRight: '5%',
                height: 20, width: 30, alignItems: 'center', justifyContent: 'center'
              }} onPress={() => addToGroup(item)}>
                <Image style={{
                  height: 20, width: 20,
                }} tintColor={item?.inGroup && '#ccc'} source={require('../../assets/images/addMember.png')} />
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={item => item.id}
        />
      </View>
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchBox: {
    height: 30,
    marginTop: 10,
    marginBottom: 10,
    marginHorizontal: 20,
    padding: 5,
    borderRadius: 5,
    backgroundColor: 'white',
    borderColor: 'black',
    borderWidth: 1,
  },
  inviteFriendText: {
    color: '#1E90FF',
    fontWeight: 'bold'
  },
  friendList: {
    borderRadius: 5,
    flexDirection: 'column',
    marginHorizontal: 10,
    alignContent: 'flex-start'
  },
  subheader: {
    fontSize: 24,
    fontWeight: '500'
  },
  friend: {
    padding: 10,
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
});
