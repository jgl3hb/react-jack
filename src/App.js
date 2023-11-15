import React, { useState, useEffect } from 'react';
import './App.css';
import './cardstarter.css';

const deckData = [
    "dA", "dQ", "dK", "dJ", "d10", "d09", "d08", "d07", "d06", "d05", "d04", "d03", "d02",
    "hA", "hQ", "hK", "hJ", "h10", "h09", "h08", "h07", "h06", "h05", "h04", "h03", "h02",
    "cA", "cQ", "cK", "cJ", "c10", "c09", "c08", "c07", "c06", "c05", "c04", "c03", "c02",
    "sA", "sQ", "sK", "sJ", "s10", "s09", "s08", "s07", "s06", "s05", "s04", "s03", "s02"
  ];

const Blackjack = () => {
  const [playerHand, setPlayerHand] = useState([]);
  const [dealerHand, setDealerHand] = useState([]);
  const [playerBank, setPlayerBank] = useState(500);
  const [currentBet, setCurrentBet] = useState(0);
  const [deck, setDeck] = useState(deckData)
  const [status, setStatus] = useState('');
  const [playerScore, setPlayerScore] = useState(0);
  const [dealerScore, setDealerScore] = useState(0);
  const [gameover, setGameOver] = useState(false);

  const cardLookup = (card) => {
    const cardValueStr = card.slice(1);
    let value;
    if (cardValueStr === 'A') {
      value = 11;
    } else if (['K', 'Q', 'J'].includes(cardValueStr)) {
      value = 10; 
    } else {
      value = parseInt(cardValueStr, 10);
    }
  };
  
  const computeHandTotal = (hand) => {
    const total = handleAces(hand, hand.reduce(total, card => total + cardLookup(card), 0));
    console.log('computeHandTotal:', hand, total);
    return total;
  };

  const handleAces = (hand, total) => {
    let aces = hand.filter(card => card[1] === 'A');
    aces.forEach(() => { if  (total > 21) total -= 10; });
    return total;
  };

  const renderCard = (hand, deckId) => {
    return hand.map((card, i) => (
      <div
        key={i}
        className={"card large ${deckId === 'dealer-cards' && i == 1 && !gameOver ? 'back-red' : card}"}>
        </div>
    ));
  };

  const handleBet = (betAmount) => {
    if (playerBank >= betAmount) {
      setPlayerHand([]);
      setDealerHand([]);
      setPlayerScore(0);
      setDealerScore(0);
      setGameOver(false);
      setStatus('Player Bet is $${betAmount}, Press Deal');
      setCurrentBet(betAmount);
      setPlayerBank(playerBank - betAmount);      
    } else {
      setStatus("You don't have enough money. Game Over.")
    }
  }

  const selectCard = () => {
    const newDeck = [...deck];
    const selectedCard = newDeck.splice(Math.floor(Math.random() * newDeck.length), 1)[0];
    setDeck(newDeck);
    return selectedCard;
  }

  const dealCard = (hand, callback) => {
    const newHand = [...hand, selectCard()];
    callback(newHand);
  };

  const checkForBlackjack = (hand) => {
    return hand.includes('A' && hand.includes('10') || hand.includes('J') || hand.includes('Q') || hand.includes('K'));
  };






  return (
    <div>
    setStatus
    dealerHand
    playerHand
    playerScore
    deal
    hit
    stand 
    reset game

    </div>  
  );

};

export default Blackjack;
