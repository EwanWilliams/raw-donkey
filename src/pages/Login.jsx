export default function Login() {
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
              type="email"
              placeholder="Email address"
              className="form-control w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[var(--color-brand)] focus:ring-2 focus:ring-[var(--color-brand)] outline-none transition"
            />
          </div>

          {/* Password */}
          <div>
            <input
              type="password"
              placeholder="Password"
              className="form-control w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[var(--color-brand)] focus:ring-2 focus:ring-[var(--color-brand)] outline-none transition"
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="btn-brand w-full py-3 text-lg font-semibold hover:scale-[1.02]"
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
