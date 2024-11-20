import "./App.css";
import Header from "./pages/Header";
import Footer from "./pages/Footer";
import SearchBar from "./pages/SearchBar";
import Login_Success from "./pages/Login_Success";
import NotFound from "./pages/NotFound";
import Register from "../src/components/register/Register";
import Forgotten_Password from "../src/components/register/Forgotten_Password";
import ResetPassword from "../src/components/register/ResetPassword";
import BagComponent from "../src/components/PartComponent/BagComponent";
import SandalComponent from "../src/components/PartComponent/SandalComponent";
import WallComponent from "../src/components/PartComponent/WallComponent";
import CartComponent from "../src/components/CartModal/CartComponent";
import CheckOutComponent from "../src/components/CartModal/CheckOutComponent";
import AccountInforComponent from "../src/components/Account/AccountInforComponent";
import PurchaseHistoryComponent from "../src/components/Account/PurchaseHistoryComponent";
import ChangePasswordComponent from "../src/components/Account/ChangePasswordComponent";
import AddressComponent from "../src/components/Account/AddressComponent";
import ProductDetail from "../src/components/ProductDetail/ProductDetail";
import EditProfileComponent from "../src/components/Account/EditProfileComponent";
import Banner from "./components/NewProduct/Banner";
import React, { useState, useEffect } from "react";
import i18n from "./i18n";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import ProtectedRoute from "./context/ProtectedRoute";
import { SearchBarProvider } from "./context/searchBarContext";

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
          Math.abs(scrollY - lastScrollY) > 3
        ) {
          setScrollDirection(direction);
        }
        lastScrollY = scrollY > 0 ? scrollY : 0;
      };
      window.addEventListener("scroll", updateScrollDirection);
      return () => {
        window.removeEventListener("scroll", updateScrollDirection);
      };
    }, [scrollDirection]);

    return scrollDirection;
  }

  const scrollDirection = useScrollDirection();

  if (!languageReady) {
    return <div>Loading...</div>;
  }

  return (
    <AuthProvider>
      <SearchBarProvider>
        <CartProvider>
          <Router>
            <AppContent scrollDirection={scrollDirection} />
          </Router>
        </CartProvider>
      </SearchBarProvider>
    </AuthProvider>
  );
}

function AppContent({ scrollDirection }) {
  const location = useLocation();
  const isCheckOutPage = location.pathname === "/cart/checkout";

  return (
    <div className="full-page">
      {!isCheckOutPage && <Header scrollDirection={scrollDirection} />}
      <SearchBar />
      <div className="main-content">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Banner />
              </>
            }
          />
          <Route path="/register" element={<Register />} />
          <Route path="/bag" element={<BagComponent />} />
          <Route path="/sandal" element={<SandalComponent />} />
          <Route path="/wallet" element={<WallComponent />} />
          <Route path="/cart" element={<CartComponent />} />
          <Route path="/cart/checkout" element={<CheckOutComponent />} />
          <Route
            path="/account-info"
            element={
              <ProtectedRoute>
                <AccountInforComponent />
              </ProtectedRoute>
            }
          >
            <Route
              path="edit-profile"
              element={
                <ProtectedRoute>
                  <EditProfileComponent />
                </ProtectedRoute>
              }
            />
            <Route
              path="purchase-history"
              element={
                <ProtectedRoute>
                  <PurchaseHistoryComponent />
                </ProtectedRoute>
              }
            />
            <Route
              path="address"
              element={
                <ProtectedRoute>
                  <AddressComponent />
                </ProtectedRoute>
              }
            />
            <Route
              path="change-password"
              element={
                <ProtectedRoute>
                  <ChangePasswordComponent />
                </ProtectedRoute>
              }
            />
          </Route>
          <Route path="/product-id/:productId" element={<ProductDetail />} />
          <Route path="/forgot-password" element={<Forgotten_Password />} />
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
      {!isCheckOutPage && <Footer />}
    </div>
  );
}

export default App;
