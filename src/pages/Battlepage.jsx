import { useState } from "react";

export default function Battlepage() {
  const [targetSyntax, setTargetSyntax] = useState("");
  const [userInput, setUserInput] = useState("");
  const [isGameActive, setIsGameActive] = useState(false);
  const [enemyHealth, setEnemyHealth] = useState(20);

  const syntaxs = [
    "console.log();",
    "const express = require('express');",
    "const app = express();",
  ];

  const startGame = () => {
    prepareSyntax();
    setIsGameActive(true);
  };

  const prepareSyntax = () => {
    const randomIndex = Math.floor(Math.random() * syntaxs.length);
    setTargetSyntax(syntaxs[randomIndex]);
    setUserInput("");
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setUserInput(value);

    if (value === targetSyntax) {
      const damage = 10;
      console.log(enemyHealth, "ENEMY HEALTH BEFORE SET");
      setEnemyHealth((prev) => prev - damage);
      console.log(enemyHealth, "ENEMY HEALTH AFTER SET");
      if (enemyHealth <= 10) {
        endGame();
      } else {
        prepareSyntax();
      }
    }
  };

  const getHighlightedText = () => {
    const textArray = targetSyntax.split("");
    const inputArray = userInput.split("");

    return textArray.map((char, index) => {
      let className = "";
      if (inputArray[index] === char) {
        className = "text-green-200";
      } else if (inputArray[index] !== undefined) {
        className = "text-red-800";
      }

      return (
        <span key={index} className={className}>
          {char}
        </span>
      );
    });
  };

  const endGame = () => {
    setIsGameActive(false);
    console.log("You win!");
  };

  return (
    <div className="flex flex-col h-screen items-center justify-center gap-6">
      <h1 className="text-3xl">Battle Syntax</h1>
      {isGameActive ? (
        <div className="flex flex-col justify-center items-center gap-4">
          <p>Enemy Health: {enemyHealth}</p>
          <div className="bg-secondary px-5 py-3 rounded-md">
            {getHighlightedText()}
          </div>
          <input
            type="text"
            value={userInput}
            onChange={handleChange}
            className="w-full rounded-md px-4"
          />
        </div>
      ) : (
        <button className="btn btn-primary" onClick={startGame}>
          Start Game
        </button>
      )}
    </div>
  );
}
