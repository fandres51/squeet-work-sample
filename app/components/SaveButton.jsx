import { Ionicons } from '@expo/vector-icons';
import * as React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function SaveButton(props) {
  return (
    <TouchableOpacity onPress={props.onPress} style={styles.appButtonContainer}>
      <View style={styles.container}>
        <Text style={styles.saveButtonText}>SAVE</Text>
        <Ionicons
          name="md-bookmark"
          size={19}
          style={styles.icon}
          color="#3ec94a"
        />
        </View>
  </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: 100,
    paddingLeft: 8
  },
  saveButton: {

  },
  saveButtonText: {
    fontWeight: 'bold',
    color: '#A6A6A6',
  },
  icon: {
    paddingLeft: 5,
    color: '#FF9405',
    // paddingStart:
  }
})