import React, { useState } from "react";
import axios from 'axios';
import "../Styles/AddMeal.css";

export default function AddMeal({onBack}) {
    const token = localStorage.getItem("authToken"); // Authorization token

    const [meal, setMeal] = useState({
        name: '',
        category: '',
        description: '',
        price: `${''}`
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setMeal(prevMeal => ({
            ...prevMeal,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                'http://localhost:3500/meals',
                meal,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            alert(response.data.message);
            onBack();
        } catch (err) {
            setError('Failed to add meal');
            console.error('Error adding meal:', err);
        }
    };

    return (
        <div className="add-meal-container">
            <h2 className="add-meal-heading">Add New Meal</h2>
            {error && <p className="error-message">{error}</p>}
            <form className="add-meal-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label">Name:</label>
                    <input
                        type="text"
                        className="form-input"
                        placeholder={"Meal name..."}
                        name="name"
                        value={meal.name.trimStart()}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Category:</label>
                    <input
                        type="text"
                        className="form-input"
                        placeholder={"Meal category..."}
                        name="category"
                        value={meal.category.trimStart()}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Description:</label>
                    <textarea
                        className="form-input"
                        name="description"
                        placeholder={"Type the meal description here"}
                        value={meal.description.trimStart()}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Price:</label>
                    <input
                        type="number"
                        className="form-input"
                        placeholder={"Price..."}
                        name="price"
                        min={1}
                        value={meal.price}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-buttons">
                    <button className="cancel-button" type="button" onClick={onBack}>Back</button>
                    <button className="submit-button" type="submit">Add Meal</button>
                </div>
            </form>
        </div>
    );
}
