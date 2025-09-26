import "./ConfirmationModal.css";

function ConfirmationModal({ isOpen, onConfirm, onCancel, booking }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Cancel Booking</h3>
        <p>Are you sure you want to cancel your booking for:</p>
        <div className="booking-details">
          <p><strong>{booking?.spaceName}</strong></p>
          <p>Date: {booking?.date}</p>
          <p>Time: {booking?.timeSlot}</p>
        </div>
        <div className="modal-actions">
          <button onClick={onConfirm} className="confirm-btn">
            Yes, Cancel Booking
          </button>
          <button onClick={onCancel} className="cancel-btn">
            Keep Booking
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationModal;