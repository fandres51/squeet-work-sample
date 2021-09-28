import * as React from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import ModalDropdown from 'react-native-modal-dropdown';
import apiBase from '../constants/Api';
import axios from 'axios';

export default function GroupIcon(props) {

  async function duplicateGroup() {
    alert('To implement...');
  }

  return (
    <View style={[styles.frame, props.style]}>
      {props.group &&
        <View style={styles.horizontal}>
          <View>
            {
              <Image
                style={styles.image}
                source={props.group.image
                  ? { uri: props.group.image }
                  : require('../assets/images/icon.png')}
              />
            }
          </View>
          <View style={styles.textContent}>
            <Text minimumFontScale={0.3} adjustsFontSizeToFit style={styles.groupLabel}>{props.group.name}</Text>
          </View>
          {
            props.group.unread != null && props.group.unread > 0 &&
            <View style={styles.alert}>
              <Text style={styles.alertText}>{props.group.unread}</Text>
            </View>
          }
          <View style={styles.dots}>
            <ModalDropdown
              options={['Duplicate Event', 'Delete Event']}
              dropdownStyle={{ height: 72 }}
              dropdownTextStyle={{ color: 'black' }}
              onSelect={(index, value) => value === 'Delete Event' ? props.deleteGroup(props.group) : duplicateGroup()}>
              <Entypo name="dots-three-horizontal" size={24} color="black" />
            </ModalDropdown>
          </View>
          {
            props.group.admin &&
            <View style={styles.owner}>
              <Image style={{ width: 16, height: 16, resizeMode: 'stretch' }} source={require('../assets/images/admin.png')} />
              <Text minimumFontScale={0.3} adjustsFontSizeToFit style={styles.adminLabel}>Owner</Text>
            </View>
          }
        </View>
      }
    </View>
  );
};

const styles = StyleSheet.create({
  frame: {
    borderColor: '#c0c0c0',
    borderBottomWidth: 0.5,
  },
  horizontal: {
    flexDirection: 'row'
  },
  textContent: {
    flex: 4,
    paddingHorizontal: 20,
    justifyContent:'center',
  },
  groupLabel: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'left',
    maxHeight: '100%',
    // paddingLeft: 5,
    // paddingRight: 5,
    marginTop: 4,
  },
  owner: {
    flexDirection: 'row',
    position: 'absolute',
    right: 15,
    bottom: 3
  },
  adminLabel: {
    color: '#D3973E',
    marginRight: 10,
    marginLeft: 5,
    fontSize: 12,
    // paddingTop: 10
  },
  image: {
    backgroundColor: '#bbb',
    height: 80,
    marginTop: '20%',
    width: 80,
    marginLeft: -30,
    borderRadius: 10,
    justifyContent: 'center'
  },
  alert: {
    backgroundColor: 'red',
    height: 20,
    width: 30,
    borderRadius: 10,
    alignSelf: 'center',
    marginRight: 30,
    paddingTop: 1
  },
  alertText: {
    color: 'white',
    textAlign: 'center',
    textAlignVertical: 'center'
  },
  bellIcon: {
    alignSelf: 'center',
  },
  dots: {
    height: '100%',
    justifyContent: 'center',
    flex: 1,
  }
});