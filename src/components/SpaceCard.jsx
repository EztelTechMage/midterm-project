import { Link } from "react-router-dom";
import "./SpaceCard.css";

function SpaceCard({ space }) {
  return (
    <div className="space-card">
      <div className="space-card-image">
        <img src={space.main_image} alt={space.name} />
        <div className="space-card-overlay">
          <span className="space-price">₱{space.price}/session</span>
          {space.rating && (
            <span className="space-rating">⭐ {space.rating}</span>
          )}
        </div>
      </div>
      
      <div className="space-card-content">
        <h3 className="space-name">{space.name}</h3>
        <p className="space-location">📍 {space.location}</p>
        <p className="space-hours">
          🕒 {space.operating_hours?.weekdays || '9:00 AM - 9:00 PM'}
        </p>
        
        <div className="space-amenities">
          {space.amenities?.slice(0, 3).map((amenity, index) => (
            <span key={index} className="amenity-tag">{amenity}</span>
          ))}
          {space.amenities?.length > 3 && (
            <span className="amenity-more">+{space.amenities.length - 3} more</span>
          )}
        </div>
        
        <Link to={`/space/${space.id}`} className="view-details-btn">
          View Details →
        </Link>
      </div>
    </div>
  );
}

export default SpaceCard;