import * as React from 'react';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Dialog from "react-native-dialog";

export default function ChangableText(props) {
  const [text, setText] = React.useState(props.initialText == props.placeholder ? "" : props.initialText);
  const [showPrompt, setShowPrompt] = React.useState(false);

  return (
    <View>
      <Dialog.Container visible={showPrompt}>
        <Dialog.Title>{props.title}</Dialog.Title>
        <Dialog.Input
          keyboardType="default"
          textContentType="name"
          selectionColor="#FF9405"
          placeholder={props.placeholder}
          placeholderTextColor="#A6A6A6"
          style={styles.input}
          onChangeText={setText}
          value={text}
        />
        <Dialog.Button label="Cancel" color="grey" onPress={() => setShowPrompt(false)} />
        <Dialog.Button label="Change" bold color="#FF9704" onPress={() => {
          props.onChange(text);
          setShowPrompt(false);
        }} />
      </Dialog.Container>
      <TouchableOpacity style={styles.frame} onPress={() => setShowPrompt(true)}>
        <Text style={styles.text}>{(props.initialText != "" && props.initialText) || props.placeholder}</Text>
        <Ionicons
          name="md-pencil"
          size={19}
          color="#FF9405"
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    // flex: 1,
    flexDirection: 'row'
  },
  text: {
    color: "#FF9405",
    fontWeight: 'bold',
    paddingRight: 5,
    fontSize: 19
  }
})