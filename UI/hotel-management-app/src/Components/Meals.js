import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/Meals.css";

function Meals() {
    const [meals, setMeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(5); // Number of items per page
    const [noMoreMeals, setNoMoreMeals] = useState(false);
    const token = localStorage.getItem("authToken");
    const navigate = useNavigate();

    useEffect(() => {
        if (!token){
            navigate("/login")
        }

        const fetchMeals = async () => {
            try {
                setLoading(true); // Set loading state to true while fetching

                // Call the API
                const response = await fetch(
                    `http://localhost:3500/meals?page=${page}&pageSize=${pageSize}`
                );

                if (!response.ok) {
                    throw new Error(`Error: ${response.statusText}`);
                }

                const data = await response.json();

                if (Array.isArray(data)) {
                    setMeals(data);

                    if (data.length < pageSize) {
                        setNoMoreMeals(true);
                    } else {
                        setNoMoreMeals(false);
                    }
                } else {
                    throw new Error("Unexpected response format");
                }
            } catch (err) {
                console.error("Error fetching meals:", err);
                setError(err.message);
            } finally {
                setLoading(false); // Set loading state to false after fetching
            }
        };

        fetchMeals();
    }, [page, pageSize]);

    // Handle pagination for next and previous page
    const handleNextPage = () => {
        if (!noMoreMeals && !loading) {
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
            <h1>Menu</h1>

            {/* Conditionally render the table only if there are meals */}
            <table className="meal-table">
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Description</th>
                    <th>Price</th>
                </tr>
                </thead>
                <tbody>
                {meals.map((meal) => (
                    <tr key={meal.meal_id}>
                        <td>{meal.name}</td>
                        <td>{meal.category}</td>
                        <td>{meal.description}</td>
                        <td>Ksh {meal.price}</td>
                    </tr>
                ))}
                </tbody>
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
                    disabled={noMoreMeals || loading}
                    className="pagination-button"
                >
                    Next
                </button>
            </div>
        </div>
    );
}

export default Meals;
