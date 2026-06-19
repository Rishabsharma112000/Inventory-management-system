import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Container, Alert, Card } from 'react-bootstrap';
import api from '../services/api';

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({ type: 'IN', quantity: '', notes: '' });
  const [error, setError] = useState('');
  const [showTransactions, setShowTransactions] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products');
      setProducts(res.data.products);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTransactions = async (productId) => {
    try {
      const res = await api.get(`/inventory/${productId}/transactions`);
      setTransactions(res.data.transactions || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post(`/inventory/${selectedProduct.id}/${formData.type.toLowerCase()}`, {
        quantity: parseInt(formData.quantity),
        notes: formData.notes
      });
      setShowModal(false);
      setFormData({ type: 'IN', quantity: '', notes: '' });
      setSelectedProduct(null);
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleStockChange = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleViewTransactions = (product) => {
    setSelectedProduct(product);
    fetchTransactions(product.id);
    setShowTransactions(true);
  };

  // Default fallback image
  const defaultImage = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400';

  return (
    <Container fluid style={{ background: '#f0f2f5', minHeight: '100vh', padding: '20px' }}>
      <h1 className="mb-4" style={{ fontWeight: '700', color: '#333' }}>Inventory Management</h1>
      {error && <Alert variant="danger" style={{ borderRadius: '10px' }}>{error}</Alert>}

      <Card style={{ border: 'none', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <Card.Body style={{ padding: '20px' }}>
          <Table responsive hover>
            <thead style={{ background: '#f8f9fa' }}>
              <tr>
                <th style={{ padding: '15px' }}>Image</th>
                <th style={{ padding: '15px' }}>Product</th>
                <th style={{ padding: '15px' }}>SKU</th>
                <th style={{ padding: '15px' }}>Quantity</th>
                <th style={{ padding: '15px' }}>Minimum Stock</th>
                <th style={{ padding: '15px' }}>Status</th>
                <th style={{ padding: '15px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} style={{ verticalAlign: 'middle' }}>
                  <td style={{ padding: '15px' }}>
                    <img 
                      src={product.imageUrl || defaultImage} 
                      alt={product.name} 
                      style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px' }} 
                    />
                  </td>
                  <td style={{ fontWeight: '600', padding: '15px' }}>{product.name}</td>
                  <td style={{ color: '#666', padding: '15px' }}>{product.sku}</td>
                  <td style={{ fontSize: '18px', fontWeight: '700', padding: '15px' }}>{product.quantity}</td>
                  <td style={{ color: '#666', padding: '15px' }}>{product.minimumStock}</td>
                  <td style={{ padding: '15px' }}>
                    <span style={{ 
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '600',
                      background: product.quantity <= product.minimumStock ? '#ffebee' : '#e8f5e9',
                      color: product.quantity <= product.minimumStock ? '#c62828' : '#2e7d32'
                    }}>
                      {product.quantity <= product.minimumStock ? 'Low Stock' : 'Good'}
                    </span>
                  </td>
                  <td style={{ padding: '15px' }}>
                    <Button variant="success" size="sm" className="me-2" onClick={() => handleStockChange(product)}>Stock In</Button>
                    <Button variant="warning" size="sm" className="me-2" onClick={() => { setFormData({ ...formData, type: 'OUT' }); handleStockChange(product); }}>Stock Out</Button>
                    <Button variant="info" size="sm" onClick={() => handleViewTransactions(product)}>History</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Stock Change Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton style={{ borderBottom: 'none' }}>
          <Modal.Title style={{ fontWeight: '700' }}>
            {formData.type === 'IN' ? 'Stock In' : 'Stock Out'} - {selectedProduct?.name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label style={{ fontWeight: '600' }}>Quantity</Form.Label>
              <Form.Control 
                type="number" 
                name="quantity" 
                value={formData.quantity} 
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })} 
                required
                style={{ borderRadius: '10px', padding: '12px' }}
              />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label style={{ fontWeight: '600' }}>Notes</Form.Label>
              <Form.Control 
                as="textarea" 
                name="notes" 
                value={formData.notes} 
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })} 
                style={{ borderRadius: '10px', padding: '12px' }}
              />
            </Form.Group>
            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={() => setShowModal(false)} style={{ borderRadius: '10px', padding: '10px 24px' }}>Cancel</Button>
              <Button 
                type="submit" 
                variant={formData.type === 'IN' ? 'success' : 'warning'}
                style={{ borderRadius: '10px', padding: '10px 24px', fontWeight: '600' }}
              >
                {formData.type === 'IN' ? 'Add Stock' : 'Remove Stock'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Transactions Modal */}
      <Modal show={showTransactions} onHide={() => setShowTransactions(false)} size="lg">
        <Modal.Header closeButton style={{ borderBottom: 'none' }}>
          <Modal.Title style={{ fontWeight: '700' }}>Transaction History - {selectedProduct?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table responsive hover>
            <thead style={{ background: '#f8f9fa' }}>
              <tr>
                <th style={{ padding: '12px' }}>Date</th>
                <th style={{ padding: '12px' }}>Type</th>
                <th style={{ padding: '12px' }}>Quantity</th>
                <th style={{ padding: '12px' }}>Notes</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id}>
                  <td style={{ padding: '12px' }}>{new Date(tx.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{ 
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '600',
                      background: tx.type === 'IN' ? '#e8f5e9' : '#ffebee',
                      color: tx.type === 'IN' ? '#2e7d32' : '#c62828'
                    }}>
                      {tx.type}
                    </span>
                  </td>
                  <td style={{ fontWeight: '600', padding: '12px' }}>{tx.quantity}</td>
                  <td style={{ color: '#666', padding: '12px' }}>{tx.notes || '-'}</td>
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center" style={{ color: '#666', padding: '30px' }}>No transactions found</td>
                </tr>
              )}
            </tbody>
          </Table>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Inventory;
