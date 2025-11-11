import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar({ isLoggedIn, username, onLogout }) {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    onLogout();
    navigate("/browse");
  };

  return (
    <nav className="navbar navbar-expand-lg bg-white shadow-sm px-5 py-3 border-b">
      <div className="container-fluid">
        {/* Logo / Brand */}
        <Link to="/" className="navbar-brand text-2xl font-bold text-blue-600">
          RawDonkey
        </Link>

        <ul className="navbar-nav ms-auto flex space-x-4 items-center">
          {/* Browse link */}
          <li>
            <Link to="/browse" className="nav-link text-gray-700 hover:text-blue-600">
              Browse
            </Link>
          </li>

          {isLoggedIn ? (
            <>
              {/* Create link */}
              <li>
                <Link to="/create" className="nav-link text-gray-700 hover:text-blue-600">
                  Create
                </Link>
              </li>

              {/* User Settings link */}
              <li>
                <Link to="/settings" className="nav-link text-gray-700 hover:text-blue-600">
                  User Settings
                </Link>
              </li>

              {/* Username */}
              <li className="text-gray-700 font-medium">
                Hi,{" "}
                <span className="text-blue-600 font-semibold">
                  {username}
                </span>{" "}
                👋
              </li>

              {/* Logout button */}
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
              <Link to="/login" className="btn btn-outline-primary rounded-pill px-3">
                Login
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}
