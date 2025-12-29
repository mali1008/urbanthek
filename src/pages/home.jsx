import { useState } from "react";
import menu from "../menu";
import { useNavigate } from "react-router-dom";

const MIN_ORDER = 499;
const MAX_DELIVERY_KM = 2;

export default function Home() {
  const navigate = useNavigate();
  const [cart, setCart] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  const [showCartView, setShowCartView] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [customerDetails, setCustomerDetails] = useState({
    name: '',
    phone: '',
    address: '',
    notes: ''
  });

  // CART LOGIC (same)
  const addItem = (id, type = "full") => {
    const key = `${id}_${type}`;
    setCart((prev) => ({
      ...prev,
      [key]: (prev[key] || 0) + 1,
    }));
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

  const cartItems = menu.filter((item) =>
    cart[`${item.id}_full`] || cart[`${item.id}_half`]
  );

  const totalAmount = menu.reduce(
    (sum, item) =>
      sum +
      (cart[`${item.id}_full`] || 0) * (item.full || 0) +
      (cart[`${item.id}_half`] || 0) * (item.half || 0),
    0
  );
const filteredMenu = menu.filter(item =>
  item.name.toLowerCase().includes(searchTerm.toLowerCase())
);

  // IMPROVED WHATSAPP ORDER WITH DISTANCE + CONFIRMATION
  const placeOrder = () => {
    if (!customerDetails.name || !customerDetails.phone || !customerDetails.address) {
      alert("Please fill all customer details!");
      return;
    }
    if (totalAmount < MIN_ORDER) {
      alert(`Minimum order ₹${MIN_ORDER}`);
      return;
    }

    let msg = `*🍽️ Urban Thek Order*\n\n`;
    msg += `*👤 Customer:*\n`;
    msg += `Name: ${customerDetails.name}\n`;
    msg += `Phone: ${customerDetails.phone}\n`;
    msg += `Address: ${customerDetails.address}\n`;
    if (customerDetails.notes) msg += `Notes: ${customerDetails.notes}\n\n`;
    
    msg += `*🛒 Order Items:*\n`;
    cartItems.forEach((item) => {
      if (cart[`${item.id}_full`]) {
        msg += `• ${item.name} Full x${cart[`${item.id}_full`]} = ₹${item.full * cart[`${item.id}_full`]}\n`;
      }
      if (cart[`${item.id}_half`]) {
        msg += `• ${item.name} Half x${cart[`${item.id}_half`]} = ₹${item.half * cart[`${item.id}_half`]}\n`;
      }
    });
    
    msg += `\n💰 *Total: ₹${totalAmount}*\n`;
    msg += `🎉 FREE DELIVERY (₹499+ within 2km)\n\n`;
    msg += `📍 *Urban Thek*\nNear Akankha More Petrol Pump\nNew Town, Kolkata`;
    
    // Send to restaurant
    window.open(`https://wa.me/917596042167?text=${encodeURIComponent(msg)}`, "_blank");

    // ✅ CUSTOMER CONFIRMATION MESSAGE
    const confirmationMsg = `✅ *Order Confirmed! Thank you ${customerDetails.name}!*\n\n` +
      `📱 Order sent to Urban Thek\n` +
      `💰 Total: ₹${totalAmount}\n` +
      `🚚 FREE Delivery (within 2km)\n` +
      `⏰ Preparing now - will call soon!\n\n` +
      `📍 Urban Thek\nNear Akankha More Petrol Pump`;
    
    window.open(`https://wa.me/${customerDetails.phone}?text=${encodeURIComponent(confirmationMsg)}`, "_blank");

    // Clear everything
    setCart({});
    setCustomerDetails({ name: '', phone: '', address: '', notes: '' });
    setShowCustomerModal(false);
    setShowCartView(false);
    alert("✅ Order sent to restaurant + confirmation to customer! Thank you! 🥳");
  };

  // BUTTON STYLES (same perfect square buttons)
  const btnBase = {
    width: "40px",
    height: "40px",
    border: "none",
    borderRadius: "8px",
    fontSize: "20px",
    fontWeight: "bold",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "inherit",
    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
  };

  const fullBtn = { ...btnBase, background: "#10b981", color: "white" };
  const halfBtn = { ...btnBase, background: "#3b82f6", color: "white" };
  const removeBtn = { ...btnBase, background: "#ef4444", color: "white" };

  // OTHER STYLES
  const page = {
    maxWidth: 480,
    margin: "0 auto",
    padding: "20px",
    fontFamily: "system-ui, sans-serif",
  };

  const cartBar = {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    background: "#10b981",
    color: "#fff",
    padding: "14px 18px",
    display: "flex",
    justifyContent: "space-between",
    fontWeight: "700",
    cursor: "pointer",
    zIndex: 1000,
  };

  const menuCard = {
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: "16px",
    background: "#fff",
    marginBottom: "16px",
  };

  const qtyRow = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginTop: "8px",
    flexWrap: "wrap",
  };

  const qtyDisplay = {
  fontWeight: "bold",
  fontSize: "18px",
  minWidth: "40px",
  textAlign: "center",
  color: "#000000",           // 🔴 BLACK instead of gray
  backgroundColor: "#f0f9ff", // 🟢 Light blue background
  padding: "4px 8px",
  borderRadius: "6px"
};


  const deliveryBadge = {
    background: totalAmount >= MIN_ORDER ? "#10b981" : "#f59e0b",
    color: "white",
    padding: "8px 16px",
    borderRadius: "20px",
    fontSize: "14px",
    fontWeight: "600",
    textAlign: "center",
    marginBottom: "24px",
  };

  // Modal styles (same)
  const modalOverlay = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.7)",
    zIndex: 9999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
  };

  const modalContent = {
    background: "white",
    padding: "32px",
    borderRadius: "24px",
    maxWidth: "450px",
    width: "100%",
    maxHeight: "90vh",
    overflowY: "auto",
    boxShadow: "0 25px 50px rgba(0,0,0,0.25)",
  };

  const inputField = {
    width: "100%",
    padding: "14px",
    border: "2px solid #e5e7eb",
    borderRadius: "12px",
    fontSize: "16px",
    marginBottom: "16px",
    fontFamily: "inherit",
  };

  const textareaField = {
    ...inputField,
    resize: "vertical",
    minHeight: "80px",
  };

  // CUSTOMER MODAL (same structure)
  if (showCustomerModal) {
    return (
      <div style={page}>
        <div style={modalOverlay}>
          <div style={modalContent}>
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center", 
              marginBottom: "24px" 
            }}>
              <h2 style={{ margin: 0, color: "#1f2937", fontSize: "24px" }}>
                📍 Delivery Details (₹{totalAmount.toFixed(0)})
              </h2>
              <button 
                onClick={() => setShowCustomerModal(false)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "28px",
                  cursor: "pointer",
                  color: "#6b7280",
                }}
              >
                ×
              </button>
            </div>

            <div style={deliveryBadge}>
              {totalAmount >= MIN_ORDER 
                ? "🎉 FREE Delivery within 2km (₹499+)" 
                : `🚚 ₹50 delivery charge (add ₹${Math.ceil((MIN_ORDER - totalAmount) / 10) * 10} for FREE)`
              }
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#374151" }}>
                Full Name *
              </label>
              <input
                placeholder="Enter your full name"
                value={customerDetails.name}
                onChange={(e) => setCustomerDetails({ ...customerDetails, name: e.target.value })}
                style={inputField}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#374151" }}>
                Phone Number *
              </label>
              <input
                placeholder="Enter phone number (10 digits)"
                value={customerDetails.phone}
                onChange={(e) => setCustomerDetails({ ...customerDetails, phone: e.target.value })}
                style={inputField}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#374151" }}>
                Delivery Address *
              </label>
              <textarea
                placeholder="House no., Street, Landmark, Near Akankha More Petrol Pump"
                value={customerDetails.address}
                onChange={(e) => setCustomerDetails({ ...customerDetails, address: e.target.value })}
                style={textareaField}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#374151" }}>
                Order Notes (Optional)
              </label>
              <textarea
                placeholder="Extra spicy? Less oil?"
                value={customerDetails.notes}
                onChange={(e) => setCustomerDetails({ ...customerDetails, notes: e.target.value })}
                style={textareaField}
              />
            </div>

            <div style={{ display: "flex", gap: "16px", marginTop: "24px" }}>
              <button
                onClick={() => setShowCustomerModal(false)}
                style={{
                  flex: 1,
                  padding: "16px",
                  background: "#f3f4f6",
                  color: "#374151",
                  border: "none",
                  borderRadius: "12px",
                  fontSize: "16px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={placeOrder}
                disabled={!customerDetails.name || !customerDetails.phone || !customerDetails.address}
                style={{
                  flex: 1,
                  padding: "16px",
                  background: "#10b981",
                  color: "white",
                  border: "none",
                  borderRadius: "12px",
                  fontSize: "16px",
                  fontWeight: "700",
                  cursor: "pointer",
                  opacity: customerDetails.name && customerDetails.phone && customerDetails.address ? 1 : 0.6,
                }}
              >
                ✅ Confirm & Send Orders
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // CART VIEW (same perfect buttons)
  if (showCartView) {
    return (
      <div style={page}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
          paddingBottom: "16px",
          borderBottom: "2px solid #e5e7eb",
        }}>
          <h1 style={{ margin: 0, fontSize: "28px", color: "#1f2937" }}>
            🛒 Your Cart ({cartItems.length} items)
          </h1>
          <button
            onClick={() => setShowCartView(false)}
            style={{
              background: "#f3f4f6",
              color: "#374151",
              border: "none",
              padding: "12px 20px",
              borderRadius: "12px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            ← Back to Menu
          </button>
        </div>

        {cartItems.length === 0 ? (
          <div style={{ textAlign: "center", padding: "48px 20px", color: "#6b7280" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>🛒</div>
            <h3>Your cart is empty</h3>
            <p>Add items from menu to get started!</p>
          </div>
        ) : (
          <>
            {cartItems.map((item) => {
              const fullQty = cart[`${item.id}_full`] || 0;
              const halfQty = cart[`${item.id}_half`] || 0;
              
              return (
                <div key={item.id} style={menuCard}>
                  <h3 style={{ margin: "0 0 8px 0", fontSize: "20px" }}>{item.name}</h3>
                  <div style={{ color: "#6b7280", marginBottom: "12px", fontSize: "14px" }}>
                    {item.category}
                  </div>
                  
                  {fullQty > 0 && item.full && (
                    <div style={qtyRow}>
                      <span style={{ fontWeight: "600", minWidth: "80px" }}>
                        Full: ₹{item.full}
                      </span>
                      <button style={fullBtn} onClick={() => addItem(item.id, "full")}>+</button>
                      <span style={qtyDisplay}>{fullQty}</span>
                      <button style={removeBtn} onClick={() => removeItem(item.id, "full")}>-</button>
                    </div>
                  )}
                  
                  {halfQty > 0 && item.half && (
                    <div style={qtyRow}>
                      <span style={{
  fontWeight: "600",
  minWidth: "70px",
  fontSize: "16px",
  color: "#000000",           // 🔴 BLACK
  backgroundColor: "#f8fafc", // 🟢 Light gray
  padding: "4px 8px",
  borderRadius: "6px"
}}>
  Full: ₹{item.full}
</span>

                        
              
                      <button style={halfBtn} onClick={() => addItem(item.id, "half")}>+</button>
                      <span style={qtyDisplay}>{halfQty}</span>
                      <button style={removeBtn} onClick={() => removeItem(item.id, "half")}>-</button>
                    </div>
                  )}
                </div>
              );
            })}

            <div style={{
              background: "linear-gradient(135deg, #10b981, #059669)",
              color: "white",
              padding: "24px",
              borderRadius: "16px",
              textAlign: "center",
              marginTop: "24px",
            }}>
              <div style={{ fontSize: "28px", fontWeight: "800" }}>Total: ₹{totalAmount.toFixed(0)}</div>
              <div style={deliveryBadge}>
                {totalAmount >= MIN_ORDER 
                  ? "🎉 FREE Delivery within 2km" 
                  : `🚚 ₹50 delivery (add ₹${Math.ceil((MIN_ORDER - totalAmount) / 10) * 10} for FREE)`
                }
              </div>
            </div>

            <button
              style={{
                width: "100%",
                background: totalAmount >= MIN_ORDER ? "#10b981" : "#9ca3af",
                color: "white",
                padding: "20px",
                borderRadius: "16px",
                border: "none",
                fontSize: "20px",
                fontWeight: "700",
                cursor: totalAmount >= MIN_ORDER ? "pointer" : "not-allowed",
                marginTop: "20px",
              }}
              onClick={() => setShowCustomerModal(true)}
              disabled={totalAmount < MIN_ORDER}
            >
              {totalAmount >= MIN_ORDER ? "📝 Enter Delivery Details" : `Minimum ₹${MIN_ORDER}`}
            </button>
          </>
        )}
      </div>
    );
  }

  // MAIN MENU VIEW
  return (
    <div style={page}>
      <h1 style={{ textAlign: "center", color: "#10b981", marginBottom: "20px", fontSize: "32px" }}>
        🍽️ Urban Thek
        <input
  type="text"
  placeholder="🔍 Search dishes..."
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
  style={{
    width: "100%",
    padding: "14px",
    borderRadius: "12px",
    border: "2px solid #e5e7eb",
    fontSize: "16px",
    marginBottom: "16px",
    fontFamily: "inherit",
  }}
/>

      </h1>
      
      <div style={deliveryBadge}>
        {totalAmount >= MIN_ORDER 
          ? "🎉 FREE Home Delivery within 2km (₹499+)" 
          : `🚚 Delivery ₹50 | FREE for ₹${MIN_ORDER}+ within 2km`
        }
      </div>

      <p style={{ textAlign: "center", color: "#6b7280", marginBottom: "24px" }}>
        Multicuisine • Near Akankha More Petrol Pump • New Town
      </p>

      {filteredMenu.map((item) => (

        <div key={item.id} style={menuCard}>
          {item.category !== menu[menu.length - 1]?.category && (
            <div style={{
              background: "#f3f4f6",
              padding: "8px 12px",
              borderRadius: "8px",
              margin: "-16px -16px 12px -16px",
              fontSize: "14px",
              fontWeight: "600",
              color: "#374151",
            }}>
              {item.category}
            </div>
          )}
          
          <h3 style={{ margin: "0 0 12px 0", fontSize: "18px", color: "#1f2937" }}>
            {item.name}
          </h3>

          <div style={qtyRow}>
            {item.full && (
              <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1 }}>
                <span style={{
  fontWeight: "600",
  minWidth: "80px",
  color: "#000000",
  backgroundColor: "#f1f5f9",
  padding: "4px 8px",
  borderRadius: "6px"
}}>
  Full: ₹{item.full}
</span>

                  
                <button style={fullBtn} onClick={() => addItem(item.id, "full")}>+</button>
                <span style={qtyDisplay}>{cart[`${item.id}_full`] || 0}</span>
                {cart[`${item.id}_full`] > 0 && (
                  <button style={removeBtn} onClick={() => removeItem(item.id, "full")}>-</button>
                )}
              </div>
            )}
            
            {item.half && (
              <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1 }}>
                <span style={{ fontWeight: "600", minWidth: "70px", fontSize: "16px" }}>
                  Half: ₹{item.half}
                </span>
                <button style={halfBtn} onClick={() => addItem(item.id, "half")}>+</button>
                <span style={qtyDisplay}>{cart[`${item.id}_half`] || 0}</span>
                {cart[`${item.id}_half`] > 0 && (
                  <button style={removeBtn} onClick={() => removeItem(item.id, "half")}>-</button>
                )}
              </div>
            )}
          </div>
        </div>
      ))}

      {totalAmount > 0 && (
        <div style={cartBar} onClick={() => setShowCartView(true)}>
          <strong>₹{totalAmount.toFixed(0)}</strong>
          <span>{cartItems.length} items • <span style={{ textDecoration: "underline" }}>View Cart</span></span>
        </div>
      )}
    </div>
  );
}
