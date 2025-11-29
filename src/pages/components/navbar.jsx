// Navbar.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar({ isLoggedIn, onLogout, theme, onToggleTheme }) {
  const navigate = useNavigate();

  const handleLogoutClick = async () => {
    await onLogout();
    navigate("/browse");
  };

  return (
    <nav className="rd-navbar">
      <div className="rd-navbar-container">
        <Link to="/" className="rd-navbar-brand">RawDonkey</Link>

        <ul className="rd-navbar-menu">
          <li><Link to="/browse">Browse</Link></li>

          {isLoggedIn ? (
            <>
              <li><Link to="/create">Create</Link></li>
              <li><Link to="/settings">User Settings</Link></li>
              <li>Hi 👋</li>
              <li><button onClick={handleLogoutClick}>Logout</button></li>
            </>
          ) : (
            <li><Link to="/login">Login</Link></li>
          )}

          {/* 🌗 DARK MODE TOGGLE */}
          <li>
            <button
              className="rd-btn-theme-toggle"
              onClick={onToggleTheme}
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}


