import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from './context/UserContext';
import LoginRegister from './components/LoginRegister';
import './css/ActivityPackages.css';

const ActivityPackages = () => {
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { isLoggedIn } = useUser();
  const navigate = useNavigate();

  const packages = [
    {
      id: 1,
      name: "Diamond Head Adventure Package",
      price: 189,
      duration: "Full Day",
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3",
      description: "Experience the iconic Diamond Head crater hike and explore historic Honolulu",
      includes: [
        "Guided Diamond Head crater hike at sunrise",
        "Professional photography session at summit",
        "Historic Honolulu city tour",
        "Local Hawaiian breakfast",
        "Transportation from hotel",
        "Complimentary water and snacks"
      ],
      highlights: [
        "🌅 Sunrise views from Diamond Head summit",
        "📸 Professional photos included",
        "🏛️ Historic downtown tour",
        "🥞 Authentic Hawaiian breakfast"
      ]
    },
    {
      id: 2,
      name: "Ocean Explorer Package",
      price: 299,
      duration: "Full Day",
      image: "https://www.homeyhawaii.com/blog/wp-content/uploads/2019/05/oahu-surfing-768x480.jpg",
      description: "Dive into Hawaiian waters with snorkeling, surfing, and marine life encounters",
      includes: [
        "Hanauma Bay snorkeling expedition",
        "2-hour surf lesson at Waikiki Beach",
        "Sea turtle spotting tour",
        "Professional surf instructor",
        "All snorkeling and surf equipment",
        "Tropical lunch on the beach"
      ],
      highlights: [
        "🐠 World-famous Hanauma Bay snorkeling",
        "🏄‍♂️ Learn to surf in Waikiki",
        "🐢 Sea turtle encounters",
        "🏖️ Beach picnic lunch"
      ]
    },
    {
      id: 3,
      name: "Cultural Immersion Package",
      price: 249,
      duration: "Full Day",
      image: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?ixlib=rb-4.0.3",
      description: "Immerse yourself in authentic Hawaiian culture and traditions",
      includes: [
        "Traditional Polynesian Cultural Center visit",
        "Lei making workshop",
        "Hawaiian cooking class",
        "Authentic luau experience",
        "Traditional Hawaiian music and dance show",
        "Cultural artifact demonstrations"
      ],
      highlights: [
        "🌺 Traditional lei making class",
        "🍽️ Hawaiian cooking workshop",
        "🎭 Authentic luau experience",
        "🎵 Traditional music and hula show"
      ]
    },
    {
      id: 4,
      name: "Mountain Explorer Hiking Package",
      price: 225,
      duration: "Full Day",
      image: "https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3",
      description: "Discover Oahu's stunning mountain trails and hidden waterfalls with expert guides",
      includes: [
        "Manoa Falls rainforest hike",
        "Lanikai Pillbox trail adventure",
        "Hidden waterfall swimming experience",
        "Professional hiking guide",
        "All hiking equipment and safety gear",
        "Gourmet trail lunch and refreshments"
      ],
      highlights: [
        "🥾 Two scenic mountain trails",
        "💦 Secret waterfall swimming spot",
        "🌿 Tropical rainforest exploration",
        "📍 Instagram-worthy Lanikai views"
      ]
    },
    {
      id: 5,
      name: "Ultimate Beach Day Package",
      price: 199,
      duration: "Full Day",
      image: "https://cdn.thecrazytourist.com/wp-content/uploads/2017/10/ccimage-shutterstock_146148443.jpg",
      description: "Experience the perfect Hawaiian beach day with premium amenities and activities",
      includes: [
        "Private beach cabana reservation",
        "Beach chair and umbrella setup",
        "Stand-up paddleboard rental",
        "Beach volleyball and games equipment",
        "Fresh tropical fruit platter",
        "Unlimited beach beverages and snacks",
        "Sunset beach photography session"
      ],
      highlights: [
        "🏖️ Private beachfront cabana",
        "🏄‍♀️ Stand-up paddleboard included",
        "🍹 Unlimited tropical refreshments",
        "📸 Professional sunset photos"
      ]
    },
    {
      id: 6,
      name: "Pearl Harbor Historical Package",
      price: 179,
      duration: "Full Day",
      image: "https://pearlharbor.org/wp-content/uploads/2023/02/Memorial-Arizona_Hero.webp",
      description: "Journey through history at Pearl Harbor with comprehensive access to memorials and museums",
      includes: [
        "USS Arizona Memorial visit with reserved tickets",
        "USS Missouri Battleship exploration",
        "Pearl Harbor Aviation Museum tour",
        "USS Bowfin Submarine Museum & Park",
        "Expert historical guide throughout the day",
        "Memorial lunch with Pearl Harbor views",
        "Transportation from hotel with commentary"
      ],
      highlights: [
        "⚓ USS Arizona Memorial experience",
        "🚢 USS Missouri Battleship tour",
        "✈️ WWII Aviation Museum access",
        "🎖️ Expert historical commentary"
      ]
    }
  ];

  const handleBookPackage = (packageId) => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }
    
    // Store selected package in localStorage to pass to booking page
    const selectedPkg = packages.find(pkg => pkg.id === packageId);
    if (selectedPkg) {
      localStorage.setItem('selectedActivityPackage', JSON.stringify(selectedPkg));
      navigate('/booking');
    }
  };

  return (
    <div className="activity-packages">
      <div className="packages-header">
        <h1>Hawaiian Activity Packages</h1>
        <p>Discover the magic of Hawaii with our carefully curated adventure packages</p>
        <div className="package-categories">
          <span className="category">🏖️ Beach Relaxation</span>
          <span className="category">🥾 Mountain Hiking</span>
          <span className="category">🌺 Cultural Experiences</span>
          <span className="category">🌊 Ocean Adventures</span>
          <span className="category">⚓ Historical Tours</span>
        </div>
      </div>

      <div className="packages-grid">
        {packages.map((pkg) => (
          <div key={pkg.id} className="package-card">
            <div className="package-image">
              <img src={pkg.image} alt={pkg.name} />
              <div className="package-duration">{pkg.duration}</div>
            </div>
            
            <div className="package-content">
              <h3>{pkg.name}</h3>
              <div className="package-price">
                <span className="price">${pkg.price}</span>
                <span className="per-person">per person</span>
              </div>
              
              <p className="package-description">{pkg.description}</p>
              
              <div className="package-highlights">
                <h4>Package Highlights</h4>
                <ul>
                  {pkg.highlights.map((highlight, index) => (
                    <li key={index}>{highlight}</li>
                  ))}
                </ul>
              </div>
              
              <div className="package-includes">
                <h4>What's Included</h4>
                <ul>
                  {pkg.includes.map((item, index) => (
                    <li key={index}>✓ {item}</li>
                  ))}
                </ul>
              </div>
              
              <div className="package-actions">
                <button 
                  className="book-package-btn"
                  onClick={() => handleBookPackage(pkg.id)}
                >
                  Book This Package
                </button>
                <button 
                  className="book-with-stay-btn"
                  onClick={() => handleBookPackage(pkg.id)}
                >
                  Book with Hotel Stay
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="packages-info">
        <div className="info-section">
          <h3>Package Information</h3>
          <ul>
            <li>All packages include hotel pickup and drop-off</li>
            <li>Minimum 2 participants required for group activities</li>
            <li>Weather-dependent activities have flexible rescheduling</li>
            <li>Professional guides and instruction included</li>
            <li>Hiking packages include all safety equipment and gear</li>
            <li>Beach packages include premium amenities and refreshments</li>
            <li>Moderate fitness level recommended for hiking packages</li>
            <li>Book 48 hours in advance for guaranteed availability</li>
          </ul>
        </div>
        
        <div className="contact-section">
          <h3>Need Help Choosing?</h3>
          <p>Our concierge team is here to help you select the perfect Hawaiian adventure.</p>
          <div className="contact-info">
            <p>📞 Call: (808) 555-ALOHA</p>
            <p>✉️ Email: activities@hiltimhonolulu.com</p>
            <p>🕐 Available: 7:00 AM - 9:00 PM daily</p>
          </div>
        </div>
      </div>
      
      {showLoginModal && (
        <LoginRegister 
          onClose={() => setShowLoginModal(false)}
        />
      )}
    </div>
  );
};

export default ActivityPackages;