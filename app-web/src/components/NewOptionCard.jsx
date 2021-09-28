import "./NewOptionCard.css";
import * as React from 'react';

const NewOptionCard = () => {
    return (  
        <div className="NOCContainer">
            <div className="NOCImgContainer">
                <img className="NOCImg" src="/img/add.png" alt="add"/>
            </div>
            <div className="NOCTxtContainer">
                <p className="NOCTxt">Swipe right if you would like to add another choice</p>
            </div>
        </div>
    );
}
 
export default NewOptionCard;