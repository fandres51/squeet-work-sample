import * as React from 'react';
import './VotesPopup.css';

function VotesPopup({ close, card, isEsp }) {
  console.log(card);
  return (
    <div className="VotesPopup">
      {
      card && (
        <div className="container">
          <div>
            <img onClick={close} src="/img/x.png" className="x" width={14} alt="Close" />
          </div>
          <div className="flex-container">
          <div>
            <div className="liked-header">
              <img style={{maxWidth: 50}} src="/img/likes.png" />
              {Math.round(card.percentLiked)}% <br />
              {isEsp ? "me gusta" : "LIKED" }
            </div>
            <ul className="votes-ul">
              {
                card.likers.map(liker => <li className="votes-li">{liker}</li>)
              }
            </ul>
          </div>
          <div>
            <div className="disliked-header">
            <img style={{maxWidth: 50}} src="/img/dislikes.png" />
            {Math.round(card.percentDisliked)}%<br />
            { isEsp ? "no me gusta" : "DISLIKED" }
            </div>
            <ul className="votes-ul">
              {
                card.dislikers.map(liker => <li className="votes-li">{liker}</li>)
              }
            </ul>
          </div>
          <div>
            <div className="waiting-header">
            <img style={{maxWidth: 50}} src="/img/waiting.png" />
            {(100 - Math.round(card.percentDisliked + card.percentLiked))}%<br />
              { isEsp ? "no deslizado" : "WAITING" }
            </div>
            <ul className="votes-ul">
              {
                card.nonVoters.map(liker => <li className="votes-li">{liker}</li>)
              }
            </ul>
          </div>
          </div>
        </div>
    )
    }
    </div>
  );
}

export default VotesPopup;
