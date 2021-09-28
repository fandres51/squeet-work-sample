
import * as React from 'react';
import './CardImage.css';

function CardImage(props) {

  const [cards, setCards] = React.useState([]);
  const [currentCard, setCurrentCard] = React.useState(0);

  // const

  return (
    <div className="CardImage">
      <img src={props.card.image} />
    </div>
  );
}

export default CardImage;
