import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { HeaderBackButton } from '@react-navigation/stack';
import * as React from 'react';
import Card from '../../../components/Card';
import { Image, StyleSheet, Text, TouchableOpacity, View, BackHandler } from 'react-native';
import { authHeader } from '../../../auth';
import apiBase from '../../../constants/Api';
import axios from 'axios';
import Dialog from "react-native-dialog";
import ModalDropdown from 'react-native-modal-dropdown';

export default function GroupResultScreen(props) {
  const navigation = useNavigation();
  const route = useRoute();
  const [showPrompt, setShowPrompt] = React.useState(false);
  const [results, setResults] = React.useState([]);
  const group = route.params.group;
  const [groupNameTextbox, setGroupNameTextbox] = React.useState('');
  const refreshGroupList = route.params.refreshGroupList;
  const [groupName, setGroupName] = React.useState(route.params.group.name);
  const [resultPercentage, setResultPercentage] = React.useState(0);

  async function deleteGroup() {
    try {
      await axios.post(apiBase.apiBase + 'groups/' + route.params.group.id + '/delete', {}, { headers: await authHeader() });
      navigation.goBack();
    } catch (err) {
      console.log(err);
      Alert.alert("Error deleting this group");
    }
  }
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        navigation.navigate('Group');
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
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

  function closePrompt() {
    setShowPrompt(false);
  }

  React.useEffect(function () {
    (async function () {
      try {
        const resp = await axios.get(apiBase.apiBase + "groups/" + group.id + "/results", { headers: await authHeader() });
        setResults(resp.data);
        // console.log("results: ", resp.data);
      } catch (err) {
        console.log(err);
      }
    }());
  }, []);

  const dropdownOptions = [
    'Swipe Again',
    'Edit Event Name',
    'Edit Choices',
    'Select New Deck',
    'Delete Event'
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
      case 'Swipe Again':
        navigation.navigate('GroupDeck', { group, refreshGroupList });
        return
    }
  }

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flex: 1, flexDirection: 'row', alignContent: 'flex-end' }}>
          <TouchableOpacity onPress={navigateGroupMembers}>
            <Image style={styles.headerIcon} source={require('../../../assets/images/addFriends.png')} />
          </TouchableOpacity>
          <ModalDropdown
            options={dropdownOptions}
            style={{ marginRight: 10 }}
            dropdownStyle={{ height: dropdownOptions.length * 36 }}
            dropdownTextStyle={{ color: 'black' }}
            onSelect={(index, value) => handleDropdownPress(index, value)}>
            <Image style={styles.headerIcon} source={require('../../../assets/images/dots.png')} />
          </ModalDropdown>
        </View>
      ),
      headerLeft: () => (<HeaderBackButton tintColor='#f7941d' onPress={() => { navigation.navigate('Group') }} />),
    });
  });

  async function saveGroupName() {
    if (groupNameTextbox.length > 0) { // Only change if name is entered
      setGroupName(groupNameTextbox);
      try {
        await axios.post(apiBase.apiBase + "groups/" + route.params.group.id + "/setName", { name: groupNameTextbox }, { headers: await authHeader() });
        route.params.group.name = groupNameTextbox;
        route.params.nameUpdated(groupNameTextbox);
        closePrompt();
      } catch (err) {
        Alert.alert("An error occurred!", "Please try again later.");
        console.log(err + '\n\n\n\n\n\n\n\nn\n\n\n\n\n\n\n\nh\n\n\n\n\n\n\n\n\n\n\n');
      }
    }
  }

  return (

    <View style={styles.contentContainer}>
      {
        !!results?.length ? (
          <View>
            { results[0].percentNotVoted > 0 &&
              <View style={styles.topText}>
                <Text style={styles.percentNotSwipe}>{results[0] && (results[0].percentNotVoted)}% haven't swiped yet</Text>
              </View>
            }
          </View>) : (<View style={styles.topText}>
            <Text style={styles.favChoiceText}>No winner decided yet :( \n Start swiping and send a link to friends to get started!</Text>
          </View>)
      }
      <View style={styles.cardView}>
        {
          !!results?.length && (
            <Card card={results[0].cardData} hideMoreInfo isResult result={results[0].percentLiked * 100} />
          )
        }
      </View>
      <View style={styles.bottomContainer}>
        {!!results?.length && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={() => navigation.navigate('Votes', { group })}>
              <Image style={[styles.button, { opacity: 1.0 }]} source={require('../../../assets/images/seeVotes.png')} />
            </TouchableOpacity>
          </View>)
        }
      </View>
      {showPrompt && <View>
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
      </View>}
    </View>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topText: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
    height: 30,
  },
  percentNotSwipe: {
    fontSize: 15,
    textAlign: 'center',
    color: '#999b9e',
  },
  cardView: {
    marginTop: 20,
    flex: 1,
    width: '90%',
    marginLeft: '5%',
    zIndex: 1,
    alignItems: 'center',
    // height: '50%',
    flex: 0.8,
  },
  bottomContainer: {
    zIndex: 1,
    marginTop: 30,
    marginBottom: 30,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginHorizontal: 25,
  },
  button: {
    width: 250,
    height: 60,
    resizeMode: 'contain'
  },
  headerIcon: {
    width: 35,
    height: 35,
    margin: 5,
    resizeMode: 'contain'
  },
});
