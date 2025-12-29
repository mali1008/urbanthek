import React, { useState, useEffect } from 'react';

export default function Cart({ cart, addItem, removeItem, totalAmount, placeOrder }) {
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [customerDetails, setCustomerDetails] = useState({
    name: '', phone: '', address: '', notes: ''
  });

  // Get cart items from menu + cart state (matches home.jsx)
  const cartItems = Object.entries(cart)
    .filter(([key, qty]) => qty > 0)
    .map(([key, qty]) => {
      const [id, type] = key.split('_');
      return { id: parseInt(id), type, quantity: qty };
    });

  // Styles (your beautiful design preserved!)
  const container = {
    maxWidth: 600, margin: '0 auto', padding: 24,
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  };

  const header = {
    textAlign: 'center', color: '#1f2937', marginBottom: 32,
    fontSize: 28, fontWeight: 700
  };

  const cartItem = {
    display: 'flex', alignItems: 'center', padding: 20,
    border: '1px solid #e5e7eb', borderRadius: 16, marginBottom: 16,
    background: '#f9fafb'
  };

  const qtyBtn = {
    width: 52, height: 52, border: '2px solid #10b981', borderRadius: 16,
    background: 'linear-gradient(145deg, #f1f5f9 0%, #e2e8f0 100%)',
    color: '#1BA672', fontSize: 24, fontWeight: 800, cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 8px 24px rgba(16,185,129,0.4)'
  };

  const totalSection = {
    background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white',
    padding: 24, borderRadius: 16, textAlign: 'center', marginTop: 16,
    fontSize: 20, fontWeight: 700
  };

  const checkoutBtn = {
    width: '100%', background: '#10b981', color: 'white',
    padding: '16px 24px', borderRadius: 16, border: 'none',
    fontSize: 18, fontWeight: 600, cursor: 'pointer', marginTop: 24
  };

  if (cartItems.length === 0) {
    return (
      <div style={container}>
        <h1 style={header}>🛒 Your Cart</h1>
        <div style={{ textAlign: 'center', padding: 48, color: '#6b7280' }}>
          <h3>Your cart is empty</h3>
          <p>Add items from menu to get started!</p>
        </div>
      </div>
    );
  }

  return (
    <div style={container}>
      <h1 style={header}>🛒 Your Cart</h1>
      
      {cartItems.map(({ id, type, quantity }) => (
        <div key={`${id}_${type}`} style={cartItem}>
          <div style={{ width: 80, height: 80, borderRadius: 12, 
            background: '#f3f4f6', marginRight: 16, display: 'flex', 
            alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>
            🍽️
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: 18, color: '#1f2937' }}>
              {/* Display item name and price from menu */}
              {menu.find(item => item.id === id)?.name || `Item ${id}`}
              <span style={{ fontSize: 14, color: '#10b981', marginLeft: 8 }}>
                ({type.toUpperCase()})
              </span>
            </h3>
            <p style={{ margin: 0, color: '#6b7280', fontSize: 14 }}>
              ₹{menu.find(item => item.id === id)?.[type] || 0} × {quantity}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button style={qtyBtn} onClick={() => removeItem(id, type)}>-</button>
            <span style={{ fontWeight: 800, fontSize: 20, minWidth: 30, textAlign: 'center' }}>
              {quantity}
            </span>
            <button style={qtyBtn} onClick={() => addItem(id, type)}>+</button>
          </div>
        </div>
      ))}

      <div style={totalSection}>
        Total: ₹{totalAmount.toFixed(2)}
        {totalAmount >= 499 && <div style={{ fontSize: 14, opacity: 0.9 }}>🎉 Free Delivery!</div>}
      </div>

      <button style={checkoutBtn} onClick={() => setShowCustomerModal(true)}>
        🚀 Checkout → Enter Delivery Details
      </button>

      {/* Customer Modal - YOUR BEAUTIFUL DESIGN PRESERVED */}
      {showCustomerModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.7)', zIndex: 9999, display: 'flex',
          alignItems: 'center', justifyContent: 'center', padding: 20
        }}>
          <div style={{
            background: 'white', padding: 32, borderRadius: 24, maxWidth: 450, width: '100%',
            boxShadow: '0 25px 50px rgba(0,0,0,0.25)', maxHeight: '90vh', overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ margin: 0, color: '#1f2937', fontSize: 24 }}>📍 Delivery Details</h2>
              <button onClick={() => setShowCustomerModal(false)} style={{
                background: 'none', border: 'none', fontSize: 24, cursor: 'pointer', color: '#6b7280'
              }}>×</button>
            </div>

            {/* Your existing form fields - PERFECT! */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, color: '#374151' }}>
                Full Name *
              </label>
              <input placeholder="Enter your full name" value={customerDetails.name}
                onChange={(e) => setCustomerDetails({ ...customerDetails, name: e.target.value })}
                style={{ width: '100%', padding: 14, border: '2px solid #e5e7eb', borderRadius: 12, fontSize: 16 }} />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, color: '#374151' }}>
                Phone Number *
              </label>
              <input placeholder="Enter phone number (10 digits)" value={customerDetails.phone}
                onChange={(e) => setCustomerDetails({ ...customerDetails, phone: e.target.value })}
                style={{ width: '100%', padding: 14, border: '2px solid #e5e7eb', borderRadius: 12, fontSize: 16 }} />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, color: '#374151' }}>
                Delivery Address *
              </label>
              <textarea placeholder="House no., Street, Landmark, Near Akankha More Petrol Pump, New Town"
                value={customerDetails.address}
                onChange={(e) => setCustomerDetails({ ...customerDetails, address: e.target.value })}
                rows={3} style={{ width: '100%', padding: 14, border: '2px solid #e5e7eb', borderRadius: 12, fontSize: 16 }} />
            </div>

            <div style={{ display: 'flex', gap: 16 }}>
              <button onClick={() => setShowCustomerModal(false)} style={{
                flex: 1, padding: 16, background: '#f3f4f6', color: '#374151',
                borderRadius: 12, border: 'none', fontSize: 16, fontWeight: 500, cursor: 'pointer'
              }}>Cancel</button>
              <button onClick={placeOrder}
                disabled={!customerDetails.name || !customerDetails.phone || !customerDetails.address}
                style={{
                  flex: 1, padding: 16, background: '#10b981', color: 'white',
                  borderRadius: 12, border: 'none', fontSize: 16, fontWeight: 600, cursor: 'pointer'
                }}>
                ✅ Place Order ₹{totalAmount}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
