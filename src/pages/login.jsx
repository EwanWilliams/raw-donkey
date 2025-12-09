import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Login({ onLogin, onLogout, isLoggedIn }) {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [mode, setMode] = useState("login"); // "login" or "register"
  const navigate = useNavigate();

  //  If user visits /login while logged in, force logout (clear cookie + state)
  useEffect(() => {
    if (isLoggedIn && onLogout) {
      onLogout(); // calls /api/auth/logout and sets isLoggedIn(false) in App
    }
  }, [isLoggedIn, onLogout]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setMessage("");
    setErrorMessage("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmed = {
      username: formData.username.trim(),
      password: formData.password.trim(),
    };

    // Popup: missing username or password
    if (!trimmed.username || !trimmed.password) {
      setErrorMessage("Please enter a username and password.");
      return;
    }

    const endpoint =
      mode === "login" ? "/api/auth/login" : "/api/auth/register";

    fetch(endpoint, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(trimmed),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(mode === "login" ? "Login failed" : "Registration failed");
        }
        return response.json();
      })
      .then((data) => {
        if (mode === "login" && data && data.username) {
          onLogin(data.username);
        } else {
          onLogin(trimmed.username);
        }
        navigate("/browse");
      })
      .catch(() => {
        // Popup: incorrect login OR username taken
        if (mode === "login") {
          setErrorMessage("Incorrect username or password.");
        } else {
          setErrorMessage("Username already taken.");
        }
      });
  };


  const toggleMode = () => {
    setMode((prev) => (prev === "login" ? "register" : "login"));
    setMessage("");
    setErrorMessage("");
  };

  const isLogin = mode === "login";

  return (
    <>
      {/* POPUP OVERLAY */}
      {errorMessage && (
        <div className="settings-popup-overlay">
          <div className="settings-popup" data-test="login-error-popup">
            <p className="settings-popup-message">{errorMessage}</p>
            <button
              type="button"
              className="rd-btn rd-btn-primary"
              data-test="login-error-popup-ok-button"
              onClick={() => setErrorMessage("")}
            >
              OK
            </button>
          </div>
        </div>
      )}
    <div className="login-page">
      <div className="login-card">
        <h2 className="login-title">{isLogin ? "Login" : "Register"}</h2>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <input
            name="username"
            id="username"
            data-test="username-input"
            type="text"
            className="form-control login-input"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
          />
          <input
            name="password"
            id="password"
            data-test="password-input"
            type="password"
            className="form-control"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />

          <button
            type="submit"
            className="btn btn-primary w-full py-2 rounded-pill"
            data-test="login-submit-button"
          >
            {isLogin ? "Login" : "Register"}
          </button>

          <div id="errorMessage" className="errorMessage">
            {message}
          </div>

          {errorMessage && (
            <div className="errorMessage mt-1 text-sm">
              {errorMessage}
            </div>
          )}

          <p className="changeMessage">
  {isLogin ? (
    <>
      Don't have an account?
      <span
        className="changeMessage-link"
        data-test="toggle-register"
        onClick={toggleMode}
      >
        {" "}Register here.
      </span>
    </>
  ) : (
    <>
      Already have an account?
      <span
        className="changeMessage-link"
        onClick={toggleMode}
      >
        {" "}Login here.
      </span>
    </>
  )}
</p>

        </form>
      </div>
    </div>
    </>
  );
}
