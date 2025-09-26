import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./Login.css";

function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard/my-bookings", { replace: true });
    }
  }, [user, navigate]);

  const handleLogin = () => {
    login();
    navigate("/dashboard/my-bookings", { replace: true });
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-icon">📚</div>
          <h1>Welcome to StudySpot PH</h1>
          <p>Click below to login and start booking your perfect study space!</p>
          
          <button onClick={handleLogin} className="login-button">
            Click to Login
          </button>
          
          <p className="login-note">
            No credentials needed! Just one click to get started.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;