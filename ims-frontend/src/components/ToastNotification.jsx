import { Toast, ToastContainer } from 'react-bootstrap';

const ToastNotification = ({ show, onClose, message, variant = 'success' }) => {
  return (
    <ToastContainer position="top-end" className="p-3" style={{ zIndex: 9999 }}>
      <Toast 
        show={show} 
        onClose={onClose} 
        delay={3000} 
        autohide
        style={{
          border: 'none',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
        }}
      >
        <Toast.Header style={{ borderBottom: 'none' }}>
          <strong className="me-auto">{variant === 'success' ? 'Success!' : 'Error!'}</strong>
        </Toast.Header>
        <Toast.Body style={{ fontWeight: 600 }}>
          {message}
        </Toast.Body>
      </Toast>
    </ToastContainer>
  );
};

export default ToastNotification;
