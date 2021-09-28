/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import * as React from 'react';
import { Alert, StyleSheet, TouchableOpacity, View, Text, Image, UIManager } from 'react-native';
import Dialog from "react-native-dialog";
import { authHeader } from '../../../auth';
import apiBase from '../../../constants/Api';
import axios from 'axios';
import GroupSwiper from '../../../components/GroupSwiper';
import ModalDropdown from 'react-native-modal-dropdown';

export default function GroupSwipeScreen(props) {
  const navigation = useNavigation();
  const route = useRoute();
  const [showPrompt, setShowPrompt] = React.useState(false);
  const [groupNameTextbox, setGroupNameTextbox] = React.useState('');
  const [groupName, setGroupName] = React.useState(route.params.group.name);
  const [group, setGroup] = React.useState(route.params.group);
  navigation.setOptions({ title: group.name });


  React.useEffect(function () {
    (async function () {
      try {
        const resp = await axios.get(apiBase.apiBase + "groups/" + group.id, { headers: await authHeader() });
        setGroup(resp.data);
        navigation.setOptions({ title: resp.data.name });
      } catch (err) {
        console.log(err);
      }
    }());
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      (async function () {
        const resp = await axios.get(apiBase.apiBase + "groups/" + group.id, { headers: await authHeader() });
        setGroup(resp.data);
      }());
    }, [])
  );

  async function navigateGroupMembers() {
    try {
      navigation.navigate('GroupMembers', { group });
    } catch (err) {
      console.log(err);
      Alert.alert("Error navigating to GroupMembers screen");
    }
  }

  async function navigateAddGroupMembers() {
    try {
      navigation.navigate('AddGroupMembers', { group });
    } catch (err) {
      console.log(err);
      Alert.alert("Error navigating to AddGroupMembers screen");
    }
  }

  async function navigateViewResults() {
    try {
      navigation.navigate('GroupResult', { group });
    } catch (err) {
      console.log(err);
      Alert.alert("Error navigating to GroupResult screen");
    }
  }

  async function navigateAddCard() {
    try {
      navigation.navigate('AddCard', { group });
    } catch (err) {
      console.log(err);
      Alert.alert("Error navigating to AddCard screen");
    }
  }

  async function navigateEditDeck() {
    try {
      navigation.navigate('EditDeck', { group });
    } catch (err) {
      console.log(err);
      Alert.alert("Error navigating to EditDeck screen");
    }
  }

  async function deleteGroup() {
    try {
      await axios.post(apiBase.apiBase + 'groups/' + route.params.group.id + '/delete', {}, { headers: await authHeader() });
      navigation.goBack();
    } catch (err) {
      console.log(err);
      Alert.alert("Error deleting this group");
    }
  }

  async function saveGroupName() {
    if (groupNameTextbox.length > 0) { // Only change if name is entered
      setGroupName(groupNameTextbox);
      try {
        await axios.post(apiBase.apiBase + "groups/" + route.params.group.id + "/setName", { name: groupNameTextbox }, { headers: await authHeader() });
        route.params.group.name = groupNameTextbox;
        route.params.nameUpdated = groupNameTextbox;
        closePrompt();
      } catch (err) {
        Alert.alert("An error occurred!", "Please try again later.");
        console.log(err);
      }
    }
  }

  function closePrompt() {
    setShowPrompt(false);
  }

  const dropdownOptions = [
    'View Results',
    'Edit Event Name',
    'Edit Choices',
    'Select New Deck',
    'Delete Event',
  ];

  function handleDropdownPress(index, value) {
    switch (value) {
      case 'View members':
        navigateGroupMembers()
        return
      case 'Add members':
        navigateAddGroupMembers()
        return
      case 'Add card':
        navigateAddCard()
        return
      case 'Edit Choices':
        navigateEditDeck()
        return
      case 'Edit Event Name':
        setShowPrompt(true)
        return
      case 'Delete Event':
        deleteGroup();
        return
      case 'Select New Deck':
        navigation.navigate('ConfigureGroup', { group, update: true });
        return
      case 'View Results':
        navigateViewResults();
        return
    }
  }

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flex: 1, flexDirection: 'row', alignContent: 'flex-end' }}>
          {/* <TouchableOpacity onPress={() => navigation.navigate('GroupResult', { group })}>
            <Image style={styles.headerIcon} source={require('../../../assets/images/results.png')} />
          </TouchableOpacity> */}
          <TouchableOpacity onPress={navigateGroupMembers}>
            <Image style={styles.headerIcon} source={require('../../../assets/images/addFriends.png')} />
          </TouchableOpacity>
          <ModalDropdown options={dropdownOptions}
            style={{ marginRight: 10 }}
            dropdownStyle={{ height: dropdownOptions.length * 36 }}
            dropdownTextStyle={{ color: 'black' }}
            onSelect={(index, value) => handleDropdownPress(index, value)}>
            <Image style={styles.headerIcon} source={require('../../../assets/images/dots.png')} />
          </ModalDropdown>
        </View>
      )
    });
  });

  return (
    <View style={styles.container}>
      <Dialog.Container visible={showPrompt}>
        <Dialog.Title>Rename Group</Dialog.Title>
        <Dialog.Input keyboardType="default"
          textContentType="name"
          selectionColor="#FF9405"
          autoCompleteType="email"
          importantForAutofill="yes"
          placeholder={groupNameTextbox}
          placeholderTextColor="#A6A6A6"
          style={styles.input}
          onChangeText={setGroupNameTextbox}
          value={groupNameTextbox}
        />
        <Dialog.Button label="Cancel" color="grey" onPress={closePrompt} />
        <Dialog.Button label="Change" bold color="#FF9704" onPress={saveGroupName}
        />
      </Dialog.Container>
      <View style={styles.contentContainer}>
        <GroupSwiper group={group} goResultsScreen={navigateViewResults} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    marginTop: 25
    // flex: 1
  },
  headerIcon: {
    width: 35,
    height: 35,
    margin: 5,
    resizeMode: 'contain'
  },
});
