import { Ionicons } from '@expo/vector-icons';
import * as React from 'react';
import Colors from '../constants/Colors';


export default function TabBarIcon(props) {
  return (
    <Ionicons
      name={props.name}
      size={33}
      style={{ marginRight: -2, marginTop: 3 }}
      color={props.focused ? Colors.tabIconSelected : Colors.tabIconDefault}
    />
  );
}
