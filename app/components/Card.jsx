import * as React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Alert } from 'react-native';
import { authHeader } from '../auth';
import PlaceImage from './PlaceImage';
import Dialog from "react-native-dialog";
import * as Linking from 'expo-linking';
import AdjustLabel from './AdjustLabel';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function Card(props) {
  const navigation = useNavigation();
  const route = useRoute();
  const card = props.card;
  const editing = !!props.editing;
  const editInfoHandler = props.editInfoHandler;
  const editTitleHandler = props.editTitleHandler
  const isResult = props.isResult;
  const result = props.result;
  const group = props.group;
  const commentCount = props?.card?.comments?.length || 0

  let showDetails = false;

  function hideInfo() {
    showDetails = false
  }

  function getExtraLabel() {
    switch (card.card_type) {
      case 0: return 'More info';
      case 1: return 'Open in Web';
      case 2: return 'Menu and reviews';
    }
  }

  function showInfo() {
    if (card.card_type == 0) {
      showDetails = true;
    }
    if (card.card_type == 1 || card.card_type == 2) {
      Linking.openURL(card.url);
    }
  }

  function showComments() {
    navigation.navigate('Comments', { card, group });
  }

  return (
    <View style={styles.container}>
      {card.description != "" &&
        <Dialog.Container visible={showDetails}>
          <Dialog.Title>More Info</Dialog.Title>
          <Dialog.Description>
            {card.description}
          </Dialog.Description>
          <Dialog.Button label="Close" color="grey" onPress={() => hideInfo()} />
        </Dialog.Container>
      }
      <View showVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.usableArea}>
            <View style={styles.imageContainer}>
              <PlaceImage
                place={card}
                rounded={true}
                editing={editing}
                isResult={isResult}
                result={result}
                editImageHandler={props.editImageHandler} />
            </View>
            <View style={styles.titleContainer}>
              {editing ?
                <TouchableOpacity onPress={editTitleHandler}>
                  <AdjustLabel editable numberOfLines={3} fontSize={24} style={styles.title}>{card.name}</AdjustLabel>
                </TouchableOpacity>
                :
                <View style={styles.titleLine}>
                  <AdjustLabel numberOfLines={4} fontSize={24} style={styles.title}>{card.name}</AdjustLabel>
                </View>
              }
            </View>
            <View style={styles.detailContainer}>
              {editing ?
                <TouchableOpacity style={styles.descriptionContainer} onPress={editInfoHandler}>
                  <Text multiline style={styles.description}>{card.description || "Tap to add notes"}</Text>
                </TouchableOpacity>
                :
                <View style={styles.detail}>
                  <View style={styles.descriptionContainer}>
                    {!!card.description && card.description != "" &&
                      <Text style={styles.descriptionText}>{card.description.substring(0, 200)}</Text>
                    }
                  </View>
                  <View style={styles.moreInfoContainer}>
                    {
                      (!props.hideMoreInfo) &&
                      <TouchableOpacity style={styles.commentButton} onPress={showComments}>
                        <Image
                          source={require('../assets/images/comment.png')}
                          style={styles.commentIcon}
                        />
                        {commentCount == 0 && <Text style={styles.commentText}>Add Comment</Text>}
                        {commentCount == 1 && <Text style={styles.commentText}>View 1 comment</Text>}
                        {commentCount > 1 && <Text style={styles.commentText}>View all {commentCount} comments</Text>}

                      </TouchableOpacity>
                    }
                    {
                      (!props.hideMoreInfo && card.description != "" && card.description?.length > 200) || (card.card_type > 0) &&
                      <TouchableOpacity style={styles.moreInfoButton} accessibilityLabel={getExtraLabel()} title={getExtraLabel()} onPress={showInfo}>
                        <Text style={styles.moreInfoText}>{getExtraLabel()}</Text>
                        {(card.card_type == 1 || card.card_type == 2) &&
                          <Image
                            source={require('../assets/images/export.png')}
                            style={styles.exportIcon}
                          />}
                      </TouchableOpacity>
                    }
                  </View>
                </View>
              }
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

Card.savePlace = async (place) => {
  try {
    await axios.post(apiBase.apiBase + "bookmark", { place_id: place.id }, { headers: await authHeader() });
    Alert.alert("Saved", "You've saved " + place.name + " to your bookmarks.");
  } catch (err) {
    console.log(err);
  }
}

const styles = StyleSheet.create({
  container: {
    // height: '100%'
    width: '100%',
    // backgroundColor: 'red'
  },
  card: {
    backgroundColor: '#eee',
    height: '100%',
    width: '100%',
    borderColor: 'lightgray',
    borderWidth: 1,
    borderRadius: 30,
    overflow: 'hidden',
    alignItems: 'center',
    // flex: 0.87,
    // width: 335
  },
  usableArea: {
    height: '93%',
    width: '85%',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  imageContainer: {
    // padding: 20,
    height: '60%',
  },
  titleContainer: {
    width: '100%',
    height: '15%',
    justifyContent: 'center'
  },
  title: {
    fontWeight: 'bold',
    color: '#FF9B04',
    // flexWrap: 'wrap',
  },
  detailContainer: {
    height: '25%',
    width: '100%',
  },
  detail: {
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  description: {
    fontWeight: 'bold'
  },
  descriptionContainer: {
  },
  descriptionText: {
    fontSize: 12,
  },
  moreInfoContainer: {
    alignItems: 'center',
  },
  commentButton: {
    width: '80%',
    padding: 5,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    bottom: 0,
  },
  commentText: {
    // textDecorationLine: 'underline',
    fontWeight: 'bold',
    elevation: 3,
    // height: "40%",
    color: '#aaa',
  },
  commentIcon: {
    marginLeft: 5,
    height: 20,
    width: 20,
    borderRadius: 30,
    marginRight: 15,
    tintColor: '#aaa'
  },
  moreInfoButton: {
    width: '80%',
    marginTop: 10,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    bottom: 0,
  },
  moreInfoText: {
    textDecorationLine: 'underline',
    fontWeight: 'bold',
    elevation: 3,
    // height: "40%",
    color: '#1E90FF',
  },
  exportIcon: {
    marginLeft: 5,
    height: 20,
    width: 20,
    borderRadius: 30,
    marginRight: 15,
    tintColor: '#1E90FF'
  }
})