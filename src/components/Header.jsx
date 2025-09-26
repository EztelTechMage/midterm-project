import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./Header.css";

function Header() {
  const { user, login, logout } = useAuth();

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <span className="logo-icon">📚</span>
          StudySpot PH
        </Link>
        
        <nav className="nav">
          <Link to="/" className="nav-link">Home</Link>
          {user ? (
            <>
              <Link to="/dashboard/my-bookings" className="nav-link">My Bookings</Link>
              <div className="user-menu">
                <span className="user-greeting">Hello, {user.name}</span>
                <button onClick={logout} className="logout-btn">Logout</button>
              </div>
            </>
          ) : (
            <button onClick={login} className="login-btn">Login</button>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;