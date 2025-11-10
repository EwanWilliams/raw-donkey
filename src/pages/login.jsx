import { set } from "mongoose";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login({ onLogin }) {

  // Changeable useStates for use throughout the component
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const navigate = useNavigate();

  // Handle form submission for login
  const handleSubmit = (e) => {
    e.preventDefault();
    // Get form data and remove whitespace
    formData.username = document.getElementById("username").value;
    formData.username = formData.username.trim();
    formData.password = document.getElementById("password").value;
    formData.password = formData.password.trim();

    // Basic front-end validation for empty fields
    if (formData.username == "" || formData.password == "") {
      setMessage('Enter a Username and Password')
      return
    }
    else {

    // Send login request to server
    fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
      // Handle error responses
      .then(response => {
        if(!response.ok) throw new Error('Login failed');
          return response.json();
      })
      // Handle successful login
      .then(userData => {
          onLogin(userData.username);
          navigate("/browse");
      })
      // Handle failed login
      .catch((err) => {
        setErrorMessage(err)
        console.log(err)
        if (formData.username == "" || formData.password == "") {
          setMessage('Enter a Username and Password')
        }
        else {
          setMessage('Incorrect Username or Password')
        }
      })
    }
  };

  // Handle form submission for registration
  const handleRegister = (e) => {
    e.preventDefault();
    // Get form data and remove whitespace
    formData.username = document.getElementById("username").value;
    formData.username = formData.username.trim();
    formData.password = document.getElementById("password").value;
    formData.password = formData.password.trim();

    // Basic front-end validation for empty fields
    if (formData.username == "" || formData.password == "") {
      setMessage('Enter a Username and Password')
      return
    }
    else {

    // Send registration request to server
    fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
      // Handle error responses
      .then(response => {
        if(!response.ok) throw new Error('Registration failed');
          return response.json();
      })
      // Handle successful registration
      .then(userData => {
          onLogin(userData.username);
          navigate("/browse");
      })
      // Handle failed registration
      .catch(() => {
        if (formData.username == "" || formData.password == "") {
          setMessage("Enter a Username and Password")
        }
        else {
          setMessage("Username already taken")
        }
      })
    }
  };

  // Initial button state set to Login
  const [newButton, setNewButton] = useState(
    <button 
      className="btn btn-primary w-full py-2 rounded-pill"
      onClick={handleSubmit}
    >
      Login
    </button>
  )

  // Change button to Register
  function buttonChangeRegister() {
    setMessage("")
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

  // Change button to Login
  function buttonChangeLogin() {
    setMessage("")
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

  // Initial change message state set to Register prompt
  const [changeMessage, setChangeMessage] = useState(
    <p
      className="changeMessage"
      onClick={buttonChangeRegister}
    >
      Don't have an account? Register here.
    </p>
  )

  // Change message to Login prompt
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

  // Change message to Register prompt
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

  // Render the login/register form
  return (
    <div className="bg-gray-100 h-screen flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-2xl p-10 w-[400px]">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-8">Login</h2>

        <form className="space-y-5">
          <input
            name="username"
            id="username"
            data-test="username-input"
            type="text"
            className="form-control"
            placeholder="Username"
            value={formData.username.value}
            required
          />
          <input
            name="password"
            id="password"
            data-test="password-input"
            type="password"
            className="form-control" 
            placeholder="Password" 
            value={formData.password.value}
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

