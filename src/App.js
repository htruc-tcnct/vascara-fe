import "./App.css";
import Header from "./pages/Header";
import Login_Success from "./pages/Login_Success";
import NotFound from "./pages/NotFound";
import Register from "../src/components/register/Register";
import Forgotten_Password from "../src/components/register/Forgotten_Password";
import ResetPassword from "../src/components/register/ResetPassword";
import BagComponent from "../src/components/PartComponent/BagComponent";
import SandalComponent from "../src/components/PartComponent/SandalComponent";
import Footer from "./pages/Footer";
import Banner from "./components/NewProduct/Banner";
import ProductShowing from "./components/NewProduct/Product-Showing";
import React, { useState, useEffect } from "react";
import i18n from "./i18n"; // Import i18n to control language
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import ProtectedRoute from "./context/ProtectedRoute";

function App() {
  const [languageReady, setLanguageReady] = useState(false);

  useEffect(() => {
    i18n.changeLanguage("en").then(() => setLanguageReady(true));
  }, []);

  function useScrollDirection() {
    const [scrollDirection, setScrollDirection] = useState(null);

    useEffect(() => {
      let lastScrollY = window.pageYOffset;

      const updateScrollDirection = () => {
        const scrollY = window.pageYOffset;
        const direction = scrollY > lastScrollY ? "down" : "up";
        if (
          direction !== scrollDirection &&
          (scrollY - lastScrollY > 3 || scrollY - lastScrollY < -3)
        ) {
          setScrollDirection(direction);
        }
        lastScrollY = scrollY > 0 ? scrollY : 0;
      };
      window.addEventListener("scroll", updateScrollDirection); // Listen for scroll events
      return () => {
        window.removeEventListener("scroll", updateScrollDirection); // Clean up event
      };
    }, [scrollDirection]);

    return scrollDirection;
  }

  const scrollDirection = useScrollDirection();

  // Only render main content when language is ready
  if (!languageReady) {
    return <div>Loading...</div>; // Optional loading indicator
  }

  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="full-page">
            <Header scrollDirection={scrollDirection} />
            <div className="main-content">
              <Routes>
                <Route
                  path="/"
                  element={
                    <>
                      <Banner />
                      <ProductShowing />
                    </>
                  }
                />
                <Route path="/register" element={<Register />} />
                <Route path="/bag" element={<BagComponent />} />
                <Route path="/sandal" element={<SandalComponent />} />
                <Route
                  path="/forgot-password"
                  element={<Forgotten_Password />}
                />
                <Route
                  path="/reset-password/:id/:token"
                  element={<ResetPassword />}
                />
                <Route
                  path="/login-success"
                  element={
                    <ProtectedRoute>
                      <Login_Success />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
