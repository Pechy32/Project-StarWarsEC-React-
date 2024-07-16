import React, { useState } from 'react';
import './card.css';

const Card = ({ title, backTitle, subtitleFront, backSubtitle1, backSubtitle2, backDesc1, backDesc2, attributes, footerText, avatarURL, iconURL, iconText }) => {
  const [flipped, setFlipped] = useState(false);

  const handleClick = () => {
    setFlipped(!flipped);
  };

  return (
    <div className={`pechy-card-container ${flipped ? 'flipped' : ''}`} onClick={handleClick}>
      <div className="pechy-card">
        <div className="pechy-card-front">
          <div className="pechy-card-body">
            <div className='pechy-card-icon'>{iconURL ? <img src={iconURL}></img> : iconText ? iconText : ""}</div>
            <img src={avatarURL}></img>
            <h4 className="pechy-card-title">{title ? title : "Title"}</h4>
            <p className="pechy-card-text">{subtitleFront ? subtitleFront : ""}</p>
            <div className='saber-hr'></div>
            <ul className='my-ul'>
              {attributes ? attributes.map((attribute, index) => (
                <li key={index}>
                  <em>{attribute.name}: {attribute.value}</em>
                </li>
              )) : ""}
            </ul>
          </div>
        </div>
        <div className="pechy-card-back">
          <div className='pechy-card-header'><h5 className="pechy-card-title">{backTitle}</h5></div>
          <div className="pechy-card-body">
            <h5>{backSubtitle1}</h5>
            <em>{backDesc1}</em>
            <hr></hr>
            <h5>{backSubtitle2}</h5>
            <em>{backDesc2}</em>
          </div>
          <div className='pechy-card-footer'><small>{footerText ? footerText : ""}</small></div>
        </div>
      </div>
    </div>
  );
};

export default Card;