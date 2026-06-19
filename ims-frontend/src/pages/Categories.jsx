import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Container, Alert, Card } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', icon: '' });
  const [error, setError] = useState('');
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data.categories);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editing) {
        await api.put(`/categories/${editing.id}`, formData);
      } else {
        await api.post('/categories', formData);
      }
      setShowModal(false);
      setFormData({ name: '', description: '', icon: '' });
      setEditing(null);
      fetchCategories();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (category) => {
    setEditing(category);
    setFormData({ name: category.name, description: category.description, icon: category.icon || '' });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await api.delete(`/categories/${id}`);
        fetchCategories();
      } catch (err) {
        console.error(err);
      }
    }
  };

  // List of common emojis for quick selection
  const commonIcons = ['📱', '👕', '🏠', '📚', '⚽', '🍔', '💻', '🎮', '📦', '🚗', '🛍️', '🍎'];

  return (
    <Container fluid style={{ background: '#f0f2f5', minHeight: '100vh', padding: '20px' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 style={{ fontWeight: '700', color: '#333' }}>Categories</h1>
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
          + Add Category
        </Button>}
      </div>
      {error && <Alert variant="danger" style={{ borderRadius: '10px' }}>{error}</Alert>}

      <Card style={{ border: 'none', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <Card.Body style={{ padding: '20px' }}>
          <Table responsive hover>
            <thead style={{ background: '#f8f9fa' }}>
              <tr>
                <th style={{ padding: '15px' }}>Icon</th>
                <th style={{ padding: '15px' }}>Name</th>
                <th style={{ padding: '15px' }}>Description</th>
                {isAdmin && <th style={{ padding: '15px' }}>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id} style={{ verticalAlign: 'middle' }}>
                  <td style={{ fontSize: '32px', padding: '15px' }}>{cat.icon || '📦'}</td>
                  <td style={{ fontWeight: '600', padding: '15px' }}>{cat.name}</td>
                  <td style={{ color: '#666', padding: '15px' }}>{cat.description || 'No description'}</td>
                  {isAdmin && (
                    <td style={{ padding: '15px' }}>
                      <Button variant="outline-secondary" size="sm" className="me-2" onClick={() => handleEdit(cat)}>Edit</Button>
                      <Button variant="outline-danger" size="sm" onClick={() => handleDelete(cat.id)}>Delete</Button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton style={{ borderBottom: 'none' }}>
          <Modal.Title style={{ fontWeight: '700' }}>{editing ? 'Edit' : 'Add'} Category</Modal.Title>
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
              <Form.Label style={{ fontWeight: '600' }}>Description</Form.Label>
              <Form.Control 
                as="textarea" 
                name="description" 
                value={formData.description} 
                onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
                style={{ borderRadius: '10px', padding: '12px', height: '100px' }}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label style={{ fontWeight: '600' }}>Icon (Emoji)</Form.Label>
              <Form.Control 
                name="icon" 
                value={formData.icon} 
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })} 
                placeholder="Enter an emoji or choose from below"
                style={{ borderRadius: '10px', padding: '12px' }}
              />
              <div className="mt-2" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {commonIcons.map((icon) => (
                  <Button 
                    key={icon} 
                    variant="light" 
                    style={{ fontSize: '24px', padding: '4px 8px' }}
                    onClick={() => setFormData({ ...formData, icon })}
                  >
                    {icon}
                  </Button>
                ))}
              </div>
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

export default Categories;
