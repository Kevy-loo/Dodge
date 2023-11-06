import React from 'react';

const StartScreen = ({ onStartGame }) => {
  return (
    <div>
      <h1>Game Title</h1>
      <p>Instructions: Avoid the incoming red squares to earn points. Use your arrow keys to move.</p>
      <button onClick={onStartGame}>Start</button>
    </div>
  );
}

export default StartScreen;
