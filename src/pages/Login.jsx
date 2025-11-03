import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login({ onLogin }) {

  const [formData, setFormData] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
      .then(response => {
        //if (!response.ok) throw new Error('Login failed');
        //return response.json();
        if(!response.ok) throw new Error('Login failed');
          return response.json();
      })
      .then(userData => {
          onLogin(userData.username);
          navigate("/browse");
      })
      .catch(() => {
        return alert("Login failed")
      })

  };


  return (
    <div className="bg-gray-100 h-screen flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-2xl p-10 w-[400px]">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-8">Login</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            name="username"
            type="text"
            className="form-control"
            placeholder="Username"
            value={formData.username.value}
            onChange={handleChange}
            required
          />
          <input
            name="password"
            type="password"
            className="form-control" 
            placeholder="Password" 
            value={formData.password.value}
            onChange={handleChange}
            required 
          />

          <button 
            className="btn btn-primary w-full py-2 rounded-pill"
            onClick={handleSubmit}
          >
              Login
          </button>
        </form>
      </div>
    </div>
  );
}

