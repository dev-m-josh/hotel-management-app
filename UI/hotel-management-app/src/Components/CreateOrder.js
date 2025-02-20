import React, { useState, useEffect } from "react";
import "../Styles/Orders.css";

export default function CreateOrder({ toggleCreateOrder }) {
    const [tableNumber, setTableNumber] = useState("");
    const [orderStatus, setOrderStatus] = useState("pending");
    const [formError, setFormError] = useState("");
    const [meals, setMeals] = useState([]);
    const [quantities, setQuantities] = useState({});
    const [showForm, setShowForm] = useState(true);
    const [selectedMeals, setSelectedMeals] = useState([]);
    const [orderId, setOrderId] = useState("");
    const token = localStorage.getItem("authToken");
    const loggedInUser = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        const fetchMeals = async () => {
            if (!token) {
                setFormError("No token found!");
                return;
            }

            try {
                const response = await fetch(
                    `http://localhost:3500/meals?page=1&pageSize=10`
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch meals.");
                }

                const data = await response.json();
                setMeals(data);
            } catch (err) {
                setFormError("Error fetching meals");
                console.error(err);
            }
        };

        fetchMeals();
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError("");

        if (!tableNumber || !orderStatus) {
            setFormError("Both table number and order status are required");
            return;
        }

        if (!loggedInUser || !loggedInUser.user_id) {
            setFormError("User is not logged in.");
            return;
        }

        try {
            const response = await fetch("http://localhost:3500/orders", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    waiter_id: loggedInUser.user_id,
                    table_number: tableNumber,
                    order_status: orderStatus,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to create order");
            }

            const data = await response.json();
            setOrderId(data.orderId);
            alert(`Order created successfully! Order ID: ${data.orderId}`);
            setShowForm(false); // After creating the order, hide the form
        } catch (err) {
            setFormError("An error occurred. Please try again later.");
            console.error("Error creating order:", err);
        }
    };

    const handleCancelOrder = async () => {
        if (!orderId) {
            setFormError("No order ID available for cancellation.");
            return;
        }

        try {
            const response = await fetch(`http://localhost:3500/orders/${orderId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to cancel the order");
            }

            const data = await response.json();

            if (data.success) {
                alert("Order canceled successfully.");
                toggleCreateOrder(); // Close modal
            } else {
                setFormError("Failed to cancel the order. Please try again.");
            }
        } catch (err) {
            setFormError(
                "An error occurred while canceling the order. Please try again."
            );
            console.error("Error canceling order:", err);
        }
    };

    const handlePlaceOrder = async () => {
        if (selectedMeals.length === 0) {
            setFormError("Please select at least one meal.");
            return;
        }

        try {
            const orderItems = selectedMeals.map((meal) => ({
                order_id: orderId,
                meal_id: meal.meal_id,
                quantity: Number(quantities[meal.meal_id]) || 1,
            }));

            const response = await fetch("http://localhost:3500/orders/order-items", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(orderItems),
            });

            if (!response.ok) {
                throw new Error("Failed to place the order. Please try again.");
            }

            const data = await response.json();

            if (data.message === "Items added successfully") {
                alert("Order placed successfully!");
                toggleCreateOrder(); // Close modal
            } else {
                setFormError("Failed to place the order. Please try again.");
            }
        } catch (err) {
            setFormError(
                "An error occurred while placing the order. Please try again."
            );
            console.error("Error placing order:", err);
        }
    };

    const handleCloseModal = () => {
        toggleCreateOrder(); // Close modal
    };

    return (
        <div className="create-order">
            {showForm ? (
                <div className="initiate-order">
                    <h1>Create New Order</h1>

                    <div className="inputs">
                        <label>Table Number:</label>
                        <input
                            type="number"
                            min="1"
                            value={tableNumber}
                            onChange={(e) => setTableNumber(e.target.value)}
                            required
                        />
                    </div>

                    <div className="inputs">
                        <label>Order Status:</label>
                        <select
                            value={orderStatus}
                            onChange={(e) => setOrderStatus(e.target.value)}
                        >
                            <option value="pending">Pending</option>
                            <option value="served">Served</option>
                        </select>
                    </div>

                    {formError && <p style={{ color: "red" }}>{formError}</p>}
                    <div className="order-buttons">
                        <button className="cancel-order" onClick={handleCloseModal}>
                            Close
                        </button>
                        <button className="place-order-btn" onClick={handleSubmit}>Create Order</button>
                    </div>
                </div>
            ) : (
                <div className="place-order">
                    <div className="meals-list">
                        <h3>Select Meals</h3>
                        <table>
                            <thead>
                            <tr>
                                <th>Meal Name</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Action</th>
                            </tr>
                            </thead>
                            <tbody>
                            {meals.map((meal) => (
                                <tr key={meal.meal_id}>
                                    <td>{meal.name}</td>
                                    <td>${meal.price}</td>
                                    <td>
                                        <input style={{ width: "70px" }}
                                               type="number"
                                               value={quantities[meal.meal_id] || 1}
                                               onChange={(e) =>
                                                   setQuantities((prev) => ({
                                                       ...prev,
                                                       [meal.meal_id]: e.target.value,
                                                   }))
                                               }
                                               min="1"
                                        />
                                    </td>
                                    <td>
                                        <button
                                            className="order-button"
                                            onClick={() => {
                                                setSelectedMeals((prev) =>
                                                    prev.some((m) => m.meal_id === meal.meal_id)
                                                        ? prev.filter((m) => m.meal_id !== meal.meal_id)
                                                        : [...prev, meal]
                                                );
                                            }}
                                        >
                                            {selectedMeals.some((m) => m.meal_id === meal.meal_id)
                                                ? "Remove"
                                                : "Add"}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="selected-meals">
                        <h3>Selected Meals</h3>
                        <table>
                            <thead>
                            <tr>
                                <th>Meal Name</th>
                                <th>Quantity</th>
                                <th>Total Cost</th>
                            </tr>
                            </thead>
                            <tbody>
                            {selectedMeals.map((selectedMeal) => {
                                const meal = meals.find(
                                    (meal) => meal.meal_id === selectedMeal.meal_id
                                );
                                const quantity = quantities[selectedMeal.meal_id] || 1;
                                const totalCost = meal ? meal.price * quantity : 0;
                                return (
                                    <tr key={selectedMeal.meal_id}>
                                        <td>{meal?.name}</td>
                                        <td>{quantity}</td>
                                        <td>${totalCost.toFixed(2)}</td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>

                        {formError && (
                            <p className="place-order-error" style={{ color: "red" }}>
                                {formError}
                            </p>
                        )}

                        <div className="order-buttons">
                            <button className="cancel-order" onClick={handleCancelOrder}>
                                Cancel Order
                            </button>
                            <button className="place-order-btn" onClick={handlePlaceOrder}>Place Order</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
