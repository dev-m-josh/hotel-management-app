import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/Staffs.css";

function EditUserRole({ onBack }) {
    const [staffs, setStaffs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingUser, setEditingUser] = useState(null); // State to track user being edited
    const [newRole, setNewRole] = useState(""); // State to hold the new role
    const [page, setPage] = useState(1); // State for pagination
    const [pageSize] = useState(5); // Page size for pagination
    const [noMoreStaffs, setNoMoreStaffs] = useState(false); // Check if more staff exists
    const navigate = useNavigate();
    const token = localStorage.getItem("authToken");

    // Fetch staff data with pagination
    useEffect(() => {
        const fetchStaffs = async () => {
            if (!token) {
                navigate("/login");
                return;
            }

            try {
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
                    throw new Error(`${response.statusText}`);
                }

                const data = await response.json();
                setStaffs(data);

                if (data.length < pageSize) {
                    setNoMoreStaffs(true);
                } else {
                    setNoMoreStaffs(false);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
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

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="staffs">
            <div className="staffs-header">
                <h1>Staff List</h1>
            </div>
            <div className="staff-table">
                <table>
                    <thead>
                    <tr>
                        <th>Username</th>
                        <th>Position</th>
                        <th>Actions</th>
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
                </table>
            </div>

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

            <button className="back" onClick={onBack}>
                Back
            </button>

            <div className="pagination">
                <button
                    onClick={() => setPage((prevPage) => Math.max(prevPage - 1, 1))}
                    disabled={page === 1 || loading}
                >
                    Previous
                </button>
                <span>{`Page ${page}`}</span>
                <button
                    onClick={() => setPage((nextPage) => nextPage + 1)}
                    disabled={noMoreStaffs || loading}
                >
                    Next
                </button>
            </div>
        </div>
    );
}

export default EditUserRole;
