import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, StackActions } from '@react-navigation/native';
import * as React from 'react';
import { Text, StyleSheet, TouchableOpacity, View, Image, Alert, FlatList } from 'react-native';
import { authHeader } from '../../../auth';
import apiBase from '../../../constants/Api';
import axios from 'axios';
import ModalDropdown from 'react-native-modal-dropdown';
import ButtonWithIcon from '../../../components/ButtonWithIcon';
import ChangableText from '../../../components/ChangableText';
import Dialog from "react-native-dialog";
import { useIsFocused } from '@react-navigation/native';


export default function EditDeckScreen(props) {

  const navigation = useNavigation();
  const route = useRoute();
  const isFocused = useIsFocused();
  const [group, setGroup] = React.useState(route.params.group);
  const [name, setName] = React.useState(route.params.group.name ? route.params.group.name : 'Group Name');
  const [cards, setCards] = React.useState([]);
  const [newCardTitle, setNewCardTitle] = React.useState('');
  const [createNewCard, setCreateNewCard] = React.useState(false);
  const [addByLink, setAddByLink] = React.useState(false);
  const [link, setLink] = React.useState('');

  const loadCards = async () => {
    try {
      if (group) {
        const response = await axios.get(apiBase.apiBase + "decks/" + group.deck_id + "/cards", { headers: await authHeader() });
        if (response.data) {
          setCards(response.data);
        } else {
          Alert.alert("Error loading deck");
        }
      }
    } catch (err) {
      console.log(err);
      Alert.alert("Error loading deck");
    }
  };

  async function navigateEditCard(card) {
    try {
      navigation.navigate('EditCard', { deck_id: group.deck_id, card });
    } catch (err) {
      console.log(err);
      Alert.alert("Error navigating to editCard screen");
    }
  }

  async function deleteCard(card) {
    try {
      await axios.post(apiBase.apiBase + "decks/" + group.deck_id + "/delete/" + card.id, {}, { headers: await authHeader() });
      setCards(cards.filter(x => x.id != card.id));
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "An error occurred. Please try again later.");
    }
  }

  React.useEffect(() => { loadCards(); }, []);
  React.useEffect(() => { loadCards(); }, [isFocused]);

  async function createGroup() {
    console.log('groups before', group);
    const resp = await axios.post(apiBase.apiBase + "groups/new", { ...group, name },
      { headers: await authHeader() });
    console.log('Creating group...');
    if (!resp.data) {
      throw new Error("No response data from groups/new api call");
    } else {
      console.log("groups/new response", resp.data);
      setGroup(resp.data);
      return resp.data
    }
  }

  async function addCardByLink(link) {
    try {
      console.log(link);
      const placeResp = await axios.post(apiBase.apiBase + "decks/card/getRichLink", { url: link }, { headers: await authHeader() });
      console.log(placeResp.data);
      const { title, image, description } = placeResp.data;
      const newCard = { title, image, description, link, key: title };
      setAddByLink(false);
      const resp = await axios.post(apiBase.apiBase + "decks/" + group.deck_id + "/addCard", newCard, { headers: await authHeader() });
      newCard.id = resp.data.id;
      setCards(cards.concat([newCard]));

    } catch (err) {
      console.log(err);
    }
  }


  async function save() {
    // if (route.params.isUpdate) {
    // }
    if (name == 'Group Name') {
      Alert.alert("Please set a group name.");
      return
    }
    var newGroup;
    if (route.params.isCreate) {
      newGroup = await createGroup();
      navigation.dispatch(StackActions.popToTop());
      if (route.params.group.decision_type == 1) {
        navigation.navigate('PollScreen', { group: newGroup || group })
      }
      navigation.navigate('GroupDeck', { group: newGroup || group })
    } else {
      // await axios.post(apiBase.apiBase + "groups/" + group.id + "/setName", { name }, { headers: await authHeader() });
      navigation.goBack();
    }
  }

  async function createCard(title) {
    try {

      await axios.post(apiBase.apiBase + "decks/" + group.deck_id + "/addCard", { title }, { headers: await authHeader() });
      setCreateNewCard(false)
      setNewCardTitle('')
      loadCards()
    } catch (err) {
      Alert.alert("An error occurred while adding card!", "Please try again later.");
      console.log(err);
    }
  }


  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity style={styles.settingsContainer} onPress={() => navigation.navigate('GroupSettings', { group })}>
          <Image style={styles.settingsIcon} source={require('../../../assets/images/settings.png')} />
        </TouchableOpacity>
      ),
      // headerTitleStyle: {
      //   flex: 1,
      //   textAlign: "center",

      // },
      headerTitle:
        // <View style={{ backgroundColor: 'blue' }}>
        <View style={{ flexDirection: 'column', alignItems: 'center', width: 230 }}>
          <Text style={{
            color: '#000',
            fontSize: 20,
            fontWeight: 'bold',
          }}>Edit Deck</Text>
          <Text style={{ color: '#999b9e', fontSize: 12 }}>{cards.length} Choices</Text>
        </View>
      // </View>,
    });
  });


  const dropdownOptions = ['Paste Link with Options']
  function handleDropdownPress(index, value) {
    switch (value) {
      case 'Paste Link with Options':
        setAddByLink(true);
        return;
    }
  }
  var cardData = [...cards, { id: -1 }];
  if (route.params.isCreate) {
    cardData = [{ id: -2 }].concat(cardData);
  }
  return (
    <View style={styles.container}>
      <Dialog.Container visible={createNewCard}>
        <Dialog.Title>Enter the card title...</Dialog.Title>
        <Dialog.Input
          keyboardType="default"
          autoFocus={true}
          textContentType="name"
          selectionColor="#FF9405"
          placeholder={'Card Title'}
          placeholderTextColor="#A6A6A6"
          onChangeText={setNewCardTitle}
          style={styles.nameInput}
          value={newCardTitle}
        />
        <Dialog.Button label="Cancel" color="grey" onPress={() => { setCreateNewCard(false); setNewCardTitle('') }} />
        <Dialog.Button label="Save" bold color="#FF9704" onPress={() => { createCard(newCardTitle) }} />
      </Dialog.Container>

      <Dialog.Container visible={addByLink}>
        <Dialog.Title>Quick add</Dialog.Title>
        <Dialog.Description>Paste in a link to automatically generate a card!</Dialog.Description>
        <Dialog.Input
          keyboardType="default"
          autoFocus={true}
          textContentType="URL"
          selectionColor="#FF9405"
          placeholder={'https://'}
          placeholderTextColor="#A6A6A6"
          onChangeText={setLink}
          style={styles.nameInput}
          value={link}
        />
        <Dialog.Button label="Cancel" color="grey" onPress={() => { setAddByLink(false); setLink('') }} />
        <Dialog.Button label="Create" bold color="#FF9704" onPress={() => { addCardByLink(link) }} />
      </Dialog.Container>
      <View style={styles.deckContainer}>
        <FlatList
          data={cardData}
          style={styles.flatlist}

          // removeClippedSubviews={true} // Unmount components when outside of window
          // initialNumToRender={4} // Reduce initial render amount
          // maxToRenderPerBatch={1} // Reduce number in each render batch
          // updateCellsBatchingPeriod={100} // Increase time between renders
          // windowSize={2} // Reduce the window size

          contentContainerStyle={styles.flatlistContent}
          renderItem={({ item, index }) => {
            if (item.id == -1) {
              return (
                <View style={styles.choiceContainer}>
                  <TouchableOpacity style={styles.selectableArea} onPress={() => { setCreateNewCard(true) }}>
                    <View style={styles.choiceImageContainer}>
                      <Image style={[styles.addOptionImage, { opacity: 1.0 }]} source={require('../../../assets/images/plusBox.png')} />
                    </View>
                    <View style={styles.choiceText}>
                      <Text style={styles.addOptionText}>Tap to Add Option</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setAddByLink(true)}>
                    <Image
                      style={{ height: 20, width: 25, resizeMode: 'contain' }}
                      source={require('../../../assets/images/link2.png')}
                    />
                  </TouchableOpacity>
                  {/* <ModalDropdown
                    style={styles.deleteButtonContainer}
                    options={dropdownOptions}
                    dropdownStyle={{ height: dropdownOptions.length * 36, width: 140 }}
                    dropdownTextStyle={{ color: 'black' }}
                    onSelect={(index, value) => handleDropdownPress(index, value)}>

                  </ModalDropdown> */}
                </View>
              )
            } if (item.id == -2) {
              return (
                <View style={styles.titleContainer}>
                  <TouchableOpacity style={styles.selectableArea} onPress={() => { /*Alert.alert('Not Implemented: edit ' + index)*/ }}>

                    <View style={styles.titleTextContainer}>
                      {
                        route.params.isCreate &&
                        <ChangableText initialText={name} title='Edit Event Name' onChange={setName} />
                      }
                    </View>
                  </TouchableOpacity>
                </View>
              )
            }
            return (
              <View style={styles.choiceContainer}>
                <TouchableOpacity style={styles.selectableArea} onPress={() => navigateEditCard(item)}>
                  <View style={styles.choiceImageContainer}>
                    <Image
                      style={styles.choiceImage}
                      source={{ uri: item.image }} />
                  </View>
                  <View style={styles.choiceText}>
                    <Text style={styles.choiceName}>{item.name}</Text>
                    <Text style={styles.choiceDescription}>{item.description}</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteButtonContainer} onPress={() => deleteCard(item)}>
                  <Image style={styles.deleteButton} source={require('../../../assets/images/trash.png')} />
                </TouchableOpacity>
              </View>
            )
          }
          }
          ItemSeparatorComponent={() =>
            <View style={({ backgroundColor: '#ccc', height: 1, })} />
          }
          keyExtractor={item => item.id}
        />

      </View>

      <View style={styles.footerContainer}>
        <ButtonWithIcon text="SAVE EVENT" action={save} icon='check'></ButtonWithIcon>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  settingsContainer: {
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  settingsIcon: {
    height: 30,
    width: 30,
    resizeMode: 'contain'
  },
  footerContainer: {
    // padding: 5,
    borderTopWidth: 1,
    borderColor: '#ccc',
    height: '15%',
    width: '100%',
    // backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deckContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    width: '100%',
    overflow: 'hidden',
    flexGrow: 1,
  },
  flatlist: {
    width: '100%',
    // backgroundColor: '#eee'
  },
  flatlistContent: {
    alignItems: 'center',
    width: '100%',
  },
  titleContainer: {
    flexDirection: 'row',
    height: 30,
    width: 350,
    marginVertical: 15,
    // backgroundColor: '#ddd',
  },
  titleTextContainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  editTextIcon: {
    height: 20,
    width: 20,
    resizeMode: 'contain'
  },
  choiceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 80,
    width: 350,
    marginVertical: 15,

    // backgroundColor: '#ddd',
  },
  selectableArea: {
    flex: 1,
    flexDirection: 'row',
  },
  choiceImageContainer: {
    // backgroundColor: '#ccc',
  },
  choiceImage: {
    height: 80,
    width: 80,
    // resizeMode: 'contain',
    borderWidth: 1,
    borderRadius: 5,
    marginRight: 10,
    borderColor: '#000'
  },
  choiceText: {
    flex: 5,
    justifyContent: 'center',
    // backgroundColor: '#bbb',
  },
  choiceName: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  choiceDescription: {
    fontSize: 10,
    color: '#999b9e',
  },
  deleteButtonContainer: {
    // backgroundColor: '#aaa',
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
  },
  deleteButton: {
    height: 30,
    width: 30,
    resizeMode: 'contain'
  },
  addOptionImage: {
    height: 80,
    width: 80,
    marginRight: 10,
  },
  addOptionText: {
    color: '#f57e25',
    fontSize: 15,
    fontWeight: 'bold',
  },
});
