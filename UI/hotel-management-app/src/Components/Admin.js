import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import '../Styles/Admin.css';
import AddMeal from './AddMeal';
import DeleteUser from './DeleteUser';
import DeleteMeal from './DeleteMeal';

function Admin() {
    const navigate = useNavigate();
    const [isAddingMeal, setIsAddingMeal] = useState(false);
    const [isDeletingUser, setIsDeletingUser] = useState(false);
    const [isDeletingMeal, setIsDeletingMeal] = useState(false);

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
        setIsDeletingUser(false);
        setIsDeletingMeal(false);
    };

    // Toggle the Delete User form visibility
    const toggleDeleteUserForm = () => {
        setIsDeletingUser(!isDeletingUser);
        setIsAddingMeal(false);
        setIsDeletingMeal(false);
    };

    // Toggle the Delete Meal form visibility
    const toggleDeleteMealForm = () => {
        setIsDeletingMeal(!isDeletingMeal);
        setIsAddingMeal(false);
        setIsDeletingUser(false); 
    };

    return (
        <div className="admin">
            <h1>Admin Tasks</h1>
            <div className="list">
                <ul>
                    <li><button onClick={toggleAddMealForm}>Add meal</button></li>
                    <li><button onClick={toggleDeleteMealForm}>Delete meal</button></li>
                    <li><button>Edit meal</button></li>
                    <li><button onClick={toggleDeleteUserForm}>Delete user</button></li>
                    <li><button>Edit user role</button></li>
                </ul>
            </div>

            {/* Show the AddMeal form if isAddingMeal is true */}
            {isAddingMeal && <AddMeal onBack={toggleAddMealForm} />}

            {/* Show the DeleteUser form if isDeletingUser is true */}
            {isDeletingUser && <DeleteUser onBack={toggleDeleteUserForm} />}

            {/* Show the DeleteMeal form if isDeletingMeal is true */}
            {isDeletingMeal && <DeleteMeal onBack={toggleDeleteMealForm} />}
        </div>
    );
}

export default Admin;
