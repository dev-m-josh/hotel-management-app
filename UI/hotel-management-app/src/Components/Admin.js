import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import '../Styles/Admin.css';
import AddMeal from './AddMeal';
import DeleteUser from './DeleteUser';
import DeleteMeal from './DeleteMeal';
import EditMeal from "./EditMeal";

function Admin() {
    const navigate = useNavigate();
    const [activeForm, setActiveForm] = useState(''); // Track active form
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        // Get user from localStorage
        const user = JSON.parse(localStorage.getItem("user"));

        // Check if the user is logged in and has the role of 'admin'
        if (!user || user.role !== 'admin') {
            // Redirect non-admin users to home or login
            navigate('/');
        } else {
            setIsAdmin(true);
        }
    }, [navigate]);

    // Toggle the active form
    const toggleForm = (form) => {
        setActiveForm(activeForm === form ? '' : form); // Toggle form visibility
    };

    return (
        <div className="admin">
            <h1>Admin Dashboard</h1>
            <h4>Select an option to manage meals and users.</h4>
            <div className="list">
                <ul>
                    <li><button onClick={() => toggleForm('addMeal')}>Add Meal</button></li>
                    <li><button onClick={() => toggleForm('deleteMeal')}>Delete Meal</button></li>
                    <li><button onClick={() => toggleForm('editMeal')}>Edit Meal</button></li>
                    <li><button onClick={() => toggleForm('deleteUser')}>Delete User</button></li>
                    <li><button>Edit User Role</button></li>
                </ul>
            </div>

            {/* Conditionally render the background blur when a form is active */}
            {activeForm && <div className="blur-background" />}

            {/* Conditional rendering of forms */}
            {activeForm === 'addMeal' && (
                <div className="modal-form">
                    <AddMeal onBack={() => setActiveForm('')} />
                </div>
            )}
            {activeForm === 'deleteMeal' && (
                <div className="modal-form">
                    <DeleteMeal onBack={() => setActiveForm('')} />
                </div>
            )}
            {activeForm === 'editMeal' && (
                <div className="modal-form">
                    <EditMeal onBack={() => setActiveForm('')} />
                </div>
            )}
            {activeForm === 'deleteUser' && (
                <div className="modal-form">
                    <DeleteUser onBack={() => setActiveForm('')} />
                </div>
            )}
        </div>
    );
}

export default Admin;
