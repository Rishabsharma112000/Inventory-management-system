import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Container, Alert, Row, Col, Card } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ fullName: '', email: '', phone: '', address: '' });
  const [error, setError] = useState('');
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await api.get('/customers');
      setCustomers(res.data.customers);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editing) {
        await api.put(`/customers/${editing.id}`, formData);
      } else {
        await api.post('/customers', formData);
      }
      setShowModal(false);
      setFormData({ fullName: '', email: '', phone: '', address: '' });
      setEditing(null);
      fetchCustomers();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (customer) => {
    setEditing(customer);
    setFormData({ ...customer });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await api.delete(`/customers/${id}`);
        fetchCustomers();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <Container fluid style={{ background: '#f0f2f5', minHeight: '100vh', padding: '20px' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 style={{ fontWeight: '700', color: '#333' }}>Customers</h1>
        {isAdmin && <Button 
          onClick={() => setShowModal(true)} 
          style={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
            border: 'none',
            borderRadius: '10px',
            padding: '12px 24px',
            fontWeight: '600'
          }}
        >
          + Add Customer
        </Button>}
      </div>
      {error && <Alert variant="danger" style={{ borderRadius: '10px' }}>{error}</Alert>}

      <Row>
        {customers.map((customer) => (
          <Col md={4} className="mb-4" key={customer.id}>
            <Card style={{ 
              border: 'none', 
              borderRadius: '12px', 
              overflow: 'hidden',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              transition: 'transform 0.3s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ 
                height: '120px', 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ fontSize: '48px' }}>👤</span>
              </div>
              <Card.Body>
                <div style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px', color: '#333' }}>{customer.fullName}</div>
                <div style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>📧 {customer.email}</div>
                {customer.phone && <div style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>📞 {customer.phone}</div>}
                {customer.address && <div style={{ fontSize: '14px', color: '#666', marginBottom: '16px' }}>📍 {customer.address}</div>}
                {isAdmin && (
                  <div>
                    <Button variant="outline-secondary" size="sm" className="me-2" onClick={() => handleEdit(customer)}>Edit</Button>
                    <Button variant="outline-danger" size="sm" onClick={() => handleDelete(customer.id)}>Delete</Button>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton style={{ borderBottom: 'none' }}>
          <Modal.Title style={{ fontWeight: '700' }}>{editing ? 'Edit' : 'Add'} Customer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label style={{ fontWeight: '600' }}>Full Name</Form.Label>
                  <Form.Control 
                    name="fullName" 
                    value={formData.fullName} 
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} 
                    required
                    style={{ borderRadius: '10px', padding: '12px' }}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label style={{ fontWeight: '600' }}>Email</Form.Label>
                  <Form.Control 
                    type="email"
                    name="email" 
                    value={formData.email} 
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                    required
                    style={{ borderRadius: '10px', padding: '12px' }}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label style={{ fontWeight: '600' }}>Phone</Form.Label>
                  <Form.Control 
                    name="phone" 
                    value={formData.phone} 
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })} 
                    style={{ borderRadius: '10px', padding: '12px' }}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label style={{ fontWeight: '600' }}>Address</Form.Label>
              <Form.Control 
                as="textarea" 
                name="address" 
                value={formData.address} 
                onChange={(e) => setFormData({ ...formData, address: e.target.value })} 
                style={{ borderRadius: '10px', padding: '12px', height: '100px' }}
              />
            </Form.Group>
            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={() => setShowModal(false)} style={{ borderRadius: '10px', padding: '10px 24px' }}>Cancel</Button>
              <Button 
                type="submit" 
                style={{ 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                  border: 'none',
                  borderRadius: '10px',
                  padding: '10px 24px',
                  fontWeight: '600'
                }}
              >
                {editing ? 'Update' : 'Add'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Customers;
