import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/Meals.css";

function Staffs({onBack}) {
    const [staffs, setStaffs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(5); // Number of items per page
    const [noMoreStaffs, setNoMoreStaffs] = useState(false);
    const token = localStorage.getItem("authToken");
    const navigate = useNavigate();
    const loggedInUser = JSON.parse(localStorage.getItem("user"));

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
    }, [page, pageSize]);

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
                                className="delete"
                                onClick={() => handleDelete(staff.user_id)}
                            >
                                Fire
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
                <button className={"back"} onClick={onBack}>Back</button>
            </table>

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

export default Staffs;
