import { useNavigation, useRoute } from '@react-navigation/native';
import * as React from 'react';
import { Text, StyleSheet, TouchableOpacity, View, Image, Alert, FlatList, Modal, Pressable, Button } from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import ButtonWithIcon from '../../components/ButtonWithIcon';
import RBSheet from "react-native-raw-bottom-sheet";
import axios from 'axios';
import apiBase from '../../constants/Api';
import { authHeader } from '../../auth';
import { AntDesign } from '@expo/vector-icons';

export default class SelectDecisionTypeScreen extends React.Component {

  constructor(props) {
    super(props);
    this.props.navigation.setOptions({ title: this.props.route.params.creatable ? "Select Decision Tool" : "Squeet Tools" });
    this.state = {
      activeIndex: props.route.params.decision_type,
      activeModal: false,
      info: [
        {
          name: 'SWIPE & MATCH',
          description: 'Send a decision deck to your squad and swipe left and right to like or dislike choices. We will show the favorite group choice at the end.',
          img: require('../../assets/images/decision-tools/swipe-match.png'),
          active: true
        },
        {
          name: 'KING OF KINGS',
          description: 'Compare two choices at a time until your group ends up with a group winner.',
          img: require('../../assets/images/decision-tools/king-of-kings.png'),
          active: false
        },
        {
          name: 'UPVOTE',
          description: 'Upvote your favorite choices to find the most likeable ones.',
          img: require('../../assets/images/decision-tools/upvote.png'),
          active: false
        }
      ]
    }
  }

  selectFromTemplate = async (decision_type) => {
    const group = {
      decision_type: decision_type
    }
    this.props.navigation.push('ConfigureGroup', { group: group });
  };

  createFromScratch = async (decision_type) => {
    const resp = await axios.post(apiBase.apiBase + "deck/new", {}, { headers: await authHeader() });
    this.props.navigation.push('EditDeck', { group: { deck_id: resp.data.id, decision_type }, isCreate: true, });
  };

  carrouselOption = ({ item, index }) => {
    // const route = useRoute();
    const itemName = item.name;
    return (
      <View style={styles.tool}>
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.activeModal}
          onRequestClose={() => {
            this.setState({ activeModal: !this.state.activeModal });
          }}
        >
          <View style={styles.dialog}>
            <View style={{width: '100%'}}>
              <AntDesign name="close"  style={{marginLeft: 'auto'}} size={24} color="orange" onPress={() => this.setState({ activeModal: !this.state.activeModal })} />
            </View>
            <View>
              <Image style={styles.soonImage} source={require('../../assets/images/decision-tools/coming-soon.png')} />
            </View>
            <View style={styles.textSoon}>
              <Text>We appreciate your interest, right now this tool is under development, but you can try its beta version when ready</Text>
            </View>
            <View>
              <Button color="#F89420" title="ADD ME TO A BETA WAITLIST" onPress={
                async () => {
                  axios.post(apiBase.apiBase + "bracket/subscribe", {}, { headers: await authHeader() });
                  this.setState({ activeModal: !this.state.activeModal });
                }
              }></Button>
            </View>
          </View>
        </Modal>
        <View style={styles.toolImageCont}>
          <Image style={styles.toolImage} source={item.img}></Image>
        </View>
        {
          this.props.route.params.creatable &&
          <View style={styles.toolNameCont}>
            <ButtonWithIcon
              text={item.name}
              action={item.active ? () => {
                this.RBSheet.open()
              }
                : () => this.setState({ activeModal: !this.state.activeModal })

              }
              style={styles.button}
            ></ButtonWithIcon>
          </View>

        }
        <View style={styles.toolDescCont}>
          <Text style={styles.toolDesc}>{item.description}</Text>
        </View>
      </View>
    );
  }

  get Dots() {
    const { activeIndex, info } = this.state;
    return (
      <Pagination
        dotsLength={info.length}
        activeDotIndex={activeIndex}
        dotStyle={{
          width: 10,
          height: 10,
          borderRadius: 5,
          marginHorizontal: 8,
          backgroundColor: '#f7941d'
        }}
      />
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <Carousel
          style={{ width: '100%' }}
          layout={"default"}
          data={this.state.info}
          renderItem={this.carrouselOption}
          sliderWidth={400}
          itemWidth={400}
          onSnapToItem={(index) => {
            this.setState({ activeIndex: index })
            console.log(index);
          }}
        />
        {this.Dots}
        <RBSheet
          ref={ref => {
            this.RBSheet = ref;
          }}
          height={120}
          openDuration={250}
          customStyles={{
            container: {
              justifyContent: "center",
              alignItems: "center"
            }
          }}
        >
          <TouchableOpacity style={styles.optionBox} onPress={() => {
            this.createFromScratch(this.state.activeIndex);
            this.RBSheet.close();
          }}>
            <Image style={styles.optionIcon1} source={require('../../assets/images/new_from_scratch.png')}></Image>
            <Text style={styles.optionText}>{'NEW FROM SCRATCH'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionBox} onPress={() => {
            this.selectFromTemplate(this.state.activeIndex);
            this.RBSheet.close();
          }}>
            <Image style={styles.optionIcon2} source={require('../../assets/images/use_template.png')}></Image>
            <Text style={styles.optionText}>{'NEW FROM TEMPLATE'}</Text>
          </TouchableOpacity>
        </RBSheet>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  tool: {
    flex: 1,
    width: '100%',
    flexDirection: 'column',
  },
  toolImageCont: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '75%'
  },
  toolImage: {
    width: '100%',
    height: '80%'
  },
  toolNameCont: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 'auto',
    marginLeft: 'auto',
  },
  toolName: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20
  },
  toolDescCont: {
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toolDesc: {
    textAlign: 'center',
    color: '#999b9e',
    width: 300,
  },
  inactive: {
    backgroundColor: '#fbc98f',
  },
  button: {
    width: '100%',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  optionBox: {
    width: '100%',
    height: 60,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopColor: '#9e9d9e',
    borderTopWidth: 1
  },
  optionText: {
    color: '#FF9405',
    marginLeft: 10,
    fontSize: 20,
    fontWeight: 'bold',
  },
  optionIcon1: {
    height: 25,
    width: 25,
  },
  optionIcon2: {
    height: 26,
    width: 20,
  },
  dialog: {
    flexDirection: 'column',
    backgroundColor: 'white',
    alignItems: 'center',
    width: 330,
    padding: 20,
    marginRight: 'auto',
    marginLeft: 'auto',
    marginTop: 130,
    borderRadius: 20,
    borderColor: '#6A6869',
    borderWidth: 1

  },
  soonImage: {
    height: 130,
    width: 150,
    marginBottom: 30
  },
  textSoon: { 
    marginBottom: 20,
  },

});
