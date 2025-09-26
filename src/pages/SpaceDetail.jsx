import { useParams, Navigate } from "react-router-dom";
import spaces from "../data/spaces.json";
import BookingForm from "../components/BookingForm";
import "./SpaceDetail.css";

function SpaceDetail() {
  const { id } = useParams();
  const space = spaces.find(s => s.id === parseInt(id));

  if (!space) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="space-detail-page">
      <div className="space-hero">
        <img src={space.main_image} alt={space.name} className="hero-image" />
        <div className="hero-overlay">
          <h1>{space.name}</h1>
          <p>📍 {space.location}</p>
        </div>
      </div>

      <div className="space-content">
        <div className="space-info">
          <div className="info-section">
            <h2>About This Space</h2>
            <p className="description">{space.description}</p>
          </div>

          <div className="info-section">
            <h2>Operating Hours</h2>
            <div className="hours-grid">
              <div className="hours-item">
                <strong>Weekdays:</strong> {space.operating_hours.weekdays}
              </div>
              <div className="hours-item">
                <strong>Weekends:</strong> {space.operating_hours.weekends}
              </div>
            </div>
          </div>

          <div className="info-section">
            <h2>Amenities</h2>
            <div className="amenities-grid">
              {space.amenities.map((amenity, index) => (
                <div key={index} className="amenity-item">
                  <span className="amenity-icon">✓</span>
                  {amenity}
                </div>
              ))}
            </div>
          </div>

          <div className="info-section">
            <h2>Space Details</h2>
            <div className="details-grid">
              <div className="detail-item">
                <strong>Capacity:</strong> {space.capacity} people
              </div>
              <div className="detail-item">
                <strong>Rating:</strong> ⭐ {space.rating} ({space.reviews} reviews)
              </div>
              <div className="detail-item">
                <strong>Price:</strong> ₱{space.price} per session
              </div>
            </div>
          </div>
        </div>

        <div className="booking-section">
          <BookingForm space={space} />
        </div>
      </div>
    </div>
  );
}

export default SpaceDetail;