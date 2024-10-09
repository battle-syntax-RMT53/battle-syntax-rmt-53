import { useState, useEffect } from "react";
import { ref, set, onValue, runTransaction, get } from "firebase/database";
import db from "../firebase";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const RoomPage = () => {
  const [roomName, setRoomName] = useState("");
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (!storedUsername) {
      alert("You need to log in first!");
      navigate("/login");
      return;
    }

    const roomsRef = ref(db, "rooms/");
    onValue(roomsRef, (snapshot) => {
      const data = snapshot.val();
      const roomsArray = data
        ? Object.entries(data).map(([id, room]) => ({ id, ...room }))
        : [];
      setRooms(roomsArray);
    });
  }, [navigate]);

  const createRoom = () => {
    if (!roomName) {
      Swal.fire({
        title: "Warning!",
        text: "Please enter a room name",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }

    const roomId = Date.now().toString();
    const storedUsername = localStorage.getItem("username");

    // Fetch the syntaxes from Firebase using get()
    const syntaxesRef = ref(db, "syntaxes");
    get(syntaxesRef)
      .then((snapshot) => {
        const syntaxData = snapshot.val();
        if (syntaxData) {
          const syntaxList = Object.values(syntaxData);

          function shuffleSyntaxes(array) {
            for (let i = array.length - 1; i > 0; i--) {
              // Generate a random index from 0 to i
              const j = Math.floor(Math.random() * (i + 1));
              // Swap elements at i and j
              [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
          }

          // Randomize the syntax list
          const randomizedSyntaxList = shuffleSyntaxes([...syntaxList]);
          // Store the room with the randomized list
          set(ref(db, "rooms/" + roomId), {
            name: roomName,
            createdAt: new Date().toISOString(),
            users: 1,
            creator: storedUsername,
            syntaxList: randomizedSyntaxList, // Store the randomized syntax list
            creatorHealth: 40,
            currentSyntaxIndex: 0,
          })
            .then(() => {
              navigate(`/rooms/${roomId}`);
            })
            .catch((error) => {
              console.error("Error creating room: ", error);
            });
        } else {
          alert("No syntaxes found in the database.");
        }
      })
      .catch((error) => {
        console.error("Error fetching syntaxes: ", error);
      });
  };

  const joinRoom = (roomId) => {
    const roomRef = ref(db, `rooms/${roomId}`);

    runTransaction(roomRef, (room) => {
      if (room) {
        const storedUsername = localStorage.getItem("username");

        // Cek jika room sudah penuh
        if (room.users >= 2) {
          Swal.fire({
            title: "Error!",
            text: "Room is full.",
            icon: "error",
            confirmButtonText: "OK",
          });
          throw new Error; // Return without changes
        }

        // Update room
        room.users += 1; // Tambah pengguna
        room.participants = {
          participantName: storedUsername,
          participantHealth: 40,
        };
      }
      return room; // Kembalikan room yang sudah diupdate
    })
      .then(() => {
        navigate(`/rooms/${roomId}`); // Arahkan ke halaman battle
      })
      .catch((error) => {
        console.error("Error joining room: ", error);
      });
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Typing Game Rooms</h1>
      <input
        type="text"
        placeholder="Room Name"
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
        className="border border-gray-300 rounded-lg p-2 mb-4 w-64"
      />
      <button
        onClick={createRoom}
        className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg mb-4"
      >
        Create Room
      </button>
      <h2 className="text-xl font-semibold mb-4">Available Rooms</h2>
      <div className="flex flex-wrap justify-center">
        {rooms.map((room) => (
          <div
            key={room.id}
            className="bg-white border border-gray-300 rounded-lg p-4 m-2 w-64"
          >
            <h3 className="font-bold">Room Name: {room.name}</h3>
            <h3 className="font-bold">Room ID: {room.id}</h3>
            <p>Users: {room.users} / 2</p>
            <button
              onClick={() => joinRoom(room.id)}
              className="bg-green-500 text-white font-semibold py-1 px-2 rounded-lg mt-2"
            >
              Join Room
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomPage;
