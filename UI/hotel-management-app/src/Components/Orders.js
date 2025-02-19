import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CreateOrder from "./CreateOrder";
import "../Styles/Orders.css";

export default function Orders() {
    const [orders, setOrders] = useState([]); // Store the list of orders
    const [loading, setLoading] = useState(true); // Track loading state
    const [error, setError] = useState(null); // Handle errors
    const [page, setPage] = useState(1); // Pagination state
    const [pageSize] = useState(5); // Items per page
    const [noMoOrders, setNoMoreOrders] = useState(false); // Flag for no more orders
    const [showCreateOrder, setShowCreateOrder] = useState(false); // Control CreateOrder visibility
    const token = localStorage.getItem("authToken"); // Authorization token
    const navigate = useNavigate();

    // Fetch orders when the component mounts or when page changes
    const fetchOrders = async () => {
        if (!token) {
            navigate("/login");
        }

        setOrders([]);

        try {
            const response = await fetch(
                `http://localhost:3500/orders?page=${page}&pageSize=${pageSize}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Failed to fetch orders.");
            }

            const data = await response.json();

            if (Array.isArray(data)) {
                setOrders(data);

                // Check if there are more orders to fetch
                if (data.length < pageSize) {
                    setNoMoreOrders(true);
                } else {
                    setNoMoreOrders(false);
                }
            } else {
                throw new Error(data.message);
            }
        } catch (err) {
            setError(err.message);
            console.error("Error fetching orders:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [page]);

    const toggleCreateOrder = () => {
        setShowCreateOrder((prevState) => !prevState);
    };

    return (
        <div className="orders">
            <h1>Orders List</h1>
            <div className="new-order">
                <button className="order-btn" onClick={toggleCreateOrder}>
                    Create Order
                </button>
            </div>

            {/* Render CreateOrder or EditMealOrders when toggled */}
            {showCreateOrder && (
                <div className="create-order-overlay">
                    <div className="create-order-container">
                        <CreateOrder toggleCreateOrder={toggleCreateOrder} />
                    </div>
                </div>
            )}

            {/* Apply blur effect to Orders table when CreateOrder or EditMealOrders is showing */}
            <div
                className={"orders-blurred"}
            >
                {loading ? (
                    <div>Loading...</div>
                ) : error ? (
                    <div style={{ color: "red" }}>{`Error: ${error}`}</div>
                ) : (
                    <table className="orders-table">
                        <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Meal Name</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Total Cost</th>
                        </tr>
                        </thead>
                        <tbody>
                        {orders.map((order) => (
                            <tr key={order.order_id}>
                                <td>{order.order_id}</td>
                                <td>{order.meal_name}</td>
                                <td>${order.meal_price}</td>
                                <td>{order.quantity}</td>
                                <td>${order.total_cost}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}

                {/* Pagination Controls */}
                <div className="pagination">
                    <button
                        onClick={() => setPage((prev) => prev - 1)}
                        disabled={page === 1 || loading}
                    >
                        Previous
                    </button>
                    <span>{`Page ${page}`}</span>
                    <button
                        onClick={() => setPage((prev) => prev + 1)}
                        disabled={noMoOrders || loading}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}
