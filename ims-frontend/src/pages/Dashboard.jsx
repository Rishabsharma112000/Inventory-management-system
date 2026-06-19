import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge } from 'react-bootstrap';
import api from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchDashboard();
    fetchProducts();
    fetchCustomers();
    fetchOrders();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await api.get('/dashboard');
      setStats({
        ...res.data,
        inventoryValue: parseFloat(res.data.inventoryValue)
      });
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

  const fetchCustomers = async () => {
    try {
      const res = await api.get('/customers');
      setCustomers(res.data.customers);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders');
      setOrders(res.data.orders);
    } catch (err) {
      console.error(err);
    }
  };

  // Calculate total quantity in stock
  const totalQuantityInStock = products.reduce((sum, p) => sum + p.quantity, 0);

  // Default fallback image
  const defaultImage = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400';

  return (
    <Container fluid style={{ background: '#f0f2f5', minHeight: '100vh', padding: '20px' }}>
      <Row>
        {/* Left Section - Sales Activity & Product Details */}
        <Col md={8}>
          {/* Sales Activity */}
          <Card style={{ border: 'none', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', marginBottom: '20px' }}>
            <Card.Header style={{ background: 'white', borderBottom: '1px solid #eee', padding: '15px 20px' }}>
              <h6 style={{ fontWeight: '600', color: '#666', margin: 0 }}>Sales Activity</h6>
            </Card.Header>
            <Card.Body style={{ padding: '20px' }}>
              <Row>
                <Col md={3} className="text-center">
                  <div style={{ fontSize: '32px', fontWeight: '700', color: '#4a90e2', marginBottom: '5px' }}>
                    {orders.filter(o => o.status === 'PENDING').length}
                  </div>
                  <div style={{ fontSize: '12px', color: '#888' }}>
                    <span style={{ display: 'inline-block', marginRight: '5px' }}>⦿</span> TO BE PACKED
                  </div>
                </Col>
                <Col md={3} className="text-center">
                  <div style={{ fontSize: '32px', fontWeight: '700', color: '#e74c3c', marginBottom: '5px' }}>
                    {orders.filter(o => o.status === 'COMPLETED').length}
                  </div>
                  <div style={{ fontSize: '12px', color: '#888' }}>
                    <span style={{ display: 'inline-block', marginRight: '5px' }}>⦿</span> TO BE SHIPPED
                  </div>
                </Col>
                <Col md={3} className="text-center">
                  <div style={{ fontSize: '32px', fontWeight: '700', color: '#4cae4c', marginBottom: '5px' }}>
                    3
                  </div>
                  <div style={{ fontSize: '12px', color: '#888' }}>
                    <span style={{ display: 'inline-block', marginRight: '5px' }}>⦿</span> TO BE DELIVERED
                  </div>
                </Col>
                <Col md={3} className="text-center">
                  <div style={{ fontSize: '32px', fontWeight: '700', color: '#f0ad4e', marginBottom: '5px' }}>
                    4
                  </div>
                  <div style={{ fontSize: '12px', color: '#888' }}>
                    <span style={{ display: 'inline-block', marginRight: '5px' }}>⦿</span> TO BE INVOICED
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Product Details & Top Selling Items */}
          <Row>
            {/* Product Details */}
            <Col md={6}>
              <Card style={{ border: 'none', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                <Card.Header style={{ background: 'white', borderBottom: '1px solid #eee', padding: '15px 20px' }}>
                  <h6 style={{ fontWeight: '600', color: '#666', margin: 0 }}>PRODUCT DETAILS</h6>
                </Card.Header>
                <Card.Body style={{ padding: '20px' }}>
                  <Row className="mb-3 align-items-center">
                    <Col md={8} style={{ color: '#e74c3c', fontWeight: '600' }}>Low Stock Items</Col>
                    <Col md={4} className="text-end" style={{ fontSize: '20px', fontWeight: '700', color: '#333' }}>
                      {stats?.lowStockItems || 0}
                    </Col>
                  </Row>
                  <Row className="mb-3 align-items-center">
                    <Col md={8} style={{ color: '#666', fontWeight: '500' }}>All Item Group</Col>
                    <Col md={4} className="text-end" style={{ fontSize: '20px', fontWeight: '700', color: '#333' }}>
                      {stats?.totalCategories || 0}
                    </Col>
                  </Row>
                  <Row className="align-items-center">
                    <Col md={8} style={{ color: '#666', fontWeight: '500' }}>All Items</Col>
                    <Col md={4} className="text-end" style={{ fontSize: '20px', fontWeight: '700', color: '#333' }}>
                      {stats?.totalProducts || 0}
                    </Col>
                  </Row>
                  <div style={{ marginTop: '20px', textAlign: 'center' }}>
                    <svg width="100" height="100" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" fill="none" stroke="#e0e0e0" strokeWidth="8" />
                      <circle 
                        cx="50" cy="50" r="40" 
                        fill="none" 
                        stroke="#34d399" 
                        strokeWidth="8"
                        strokeDasharray="251"
                        strokeDashoffset="47"
                        transform="rotate(-90 50 50)"
                      />
                      <text x="50" y="55" textAnchor="middle" fontSize="16" fontWeight="700" fill="#333">
                        81%
                      </text>
                    </svg>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            {/* Top Selling Items */}
            <Col md={6}>
              <Card style={{ border: 'none', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                <Card.Header style={{ background: 'white', borderBottom: '1px solid #eee', padding: '15px 20px' }}>
                  <Row>
                    <Col md={8}><h6 style={{ fontWeight: '600', color: '#666', margin: 0 }}>TOP SELLING ITEMS</h6></Col>
                    <Col md={4} className="text-end" style={{ color: '#888', fontSize: '12px' }}>This Month</Col>
                  </Row>
                </Card.Header>
                <Card.Body style={{ padding: '15px' }}>
                  <Row>
                    {products.slice(0, 4).map((product, index) => (
                      <Col md={6} key={product.id} className="mb-3">
                        <div style={{ textAlign: 'center' }}>
                          <img 
                            src={product.imageUrl || defaultImage} 
                            alt={product.name} 
                            style={{ 
                              width: '80px', 
                              height: '80px', 
                              objectFit: 'cover', 
                              borderRadius: '8px',
                              marginBottom: '10px'
                            }} 
                          />
                          <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {product.name}
                          </div>
                          <div style={{ fontSize: '14px', fontWeight: '700', color: '#333' }}>
                            {Math.floor(Math.random() * 20) + 1} sets
                          </div>
                        </div>
                      </Col>
                    ))}
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Purchase Order & Sales Order */}
          <Row style={{ marginTop: '20px' }}>
            {/* Purchase Order */}
            <Col md={6}>
              <Card style={{ border: 'none', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                <Card.Header style={{ background: 'white', borderBottom: '1px solid #eee', padding: '15px 20px' }}>
                  <Row>
                    <Col md={8}><h6 style={{ fontWeight: '600', color: '#666', margin: 0 }}>PURCHASE ORDER</h6></Col>
                    <Col md={4} className="text-end" style={{ color: '#888', fontSize: '12px' }}>This Month</Col>
                  </Row>
                </Card.Header>
                <Card.Body style={{ padding: '20px' }}>
                  <div className="mb-4 text-center">
                    <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>Quantity Ordered</div>
                    <div style={{ fontSize: '24px', fontWeight: '700', color: '#4a90e2' }}>
                      {totalQuantityInStock}
                    </div>
                  </div>
                  <div className="text-center">
                    <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>Total Cost</div>
                    <div style={{ fontSize: '24px', fontWeight: '700', color: '#4a90e2' }}>
                      ${stats?.inventoryValue?.toFixed(2) || '0.00'}
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            {/* Sales Order */}
            <Col md={6}>
              <Card style={{ border: 'none', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                <Card.Header style={{ background: 'white', borderBottom: '1px solid #eee', padding: '15px 20px' }}>
                  <Row>
                    <Col md={8}><h6 style={{ fontWeight: '600', color: '#666', margin: 0 }}>SALES ORDER</h6></Col>
                    <Col md={4} className="text-end" style={{ color: '#888', fontSize: '12px' }}>This Month</Col>
                  </Row>
                </Card.Header>
                <Card.Body style={{ padding: '15px' }}>
                  <Table responsive style={{ fontSize: '13px' }}>
                    <thead>
                      <tr style={{ color: '#888' }}>
                        <th>Channel</th>
                        <th className="text-center">Draft</th>
                        <th className="text-center">Confirmed</th>
                        <th className="text-center">Packed</th>
                        <th className="text-center">Shipped</th>
                        <th className="text-center">Invoiced</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Others</td>
                        <td className="text-center">0</td>
                        <td className="text-center">{orders.filter(o => o.status === 'PENDING').length}</td>
                        <td className="text-center">5</td>
                        <td className="text-center">{orders.filter(o => o.status === 'COMPLETED').length}</td>
                        <td className="text-center">{orders.length}</td>
                      </tr>
                      <tr>
                        <td>Easy</td>
                        <td className="text-center">0</td>
                        <td className="text-center">3</td>
                        <td className="text-center">0</td>
                        <td className="text-center">6</td>
                        <td className="text-center">6</td>
                      </tr>
                      <tr>
                        <td>Shopify</td>
                        <td className="text-center">0</td>
                        <td className="text-center">12</td>
                        <td className="text-center">0</td>
                        <td className="text-center">0</td>
                        <td className="text-center">2</td>
                      </tr>
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>

        {/* Right Section - Inventory Summary & Recent Data */}
        <Col md={4}>
          {/* Inventory Summary */}
          <Card style={{ border: 'none', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', marginBottom: '20px' }}>
            <Card.Header style={{ background: 'white', borderBottom: '1px solid #eee', padding: '15px 20px' }}>
              <h6 style={{ fontWeight: '600', color: '#666', margin: 0 }}>Inventory Summary</h6>
            </Card.Header>
            <Card.Body style={{ padding: '20px' }}>
              <Row className="mb-3 align-items-center">
                <Col md={8}>
                  <div style={{ fontSize: '12px', color: '#888', marginBottom: '5px' }}>QUANTITY IN HAND</div>
                </Col>
                <Col md={4} className="text-end">
                  <div style={{ 
                    background: '#f8f9fa', 
                    padding: '8px 15px', 
                    borderRadius: '4px',
                    fontSize: '18px',
                    fontWeight: '700'
                  }}>
                    {totalQuantityInStock}
                  </div>
                </Col>
              </Row>
              <Row className="align-items-center">
                <Col md={8}>
                  <div style={{ fontSize: '12px', color: '#888', marginBottom: '5px' }}>QUANTITY TO BE RECEIVED</div>
                </Col>
                <Col md={4} className="text-end">
                  <div style={{ 
                    background: '#f8f9fa', 
                    padding: '8px 15px', 
                    borderRadius: '4px',
                    fontSize: '18px',
                    fontWeight: '700'
                  }}>
                    216
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Recent Orders */}
          <Card style={{ border: 'none', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', marginBottom: '20px' }}>
            <Card.Header style={{ background: 'white', borderBottom: '1px solid #eee', padding: '15px 20px' }}>
              <h6 style={{ fontWeight: '600', color: '#666', margin: 0 }}>Recent Orders</h6>
            </Card.Header>
            <Card.Body style={{ padding: '15px' }}>
              {orders.slice(0, 3).map((order) => (
                <div key={order.id} style={{ padding: '10px 0', borderBottom: '1px solid #f0f0f0' }}>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <div style={{ fontWeight: '600', fontSize: '14px' }}>{order.orderNumber}</div>
                      <div style={{ fontSize: '12px', color: '#888' }}>{order.customer?.fullName}</div>
                    </div>
                    <div className="text-end">
                      <div style={{ fontSize: '14px', fontWeight: '700', color: '#333' }}>
                        ${parseFloat(order.totalAmount).toFixed(2)}
                      </div>
                      <Badge 
                        bg={order.status === 'COMPLETED' ? 'success' : order.status === 'CANCELLED' ? 'danger' : 'warning'}
                        style={{ fontSize: '10px' }}
                      >
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
              {orders.length === 0 && (
                <div style={{ textAlign: 'center', color: '#888', padding: '20px' }}>
                  No orders yet
                </div>
              )}
            </Card.Body>
          </Card>

          {/* Recent Customers */}
          <Card style={{ border: 'none', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <Card.Header style={{ background: 'white', borderBottom: '1px solid #eee', padding: '15px 20px' }}>
              <h6 style={{ fontWeight: '600', color: '#666', margin: 0 }}>Recent Customers</h6>
            </Card.Header>
            <Card.Body style={{ padding: '15px' }}>
              {customers.slice(0, 3).map((customer) => (
                <div key={customer.id} style={{ padding: '10px 0', borderBottom: '1px solid #f0f0f0' }}>
                  <div className="d-flex align-items-center">
                    <div style={{ 
                      width: '40px', 
                      height: '40px', 
                      borderRadius: '50%', 
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: '700',
                      marginRight: '12px'
                    }}>
                      {customer.fullName.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontWeight: '600', fontSize: '14px' }}>{customer.fullName}</div>
                      <div style={{ fontSize: '12px', color: '#888' }}>{customer.email}</div>
                    </div>
                  </div>
                </div>
              ))}
              {customers.length === 0 && (
                <div style={{ textAlign: 'center', color: '#888', padding: '20px' }}>
                  No customers yet
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
