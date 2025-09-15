import React from 'react';
import './css/Footer.css';

const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>HilTim Hotel Honolulu</h3>
          <p>Experience tropical luxury in the heart of Waikiki Beach</p>
          <div className="contact-info">
            <p>🏖️ 2365 Kalakaua Avenue, Honolulu, HI 96815</p>
            <p>📞 (808) 555-ALOHA</p>
            <p>✉️ aloha@hiltimhonolulu.com</p>
          </div>
        </div>
        
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/rooms">Rooms & Suites</a></li>
            <li><a href="/activities">Activity Packages</a></li>
            <li><a href="/amenities">Amenities</a></li>
            <li><a href="/dining">Dining</a></li>
            <li><a href="/events">Events</a></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Hawaiian Services</h4>
          <ul>
            <li><a href="/concierge">Island Concierge</a></li>
            <li><a href="/activities">Beach Activities</a></li>
            <li><a href="/spa">Tropical Spa</a></li>
            <li><a href="/luau">Traditional Luau</a></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Connect With Us</h4>
          <div className="social-links">
            <a href="#" aria-label="Facebook">📘</a>
            <a href="#" aria-label="Instagram">📷</a>
            <a href="#" aria-label="Twitter">🐦</a>
            <a href="#" aria-label="LinkedIn">💼</a>
          </div>
          <p className="newsletter">
            <strong>Subscribe to our newsletter</strong><br/>
            <input type="email" placeholder="Your email" className="newsletter-input" />
            <button className="newsletter-btn">Subscribe</button>
          </p>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} HilTim Hotel Honolulu. All rights reserved. Aloha!</p>
        <div className="footer-links">
          <a href="/privacy">Privacy Policy</a> | 
          <a href="/terms">Terms of Service</a> | 
          <a href="/accessibility">Accessibility</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
