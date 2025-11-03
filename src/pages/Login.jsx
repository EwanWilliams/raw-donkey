import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login({ onLogin }) {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return alert("Please enter a username");
    onLogin(name);
    navigate("/browse");
  };

  return (
    <div className="bg-gray-100 h-screen flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-2xl p-10 w-[400px]">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-8">Login</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            className="form-control"
            placeholder="Username"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input type="email" className="form-control" placeholder="Email address" required />
          <input type="password" className="form-control" placeholder="Password" required />

          <button className="btn btn-primary w-full py-2 rounded-pill">Login</button>
        </form>
      </div>
    </div>
  );
}

