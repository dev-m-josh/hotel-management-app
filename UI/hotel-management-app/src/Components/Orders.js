import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CreateOrder from "./CreateOrder";
import "../Styles/Orders.css";

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(5);
    const [noMoreOrders, setNoMoreOrders] = useState(false);
    const [showCreateOrder, setShowCreateOrder] = useState(false);
    const token = localStorage.getItem("authToken");
    const navigate = useNavigate();

    const fetchOrders = async () => {
        if (!token) {
            navigate("/login");
            return; // Exit early if no token
        }

        setOrders([]);
        setLoading(true);
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
                throw new Error(`Error: ${response.statusText}`);
            }

            const data = await response.json();
            if (Array.isArray(data)) {
                setOrders(data);
                setNoMoreOrders(data.length < pageSize);
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
    }, [page, pageSize]);

    const toggleCreateOrder = () => {
        setShowCreateOrder((prevState) => !prevState);
    };

    const handlePagination = (direction) => {
        setPage((prev) => {
            const newPage = direction === "next" ? prev + 1 : prev - 1;
            return newPage > 0 ? newPage : 1; // Ensure the page doesn't go below 1
        });
    };

    const renderOrdersTable = () => {
        if (orders.length === 0) {
            return <div>No orders available.</div>;
        }

        return (
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
        );
    };

    const renderPagination = () => {
        return (
            <div className="pagination">
                <button
                    onClick={() => handlePagination("prev")}
                    disabled={page === 1 || loading}
                >
                    Previous
                </button>
                <span>{`Page ${page}`}</span>
                <button
                    onClick={() => handlePagination("next")}
                    disabled={noMoreOrders || loading}
                >
                    Next
                </button>
            </div>
        );
    };

    return (
        <div className="orders">
            <h1>Orders List</h1>
            <div className="new-order">
                <button className="order-btn" onClick={toggleCreateOrder}>
                    Create Order
                </button>
            </div>

            {showCreateOrder && (
                <div className="create-order-overlay">
                    <div className="create-order-container">
                        <CreateOrder toggleCreateOrder={toggleCreateOrder} />
                    </div>
                </div>
            )}

            <div className={showCreateOrder ? "orders-blurred" : ""}>
                {loading ? (
                    <div>Loading...</div>
                ) : error ? (
                    <div style={{ color: "red" }}>{`Error: ${error}`}</div>
                ) : (
                    renderOrdersTable()
                )}

                {renderPagination()}
            </div>
        </div>
    );
}
