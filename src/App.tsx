import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import Header from './Header';
import Footer from './Footer';
import HomePage from './HomePage';
import BookingPage from './BookingPage';
import ActivityPackages from './ActivityPackages';
import RoomsPage from './RoomsPage';
import AmenitiesPage from './AmenitiesPage';
import MyBookings from './pages/MyBookings';
import Profile from './pages/Profile';
import './App.css';

function App() {
  return (
    <UserProvider>
      <Router>
        <div className="App">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/booking" element={<BookingPage />} />
              <Route path="/rooms" element={<RoomsPage />} />
              <Route path="/amenities" element={<AmenitiesPage />} />
              <Route path="/activities" element={<ActivityPackages />} />
              <Route path="/my-bookings" element={<MyBookings />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;
