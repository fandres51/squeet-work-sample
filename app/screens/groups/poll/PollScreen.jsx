import { View, ActivityIndicator, Alert, StyleSheet, AsyncStorage, Text } from 'react-native';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { authHeader } from '../../../auth';
import axios from 'axios';
import apiBase from '../../../constants/Api';
import * as React from 'react';
import HeaderRight from '../../../components/HeaderRight';
import PollItem from "../../../components/PollItem";

const PollScreen = () => {

    const route = useRoute();
    const navigation = useNavigation();
    navigation.setOptions({ title: route.params.group.name });

    const [group, setGroup] = React.useState(route.params.group);
    const [isLoading, setIsLoading] = React.useState(true);
    const [results, setResults] = React.useState([]);
    const [cards, setCards] = React.useState([]);
    const [email, setEmail] = React.useState('');

    useFocusEffect(
        React.useCallback(() => {
            (async () => {
                try {
                    //load user
                    const user = await AsyncStorage.getItem("email");
                    setEmail(user);

                    //load group
                    const resGroup = await axios.get(apiBase.apiBase + 'groups/' + group.id, { headers: await authHeader() });
                    setGroup(resGroup.data);

                    //load cards
                    const resCards = await axios.get(apiBase.apiBase + "groups/" + group.id + "/cards", { headers: await authHeader() });
                    if (resCards.data && resCards.data.filteredCards) { //creates results for all cards if don't exist
                        resCards.data.filteredCards.map((card, index) => {
                            onPressCheck({ card: card, option: false, index: index });
                        })
                    }
                    setCards(resCards.data.filteredCards);

                    const res = await axios.get(apiBase.apiBase + "groups/" + group.id + "/results", { headers: await authHeader() });
                    setResults(res.data.sort(orderResultsById));

                    setIsLoading(false);

                } catch (err) {
                    console.log('\n<<< Error: unable to load groups >>>\n\n', err, '\n');
                    setIsLoading(true);
                    Alert.alert("Oops!", "It looks we can't load the info right now :(", [{ text: "Ok", onPress: () => navigation.navigate('Group') }]);
                }
            })()
        }, [])
    )

    const onPressCheck = async (cardOp) => {
        if (cardOp.option) {
            try {
                await axios.post(apiBase.apiBase + "groups/" + group.id + "/like", { card_id: cardOp.card.id }, { headers: await authHeader() });
            } catch (err) {
                throw (err);
            }
        } else {
            try {
                await axios.post(apiBase.apiBase + "groups/" + group.id + "/dislike", { card_id: cardOp.card.id }, { headers: await authHeader() });
            } catch (err) {
                throw (err);
            }
        }
        try {
            const res = await axios.get(apiBase.apiBase + "groups/" + group.id + "/results", { headers: await authHeader() });
            setResults(res.data.sort(orderResultsById));
        } catch (err) {
            console.log('Err>>>', err);
        }
    }

    const updateNameInScreen = (newGroupName) => {
        navigation.setOptions({ title: newGroupName });
    }

    const orderResultsById = (a, b) => {
        if(a.cardData.card_id > b.cardData.card_id)
            return 1;
        else if(a.cardData.card_id < b.cardData.card_id)
            return -1;
        else
            return 0;
    }

    const dropdownOptions = [
        'View Results',
        'Edit Choices',
        'Edit Event Name',
        'Delete Event'
    ];

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <HeaderRight
                    dropdownOptions={dropdownOptions}
                    group={group}
                    updateNameInScreen={updateNameInScreen}
                ></HeaderRight>
            )
        })
    })

    return (
        <View style={styles.container} >
            { isLoading && <ActivityIndicator size="large" color="#f7941d" />}
            { !isLoading &&
                <View>
                    <ScrollView>
                        {
                            results.map((result, index) => (
                                <View key={index}>
                                    <PollItem
                                        card={result.cardData}
                                        option={result.likers.some((liker) => liker === email)}
                                        index={index}
                                        numberOfVotes={result.likers.length}
                                        onPressCheck={onPressCheck}
                                    ></PollItem>
                                </View>
                            ))
                        }
                    </ScrollView>
                </View>
            }
        </View >
    );
}

export default PollScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignContent: 'center',
        backgroundColor: 'white'
    },
    button: {
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 30,
        marginBottom: 40,
        backgroundColor: '#f7941d',
        height: 40,
        width: 200,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50
    },
    text: {
        color: 'white',
        fontWeight: 'bold'
    }
})