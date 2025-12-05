import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar({ isLoggedIn, onLogout, theme, onToggleTheme, username }) {
  const navigate = useNavigate();

  const handleLogoutClick = async () => {
    await onLogout();
    navigate("/browse");
  };

  return (
    <nav className="rd-navbar">
      <div className="rd-navbar-container">
        <Link to="/" className="rd-navbar-brand">
          RawDonkey
        </Link>

        <ul className="rd-navbar-menu">
          {/* Browse link */}
          <li>
            <Link to="/browse" className="rd-navbar-link">
              Browse
            </Link>
          </li>

          {isLoggedIn ? (
            <>
              <li>
                <Link to="/create" className="rd-navbar-link">
                  Create
                </Link>
              </li>
              <li>
                <Link to="/settings" className="rd-navbar-link">
                  User Settings
                </Link>
              </li>

              <li className="rd-navbar-username">
                Hi {username && <strong>{username}</strong>} 👋
              </li>

              <li>
                <button
                  type="button"
                  onClick={handleLogoutClick}
                  className="rd-btn-logout"
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <li>
              <Link to="/login" className="rd-btn-login">
                Login
              </Link>
            </li>
          )}

          {/* 🌗 DARK MODE TOGGLE */}
          <li>
            <button
              type="button"
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
