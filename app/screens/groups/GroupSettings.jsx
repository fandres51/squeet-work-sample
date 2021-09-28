import { View, Text, StyleSheet } from 'react-native';
import * as React from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';

const GroupSettings = () => {

    const navigation = useNavigation();
    const route = useRoute();
    const group = route.params.group;

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Text style={styles.headerBtns}>Save</Text>
            ),
            headerLeft: () => (
                <TouchableOpacity onPress={()=>navigation.goBack()}>
                    <Text style={styles.headerBtns}>Cancel</Text>
                </TouchableOpacity>
            ),
            headerTitleStyle: { color: 'black', flex: 1, textAlign:"center" }
        })
    })

    return (  
        <View style={styles.container}>
            {
                group.decision_type?
                <View style={styles.option}>
                    <Text style={styles.text}>Decition Tool</Text>
                    <Text style={styles.text}>{group.decision_type}{' >'}</Text>
                </View>
                :
                <View style={styles.option}>
                    <Text style={styles.text}>Decition Tool</Text>
                    <Text style={styles.text}>Swipe and Match {' >'}</Text>
                </View>
            }
        </View>
    );
}
 
export default GroupSettings;

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1
    },
    option: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 70,
        borderBottomColor: '#b2aeaf',
        borderBottomWidth: 1,
        paddingHorizontal: 20

    },
    text: {
        color: '#b2aeaf',
    },
    headerBtns: {
        marginLeft: 20,
        marginRight: 20,
        color: '#9b9ca0'
    }
})