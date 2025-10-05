import { createContext, useContext, useCallback, useMemo } from "react";
import useLocalStorage from "../hooks/useLocalStorage";

const BookingContext = createContext(null);

export const BookingProvider = ({ children }) => {
  const [bookings, setBookings] = useLocalStorage("studyspot_bookings", [], { 
    debug: true, 
    syncTabs: true 
  });

  const safeBookings = Array.isArray(bookings) ? bookings : [];

  const addBooking = useCallback((bookingData) => {
    console.log("📝 BookingContext: Add booking requested:", bookingData);
    
    if (!bookingData.userId) {
      alert("❌ Please log in to book a space!");
      return null;
    }

    if (!bookingData.spaceId || !bookingData.date || !bookingData.timeSlot) {
      alert("❌ Please fill in all required booking information!");
      return null;
    }

    try {
      const newBooking = {
        id: `booking-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        ...bookingData,
        createdAt: new Date().toISOString(),
        status: "confirmed"
      };

      setBookings(prevBookings => {
        const currentBookings = Array.isArray(prevBookings) ? prevBookings : [];
        
        
        const existingBooking = currentBookings.find(
          b => b.spaceId === bookingData.spaceId && 
               b.date === bookingData.date && 
               b.timeSlot === bookingData.timeSlot &&
               b.userId === bookingData.userId &&
               b.status !== "cancelled"
        );
        
        if (existingBooking) {
          alert("❌ You already have a booking for this space, date, and time slot!");
          return currentBookings;
        }

        const updatedBookings = [...currentBookings, newBooking];
        console.log("✅ BookingContext: Booking added. Total bookings:", updatedBookings.length);
        return updatedBookings;
      });

      return newBooking;
    } catch (error) {
      console.error("❌ BookingContext: Error adding booking:", error);
      alert("❌ Failed to create booking. Please try again.");
      return null;
    }
  }, [setBookings]);

  const cancelBooking = useCallback((bookingId) => {
    console.log("🗑️ BookingContext: Cancel booking requested:", bookingId);
    
    if (!bookingId) return;

    setBookings(prevBookings => {
      const currentBookings = Array.isArray(prevBookings) ? prevBookings : [];
      const updatedBookings = currentBookings.filter(booking => booking.id !== bookingId);
      console.log("✅ BookingContext: Booking cancelled. Remaining:", updatedBookings.length);
      return updatedBookings;
    });
  }, [setBookings]);

  const getBookingsByUser = useCallback((userId) => {
    if (!userId) {
      console.log("⚠️ BookingContext: No user ID provided");
      return [];
    }
    
    const userBookings = safeBookings
      .filter(booking => booking.userId === userId && booking.status !== "cancelled")
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    console.log(`📊 BookingContext: User ${userId} has ${userBookings.length} bookings`);
    return userBookings;
  }, [safeBookings]);

  const contextValue = {
    bookings: safeBookings,
    addBooking,
    cancelBooking,
    getBookingsByUser,
    totalBookings: safeBookings.length
  };

  console.log("📚 BookingContext: Current state -", {
    totalBookings: safeBookings.length,
    users: [...new Set(safeBookings.map(b => b.userId))]
  });

  return (
    <BookingContext.Provider value={contextValue}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBookings = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBookings must be used within a BookingProvider");
  }
  return context;
};