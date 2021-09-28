/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { View, StyleSheet, Image, Text } from 'react-native';
import { Collapse, CollapseHeader, CollapseBody } from 'accordion-collapse-react-native';
import * as React from 'react';
import { Entypo } from '@expo/vector-icons'; 

const PollResultItem = ({ result }) => {
    return (
        <View style={styles.maxContainer}>
            <Collapse>
                <CollapseHeader>
                    <Header result={result}></Header>
                </CollapseHeader>
                <CollapseBody>
                    <Content result={result}></Content>
                </CollapseBody>
            </Collapse>
        </View>
    );
}

const Header = ({ result }) => {
    return (
        <View style={styles.container}>
            <View style={styles.cardInfo}>
                <Image style={styles.image} source={{ uri: result.cardData.image }}></Image>
                <Text style={styles.title}>{result.cardData.name}</Text>
            </View>
            <View style={styles.cardResults}>
                <View style={styles.likedPerc}>
                    <Text style={styles.percentaje}>{result.likers.length}</Text>
                    <Text style={styles.liked}>{result.likers.length === 1?'Vote':'Votes'}</Text>
                </View>
                <View>
                    <Entypo name="chevron-down" size={24} color="#606060" />
                </View>
            </View>
        </View>
    )
}

const Content = ({ result }) => {
    return (
        <View style={styles.votes}>
            {
                result.likers.map((liker, i) => (
                    <View style={styles.voterResult} key={i}>
                        <Image style={styles.voteImg} source={require('../assets/images/voteLike.png')}></Image>
                        <Text style={styles.voter}>{liker}</Text>
                    </View>
                ))
            }
        </View>
    )
}

export default PollResultItem;

const styles = StyleSheet.create({
    maxContainer: {
        borderBottomColor: '#dfdfdf',
        borderBottomWidth: 1
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 110,
        paddingHorizontal: 25,
        width: '100%'

    },
    cardInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 2
    },
    image: {
        height: 75,
        width: 75,
        borderRadius: 15
    },
    title: {
        marginLeft: 10,
        fontSize: 17,
        fontWeight: "bold",
        color: '#333132',
        flex: 1,
        maxHeight: '100%'
    },
    cardResults: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    percentaje: {
        color: '#2cad49',
        fontSize: 25,
        fontWeight: 'bold'
    },
    likedPerc: {
        flexDirection: 'column',
        alignItems: 'center',
        marginRight: 10
    },
    liked: {
        color: '#2cad49',
        fontWeight: 'bold'
    },
    icon: {
        height: 25,
        width: 30
    },
    votes: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        paddingHorizontal: 25,
        paddingBottom: 15,
    },
    voterResult: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 2

    },
    voteImg: {
        height: 20,
        width: 20
    },
    voter: {
        fontWeight: 'bold',
        marginLeft: 10,
        fontSize: 15
    }
})