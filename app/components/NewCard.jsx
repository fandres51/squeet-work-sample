import * as React from 'react';
import { Linking, StyleSheet, Text, View } from 'react-native';
import { authHeader } from '../auth';

export default function NewCard(props) {
  const openLink = (link) => {
    Linking.openURL(link);
  };
  return (
    <View>
      <View style={styles.container}>
        <View style={[styles.item]}>
          <Text style={styles.header}>Enter Card Name</Text>
          <Text>Upload Image</Text>
          <View style={styles.actionView}>
            <Text style={styles.bottom}>Swipe to reset the card stack!</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

NewCard.moreInfo = (place) => {
  console.log(1);
}

NewCard.savePlace = async (place) => {
  try {
    await axios.post(apiBase.apiBase + "bookmark", { place_id: place.id }, { headers: await authHeader() });
    Alert.alert("Saved", "You've saved " + place.name + " to your bookmarks.");
  } catch (err) {
    console.log(err);
  }
}

NewCard.moreInfo = async (place) => {
  // try {
  //   await axios.post(apiBase.apiBase + "bookmark", {place_id: place.id}, { headers: await authHeader() });
  //   Alert.alert("Saved", "You've saved " + place.name + " to your bookmarks.");
  // } catch (err) {
  //   console.log(err);
  // }
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
    padding: 30,
    borderColor: 'lightgray',
    borderWidth: 1,
    borderRadius: 30,
    overflow: 'hidden',
  },
  itemMoreInfo: {
    height: "100%",
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    height: 25
  },
  dealHeader: {
    color: '#FF9B04',
    paddingStart: 5,
    fontSize: 20,
    paddingTop: 5
  },
  deal: {
    color: 'gray',
    paddingStart: 5,
    fontSize: 15,
    height: 40
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    // margin: 0,
    // aspectRatio: 1,
    // resizeMode: 'cover',
    position: 'absolute',
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    // overflow: 'hidden'
    // alignItems: 'center'
    // borderBottomEndRadius: 10
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
  content: {
    paddingTop: 20,
    paddingStart: 20,
    width: '100%',
    // flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: '5%',
    marginLeft: '3%',
    // justifyContent: 'space-between'
  },
  gradientOverlay: {
    position: 'absolute',
    margin: 0,
    height: 100,
    width: '100%'
  },
  safetyIcon: {
    marginRight: 0,
    width: 40,
    height: 40,
    alignSelf: 'flex-end',
    position: 'absolute',
    top: 170,
    right: 10,
    // backgroundColor: 'white',
    // marginRight: 20,
    backgroundColor: 'white',
    marginTop: 5,
    borderRadius: 20
  },
  maskIcon: {
    width: 40,
    height: 40,
    alignSelf: 'flex-end',
    position: 'absolute',
    top: 130,
    backgroundColor: 'white',
    right: 10,
    padding: 10,
    borderRadius: 20
  },
  header: {
    height: 40,
    fontSize: 32,
    fontWeight: 'bold'
  },
  headerText: {
    textAlign: 'center',
    color: 'gray'
  },
  scroller: {
    height: '100%'
  },
  bottom: {
    flex: 1,
    flexDirection: "column-reverse",
  },
  image: {
    height: '100%'
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
  stars: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 20,
    // flex: 1
  },
  actionView: {
    height: 50,
    marginTop: 35,
  },
  bottom: {
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 18
  }
})