import { useState, useEffect } from 'react';
import { Button, Modal, Form, Container, Row, Col, Card } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import ToastNotification from '../components/ToastNotification';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ name: '', sku: '', description: '', categoryId: '', supplierId: '', price: '', quantity: 0, minimumStock: 0, imageUrl: '', status: 'ACTIVE' });
  const [errors, setErrors] = useState({});
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState('success');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchSuppliers();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products');
      setProducts(res.data.products);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data.categories);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const res = await api.get('/suppliers');
      setSuppliers(res.data.suppliers);
    } catch (err) {
      console.error(err);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }
    
    if (!formData.sku.trim()) {
      newErrors.sku = 'SKU is required';
    }
    
    if (!formData.categoryId) {
      newErrors.categoryId = 'Category is required';
    }
    
    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Price must be a positive number';
    }
    
    if (formData.quantity < 0) {
      newErrors.quantity = 'Quantity cannot be negative';
    }
    
    if (formData.minimumStock < 0) {
      newErrors.minimumStock = 'Minimum stock cannot be negative';
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
      if (editing) {
        await api.put(`/products/${editing.id}`, formData);
        setToastMessage('Product updated successfully!');
      } else {
        await api.post('/products', formData);
        setToastMessage('Product added successfully!');
      }
      setToastVariant('success');
      setShowToast(true);
      setShowModal(false);
      setFormData({ name: '', sku: '', description: '', categoryId: '', supplierId: '', price: '', quantity: 0, minimumStock: 0, imageUrl: '', status: 'ACTIVE' });
      setEditing(null);
      fetchProducts();
    } catch (err) {
        setToastMessage(err.response?.data?.message || 'Operation failed');
        setToastVariant('danger');
        setShowToast(true);
      } finally {
        setLoading(false);
      }
  };

  const handleEdit = (product) => {
    setEditing(product);
    setFormData({
      name: product.name,
      sku: product.sku,
      description: product.description || '',
      categoryId: product.categoryId || '',
      supplierId: product.supplierId || '',
      price: product.price.toString(),
      quantity: product.quantity,
      minimumStock: product.minimumStock,
      imageUrl: product.imageUrl || '',
      status: product.status || 'ACTIVE'
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/products/${id}`);
        setToastMessage('Product deleted successfully!');
        setToastVariant('success');
        setShowToast(true);
        fetchProducts();
      } catch (err) {
        setToastMessage(err.response?.data?.message || 'Failed to delete product');
        setToastVariant('danger');
        setShowToast(true);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (name === 'price' ? parseFloat(value) || 0 : parseInt(value) || 0) : value
    }));
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  // Default fallback image
  const defaultImage = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400';

  return (
    <>
      <ToastNotification 
        show={showToast} 
        onClose={() => setShowToast(false)} 
        message={toastMessage} 
        variant={toastVariant} 
      />
      <Container fluid style={{ background: '#f0f2f5', minHeight: '100vh', padding: '20px' }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 style={{ fontWeight: '700', color: '#333' }}>Products</h1>
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
            + Add Product
          </Button>}
        </div>

        <Row>
          {products.map((product) => (
            <Col md={4} className="mb-4" key={product.id}>
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
              <div style={{ height: '200px', overflow: 'hidden' }}>
                <img 
                  src={product.imageUrl || defaultImage} 
                  alt={product.name} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              </div>
              <Card.Body>
                <div style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px', color: '#333' }}>{product.name}</div>
                <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>{product.category?.name}</div>
                <div style={{ fontSize: '24px', fontWeight: '700', color: '#2e7d32', marginBottom: '16px' }}>${product.price}</div>
                <div className="d-flex justify-content-between align-items-center">
                  <span style={{ 
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '600',
                    background: product.quantity <= product.minimumStock ? '#ffebee' : '#e8f5e9',
                    color: product.quantity <= product.minimumStock ? '#c62828' : '#2e7d32'
                  }}>
                    {product.quantity} in stock
                  </span>
                  {isAdmin && (
                    <div>
                      <Button variant="outline-secondary" size="sm" className="me-2" onClick={() => handleEdit(product)}>Edit</Button>
                      <Button variant="outline-danger" size="sm" onClick={() => handleDelete(product.id)}>Delete</Button>
                    </div>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>
          ))}
        </Row>

        <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
          <Modal.Header closeButton style={{ borderBottom: 'none' }}>
            <Modal.Title style={{ fontWeight: '700' }}>{editing ? 'Edit' : 'Add'} Product</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label style={{ fontWeight: '600' }}>Name</Form.Label>
                    <Form.Control 
                      name="name" 
                      value={formData.name} 
                      onChange={handleChange}
                      isInvalid={!!errors.name}
                      style={{ borderRadius: '10px', padding: '12px', border: errors.name ? '2px solid #dc3545' : '2px solid #e0e0e0' }}
                    />
                    {errors.name && <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>}
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label style={{ fontWeight: '600' }}>SKU</Form.Label>
                    <Form.Control 
                      name="sku" 
                      value={formData.sku} 
                      onChange={handleChange}
                      isInvalid={!!errors.sku}
                      style={{ borderRadius: '10px', padding: '12px', border: errors.sku ? '2px solid #dc3545' : '2px solid #e0e0e0' }}
                    />
                    {errors.sku && <Form.Control.Feedback type="invalid">{errors.sku}</Form.Control.Feedback>}
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label style={{ fontWeight: '600' }}>Category</Form.Label>
                    <Form.Select 
                      name="categoryId" 
                      value={formData.categoryId} 
                      onChange={handleChange}
                      isInvalid={!!errors.categoryId}
                      style={{ borderRadius: '10px', padding: '12px', border: errors.categoryId ? '2px solid #dc3545' : '2px solid #e0e0e0' }}
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </Form.Select>
                    {errors.categoryId && <Form.Control.Feedback type="invalid">{errors.categoryId}</Form.Control.Feedback>}
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label style={{ fontWeight: '600' }}>Supplier</Form.Label>
                    <Form.Select 
                      name="supplierId" 
                      value={formData.supplierId} 
                      onChange={handleChange}
                      style={{ borderRadius: '10px', padding: '12px', border: '2px solid #e0e0e0' }}
                    >
                      <option value="">Select Supplier</option>
                      {suppliers.map((sup) => (
                        <option key={sup.id} value={sup.id}>{sup.name}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-3">
                <Form.Label style={{ fontWeight: '600' }}>Description</Form.Label>
                <Form.Control 
                  as="textarea" 
                  name="description" 
                  value={formData.description} 
                  onChange={handleChange}
                  style={{ borderRadius: '10px', padding: '12px', height: '100px', border: '2px solid #e0e0e0' }}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label style={{ fontWeight: '600' }}>Image URL</Form.Label>
                <Form.Control 
                  name="imageUrl" 
                  value={formData.imageUrl} 
                  onChange={handleChange}
                  placeholder="Enter image URL"
                  style={{ borderRadius: '10px', padding: '12px', border: '2px solid #e0e0e0' }}
                />
                {formData.imageUrl && (
                  <div className="mt-2">
                    <img 
                      src={formData.imageUrl} 
                      alt="Preview" 
                      style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }}
                    />
                  </div>
                )}
              </Form.Group>
              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label style={{ fontWeight: '600' }}>Price</Form.Label>
                    <Form.Control 
                      type="number" 
                      step="0.01" 
                      name="price" 
                      value={formData.price} 
                      onChange={handleChange}
                      isInvalid={!!errors.price}
                      style={{ borderRadius: '10px', padding: '12px', border: errors.price ? '2px solid #dc3545' : '2px solid #e0e0e0' }}
                    />
                    {errors.price && <Form.Control.Feedback type="invalid">{errors.price}</Form.Control.Feedback>}
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label style={{ fontWeight: '600' }}>Quantity</Form.Label>
                    <Form.Control 
                      type="number" 
                      name="quantity" 
                      value={formData.quantity} 
                      onChange={handleChange}
                      isInvalid={!!errors.quantity}
                      style={{ borderRadius: '10px', padding: '12px', border: errors.quantity ? '2px solid #dc3545' : '2px solid #e0e0e0' }}
                    />
                    {errors.quantity && <Form.Control.Feedback type="invalid">{errors.quantity}</Form.Control.Feedback>}
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label style={{ fontWeight: '600' }}>Minimum Stock</Form.Label>
                    <Form.Control 
                      type="number" 
                      name="minimumStock" 
                      value={formData.minimumStock} 
                      onChange={handleChange}
                      isInvalid={!!errors.minimumStock}
                      style={{ borderRadius: '10px', padding: '12px', border: errors.minimumStock ? '2px solid #dc3545' : '2px solid #e0e0e0' }}
                    />
                    {errors.minimumStock && <Form.Control.Feedback type="invalid">{errors.minimumStock}</Form.Control.Feedback>}
                  </Form.Group>
                </Col>
              </Row>
              <div className="d-flex justify-content-end gap-2">
                <Button variant="secondary" onClick={() => setShowModal(false)} style={{ borderRadius: '10px', padding: '10px 24px' }}>Cancel</Button>
                <Button 
                  type="submit" 
                  disabled={loading}
                  style={{ 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                    border: 'none',
                    borderRadius: '10px',
                    padding: '10px 24px',
                    fontWeight: '600'
                  }}
                >
                  {loading ? (editing ? 'Updating...' : 'Adding...') : (editing ? 'Update' : 'Add')}
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>
      </Container>
    </>
  );
};

export default Products;
