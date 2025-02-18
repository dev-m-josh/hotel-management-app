import React, { useState } from "react";
import axios from "axios";

function SalesReport({onBack}) {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [totalSales, setTotalSales] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem('authToken');

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!startDate || !endDate) {
            setError("Both start and end dates are required.");
            return;
        }

        setLoading(true);
        setError(""); // Reset error message before API call

        try {
            // Send GET request to the backend with the dates
            const response = await axios.get(
                "http://localhost:3500/sales/timespan",
                {
                    params: {
                        start: startDate,
                        end: endDate,
                    },
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = response.data

            // Check if there's any sales data returned
            if (data.total_sales === null) {
                alert("No sales made during this period")
                setTotalSales(null);
            } else {
                setTotalSales(data.total_sales);
            }
        } catch (err) {
            setError("An error occurred while fetching the data.");
            console.error("Error fetching sales data:", err);
        } finally {
            setLoading(false); // End loading
        }
    };

    const handleBack = () => {
        setTotalSales(null);
        setStartDate('');
        setEndDate('');
    };

    return (
        <div className="sales-report">
            <h2>Sales Report</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="startDate">Start Date:</label>
                    <input
                        type="date"
                        id="startDate"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="endDate">End Date:</label>
                    <input
                        type="date"
                        id="endDate"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        required
                    />
                </div>
                <div className={"sales-buttons"}>
                    <button className={"cancel-button"}
                            type={"button"}
                            onClick={onBack}
                        >
                        Back
                    </button>
                    <button className={"back"} type="submit" disabled={loading}>
                        {loading ? "Loading..." : "Get Sales"}
                    </button>
                </div>
            </form>

            {error && <p className="error">{error}</p>}

            {totalSales !== null && (
                <div className="result">
                    <h1>Total Sales</h1>
                    <h3>From: {startDate}</h3>
                    <h3>To: {endDate}</h3>
                    <h3>= ${totalSales}</h3>
                    <button className={"cancel-button"} onClick={handleBack}>Back</button>
                </div>
            )}
        </div>
    );
}

export default SalesReport;
