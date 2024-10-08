import { useState, useEffect } from "react";
import { ref, set, onValue } from "firebase/database";
import db from "../firebase";
import { useNavigate } from "react-router-dom";

const RoomPage = () => {
  const [roomName, setRoomName] = useState("");
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const roomsRef = ref(db, "rooms/");
    onValue(roomsRef, (snapshot) => {
      const data = snapshot.val();
      const roomsArray = data
        ? Object.entries(data).map(([id, room]) => ({ id, ...room }))
        : [];
      setRooms(roomsArray);
    });
  }, []);

  const createRoom = () => {
    const roomId = Date.now();
    set(ref(db, "rooms/" + roomId), {
      name: roomName,
      createdAt: new Date().toISOString(),
      users: 1,
    })
      .then(() => {
        navigate(`/room/${roomId}`);
      })
      .catch((error) => {
        console.error("Error creating room: ", error);
      });
  };

  const joinRoom = (roomId) => {
    const roomRef = ref(db, `rooms/${roomId}`);
    onValue(roomRef, (snapshot) => {
      const room = snapshot.val();
      if (room && room.users < 2) {
        set(ref(db, `rooms/${roomId}`), {
          ...room,
          users: room.users + 1,
        })
          .then(() => {
            navigate(`/room/${roomId}`);
          })
          .catch((error) => {
            console.error("Error joining room: ", error);
          });
      } else {
        alert("Room is full or does not exist.");
      }
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
