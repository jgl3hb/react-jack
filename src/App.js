import React, { useState, useEffect, useCallback } from 'react';
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
  const [deck, setDeck] = useState(deckData);
  const [status, setStatus] = useState('Player, make a bet');
  const [playerScore, setPlayerScore] = useState(0);
  const [dealerScore, setDealerScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

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
    return value;
  };
  
  const computeHandTotal = useCallback((hand) => {
    let total = hand.reduce((acc, card) => acc + cardLookup(card), 0);
    return handleAces(hand, total);
  }, []); 
  

  const handleAces = (hand, total) => {
    let aces = hand.filter(card => card[1] === 'A');
    aces.forEach(() => { if (total > 21) total -= 10; });
    return total;
  };
  
  const renderCardRow = (hand) => {
    // Map the cards 
    return hand.map((card, i) => (
      <div key={i} className={`card ${card} w-24 h-36 sm:w-16 sm:h-24`}></div>
    ));
  };

  const handleBet = (betAmount) => {
    if (playerBank >= betAmount) {
      setPlayerHand([]);
      setDealerHand([]);
      setPlayerScore(0);
      setDealerScore(0);
      setGameOver(false);
      setStatus(`Player Bet is $${betAmount}, Press Deal`);
      setCurrentBet(betAmount);
      setPlayerBank(playerBank - betAmount);
    } else {
      setStatus(`You don't have enough money. Game over.`);
    }
  };

  const selectCard = () => {
    const newDeck = [...deck];
    const selectedCard = newDeck.splice(Math.floor(Math.random() * newDeck.length), 1)[0];
    setDeck(newDeck);
    return selectedCard;
  };

  const dealCard = (hand, callback) => {
    const newHand = [...hand, selectCard()];
    callback(newHand);
  };

  const checkForBlackjack = (hand) => {
    //Blackjack must include and Ace and a 10 or face card
    return hand.includes('A') && (hand.includes('10') || hand.includes('J') || hand.includes('Q') || hand.includes('K'));
  };

  const initialDeal = () => {
    if (!gameOver && playerHand.length === 0 && dealerHand.length === 0) { 
      let tempPlayerHand = [];
      let tempDealerHand = [];
      for (let i = 0; i < 2; i++) { 
        tempPlayerHand.push(selectCard());
        tempDealerHand.push(selectCard());
      }
      setPlayerHand(tempPlayerHand);
      setDealerHand(tempDealerHand);
  
      // Check for blackjack after deal
      const playerBlackjack = checkForBlackjack(tempPlayerHand);
      const dealerBlackjack = checkForBlackjack(tempDealerHand);
  
      // Update state based on blackjack check
      if (playerBlackjack || dealerBlackjack) {
        // End the game if blackjack is dealt
        setGameOver(true); 
        setStatus(playerBlackjack ? "Player has Blackjack!" : "Dealer has Blackjack!");
        if (playerBlackjack) {
          // Payout for blackjack
          setPlayerBank(playerBank + currentBet * 1.5); 
        }
        if (dealerBlackjack) {
          // Dealer blackjack logic
        }
        if (playerBlackjack && dealerBlackjack) {
          setStatus("Both Player and Dealer have Blackjack! It's a tie.");
        }
      } else {
        setStatus('Hit or Stand?');
      }
    } else {
    }
  };
  
  const hit = () => {
    if (!gameOver && playerHand.length > 0) { 
      dealCard(playerHand, (newHand) => {
        setPlayerHand(newHand);
        const newScore = computeHandTotal(newHand);
        setPlayerScore(newScore);
        if (newScore > 21) {
          setGameOver(true);
          setStatus("Player Busts, Dealer Wins");
        }
      });
    }
  };

  const stand = () => {
    if (!gameOver && playerHand.length > 0) {
      let newDealerHand = [...dealerHand];
      while (computeHandTotal(newDealerHand) <= 17) {
        newDealerHand.push(selectCard());
      }
      setDealerHand(newDealerHand);
      const newDealerScore = computeHandTotal(newDealerHand);
      setDealerScore(newDealerScore);
      renderWin(playerScore, newDealerScore);
    }
  };

  const renderWin = (playerScore, dealerScore) => {
    if (playerScore > 21) {
      setGameOver(true);
      setCurrentBet(0);
      setStatus("Player Busts, Dealer Wins");
    } else if (dealerScore > 21) {
      setGameOver(true);
      setPlayerBank(playerBank + currentBet * 2);
      setCurrentBet(0);
      setStatus("Dealer Busts, Player Wins!");
    } else if (playerScore > dealerScore && playerScore <= 21) {
      setGameOver(true);
      setPlayerBank(playerBank + currentBet * 2);
      setCurrentBet(0);
      setStatus("Player Wins!");
    } else if (playerScore === dealerScore) {
      setGameOver(true);
      setPlayerBank(playerBank + currentBet);
      setCurrentBet(0);

      setStatus("Push");
    } else {
      setGameOver(true)
      setCurrentBet(0)
      setStatus("Dealer Wins")
    }
  };

  const resetGame = () => {
    setPlayerHand([]);
    setDealerHand([]);
    setPlayerBank(500);
    setCurrentBet(0);
    setDeck(deckData);
    setStatus('Game reset. Place your bet!');
    setGameOver(false);
  };

  useEffect(() => {
    setPlayerScore(computeHandTotal(playerHand));
    setDealerScore(computeHandTotal(dealerHand));
  }, [playerHand, dealerHand, computeHandTotal]);
  
  return (
    <div className="min-h-screen p-4 flex flex-col items-center justify-center">
    <div className="pt-4" id="dealer-cards">
      {renderCardRow(dealerHand)}
    </div>
  {gameOver && (
      <div className="text-white text-4xl mb-4" id="dealerhandvalue">{dealerScore}</div>
      )}
      <div className="text-white text-4xl mb-4" id="playerBank">Blackjack</div>
      <div className="text-white text-4xl mb-4" id="playerBank">Pays 3 to 2</div>
      <div className="text-white text-xl" id="status">{status}</div>
      <div className="p-0 m-0" id="player-cards">
        {renderCardRow(playerHand)}
      </div>    
      <div className="text-white text-4xl" id="playerhandvalue">{playerScore}</div>
      <div className="flex space-x-4 mb-4">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => {
            if (!gameOver) {
              initialDeal();
            }
          }}>Deal</button>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={hit}>Hit</button>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={stand}>Stand</button>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={resetGame}>Reset</button>
      </div>
      <div className="flex space-x-4 mb-4" id="betting-area">
        <button className="relative bg-red-500 text-black font-bold py-2 rounded-full w-12 h-12" onClick={() => handleBet(1)}>
          <span className="relative z-10">$1</span>
          <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-full" style={{ width: '70%', height: '70%' }}></span>
        </button>
        <button className="relative bg-blue-500 text-black font-bold py-2 rounded-full w-12 h-12" onClick={() => handleBet(5)}>
          <span className="relative z-10">$5</span>
          <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-full w-8 h-8"></span>
        </button>
        <button className="relative bg-green-500 text-black font-bold py-2 rounded-full w-12 h-12" onClick={() => handleBet(25)}>
          <span className="relative z-10">$25</span>
          <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-full w-8 h-8"></span>
        </button>
        <button className="relative bg-yellow-500 text-black text-xs font-bold py-2 rounded-full w-12 h-12" onClick={() => handleBet(100)}>
          <span className="relative z-10">$100</span>
          <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-full w-8 h-8"></span>
        </button>
      </div>
      <div className="text-white text-4xl mb-4" id="playerBank">${playerBank}</div>
    </div>
  );
};

export default Blackjack;
