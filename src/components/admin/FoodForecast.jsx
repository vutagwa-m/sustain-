import React, { useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../essentials/firebase";
import { Link } from "react-router-dom";

const FoodForecast = () => {
  const [predictedDemand, setPredictedDemand] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch food request data
        const snapshot = await getDocs(collection(db, "food_requests"));
        const data = snapshot.docs.map(doc => doc.data().quantity);
        
        if (data.length === 0) {
          console.warn("No food request data available.");
          return;
        }

        // Convert data into tensors
        const xs = tf.tensor2d(data.map((_, i) => [i]), [data.length, 1]);
        const ys = tf.tensor2d(data, [data.length, 1]);

        // Define & Train the Model
        const model = tf.sequential();
        model.add(tf.layers.dense({ units: 1, inputShape: [1] }));
        model.compile({ loss: "meanSquaredError", optimizer: "sgd" });

        await model.fit(xs, ys, { epochs: 50 });

        // Make Predictions
        const nextWeek = [data.length, data.length + 1, data.length + 2];
        const inputTensor = tf.tensor2d(nextWeek.map(i => [i]), [3, 1]);
        const predictions = model.predict(inputTensor);

        // Convert Tensor to Array
        const predictedValues = await predictions.data();

        setPredictedDemand(predictedValues);

        // Dispose tensors to free memory
        xs.dispose();
        ys.dispose();
        inputTensor.dispose();
        model.dispose();
      } catch (error) {
        console.error("Error fetching or processing data:", error);
      }
    };

    fetchData();
  }, []);

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
      <h2>AI-Based Food Demand Forecasting</h2>
      {predictedDemand.length > 0 ? (
        <p>Next week's estimated food requests: {predictedDemand.join(", ")}</p>
      ) : (
        <p>Loading predictions...</p>
      )}
    </div>
  );
};

export default FoodForecast;
