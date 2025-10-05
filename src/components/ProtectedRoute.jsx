import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useEffect, useState } from "react";

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Wait for all contexts to load
    const timer = setTimeout(() => {
      setIsChecking(false);
      console.log("🛡️ ProtectedRoute: Auth check completed, user:", user);
    }, 200);
    
    return () => clearTimeout(timer);
  }, [user]);

  // Show loading while contexts initialize
  if (isChecking) {
    return (
      <div className="auth-loading">
        <div className="loading-spinner">
          <h3>Loading StudySpot...</h3>
          <p>Please wait a moment</p>
        </div>
      </div>
    );
  }

  // Redirect to login if no user
  if (!user) {
    console.log("🛡️ ProtectedRoute: No user, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  console.log("🛡️ ProtectedRoute: Access granted for:", user.name);
  return children;
}

export default ProtectedRoute;