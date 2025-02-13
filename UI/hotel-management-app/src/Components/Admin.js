import React, { useState, useEffect  } from "react";
import { useNavigate } from 'react-router-dom';
import '../Styles/Admin.css';
import AddMeal from './AddMeal';

function Admin() {
    const navigate = useNavigate();
    const [isAddingMeal, setIsAddingMeal] = useState(false);

    useEffect(() => {
        // Get user from localStorage
        const user = JSON.parse(localStorage.getItem("user"));

        // Check if the user is logged in and has the role of 'admin'
        if (!user || user.role !== 'admin') {
            // Redirect non-admin users to home or login
            navigate('/');
        }
    }, [navigate]);

    // Toggle the Add Meal form visibility
    const toggleAddMealForm = () => {
        setIsAddingMeal(!isAddingMeal);
    };

    return (
        <div className="admin">
            <h1>Admin Tasks</h1>
            <div className="list">
                <ul>
                    <li><button onClick={toggleAddMealForm}>Add meal</button></li>
                    <li><button>Delete user</button></li>
                    <li><button>Delete meal</button></li>
                    <li><button>Edit user role</button></li>
                </ul>
            </div>

            {/* Show the AddMeal form if isAddingMeal is true */}
            {isAddingMeal && <AddMeal onBack={toggleAddMealForm} />}
        </div>
    );
}

export default Admin;
