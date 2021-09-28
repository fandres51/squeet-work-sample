/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { View, Image, StyleSheet } from "react-native";
import * as React from "react";
import PollOption from "./PollOption";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";

const PollView = ({ cards, onPressDone }) => {

    const [cardsOption, setCardsOption] = React.useState(cards.map((card, i) => ({card: card, option: false, index: i})));

    const onPressCheck = (cardOp) => {
        setCardsOption (
            cardsOption.map( (cardOption) => {
                if(cardOption.index === cardOp.index)
                    return cardOp;
                return cardOption;
            })
        )
    }

    return (
        <View>
            <ScrollView>
                {
                    cardsOption.map((cardOption) => (
                        <View>
                            <PollOption cardOption={cardOption} onPressCheck={onPressCheck}></PollOption>
                        </View>
                    ))
                }
                <TouchableOpacity onPress={() => onPressDone(cardsOption)}>
                    <Image style={[styles.button, { opacity: 1.0 }]} source={require('../assets/images/seeVotes.png')} />
                </TouchableOpacity>
            </ScrollView>
            {/* <FlatList
                data={cardsWithOption}
                keyExtractor={item => item.card.id}
                renderItem={({ item, i }) => (
                    <PollOption cardWithOption={item} onPressOption={onPressOption}></PollOption>
                )}
            />
            <TouchableOpacity onPress={() => onPressDone()}>
                <Text>
                    Done!
                </Text>
            </TouchableOpacity> */}
        </View>
    );
}

export default PollView;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        flex: 1
    },
    button: {
        width: 250,
        height: 60,
        resizeMode: 'contain',
        marginTop: 30,
        marginLeft: 'auto',
        marginBottom: 20,
        marginRight: 'auto'
    },
});