import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar({ isLoggedIn, username, onLogout }) {
  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window === "undefined") return false;

    const saved = localStorage.getItem("theme");
    if (saved === "dark") return true;
    if (saved === "light") return false;

    // Fallback to system preference
    return (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    );
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const handleLogoutClick = () => {
    onLogout();
    navigate("/browse");
  };

  return (
    <nav className="navbar navbar-expand-lg bg-white dark:bg-gray-900 shadow-sm px-5 py-3 border-b dark:border-gray-700 transition-colors duration-300">
      <div className="container-fluid">
        <Link
          to="/"
          className="navbar-brand text-2xl font-bold text-blue-600 dark:text-blue-400"
        >
          RawDonkey
        </Link>

        <ul className="navbar-nav ms-auto flex space-x-4 items-center">
          <li>
            <Link
              to="/browse"
              className="nav-link text-gray-700 hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-400"
            >
              Browse
            </Link>
          </li>

          {isLoggedIn ? (
            <>
              <li>
                <Link
                  to="/create"
                  className="nav-link text-gray-700 hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-400"
                >
                  Create
                </Link>
              </li>

              <li>
                <Link
                  to="/settings"
                  className="nav-link text-gray-700 hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-400"
                >
                  User Settings
                </Link>
              </li>

              {/* 👇 Username nameplate */}
              <li className="text-gray-700 dark:text-gray-200 font-medium">
                Hi,{" "}
                <span className="text-blue-600 dark:text-blue-400 font-semibold">
                  {username}
                </span>{" "}
                👋
              </li>

              <li>
                <button
                  onClick={handleLogoutClick}
                  className="btn btn-outline-danger rounded-pill px-3"
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <li>
              <Link
                to="/login"
                className="btn btn-outline-primary rounded-pill px-3"
              >
                Login
              </Link>
            </li>
          )}

          {/* 🌙 Dark mode toggle */}
          <li>
            <button
              onClick={() => setDarkMode((prev) => !prev)}
              className="ml-3 p-2 rounded-full border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? (
                // Sun icon (indicates light mode is available)
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-yellow-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10 3a1 1 0 011 1v1a1 1 0 11-2 0V4a1 1 0 011-1zm0 8a3 3 0 100-6 3 3 0 000 6zm7-3a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zm9.657 4.657a1 1 0 010 1.414l-.707.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM6.464 5.05A1 1 0 015.05 6.464l-.707-.707A1 1 0 115.757 4.05l.707.707zM6.464 14.95l-.707.707A1 1 0 114.05 14.95l.707-.707a1 1 0 011.414 1.414zm8.193-9.9l.707-.707A1 1 0 1014.95 4.05l-.707.707a1 1 0 101.414 1.414z" />
                </svg>
              ) : (
                // Moon icon (indicates dark mode is available)
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-700"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M17.293 13.293A8 8 0 016.707 2.707 8.001 8.001 0 1017.293 13.293z" />
                </svg>
              )}
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}
