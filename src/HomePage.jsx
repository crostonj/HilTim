import React from 'react';
import { Link } from 'react-router-dom';
import './css/HomePage.css';

const HomePage = () => {
  return (
    <div className="homepage">
      <section className="hero-section">
        <div className="hero-content">
          <h1>Welcome to HilTim Hotel Honolulu</h1>
          <p className="hero-subtitle">Experience tropical luxury in the heart of paradise</p>
          <Link to="/booking" className="cta-button">Book Your Stay</Link>
        </div>
      </section>

      <section className="features-section">
        <h2>Why Choose HilTim Hotel Honolulu?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>🏨 Ocean View Suites</h3>
            <p>Spacious rooms with breathtaking Pacific Ocean and Diamond Head views</p>
          </div>
          <div className="feature-card">
            <h3>� Hawaiian Cuisine</h3>
            <p>Authentic island flavors and fresh local seafood at our oceanfront restaurant</p>
          </div>
          <div className="feature-card">
            <h3>🏄‍♂️ Beach Activities</h3>
            <p>Private beach access, surfboard rentals, and water sports equipment</p>
          </div>
          <div className="feature-card">
            <h3>� Tropical Amenities</h3>
            <p>Infinity pool, spa, fitness center, and traditional luau experiences</p>
          </div>
        </div>
      </section>

      <section className="rooms-section">
        <h2>Rooms & Suites</h2>
        <p className="rooms-intro">Choose from our beautifully appointed accommodations, each designed for comfort and tropical elegance</p>
        <div className="rooms-grid">
          <div className="room-card">
            <div className="room-image">
              <img src="https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" alt="Standard Room" />
            </div>
            <div className="room-details">
              <h3>Standard Room</h3>
              <p className="room-price">From $150/night</p>
              <ul className="room-features">
                <li>🏨 Queen bed with premium linens</li>
                <li>🌊 Partial ocean or city view</li>
                <li>🛁 Modern bathroom with rainfall shower</li>
                <li>📺 Smart TV and free WiFi</li>
                <li>☕ Coffee maker and mini-fridge</li>
              </ul>
            </div>
          </div>
          
          <div className="room-card">
            <div className="room-image">
              <img src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" alt="Single King Room" />
            </div>
            <div className="room-details">
              <h3>Single King Room</h3>
              <p className="room-price">From $220/night</p>
              <ul className="room-features">
                <li>👑 Luxurious king bed</li>
                <li>🌅 Ocean view with private lanai</li>
                <li>🛁 Spacious bathroom with soaking tub</li>
                <li>🪑 Comfortable seating area</li>
                <li>🌺 Welcome amenities and tropical decor</li>
              </ul>
            </div>
          </div>
          
          <div className="room-card">
            <div className="room-image">
              <img src="https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" alt="Double King Suite" />
            </div>
            <div className="room-details">
              <h3>Double King Suite</h3>
              <p className="room-price">From $380/night</p>
              <ul className="room-features">
                <li>👑 Two king beds in separate areas</li>
                <li>🌊 Premium oceanfront views</li>
                <li>🛋️ Large living area with dining space</li>
                <li>🛁 Two full bathrooms with luxury amenities</li>
                <li>🥂 Complimentary welcome champagne</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="rooms-cta">
          <Link to="/booking" className="cta-button">View All Rooms & Book Now</Link>
        </div>
      </section>

      <section className="location-section">
        <h2>Paradise Location in Waikiki</h2>
        <p>Located on the world-famous Waikiki Beach, just steps from crystal-clear waters and golden sand. Experience the best of Honolulu with easy access to shopping, dining, and iconic Hawaiian attractions.</p>
        <div className="location-highlights">
          <span>🏖️ Beachfront Location</span>
          <span>🌋 10 min to Diamond Head</span>
          <span>✈️ 20 min to Airport</span>
          <span>🛍️ Walking distance to Ala Moana</span>
        </div>
        <div className="activity-packages-cta">
          <h3>Ready for Adventure?</h3>
          <p>Discover Hawaii with our curated activity packages</p>
          <Link to="/activities" className="cta-button">Explore Activity Packages</Link>
        </div>
      </section>

      <section className="cta-section">
        <h2>Ready to Experience Aloha at HilTim Hotel?</h2>
        <p>Book your tropical getaway today and enjoy our special island rates</p>
        <Link to="/booking" className="cta-button secondary">Check Availability</Link>
      </section>
    </div>
  );
};

export default HomePage;
