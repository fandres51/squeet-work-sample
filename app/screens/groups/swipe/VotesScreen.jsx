/* eslint-disable no-unused-vars */
import { View, Alert, ActivityIndicator, StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { authHeader } from '../../../auth';
import apiBase from '../../../constants/Api';
import axios from 'axios';
import * as React from "react";
import ResultItem from "../../../components/ResultItem";
import ImageDB from '../../../constants/ImageDB';

const VotesScreen = () => {

    const navigation = useNavigation();
    const route = useRoute();
    const group = route.params.group;

    const [results, setResults] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);

    useFocusEffect(
        React.useCallback(() => {
            (async () => {
                try {
                    const res = await axios.get(apiBase.apiBase + "groups/" + group.id + "/results", { headers: await authHeader() });
                    setResults(res.data);
                    setIsLoading(false);
                } catch (err) {
                    console.log('<<< Error: unable to load results >>>\n\n', err);
                    setIsLoading(true);
                    Alert.alert("Oops!", "It looks we can't load the info right now :(", [{ text: "Ok", onPress: () => navigation.navigate('Group') }]);
                }
            })()
        }, [])
    );

    const dropdownOptions = [
        'Swipe Again',
        'Edit Event Name',
        'Delete Event'
    ];

    const updateNameInScreen = (newGroupName) => {
        route.params.group.name = newGroupName;
    }

    return (
        <View style={styles.container}>
            { isLoading && <ActivityIndicator size="large" color="#f7941d" />}
            { !isLoading &&
                <View>
                    <ScrollView scrollIndicatorInsets={{ right: 1 }}>
                        {results.map((result, i) => (
                            <View key={i}>
                                <ResultItem result={result}></ResultItem>
                            </View>
                        ))}
                    </ScrollView>
                </View>
            }
        </View>
    );
}

export default VotesScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignContent: 'center',
        backgroundColor: 'white'
    }
})