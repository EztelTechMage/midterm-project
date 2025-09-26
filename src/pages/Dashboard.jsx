import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useBookings } from "../contexts/BookingContext";
import ConfirmationModal from "../components/ConfirmationModal";
import "./Dashboard.css";

function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { getBookingsByUser, cancelBooking, bookings } = useBookings();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      // Small delay to ensure bookings are loaded
      setTimeout(() => setIsLoading(false), 500);
    }
  }, [user, navigate]);

  // Get user bookings with proper loading state
  const userBookings = useMemo(() => {
    if (!user) return [];
    return getBookingsByUser(user.id);
  }, [getBookingsByUser, user]);

  const handleCancelClick = (booking) => {
    setSelectedBooking(booking);
    setModalOpen(true);
  };

  const handleConfirmCancel = () => {
    if (selectedBooking) {
      cancelBooking(selectedBooking.id);
      setModalOpen(false);
      setSelectedBooking(null);
      alert("✅ Booking cancelled successfully!");
    }
  };

  const handleCancelModal = () => {
    setModalOpen(false);
    setSelectedBooking(null);
  };

  // Show loading state
  if (!user || isLoading) {
    return (
      <div className="dashboard-page">
        <div className="loading">
          <h2>Loading your bookings...</h2>
          <p>Please wait while we load your study sessions.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>My Bookings</h1>
        <p>Welcome back, {user?.name}! Here are your study sessions.</p>
        <div className="booking-stats">
          <span>Total Bookings: {userBookings.length}</span>
          <span>User ID: {user.id}</span>
        </div>
      </div>

      {userBookings.length === 0 ? (
        <div className="no-bookings">
          <h2>No bookings yet 📚</h2>
          <p>It looks like you haven't made any bookings yet.</p>
          <p>Explore study spaces and book your first session!</p>
          <button 
            onClick={() => navigate("/")}
            className="explore-spaces-btn"
          >
            Explore Study Spaces
          </button>
          
          {/* Debug information */}
          <div className="debug-info">
            <p><strong>Debug Information:</strong></p>
            <p>Current User ID: {user.id}</p>
            <p>Total Bookings in System: {bookings.length}</p>
            <p>Bookings for this user: {userBookings.length}</p>
            <button onClick={() => console.log('All bookings:', bookings)}>
              Log Bookings to Console
            </button>
          </div>
        </div>
      ) : (
        <div className="bookings-grid">
          {userBookings.map(booking => (
            <div key={booking.id} className="booking-card">
              <div className="booking-image">
                <img 
                  src={booking.spaceImage || "/assets/spaces1.jpg"} 
                  alt={booking.spaceName}
                  onError={(e) => {
                    e.target.src = "/assets/spaces1.jpg";
                  }}
                />
                <div className="booking-status confirmed">
                  {booking.status || "confirmed"}
                </div>
              </div>
              
              <div className="booking-content">
                <h3>{booking.spaceName}</h3>
                <div className="booking-details">
                  <p><strong>📍 Location:</strong> {booking.location}</p>
                  <p><strong>📅 Date:</strong> {booking.date}</p>
                  <p><strong>⏰ Time:</strong> {booking.timeSlot}</p>
                  <p><strong>💰 Price:</strong> ₱{booking.price}</p>
                  <p><strong>📋 Booked on:</strong> {new Date(booking.createdAt).toLocaleDateString()}</p>
                </div>
                
                <button 
                  onClick={() => handleCancelClick(booking)}
                  className="cancel-booking-btn"
                >
                  Cancel Booking
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmationModal
        isOpen={modalOpen}
        onConfirm={handleConfirmCancel}
        onCancel={handleCancelModal}
        booking={selectedBooking}
      />
    </div>
  );
}

export default Dashboard;