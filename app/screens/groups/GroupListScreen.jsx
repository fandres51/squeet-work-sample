import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import * as React from 'react';
import { StyleSheet, TouchableOpacity, View, ScrollView, SectionList, Alert, Text, Image } from 'react-native';
import { authHeader } from '../../auth';
import apiBase from '../../constants/Api';
import axios from 'axios';
import GroupIcon from '../../components/GroupIcon';
import Dialog from "react-native-dialog";
import * as Linking from 'expo-linking';

export default function GroupListScreen(props) {
  const navigation = useNavigation();
  const [groups, setGroups] = React.useState([]);
  const [disableLoading, setDisableLoading] = React.useState(false);
  const [editing, setEditing] = React.useState(false);
  const [groupJoinVisible, setGroupJoinVisible] = React.useState(false);
  const [groupCode, setGroupCode] = React.useState('');
  const [friendCode, setFriendCode] = React.useState(null);
  const [shouldHandleLink, setShouldHandleLink] = React.useState(false);

  const route = useRoute();

  React.useEffect(() => {
    refreshGroupList();
    Linking.addEventListener('url', handleLink);
    Linking.getInitialURL().then((url) => handleLink({ url }));
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      (async function () {
        refreshGroupList();
      }());
    }, [])
  );

  async function deleteGroup(group) {
    try {
      await axios.post(apiBase.apiBase + 'groups/' + group.id + '/delete', {}, { headers: await authHeader() });
      refreshGroupList();
    } catch (err) {
      console.log(err);
      Alert.alert("Error deleting this group");
    }
  }

  const refreshGroupList = async () => {
    try {
      const response = await axios.get(apiBase.apiBase + "groups", { headers: await authHeader() });
      console.log(response.data);
      setGroups(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  async function selectGroup(group) {
    if (editing) {
      return;
    }
    try {
      const response = await axios.get(apiBase.apiBase + "groups/" + group.id + "/cards", { headers: await authHeader() });
      if (!group.deck_id) {
        Alert.alert("Group has no deck assigned.");
        return;
      }
      console.log("group is", group);
      if (!group?.decision_type) {
        if (response.data && response.data.swipedCards.length > 0 && response.data.filteredCards.length == 0)
          navigation.navigate('GroupResult', { group: group, nameUpdated: refreshGroupList });
        else
          navigation.navigate('GroupDeck', { group: group, nameUpdated: refreshGroupList });

      } else if (group.decision_type === 1) {
        if (response.data && response.data.swipedCards.length > 0 && response.data.filteredCards.length == 0)
          navigation.navigate('PollResult', { group: group, nameUpdated: refreshGroupList });
        else
          navigation.navigate('PollScreen', { group: group, nameUpdated: refreshGroupList });

      }
    } catch (err) {
      console.log(err);
      Alert.alert("Group has no deck assigned");
    }
  }

  function toggleEdit() {
    setEditing(!editing);
  }

  async function handleJoin(silent) {
    try {
      const resp = await axios.post(apiBase.apiBase + "groups/join", { groupCode, friendCode }, { headers: await authHeader() });
      if (!resp.data) {
        if (!silent) {
          Alert.alert("Error", "Unable to join this group! Did you enter the right code?");
        }
      } else {
        Alert.alert("Added", "You've joined " + resp.data.name + "!",
          [
            { text: "OK", onPress: () => setGroupJoinVisible(false) }
          ]);
      }
      await refreshGroupList();
      return resp.data;
    } catch (err) {
      if (!silent) {
        Alert.alert("Error", "Unable to join this group! Did you enter the right code?");
      }
      console.log(err);
    }
  }

  async function handleLink(event) {
    let { path, queryParams } = Linking.parse(event.url);
    if (path == "Group") {
      if (queryParams.joinGroup || queryParams.addFriend) {
        // console.log("got it", queryParams);
        setShouldHandleLink(true);
        if (queryParams.addFriend) {
          setFriendCode(queryParams.addFriend);
        }
        if (queryParams.joinGroup) {
          setGroupCode(queryParams.joinGroup);
        }
      }
    }
  }

  React.useEffect(function () {
    if (shouldHandleLink) {
      setShouldHandleLink(false);
      handleJoin(true);
    }
  }, [groupCode]);

  React.useLayoutEffect(() => {
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
  });

  return (
    <View style={styles.container}>
      <Dialog.Container visible={groupJoinVisible}>
        <Dialog.Title>Join a group</Dialog.Title>
        <Dialog.Description>
          Enter six character group code to join!
          You can also join groups with a link.
          </Dialog.Description>
        <Dialog.Input
          textContentType="none"
          autoCapitalize='none'
          selectionColor="#FF9405"
          placeholder="group join code" placeholderTextColor="#A6A6A6" style={styles.input} onChangeText={text => setGroupCode(text)} value={groupCode} />
        <Dialog.Button label="Cancel" color="grey" onPress={() => setGroupJoinVisible(false)} />
        <Dialog.Button label="Add" bold color="#FF9704" onPress={handleJoin} />
      </Dialog.Container>
      <ScrollView>
        <View style={styles.contentContainer}>
          <SectionList
            contentContainerStyle={{ alignSelf: 'flex-start', width: '100%' }}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            sections={[{ id: 0, data: [{ id: 0 }, { id: 1 }] }, { id: 1, data: groups }]}
            SectionSeparatorComponent={({ leadingSection, trailingSection }) =>
              <View style={(!(leadingSection || trailingSection) && {
                backgroundColor: 'gray',
                height: 20
              })} />
            }
            renderItem={({ item, index, section }) => {
              // console.log(section);
              if (section.id == 0) {
                if (index == 0) {
                  return (
                    <TouchableOpacity onPress={() => { navigation.navigate('SelectDecisionType', { refresh: refreshGroupList, creatable: true }) }}>
                      <View style={styles.newGroup}>
                        <Ionicons name="md-add" size={30} color="#4b85c5" />
                        <Text style={styles.actionLabel}>Create new decision event</Text>
                      </View>
                    </TouchableOpacity>)
                }
                // if (index == 1) {
                //   return (
                //     <TouchableOpacity onPress={() => setGroupJoinVisible(true)}>
                //       <View style={styles.newGroup}>
                //         <Image style={{ width: 24, height: 24, resizeMode: 'stretch' }} source={require('../../assets/images/groupjoin.png')} />
                //         <Text style={styles.actionLabel}>Join decision event</Text>
                //       </View>
                //     </TouchableOpacity>)
                // }
              } else if (section.id == 1) {
                const group = item;
                return (
                  <View style={styles.deck}>
                    <TouchableOpacity disabled={disableLoading} onPress={() => selectGroup(group)}>
                      <GroupIcon style={[styles.deckIcon, { opacity: (disableLoading ? 0.5 : 1.0) }]} group={group} deleteGroup={deleteGroup} />
                    </TouchableOpacity>
                  </View>
                )
              }
            }}
          />
        </View>
      </ScrollView>
    </View>);
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    width: '100%'
  },
  deck: {
    marginLeft: 40
  },
  deckIcon: {
    height: 100
  },
  overlay: {
    flex: 1,
    position: 'absolute',
    left: '44%',
    top: '30%',
    width: 55,
    height: 55,
    paddingLeft: 8,
    paddingTop: 6,
    backgroundColor: 'white',
    textAlign: 'center',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 115
  },
  newGroup: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderColor: '#c0c0c0',
  },
  actionLabel: {
    fontSize: 19,
    paddingLeft: 10,
    color: '#4b85c5',
    fontWeight: 'bold'
  }
});