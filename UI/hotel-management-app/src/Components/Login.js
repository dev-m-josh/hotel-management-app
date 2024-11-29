import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";

export default function Login() {
  // State variables for storing form data
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Initialize the useNavigate hook

  // Handle email change
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  // Handle password change
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default
    setLoading(true); // Set loading to true 
    setError(""); // Clear any previous error messages

    try {
      // Make a POST request to the server
      const response = await axios.post("http://localhost:3000/login", {
        user_email: email,
        user_password: password,
      });

      // If the login is successful, the response will contain the token
      if (response.data.token) {
        // Store token in local storage
        localStorage.setItem("authToken", response.data.token);
        // Navigate to the Staffs page
        navigate("/staffs");
      } else {
        setError("Login failed, please try again.");
      }
    } catch (err) {
      // Handle errors
      console.error("Login error:", err); // Log the error for debugging
      setError("Incorrect email or password");
    } finally {
      setLoading(false); // Set loading to false when the request is done
    }
  };

  return (
    <div className="login-form">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        {/* Email Field */}
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={handleEmailChange}
            required
          />
        </div>

        {/* Password Field */}
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={handlePasswordChange}
            required
          />
        </div>

        {/* Error Message */}
        {error && <div className="error-message">{error}</div>}

        {/* Submit Button */}
        <div>
          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>
      </form>
    </div>
  );
}
