import React, { useState, useEffect, useMemo } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../essentials/firebase";
import { Link } from "react-router-dom";
import { Document, Page, Text, View, PDFDownloadLink, StyleSheet } from "@react-pdf/renderer";
import "../styles/adminAnalytics.css"; // Ensure CSS is imported

const styles = StyleSheet.create({
  page: { padding: 20, fontSize: 12 },
  section: { marginBottom: 10 },
  header: { fontSize: 18, marginBottom: 10, fontWeight: "bold" },
  text: { marginBottom: 5 },
});

const Reports = () => {
  const [data, setData] = useState({
    totalDonations: 0,
    totalRequests: 0,
    popularFood: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const donationsSnapshot = await getDocs(collection(db, "donations"));
        const requestsSnapshot = await getDocs(collection(db, "requests"));

        let foodCount = {};
        requestsSnapshot.forEach((doc) => {
          const foodType = doc.data().foodType;
          foodCount[foodType] = (foodCount[foodType] || 0) + 1;
        });

        const sortedFood = Object.entries(foodCount)
          .sort((a, b) => b[1] - a[1])
          .map(([key]) => key);

        setData({
          totalDonations: donationsSnapshot.size,
          totalRequests: requestsSnapshot.size,
          popularFood: sortedFood,
        });
      } catch (error) {
        console.error("Error fetching reports data:", error);
      }
    };

    fetchData();
  }, []);

  const ReportDocument = useMemo(() => (
    <Document>
      <Page style={styles.page}>
        <Text style={styles.header}>Admin Food Waste Report</Text>
        <View style={styles.section}>
          <Text style={styles.text}>Total Donations: {data.totalDonations}</Text>
          <Text style={styles.text}>Total Requests: {data.totalRequests}</Text>
          <Text style={styles.text}>
            Most Requested Food: {data.popularFood.length > 0 ? data.popularFood.join(", ") : "N/A"}
          </Text>
        </View>
      </Page>
    </Document>
  ), [data]);

  return (
    <div className="container">
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

      <div className="content">
        <h2>Reports</h2>
        <p><strong>Total Donations:</strong> {data.totalDonations}</p>
        <p><strong>Total Requests:</strong> {data.totalRequests}</p>
        <p><strong>Most Requested Food:</strong> {data.popularFood.join(", ") || "N/A"}</p>

        {/* PDF Download Button */}
        <PDFDownloadLink document={ReportDocument} fileName="admin_food_report.pdf">
          {({ loading }) => (
            <button className="download-btn">
              {loading ? "Generating..." : "Download Report (PDF)"}
            </button>
          )}
        </PDFDownloadLink>
      </div>
    </div>
  );
};

export default Reports;
