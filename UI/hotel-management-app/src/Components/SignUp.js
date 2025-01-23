import React, { useState } from "react";
import axios from "axios"; // Import Axios for making HTTP requests

export default function SignUp() {
  // State variables for storing form data
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(""); // Role state
  const [errorMessage, setErrorMessage] = useState("");

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setErrorMessage("")

    const userData = {
      username,
      user_email: email,
      user_password: password,
      user_role: role,
    };

    try {
      // Send data to the backend server
      const response = await axios.post("http://localhost:3000/users", userData);
      
      // If the request is successful
      console.log("User Data Submitted: ", response.data);
      alert("User signed up successfully!");
      
    } catch (error) {
      // Handle error 
      console.error("There was an error during sign-up", error);
      setErrorMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className="login-form">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        {/* Username Field */}
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        {/* Email Field */}
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* Role Field */}
        <div>
          <label htmlFor="role">Role:</label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="">Select Role</option>
            <option value="waiter">Waiter</option>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
          </select>
        </div>

        {/* Submit Button */}
        <div>
          <button type="submit">Sign Up</button>
        </div>
      </form>

      {/* Display error message if any */}
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
    </div>
  );
}
