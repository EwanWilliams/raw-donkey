import React from "react";
import { Link } from "react-router-dom";

export default function Navbar({ isLoggedIn, onLogout }) {
  return (
    <nav className="navbar navbar-expand-lg bg-white shadow-sm px-5 py-3 border-b">
      <div className="container-fluid">
        <Link to="/" className="navbar-brand text-2xl font-bold text-blue-600">
          RawDonkey
        </Link>

        <ul className="navbar-nav ms-auto flex space-x-4 items-center">
          {/* Always visible */}
          <li>
            <Link to="/browse" className="nav-link text-gray-700 hover:text-blue-600">
              Browse
            </Link>
          </li>

          {/* Logged in */}
          {isLoggedIn ? (
            <>
              <li>
                <Link to="/create" className="nav-link text-gray-700 hover:text-blue-600">
                  Create
                </Link>
              </li>
              <li>
                <button
                  onClick={onLogout}
                  className="btn btn-outline-danger rounded-pill px-3"
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            // Logged out
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
