import './WebSwiper.css';
import * as React from 'react';
import './Card.css';
import { FaShareSquare } from 'react-icons/fa';

function Card(props) {
  // const
  return (
    <div className="Card">
      <div className="image-container">
        {
          props.winner &&
          <div className="winner-overlay">
            <div className="overlay">
              <h2 className="winner-text">{props.isEsp ? "Opción Favorita" : "FAV GROUP CHOICE"}!</h2>
              <h2>{Math.round(props.winner.percentLiked)}% {props.isEsp ? "me gusta" : "liked"}</h2>
              <h3>{(100 - Math.round(props.winner.percentDisliked + props.winner.percentLiked))}% {props.isEsp ? "no deslizado" : " not swiped"}</h3>
            </div>
            <img className="card-image" src={props.card.image} />
          </div>
        }
      </div>
      <div className="detail">
        <h2 className="card-name">{props.card.name}</h2>
        <p className="card-detail">{props.card.description}</p>
      </div>
      <div className="card-footer">
        {
          !props.winner &&
          <div className="comment-btn-container">
          <button className="comment-btn" onClick={()=>props.showComments()}>
            <img className="comment-img" src="/img/comment.png" alt="comment"/>
            <p className="comment-btn-text">Add comment</p>
          </button>
        </div>}
        {
          props.card.url &&
          <div className="url-div">
            <p className="url"><a target="_blank" href={props.card.url}>Open in web <FaShareSquare /></a></p>
          </div>
        }
      </div>
    </div>
  );
}

export default Card;
