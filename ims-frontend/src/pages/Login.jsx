import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Button, Card } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import ToastNotification from '../components/ToastNotification';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState('success');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setErrors({});
    
    try {
      await login(formData);
      setToastMessage('Login successful!');
      setToastVariant('success');
      setShowToast(true);
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      setToastMessage(err.response?.data?.message || 'Login failed');
      setToastVariant('danger');
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  return (
    <>
      <ToastNotification 
        show={showToast} 
        onClose={() => setShowToast(false)} 
        message={toastMessage} 
        variant={toastVariant} 
      />
      <div style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '20px'
      }}>
        <Card style={{ 
          width: '100%', 
          maxWidth: '450px', 
          border: 'none', 
          borderRadius: '20px', 
          boxShadow: '0 10px 40px rgba(0,0,0,0.2)' 
        }}>
          <Card.Body style={{ padding: '40px' }}>
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <div style={{ fontSize: '50px', marginBottom: '10px' }}>📦</div>
              <h2 style={{ fontWeight: '800', color: '#333', margin: '0' }}>Welcome Back!</h2>
              <p style={{ color: '#666', marginTop: '10px' }}>Sign in to your inventory account</p>
            </div>
            
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label style={{ fontWeight: '600', color: '#333' }}>Email Address</Form.Label>
                <Form.Control 
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  placeholder="you@example.com"
                  isInvalid={!!errors.email}
                  style={{ borderRadius: '10px', padding: '15px', border: errors.email ? '2px solid #dc3545' : '2px solid #e0e0e0' }}
                />
                {errors.email && <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>}
              </Form.Group>
              
              <Form.Group className="mb-4">
                <Form.Label style={{ fontWeight: '600', color: '#333' }}>Password</Form.Label>
                <Form.Control 
                  type="password" 
                  name="password" 
                  value={formData.password} 
                  onChange={handleChange} 
                  placeholder="••••••••"
                  isInvalid={!!errors.password}
                  style={{ borderRadius: '10px', padding: '15px', border: errors.password ? '2px solid #dc3545' : '2px solid #e0e0e0' }}
                />
                {errors.password && <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>}
              </Form.Group>
              
              <Button 
                type="submit" 
                disabled={loading} 
                style={{ 
                  width: '100%', 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                  border: 'none',
                  borderRadius: '10px',
                  padding: '15px',
                  fontWeight: '700',
                  fontSize: '16px'
                }}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </Form>
            
            <div style={{ textAlign: 'center', marginTop: '30px' }}>
              <p style={{ color: '#666' }}>
                Don't have an account? <Link to="/register" style={{ color: '#667eea', fontWeight: '600', textDecoration: 'none' }}>Sign Up</Link>
              </p>
            </div>
          </Card.Body>
        </Card>
      </div>
    </>
  );
};

export default Login;
