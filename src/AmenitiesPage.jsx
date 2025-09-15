import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from './context/UserContext';
import LoginRegister from './components/LoginRegister';
import './css/AmenitiesPage.css';

const AmenitiesPage = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { isLoggedIn } = useUser();
  const navigate = useNavigate();

  const handleBookPackage = (packageId) => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }
    
    // Store selected package in localStorage to pass to booking page
    const selectedPkg = amenityPackages.find(pkg => pkg.id === packageId);
    if (selectedPkg) {
      localStorage.setItem('selectedAmenityPackage', JSON.stringify(selectedPkg));
      navigate('/booking');
    }
  };

  const amenityPackages = [
    {
      id: 1,
      name: "Spa & Wellness Package",
      price: 299,
      duration: "Full Day",
      image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      description: "Rejuvenate your mind and body with our comprehensive spa and wellness experience",
      includes: [
        "60-minute Hawaiian hot stone massage",
        "Tropical facial treatment with local ingredients",
        "Access to steam room and sauna",
        "Infinity pool and hot tub access",
        "Healthy spa lunch with ocean views",
        "Yoga session at sunrise or sunset",
        "Meditation garden access",
        "Complimentary spa amenities and robe"
      ],
      highlights: [
        "🌺 Hawaiian massage therapy",
        "🧘‍♀️ Private yoga sessions",
        "🌊 Infinity pool access",
        "🥗 Healthy spa cuisine"
      ]
    },
    {
      id: 2,
      name: "Fitness & Recreation Package",
      price: 199,
      duration: "Full Day",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      description: "Stay active and energized with our comprehensive fitness and recreation facilities",
      includes: [
        "Personal trainer session (1 hour)",
        "Full gym and fitness center access",
        "Tennis court reservation (2 hours)",
        "Beach volleyball equipment rental",
        "Bicycle rental for hotel grounds",
        "Swimming pool fitness classes",
        "Protein smoothie bar access",
        "Fitness assessment and wellness consultation"
      ],
      highlights: [
        "💪 Personal training session",
        "🎾 Private tennis court",
        "🏐 Beach volleyball access",
        "🚴‍♂️ Bicycle rental included"
      ]
    },
    {
      id: 3,
      name: "Dining & Culinary Package",
      price: 349,
      duration: "Full Day",
      image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      description: "Indulge in Hawaiian culinary excellence with our premium dining experiences",
      includes: [
        "Hawaiian cooking class with chef",
        "Wine tasting session with sommelier",
        "Multi-course tasting menu dinner",
        "Breakfast in bed room service",
        "Poolside lunch with signature cocktails",
        "Local farmers market tour",
        "Traditional luau feast experience",
        "Recipe cards and culinary souvenirs"
      ],
      highlights: [
        "👨‍🍳 Cooking class with chef",
        "🍷 Wine tasting experience",
        "🌺 Traditional luau feast",
        "🥞 Gourmet room service"
      ]
    },
    {
      id: 4,
      name: "Business & Conference Package",
      price: 449,
      duration: "Full Day",
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2126&q=80",
      description: "Professional facilities and services for your business needs in paradise",
      includes: [
        "Private conference room (8 hours)",
        "High-speed internet and AV equipment",
        "Professional catering for meetings",
        "Executive concierge services",
        "Business center access 24/7",
        "Airport transfer in luxury vehicle",
        "Meeting planning and coordination",
        "Welcome reception for attendees"
      ],
      highlights: [
        "💼 Private conference facilities",
        "📱 Premium business services",
        "🍽️ Executive catering",
        "🚗 Luxury transportation"
      ]
    },
    {
      id: 5,
      name: "Romance & Couples Package",
      price: 399,
      duration: "Full Day",
      image: "https://images.unsplash.com/photo-1519167758481-83f29da96880?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2098&q=80",
      description: "Create unforgettable romantic moments with our couples-focused amenity package",
      includes: [
        "Couples massage in private pavilion",
        "Champagne and strawberries in room",
        "Private beach cabana setup",
        "Romantic dinner under the stars",
        "Sunset cruise with cocktails",
        "Professional couples photography",
        "Late checkout and room upgrade",
        "Personalized romantic surprises"
      ],
      highlights: [
        "💕 Couples massage therapy",
        "🥂 Champagne and romantic dining",
        "🌅 Private sunset cruise",
        "📸 Professional photography"
      ]
    },
    {
      id: 6,
      name: "Family Fun Package",
      price: 279,
      duration: "Full Day",
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      description: "Create lasting family memories with activities and amenities for all ages",
      includes: [
        "Kids club activities and games",
        "Family pool games and competitions",
        "Beach treasure hunt adventure",
        "Ice cream and snack bar credits",
        "Movie night under the stars setup",
        "Family bicycle rental (4 bikes)",
        "Children's welcome gifts and activities",
        "Babysitting service (4 hours included)"
      ],
      highlights: [
        "👨‍👩‍👧‍👦 Kids club activities",
        "🏊‍♂️ Family pool games",
        "🍦 Ice cream bar credits",
        "🎬 Outdoor movie nights"
      ]
    }
  ];

  const hotelAmenities = [
    { icon: "🏊‍♂️", name: "Infinity Pool", description: "Stunning oceanfront infinity pool with swim-up bar" },
    { icon: "🌺", name: "Luxury Spa", description: "Full-service spa with Hawaiian treatments" },
    { icon: "🍽️", name: "Fine Dining", description: "Multiple restaurants featuring local and international cuisine" },
    { icon: "💪", name: "Fitness Center", description: "State-of-the-art gym with ocean views" },
    { icon: "🏖️", name: "Private Beach", description: "Exclusive beach access with water sports" },
    { icon: "🎾", name: "Tennis Court", description: "Professional tennis court with equipment rental" },
    { icon: "💼", name: "Business Center", description: "24/7 business facilities and meeting rooms" },
    { icon: "🚗", name: "Valet Parking", description: "Complimentary valet parking service" },
    { icon: "📶", name: "Free WiFi", description: "High-speed internet throughout the property" },
    { icon: "🛎️", name: "Concierge", description: "24/7 concierge service for reservations and tours" },
    { icon: "🧘‍♀️", name: "Yoga Studio", description: "Dedicated yoga and meditation spaces" },
    { icon: "🌴", name: "Tropical Gardens", description: "Beautifully landscaped Hawaiian gardens" }
  ];

  return (
    <div className="amenities-page">
      <section className="amenities-hero">
        <div className="amenities-hero-content">
          <h1>Amenities & Packages</h1>
          <p>Discover luxurious amenities and curated packages designed to enhance your Hawaiian experience</p>
        </div>
      </section>

      <section className="amenity-packages-section">
        <div className="packages-header">
          <h2>Exclusive Amenity Packages</h2>
          <p>Enhance your stay with our specially curated amenity packages</p>
        </div>
        
        <div className="packages-grid">
          {amenityPackages.map((pkg) => (
            <div key={pkg.id} className="amenity-package-card">
              <div className="package-image">
                <img src={pkg.image} alt={pkg.name} />
                <div className="package-price">${pkg.price}</div>
              </div>
              
              <div className="package-content">
                <h3>{pkg.name}</h3>
                <p className="package-duration">{pkg.duration}</p>
                <p className="package-description">{pkg.description}</p>
                
                <div className="package-highlights">
                  {pkg.highlights.map((highlight, index) => (
                    <span key={index} className="highlight-badge">{highlight}</span>
                  ))}
                </div>
                
                <div className="package-includes">
                  <h4>Package Includes:</h4>
                  <ul>
                    {pkg.includes.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
                
                <button 
                  onClick={() => handleBookPackage(pkg.id)}
                  className="book-package-btn"
                >
                  Book This Package
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="hotel-amenities-section">
        <h2>Hotel Amenities</h2>
        <p>Enjoy world-class facilities and services during your stay</p>
        
        <div className="amenities-grid">
          {hotelAmenities.map((amenity, index) => (
            <div key={index} className="amenity-item">
              <div className="amenity-icon">{amenity.icon}</div>
              <h3>{amenity.name}</h3>
              <p>{amenity.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="amenities-cta">
        <h2>Ready to Experience Luxury?</h2>
        <p>Book your amenity package and elevate your Hawaiian getaway</p>
        <button onClick={() => navigate('/booking')} className="cta-button">Book Your Stay with Amenities</button>
      </section>
      
      {showLoginModal && (
        <LoginRegister 
          onClose={() => setShowLoginModal(false)} 
        />
      )}
    </div>
  );
};

export default AmenitiesPage;