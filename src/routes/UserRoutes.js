import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Header from "../pages/User/Header";
import Footer from "../pages/User/Footer";
import SearchBar from "../pages/User/SearchBar";
import Login_Success from "../pages/User/Login_Success";
import NotFound from "../pages/User/NotFound";
import Register from "../components/register/Register";
import Forgotten_Password from "../components/register/Forgotten_Password";
import ResetPassword from "../components/register/ResetPassword";
import BagComponent from "../components/PartComponent/BagComponent";
import SandalComponent from "../components/PartComponent/SandalComponent";
import WallComponent from "../components/PartComponent/WallComponent";
import CartComponent from "../components/CartModal/CartComponent";
import CheckOutComponent from "../components/CartModal/CheckOutComponent";
import AccountInforComponent from "../components/Account/AccountInforComponent";
import PurchaseHistoryComponent from "../components/Account/PurchaseHistoryComponent";
import ChangePasswordComponent from "../components/Account/ChangePasswordComponent";
import AddressComponent from "../components/Account/AddressComponent";
import ProductDetail from "../components/ProductDetail/ProductDetail";
import EditProfileComponent from "../components/Account/EditProfileComponent";
import Banner from "../components/NewProduct/Banner";
import ProtectedRoute from "../context/ProtectedRoute";
import ThankYouPage from "../components/CartModal/ThankYou";
import OrderHistory from "../components/Orders/OrderHistory";

const UserRoutes = ({ scrollDirection }) => {
  const location = useLocation();
  const isCheckOutPage = location.pathname === "/cart/checkout";

  return (
    <div className="full-page">
      {!isCheckOutPage && <Header scrollDirection={scrollDirection} />}
      <SearchBar />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Banner />} />
          <Route path="/register" element={<Register />} />
          <Route path="/bag" element={<BagComponent />} />
          <Route path="/sandal" element={<SandalComponent />} />
          <Route path="/wallet" element={<WallComponent />} />
          <Route path="/cart" element={<CartComponent />} />
          <Route path="/cart/checkout" element={<CheckOutComponent />} />
          <Route path="/thank-you" element={<ThankYouPage />} />
          <Route path="/order-history" element={<OrderHistory />} />
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
};

export default UserRoutes;
