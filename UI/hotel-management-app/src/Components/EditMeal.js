import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/Meals.css";

function EditMeal({ onBack }) {
    const [meals, setMeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(5);
    const [noMoreMeals, setNoMoreMeals] = useState(false);
    const [editingMeal, setEditingMeal] = useState(null); // Track the meal being edited
    const [newPrice, setNewPrice] = useState(""); // Track the new price
    const token = localStorage.getItem("authToken");
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate("/login");
        }

        const fetchMeals = async () => {
            try {
                setLoading(true);
                const response = await fetch(
                    `http://localhost:3500/meals?page=${page}&pageSize=${pageSize}`
                );
                if (!response.ok) {
                    throw new Error(`Error: ${response.statusText}`);
                }

                const data = await response.json();
                if (Array.isArray(data)) {
                    setMeals(data);
                    setNoMoreMeals(data.length < pageSize);
                } else {
                    throw new Error("Unexpected response format");
                }
            } catch (err) {
                console.error("Error fetching meals:", err);
                setError(err.message);
            } finally {
                setLoading(false);
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

    const handleEditClick = (meal) => {
        setEditingMeal(meal); // Set the meal being edited
        setNewPrice(meal.price); // Set the current price as the starting value in the form
    };

    const handlePriceChange = (e) => {
        setNewPrice(e.target.value); // Update the new price
    };

    const handleSaveEdit = async () => {
        if (newPrice === "") {
            alert("Price cannot be empty");
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:3500/meals/${editingMeal.meal_id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ price: newPrice }),
                }
            );

            if (response.ok) {
                alert("Meal updated successfully!");
                // Reset the edit form and the price field
                setEditingMeal(null);
                setNewPrice("");

                // After the edit, fetch meals again to reflect the updated meal
                setPage(1); // Reset to first page to show updated list of meals
                setError(null); // Clear any previous errors
                const responseMeals = await fetch(
                    `http://localhost:3500/meals?page=${page}&pageSize=${pageSize}`
                );
                if (!responseMeals.ok) {
                    throw new Error(`Error: ${responseMeals.statusText}`);
                }
                const mealsData = await responseMeals.json();
                if (Array.isArray(mealsData)) {
                    setMeals(mealsData);
                    setNoMoreMeals(mealsData.length < pageSize);
                } else {
                    throw new Error("Unexpected response format");
                }
            } else {
                throw new Error("Failed to update meal");
            }
        } catch (err) {
            console.error("Error updating meal:", err);
            setError("Failed to update meal");
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
                                className={"edit-btn"}
                                onClick={() => handleEditClick(meal)}
                            >
                                Edit
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {/* Display the Edit Form */}
            {editingMeal && (
                <div className="edit-form">
                    <h2>Edit Meal</h2>
                    <div>
                        <label>Meal Name:</label>
                        <input
                            type="text"
                            value={editingMeal.name}
                            disabled
                        />
                    </div>
                    <div>
                        <label>Category:</label>
                        <input
                            type="text"
                            value={editingMeal.category}
                            disabled
                        />
                    </div>
                    <div>
                        <label>Price:</label>
                        <input
                            type="number"
                            value={newPrice}
                            onChange={handlePriceChange}
                        />
                    </div>
                    <button onClick={handleSaveEdit}>Save</button>
                    <button onClick={() => setEditingMeal(null)}>Cancel</button>
                </div>
            )}

            <button className={""} onClick={onBack}>
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

export default EditMeal;
