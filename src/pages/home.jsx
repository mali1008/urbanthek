import { useState } from "react";
import menu from "../menu";
import { useNavigate } from "react-router-dom";

// Constants for business logic
const MIN_ORDER_FREE_DELIVERY = 499;
const DELIVERY_CHARGE = 50;
const OPENING_HOUR = 9;  // 9:00 AM
const CLOSING_HOUR = 23; // 11:00 PM

export default function Home() {
  const [cart, setCart] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [customerDetails, setCustomerDetails] = useState({
    name: '', phone: '', address: '', notes: ''
  });

  // --- LOGIC: TIME CHECK ---
  const now = new Date();
  const currentTimeDecimal = now.getHours() + (now.getMinutes() / 60);
  const openNow = currentTimeDecimal >= OPENING_HOUR && currentTimeDecimal < CLOSING_HOUR;

  // --- LOGIC: CART ---
  const addItem = (id, type = "full") => {
    if (!openNow) { 
      alert("🏪 Urban Thek is currently CLOSED.\nOrders are accepted 9:00 AM - 11:00 PM."); 
      return; 
    }
    const key = `${id}_${type}`;
    setCart((prev) => ({ ...prev, [key]: (prev[key] || 0) + 1 }));
  };

  const removeItem = (id, type) => {
    const key = `${id}_${type}`;
    setCart((prev) => {
      if (!prev[key]) return prev;
      const newCart = { ...prev, [key]: prev[key] - 1 };
      if (newCart[key] <= 0) delete newCart[key];
      return newCart;
    });
  };

  const totalAmount = menu.reduce((sum, item) => 
    sum + (cart[`${item.id}_full`] || 0) * (item.full || 0) + (cart[`${item.id}_half`] || 0) * (item.half || 0), 0
  );

  const isFreeDelivery = totalAmount >= MIN_ORDER_FREE_DELIVERY;
  const cartItems = menu.filter((item) => cart[`${item.id}_full`] || cart[`${item.id}_half`]);
  const filteredMenu = menu.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));

  // --- LOGIC: ORDER SUBMISSION ---
  const placeOrder = () => {
    if (!customerDetails.name || customerDetails.phone.length < 10 || !customerDetails.address) {
      alert("Please enter Name, 10-digit Phone, and Address!");
      return;
    }
    
    let msg = `*🍽️ Urban Thek Order*\n\n`;
    msg += `*👤 Customer:* ${customerDetails.name}\n`;
    msg += `*📞 Phone:* ${customerDetails.phone}\n`;
    msg += `*📍 Address:* ${customerDetails.address}\n\n`;
    msg += `*🛒 Order Summary:*\n`;
    
    cartItems.forEach(item => {
      if (cart[`${item.id}_full`]) msg += `• ${item.name} (Full) x${cart[`${item.id}_full`]} = ₹${item.full * cart[`${item.id}_full`]}\n`;
      if (cart[`${item.id}_half`]) msg += `• ${item.name} (Half) x${cart[`${item.id}_half`]} = ₹${item.half * cart[`${item.id}_half`]}\n`;
    });

    msg += `\n*Delivery:* ${isFreeDelivery ? "FREE (Within 2km)" : "₹50 (Standard Charge)"}`;
    msg += `\n💰 *Total Payable: ₹${isFreeDelivery ? totalAmount : totalAmount + DELIVERY_CHARGE}*`;

    window.open(`https://wa.me/917596042167?text=${encodeURIComponent(msg)}`, "_blank");
    setCart({}); setShowCustomerModal(false);
  };

  // --- STYLES ---
  const styles = {
    page: { maxWidth: 480, margin: "0 auto", padding: "20px", fontFamily: "sans-serif", backgroundColor: "#f9fafb", minHeight: "100vh" },
    header: { textAlign: "center", color: "#059669", fontSize: "32px", fontWeight: "800", marginBottom: "5px" },
    deliveryBanner: { backgroundColor: isFreeDelivery ? "#d1fae5" : "#ffedd5", color: isFreeDelivery ? "#065f46" : "#9a3412", padding: "12px", borderRadius: "10px", textAlign: "center", fontSize: "14px", fontWeight: "bold", marginBottom: "15px", border: "1px solid" },
    statusBadge: { backgroundColor: openNow ? "#dcfce7" : "#fee2e2", color: openNow ? "#166534" : "#991b1b", padding: "6px", borderRadius: "6px", textAlign: "center", fontSize: "12px", fontWeight: "bold", marginBottom: "15px" },
    search: { width: "100%", padding: "14px", borderRadius: "10px", border: "2px solid #d1d5db", marginBottom: "20px", boxSizing: "border-box", fontSize: "16px", color: "#111827" },
    card: { backgroundColor: "#ffffff", borderRadius: "15px", padding: "16px", marginBottom: "16px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", border: "1px solid #e5e7eb" },
    itemName: { color: "#111827", fontSize: "18px", margin: "0 0 10px 0", fontWeight: "bold" },
    priceLabel: { color: "#374151", fontWeight: "600", fontSize: "15px" },
    btn: { border: "none", width: "36px", height: "36px", borderRadius: "8px", cursor: "pointer", fontSize: "20px", fontWeight: "bold", color: "white" },
    footerCart: { position: "fixed", bottom: 20, left: "50%", transform: "translateX(-50%)", width: "90%", maxWidth: "400px", backgroundColor: "#059669", color: "white", padding: "16px", borderRadius: "15px", display: "flex", justifyContent: "space-between", alignItems: "center", fontWeight: "bold", cursor: "pointer", boxShadow: "0 10px 25px rgba(0,0,0,0.3)" }
  };

  // --- RENDER: CUSTOMER MODAL ---
  if (showCustomerModal) {
    return (
      <div style={styles.page}>
        <div style={{ background: "white", padding: "24px", borderRadius: "20px", border: "1px solid #ddd" }}>
          <h2 style={{ color: "#111827", marginTop: 0 }}>Checkout Details</h2>
          <div style={{ marginBottom: "20px", color: "#4b5563" }}>
            Total: ₹{totalAmount} {isFreeDelivery ? "(Free Delivery)" : "+ ₹50 Delivery"}
          </div>
          <input placeholder="Customer Name" style={styles.search} onChange={e => setCustomerDetails({...customerDetails, name: e.target.value})} />
          <input placeholder="10-digit Phone Number" type="tel" maxLength="10" style={styles.search} onChange={e => setCustomerDetails({...customerDetails, phone: e.target.value})} />
          <textarea placeholder="Delivery Address (Within 2km)" style={{...styles.search, height: "100px"}} onChange={e => setCustomerDetails({...customerDetails, address: e.target.value})} />
          <button onClick={placeOrder} style={{ width: "100%", padding: "16px", background: "#10b981", color: "white", border: "none", borderRadius: "10px", fontWeight: "bold", fontSize: "16px", cursor: "pointer" }}>Confirm & Order via WhatsApp</button>
          <button onClick={() => setShowCustomerModal(false)} style={{ width: "100%", marginTop: "15px", background: "none", border: "none", color: "#6b7280", fontWeight: "bold" }}>Cancel</button>
        </div>
      </div>
    );
  }

  // --- RENDER: MAIN PAGE ---
  return (
    <div style={styles.page}>
      <h1 style={styles.header}>Urban Thek</h1>
      <div style={styles.statusBadge}>
        {openNow ? "● OPEN UNTIL 11:00 PM" : "○ CLOSED - OPENS 9:00 AM"}
      </div>
      
      <div style={styles.deliveryBanner}>
        {isFreeDelivery 
          ? "🎉 You've unlocked FREE Delivery!" 
          : `🚚 Add ₹${MIN_ORDER_FREE_DELIVERY - totalAmount} more for FREE delivery`}
      </div>

      <input 
        type="text" 
        placeholder="🔍 Search for your favorite dish..." 
        style={styles.search} 
        onChange={(e) => setSearchTerm(e.target.value)} 
      />

      {filteredMenu.map((item) => (
        <div key={item.id} style={styles.card}>
          <div style={{ color: "#059669", fontSize: "12px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.5px" }}>{item.category}</div>
          <h3 style={styles.itemName}>{item.name}</h3>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {item.full && (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={styles.priceLabel}>Full: ₹{item.full}</span>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  {cart[`${item.id}_full`] > 0 && <button style={{...styles.btn, backgroundColor: "#ef4444"}} onClick={() => removeItem(item.id, "full")}>-</button>}
                  <span style={{ fontWeight: "bold", fontSize: "18px", color: "#111827", minWidth: "20px", textAlign: "center" }}>{cart[`${item.id}_full`] || 0}</span>
                  <button style={{...styles.btn, backgroundColor: "#10b981", opacity: openNow ? 1 : 0.5}} onClick={() => addItem(item.id, "full")}>+</button>
                </div>
              </div>
            )}
            {item.half && (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={styles.priceLabel}>Half: ₹{item.half}</span>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  {cart[`${item.id}_half`] > 0 && <button style={{...styles.btn, backgroundColor: "#ef4444"}} onClick={() => removeItem(item.id, "half")}>-</button>}
                  <span style={{ fontWeight: "bold", fontSize: "18px", color: "#111827", minWidth: "20px", textAlign: "center" }}>{cart[`${item.id}_half`] || 0}</span>
                  <button style={{...styles.btn, backgroundColor: "#3b82f6", opacity: openNow ? 1 : 0.5}} onClick={() => addItem(item.id, "half")}>+</button>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}

      <div style={{ height: "100px" }}></div> {/* Space for floating button */}

      {totalAmount > 0 && (
        <div style={styles.footerCart} onClick={() => setShowCustomerModal(true)}>
          <div>
            <div style={{ fontSize: "18px" }}>₹{isFreeDelivery ? totalAmount : totalAmount + DELIVERY_CHARGE}</div>
            <div style={{ fontSize: "11px", opacity: 0.9 }}>{isFreeDelivery ? "FREE Delivery" : "+₹50 Delivery Charge"}</div>
          </div>
          <span>Checkout →</span>
        </div>
      )}
    </div>
  );
}