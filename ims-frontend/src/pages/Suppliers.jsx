import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Container, Alert, Card } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', address: '', gstNumber: '' });
  const [error, setError] = useState('');
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const res = await api.get('/suppliers');
      setSuppliers(res.data.suppliers);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editing) {
        await api.put(`/suppliers/${editing.id}`, formData);
      } else {
        await api.post('/suppliers', formData);
      }
      setShowModal(false);
      setFormData({ name: '', email: '', phone: '', address: '', gstNumber: '' });
      setEditing(null);
      fetchSuppliers();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (supplier) => {
    setEditing(supplier);
    setFormData({ ...supplier });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this supplier?')) {
      try {
        await api.delete(`/suppliers/${id}`);
        fetchSuppliers();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <Container fluid style={{ background: '#f0f2f5', minHeight: '100vh', padding: '20px' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 style={{ fontWeight: '700', color: '#333' }}>Suppliers</h1>
        {isAdmin && <Button 
          onClick={() => setShowModal(true)} 
          style={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
            border: 'none',
            borderRadius: '8px',
            padding: '10px 24px',
            fontWeight: '600'
          }}
        >
          + Add Supplier
        </Button>}
      </div>
      {error && <Alert variant="danger">{error}</Alert>}

      <Card style={{ border: 'none', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <Card.Body style={{ padding: '20px' }}>
          <Table responsive hover>
            <thead style={{ background: '#f8f9fa' }}>
              <tr>
                <th style={{ padding: '15px' }}>Name</th>
                <th style={{ padding: '15px' }}>Email</th>
                <th style={{ padding: '15px' }}>Phone</th>
                <th style={{ padding: '15px' }}>Address</th>
                <th style={{ padding: '15px' }}>GST Number</th>
                {isAdmin && <th style={{ padding: '15px' }}>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {suppliers.map((sup) => (
                <tr key={sup.id} style={{ verticalAlign: 'middle' }}>
                  <td style={{ fontWeight: '600', padding: '15px' }}>{sup.name}</td>
                  <td style={{ color: '#666', padding: '15px' }}>{sup.email || '-'}</td>
                  <td style={{ color: '#666', padding: '15px' }}>{sup.phone || '-'}</td>
                  <td style={{ color: '#666', padding: '15px' }}>{sup.address || '-'}</td>
                  <td style={{ color: '#666', padding: '15px' }}>{sup.gstNumber || '-'}</td>
                  {isAdmin && (
                    <td style={{ padding: '15px' }}>
                      <Button variant="outline-secondary" size="sm" className="me-2" onClick={() => handleEdit(sup)}>Edit</Button>
                      <Button variant="outline-danger" size="sm" onClick={() => handleDelete(sup.id)}>Delete</Button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton style={{ borderBottom: 'none' }}>
          <Modal.Title style={{ fontWeight: '700' }}>{editing ? 'Edit' : 'Add'} Supplier</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label style={{ fontWeight: '600' }}>Name</Form.Label>
              <Form.Control 
                name="name" 
                value={formData.name} 
                onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                required
                style={{ borderRadius: '10px', padding: '12px' }}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label style={{ fontWeight: '600' }}>Email</Form.Label>
              <Form.Control 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                style={{ borderRadius: '10px', padding: '12px' }}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label style={{ fontWeight: '600' }}>Phone</Form.Label>
              <Form.Control 
                name="phone" 
                value={formData.phone} 
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })} 
                style={{ borderRadius: '10px', padding: '12px' }}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label style={{ fontWeight: '600' }}>Address</Form.Label>
              <Form.Control 
                as="textarea" 
                name="address" 
                value={formData.address} 
                onChange={(e) => setFormData({ ...formData, address: e.target.value })} 
                style={{ borderRadius: '10px', padding: '12px' }}
              />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label style={{ fontWeight: '600' }}>GST Number</Form.Label>
              <Form.Control 
                name="gstNumber" 
                value={formData.gstNumber} 
                onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value })} 
                style={{ borderRadius: '10px', padding: '12px' }}
              />
            </Form.Group>
            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={() => setShowModal(false)} style={{ borderRadius: '8px', padding: '10px 24px' }}>Cancel</Button>
              <Button 
                type="submit" 
                style={{ 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                  border: 'none',
                  borderRadius: '8px',
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

export default Suppliers;
