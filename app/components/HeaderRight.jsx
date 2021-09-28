import { StyleSheet, View, Image } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useNavigation } from '@react-navigation/native';
import ModalDropdown from "react-native-modal-dropdown";
import axios from 'axios';
import apiBase from '../constants/Api';
import Dialog from "react-native-dialog";
import * as React from "react";
import { Alert } from "react-native";
import { authHeader } from '../auth';

const HeaderRightDd = ({ dropdownOptions, group, updateNameInScreen }) => {

    const navigation = useNavigation();

    const [showPrompt, setShowPrompt] = React.useState(false);
    const [newName, setNewName] = React.useState(group.name);

    const navigate = async (screenName, params) => {
        try {
            navigation.navigate(screenName, params);
        } catch (err) {
            console.log('Error navigating>>>\n', err);
            Alert.alert('This is weird', "An error ocurred while you was navigating in the app, please try again");
        }
    }

    const saveGroupName = async (newGroupName) => {
        if (newGroupName.length > 0) {
            try {
                await axios.post(apiBase.apiBase + "groups/" + group.id + "/setName", { name: newGroupName }, { headers: await authHeader() });
                updateNameInScreen(newGroupName);
                closePrompt();
            } catch (err) {
                console.log('Error', err);
                Alert.alert("An error occurred!", "Please try again later.");
            }
        }
    }

    const closePrompt = () => {
        setShowPrompt(false);
    }

    const deleteGroup = async () => {
        try {
            await axios.post(apiBase.apiBase + 'groups/' + group.id + '/delete', {}, { headers: await authHeader() });
            navigation.navigate('Group');
        } catch (err) {
            console.log(err);
            Alert.alert("Error deleting this group");
        }
    }

    function handleDropdownPress(index, value) {
        switch (value) {
            case 'View members':
                navigate('GroupMembers', { group });
                return
            case 'Add members':
                navigate('AddGroupMembers', { group });
                return
            case 'Add card':
                navigate('AddCard', { group });
                return
            case 'Edit Choices':
                navigate('EditDeck', { group });
                return
            case 'Edit Event Name':
                setShowPrompt(true);
                return
            case 'Delete Event':
                deleteGroup();
                return
            case 'Select New Deck':
                navigate('ConfigureGroup', { group, update: true });
                return
            case 'Swipe Again':
                navigate('GroupDeck', { group });
                return
            case 'Vote Again':
                navigate('PollScreen', { group });
                return
            case 'View Results':
                group.decision_type === 1? navigate('PollResult', { group }): navigate('GroupResult', { group });
        }
    }

    return (
        <View>
            <View>
                <View style={styles.orientation}>
                    <TouchableOpacity onPress={() => navigate('GroupMembers', { group })}>
                        <Image style={styles.headerIcon} source={require('../assets/images/addFriends.png')} />
                    </TouchableOpacity>
                    <ModalDropdown
                        options={dropdownOptions}
                        style={{ marginRight: 10 }}
                        dropdownStyle={{ height: dropdownOptions.length * 36 }}
                        dropdownTextStyle={{ color: 'black' }}
                        onSelect={(index, value) => handleDropdownPress(index, value)}
                    >
                        <Image style={styles.headerIcon} source={require('../assets/images/dots.png')} />
                    </ModalDropdown>
                </View>
            </View>
            {
                showPrompt &&
                <View>
                    <Dialog.Container visible={showPrompt}>
                        <Dialog.Title>Enter the new name...</Dialog.Title>
                        <Dialog.Input
                            keyboardType="default"
                            textContentType="name"
                            selectionColor="#FF9405"
                            autoCompleteType="email"
                            importantForAutofill="yes"
                            placeholder={group.name}
                            placeholderTextColor="#A6A6A6"
                            onChangeText={setNewName}
                            style={styles.nameInput}
                            value={newName}
                        />
                        <Dialog.Button label="Cancel" color="grey" onPress={() => closePrompt()} />
                        <Dialog.Button label="Acept" bold color="#FF9704" onPress={() => saveGroupName(newName)}/>
                    </Dialog.Container>
                </View>
            }
        </View>
    );
}

export default HeaderRightDd;

const styles = StyleSheet.create({
    orientation: {
        flexDirection: "row"
    },
    headerIcon: {
        width: 35,
        height: 35,
        margin: 5,
        resizeMode: 'contain'
    },
    nameInput: {
        borderColor: '#dfdfdf',
        borderWidth: 1,
        marginLeft: 3,
        marginRight: 3,
        paddingLeft: 14,
        borderRadius: 5
    }
});