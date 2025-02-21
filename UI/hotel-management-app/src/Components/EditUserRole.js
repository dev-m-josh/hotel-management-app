import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/Meals.css";
import "../Styles/Staffs.css"

function EditUserRole({onBack}) {
    const [staffs, setStaffs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(5); // Number of items per page
    const [noMoreStaffs, setNoMoreStaffs] = useState(false);
    const token = localStorage.getItem("authToken");
    const navigate = useNavigate();
    const [editingUser, setEditingUser] = useState(null); // State to track user being edited
    const [newRole, setNewRole] = useState(""); // State to hold the new role

    useEffect(() => {
        if (!token){
            navigate("/login")
        }

        const fetchStaffs = async () => {
            try {
                setLoading(true); // Set loading state to true while fetching

                // Call the API
                const response = await fetch(
                    `http://localhost:3500/users?page=${page}&pageSize=${pageSize}`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error(`Error: ${response.statusText}`);
                }

                const data = await response.json();

                if (Array.isArray(data)) {
                    setStaffs(data);

                    if (data.length < pageSize) {
                        setNoMoreStaffs(true);
                    } else {
                        setNoMoreStaffs(false);
                    }
                } else {
                    throw new Error("Unexpected response format");
                }
            } catch (err) {
                console.error("Error fetching staffs:", err);
                setError(err.message);
            } finally {
                setLoading(false); // Set loading state to false after fetching
            }
        };

        fetchStaffs();
    }, [page, pageSize, token, navigate]);

    // Handle role update
    const handleRoleUpdate = async () => {
        if (!newRole) {
            alert("Please select a role.");
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:3500/users/role/${editingUser.user_id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ user_role: newRole }),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to update role");
            }

            const data = await response.json();
            alert(data.message); // Show success message
            setEditingUser(null); // Close the edit form
            setNewRole(""); // Reset the role field
            setStaffs((prevStaffs) =>
                prevStaffs.map((staff) =>
                    staff.user_id === editingUser.user_id
                        ? { ...staff, user_role: newRole }
                        : staff
                )
            ); // Update the role in the local state
        } catch (err) {
            console.error("Error updating role:", err);
            alert("Error updating role");
        }
    };

    // Handle cancel action
    const handleCancel = () => {
        setEditingUser(null); // Close the edit form without saving
    };

    // Handle pagination for next and previous page
    const handleNextPage = () => {
        if (!noMoreStaffs && !loading) {
            setPage((nextPage) => nextPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (page > 1 && !loading) {
            setPage((prevPage) => prevPage - 1);
        }
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (error) {
        return <div className="error">Error: {error}</div>;
    }

    return (
        <div className="meals">
            <h1>Staffs</h1>

            {/* Conditionally render the table only if there are meals */}
            <table className="meal-table">
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Role</th>
                    <th>Action</th>
                </tr>
                </thead>
                <tbody>
                {staffs.map((staff) => (
                    <tr key={staff.user_id}>
                        <td>{staff.username}</td>
                        <td>{staff.user_role}</td>
                        <td>
                            <button
                                className="edit"
                                onClick={() => setEditingUser(staff)} // Set user for editing
                            >
                                Edit
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
                <button className="back" onClick={onBack}>
                    Back
                </button>
            </table>

            {/* Show edit modal when a user is selected for editing */}
            {editingUser && (
                <div className="edit-modal">
                    <div className="modal-content">
                        <h2>Edit User Role</h2>
                        <p>Editing: {editingUser.username}</p>
                        <div className="form-group">
                            <label htmlFor="username">Username:</label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={editingUser.username}
                                disabled
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="role">Role:</label>
                            <select
                                id="role"
                                name="role"
                                value={newRole}
                                onChange={(e) => setNewRole(e.target.value)}
                            >
                                <option value="">Select a role</option>
                                <option value="admin">Admin</option>
                                <option value="waiter">Staff</option>
                                <option value="manager">Manager</option>
                            </select>
                        </div>
                        <div className="modal-actions">
                            <button onClick={handleCancel}>Cancel</button>
                            <button onClick={handleRoleUpdate} disabled={!newRole}>
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Pagination Controls */}
            <div className="pagination">
                <button
                    onClick={handlePreviousPage}
                    disabled={page === 1 || loading}
                    className="pagination-button"
                >
                    Previous
                </button>
                <span>{`Page ${page}`}</span>
                <button
                    onClick={handleNextPage}
                    disabled={noMoreStaffs || loading}
                    className="pagination-button"
                >
                    Next
                </button>
            </div>
        </div>
    );
}

export default EditUserRole;
