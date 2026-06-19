import { Outlet, useNavigate } from 'react-router-dom';
import { Nav } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/products', label: 'Products', icon: '📦' },
    { path: '/categories', label: 'Categories', icon: '🏷️' },
    { path: '/suppliers', label: 'Suppliers', icon: '🏭' },
    { path: '/customers', label: 'Customers', icon: '👥' },
    { path: '/orders', label: 'Orders', icon: '🛒' },
    { path: '/inventory', label: 'Inventory', icon: '📋' },
    { path: '/alerts', label: 'Alerts', icon: '⚠️' },
    { path: '/reports', label: 'Reports', icon: '📈' }
  ];

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div style={{ 
        width: '280px', 
        background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)', 
        minHeight: '100vh',
        padding: '20px 0',
        boxShadow: '2px 0 10px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{ padding: '0 20px 30px 20px' }}>
          <h2 style={{ color: 'white', fontWeight: 'bold', margin: 0, fontSize: '24px' }}>
            📦 IMS
          </h2>
        </div>
        
        <Nav className="flex-column" style={{ flex: 1, overflowY: 'auto', paddingBottom: '20px' }}>
          {menuItems.map((item) => (
            <Nav.Link 
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{ 
                color: 'rgba(255,255,255,0.8)', 
                padding: '15px 20px', 
                margin: '5px 10px', 
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontSize: '16px',
                fontWeight: 600,
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                textDecoration: 'none'
              }}
              onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
              onMouseOut={(e) => e.target.style.background = 'transparent'}
            >
              <span style={{ fontSize: '20px' }}>{item.icon}</span>
              {item.label}
            </Nav.Link>
          ))}
        </Nav>

        {/* User Info */}
        <div style={{ 
          padding: '20px', 
          background: 'rgba(255,255,255,0.05)', 
          borderRadius: '10px',
          margin: '0 10px 10px 10px'
        }}>
          <div style={{ color: 'white', fontWeight: 600 }}>{user?.name || user?.email}</div>
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', marginTop: '5px' }}>{user?.role}</div>
          <div 
            onClick={handleLogout}
            style={{ 
              color: '#ff6b6b', marginTop: '10px', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
          >
            <span>🚪</span> Logout
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, overflow: 'auto', minHeight: '100vh' }}>
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
