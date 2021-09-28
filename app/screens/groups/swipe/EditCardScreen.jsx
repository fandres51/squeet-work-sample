import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as React from 'react';
import { Text, StyleSheet, TouchableOpacity, View, TextInput, Image, Alert, Clipboard } from 'react-native';
import Dialog from "react-native-dialog";
import { authHeader } from '../../../auth';
import apiBase from '../../../constants/Api';
import axios from 'axios';
import Card from '../../../components/Card';
import * as ImagePicker from 'expo-image-picker';
import { RNS3 } from 'react-native-s3-upload';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import * as mime from 'react-native-mime-types';
import ButtonWithIcon from '../../../components/ButtonWithIcon';


export default function EditCardScreen(props) {

  const navigation = useNavigation();
  const route = useRoute();

  const [card, setCard] = React.useState(route.params.card);
  const [deckid] = React.useState(route.params.deck_id);
  const [title, setTitle] = React.useState(route.params.card?.name || 'Card Title');
  const [titleTextbox, setTitleTextbox] = React.useState(route.params.card?.name || '');
  const [showTitlePrompt, setShowTitlePrompt] = React.useState(false);
  const [notes, setNotes] = React.useState(route.params.card?.description || '');
  const [notesTextbox, setNotesTextbox] = React.useState(route.params.card?.description || 'Tap to add notes');
  const [link, setLink] = React.useState(route.params.card?.link || '');
  const [showNotesPrompt, setShowNotesPrompt] = React.useState(false);
  const [showLinksPrompt, setShowLinksPrompt] = React.useState(false);
  const [image, setImage] = React.useState(route.params.card?.image || 'https://squeet-cards.s3.amazonaws.com/default.png');
  const [imageFromPhone, setImageFromPhone] = React.useState(false);

  async function getCard() {
    try {
      const placeResp = await axios.post(apiBase.apiBase + "decks/card/getRichLink",
        { url: link }, { headers: await authHeader() });
      // setCard(placeResp.data);
      setTitle(placeResp.data.title);
      setTitleTextbox(placeResp.data.title);
      setNotes(placeResp.data.description);
      setNotesTextbox(placeResp.data.title);
      setImageFromPhone(false);
      setImage(placeResp.data.image);
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "An error occurred while adding a place. Please try again later.");
    }
  }

  async function save() {
    try {
      let imageLink = image;
      if (imageFromPhone) {
        const file = {
          uri: image,
          name: uuidv4(),
          type: mime.lookup(image)
        };
        const options = {
          keyPrefix: "",
          bucket: "squeet-cards",
          region: "us-east-1",
          accessKey: "AKIAU5O7RP4BPAXNWKHI",
          secretKey: "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",
          successActionStatus: 200
        };
        console.log(file);
        const uploadedImage = await RNS3.put(file, options);
        console.log(uploadedImage);
        imageLink = uploadedImage.headers.Location;
      }
      await axios.post(apiBase.apiBase + "decks/" + deckid + "/edit/" + card.id, { title, image: imageLink, description: notes, link }, { headers: await authHeader() });
      if (route.params.loadCards) {
        route.params.loadCards();
      }
      navigation.goBack();
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "An error occurred while adding a place. Please try again later.");
    }
  }

  function editTitleHandler() {
    setShowTitlePrompt(true);
  }

  function saveTitle() {
    if (titleTextbox.length > 0) {
      setTitle(titleTextbox);
    } else {
      setTitle('Card Title');
    }
    closeTitlePrompt(titleTextbox.length > 0);
  }

  function closeTitlePrompt(newTitle) {
    setShowTitlePrompt(false);
    if (!newTitle)
      setTitleTextbox("");
  }

  function editInfoHandler() {
    setShowNotesPrompt(true);
  }

  function saveNotes() {
    const newNotes = notesTextbox.length > 0 && notesTextbox != 'Tap to add notes'
    if (newNotes) {
      setNotes(notesTextbox);
    } else {
      setNotes('Tap to add notes');
    }
    closeNotesPrompt(newNotes);
  }

  function closeNotesPrompt(newNotes) {
    setShowNotesPrompt(false);
    if (!newNotes)
      setNotesTextbox('');
  }

  function closeLinkPrompt(saved) {
    setShowLinksPrompt(false);
    if (saved && link != "") {
      getCard();
    }
  }

  async function showLinks() {
    try {
      const clipboardText = await Clipboard.getString();
      if (clipboardText.startsWith('http')) {
        setLink(clipboardText);
      }
    } catch (err) {
      console.log(err);
    }
    setShowLinksPrompt(true);

  }

  async function editImageHandler() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions for this. Please go into settings and give Squeet camera permissions.');
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.6,
    });
    console.log(result);
    if (!result.cancelled) {
      setImageFromPhone(true);
      setImage(result.uri);
    }
  }

  React.useEffect(
    () => {
      setCard({
        ...card,
        name: title,
        description: notes,
        image: image,
      });
    },
    [title, notes, image]
  );

  return (
    <View style={styles.container}>
      <Dialog.Container visible={showTitlePrompt}>
        <Dialog.Title>Rename Card</Dialog.Title>
        <Dialog.Input keyboardType="default"
          textContentType="name"
          selectionColor="#FF9405"
          autoCompleteType="email"
          importantForAutofill="yes"
          placeholder={titleTextbox}
          placeholderTextColor="#A6A6A6"
          style={styles.input}
          onChangeText={setTitleTextbox}
          value={titleTextbox}
        />
        <Dialog.Button label="Cancel" color="grey" onPress={closeTitlePrompt} />
        <Dialog.Button label="Change" bold color="#FF9704" onPress={saveTitle}
        />
      </Dialog.Container>
      <Dialog.Container visible={showNotesPrompt}>
        <Dialog.Title>Add Notes</Dialog.Title>
        <Dialog.Input keyboardType="default"
          textContentType="name"
          selectionColor="#FF9405"
          autoCompleteType="email"
          importantForAutofill="yes"
          placeholder={notesTextbox}
          placeholderTextColor="#A6A6A6"
          style={styles.input}
          onChangeText={setNotesTextbox}
          value={notesTextbox}
        />
        <Dialog.Button label="Cancel" color="grey" onPress={closeNotesPrompt} />
        <Dialog.Button label="Change" bold color="#FF9704" onPress={saveNotes}
        />
      </Dialog.Container>
      <Dialog.Container visible={showLinksPrompt}>
        <Dialog.Title>Paste link</Dialog.Title>
        <Dialog.Input keyboardType="default"
          textContentType="name"
          selectionColor="#FF9405"
          autoCompleteType="link"
          importantForAutofill="yes"
          placeholder={notesTextbox}
          placeholderTextColor="#A6A6A6"
          style={styles.input}
          onChangeText={setLink}
          value={link}
        />
        <Dialog.Button label="Cancel" color="grey" onPress={closeLinkPrompt} />
        <Dialog.Button label="Change" bold color="#FF9704" onPress={closeLinkPrompt}
        />
      </Dialog.Container>
      <View style={styles.searchTypeContainer}>
        <View style={styles.searchTypeButtonContainer}>
          <TouchableOpacity style={[styles.searchTypeButton]} onPress={showLinks}>
            <Text style={[styles.searchTypeButtonText]}>Paste Link</Text>
            <Ionicons style={{ paddingLeft: 3 }} name="md-link" size={24} color={"rgb(28, 133, 254)"} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.cardContainer}>
        <Card card={card}
          editing={true}
          editTitleHandler={editTitleHandler}
          editInfoHandler={editInfoHandler}
          editImageHandler={editImageHandler} />
      </View>

      <View style={styles.bottomButtonContainer}>
        <ButtonWithIcon text="SAVE CARD" action={save} icon='check'></ButtonWithIcon>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // alignItems: 'center',
  },
  searchTypeContainer: {
    padding: 5,
  },
  searchTypeButtonContainer: {
    justifyContent: 'center',
    flexDirection: 'row',
  },
  searchTypeButton: {
    padding: 5,
    width: 200,
    flexDirection: 'row',
    margin: 15,
    justifyContent: 'center'
  },
  searchTypeButtonText: {
    fontWeight: '700',
    fontSize: 24,
    textDecorationLine: 'underline',
    color: '#1e90ff'
  },
  inputContainer: {
    marginLeft: '5%',
    height: 50,
    borderWidth: 1,
    borderColor: 'black',
    justifyContent: 'center',
    // alignItems: 'center',
    padding: 5,
  },
  generalInput: {
    borderColor: 'black',
    borderRadius: 1
  },
  bottomButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '10%',
    elevation: 3,
  },
  addButton: {
    width: 250,
    height: 60,
    resizeMode: 'contain'
  },
  cardContainer: {
    // backgroundColor: 'green',
    width: '90%',
    height: '70%',
    marginLeft: '5%',
    flex: 0.87,
    // alignContent: 'center'
    // alignItems: 'center',
  },
});
