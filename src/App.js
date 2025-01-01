import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { SearchBarProvider } from "./context/searchBarContext";
import i18n from "./i18n";
import UserRoutes from "./routes/UserRoutes";
import AdminRoutes from "./routes/AdminRoutes";
import ProtectedRoute from "./context/ProtectedRoute";
import useScrollDirection from "./hooks/useScrollDirection";

function App() {
  const [languageReady, setLanguageReady] = useState(false);
  const scrollDirection = useScrollDirection();

  useEffect(() => {
    i18n.changeLanguage("en").then(() => setLanguageReady(true));
  }, []);

  if (!languageReady) {
    return <div>Loading...</div>;
  }

  return (
    <AuthProvider>
      <SearchBarProvider>
        <Router>
          <CartProvider>
            <Routes>
              {/* User Routes */}
              <Route
                path="/*"
                element={<UserRoutes scrollDirection={scrollDirection} />}
              />

              {/* Admin Routes */}
              <Route
                path="/admin/*"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminRoutes />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </CartProvider>
        </Router>
      </SearchBarProvider>
    </AuthProvider>
  );
}

export default App;
