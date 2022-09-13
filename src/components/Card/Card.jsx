import React from "react";
import "./Card.scss";
const Card = ({ card }) => {
  return (
    <div className="card-item">
      {card.cover && (
        <img
          src={card.cover}
          alt="benjamintruong_alt"
          className="card-cover"
          onMouseDown={(e) => e.preventDefault()}
        />
      )}
      {card.title}
    </div>
  );
};

export default Card;
