import * as React from 'react';
import { Button, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// import { Countdown } from 'react-native-countdown-text';
import { ScrollView } from 'react-native-gesture-handler';
import { authHeader } from '../auth';
import PlaceImage from './PlaceImage';

export default function PlaceCard(props) {
  const place = props.place;
  // const openMaps = () => {
  //   const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
  //   const latLng = `${this.state.place.latitude},${this.state.place.longitude}`;
  //   const label = this.state.place.name;
  //   const url = Platform.select({
  //     ios: `${scheme}${label}@${latLng}`,
  //     android: `${scheme}${latLng}(${label})`
  //   });
  //   Linking.openURL(url);
  // };
  // const getFormattedTime = (time) => {
  //   const hours = Math.floor(time/(60*60*1000));
  //   const mins = Math.floor((time-(hours*60*60*1000))/(60*1000));
  //   const secs = Math.floor((time-(hours*60*60*1000)-(mins*60*1000))/1000);
  //   return hours + ":" + mins + ":" + secs;
  // };
  const date = new Date();
  const dayOfWeek = date.getDay() + 1;
  const getAudience = (deal) => {
    switch (deal.audience) {
      case 0: return "";
      case 1: return "(Students)";
      case 2: return "(GT SAA)";
    }
    return "";
  };
  const getDay = (deal) => {
    switch (deal.day) {
      case 0: return "(Everyday)";
      case 1: return "(Sunday)";
      case 2: return "(Monday)";
      case 3: return "(Tuesday)";
      case 4: return "(Wednesday)";
      case 5: return "(Thursday)";
      case 6: return "(Friday)";
      case 7: return "(Saturday)";
    }
    return "";
  };

  var shownDeals = [];
  if (place.deals) {
    place.deals.map((deal) => {
      if (dayOfWeek == deal.day || deal.day == 0) {
        shownDeals.push(deal);
      }
    });
  }
  return (
    <View>
      <View style={styles.container}>
        <ScrollView style={styles.scroller} contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between' }} showVerticalScrollIndicator={false}>
          <View style={[styles.item]}>
            <View style={styles.imageContainer}>
              <PlaceImage place={place} rounded={true} />
            </View>
            {place.type == 'M' &&
              <View style={styles.countdown}>
                <Text style={styles.countdownDetail}>Order within</Text>
                {/* <Countdown textStyle={styles.countdownTime} format="hh:mm:ss" finishTime={place.expires} /> */}
                <Text style={styles.countdownDetail}>FOR FREE DELIVERY</Text>
              </View>
            }
            <View style={[styles.detail]}>
              <View style={styles.row}>
                {
                  place.type == 'M' &&
                  <View style={styles.melon}>
                    <Text style={styles.dealHeader}>Today's Menu</Text>
                    {place.items.length > 0 &&
                      place.items.slice(0, 2).map((deal) => {
                        return (<Text style={styles.melonItem}>{deal.name} ({deal.price})</Text>);
                      })
                    }
                  </View>
                }
                {shownDeals.length > 0 &&
                  <Text style={styles.dealHeader}>Deals</Text>
                }
                {shownDeals.length > 0 &&
                  shownDeals.slice(0, 2).map((deal) => {
                    return (<Text style={styles.deal}>- {getAudience(deal)} {deal.deal_text} {getDay(deal)}</Text>);
                  })
                }
                {place.descripton &&
                  <Text style={styles.description}>{place.description}</Text>
                }
              </View>
              {
                //(
                //<View>
                // <View style={styles.mapContainer}>
                //  <View style={styles.overlay}>
                //    <View style={styles.greenOverlay}>
                //       <Text selectable style={styles.address}>{place.address}</Text>
                //     </View>
                //   </View>
                // </View>
                // <Button title="Open in Maps" onPress={ () => openMaps() }></Button>
                // <View style={styles.links}>
                //  {
                //   place.website &&
                //    <Button title="Visit website" onPress={ () =>  Linking.openURL(place.website)}></Button>
                //}
                //</View>
                //</View>
                //)
              }
              <View style={styles.bottom}>
                {place.type != 'M' &&
                  <Button color="#A6A6A6" title="More info" onPress={
                    () => {
                      props.navigation.navigate('Detail', {
                        place: place
                      });
                    }
                  }></Button>
                }
                {
                  place.type == 'M' &&
                  <TouchableOpacity onPress={() => Linking.openURL("https://www.trymelon.com/dailymenu")}><Text style={styles.orderMelon}>Place order through MELON?</Text></TouchableOpacity>
                }
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

PlaceCard.savePlace = async (place) => {
  try {
    await axios.post(apiBase.apiBase + "bookmark", { place_id: place.id }, { headers: await authHeader() });
    Alert.alert("Saved", "You've saved " + place.name + " to your bookmarks.");
  } catch (err) {
    console.log(err);
  }
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // flexDirection: 'row',
    // alignItems: 'center',
    // justifyContent: 'flex-start',
    // width: 100,
    // paddingLeft: 8,
    // backgroundColor: 'red',
  },
  saveButton: {

  },
  saveButtonText: {
    fontWeight: 'bold',
    color: '#3ec94a',
  },
  icon: {
    paddingLeft: 5,
    color: '#3ec94a',
    // paddingStart:
  },
  item: {
    backgroundColor: 'white',
    // height: "80%",
    marginBottom: 20,
    borderColor: 'lightgray',
    borderWidth: 1,
    borderRadius: 30,
    overflow: 'hidden',
    height: '70%'
  },
  image: {
    height: '50%',
    overflow: 'hidden'
  },
  itemMoreInfo: {
    height: "100%",
  },
  dealHeader: {
    color: '#FF9B04',
    paddingStart: 5,
    fontSize: 20,
    paddingTop: 5,
    paddingBottom: 5
  },
  deal: {
    color: 'gray',
    paddingStart: 5,
    fontSize: 15,
    height: 40
  },
  melonItem: {
    color: 'gray',
    fontWeight: 'bold',
    paddingStart: 5,
    fontSize: 15,
    height: 25,
  },
  row: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    marginBottom: -30
  },
  detail: {
    flex: 1,
    // alignItems: 'center',
    paddingLeft: 8,
    // backgroundColor: 'white',
    height: "25%",
    width: '100%',
    // alignItems: 'center',
    // position: 'absolute',
    // padding: 200,
    paddingBottom: 0,
    // marginBottom: 0,
    // paddingBottom: 0,
    justifyContent: 'flex-start',
    // bottom: 0,
  },
  detailMoreInfo: {
    height: "40%",
  },
  scroller: {
    height: '100%'
  },
  bottom: {
    flex: 1,
    flexDirection: "column-reverse",
  },
  imageContainer: {
    height: '70%',
  },
  mapStyle: {
    width: '100%',
    aspectRatio: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: 0,
    top: 0,
  },
  address: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    width: '50%',
    justifyContent: 'center',
    alignSelf: 'center',
    height: '50%',
    marginTop: '20%'
  },
  mapContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20
  },
  overlay: {
    width: '100%',
    aspectRatio: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  greenOverlay: {
    width: '100%',
    height: '100%',
    backgroundColor: '#FFA004'
  },
  closeIcon: {
    width: 40,
    height: 40,
    alignSelf: 'flex-end',
    top: 10,
    backgroundColor: '#FF9B04',
    right: 10,
    paddingLeft: 13,
    paddingTop: 9,
    borderRadius: 20,
    textAlign: 'center'
  },
  melon: {
    marginTop: 5
  },
  orderMelon: {
    backgroundColor: '#FF9B04',
    width: '65%',
    marginLeft: '17.5%',
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'white',
    padding: 10,
    borderRadius: 10,
    overflow: 'hidden',
    bottom: 10
  },
  countdown: {
    backgroundColor: '#FF9B04',
    borderRadius: 50,
    height: 80,
    width: '100%',
    marginTop: -80,
    alignItems: 'center',
    justifyContent: 'center'
  },
  countdownDetail: {
    color: 'white',
    fontWeight: '700'
  },
  countdownTime: {
    fontSize: 32,
    color: 'white',
    fontWeight: 'bold'
  },
  description: {
    marginTop: 20,
    marginLeft: 10,
    marginRight: 10
  }
})