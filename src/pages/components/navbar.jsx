// Navbar.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar({ isLoggedIn, onLogout }) {
  const navigate = useNavigate();

  const handleLogoutClick = async () => {
    try {
      if (onLogout) {
        await onLogout();        // this calls /api/auth/logout and sets isLoggedIn=false in App
      }
      navigate("/browse");
    } catch (error) {
      console.error("Logout click error:", error);
      alert("Logout failed, please try again.");
    }
  };

  return (
    <nav className="rd-navbar">
      <div className="rd-navbar-container">
        <Link to="/" className="rd-navbar-brand">RawDonkey</Link>
        <ul className="rd-navbar-menu">
          <li>
            <Link to="/browse" className="rd-navbar-link">Browse</Link>
          </li>

          {isLoggedIn ? (
            <>
              <li>
                <Link to="/create" className="rd-navbar-link">Create</Link>
              </li>
              <li>
                <Link to="/settings" className="rd-navbar-link">User Settings</Link>
              </li>
              <li className="rd-navbar-username">
                Hi 👋
              </li>
              <li>
                <button onClick={handleLogoutClick} className="rd-btn-logout">
                  Logout
                </button>
              </li>
            </>
          ) : (
            <li>
              <Link to="/login" className="rd-btn-login">Login</Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}
