import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../Styles/SignUp.css";

export default function SignUp() {
    // State variables for storing form data
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState(""); // state for confirm password
    const [role, setRole] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission
        setErrorMessage("");

        // Validation checking if email is valid
        if (!email.match(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/)) {
            setErrorMessage("Invalid email address");
            return;
        }

        if (password.length < 6) {
            setErrorMessage("Password should be at least 6 characters long");
            return;
        }

        // Check if password and confirm password match
        if (password !== confirmPassword) {
            setErrorMessage("Passwords do not match");
            return;
        }

        if (!role) {
            setErrorMessage("Please select a role");
            return;
        }

        const userData = {
            username,
            user_email: email,
            user_password: password,
            user_role: role,
        };

        try {
            // Send data to the backend server
            const response = await axios.post(
                "http://localhost:3500/users",
                userData
            );

            const data = response.data

            localStorage.setItem("token", JSON.stringify(data.token));

            // Store user data in localStorage
            const loggedInUser = {
                user_id: response.data.addedUser.user_id,
                username: response.data.addedUser.username,
                user_email: response.data.addedUser.user_email,
                role: response.data.addedUser.user_role,
            };

            localStorage.setItem("user", JSON.stringify(loggedInUser));

            alert("User signed up successfully!");
            // Navigate to the homepage
            navigate("/");
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

                {/* Confirm Password Field */}
                <div>
                    <label htmlFor="confirmPassword">Confirm Password:</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
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
