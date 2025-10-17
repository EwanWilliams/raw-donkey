import React from "react";
import { Link } from "react-router-dom";

export default function Login({ onLogin }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(); // Simulate logging in
  };

  return (
    <div className="bg-gray-100 h-screen flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-2xl p-10 w-[400px]">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-8">
          Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="email"
            className="form-control"
            placeholder="Email address"
          />
          <input
            type="password"
            className="form-control"
            placeholder="Password"
          />

          <button className="btn btn-primary w-full py-2 rounded-pill">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
