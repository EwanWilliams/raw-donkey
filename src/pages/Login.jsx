import React, { useState } from "react";

export default function Login() {

  const [formData, setFormData] = useState({ username: "", password: "" });

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    console.log(formData)

    fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
      .then(response => {
        if (!response.ok) throw new Error('Login failed');
        return response.json();
      })
      .then(userData => {
        onLogin(userData);
      })
      .catch(() => {
        
      })
  }


  return (
    <div className="bg-[var(--color-bg)] h-screen flex items-center justify-center">
      <div className="card p-10 w-[400px]">
        <h2 className="text-3xl font-bold text-center text-[var(--color-brand)] mb-8">
          Login
        </h2>

        <form className="space-y-6">
          {/* Email */}
          <div>
            <input
              name="username"
              type="username"
              placeholder="Username"
              className="form-control w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[var(--color-brand)] focus:ring-2 focus:ring-[var(--color-brand)] outline-none transition"
              value={formData.username.value}
              onChange={handleChange}
            />
          </div>

          {/* Password */}
          <div>
            <input
              name="password"
              type="password"
              placeholder="Password"
              className="form-control w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[var(--color-brand)] focus:ring-2 focus:ring-[var(--color-brand)] outline-none transition"
              value={formData.password.value}
              onChange={handleChange}
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="btn-brand w-full py-3 text-lg font-semibold hover:scale-[1.02]"
            onClick={handleSubmit}
          >
            Login
          </button>
        </form>

        {/* Footer Text */}
        <p className="text-sm text-center text-[var(--color-text-light)] mt-6">
          Don’t have an account?{" "}
          <a
            href="#"
            className="link font-medium"
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}


