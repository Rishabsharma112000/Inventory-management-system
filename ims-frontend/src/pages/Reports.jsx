import { useState, useEffect } from 'react';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';
import api from '../services/api';

const Reports = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await api.get('/dashboard');
      setStats(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const downloadReport = async (type) => {
    try {
      const response = await api.get(`/reports/${type}`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${type}-report-${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      console.error('Download failed:', err);
    }
  };

  const cardColors = [
    { bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', icon: '📦' },
    { bg: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', icon: '⚠️' },
    { bg: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', icon: '🏷️' },
    { bg: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', icon: '🏭' },
    { bg: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', icon: '💰' }
  ];

  return (
    <Container fluid style={{ background: '#f0f2f5', minHeight: '100vh', padding: '20px' }}>
      <h1 className="mb-4" style={{ fontWeight: '700', color: '#333' }}>Reports</h1>

      {/* Summary Cards */}
      {stats && (
        <Row className="mb-4">
          <Col md={2.4} className="mb-3">
            <Card style={{ 
              background: cardColors[0].bg, 
              border: 'none', 
              borderRadius: '12px', 
              color: 'white', 
              padding: '20px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}>
              <div style={{ fontSize: '32px', marginBottom: '10px' }}>{cardColors[0].icon}</div>
              <div style={{ fontSize: '36px', fontWeight: '700' }}>{stats.totalProducts}</div>
              <div style={{ fontSize: '14px', opacity: 0.9 }}>Total Products</div>
            </Card>
          </Col>
          <Col md={2.4} className="mb-3">
            <Card style={{ 
              background: cardColors[1].bg, 
              border: 'none', 
              borderRadius: '12px', 
              color: 'white', 
              padding: '20px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}>
              <div style={{ fontSize: '32px', marginBottom: '10px' }}>{cardColors[1].icon}</div>
              <div style={{ fontSize: '36px', fontWeight: '700' }}>{stats.lowStockItems}</div>
              <div style={{ fontSize: '14px', opacity: 0.9 }}>Low Stock Items</div>
            </Card>
          </Col>
          <Col md={2.4} className="mb-3">
            <Card style={{ 
              background: cardColors[2].bg, 
              border: 'none', 
              borderRadius: '12px', 
              color: 'white', 
              padding: '20px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}>
              <div style={{ fontSize: '32px', marginBottom: '10px' }}>{cardColors[2].icon}</div>
              <div style={{ fontSize: '36px', fontWeight: '700' }}>{stats.totalCategories}</div>
              <div style={{ fontSize: '14px', opacity: 0.9 }}>Categories</div>
            </Card>
          </Col>
          <Col md={2.4} className="mb-3">
            <Card style={{ 
              background: cardColors[3].bg, 
              border: 'none', 
              borderRadius: '12px', 
              color: 'white', 
              padding: '20px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}>
              <div style={{ fontSize: '32px', marginBottom: '10px' }}>{cardColors[3].icon}</div>
              <div style={{ fontSize: '36px', fontWeight: '700' }}>{stats.totalSuppliers}</div>
              <div style={{ fontSize: '14px', opacity: 0.9 }}>Suppliers</div>
            </Card>
          </Col>
          <Col md={2.4} className="mb-3">
            <Card style={{ 
              background: cardColors[4].bg, 
              border: 'none', 
              borderRadius: '12px', 
              color: 'white', 
              padding: '20px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}>
              <div style={{ fontSize: '32px', marginBottom: '10px' }}>{cardColors[4].icon}</div>
              <div style={{ fontSize: '36px', fontWeight: '700' }}>${stats.inventoryValue.toFixed(2)}</div>
              <div style={{ fontSize: '14px', opacity: 0.9 }}>Inventory Value</div>
            </Card>
          </Col>
        </Row>
      )}

      {/* Report Download Cards */}
      <Row>
        <Col md={4} className="mb-3">
          <Card style={{ 
            border: 'none', 
            borderRadius: '12px', 
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            transition: 'transform 0.3s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <Card.Body style={{ padding: '30px', textAlign: 'center' }}>
              <div style={{ fontSize: '60px', marginBottom: '20px' }}>📦</div>
              <Card.Title style={{ fontWeight: '700', color: '#333', fontSize: '20px' }}>Products Report</Card.Title>
              <Card.Text style={{ color: '#666', marginBottom: '25px', fontSize: '15px' }}>
                Download complete product list with details including SKU, price, stock, and categories
              </Card.Text>
              <Button 
                onClick={() => downloadReport('products')}
                style={{ 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                  border: 'none',
                  borderRadius: '10px',
                  padding: '12px 30px',
                  fontWeight: '600',
                  fontSize: '15px'
                }}
              >
                📥 Download CSV
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-3">
          <Card style={{ 
            border: 'none', 
            borderRadius: '12px', 
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            transition: 'transform 0.3s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <Card.Body style={{ padding: '30px', textAlign: 'center' }}>
              <div style={{ fontSize: '60px', marginBottom: '20px' }}>📋</div>
              <Card.Title style={{ fontWeight: '700', color: '#333', fontSize: '20px' }}>Inventory Report</Card.Title>
              <Card.Text style={{ color: '#666', marginBottom: '25px', fontSize: '15px' }}>
                Download stock levels and inventory details with current quantities and minimum stock values
              </Card.Text>
              <Button 
                onClick={() => downloadReport('inventory')}
                style={{ 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                  border: 'none',
                  borderRadius: '10px',
                  padding: '12px 30px',
                  fontWeight: '600',
                  fontSize: '15px'
                }}
              >
                📥 Download CSV
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-3">
          <Card style={{ 
            border: 'none', 
            borderRadius: '12px', 
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            transition: 'transform 0.3s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <Card.Body style={{ padding: '30px', textAlign: 'center' }}>
              <div style={{ fontSize: '60px', marginBottom: '20px' }}>🏷️</div>
              <Card.Title style={{ fontWeight: '700', color: '#333', fontSize: '20px' }}>Categories Report</Card.Title>
              <Card.Text style={{ color: '#666', marginBottom: '25px', fontSize: '15px' }}>
                Download category and product mapping with complete category details
              </Card.Text>
              <Button 
                onClick={() => downloadReport('categories')}
                style={{ 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                  border: 'none',
                  borderRadius: '10px',
                  padding: '12px 30px',
                  fontWeight: '600',
                  fontSize: '15px'
                }}
              >
                📥 Download CSV
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Reports;
