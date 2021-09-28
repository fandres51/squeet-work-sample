import * as React from 'react';
import { View, StyleSheet, Text, Image, TextInput, Button, Group, Alert } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import { authHeader } from '../../../auth';
import apiBase from '../../../constants/Api';
import { Ionicons } from '@expo/vector-icons';

const CommentsScreen = () => {

    const [comment, setComment] = React.useState("");
    const [comments, setComments] = React.useState([]);
    const navigation = useNavigation();
    const route = useRoute();
    const group = route.params.group;
    const card = route.params.card;

    React.useEffect(() => {
        async function fetchData() {
            const response = await axios.get(apiBase.apiBase + "groups/" + group.id + "/card/" + card.id + "/comments", { headers: await authHeader() });
            setComments(response.data);
        }
        fetchData()
    }, []);
    

      async function addComment() {
          const commentObj = {
              text: comment
          }
        const response = await axios.post(apiBase.apiBase + "groups/" + group.id + "/card/" + card.id + "/addComment", commentObj, { headers: await authHeader() });
        const newComments = comments.concat([response.data]);
        setComments(newComments);
      }

    return (
        <View style={styles.commentsContainer}>
            <View style={styles.comCardContainer}>
                <View style={styles.comCardImageContainer}>
                    {/* <img src={card.image} alt="card-image" style={styles.comCardImage} /> */}
                    <Image source={{ uri: card.image }} style={styles.comCardImage}></Image>
                </View>
                <View style={styles.comCardDescContainer}>
                    <Text style={styles.comCardName}>{card.name}</Text>
                    <Text style={styles.comCardDesc}>{card.description}</Text>
                </View>
            </View>
            <View style={styles.comComments}>
                {
                    comments.map(comment => (
                        <View style={styles.comComment}>
                        <View style={styles.comCommentTh}>
                            <Image style={styles.comCommentUserImg} source={comment.image_url || require("../../../assets/images/user.png")} alt="user" />
                            <Text style={styles.comCommentUserName}>{comment.name}</Text>
                        </View>
                        <View>
                            <Text style={styles.comComment}>{comment.content}</Text>
                        </View>
                    </View>    
                    ))
                }
            </View>
            <View style={styles.comAddCommentCont}>
                <View style={{ width: '100%' }}>
                    <View style={styles.comCommentTh}>
                        <Image style={styles.comAddCommentImg} source={require("../../../assets/images/circle-logo.png")} alt="user" />
                        <Text style={styles.comAddCommentName}>Add comment</Text>
                    </View>
                    <View style={{flexDirection:'row', justifyContent:'space-between', alignItems: 'center'}}>
                        <TextInput
                            style={styles.comAddCommentInput}
                            onChangeText={setComment}
                            value={comment}
                            placeholder="Comment text"
                            onSubmitEditing={addComment}
                        />
                        <Ionicons name="send-sharp" size={24} color="#F59120" onPress={()=>Alert.alert('hello')}/>
                    </View>
                </View>
            </View>
        </View>
    );
}

export default CommentsScreen;

const styles = StyleSheet.create({
    commentsContainer: {
        width: '100%',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        zIndex: 1,
        paddingHorizontal: 20,
        flex: 1,
    },
    comCardContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginVertical: 20,
    },
    comCardImageContainer: {
        width: 100,
        height: 100,
    },
    comCardImage: {
        width: 100,
        height: 100,
    },
    comCardDescContainer: {
        marginLeft: 10,
        flexDirection: 'column',
        alignItems: 'flex-start'
    },
    comCardName: {
        fontSize: 20,
        color: '#f89520',
        fontWeight: 'bold',
        margin: 0,
    },
    comCardDesc: {
        fontSize: 15,
        margin: 0,
    },
    comAddCommentImg: {
        width: 15,
        height: 15,
    },

    comCommentTh: {
        flexDirection: 'row',
        marginTop: 10,
        marginBottom: 7,
    },

    comCommentUserImg: {
        width: 20,
        height: 20,
        margin: 3,
        marginRight: 10,
    },
    comCommentUserName: {
        fontSize: 20,
        fontWeight: 'bold',
        margin: 0,
    },
    comAddCommentName: {
        fontSize: 20,
        fontWeight: 'bold',
        margin: 0,
    },
    comComment: {
        color: '#98999d',
        margin: 0,
    },
    comAddCommentCont: {
        position: 'absolute',
        width: '100%',
        marginHorizontal: 20,
        bottom: 10,
        textAlign: 'left',
        zIndex: 2,
        borderTopColor: 'black',
        borderTopWidth: 1,
    },
    comAddCommentImg: {
        width: 30,
        height: 30,
        marginRight: 10,
    },
    comAddCommentInput: {
        width: '85%',
        padding: 8,
        borderRadius: 3,
        backgroundColor: '#dedede'
    },
})