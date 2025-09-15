import React, { useState, useEffect, useMemo } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../essentials/firebase";
import { Link } from "react-router-dom";
import { Document, Page, Text, View, PDFDownloadLink, StyleSheet } from "@react-pdf/renderer";
import "../styles/adminAnalytics.css"; // import the CSS file

const styles = StyleSheet.create({
  page: { padding: 20, fontSize: 12 },
  section: { marginBottom: 10 },
  header: { fontSize: 18, marginBottom: 10, fontWeight: "bold" },
  text: { marginBottom: 5 },
});

const GenerateReport = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const snapshot = await getDocs(collection(db, "donations"));
        setData(snapshot.docs.map(doc => doc.data()));
      } catch (error) {
        console.error("Error fetching donation data:", error);
      }
    };

    fetchData();
  }, []);

  const ReportDocument = useMemo(() => (
    <Document>
      <Page style={styles.page}>
        <Text style={styles.header}>Donations Report</Text>
        {data.length > 0 ? (
          data.map((donation, index) => (
            <View key={index} style={styles.section}>
              <Text style={styles.text}>Donor: {donation.donorId}</Text>
              <Text style={styles.text}>Food Type: {donation.foodType}</Text>
              <Text style={styles.text}>Quantity: {donation.quantity}</Text>
            </View>
          ))
        ) : (
          <Text>No donation data available.</Text>
        )}
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
        <h2>Download Donations Report</h2>
        <PDFDownloadLink document={ReportDocument} fileName="donations_report.pdf">
          {({ loading }) => (
            <button className="download-btn">
              {loading ? "Generating..." : "Download PDF"}
            </button>
          )}
        </PDFDownloadLink>
      </div>
    </div>
  );
};

export default GenerateReport;
