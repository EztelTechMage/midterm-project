import { createContext, useContext, useCallback, useEffect, useRef } from "react";
import useLocalStorage from "../hooks/useLocalStorage";

const AuthContext = createContext(null);


const createGuestUser = () => ({
  id: 'guest-user-permanent', 
  name: "Guest User", 
  email: "guest@studyspot.ph",
  avatar: "👤",
  type: "guest",
  createdAt: new Date().toISOString()
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useLocalStorage("studyspot_user", null, { 
    debug: true,
    syncTabs: true 
  });

  // Use ref to track initial load
  const isInitialLoad = useRef(true);

  // Fixed useEffect with proper dependencies
  useEffect(() => {
    console.log("🔐 AuthContext: Initializing - Current user:", user);
    
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      
  
    }
  }, []); // Empty dependency array since we only want this to run once on mount

  const login = useCallback(() => {
    console.log("🔐 AuthContext: Login requested");
    
    // Always use the same guest user ID for booking persistence
    const guestUser = createGuestUser();
    setUser(guestUser);
    
    console.log("✅ AuthContext: User logged in successfully:", guestUser);
    return guestUser;
  }, [setUser]); 

  const logout = useCallback(() => {
    console.log("🔐 AuthContext: Logout requested");
    
    if (user) {
      console.log("👋 AuthContext: Logging out user:", user.name);
      setUser(null);
      console.log("✅ AuthContext: User logged out successfully");
    }
  }, [user, setUser]); // Both user and setUser as dependencies

  const isAuthenticated = !!user;

  const contextValue = {
    user,
    isAuthenticated,
    login,
    logout
  };

  console.log("🔐 AuthContext: Rendering with user:", user ? user.name : "None");

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};