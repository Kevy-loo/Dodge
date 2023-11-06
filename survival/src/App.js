import React, { useState } from 'react';
import Game from './components/Game.jsx';
import StartScreen from './components/StartScreen.jsx';

function App() {
  const [gameStarted, setGameStarted] = useState(false);

  const startGame = () => {
    setGameStarted(true);
  }

  return (
    <div className="App">
      {gameStarted ? (
        <Game />
      ) : (
        <StartScreen onStartGame={startGame} />
      )}
    </div>
  );
}

export default App;
