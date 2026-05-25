import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import Footer from './components/Footer';

// User Screens
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderTracking from './pages/OrderTracking';
import ContactFeedback from './pages/ContactFeedback';
import MyOrders from './pages/MyOrders';
import Login from './pages/Login';
import Register from './pages/Register';

// Administrative Screens
import AdminDashboard from './pages/AdminDashboard';
import AdminProducts from './pages/AdminProducts';
import AdminCategories from './pages/AdminCategories';
import AdminOrders from './pages/AdminOrders';
import AdminPayments from './pages/AdminPayments';
import AdminUsers from './pages/AdminUsers';
import AdminFeedback from './pages/AdminFeedback';

// AppContent handles conditional layout (Header/Footer are hidden on admin pages)
const AppContent = () => {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <div className="app-shell" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {!isAdminPage && <Header />}
      
      <div className={isAdminPage ? "admin-app-container" : "main-app-container"} style={{ flexGrow: 1 }}>
        <Routes>
          {/* Public & Customer Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/tracking/:id" element={<OrderTracking />} />
          <Route path="/orders/track/:id" element={<OrderTracking />} />
          <Route path="/orders/myorders" element={<MyOrders />} />
          <Route path="/feedback" element={<ContactFeedback />} />
          <Route path="/contact" element={<ContactFeedback />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Administrative Control Routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/categories" element={<AdminCategories />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/payments" element={<AdminPayments />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/feedback" element={<AdminFeedback />} />
        </Routes>
      </div>

      {!isAdminPage && <Footer />}
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
