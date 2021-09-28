import * as React from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Image, Alert, ScrollView, FlatList, Share, AsyncStorage, Clipboard, Root } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import { authHeader } from '../../auth';
import apiBase from '../../constants/Api';
import { TextInput } from 'react-native-gesture-handler';
import { useEffect, useState } from "react";
import ModalDropdown from 'react-native-modal-dropdown';
import * as Linking from 'expo-linking';
import Toast from 'react-native-easy-toast';

export default function GroupMembersScreen(props) {

  const navigation = useNavigation();
  const route = useRoute();
  navigation.setOptions({ title: "Manage Group Members" });

  let toastVar;

  const [members, setMembers] = useState(route.params.group.members || []); //[]);
  const [filteredMembers, setFilteredMembers] = useState(members);
  const [searchTextbox, setSearchTextbox] = useState('');
  const [joinLink, setJoinLink] = useState('');

  useEffect(() => {
    async function doAsync() {
      setJoinLink('https://app.squeet.co/groups/' + route.params.group.code);
      refresh();
    }
    doAsync();
  }, []);

  useEffect(
    () => {
      var filtered = members.filter(member => {
        return member.name.toLowerCase().includes(searchTextbox.toLowerCase());
      });
      if (filtered.length == 0) {
        filtered = members;
      }
      // console.log(searchTextbox)
      setFilteredMembers(filtered);
    },
    [searchTextbox],
  );

  async function navigateAddGroupMembers() {
    try {
      navigation.navigate('AddGroupMembers', { group: route.params.group });
    } catch (err) {
      console.log(err);
      Alert.alert("Error navigating to AddGroupMembers screen");
    }
  }


  const dropdownOptions = ['Add friend', 'Make admin', 'Remove from group'];
  const dropdownOptionsAdmin = ['Add friend', 'Revoke admin', 'Remove from group'];

  function handleDropdownPress(index, value, member) {
    switch (value) {
      case 'Add friend':
        addFriend(member);
        return;
      case 'Make admin':
        setRank(member, 2);
        return;
      case 'Revoke admin':
        setRank(member, 1);
        return;
      case 'Remove from group':
        removeMember(member);
        return;
    }
  }

  async function setRank(member, rank) {
    try {
      const resp = await axios.post(apiBase.apiBase + "groups/" + route.params.group.id + "/setRank", { member_id: member.id, rank: rank }, { headers: await authHeader() });
      refresh();
    } catch (error) {
      if (error.response) {
        Alert.alert("Error", error.response.data.error);
      } else {
        Alert.alert("Error", error.message);
      }
    }
  }
  async function removeMember(member) {
    try {
      const resp = await axios.post(apiBase.apiBase + "groups/" + route.params.group.id + "/remove", { member_id: member.id }, { headers: await authHeader() });
      refresh();
    } catch (error) {
      if (error.response) {
        Alert.alert("Error", error.response.data.error);
      } else {
        Alert.alert("Error", error.message);
      }
    }
  }

  async function addFriend(member) {
    try {
      const resp = await axios.post(apiBase.apiBase + "addFriend", { username: member.friend_code }, { headers: await authHeader() });
      refresh();
    } catch (error) {
      if (error.response) {
        Alert.alert(error.response.data.error);
      } else {
        Alert.alert(error.message);
      }
    }
  }

  function copyLink() {
    Clipboard.setString(joinLink)
    toastVar.show('Link copied to clipboard.');
  }

  const refresh = async () => {
    try {
      const resp = await axios.get(apiBase.apiBase + "groups/" + route.params.group.id, { headers: await authHeader() });
      console.log(resp);
      const members = resp.data.members;

      if (members) {
        setMembers(members);
      }
    } catch (err) {
      console.log(err);
    }
  };


  return (
    <View style={styles.container}>
      <View style={styles.headerBox}>
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.linkLabelText}>Your Sharable Web Link:</Text>
          <Text>{joinLink}</Text>
          <TouchableOpacity onPress={copyLink}>
            <Text style={styles.copyText}>copy</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.membersList}>
        <Text style={styles.membersText}>Members</Text>
        <TextInput style={styles.searchBox} value={searchTextbox} placeholder={' Search'} onChangeText={text => setSearchTextbox(text)} />
        <TouchableOpacity style={[styles.member]} onPress={navigateAddGroupMembers}>
          <Image
            source={require('../../assets/images/add.png')}
            style={{ height: 60, width: 60, backgroundColor: '#ccc', borderRadius: 30, marginRight: 15 }}
          />
          <Text style={styles.addAdminText}>Add Admin</Text>
        </TouchableOpacity>
        <View style={({ backgroundColor: '#ccc', height: 1, })} />
        <FlatList
          data={(searchTextbox === '') ? members : filteredMembers}
          numColumns={1}
          ItemSeparatorComponent={() =>
            <View style={({ backgroundColor: '#ccc', height: 1, })} />
          }
          renderItem={({ item }) => (
            <View style={styles.member}>
              <Image
                source={item?.image_url
                  ? { uri: item.image_url }
                  : require('../../assets/images/defaultProfilePic.png')}
                style={{ height: 60, width: 60, backgroundColor: '#ccc', borderRadius: 30, marginRight: 15 }}
              />
              <View style={{ flexDirection: 'column' }}>
                <Text>{item.name}</Text>
                {
                  item.user_rank == 2 &&
                  <Text style={{ fontSize: 12, color: 'gray' }}>Admin</Text>
                }
              </View>
              <ModalDropdown options={item.user_rank == 2 ? dropdownOptionsAdmin : dropdownOptions}
                style={styles.dropdown}
                dropdownStyle={{ height: dropdownOptions.length * 36 }}
                dropdownTextStyle={{ color: 'black' }}
                onSelect={(index, value) => handleDropdownPress(index, value, item)}>
                <Image style={{
                  height: 10, width: 25
                }} source={require('../../assets/images/horizontalDots.png')} />
              </ModalDropdown>
            </View>
          )}
          keyExtractor={item => item.id}
        />
      </View>
      <Toast position="bottom" positionValue={200} ref={(toast) => toastVar = toast} />
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerBox: {
    marginBottom: 10,
    width: '100%',
    // padding: '5%',
    height: 90,
    justifyContent: 'center',
    backgroundColor: '#eee'
  },
  linkLabelText: {
    fontSize: 14,
    color: '#FF9405',
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    marginLeft: 30,
  },
  copyText: {
    color: '#1E90FF',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    marginTop: 5,
  },
  addAdminText: {
    color: '#1E90FF',
    fontWeight: 'bold'
  },
  membersText: {
    fontSize: 24,
    fontWeight: '500',
    marginLeft: 10,
  },
  searchBox: {
    height: 30,
    marginVertical: 5,
    marginHorizontal: 20,
    padding: 5,
    borderRadius: 5,
    backgroundColor: 'white',
    borderColor: 'black',
    borderWidth: 1,
  },
  membersList: {
    borderRadius: 5,
    flexDirection: 'column',
    marginHorizontal: 10,
    alignContent: 'flex-start'
  },
  member: {
    padding: 10,
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  dropdown: {
    position: 'absolute',
    right: 0,
    marginRight: '5%',
    alignItems: 'center',
    justifyContent: 'center'
  }
});
