import { LinearGradient } from 'expo-linear-gradient';
import * as React from 'react';
import { Image, StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { StarsText } from '../components/StarsText';
import imageBase from '../constants/ImageEndpoint';
import AdjustLabel from './AdjustLabel';

export default function PlaceCard(props) {
  const place = props.place;
  const isResult = props.isResult;
  const result = props.result;
  const editing = props.editing;
  const editImageHandler = props.editImageHandler;

  function getOverlays() {
    return props.overlays || [];
  }
  console.log('HERE WE ARE', place.image);

  return (
    <View style={styles.container}>
      {
        place.image ?
          <Image
            resizeMode={'cover'}
            style={[styles.backgroundImage, { backgroundColor: place.image_color }, (props.rounded ? styles.rounded : null)]}
            source={{ uri: place.image ? place.image : imageBase + place.id }} /> :
          <Image
            style={[{ backgroundColor: place.image_color }, (props.rounded ? styles.rounded : null), styles.backgroundImage]}
            source={require('../assets/images/icon.png')} />
      }
      {editing &&
        <TouchableOpacity style={styles.editImageContainer} onPress={editImageHandler}>
          <Image style={[styles.editImageIcon, { opacity: 1.0 }]} source={require('../assets/images/editimage.png')} />
        </TouchableOpacity>
      }
      {/* <Image
        style={[(props.rounded ? styles.rounded : null), styles.overlayImage]}
        source={require('../assets/images/cardOverlay.png')} /> */}
      {isResult === true && <View style={styles.whiteOverlay}>
        <Text style={styles.favChoiceText}>FAV GROUP CHOICE!</Text>
        <Text style={styles.percentLike}>{result / 100}% Liked</Text>
      </View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    flexDirection: 'column',
    overflow: 'hidden',
    borderRadius: 30,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    borderColor: 'black',
    borderWidth: 2,
    borderRadius: 30,
    zIndex: 1,
  },
  overlayImage: {
    width: '100%',
    height: '50%',
    position: 'absolute',
    bottom: 0,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  editImageIcon: {
    width: 60,
    position: 'absolute',
    right: 0,
    height: 60,
    resizeMode: 'contain',
    margin: 15,
    zIndex: 100,
  },
  editImageContainer: {
    zIndex: 99
  },
  rounded: {
    borderWidth: 1,
    borderRadius: 20,
  },
  content: {
    width: '94%',
    // flexDirection: 'column',
    // flexWrap: 'wrap',
    // marginTop: '5%',
    marginLeft: '3%',
    marginRight: '3%',
    height: '30%',

    justifyContent: 'center',
    position: 'absolute',
    bottom: 0,
  },
  // renameTitleIcon: {
  //   width: 20,
  //   height: 20,
  //   resizeMode: 'contain',
  //   margin: 5,
  // },
  // stars: {
  //   fontSize: 20,
  //   fontWeight: 'bold',
  //   color: 'white',
  //   width: '90%',
  //   flexWrap: 'wrap',
  //   position: 'absolute',
  //   bottom: 5,
  // },
  // overlay: {
  //   backgroundColor: 'rgb(239, 139, 27)',
  //   opacity: 0.8,
  //   // marginTop: '75%',
  //   flexDirection: 'row',
  //   height: '30%',
  //   bottom: 0,
  //   width: '100%',
  //   position: 'absolute',
  // },
  whiteOverlay: {
    backgroundColor: '#fff',
    opacity: 0.8,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    top: 0,
    width: '100%',
    position: 'absolute'
  },
  favChoiceText: {
    textAlign: 'center',
    fontSize: 20,
    color: '#000',
    fontWeight: 'bold',
  },
  percentLike: {
    fontSize: 30,
    textAlign: 'center',
    color: '#000',
    fontWeight: 'bold',
  },
})