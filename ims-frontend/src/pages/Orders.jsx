import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Container, Alert, Row, Col, Card, Badge } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ customerId: '', items: [{ productId: '', quantity: 1 }] });
  const [error, setError] = useState('');
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  useEffect(() => {
    fetchOrders();
    fetchCustomers();
    fetchProducts();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders');
      setOrders(res.data.orders);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCustomers = async () => {
    try {
      const res = await api.get('/customers');
      setCustomers(res.data.customers);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products');
      setProducts(res.data.products);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddItem = () => {
    setFormData({ ...formData, items: [...formData.items, { productId: '', quantity: 1 }] });
  };

  const handleRemoveItem = (index) => {
    setFormData({ ...formData, items: formData.items.filter((_, i) => i !== index) });
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    setFormData({ ...formData, items: newItems });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const orderData = {
        customerId: parseInt(formData.customerId),
        items: formData.items.map(item => ({
          productId: parseInt(item.productId),
          quantity: parseInt(item.quantity)
        })).filter(item => item.productId && item.quantity)
      };
      if (orderData.items.length === 0) {
        setError('Please add at least one item');
        return;
      }
      await api.post('/orders', orderData);
      setShowModal(false);
      setFormData({ customerId: '', items: [{ productId: '', quantity: 1 }] });
      fetchOrders();
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleCancelOrder = async (id) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        await api.delete(`/orders/${id}`);
        fetchOrders();
        fetchProducts();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      PENDING: 'warning',
      COMPLETED: 'success',
      CANCELLED: 'danger'
    };
    return <Badge bg={variants[status]}>{status}</Badge>;
  };

  return (
    <Container fluid style={{ background: '#f0f2f5', minHeight: '100vh', padding: '20px' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 style={{ fontWeight: '700', color: '#333' }}>Orders</h1>
        <Button 
          onClick={() => setShowModal(true)} 
          style={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
            border: 'none',
            borderRadius: '10px',
            padding: '12px 24px',
            fontWeight: '600'
          }}
        >
          + Create Order
        </Button>
      </div>
      {error && <Alert variant="danger" style={{ borderRadius: '10px' }}>{error}</Alert>}

      <Row>
        {orders.map((order) => (
          <Col md={12} className="mb-4" key={order.id}>
            <Card style={{ 
              border: 'none', 
              borderRadius: '12px', 
              overflow: 'hidden',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start mb-4">
                  <div>
                    <h5 style={{ fontWeight: '700', marginBottom: '4px' }}>{order.orderNumber}</h5>
                    <div style={{ color: '#666' }}>
                      Customer: {order.customer?.fullName} ({order.customer?.email})
                    </div>
                    <div style={{ fontSize: '14px', color: '#888', marginTop: '4px' }}>
                      {new Date(order.createdAt).toLocaleString()}
                    </div>
                  </div>
                  <div className="text-end">
                    <div style={{ fontSize: '24px', fontWeight: '700', color: '#2e7d32', marginBottom: '8px' }}>
                      ${parseFloat(order.totalAmount).toFixed(2)}
                    </div>
                    <div className="mb-2">{getStatusBadge(order.status)}</div>
                    {isAdmin && order.status !== 'CANCELLED' && (
                      <Button variant="outline-danger" size="sm" onClick={() => handleCancelOrder(order.id)}>
                        Cancel Order
                      </Button>
                    )}
                  </div>
                </div>
                <Table responsive>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items?.map((item) => (
                      <tr key={item.id}>
                        <td>{item.product?.name}</td>
                        <td>${parseFloat(item.price).toFixed(2)}</td>
                        <td>{item.quantity}</td>
                        <td>${parseFloat(item.subtotal).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton style={{ borderBottom: 'none' }}>
          <Modal.Title style={{ fontWeight: '700' }}>Create New Order</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-4">
              <Form.Label style={{ fontWeight: '600' }}>Customer</Form.Label>
              <Form.Select 
                name="customerId" 
                value={formData.customerId} 
                onChange={(e) => setFormData({ ...formData, customerId: e.target.value })} 
                required
                style={{ borderRadius: '10px', padding: '12px' }}
              >
                <option value="">Select Customer</option>
                {customers.map((cust) => (
                  <option key={cust.id} value={cust.id}>{cust.fullName} ({cust.email})</option>
                ))}
              </Form.Select>
            </Form.Group>

            <div className="mb-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 style={{ fontWeight: '600', margin: 0 }}>Order Items</h5>
                <Button variant="outline-secondary" size="sm" onClick={handleAddItem}>+ Add Item</Button>
              </div>
              {formData.items.map((item, index) => (
                <Row key={index} className="mb-3 align-items-end">
                  <Col md={5}>
                    <Form.Group>
                      <Form.Label style={{ fontWeight: '600' }}>Product</Form.Label>
                      <Form.Select 
                        value={item.productId} 
                        onChange={(e) => handleItemChange(index, 'productId', e.target.value)} 
                        required
                        style={{ borderRadius: '10px', padding: '12px' }}
                      >
                        <option value="">Select Product</option>
                        {products.map((prod) => (
                          <option key={prod.id} value={prod.id}>
                            {prod.name} - ${parseFloat(prod.price).toFixed(2)} (Stock: {prod.quantity})
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={5}>
                    <Form.Group>
                      <Form.Label style={{ fontWeight: '600' }}>Quantity</Form.Label>
                      <Form.Control 
                        type="number"
                        min="1"
                        value={item.quantity} 
                        onChange={(e) => handleItemChange(index, 'quantity', e.target.value)} 
                        required
                        style={{ borderRadius: '10px', padding: '12px' }}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={2}>
                    {formData.items.length > 1 && (
                      <Button variant="outline-danger" onClick={() => handleRemoveItem(index)} className="w-100">
                        Remove
                      </Button>
                    )}
                  </Col>
                </Row>
              ))}
            </div>

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
                Create Order
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Orders;
