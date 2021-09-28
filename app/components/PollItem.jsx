/* eslint-disable no-unused-vars */
import { View, StyleSheet, Text, Image } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import CheckBox from '@react-native-community/checkbox';
import * as React from 'react';

const PollOption = ({ card, option, index, numberOfVotes, onPressCheck }) => {

    return (
        <View style={styles.container}>
            <View style={styles.cardInfo}>
                <View>
                    <Image style={styles.image} source={{ uri: card.image }}></Image>
                </View>
                <View style={styles.text}>
                    <Text style={styles.title}>{card.name}</Text>
                    <Text style={styles.description}>{card.description}</Text>
                </View>
            </View>
            <View style={styles.results}>
                <TouchableOpacity onPress={() => onPressCheck({ card: card, option: !option, index: index })}>
                    {
                        !option && 
                        <View>
                            <Image style={styles.checkBox} source={require('../assets/images/whitePollCheck.png')}></Image>
                        </View>
                    }
                    {
                        option && 
                        <View>
                            <Image style={styles.checkBox} source={require('../assets/images/greenPollCheck.png')}></Image>
                        </View>
                    }
                </TouchableOpacity>
                <View>
                    <Text style={styles.numVotes}>{numberOfVotes} {numberOfVotes === 1?'Vote':'Votes'}</Text>
                </View>
            </View>
        </View>
    );
}

export default PollOption;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignContent: 'center',
        height: 110,
        paddingHorizontal: 25,
        backgroundColor: 'white',
        borderBottomColor: '#dfdfdf',
        borderBottomWidth: 1
    },
    cardInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        height: '100%',
        flex: 4
    },
    results: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1
    },
    image: {
        height: 75,
        width: 75,
        borderRadius: 15
    },
    text: {
        flexDirection: 'column',
        marginLeft: 15,
        flex: 1,
        maxHeight: '100%'
    },
    title: {
        fontSize: 17,
        fontWeight: "bold",
        color: '#333132',
        maxHeight: '50%'
    },
    description: {
        maxWidth: '83%',
        maxHeight: 34,
        color: '#989898'
    },
    checkBox: {
        height: 35,
        width: 34,
        borderRadius: 100
    },
    numVotes: {
        fontWeight: 'bold',
        color: '#999899',
        marginTop: 3,
        fontSize: 14
    }
})