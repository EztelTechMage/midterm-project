import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useBookings } from "../contexts/BookingContext";
import Calendar from "./Calendar";
import "./BookingForm.css";

function BookingForm({ space }) {
  const { user, login } = useAuth();
  const { addBooking } = useBookings();
  const navigate = useNavigate();
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState(space.time_slots?.[0] || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLoginRedirect = () => {
    alert("🔐 Please log in to book a space!");
    navigate("/login");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // REQUIRE LOGIN - Don't auto-login
    if (!user) {
      handleLoginRedirect();
      return;
    }

    // Validate form
    if (!date) {
      alert("📅 Please select a date for your booking!");
      return;
    }

    if (!timeSlot) {
      alert("⏰ Please select a time slot!");
      return;
    }

    setIsSubmitting(true);

    try {
      const newBooking = {
        spaceId: space.id,
        spaceName: space.name,
        spaceImage: space.main_image,
        userId: user.id,
        userName: user.name,
        date,
        timeSlot,
        price: space.price,
        location: space.location
      };

      console.log("📝 Creating booking:", newBooking);
      
      const savedBooking = addBooking(newBooking);
      
      if (savedBooking) {
        alert(`✅ Booking confirmed for ${space.name} on ${date} at ${timeSlot}!`);
        setDate("");
        setTimeSlot(space.time_slots?.[0] || "");
        
        // Redirect to dashboard after successful booking
        setTimeout(() => {
          navigate("/dashboard/my-bookings");
        }, 1000);
      }
    } catch (error) {
      console.error("Booking error:", error);
      alert("❌ Failed to create booking. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!space.time_slots || space.time_slots.length === 0) {
    return (
      <div className="booking-form">
        <h3>Booking Not Available</h3>
        <p>This space is currently not available for booking.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="booking-form">
      <h3>Book This Space</h3>
      
      {/* Show login requirement prominently */}
      
      
      <div className="form-group">
        <label>Select Date:</label>
        <Calendar value={date} onChange={setDate} disabled={!user} />
      </div>

      <div className="form-group">
        <label>Select Time Slot:</label>
        <select 
          value={timeSlot} 
          onChange={(e) => setTimeSlot(e.target.value)}
          className="time-select"
          disabled={!date || !user}
        >
          <option value="">Select a time slot</option>
          {space.time_slots.map((slot, i) => (
            <option key={i} value={slot}>
              {slot}
            </option>
          ))}
        </select>
      </div>

      {date && timeSlot && (
        <div className="booking-summary">
          <h4>Booking Summary</h4>
          <p><strong>Space:</strong> {space.name}</p>
          <p><strong>Location:</strong> {space.location}</p>
          <p><strong>Price:</strong> ₱{space.price}/session</p>
          <p><strong>Date:</strong> {new Date(date).toLocaleDateString()}</p>
          <p><strong>Time:</strong> {timeSlot}</p>
          <p><strong>Total:</strong> ₱{space.price}</p>
          <p><strong>User:</strong> {user ? user.name : "Not logged in"}</p>
        </div>
      )}

      <button 
        type="submit" 
        disabled={!date || !timeSlot || !user || isSubmitting}
        className="book-btn"
      >
        {isSubmitting ? "Booking..." : user ? "Confirm Booking" : "Login to Book"}
      </button>

      {!user && (
        <p className="login-notice">
          💡 Please log in first to book this space. You can login from the header or login page.
        </p>
      )}
    </form>
  );
}

export default BookingForm;