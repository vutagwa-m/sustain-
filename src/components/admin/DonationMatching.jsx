import React, { useState, useEffect } from "react";
import { collection, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../essentials/firebase";
import { Link } from "react-router-dom";

const DonationMatching = () => {
  const [matches, setMatches] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const donationsSnapshot = await getDocs(collection(db, "food_inventory"));
        const requestsSnapshot = await getDocs(collection(db, "food_requests"));

        const donations = donationsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        const requests = requestsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        const matchScores = [];

        donations.forEach((donation) => {
          requests.forEach((request) => {
            const score =
              (donation.food_name === request.food_name ? 1 : 0) + // Food type match
              (donation.quantity >= request.quantity ? 1 : 0) + // Quantity match
              (request.urgency === "high" ? 1 : 0); // Urgency priority

            if (score > 1) {
              matchScores.push({
                donor: donation.donor_id,
                recipient: request.recipient_id,
                food_name: donation.food_name,
                quantity: request.quantity,
                score,
              });
            }
          });
        });

        setMatches(matchScores);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // ✅ Save All Matches to Firestore
  const saveAllMatches = async () => {
    if (matches.length === 0) return alert("No matches to save!");

    setSaving(true);

    try {
      const batchPromises = matches.map((match) =>
        addDoc(collection(db, "donations"), {
          donor_id: match.donor,
          recipient_id: match.recipient,
          food_name: match.food_name,
          quantity: match.quantity,
          status: "matched",
          timestamp: serverTimestamp(),
        })
      );

      await Promise.all(batchPromises);
      alert("All matches saved successfully! 🎉");

      setMatches([]); // Clear matches after saving
    } catch (error) {
      console.error("Error saving matches:", error);
      alert("Error saving matches. Try again!");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
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
        <h2>AI-Based Donation Matching</h2>
        {matches.length > 0 ? (
          <>
            <ul>
              {matches.map((match, index) => (
                <li key={index}>
                  Donor <strong>{match.donor}</strong> matched with Recipient <strong>{match.recipient}</strong> 
                  <br />
                  Food: <strong>{match.food_name}</strong>, Quantity: <strong>{match.quantity}</strong> 
                  <br />
                  Match Score: <strong>{match.score}</strong>
                </li>
              ))}
            </ul>
            <button className="save-btn" onClick={saveAllMatches} disabled={saving}>
              {saving ? "Saving..." : "Save All Matches"}
            </button>
          </>
        ) : (
          <p>No matches found.</p>
        )}
      </div>
    </div>
  );
};

export default DonationMatching;
