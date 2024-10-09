import { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";

export default function Navbar() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("username");
    navigate("/login");
  };

  const { pathname } = useLocation();
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <nav className="bg-secondary shadow" data-theme={theme}>
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <span className="text-xl font-bold text-secondary-content">
          BATTLE SYNTAX
        </span>
        <label className="flex cursor-pointer gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-secondary-content"
          >
            <circle cx="12" cy="12" r="5" />
            <path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
          </svg>
          <input
            type="checkbox"
            value={theme}
            onChange={toggleTheme}
            checked={theme === "dark"}
            className="toggle theme-controller"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-secondary-content"
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        </label>
        {pathname === "/rooms" ? (
          <button
            className="text-secondary-content hover:text-primary text-lg font-bold"
            onClick={handleLogout}
          >
            Logout
          </button>
        ) : (
          <button
            className="text-secondary text-lg font-bold"
            onClick={handleLogout}
            disabled
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
