import React, { useState, useEffect } from "react";

function Meals() {
  const [meals, setMeals] = useState([]); // State to hold the meals data
  const [loading, setLoading] = useState(true); // State for loading indicator
  const [error, setError] = useState(null); // State for error handling
  const [page, setPage] = useState(1); // Current page for pagination
  const [pageSize] = useState(2); // Number of items per page
  const [totalMeals, setTotalMeals] = useState(0); // Total meals for pagination calculation

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        // Call the API with query parameters for pagination
        const response = await fetch(`http://localhost:3000/meals?page=${page}&pageSize=${pageSize}`);
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        setMeals(data.meals); // Update state with fetched meals
        setTotalMeals(data.totalMeals); // Update the total number of meals available
      } catch (err) {
        console.error("Error fetching meals:", err);
        setError(err.message); // Handle errors if the request fails
      } finally {
        setLoading(false); // Set loading to false once data is fetched
      }
    };

    fetchMeals();
  }, [page, pageSize]); // Re-run the effect if page or pageSize changes

  if (loading) {
    return <div>Loading...</div>; // Display loading state while fetching data
  }

  if (error) {
    return <div>Error: {error}</div>; // Display error if request fails
  }

  // Pagination calculation
  const totalPages = Math.ceil(totalMeals / pageSize);

  return (
    <div className="meals">
      <h1>Menu</h1>
      <div className="meal-list">
        {meals.length === 0 ? (
          <h2>No meals available.</h2> // Message when no meals are available
        ) : (
          meals.map((meal) => (
            <div key={meal.meal_id} className="meal-card">
              <h3>{meal.name}</h3>
              <h4>{meal.category}</h4>
              <p>{meal.description}</p>
              <h3>${meal.price}</h3>
              <button className="add-to-order">Add to Order</button>
            </div>
          ))
        )}
      </div>

      {/* Pagination Controls */}
      <div className="pagination">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className="pagination-button"
        >
          Previous
        </button>
        <button
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}
          className="pagination-button"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Meals;
