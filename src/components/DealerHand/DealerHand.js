// /home/harvest/hack/react-jack/src/components/DealerHand/DealerHand.js
import React from 'react';
import './DealerHand.css';

const DealerHand = ({ hand, score, showScore }) => {
  return (
    <>
      <div className="pt-24" id="dealer-cards">
        {hand.map((card, i) => (
          <div key={i} className={`card ${card} w-24 h-36 sm:w-16 sm:h-24`}></div>
        ))}
      </div>
      {showScore && (
        <div className={`score ${showScore ? 'visible' : ''}`} id="dealerhandvalue">
          {score}
        </div>
      )}
    </>
  );
};

export default DealerHand;
