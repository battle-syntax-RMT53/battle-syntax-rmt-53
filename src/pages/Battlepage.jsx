// import { useState } from "react";

// export default function Battlepage() {
//   const [targetSyntax, setTargetSyntax] = useState("");
//   const [userInput, setUserInput] = useState("");
//   const [isGameActive, setIsGameActive] = useState(false);
//   const [enemyHealth, setEnemyHealth] = useState(20);

//   const syntaxs = [
//     "console.log();",
//     "const express = require('express');",
//     "const app = express();",
//   ];

//   const startGame = () => {
//     prepareSyntax();
//     setIsGameActive(true);
//   };

//   const prepareSyntax = () => {
//     const randomIndex = Math.floor(Math.random() * syntaxs.length);
//     setTargetSyntax(syntaxs[randomIndex]);
//     setUserInput("");
//   };

//   const handleChange = (e) => {
//     const value = e.target.value;
//     setUserInput(value);

//     if (value === targetSyntax) {
//       const damage = 10;
//       console.log(enemyHealth, "ENEMY HEALTH BEFORE SET");
//       setEnemyHealth((prev) => prev - damage);
//       console.log(enemyHealth, "ENEMY HEALTH AFTER SET");
//       if (enemyHealth <= 10) {
//         endGame();
//       } else {
//         prepareSyntax();
//       }
//     }
//   };

//   const getHighlightedText = () => {
//     const textArray = targetSyntax.split("");
//     const inputArray = userInput.split("");

//     return textArray.map((char, index) => {
//       let className = "";
//       if (inputArray[index] === char) {
//         className = "text-green-200";
//       } else if (inputArray[index] !== undefined) {
//         className = "text-red-800";
//       }

//       return (
//         <span key={index} className={className}>
//           {char}
//         </span>
//       );
//     });
//   };

//   const endGame = () => {
//     setIsGameActive(false);
//     console.log("You win!");
//   };

//   return (
//     <div className="flex flex-col h-screen items-center justify-center gap-6">
//       <h1 className="text-3xl">Battle Syntax</h1>
//       {isGameActive ? (
//         <div className="flex flex-col justify-center items-center gap-4">
//           <p>Enemy Health: {enemyHealth}</p>
//           <div className="bg-secondary px-5 py-3 rounded-md">
//             {getHighlightedText()}
//           </div>
//           <input
//             type="text"
//             value={userInput}
//             onChange={handleChange}
//             className="w-full rounded-md px-4"
//           />
//         </div>
//       ) : (
//         <button className="btn btn-primary" onClick={startGame}>
//           Start Game
//         </button>
//       )}
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import { ref, get } from "firebase/database";
import { useParams, useNavigate } from "react-router-dom";
import db from "../firebase"; // Firebase setup

export default function Battlepage() {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const [targetSyntax, setTargetSyntax] = useState("");
  const [userInput, setUserInput] = useState("");
  const [isGameActive, setIsGameActive] = useState(false);
  const [enemyHealth, setEnemyHealth] = useState(20);
  const [currentSyntaxIndex, setCurrentSyntaxIndex] = useState(0);
  const [syntaxList, setSyntaxList] = useState([]);

  // Fetch the randomized syntax list when component mounts
  useEffect(() => {
    const roomRef = ref(db, `rooms/${roomId}`);

    // Get room data
    get(roomRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const roomData = snapshot.val();
          const syntaxes = roomData.syntaxList || [];
          const health = roomData.enemyHealth;
          setEnemyHealth(health);

          if (syntaxes.length > 0) {
            setSyntaxList(syntaxes);
            setTargetSyntax(syntaxes[0]); // Set the first syntax as the target
            setIsGameActive(true); // Start the game
          } else {
            alert("No syntax available.");
          }
        } else {
          alert("Room not found.");
          navigate("/rooms"); // Redirect if room doesn't exist
        }
      })
      .catch((error) => {
        console.error("Error fetching room data: ", error);
        alert("An error occurred while fetching room data.");
      });
  }, [roomId, navigate]);

  // Handle user input and check if it matches the target syntax
  const handleChange = (e) => {
    const value = e.target.value;
    setUserInput(value);

    if (value === targetSyntax) {
      const damage = 10;
      setEnemyHealth((prev) => prev - damage);

      if (enemyHealth <= 10) {
        endGame(); // End game if enemy health is too low
      } else {
        // Move to the next syntax if available
        if (currentSyntaxIndex < syntaxList.length - 1) {
          const nextIndex = currentSyntaxIndex + 1;
          setCurrentSyntaxIndex(nextIndex);
          setTargetSyntax(syntaxList[nextIndex]);
          setUserInput(""); // Reset the user input for the next syntax
        } else {
          endGame(); // End game if no more syntaxes
        }
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
    alert("You win!");
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
        <p>Game Over</p>
      )}
    </div>
  );
}
