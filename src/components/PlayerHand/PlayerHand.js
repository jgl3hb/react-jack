// /home/harvest/hack/react-jack/src/components/PlayerHand/PlayerHand.js
import React from 'react';
import './PlayerHand.css';

const PlayerHand = ({ hand, score }) => {
  return (
    <>
      <div className="p-0 m-0" id="player-cards">
        {hand.map((card, i) => (
          <div key={i} className={`card ${card} w-24 h-36 sm:w-16 sm:h-24`}></div>
        ))}
      </div>
      <div className="text-white text-4xl" id="playerhandvalue">{score}</div>
    </>
  );
};

export default PlayerHand;
