import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "./config/firebaseConfig"; // Adjust the path as per your project structure
import { signInWithEmailAndPassword } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import Logo from "./assets/CompanyLogo.png"; // Adjust the path as per your project structure

const AdminLogin = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLockedOut, setIsLockedOut] = useState(false);
  const [lockoutTime, setLockoutTime] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedEmail = localStorage.getItem("rememberedEmail");
    if (storedEmail) {
      setEmail(storedEmail);
      setRememberMe(true);
    }
  }, []);

  useEffect(() => {
    if (isLockedOut) {
      const timerDuration = 10 * 60; // 10 minutes in seconds
      setLockoutTime(timerDuration);
      const timer = setInterval(() => {
        setLockoutTime((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            setIsLockedOut(false);
            setFailedAttempts(0);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000); // Update every second
      return () => clearInterval(timer);
    }
  }, [isLockedOut]);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleRememberMe = (e) => {
    setRememberMe(e.target.checked);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLockedOut) {
      setError("Too many failed attempts. Please wait 10 minutes.");
      return;
    }

    setIsLoading(true);
    setError(""); // Clear any previous errors

    try {
      // First, sign in with Firebase Authentication
      await signInWithEmailAndPassword(auth, email, password);

      // After successful login, get the authenticated user's UID
      const user = auth.currentUser;
      if (user) {
        const uid = user.uid;

        // Now check if the UID exists in the Firestore "admins" collection
        const adminsRef = collection(db, "admins");
        const q = query(adminsRef, where("__name__", "==", uid)); // Match Firestore document ID with UID
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          // UID matches a document in the "admins" collection, allow login
          setIsLoggedIn(true);
          if (rememberMe) {
            localStorage.setItem("rememberedEmail", email);
          } else {
            localStorage.removeItem("rememberedEmail");
          }
          navigate("/dashboard");
        } else {
          setError("You are not authorized to access this admin panel.");
        }
      }
    } catch (error) {
      setFailedAttempts((prev) => {
        const attempts = prev + 1;
        if (attempts >= 3) {
          setIsLockedOut(true);
          setError("Too many failed attempts. Please wait 10 minutes.");
        } else {
          setError("Invalid email or password.");
        }
        return attempts;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const minutesLeft = Math.floor(lockoutTime / 60);
  const secondsLeft = lockoutTime % 60;

  return (
    <div className="font-kanit min-h-screen flex flex-col items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex items-center justify-center mb-8">
          <img src={Logo} alt="Company Logo" className="h-20 w-auto" />
        </div>
        <h2 className="text-2xl font-bold text-purple-400 text-center mb-4">
          Admin Login
        </h2>
        <form className="mt-6" onSubmit={handleSubmit}>
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
              className="mt-1 block w-full px-4 py-2 border border-gray-600 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 bg-gray-700 text-white"
              placeholder="Enter your email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
                className="mt-1 block w-full px-4 py-2 border border-gray-600 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 bg-gray-700 text-white"
                placeholder="Enter your password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                onClick={togglePasswordVisibility}
              >
                {passwordVisible ? (
                  <svg
                    className="h-6 w-6 text-gray-400"
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
                    className="h-6 w-6 text-gray-400"
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
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-purple-400 focus:ring-purple-500 border-gray-300 rounded"
                checked={rememberMe}
                onChange={handleRememberMe}
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-300"
              >
                Remember me
              </label>
            </div>
          </div>
          <div className="text-sm text-gray- 300 mb-4">
            {isLockedOut ? (
              <span>
                Locked out! Please wait {minutesLeft}m {secondsLeft}s before
                trying again.
              </span>
            ) : (
              <span>Failed attempts: {failedAttempts}/3</span>
            )}
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            disabled={isLoading || isLockedOut}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin h-5 w-5 mr-3 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V2.5a.5.5 0 00-1 0V4a8 8 0 018 8h1.5a.5.5 0 000-1H20a8 8 0 01-8 8v1.5a.5.5 0 001 0V20a8 8 0 01-8-8H2.5a.5.5 0 000 1H4z"
                  ></path>
                </svg>
                <span>Loading...</span>
              </div>
            ) : isLockedOut ? (
              <span>Locked out for 10 minutes</span>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
        <div className="mt-4 text-center">
          <Link
            to="/organizer-login"
            className="font-medium text-purple-400 hover:text-purple-300"
          >
            Organizer? Login here
          </Link>
        </div>
      </div>
    </div>
  );
};
export default AdminLogin;
