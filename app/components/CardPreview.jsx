import * as React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import imageBase from '../constants/ImageEndpoint';
import { LinearGradient } from 'expo-linear-gradient';

export default function CardPreview(props) {
  const card = props.card;
  console.log(card);
  return (
    <View>
      <View style={styles.imageContainer}>
        <View style={[styles.image]}>
          {
            <Image
              style={[styles.backgroundImage, { backgroundColor: card.image_color, zIndex: -1}, (props.rounded ? styles.rounded : null)]}
              source={{
                uri: (card.image || (imageBase + card.id))
              }}
            />
          }
          <LinearGradient
            colors={['rgba(0,0,0,0.7)', 'transparent']}
            style={styles.gradientOverlay} />
          <View style={styles.content}>
            <Text minimumFontScale={0.3} style={styles.title}>{card.name}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    height: 130
  },
  image: {
    height: '100%'
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  content: {
    paddingTop: 20,
    paddingStart: 20,
    width: '100%',
    flexWrap: 'wrap',
    marginTop: '1%',
    marginLeft: '1%',
  },
  gradientOverlay: {
    position: 'absolute',
    margin: 0,
    height: 100,
    width: '100%'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    height: 25
  },
});