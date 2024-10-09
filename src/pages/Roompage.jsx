import { useState, useEffect } from "react";
import { ref, set, onValue, runTransaction } from "firebase/database";
import db from "../firebase"; // Pastikan ini diatur dengan benar
import { useNavigate } from "react-router-dom";

const RoomPage = () => {
  const [roomName, setRoomName] = useState("");
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (!storedUsername) {
      alert("You need to log in first!");
      navigate("/login"); // Redirect ke halaman login
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
      alert("Please enter a room name");
      return;
    }

    const roomId = Date.now().toString();
    const storedUsername = localStorage.getItem("username");

    set(ref(db, "rooms/" + roomId), {
      name: roomName,
      createdAt: new Date().toISOString(),
      users: 1,
      creator: storedUsername, // Menyimpan username pembuat room
    })
      .then(() => {
        navigate(`/rooms/${roomId}`);
      })
      .catch((error) => {
        console.error("Error creating room: ", error);
      });
  };

  const joinRoom = (roomId) => {
    const roomRef = ref(db, `rooms/${roomId}`);

    runTransaction(roomRef, (room) => {
      if (room) {
        const storedUsername = localStorage.getItem("username");

        // Cek jika room sudah penuh
        if (room.users >= 2) {
          alert("Room is full.");
          return; // Kembali tanpa perubahan
        }

        // Update room
        room.users += 1; // Tambah pengguna
        room.participants = room.participants || []; // Inisialisasi jika belum ada
        room.participants.push(storedUsername); // Tambah pengguna ke daftar peserta
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
            <h3 className="font-bold">Room Name: {room.name}</h3>{" "}
            {/* Tampilkan nama room */}
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
