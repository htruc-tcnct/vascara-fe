import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; // Named import

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      try {
        const decoded = jwtDecode(storedToken);

        if (decoded.exp * 1000 < Date.now()) {
          console.warn("Token expired");
          logout();
        } else {
          setToken(storedToken);
          setUser(decoded);
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        logout();
      }
    }
    setLoading(false);
  }, []);

  const login = (newToken) => {
    try {
      const decoded = jwtDecode(newToken);

      if (decoded.exp * 1000 < Date.now()) {
        console.warn("Token is already expired");
        logout();
      } else {
        localStorage.setItem("token", newToken);
        setToken(newToken);
        setUser(decoded);
      }
    } catch (error) {
      console.error("Invalid token during login:", error);
      logout();
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        login,
        logout,
        isAuthenticated,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
