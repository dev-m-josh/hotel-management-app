import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../Styles/Login.css";

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
        e.preventDefault(); // Prevent the default form submission
        setLoading(true); // Set loading to true
        setError(""); // Clear any previous error messages

        try {
            // POST request to the server
            const response = await axios.post("http://localhost:3500/login", {
                user_email: email,
                user_password: password,
            });

            // Check if the response contains a token
            if (response.data.token) {
                // Store the token in localStorage
                localStorage.setItem("authToken", response.data.token);

                // Store user data in localStorage
                const loggedInUser = {
                    user_id: response.data.user.user_id,
                    username: response.data.user.username,
                    user_email: response.data.user.user_email,
                    role: response.data.user.user_role,
                };

                localStorage.setItem("user", JSON.stringify(loggedInUser));

                // Navigate to the homepage
                navigate("/");
            } else {
                setError("Incorrect email or password");
            }
        } catch (err) {
            // Handle errors
            console.error("Login error:", err); // Log the error
            setError("Login failed please try again later!");
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