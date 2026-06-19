import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Categories from './pages/Categories';
import Suppliers from './pages/Suppliers';
import Products from './pages/Products';
import Customers from './pages/Customers';
import Orders from './pages/Orders';
import Inventory from './pages/Inventory';
import Alerts from './pages/Alerts';
import Reports from './pages/Reports';
import Layout from './components/Layout';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  return user ? <Navigate to="/dashboard" /> : children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
          <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="categories" element={<Categories />} />
            <Route path="suppliers" element={<Suppliers />} />
            <Route path="products" element={<Products />} />
            <Route path="customers" element={<Customers />} />
            <Route path="orders" element={<Orders />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="alerts" element={<Alerts />} />
            <Route path="reports" element={<Reports />} />
            <Route index element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
