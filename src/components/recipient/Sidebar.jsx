import React from "react";
import { Link } from "react-router-dom";
import "../styles/Rsidebar.css"; // Ensure this CSS file exists and is correctly named
import { 
  FaHome, FaTruck, FaMapMarkerAlt, FaComments, 
  FaBell, FaQuestionCircle, FaCog, FaSignOutAlt 
} from 'react-icons/fa';

const Sidebar = () => {
  return (
    <nav className="sidebar">
      <h2>sustaiN!</h2>
      <ul>
        <li><Link to="/recipient/dashboard"><FaHome className="icon" /> Home</Link></li>
        <li><Link to="/recipient/pickups"><FaTruck className="icon" /> Pickup Schedule</Link></li>
        <li><Link to="/recipient/track"><FaMapMarkerAlt className="icon" /> Track Received Food</Link></li>
        <li><Link to="/recipient/feedback"><FaComments className="icon" /> Provide Feedback</Link></li>
        <li><Link to="/notifications"><FaBell className="icon" /> Notifications</Link></li>
        <li><Link to="/faq"><FaQuestionCircle className="icon" /> FAQ</Link></li>
        <li><Link to="/settings"><FaCog className="icon" /> Settings</Link></li>
        <li className="logout"><Link to="/login"><FaSignOutAlt className="icon" /> Logout</Link></li>
      </ul>
    </nav>
  );
};

export default Sidebar;
