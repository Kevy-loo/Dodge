import React, { useState, useEffect } from "react";
import Character from "./Character";

function GameScreen() {

  let posX = "200px";
  let posY = 0;
  const handleKeyPress = (e) => {
    if (e.key === "ArrowLeft") {
      console.log(e.key);
    }
    if (e.key === "ArrowRight") {
    }
    if (e.key === "ArrowUp") {
    }
    if (e.key === "ArrowDown") {
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  return (
    <div>
      <div>gameScreen</div>
        <Character style={{left: posX, position: "absolute"}}/>
    </div>
  );
}

export default GameScreen;
