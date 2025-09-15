import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import bg from '../../assets/landingPage.mp4'; // Background video
import demoVideo from '../../assets/landingPage.mp4'; // Demo video
import '../styles/land.css'
const LandingPage = () => {
  return (
    <div className="landing-page">
      <div className="background-video">
        <video autoPlay loop muted>
          <source src={bg} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      <header className="header2">
        <div className="logo">
          <span className="fancy-font">Food<span class="was">Waste</span></span>
        </div>
        <nav className="navbar">
          <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#about">About Us</a></li>
            <li><a href="#demo">Product Demo</a></li>
            <li><a href="#contact">Contact Us</a></li>
          </ul>
        </nav>
        <Link to="/">
          <button className="login-button">Login</button>
        </Link>
      </header>

      <section id="home" className="section home">
        <div className="home-content">
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <span className="fancy-font">Join the Fight Against Food Waste</span>
          </motion.h1>
          <p>Empowering individuals, restaurants, and communities to reduce food waste through smart, sustainable solutions.</p>
          <Link to="/userdashboard">
            <button className="cta-button">Get Started</button>
          </Link>
        </div>
      </section>

      <section id="about" className="section about">
        <h2>About Us</h2>
        <div className="about-container">
          <div className="about-contents">
            <p>FoodWaste is dedicated to reducing food waste through a platform that connects users to donate, share, or reduce excess food. By leveraging technology, we make food distribution more efficient, minimize waste, and help communities access what they need.</p>
          </div>
        </div>
        <div className="about-container">
          <div className="about-contents">
            <p>We aim to create a sustainable future by fostering a community that cares about the environment, supports local food initiatives, and reduces the ecological footprint of food waste.</p>
          </div>
        </div>
      </section>

      <section id="demo" className="section demo">
        <h2>Product Demo</h2>
        <p>See how our platform works to reduce food waste and how it can help you. Watch the demo below:</p>
        <video controls>
          <source src={demoVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </section>

      <section id="contact" className="section contact">
        <h2>Contact Us</h2>
        <p>We'd love to hear from you. Get in touch with us through the form below:</p>
        <form className="contact-form">
          <div>
            <label htmlFor="name">Name:</label>
            <input type="text" id="name" name="name" required />
          </div>
          <div>
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" name="email" required />
          </div>
          <div>
            <label htmlFor="message">Message:</label>
            <textarea id="message" name="message" required></textarea>
          </div>
          <button type="submit" className="cta-button">Send Message</button>
        </form>
      </section>

      <footer className="footer">
        <p>&copy; 2024 Marion Vutagwa. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
