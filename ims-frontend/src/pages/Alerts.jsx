import { useState, useEffect } from 'react';
import { Table, Container, Card } from 'react-bootstrap';
import api from '../services/api';

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const res = await api.get('/alerts');
      setAlerts(res.data.alerts || []);
    } catch (err) {
      console.error(err);
    }
  };

  // Default fallback image
  const defaultImage = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400';

  return (
    <Container fluid style={{ background: '#f0f2f5', minHeight: '100vh', padding: '20px' }}>
      <h1 className="mb-4" style={{ fontWeight: '700', color: '#333' }}>Low Stock Alerts</h1>

      {alerts.length === 0 ? (
        <Card style={{ border: 'none', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', textAlign: 'center', padding: '40px' }}>
          <div style={{ fontSize: '60px', marginBottom: '20px' }}>✅</div>
          <h3 style={{ fontWeight: '700', color: '#2e7d32' }}>All Good!</h3>
          <p style={{ color: '#666', marginTop: '10px' }}>No products are currently low in stock.</p>
        </Card>
      ) : (
        <Card style={{ border: 'none', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <Card.Body style={{ padding: '20px' }}>
            <Table responsive hover>
              <thead style={{ background: '#f8f9fa' }}>
                <tr>
                  <th style={{ padding: '15px' }}>Image</th>
                  <th style={{ padding: '15px' }}>Product</th>
                  <th style={{ padding: '15px' }}>SKU</th>
                  <th style={{ padding: '15px' }}>Current Stock</th>
                  <th style={{ padding: '15px' }}>Minimum Stock</th>
                  <th style={{ padding: '15px' }}>Reorder Quantity</th>
                </tr>
              </thead>
              <tbody>
                {alerts.map((alert) => (
                  <tr key={alert.id} style={{ verticalAlign: 'middle' }}>
                    <td style={{ padding: '15px' }}>
                      <img 
                        src={alert.Product?.imageUrl || defaultImage} 
                        alt={alert.Product?.name} 
                        style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px' }} 
                      />
                    </td>
                    <td style={{ fontWeight: '600', padding: '15px' }}>{alert.Product?.name}</td>
                    <td style={{ color: '#666', padding: '15px' }}>{alert.Product?.sku}</td>
                    <td style={{ fontSize: '18px', fontWeight: '700', color: '#c62828', padding: '15px' }}>{alert.Product?.quantity}</td>
                    <td style={{ color: '#666', padding: '15px' }}>{alert.Product?.minimumStock}</td>
                    <td style={{ padding: '15px' }}>
                      <span style={{ 
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '600',
                        background: '#ffebee',
                        color: '#c62828'
                      }}>
                        +{(alert.Product?.minimumStock - alert.Product?.quantity + 10) || 10}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default Alerts;
