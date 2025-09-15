import React from 'react';
import { Link } from 'react-router-dom';
import './css/RoomsPage.css';

const RoomsPage = () => {
  const rooms = [
    {
      id: 1,
      name: "Standard Room",
      price: 150,
      size: "350 sq ft",
      occupancy: "2 guests",
      bedType: "1 Queen Bed",
      image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      description: "Perfect for couples or solo travelers, our Standard Rooms offer comfort and Hawaiian charm with modern amenities.",
      features: [
        "Queen bed with premium linens",
        "Partial ocean or city view",
        "Modern bathroom with rainfall shower",
        "Smart TV with premium channels",
        "Free high-speed WiFi",
        "Coffee maker and mini-fridge",
        "Air conditioning and ceiling fan",
        "In-room safe and iron",
        "Daily housekeeping service",
        "Hawaiian welcome amenities"
      ],
      highlights: [
        "🏨 Comfortable queen bed",
        "🌊 Partial ocean views", 
        "🛁 Rainfall shower",
        "📺 Smart TV & WiFi"
      ]
    },
    {
      id: 2,
      name: "Single King Room",
      price: 220,
      size: "450 sq ft",
      occupancy: "2 guests",
      bedType: "1 King Bed",
      image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      description: "Spacious and elegant, our Single King Rooms feature ocean views and a private lanai for the ultimate Hawaiian experience.",
      features: [
        "Luxurious king bed with tropical linens",
        "Ocean view with private lanai",
        "Spacious bathroom with soaking tub",
        "Comfortable seating area",
        "Premium smart TV with streaming",
        "Complimentary WiFi and mini-bar",
        "Tropical welcome amenities",
        "Room service available 24/7",
        "Upgraded bathroom amenities",
        "Daily turndown service"
      ],
      highlights: [
        "👑 Luxurious king bed",
        "🌅 Ocean view lanai",
        "🛁 Soaking tub",
        "🪑 Seating area"
      ]
    },
    {
      id: 3,
      name: "Double King Suite",
      price: 380,
      size: "750 sq ft",
      occupancy: "4 guests",
      bedType: "2 King Beds",
      image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      description: "Our premium suite perfect for families or groups, featuring two king beds, separate living areas, and stunning oceanfront views.",
      features: [
        "Two king beds in separate bedroom areas",
        "Premium oceanfront views",
        "Large living area with dining space",
        "Two full bathrooms with luxury amenities",
        "Full-size sofa and entertainment center",
        "Kitchenette with full-size refrigerator",
        "Private lanai with ocean views",
        "Complimentary welcome champagne",
        "Concierge service included",
        "Priority spa and restaurant reservations"
      ],
      highlights: [
        "👑 Two king beds",
        "🌊 Oceanfront views",
        "🛋️ Separate living area",
        "🥂 Welcome champagne"
      ]
    }
  ];

  return (
    <div className="rooms-page">
      <section className="rooms-hero">
        <div className="rooms-hero-content">
          <h1>Rooms & Suites</h1>
          <p>Discover your perfect Hawaiian retreat with breathtaking views and luxurious amenities</p>
        </div>
      </section>

      <section className="rooms-showcase">
        <div className="rooms-container">
          {rooms.map((room) => (
            <div key={room.id} className="room-showcase-card">
              <div className="room-showcase-image">
                <img src={room.image} alt={room.name} />
                <div className="room-price-badge">From ${room.price}/night</div>
              </div>
              
              <div className="room-showcase-content">
                <div className="room-header">
                  <h2>{room.name}</h2>
                  <div className="room-specs">
                    <span className="room-spec">🏨 {room.size}</span>
                    <span className="room-spec">👥 {room.occupancy}</span>
                    <span className="room-spec">🛏️ {room.bedType}</span>
                  </div>
                </div>
                
                <p className="room-description">{room.description}</p>
                
                <div className="room-highlights">
                  {room.highlights.map((highlight, index) => (
                    <span key={index} className="room-highlight">{highlight}</span>
                  ))}
                </div>
                
                <div className="room-features-grid">
                  <h4>Room Features & Amenities</h4>
                  <ul className="room-features-list">
                    {room.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="room-booking-section">
                  <div className="room-pricing">
                    <span className="price-from">From</span>
                    <span className="price-amount">${room.price}</span>
                    <span className="price-period">per night</span>
                  </div>
                  <Link to="/booking" className="book-room-btn">Book This Room</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      <section className="rooms-amenities-preview">
        <h2>Hotel Amenities Included</h2>
        <div className="amenities-grid">
          <div className="amenity-item">🏊‍♂️ Infinity Pool</div>
          <div className="amenity-item">🌺 Spa Services</div>
          <div className="amenity-item">🍽️ Restaurant & Bar</div>
          <div className="amenity-item">💪 Fitness Center</div>
          <div className="amenity-item">🏖️ Beach Access</div>
          <div className="amenity-item">🚗 Valet Parking</div>
          <div className="amenity-item">📶 Free WiFi</div>
          <div className="amenity-item">🛎️ Concierge Service</div>
        </div>
      </section>

      <section className="rooms-cta">
        <h2>Ready to Book Your Hawaiian Getaway?</h2>
        <p>Experience luxury and comfort in the heart of Honolulu</p>
        <Link to="/booking" className="cta-button">Check Availability & Book Now</Link>
      </section>
    </div>
  );
};

export default RoomsPage;