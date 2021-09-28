import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import * as React from 'react';
import { StyleSheet, Image } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack';
import TabBarIcon from '../components/TabBarIcon';
import FriendScreen from '../screens/friends/FriendScreen';
import SettingsScreen from '../screens/settings/SettingsScreen';
import GroupSwipeScreen from '../screens/groups/swipe/GroupSwipeScreen';
import GroupListScreen from '../screens/groups/GroupListScreen';
import GroupResultScreen from '../screens/groups/swipe/GroupResultScreen';
import ConfigureGroupScreen from '../screens/groups/ConfigureGroupScreen';
import groupInfoScreen from '../screens/groups/groupInfoScreen';
import AddCardScreen from '../screens/groups/swipe/AddCardScreen';
import EditCardScreen from '../screens/groups/swipe/EditCardScreen';
import GroupMembersScreen from '../screens/groups/GroupMembersScreen';
import AddGroupMembersScreen from '../screens/groups/AddGroupMembersScreen';
import EditDeckScreen from '../screens/groups/swipe/EditDeckScreen';
import PollScreen from '../screens/groups/poll/PollScreen';
import SelectDecisionTypeScreen from '../screens/groups/SelectDecisionTypeScreen';
import PollResultsScreen from '../screens/groups/poll/PollResultsScreen';
import VotesScreen from '../screens/groups/swipe/VotesScreen';
import GroupSettings from '../screens/groups/GroupSettings';
import CommentsScreen from '../screens/groups/swipe/CommentsScreen';

const StackNav = createStackNavigator();
const Drawer = createDrawerNavigator();
const INITIAL_ROUTE_NAME = 'groups';

export default function DrawerNavigator({ navigation, route, update }) {

  navigation.setOptions({ headerShown: false });

  return (
    <Drawer.Navigator
      initialRouteName={INITIAL_ROUTE_NAME}
      drawerStyle={styles.drawer}
      sceneContainerStyle={styles.drawerScene}
      overlayColor="transparent"
      drawerContentOptions={{
        activeTintColor: '#381313',
        inactiveTintColor: '#fff',
        itemStyle: { marginLeft: 0, marginRight: 0, color: 'red' },
      }}
      screenProps={{ update: { update } }}
    >
      <Drawer.Screen
        name="groups"
        component={GroupRoot}
        options={{
          title: 'Events',
          drawerIcon: ({ focused }) => <Image style={{ width: 30, height: 30, tintColor: (focused ? '#fff' : '#555') }} focused={focused} source={require('../assets/images/group.png')} />,
        }}
      />
      <Drawer.Screen
        name="friends"
        component={FriendRoot}
        options={{
          title: 'Contacts',
          drawerIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-people" />,
        }}
      />
      <Drawer.Screen
        name="settings"
        component={SettingsRoot}
        options={{
          title: 'Settings',
          drawerIcon: ({ focused }) => <TabBarIcon focused={focused} tintColor="white" name="md-cog" update={update} />,
        }}
      />
    </Drawer.Navigator>
  );
}

export function FriendRoot({ navigation, route }) {
  return (
    <StackNav.Navigator initialRouteName="Contacts" screenOptions={{ headerShown: false }}>
      <StackNav.Screen
        name="Contacts"
        component={FriendScreen}
        options={{ title: 'Contacts', headerShown: true, headerStyle: styles.headerStyle, headerTintColor: '#FF9405' }}
      />
    </StackNav.Navigator>
  );
}

export function GroupRoot({ navigation, route }) {
  return (
    <StackNav.Navigator initialRouteName="Group">
      <StackNav.Screen
        name="Group"
        component={GroupListScreen}
        options={{ title: 'Decision Events', headerStyle: styles.headerStyle, headerTintColor: '#FF9405' }}
      />
      <StackNav.Screen
        name="ConfigureGroup"
        component={ConfigureGroupScreen}
        options={{ title: 'Select Decision Options', headerStyle: styles.headerStyle, headerTintColor: '#FF9405', headerTitleStyle: { color: 'black' } }}
      />
      <StackNav.Screen
        name="infoScreen"
        component={groupInfoScreen}
        options={{ title: 'Info About Decision Tools', headerStyle: styles.headerStyle, headerTintColor: '#FF9405', headerTitleStyle: { color: 'black' } }}
      />
      <StackNav.Screen
        name="GroupDeck"
        component={GroupSwipeScreen}
        options={{ title: 'Group Swipe', headerStyle: styles.headerStyle, headerTintColor: '#FF9405', headerTitleStyle: { color: 'black' } }}
      />
      <StackNav.Screen
        name="EditDeck"
        component={EditDeckScreen}
        options={{ title: 'Edit Choices', headerStyle: styles.headerStyle, headerTintColor: '#FF9405', headerTitleStyle: { color: 'black' } }}
      />
      <StackNav.Screen
        name="GroupResult"
        component={GroupResultScreen}
        options={{ title: 'Group Result', headerStyle: styles.headerStyle, headerTintColor: '#FF9405', headerTitleStyle: { color: 'black' } }}
      />
      <StackNav.Screen
        name="PollResult"
        component={PollResultsScreen}
        options={{ title: 'Poll Result', headerStyle: styles.headerStyle, headerTintColor: '#FF9405', headerTitleStyle: { color: 'black' } }}
      />
      <StackNav.Screen
        name="PollScreen"
        component={PollScreen}
        options={{ title: 'Poll', headerStyle: styles.headerStyle, headerTintColor: '#FF9405', headerTitleStyle: { color: 'black' } }}
      />
      <StackNav.Screen
        name="Votes"
        component={VotesScreen}
        options={{ title: 'Votes', headerStyle: styles.headerStyle, headerTintColor: '#FF9405', headerTitleStyle: { color: 'black' } }}
      />
      <StackNav.Screen
        name="AddCard"
        component={AddCardScreen}
        options={{ title: 'Add Card', headerStyle: styles.headerStyle, headerTintColor: '#FF9405', headerTitleStyle: { color: 'black' } }}
      />
      <StackNav.Screen
        name="EditCard"
        component={EditCardScreen}
        options={{ title: 'Edit Card', headerStyle: styles.headerStyle, headerTintColor: '#FF9405', headerTitleStyle: { color: 'black' } }}
      />
      <StackNav.Screen
        name="GroupMembers"
        component={GroupMembersScreen}
        options={{ title: 'Group Members', headerStyle: styles.headerStyle, headerTintColor: '#FF9405', headerTitleStyle: { color: 'black' } }}
      />
      <StackNav.Screen
        name="AddGroupMembers"
        component={AddGroupMembersScreen}
        options={{ title: 'Add Group Members', headerStyle: styles.headerStyle, headerTintColor: '#FF9405', headerTitleStyle: { color: 'black' } }}
      />
      <StackNav.Screen
        name="SelectDecisionType"
        component={SelectDecisionTypeScreen}
        options={{ title: 'Select Decision Tool', headerStyle: styles.headerStyle, headerTintColor: '#FF9405', headerTitleStyle: { color: 'black' } }}
      />
      <StackNav.Screen
        name="GroupSettings"
        component={GroupSettings}
        options={{ title: 'Settings', headerStyle: styles.headerStyle, headerTintColor: '#FF9405', headerTitleStyle: { color: 'black' } }}
      />
      <StackNav.Screen
        name="Comments"
        component={CommentsScreen}
        options={{ title: 'Comments', headerStyle: styles.headerStyle, headerTintColor: '#FF9405', headerTitleStyle: { color: 'black' } }}
      />
    </StackNav.Navigator>
  );
}

export function SettingsRoot({ navigation, route }) {
  return (
    <StackNav.Navigator initialRouteName="Settings">
      <StackNav.Screen
        name="Setttings"
        component={SettingsScreen}
        options={{ title: 'Settings', headerStyle: styles.headerStyle, headerTintColor: '#FF9405' }}
      />
    </StackNav.Navigator>
  );
}

const styles = StyleSheet.create({
  drawer: {
    width: '65%',
    backgroundColor: 'rgb(255, 149, 0)',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    // height: 200,
    // marginLeft: 20,
    // marginTop: 30,
    shadowOpacity: 0,
    shadowOpacity: 0.2,
    shadowRadius: 8.22,

    elevation: 3,
  },
  sceneContainerStyle: {

  }
})