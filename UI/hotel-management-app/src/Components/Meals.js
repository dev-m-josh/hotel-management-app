import React, { useState, useEffect } from "react";
import '../App.css';

function Meals() {
  const [meals, setMeals] = useState([]); // State to hold the meals data
  const [loading, setLoading] = useState(true); // State for loading indicator
  const [error, setError] = useState(null); // State for error handling
  const [page, setPage] = useState(1); // Current page for pagination
  const [pageSize] = useState(4); // Number of items per page
  const [noMoreMeals, setNoMoreMeals] = useState(false); // State to track if there are no more meals

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
  
        // If no meals are returned
        if (data.meals.length < pageSize) {
          setNoMoreMeals(true); // If less than pageSize, no more meals to show
        } else {
          setNoMoreMeals(false);
        }
  
      } catch (err) {
        console.error("Error fetching meals:", err);
        setError(err.message); // Handle errors if the request fails
      } finally {
        setLoading(false); // Set loading to false once data is fetched
      }
    };
  
    fetchMeals();
  }, [page, pageSize]); // Re-run the effect if page or pageSize changes
  


  const deleteMeal = async (mealId) => {
    try {
      // Get the token from localStorage (or wherever it's stored)
      const token = localStorage.getItem('authToken');
  
      if (!token) {
        throw new Error('You must be logged in to delete a meal.');
      }
  
      const response = await fetch(`http://localhost:3000/meals/${mealId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`, // Add the token to the request headers
        },
      });
  
      if (!response.ok) {
        throw new Error('Error deleting meal');
      }
  
      // After deleting the meal, update the state to reflect the changes
      setMeals(meals.filter(meal => meal.meal_id !== mealId));
      alert('Meal deleted successfully!'); // show a success message
    } catch (err) {
      console.error('Error deleting meal:', err);
      setError(err.message); // Set error state
      alert('Failed to delete meal. Please try again.');
    }
  };
  
   


  if (loading) {
    return <div>Loading...</div>; // Display loading state while fetching data
  }

  if (error) {
    return <div>Error: {error}</div>; // Display error if request fails
  }


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
              <h4><span>Category: </span>{meal.category}</h4>
              <p>{meal.description}</p>
              <h3>${meal.price}</h3>
              <button className="delete-meal" onClick={() => deleteMeal(meal.meal_id)}>Delete</button>
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
          disabled={noMoreMeals} // Disable Next if no more meals
          className="pagination-button"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Meals;
