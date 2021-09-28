import * as React from 'react';
import { Image, View, StyleSheet, Text, Alert, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AdjustLabel from './AdjustLabel';


export default function DeckIcon(props) {
  function deletePrompt() {
    console.log(11111);



    Alert.alert(
      "Confirm delete",
      "Are you sure you would like to delete your deck named '" + props.deck.name + "'?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => props.onDelete(),
          style: "destructive",
        },
      ],
      {
        cancelable: true,
        onDismiss: () =>
          Alert.alert(
            "This alert was dismissed by tapping outside of the alert dialog."
          ),
      }
    );
  }
  return (
    <View style={[styles.cardStyle, props.style]}>
      {props.deck &&
        <View style={styles.fullSize}>
          {
            props.deck.image &&
            <Image style={styles.fullSize} borderRadius={5} resizeMode="stretch" source={{ uri: props.deck.image }} />
          }
          {
            !props.deck.image &&
            <Image style={[styles.fullSize, { position: 'absolute', bottom: 10 }]} resizeMode="stretch" borderRadius={5} resizeMode="center" source={require('../assets/mainIcon.png')} />
          }
          <View style={styles.overlay} />
          <Text minimumFontScale={0.2} adjustsFontSizeToFit style={styles.deckLabel}>{props.deck.name}</Text>
          {
            props.deletable && (
              <TouchableOpacity style={styles.trash} onPress={deletePrompt}>
                <Image style={{ width: 10, height: 25, aspectRatio: 0.9 }} resizeMode='contain' source={require('../assets/images/trash.png')} />
              </TouchableOpacity>
            )
          }
          {
            props.comingSoon &&
            <>
              <View style={styles.comingSoon} />
              <Text style={styles.comingSoonText}>Coming Soon</Text>
            </>
          }
        </View>
      }
      {props.newDeck &&
        <View style={[styles.newDeck, styles.fullSize]}>
          <Ionicons name="md-add" size={80} color="#FF9B04" />
          <Text style={styles.newLabel}>Create New</Text>
        </View>
      }
    </View>
  );
};

const styles = StyleSheet.create({
  cardStyle: {
    // borderWidth: 2,
    // borderColor: 'orange',
    borderRadius: 5,
    overflow: 'hidden',
    width: 100,
    height: 120
  },
  fullSize: {
    width: 100,
    height: 120
  },
  newDeck: {
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'black',
    borderWidth: 2,
    borderRadius: 5,
  },
  newLabel: {
    marginTop: -10,
    fontSize: 15,
    fontWeight: 'bold'
  },
  deckLabel: {
    fontSize: 10,
    fontWeight: '600',
    paddingLeft: 5,
    paddingRight: 5,
    color: 'white',
    position: 'absolute',
    top: 0,
    // bottom: 10,
    opacity: 1.0,
    marginTop: '90%'
  },
  overlay: {
    backgroundColor: 'rgb(239, 139, 46)',
    opacity: 0.6,
    marginTop: '90%',
    width: '100%',
    height: '25%',
    position: 'absolute',
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5
  },
  comingSoon: {
    backgroundColor: 'black',
    opacity: 0.6,
    width: '100%',
    height: '100%',
    position: 'absolute',
    elevation: 5,
    alignItems: 'center'
  },
  comingSoonText: {
    fontWeight: 'bold',
    color: 'white',
    alignItems: 'center',
    textAlign: 'center',
    zIndex: 10000,
    elevation: 10000,
    fontSize: 24,
    paddingTop: '25%'
  },
  trash: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 5,
    // width: 25,
    // height: 25
    // marginTop: '85%',
    // height: '10%',
    // width: '100%'
  }
});