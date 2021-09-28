import * as React from 'react';
import { Image, StyleSheet, Text, View, AsyncStorage, Alert } from 'react-native';
import PlaceCard from './PlaceCard';
import LastCard from './LastCard';
import ZeroCardsCard from './ZeroCardsCard';
import Swiper from 'react-native-deck-swiper';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { authHeader } from '../auth';
import apiBase from '../constants/Api';
import AddCardModal from '../components/AddCardModal';
import PreferencesContext from '../contexts/PreferencesContext';
import { Platform } from 'react-native'

export default function SqueetSwiper(props) {
  const places = props.places;
  const navigation = useNavigation();

  const [index, setIndex] = React.useState(0);
  const [resets, setResets] = React.useState(0);
  let swiperRef;
  const [addCardShown, setAddCardShown] = React.useState(null);

  likePlace = async (place) => {
    window.analytics.track('like');
    if (place.type == 'M') {
      window.analytics.track('melon_like');
      Linking.openURL("https://www.trymelon.com/dailymenu");
      return;
    }
    try {
      const resp = await axios.post(apiBase.apiBase + "decks/" + props.deck.id + "/like", { place_id: place.id }, { headers: await authHeader() });
      if (resp.data.length > 0) {
        Alert.alert("It's a match!", resp.data[0] + " also liked this card!");
      } else {
        const userSwipes = await updateSwipeCounter();
        if (userSwipes % 50 == 3) {
          Haptics.notificationAsync(Haptics.Success);
          Alert.alert("Swipe with friends!", "Add your friends to see which places they have liked!");
        }
        if (userSwipes % 100 == 20 && !(await AsyncStorage.getItem('hasRated'))) {
          Haptics.notificationAsync(Haptics.Success);
          await AsyncStorage.setItem('hasRated', true);
          StoreReview.requestReview();
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  dislikePlace = async (place) => {
    window.analytics.track('dislike');
    try {
      await axios.post(apiBase.apiBase + "decks/" + props.deck.id + "/dislike", { place_id: place.id }, { headers: await authHeader() });
      await updateSwipeCounter();
    } catch (err) {
      console.log(err);
    }
  };

  updateSwipeCounter = async () => {
    const userSwipes = parseInt(await AsyncStorage.getItem('userSwipes'));
    if (!userSwipes) {
      await AsyncStorage.setItem("userSwipes", '1');
      return 0;
    } else {
      await AsyncStorage.setItem("userSwipes", (userSwipes + 1) + '');
      return userSwipes;
    }
  };
  const context = React.useContext(PreferencesContext);

  function addPlace(place) {
    if (context.places) {
      context.setPlaces(
        context.places.slice(0, index)
          .concat([place]
            .concat(context.places.slice(index, context.places.length))));
    } else {
      context.setPlaces([place]);
    }
  }
  // loadPlaces = async () => {
  //   try {
  //     const response = await axios.get(apiBase.apiBase + "match/getPlaces", { headers: await authHeader() });
  //     // console.log(response.data.length)
  //     this.setState({ places: response.data })
  //   } catch (err) {
  //     console.log(err)
  //   }
  // };
  console.log('PLACES', places);
  return (
    <View>
      <View style={styles.swipe}>
        <AddCardModal isVisible={addCardShown} deck={props.deck} setIsVisible={setAddCardShown} addPlace={addPlace} />
        <View style={styles.swipeContainer}>
          {props.deck && places &&
            <Swiper
              swipeBackCard
              key={"swiper" + resets}
              cards={places.concat([{ last: true }])}
              ref={(swiper) => {
                swiperRef = swiper;
              }}
              onSwipedLeft={(index) => dislikePlace(places[index])}
              onSwipedRight={(index) => likePlace(places[index])}
              onSwipedAll={() => setResets(resets + 1)}
              useNativeDriver
              cardIndex={index}
              showSecondCard
              renderCard={(card) => {
                if (places.length == 0) {
                  return <ZeroCardsCard />
                }
                if (card == null) {
                  setResets(resets + 1);
                } else if (card.last) {
                  return (<View style={styles.card}>
                    <LastCard reset={() => setResets(resets + 1)} navigation={navigation} place={card} />
                  </View>)
                } else {
                  return (<View style={styles.card}>
                    <PlaceCard navigation={navigation} place={card} />
                  </View>)
                }
              }}
              backgroundColor={'#fff'}
              // horizontalSwipe={this.state.swipeEnabled}
              verticalSwipe={false}
              stackSize={2}
              useViewOverflow={Platform.OS === 'ios'}
            >
            </Swiper>
          }
          {
            !places &&
            <View><Text style={{ textAlign: 'center', textAlignVertical: 'center' }}>Loading places...</Text></View>
          }
        </View>
        <View style={[styles.actions/*, { display: !this.state.swipeEnabled }*/]}>
          <TouchableOpacity disabled={places === null || places.length == 0} onPress={() => swiperRef.swipeLeft()}>
            <Image style={[styles.markImage, { opacity: (places === null || places.length == 0 ? 0.4 : 1.0) }]} source={require('../assets/images/SwiperActionIcons/dislike.png')} />
          </TouchableOpacity>
          <TouchableOpacity disabled={places === null || places.length == 0} onPress={() => swiperRef.swipeBack()}>
            <Image style={[styles.markImage, styles.secondary, { opacity: (places === null || places.length == 0 ? 0.4 : 1.0) }]} source={require('../assets/images/SwiperActionIcons/back.png')} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Decks')}>
            <Image style={[styles.markImage, styles.secondary, styles.middle]} source={require('../assets/images/SwiperActionIcons/deckstack.png')} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setAddCardShown(true)}>
            <Image style={[styles.markImage, styles.secondary,]} source={require('../assets/images/SwiperActionIcons/add.png')} />
          </TouchableOpacity>
          <TouchableOpacity disabled={places === null || places.length == 0} onPress={() => swiperRef.swipeRight()}>
            <Image style={[styles.markImage, { opacity: (places === null || places.length == 0 ? 0.4 : 1.0) }]} source={require('../assets/images/SwiperActionIcons/like.png')} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  swipe: {
    height: '80%',
    // width: '100%'
  },
  card: {
    // height: "100%",
    width: '100%',
    zIndex: 1
  },
  cardText: {
    // marginTop: 50,
    textAlign: 'center'
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    // marginTop: '45%',
  },
  content: {
    height: "100%"
  },
  swipeContainer: {
    //   backgroundColor: 'red',
    //   // position: 'absolute',
    height: '135%'
  },
  navImage: {
    width: 30,
    height: 30,
    resizeMode: 'contain'
  },
  markImage: {
    width: 60,
    height: 60,
    resizeMode: 'contain'
  },
  secondary: {
    width: 40,
    height: 40,
    marginTop: 10
  },
  middle: {
    width: 50,
    height: 50,
    marginTop: 5,
  }
})



