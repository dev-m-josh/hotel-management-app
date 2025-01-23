import React, { useState, useEffect } from "react";
import '../App.css';


function Staffs() {
  const [staffs, setStaffs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(6);
  const [totalPages, setTotalPages] = useState(1);

  // Retrieving the token from localStorage
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchStaffs = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/users?page=${page}&pageSize=${pageSize}`,
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
        setStaffs(data.staffs);
        setTotalPages(data.totalPages);
      } catch (err) {
        console.error("Error fetching staffs:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchStaffs();
    } else {
      setError("No token found");
    }
  }, [page, pageSize, token]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="staffs">
      <h1>Staff List</h1>
      <div className="staff-list">
        {staffs.length === 0 ? (
          <h2>No staffs available.</h2>
        ) : (
          staffs.map((staff) => (
            <div key={staff.staff_id} className="staff-card">
              <h3>{staff.username}</h3>
              <h4><span>Position: </span>{staff.user_role}</h4>
              <p><span>Email: </span>{staff.user_email}</p>
              <button className="edit">Edit</button>
              <button className="delete">Delete</button>
            </div>
          ))
        )}
      </div>

      <div className="pagination">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
        >
          Previous
        </button>
        <span>Page {page} of {totalPages}</span>
        <button
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Staffs;
