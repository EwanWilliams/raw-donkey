import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar({ isLoggedIn, onLogout }) {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    onLogout();       // remove login state
    navigate("/browse"); // redirect to browse
  };

  return (
    <nav className="navbar navbar-expand-lg bg-white shadow-sm px-5 py-3 border-b">
      <div className="container-fluid">
        <Link to="/" className="navbar-brand text-2xl font-bold text-blue-600">
          RawDonkey
        </Link>

        <ul className="navbar-nav ms-auto flex space-x-4 items-center">
          <li>
            <Link to="/browse" className="nav-link text-gray-700 hover:text-blue-600">
              Browse
            </Link>
          </li>

          {isLoggedIn ? (
            <>
              <li>
                <Link to="/create" className="nav-link text-gray-700 hover:text-blue-600">
                  Create
                </Link>
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
