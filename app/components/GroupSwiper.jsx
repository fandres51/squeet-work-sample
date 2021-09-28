import * as React from 'react';
import { Image, StyleSheet, Text, View, AsyncStorage, Alert } from 'react-native';
import Card from './Card';
import ZeroCardsCard from './ZeroCardsCard';
import Swiper from 'react-native-deck-swiper';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import { authHeader } from '../auth';
import apiBase from '../constants/Api';
import { Platform } from 'react-native';

export default function GroupSwiper(props) {
  const group = props.group;
  const navigation = useNavigation();

  const [cards, setCards] = React.useState([]);
  const [index, setIndex] = React.useState(0);
  const [resets, setResets] = React.useState(0);
  let swiperRef;
  const [addCardShown, setAddCardShown] = React.useState(null);
  const [countRemaining, setCountRemaining] = React.useState(0);
  const [swipeAgainShowed, setSwipeAgainShowed] = React.useState(false);
  const [hasLoaded, setHasLoaded] = React.useState(false);
  const [cardIndex, setCardIndex] = React.useState(0);
  const [swipeEnabled, setSwipeEnabled] = React.useState(true);

  useFocusEffect(
    React.useCallback(() => {
      (async function () {
        loadCards();
      }());
    }, [])
  );

  const likeCard = async (card) => {
    window.analytics.track('like');
    try {
      const resp = await axios.post(apiBase.apiBase + "groups/" + group.id + "/like", { card_id: card.id }, { headers: await authHeader() });
      if (resp.data.length > 0) {
        Alert.alert("It's a match!", resp.data[0] + " also liked this card!");
      } else {
        const userSwipes = await updateSwipeCounter();
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

  const dislikeCard = async (card) => {
    window.analytics.track('dislike');
    try {
      await axios.post(apiBase.apiBase + "groups/" + group.id + "/dislike", { card_id: card.id }, { headers: await authHeader() });
      await updateSwipeCounter();
    } catch (err) {
      console.log(err);
    }
  };

  const updateSwipeCounter = async () => {
    const userSwipes = parseInt(await AsyncStorage.getItem('userSwipes'));
    if (!userSwipes) {
      await AsyncStorage.setItem("userSwipes", '1');
      return 0;
    } else {
      await AsyncStorage.setItem("userSwipes", (userSwipes + 1) + '');
      return userSwipes;
    }
  };

  function addCard(card) {
    if (cards) {
      setCards(
        cards.slice(0, index)
          .concat([card]
            .concat(cards.slice(index, cards.length))));
    } else {
      setCards([card]);
    }
  }

  React.useEffect(
    () => {
      setCountRemaining(cards.length - index - 1);
    },
    [cards, index]
  );

  var prev = 0;
  const loadCards = async () => {
    try {
      setCardIndex(0);
      const response = await axios.get(apiBase.apiBase + "groups/" + group.id + "/cards", { headers: await authHeader() });
      // console.log(response.data.length)
      if (response.data && response.data.filteredCards) {
        // console.log(response.data);
        console.log('THE DECK\'S CARDS', response.data);
        setCards(response.data.filteredCards);
      }
      // console.log(response.data);
      if (response.data && response.data.swipedCards.length > 0 && response.data.filteredCards.length == 0)
        setCards(response.data.swipedCards);
      // Alert.alert("Swipe again", "You've already swiped on some of these cards, but you can keep swiping if you change your mind!");
      // setSwipeAgainShowed(true);
      setHasLoaded(true);
      setCardIndex(1);
      setSwipeEnabled(response.data.filteredCards.length > 0);

    } catch (err) {
      console.log(err);
    }
  };

  // React.useEffect(() => { loadCards(); }, []);

  return (
    <View style={styles.container}>
      <View style={styles.swipeContainer}>
        {group != null && cards != null &&
          <Swiper
            swipeBackCard
            key={"swiper" + resets}
            cards={cards.map((card, i, arr) => {
              if (arr.length === i) {
                card.last = true
              }
              return card;
            })}
            ref={(swiper) => {
              swiperRef = swiper;
            }}
            onSwipedLeft={(index) => dislikeCard(cards[index])}
            onSwipedRight={(index) => likeCard(cards[index])}
            onSwipedAll={() => { setResets(resets + 1); setIndex(0); navigation.navigate('GroupResult', { group }) }}
            onSwiped={(index) => setIndex(index + 1)}
            useNativeDriver
            cardIndex={cardIndex}
            showSecondCard={true}
            renderCard={(card) => {
              if (cards.length == 0) {
                if (hasLoaded) {
                  return (<View style={[styles.card, { backgroundColor: 'white' }]}>
                    <Text style={{ fontWeight: '800', fontSize: 28, marginTop: 40 }}>This deck is empty!</Text>
                    <Text style={{ fontSize: 16, textAlign: 'center' }}>
                      Once you add cards to your deck, people can swipe left or right to decide on each card. Just share your decision event's link with them.
                    </Text>
                    <View style={{ marginTop: 20, height: 50, backgroundColor: 'green', width: '90%', borderRadius: 5, paddingTop: 15 }}>
                      <TouchableOpacity style={{ height: '100%' }} onPress={() => navigation.navigate('EditDeck', { group })}>
                        <Text style={{ color: 'white', height: '100%', fontWeight: '600', textAlign: 'center', justifyContent: 'center' }}>Start adding cards</Text>
                      </TouchableOpacity>
                    </View>
                  </View>);
                } else {
                  return (<View style={[styles.card, { backgroundColor: 'white' }]}>
                    <Text style={{ fontWeight: '800', fontSize: 28, marginTop: 40 }}>Loading...</Text>
                  </View>);
                }
              }
              if (card == null) {
                setResets(resets + 1);
              } else if (card.last) {
                return (<View style={styles.zeroCard}>
                  <ZeroCardsCard />
                </View>)
              } else {
                return (<View style={styles.card}>
                  <Card card={card} group={group} isResult="false" />
                </View>)
              }
            }}
            horizontalSwipe={swipeEnabled}
            verticalSwipe={false}
            stackSize={3}
            useViewOverflow={Platform.OS === 'ios'}
            backgroundColor={'#fff'}
            cardVerticalMargin={0}
            marginBottom={0}
          />
        }
        {
          !cards &&
          <View><Text style={{ textAlign: 'center', textAlignVertical: 'center' }}>Loading cards...</Text></View>
        }
      </View>
      {
        cards?.length > 0 && (index + 1 <= cards.length) && <View style={styles.remainingCount}>
          <Text style={{ color: '#888' }}>(card {index + 1}/{cards.length})</Text>
        </View>
      }
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButtonContainer} disabled={cards === null || cards.length == 0} onPress={() => swiperRef.swipeLeft()}>
          <Image style={[styles.actionButton, { opacity: (cards === null || cards.length == 0 ? 0.4 : 1.0) }]} source={require('../assets/images/SwiperActionIcons/dislike.png')} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButtonContainer} disabled={cards === null || cards.length == 0} onPress={() => swiperRef.swipeBack()}>
          <Image style={[styles.actionButton, { opacity: (cards === null || cards.length == 0 ? 0.4 : 1.0) }]} source={require('../assets/images/SwiperActionIcons/back.png')} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButtonContainer} disabled={cards === null || cards.length == 0} onPress={() => swiperRef.swipeRight()}>
          <Image style={[styles.actionButton, { opacity: (cards === null || cards.length == 0 ? 0.4 : 1.0) }]} source={require('../assets/images/SwiperActionIcons/like.png')} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%'
  },
  swipeContainer: {
    // height: 500,
    flex: 0.4,
    elevation: 3,
    flex: 8
  },
  zeroCard: {
    width: '100%',
    zIndex: 1,
    marginTop: '40%',
    alignItems: 'center',
  },
  card: {
    width: '100%',
    zIndex: 1,
    flex: 0.6,
    alignItems: 'center',
  },
  remainingCount: {
    width: '100%',
    zIndex: 1,
    // marginTop: -40,
    // justifyContent: 'center',
    alignItems: 'center',
  },
  actionsContainer: {
    marginTop: '5%',
    flexDirection: 'row',
    justifyContent: 'center',
    flex: 2
  },
  actionButtonContainer: {
    width: 60,
    height: 60,
    marginHorizontal: 15,
  },
  actionButton: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    overflow: 'visible',
  },
  loading: {
    fontSize: 20,
    marginBottom: 20,
    color: '#606060'
  }
})






