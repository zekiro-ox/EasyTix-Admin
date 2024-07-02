import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "./assets/CompanyLogo.png";

const OrganizerLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleLogin = (e) => {
    e.preventDefault();

    // Dummy account credentials
    const dummyEmail = "organizer@example.com";
    const dummyPassword = "password123";

    if (email === dummyEmail && password === dummyPassword) {
      // Redirect to organizer dashboard or any other page
      navigate("/organizer-dashboard");
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        {/* Logo section */}
        <div className="flex items-center justify-center mb-8">
          <img src={Logo} alt="Company Logo" className="h-20 w-auto" />
        </div>
        <h2 className="text-2xl font-bold text-red-600 text-center">
          Organizer Login
        </h2>
        {error && <div className="text-red-600 text-center mb-4">{error}</div>}
        <form className="mt-6" onSubmit={handleLogin}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-700 bg-gray-700 text-white rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={passwordVisible ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-700 bg-gray-700 text-white rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                onClick={togglePasswordVisibility}
              >
                {passwordVisible ? (
                  <svg
                    className="h-6 w-6 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10S6.477 2 12 2c1.065 0 2.087.171 3.045.487m2.618 1.529A9.958 9.958 0 0122 12c0 5.523-4.477 10-10 10a9.953 9.953 0 01-4.985-1.358M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-6 w-6 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 12a3 3 0 01-6 0m6 0a3 3 0 00-6 0m6 0a3 3 0 01-6 0M2.458 12C3.732 7.943 7.612 5 12 5c1.877 0 3.63.47 5.14 1.287m2.84 2.256C20.268 9.37 21.542 10.915 22 12c-.458 1.085-1.732 2.63-3.02 3.457A9.953 9.953 0 0112 19c-4.388 0-8.268-2.943-9.542-7"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-700 bg-gray-700 rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-300"
              >
                Remember me
              </label>
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Sign In
          </button>
        </form>
        <div className="mt-4 text-center">
          <Link
            to="/admin-login"
            className="font-medium text-red-600 hover:text-red-500"
          >
            Admin? Login here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrganizerLogin;
