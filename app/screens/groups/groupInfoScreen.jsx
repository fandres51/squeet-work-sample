import * as React from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useState } from "react";

export default function groupInfoScreen() {

  const navigation = useNavigation();
  const route = useRoute();

  const tabs = ['Swipe & Match', 'Ch. Selection Poll', 'Schedule']
  const [selectedTab, setSelectedTab] = useState(route.params.decision_type);

  const info = [
    {
      imagePath: require('../../assets/images/infoSwipeAndMatch.png'),
      text: 'Like and dislike choices with your squad. We will show the top choice at the end.',
      implemented: true,
    },
    {
      imagePath: require('../../assets/images/infoSmartPolls.png'),
      text: 'Soon you will be able to make your squad see and select muliple choices. You can also individually assign some choices to each squad member.',
      implemented: false,
    },
    {
      imagePath: require('../../assets/images/infoSchedule.png'),
      text: 'Soon you will be able to make scheduling group activites simpler, including 1:1 meetings, group meetings, and RSVPs.',
      implemented: false,
    },
  ]

  return (
    <View style={styles.contentContainer}>
      <View style={styles.headerContainer}>
        {
          tabs.map((tab, index) => {
            return (
              <TouchableOpacity
                key={index}
                disabled={selectedTab == index}
                onPress={() => setSelectedTab(index)}
                style={[styles.tab, selectedTab == index && styles.tabSelected]}>
                <Text style={[styles.tabText, selectedTab == index && styles.tabTextSelected]}>{tab}</Text>
              </TouchableOpacity>
            )
          })
        }
      </View >

      <View style={styles.infoContainer}>
        {!info[selectedTab].implemented &&
          <Text style={styles.comingSoon}>COMING SOON</Text>
        }
        <View style={styles.imageContainer}>
          <Image
            resizeMode={'contain'}
            style={styles.image}
            source={info[selectedTab].imagePath}></Image>
        </View >
        <View style={styles.textContainer}>
          <Text style={styles.infoText}>{info[selectedTab].text}</Text>
        </View >
      </View >
    </View >
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    backgroundColor: '#fff'
  },
  headerContainer: {
    marginTop: 20,
    marginHorizontal: '10%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    // flex: 1,
  },
  tab: {
    paddingVertical: 5,
  },
  tabSelected: {
    borderBottomWidth: 2,
    borderBottomColor: '#FF9B04',
  },
  tabText: {
    fontWeight: 'bold',
    color: '#000'
  },
  tabTextSelected: {
    color: '#FF9B04'
  },
  infoContainer: {
    flex: 5,
  },
  comingSoon: {
    marginTop: 20,
    marginBottom: -45,
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 25
  },
  imageContainer: {
    height: '40%',
    marginTop: '5%'
  },
  image: {
    resizeMode: 'contain',
    height: '100%',
    width: '100%'
  },
  textContainer: {
    alignItems: 'center',
    marginHorizontal: '5%'
  },
  infoText: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
