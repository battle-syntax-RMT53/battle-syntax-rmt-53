import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("username");
    navigate("/login");
  };

  return (
    <nav className="bg-gray-800 shadow">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <span className="text-xl font-bold text-white">Battle Syntax</span>
        <button
          className="lg:hidden p-2 text-white"
          type="button"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        ></button>
        <div className="hidden lg:flex space-x-4" id="navbarNav">
          {/* <Link className="text-white hover:text-red-300" to="/location">
            Location
          </Link>
          <Link className="text-white hover:text-red-300" to="/home">
            Monster
          </Link> */}
          <button
            className="text-white hover:text-red-300"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
