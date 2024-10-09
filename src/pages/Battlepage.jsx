import { useState, useEffect } from "react";
import { ref, runTransaction, onValue, remove } from "firebase/database";
import { useParams, useNavigate } from "react-router-dom";
import db from "../firebase"; // Firebase setup
import Swal from "sweetalert2";

export default function Battlepage() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const username = localStorage.getItem("username");

  const [creatorHealth, setCreatorHealth] = useState(20);
  const [participantHealth, setParticipantHealth] = useState(20);
  const [targetSyntax, setTargetSyntax] = useState("");
  const [userInput, setUserInput] = useState("");
  const [isGameActive, setIsGameActive] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [currentSyntaxIndex, setCurrentSyntaxIndex] = useState(0);
  const [syntaxList, setSyntaxList] = useState([]);

  // Fetch initial room data and subscribe to room updates
  useEffect(() => {
    const roomRef = ref(db, `rooms/${roomId}`);

    const unsubscribe = onValue(roomRef, (snapshot) => {
      if (snapshot.exists()) {
        const roomData = snapshot.val();
        const syntaxes = roomData.syntaxList || [];

        // Set health based on player identity
        const isPlayer1 = roomData.creator === username;
        setCreatorHealth(
          isPlayer1
            ? roomData.creatorHealth
            : roomData.participants.participantHealth
        );
        setParticipantHealth(
          isPlayer1
            ? roomData.participants.participantHealth
            : roomData.creatorHealth
        );

        setSyntaxList(syntaxes);
        setCurrentSyntaxIndex(roomData.currentSyntaxIndex || 0);
        setTargetSyntax(syntaxes[roomData.currentSyntaxIndex] || "");
        setIsGameActive(true);
      } else {
        navigate("/rooms");
      }
    });

    return () => unsubscribe();
  }, [roomId, username, navigate]);

  // Countdown effect
  useEffect(() => {
    if (isGameActive) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 1) {
            clearInterval(timer);
            return 0; // Stop countdown
          }
          return prev - 1; // Decrease countdown
        });
      }, 1000);

      return () => clearInterval(timer); // Cleanup on unmount
    }
  }, [isGameActive]);

  // Handle user input and check if it matches the target syntax
  const handleChange = (e) => {
    const value = e.target.value;
    setUserInput(value);

    if (value === targetSyntax) {
      const damage = 10;
      const roomRef = ref(db, `rooms/${roomId}`);

      runTransaction(roomRef, (roomData) => {
        if (roomData) {
          const isPlayer1 = roomData.creator === username;

          if (isPlayer1) {
            roomData.participants.participantHealth = Math.max(
              0,
              roomData.participants.participantHealth - damage
            );
          } else {
            roomData.creatorHealth = Math.max(
              0,
              roomData.creatorHealth - damage
            );
          }

          const nextIndex = roomData.currentSyntaxIndex + 1;
          if (nextIndex < syntaxList.length) {
            roomData.currentSyntaxIndex = nextIndex;
            roomData.targetSyntax = syntaxList[nextIndex];
          }

          return roomData;
        }
        return null;
      })
        .then(() => {
          setUserInput(""); // Clear user input for the next round
        })
        .catch((error) => {
          console.error("Error updating the game state: ", error);
        });
    }
  };

  const getHighlightedText = () => {
    const textArray = targetSyntax.split("");
    const inputArray = userInput.split("");

    return textArray.map((char, index) => {
      let className = "font-bold text-lg";
      if (inputArray[index] === char) {
        className = "font-bold text-lg text-green-500";
      } else if (inputArray[index] !== undefined) {
        className = "font-bold text-lg text-red-500";
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
    const message = creatorHealth <= 0 ? "You lost!" : "You won!";

    // Use SweetAlert for the win/loss message
    Swal.fire({
      title: "Game Over",
      text: message,
      icon: creatorHealth <= 0 ? "error" : "success",
      confirmButtonText: "OK",
    }).then(() => {
      const roomRef = ref(db, `rooms/${roomId}`);
      remove(roomRef);
      navigate("/rooms");
    });
  };

  // Check if game is over
  useEffect(() => {
    if (creatorHealth <= 0 || participantHealth <= 0) {
      endGame();
    }
  }, [creatorHealth, participantHealth]);

  return (
    <div className="flex flex-col h-screen items-center justify-center gap-6">
      <h1 className="text-3xl">Battle Syntax</h1>
      {isGameActive && countdown > 0 ? (
        <div className="text-2xl">{countdown}</div> // Display countdown
      ) : isGameActive ? (
        <div className="flex flex-col justify-center items-center gap-4">
          <p>Your Health: {creatorHealth}</p>
          <p>Enemy Health: {participantHealth}</p>
          <div className="bg-base-300 px-5 py-3 rounded-md">
            {getHighlightedText()}
          </div>
          <input
            type="text"
            value={userInput}
            onChange={handleChange}
            className="w-full rounded-md px-4 border-2"
            autoFocus
          />
        </div>
      ) : (
        <button className="btn btn-primary">
          Waiting other player to join
        </button>
      )}
    </div>
  );
}
