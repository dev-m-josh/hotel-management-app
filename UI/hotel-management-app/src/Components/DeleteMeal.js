import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/Meals.css";

function DeleteMeal({ onBack }) {
    const [meals, setMeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(5); // Number of items per page
    const [noMoreMeals, setNoMoreMeals] = useState(false);
    const token = localStorage.getItem("authToken");
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate("/login");
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

    // Handle Meal Deletion
    const handleDeleteMeal = async (mealId) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this meal?"
        );
        if (!confirmDelete) return;

        try {
            setLoading(true);

            const response = await fetch(`http://localhost:3500/meals/${mealId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            // Remove meal from UI (optimistic UI update)
            setMeals((prevMeals) => prevMeals.filter((meal) => meal.meal_id !== mealId));

            alert("Meal deleted successfully!");
        } catch (err) {
            console.error("Error deleting meal:", err);
            alert("Failed to delete meal.");
        } finally {
            setLoading(false);
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
                    <th>Price</th>
                    <th>Action</th>
                </tr>
                </thead>
                <tbody>
                {meals.map((meal) => (
                    <tr key={meal.meal_id}>
                        <td>{meal.name}</td>
                        <td>{meal.category}</td>
                        <td>Ksh {meal.price}</td>
                        <td>
                            <button
                                className="delete-meal"
                                onClick={() => handleDeleteMeal(meal.meal_id)}
                            >
                                Delete
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <button className="back" onClick={onBack}>
                Back
            </button>

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

export default DeleteMeal;
