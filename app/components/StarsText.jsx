import * as React from 'react';
import { Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export function StarsText(props) {
  const place = props.place;
  if (place.rating) {
    const rating = Math.round(place.rating * 2) / 2;
    var icons = [];
    for (var i = 0; i < rating - 1; i++) {
      icons.push(<Ionicons style={styles.star} name="md-star" color="white"></Ionicons>);
    }
    if (rating * 10 % 10 == 0) {
      icons.push(<Ionicons style={styles.star} name="md-star" color="white"></Ionicons>);
    } else {
      icons.push(<Ionicons style={styles.star} name="md-star-half" color="white"></Ionicons>);
    }
    return (<Text>{icons}</Text>);
  }
  return null;
}


const styles = StyleSheet.create({
  star: {
    fontSize: 20,
  },
})