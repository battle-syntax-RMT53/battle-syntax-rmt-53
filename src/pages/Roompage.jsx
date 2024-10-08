import { useState } from "react";
import { ref, set } from "firebase/database";
import db from "../firebase";
import { useNavigate } from "react-router-dom";

const RoomPage = () => {
  const [roomName, setRoomName] = useState("");
  const navigate = useNavigate();

  const createRoom = () => {
    const roomId = Date.now();
    set(ref(db, "rooms/" + roomId), {
      name: roomName,
      createdAt: new Date().toISOString(),
    })
      .then(() => {
        navigate(`/room/${roomId}`);
      })
      .catch((error) => {
        console.error("Error creating room: ", error);
      });
  };

  const joinRoom = () => {
    if (roomName) {
      navigate(`/room/${roomName}`);
    } else {
      alert("Please enter a room name to join.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Rooms</h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Room Name"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          className="border border-gray-300 rounded-lg p-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="flex space-x-4">
        <button
          onClick={createRoom}
          className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition"
        >
          Create Room
        </button>
        <button
          onClick={joinRoom}
          className="bg-green-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-600 transition"
        >
          Join Room
        </button>
      </div>
    </div>
  );
};

export default RoomPage;
