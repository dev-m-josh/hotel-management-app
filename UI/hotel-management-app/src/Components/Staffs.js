import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/Staffs.css";

function Staffs() {
    const [staffs, setStaffs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(10);
    const [noMoreStaffs, setNoMoreStaffs] = useState(false);
    const [staffId, setStaffId] = useState(null); // Track the staff being edited
    const [newName, setNewName] = useState(""); // Store the new name
    const [isEditing, setIsEditing] = useState(false); // Editing state

    const navigate = useNavigate();
    const token = localStorage.getItem("authToken");
    const loggedInUser = localStorage.getItem("user");

    const initialRender = useRef(true);

    useEffect(() => {
        if (initialRender.current) {
            initialRender.current = false;
            return;
        }

        const fetchStaffs = async () => {
            if (!token) {
                navigate("/login");
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

                if (Array.isArray(data)) {
                    setStaffs(data);

                    if (data.length < pageSize) {
                        setNoMoreStaffs(true);
                    } else {
                        setNoMoreStaffs(false);
                    }
                } else {
                    throw new Error(data.message);
                }
            } catch (err) {
                console.error("Error fetching staffs:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchStaffs();
    }, [page, pageSize, token, navigate]);

    const handleDelete = async (staffId) => {
        if (loggedInUser.role !== "admin") {
            alert("You can't delete this user!");
            return;
        }

        const confirmDelete = window.confirm("Are you sure you want to fire this staff?");
        if (!confirmDelete) return;

        try {
            const response = await fetch(`http://localhost:3500/users/${staffId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to delete staff");
            }

            setStaffs((prevStaffs) => prevStaffs.filter((staff) => staff.user_id !== staffId));
            alert(data.message);
        } catch (err) {
            console.error("Error deleting staff:", err);
            setError(err.message);
        }
    };

    const handleEditUser = (staffId, currentUsername) => {
        setStaffId(staffId);
        setNewName(currentUsername); // Set the current username as the default value
        setIsEditing(true);
    };

    const handleUsernameChange = (e) => {
        setNewName(e.target.value); // Update the new username
    };

    console.log(staffId)

    const handleUpdateUsername = async () => {
        if (!newName.trim()) {
            alert("Username cannot be empty.");
            return;
        }

        try {
            const response = await fetch(`http://localhost:3500/users/${staffId}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username: newName }),
            });

            const data = await response.json();
            console.log(data);

            if (!response.ok) {
                throw new Error(data.message || "Failed to update username");
            }

            // Update the staff list with the new username
            setStaffs((prevStaffs) =>
                prevStaffs.map((staff) =>
                    staff.user_id === staffId ? { ...staff, username: newName } : staff
                )
            );

            alert(data.message); // Success message
            setIsEditing(false); // Close the editing form
        } catch (err) {
            console.error("Error updating username:", err);
            setError(err.message);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    const handleNextPage = () => {
        if (!noMoreStaffs) {
            setPage((nextPage) => nextPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (page > 1) {
            setPage((prevPage) => prevPage - 1);
        }
    };

    return (
        <div className="staffs">
            <h1>Staff List</h1>
            <div className="staff-table">
                <table>
                    <thead>
                    <tr>
                        <th>Username</th>
                        <th>Position</th>
                        <th>Email</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {staffs.map((staff) => (
                        <tr key={staff.user_id}>
                            <td>{staff.username}</td>
                            <td>{staff.user_role}</td>
                            <td>{staff.user_email}</td>
                            <td>
                                <button
                                    className="delete"
                                    onClick={() => handleDelete(staff.user_id)}
                                >
                                    Fire
                                </button>
                                <button
                                    className="edit-btn"
                                    onClick={() =>
                                        handleEditUser(staff.user_id, staff.username)
                                    }
                                >
                                    Edit
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {isEditing && (
                <div className="edit-form">
                    <h3>Edit User Name</h3>
                    <input
                        type="text"
                        value={newName}
                        onChange={handleUsernameChange}
                    />
                    <button onClick={handleUpdateUsername}>Update Username</button>
                    <button onClick={() => setIsEditing(false)}>Cancel</button>
                </div>
            )}

            <div className="pagination">
                <button
                    onClick={handlePreviousPage}
                    disabled={page === 1 || loading}
                >
                    Previous
                </button>
                <span>{`Page ${page}`}</span>
                <button
                    onClick={handleNextPage}
                    disabled={noMoreStaffs || loading}
                >
                    Next
                </button>
            </div>
        </div>
    );
}

export default Staffs;
