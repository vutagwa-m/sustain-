import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../essentials/firebase";
import { Bar, Line } from "react-chartjs-2";
import Chart from "chart.js/auto"; // Ensure Chart.js v3+ works properly
import { Link } from "react-router-dom";
import "../styles/adminAnalytics.css"; // Import external styles

const AdminAnalytics = () => {
  const [donations, setDonations] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true); // Track loading state

  useEffect(() => {
    const fetchData = async () => {
      try {
        const donationsSnapshot = await getDocs(collection(db, "donations"));
        const requestsSnapshot = await getDocs(collection(db, "food_requests"));

        setDonations(donationsSnapshot.docs.map(doc => doc.data()));
        setRequests(requestsSnapshot.docs.map(doc => doc.data()));
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      } finally {
        setLoading(false); // Stop loading when data is retrieved
      }
    };

    fetchData();
  }, []);

  // Handle cases where data is not yet loaded
  if (loading) {
    return <p className="loading-text">Loading analytics...</p>;
  }

  // Handle cases where there are no donations or requests
  if (donations.length === 0 && requests.length === 0) {
    return <p className="no-data-text">No donation or request data available.</p>;
  }

  // Process donation data for the Bar chart
  const donationData = {
    labels: donations.map((d) => d.foodType || "Unknown Food"),
    datasets: [
      {
        label: "Donations",
        data: donations.map((d) => d.quantity || 0),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Process request data for the Line chart
  const requestData = {
    labels: requests.map((r) => r.foodType || "Unknown Food"),
    datasets: [
      {
        label: "Food Requests",
        data: requests.map((r) => r.quantity || 0),
        backgroundColor: "rgba(255, 99, 132, 0.6)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 2,
        fill: true,
      },
    ],
  };

  return (
    <div className="container">
      {/* Sidebar */}
      <div className="sidebar">
        <h2>Admin Panel</h2>
        <ul>
          <li><Link to="/admin/dashboard">Dashboard</Link></li>
          <li><Link to="/admin/reports">Reports</Link></li>
          <li><Link to="/admin/analytics">Analytics</Link></li>
          <li><Link to="/admin/matching">Donation Matching</Link></li>
          <li><Link to="/admin/forecast">Food Forecast</Link></li>
          <li><Link to="/faq">FAQ</Link></li>
          <li><Link to="/settings">Settings</Link></li>
          <li className="logout"><Link to="/logout">Logout</Link></li>
        </ul>
      </div>

      {/* Main Analytics Section */}
      <div className="chart-container">
        <h2>Admin Analytics</h2>

        {donations.length > 0 ? (
          <div className="chart">
            <h3>Donation Trends</h3>
            <Bar data={donationData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        ) : (
          <p className="no-data-text">No donation data available.</p>
        )}

        {requests.length > 0 ? (
          <div className="chart">
            <h3>Request Trends</h3>
            <Line data={requestData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        ) : (
          <p className="no-data-text">No request data available.</p>
        )}
      </div>
    </div>
  );
};

export default AdminAnalytics;
