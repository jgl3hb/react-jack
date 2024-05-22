// /home/harvest/hack/react-jack/src/StartScreen.js
import React, { useState } from 'react';

const StartScreen = ({ onStartGame }) => {
  const [numPlayers, setNumPlayers] = useState(1);

  const handleStartGame = () => {
    onStartGame(numPlayers);
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-white mb-6">Blackjack Game</h1>
      <div className="mb-4">
        <label htmlFor="numPlayers" className="text-xl text-white">Number of CPU Players: </label>
        <select 
          id="numPlayers" 
          value={numPlayers} 
          onChange={(e) => setNumPlayers(Number(e.target.value))}
          className="ml-2 p-2 rounded"
        >
          {[1, 2, 3, 4].map(num => (
            <option key={num} value={num}>{num}</option>
          ))}
        </select>
      </div>
      <button 
        onClick={handleStartGame} 
        className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-700 transition"
      >
        Start Game
      </button>
    </div>
  );
};

export default StartScreen;
