import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { ThemeContext } from "../context/ThemeContext";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Memeriksa apakah username sudah disimpan di localStorage
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
      navigate("/rooms"); // Arahkan ke RoomPage jika sudah ada username
    }
  }, [navigate]);

  const handleLogin = () => {
    if (username) {
      localStorage.setItem("username", username); // Simpan username di localStorage
      Swal.fire({
        title: "Success!",
        text: "You have logged in successfully.",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        navigate("/rooms");
      });
      navigate("/rooms");
    } else {
      Swal.fire({
        title: "Error!",
        text: "Please enter a username.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const { theme } = useContext(ThemeContext);

  return (
    <div
      className="flex flex-col items-center justify-center h-screen gap-6"
      data-theme={theme}
    >
      <h1 className="text-3xl font-bold">Login And Start Playing!</h1>
      <label className="input input-bordered flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="h-4 w-4 opacity-70"
        >
          <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
        </svg>
        <input
          type="text"
          className="grow"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </label>
      <button onClick={handleLogin} className="btn btn-primary px-8 font-bold">
        LOGIN
      </button>
    </div>
  );
}
