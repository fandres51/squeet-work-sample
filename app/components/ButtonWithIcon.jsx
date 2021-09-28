import * as React from 'react';
import { Text, TouchableOpacity, View, StyleSheet, Image } from 'react-native';


const ButtonWithIcon = ({
    text,
    action,
    icon = 'arrow' 
}) => {

    const images = [
        {
            iconName: 'arrow',
            imagePath: require('../assets/images/login-signup/whiteArrow.png'),
        },
        {
            iconName: 'check',
            imagePath: require('../assets/images/jesusChristItsJustAFancyCheckmarkInsideACircle.png'),
        },
    ]

    return (
        <TouchableOpacity style={styles.buttonContainer} title="SIGN UP" onPress={action}>
            <Text style={styles.buttonText}>{text}</Text>
            <View style={styles.arrowContainer}>
                <Image style={styles.arrow} source={images.filter((image) => { return image.iconName == icon })[0].imagePath}></Image>
            </View>
        </TouchableOpacity>
    );
}

export default ButtonWithIcon;

const styles = StyleSheet.create({
    buttonContainer: {
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#FF9405",
        borderRadius: 50,
        width: 320
    },
    buttonText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    arrowContainer: {
        position: 'absolute',
        right: 8,
        backgroundColor: '#f28020',
        height: 35,
        width: 35,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    arrow: {
        resizeMode: 'contain',
        height: 25,
        width: 25
    }
});