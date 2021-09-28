import * as React from 'react';
import { Children } from 'react';
import { Text, Image, StyleSheet, View } from 'react-native';

// https://stackoverflow.com/questions/48001774/how-to-adjust-font-size-to-fit-view-in-react-native-for-android/58823271#58823271

export default function AdjustLabel({
  fontSize, children, style, numberOfLines, editable
}) {
  const [currentFont, setCurrentFont] = React.useState(fontSize);

  return (
    <View style={{ flexDirection: 'row', width: '95%' }}>
      <Text
        numberOfLines={numberOfLines}
        adjustsFontSizeToFit
        style={[style, { fontSize: currentFont }]}
        onTextLayout={(e) => {
          const { lines } = e.nativeEvent;

          if (lines.length > numberOfLines) {
            setCurrentFont(currentFont - 1);
          }
        }}
      >
        {children}
      </Text>
      {
        editable &&
        <Image style={[styles.renameTitleIcon, { opacity: 1.0 }]} source={require('../assets/images/edittext.png')} />
      }
    </View>
  );
};
const styles = StyleSheet.create({
  renameTitleIcon: {
    // flexDirection: 'column-reverse',
    width: 20,
    height: 20,
    resizeMode: 'contain',
    marginLeft: 5,
    marginTop: 10,
    tintColor: '#FF9B04',
  },
})