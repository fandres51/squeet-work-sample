import { Text, Button, Image, View, StyleSheet } from "react-native";
import { AntDesign } from '@expo/vector-icons';

const ComingSoonAlert = ({closeDialog, tool, addList}) => {
    return (
        <View>
            <View>
                <AntDesign name="close" size={24} color="orange" onPress={()=>{}}/>
            </View>
            <View>
                <Image source={require('../assets/images/decision-tools/coming-soon.png')} />
            </View>
            <View>
                <Text>We appreciate your interest in using {tool}, right now this tool is under development, but you can try its beta version when ready</Text>
            </View>
            <View>
                <Button title="ADD ME TO A BETA WAITLIST" onPress={()=>{}}></Button>
            </View>
        </View>
    );
}

export default ComingSoonAlert;

const styles = StyleSheet.create({
    container: {
        flexDirection: "column",
        alignItems: "center",
        width: 200
    }
})