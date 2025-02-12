import React, { useState } from "react";
import axios from 'axios';

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
            alert(response.data.message)
            onBack()
        } catch (err) {
            setError('Failed to add meal');
            console.error('Error adding meal:', err);
        }
    };

    return (
        <div>
            <h2>Add New Meal</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name:</label>
                    <input
                        type="text"
                        placeholder={"Meal name..."}
                        name="name"
                        value={meal.name.trimStart()}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Category:</label>
                    <input
                        type="text"
                        placeholder={"Meal category..."}
                        name="category"
                        value={meal.category.trimStart()}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Description:</label>
                    <textarea
                        name="description"
                        placeholder={"Type the meal description here"}
                        value={meal.description.trimStart()}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Price:</label>
                    <input
                        type="number"
                        placeholder={"Price..."}
                        name="price"
                        min={1}
                        value={meal.price}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <button className={"cancel"} onClick={onBack} >Back</button>
                    <button className={"submit"} type="submit">Add Meal</button>
                </div>
            </form>
        </div>
    );
}
