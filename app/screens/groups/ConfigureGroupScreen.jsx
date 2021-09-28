import * as React from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Alert, Image, FlatList, TextInput } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import { authHeader } from '../../auth';
import apiBase from '../../constants/Api';
import DeckIcon from '../../components/DeckIcon';
import { useEffect, useState } from "react";
import ChangableText from '../../components/ChangableText';
import { Ionicons } from '@expo/vector-icons';

export default function ConfigureGroupScreen(props) {

  const navigation = useNavigation();
  const route = useRoute();

  const [selectedDeck, setSelectedDeck] = useState(null);
  const [decks, setDecks] = useState([{ name: 'Templates' }, { name: 'Created By Me' }]);
  const [filteredDecks, setFilteredDecks] = useState(null);
  const [searchTextbox, setSearchTextbox] = useState('');
  const [deckSection, setDeckSection] = useState(0);
  const [groupName] = useState("New Decision Event");
  const [group, setGroup] = useState(route.params.group);

  useEffect(
    () => {
      navigation.setOptions({
        headerTitle: HeaderLabel({ decision_type: route.params.group.decision_type || 0, navigation: navigation }),
        headerTruncatedBackTitle: "",
      });

      if (searchTextbox == '') {
        setFilteredDecks(decks);
        return
      }
      var filteredDeckCategories = []
      decks.forEach(deckCategory => {
        const deckList = deckCategory.decks
        const filteredDeckList = deckList.filter(deck => {
          return deck?.name.toLowerCase().includes(searchTextbox.toLowerCase());
        })
        filteredDeckCategories.push(
          {
            name: deckCategory.name,
            decks: filteredDeckList
          }
        )
      });
      setFilteredDecks(filteredDeckCategories);
    },
    [searchTextbox, decks],
  );

  const save = async () => {
    try {
      if (!route.params.update) {
        navigation.push('EditDeck', { group, isCreate: true, });
      } else {
        if (!resp.data) {
          throw new Error("No response data from groups/new api call");
        } else {
          navigation.goBack();
        }
      }
    } catch (err) {
      Alert.alert("Error", "Unable to create group.");
      console.log('ERROR', err);
    }
  };

  useEffect(() => {
    if (selectedDeck) {
      save();
    }
  }, [selectedDeck]);

  useEffect(() => {
    refresh();
  }, []);

  const refresh = async () => {
    try {
      console.log('get');
      console.log(apiBase.apiBase + "deckList/type/" + route.params.group.decision_type);
      const response = await axios.get(apiBase.apiBase + "deckList/type/" + route.params.group.decision_type, { headers: await authHeader() });
      console.log("deck resp", response.data);
      setDecks(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  async function deleteDeck(deck) {
    await axios.post(apiBase.apiBase + "decks/" + deck.id + "/delete", {}, { headers: await authHeader() });
    refresh();
  }


  return (
    <View style={styles.contentContainer}>
      <View style={styles.searchBarContainer}>
        <TextInput style={styles.searchBox} value={searchTextbox} placeholder={' Search'} onChangeText={text => setSearchTextbox(text)} />
      </View>
      <View style={styles.deckCategoryFrame}>
        {
          decks && decks.map((deckType, index) => {
            return (
              <TouchableOpacity
                key={index}
                disabled={deckSection == index}
                onPress={() => setDeckSection(index)}
                style={[styles.deckCategory, deckSection == index && styles.deckCategorySelected]}>
                <Text style={[styles.deckCategoryText, deckSection == index && styles.deckCategoryTextSelected]}>{deckType.name}</Text>
              </TouchableOpacity>
            )
          })
        }
      </View>

      {
        filteredDecks && filteredDecks.map((deck, index) => {
          const deckData = deck;
          var deckList = deckData.decks;
          if (deckData?.showNewDeck) {
            deckList = [{}].concat(deckList);
          }
          // console.log(deckData);
          if (deckSection == index) {
            return (
              <View style={styles.deckLists} key={index}>
                <View style={styles.horizontalList}>
                  <FlatList
                    scrollEnabled={true}
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item, index) => "flatList-a-" + index}
                    contentContainerStyle={{ alignSelf: 'flex-start' }}
                    // horizontal={true}
                    numColumns={3}
                    data={deckList}
                    removeClippedSubviews={true} // Unmount components when outside of window
                    initialNumToRender={3} // Reduce initial render amount
                    maxToRenderPerBatch={1} // Reduce number in each render batch
                    updateCellsBatchingPeriod={100} // Increase time between renders
                    windowSize={7} // Reduce the window size

                    renderItem={({ item, index }) => {
                      if (deckData?.showNewDeck && index == 0) {
                        return (
                          <View style={[styles.deck, (selectedDeck != null && selectedDeck != "NEW" ? { opacity: 0.5 } : null)]}>
                            <TouchableOpacity onPress={() => setSelectedDeck("NEW")}>
                              <DeckIcon style={styles.deckIcon} newDeck />
                            </TouchableOpacity>
                          </View>)
                      } else {
                        const deck = deckData?.showNewDeck ? deckList[index] : item;
                        return (<View style={styles.deck}>
                          <TouchableOpacity onPress={() => setSelectedDeck(deck)}>
                            <DeckIcon style={styles.deckIcon} deck={deck} deletable={deckData?.showNewDeck} onDelete={() => deleteDeck(deck)} />
                          </TouchableOpacity>
                        </View>)
                      }
                    }}
                  />
                </View>
              </View>

            );
          }
        })
      }
    </View >
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    backgroundColor: 'white'
  },
  headerIconContainer: {
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  searchBarContainer: {
    marginHorizontal: 20,
    marginTop: 15,
    marginBottom: 5,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBox: {
    height: '100%',
    width: '100%',
    marginVertical: 5,
    marginHorizontal: 20,
    padding: 5,
    borderRadius: 5,
    backgroundColor: 'white',
    borderColor: 'black',
    borderWidth: 1,
  },
  deckCategoryFrame: {
    flexDirection: 'row',
    marginLeft: 20,
  },
  deckCategory: {
    marginRight: 20,
    paddingHorizontal: 5,
    paddingVertical: 5,
  },
  deckCategorySelected: {
    borderBottomWidth: 2,
    borderBottomColor: '#FF9B04',
  },
  deckCategoryText: {
    fontWeight: 'bold',
    color: '#000'
  },
  deckCategoryTextSelected: {
    color: '#FF9B04'
  },
  deckLists: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    flex: 1,
  },
  horizontalList: {
    flex: 1,
    alignItems: 'center',
  },
  deckHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20,
    marginTop: 5,//25,
  },
  deckTitle: {
    color: '#FF9B04',
    fontWeight: 'bold',
    fontSize: 20,
  },
  infoIcon: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
    marginLeft: 5
  },
  deck: {
    width: 100,
    height: 120,
    marginVertical: 10,
    marginHorizontal: 10,
  },
  deckIcon: {
    alignItems: 'center',
    height: 150,
    width: '100%'
  },
  footer: {
    flex: 1,
    paddingTop: 10
  },
});

function HeaderLabel({ decision_type, navigation }) {
  async function navigateInfoScreen(decision_type) {
    try {
      navigation.push('SelectDecisionType', { decision_type });
    } catch (err) {
      console.log(err);
      Alert.alert("Error navigating to infoScreen");
    }
  }
  // console.log("dec type", decision_type);
  const types = ['Swipe & Match', 'Poll', 'Scheduling'];
  console.log(decision_type);
  return (<View style={styles.deckHeader}>
    <Text style={styles.deckTitle}>{types[decision_type]}</Text>
    <TouchableOpacity onPress={() => navigateInfoScreen(decision_type)}>
      <Image style={styles.infoIcon} source={require('../../assets/images/info.png')} />
    </TouchableOpacity>
  </View>);
}