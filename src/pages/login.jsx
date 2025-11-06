import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login({ onLogin }) {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Login failed");
        return response.json();
      })
      .then((userData) => {
        onLogin(userData.username);
        navigate("/browse");
      })
      .catch(() => {
        alert("Login failed");
      });
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2 className="login-title">Login</h2>

        <form onSubmit={handleSubmit} className="login-form">
          <input
            name="username"
            data-test="username-input"
            type="text"
            className="form-control login-input"
            placeholder="Username"
            value={formData.username}       
            onChange={handleChange}
            required
          />
          <input
            name="password"
            data-test="password-input"
            type="password"
            className="form-control login-input"
            placeholder="Password"
            value={formData.password}       
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            className="btn btn-primary login-button"
            data-test="login-button"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

