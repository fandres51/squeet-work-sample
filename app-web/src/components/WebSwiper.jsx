import './WebSwiper.css';
import * as React from 'react';
import Card from './Card';
import axios from 'axios';
import API from '../Api';
import NewOptionCard from './NewOptionCard';
import Comments from './Comments';
import AddCard from './AddCard';

function WebSwiper(props) {

  const [cards, setCards] = React.useState([]);
  const [currentCard, setCurrentCard] = React.useState(0);
  const [newOprionWasSwiped, setNewOprionWasSwiped] = React.useState(false);
  const [showingComments, setShowingComments] = React.useState(false);
  const [showingAddCard, setShowingAddCard] = React.useState(false);

  async function like() {
    console.log(API);
    console.log(API.AUTH_HEADER());
    await axios.post(API.API_BASE + "groups/" + props.group.id + "/like", { card_id: cards[currentCard].id }, { headers: API.AUTH_HEADER() });
    setCurrentCard(currentCard + 1);
    if (cards.length - currentCard - 0 > 0) {
      document.title = "Group Swipe Results on Squeet";
      setNewOprionWasSwiped(false);
    } else {
      document.title = "[*] " + (cards.length - currentCard - 1) + " cards left | " + props.group.name + (props.isEsp ? " en" : " on") + " Squeet";
    }
    if (currentCard + 1 >= cards.length) {
      props.doneSwiping();
    }
  }
  async function dislike() {
    await axios.post(API.API_BASE + "groups/" + props.group.id + "/dislike", { card_id: cards[currentCard].id }, { headers: API.AUTH_HEADER() });
    if (cards.length - currentCard - 0 > 0) {
      document.title = "Group Swipe Results on Squeet";
      setNewOprionWasSwiped(false);
    } else {
      document.title = "[*] " + (cards.length - currentCard - 1) + " cards left | " + props.group.name + (props.isEsp ? " en" : " on") + " Squeet";
    }
    if (currentCard + 1 >= cards.length) {
      props.doneSwiping();
    }
    setCurrentCard(currentCard + 1);
  }

  function back() {
    const cardsLeft = props.isEsp ? ("Quedan " + (cards.length - currentCard + 1) + " cartas") : ((cards.length - currentCard + 1) + "cards left");
    document.title = "[*] " + cardsLeft + " | " + props.group.name + (props.isEsp ? " en" : " on") + " on Squeet";
    setCurrentCard(currentCard - 1);
  }

  function newOption() {
    setShowingAddCard(true);
    setNewOprionWasSwiped(true);
  }

  function noNewOption() {
    setNewOprionWasSwiped(true);
  }

  function showComments() {
    setShowingComments(true);
    props.showEmail(false);
    props.showTitle(false);
  }

  function hideComments() {
    setShowingComments(false);
    props.showEmail(true);
    props.showTitle(true);
  }
  
  function goBack() {
    setShowingAddCard(false);
  }

  React.useEffect(function () {
    async function run() {
      if (!props.group) { return; }
      try {
        const resp = await axios.get(API.API_BASE + "groups/" + props.group.id + "/cards", { headers: API.AUTH_HEADER() });
        console.log(resp);
        if (cards.length - currentCard - 0 > 0) {
          const cardsLeft = props.isEsp ? ("Quedan " + resp.data.filteredCards.length + " cartas") : (resp.data.filteredCards.length + "cards left");
          document.title = "*" + cardsLeft + "| " + props.group.name + (props.isEsp ? " en" : " on") + " Squeet";
        } else {
          document.title = "Group Swipe Results on Squeet";
          setNewOprionWasSwiped(true);
        }
        setCards(resp.data.filteredCards);
      } catch (err) {
        if (err.response) {
          alert(err.response.error);
        }
      }
    }
    run();
  }, [props.group]);


  // const

  return (
    <div className="WebSwiper">
      {
        cards.length > 0 && currentCard < cards.length && !showingComments &&
        <div className="WSSwiper">
          <div className="WSCard">
            <Card card={cards[currentCard]} showComments={showComments}/>
          </div>
          <div className="WSButtons">
            <div className="cardCounter">{!props.isEsp ? "Choice" : "Opciones"} {currentCard + 1}/{cards.length}</div>
            <div className="buttonFrame">
              <img onClick={dislike} className="button" src="/img/dislike.png" alt="Dislike" />
              {currentCard !== 0 && <img onClick={back} className="button" src="/img/back.png" alt="Back" />}
              <img onClick={like} className="button" src="/img/like.png" alt="Like" />
            </div>
          </div>
        </div>
      }
      {
        cards.length > 0 && currentCard < cards.length && showingComments &&
        <div>
          <Comments card={cards[currentCard]} group={props.group} comeBack={hideComments}></Comments>
        </div>
      }
      {
        currentCard >= cards.length && props.results.length > 0 && !newOprionWasSwiped &&
        <div>
          <div className="WSCard">
            <NewOptionCard></NewOptionCard>
          </div>
          <div className="WSButtons">
            <div className="buttonFrame">
              <img onClick={noNewOption} className="button" src="/img/dislike.png" alt="Dislike" />
              <img onClick={newOption} className="button" src="/img/like.png" alt="Like" />
            </div>
          </div>
        </div>
      }
      {
        currentCard >= cards.length && props.results.length > 0 && newOprionWasSwiped && !showingAddCard &&
        <div className="WSSwiper">
          <Card isEsp={props.isEsp} card={props.results[0].cardData} winner={props.results[0]} />
          <div className="voteButton">
            <button onClick={props.showVotes} className="seeVotes">{!props.isEsp ? "SEE VOTES" : "VER VOTOS"}</button>
            {/* <button onClick={props.showVotes} className="seeVotes">{!props.isEsp ? "SEE VOTES" : "VER VOTOS"}</button> */}
          </div>
          <div className="voteButton">
            <button onClick={newOption} className="seeVotes">ADD OPTION</button>
          </div>
          <>
            <div className="footer">
              <h2 className="orange">KEEP GROUP DECISIONS SIMPLE</h2>
              <p style={{ marginTop: -15 }}>Join the Squeet Squad now!</p>
              <div className="icons">
                <a href="https://apps.apple.com/us/app/squeet/id1524130336"><img style={{ width: 150 }} src="/img/appstore.jpeg" alt="Squeet App Store Download Button" /></a>
                <a href="https://play.google.com/store/apps/details?id=com.invenovate.squeet"><img style={{ width: 150 }} src="/img/googleplay.jpg" alt="Squeet Google Play Store Download Button" /></a>
              </div>
            </div>
          </>
        </div>
      }
      {
        currentCard >= cards.length && props.results.length > 0 && newOprionWasSwiped && showingAddCard &&
        <div>
          <AddCard deckId={props.group.deck_id} goBack={goBack}></AddCard>
        </div>
      }
    </div>
  );
}

export default WebSwiper;
