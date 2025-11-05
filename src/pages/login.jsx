import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login({ onLogin }) {

  const [formData, setFormData] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("")
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
        if (formData.username == "" || formData.password == "") {
          setMessage('Enter a Username and Password')
        }
        else {
          setMessage('Incorrect Username or Password')
        }
      })

  };

  const handleRegister = (e) => {
    e.preventDefault();

    fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
      .then(response => {
        //if (!response.ok) throw new Error('Login failed');
        //return response.json();
        if(!response.ok) throw new Error('Registration failed');
          return response.json();
      })
      .then(userData => {
          onLogin(userData.username);
          navigate("/browse");
      })
      .catch(() => {
        if (formData.username == "" || formData.password == "") {
          setMessage('Enter a Username and Password')
        }
        else {
          setMessage('Username already exists')
        }
      })

  };

  const [newButton, setNewButton] = useState(
    <button 
      className="btn btn-primary w-full py-2 rounded-pill"
      onClick={handleSubmit}
    >
      Login
    </button>
  )

  function buttonChangeRegister() {
    changeMessageLogin()
    setNewButton(
      <button 
            className="btn btn-primary w-full py-2 rounded-pill"
            onClick={handleRegister}
          >
              Register
          </button>
    )
  }

  function buttonChangeLogin() {
    changeMessageRegister()
    setNewButton(
      <button 
            className="btn btn-primary w-full py-2 rounded-pill"
            onClick={handleSubmit}
          >
              Login
          </button>
    )
  }

  const [changeMessage, setChangeMessage] = useState(
    <p
      className="changeMessage"
      onClick={buttonChangeRegister}
    >
      Don't have an account? Register here.
    </p>
  )

  function changeMessageLogin() {
    setChangeMessage(
      <p
        className="changeMessage"
        onClick={buttonChangeLogin}
      >
        Already have an account? Login here.
      </p>
    )
  }

  function changeMessageRegister() {
    setChangeMessage(
      <p
        className="changeMessage"
        onClick={buttonChangeRegister}
      >
        Don't have an account? Register here.
      </p>
    )
  }

  return (
    <div className="bg-gray-100 h-screen flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-2xl p-10 w-[400px]">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-8">Login</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            name="username"
            data-test="username-input"
            type="text"
            className="form-control"
            placeholder="Username"
            value={formData.username.value}
            onChange={handleChange}
            required
          />
          <input
            name="password"
            data-test="password-input"
            type="password"
            className="form-control" 
            placeholder="Password" 
            value={formData.password.value}
            onChange={handleChange}
            required 
          />

          <div>
            {newButton}
          </div>
          <div
           id="errorMessage"
           className="errorMessage"
           >
            {message}
          </div>
          <div>
            {changeMessage}
          </div>
        </form>
      </div>
    </div>
  );
}

