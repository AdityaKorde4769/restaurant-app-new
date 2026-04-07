import React, { useEffect, useState, useRef } from "react";

function App() {
  const [foods, setFoods] = useState([]);
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [orders, setOrders] = useState([]);
  const [showOrders, setShowOrders] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
const orderRef = useRef(null);
  const [user, setUser] = useState(null);
  const [isSignup, setIsSignup] = useState(false);

  // 🍛 Load foods
  useEffect(() => {
    fetch("/api/foods")
      .then(res => res.json())
      .then(data => setFoods(data));
  }, []);

  // 📜 Fetch Orders
  const fetchOrders = (userId) => {
    fetch(`/api/order/${userId}`)
      .then(res => res.json())
      .then(data => {
        setOrders(data);
      });
  };

  // 🛒 Add to cart
  const addToCart = (food) => {
    const existing = cart.find(item => item.id === food.id);

    if (existing) {
      const updated = cart.map(item =>
        item.id === food.id
          ? { ...item, qty: item.qty + 1 }
          : item
      );
      setCart(updated);
    } else {
      setCart([...cart, { ...food, qty: 1 }]);
    }

    setTotal(prev => prev + food.price);
  };

  const increaseQty = (id) => {
    const item = cart.find(i => i.id === id);
    const updated = cart.map(i =>
      i.id === id ? { ...i, qty: i.qty + 1 } : i
    );
    setCart(updated);
    setTotal(prev => prev + item.price);
  };

  const decreaseQty = (id) => {
    const item = cart.find(i => i.id === id);

    if (item.qty === 1) {
      removeItem(id);
    } else {
      const updated = cart.map(i =>
        i.id === id ? { ...i, qty: i.qty - 1 } : i
      );
      setCart(updated);
      setTotal(prev => prev - item.price);
    }
  };

  const removeItem = (id) => {
    const item = cart.find(i => i.id === id);
    const updated = cart.filter(i => i.id !== id);

    setCart(updated);
    setTotal(prev => prev - item.price * item.qty);
  };

  // 🔐 Login
  const handleLogin = () => {
    fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    })
      .then(res => res.json())
      .then(data => {
        if (data.id) {
          setUser(data);
          fetchOrders(data.id);
        } else {
          alert("Invalid login");
        }
      });
  };

  // 🧾 Signup
  const handleSignup = () => {
    fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    })
      .then(res => res.text())
      .then(msg => {
        alert(msg);
        setIsSignup(false);
      });
  };

  // 💳 Order
  const placeOrder = () => {
    fetch("/api/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: user.id,
        cart,
        total
      })
    })
      .then(res => res.text())
      .then(msg => {
        alert(msg);
        setCart([]);
        setTotal(0);
        fetchOrders(user.id);
      });
  };

  const logout = () => {
    setUser(null);
    setCart([]);
    setTotal(0);
    setOrders([]);
  };

  const inputStyle = {
    padding: "10px",
    margin: "5px",
    width: "200px",
    borderRadius: "5px",
    border: "1px solid #ccc"
  };

  const buttonStyle = {
    padding: "10px 20px",
    backgroundColor: "#ff6b6b",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "10px"
  };

const navButton = {
  padding: "6px 12px",
  backgroundColor: "#fff",
  color: "#ff6b6b",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  marginLeft: "5px",
  fontWeight: "bold"
};

  return (
    <div style={{
      textAlign: "center",
      backgroundColor: "#f8f9fa",
      minHeight: "100vh"
    }}>

      {/* 🔝 NAVBAR */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 20px",
        backgroundColor: "#ff6b6b",
        color: "#fff"
      }}>
        <h2>🍽️ Indian Restaurant</h2>

        {!user ? (
          <div>
            <input
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              style={{ marginRight: "5px", padding: "5px" }}
            />
            <input
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              style={{ marginRight: "5px", padding: "5px" }}
            />

            <button onClick={handleLogin} style={navButton}>Login</button>

            <button onClick={() => setIsSignup(!isSignup)} style={navButton}>
              {isSignup ? "Login" : "Create Account"}
            </button>
          </div>
        ) : (
          <div>
            <span style={{ marginRight: "10px" }}>
              Welcome {user.name}
            </span>

<button
  onClick={() => {
    setShowOrders(!showOrders);

    setTimeout(() => {
      orderRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 200);
  }}
  style={navButton}
>
  {showOrders ? "Hide Orders" : "View Orders"}
</button>
            <button onClick={logout} style={navButton}>
              Logout
            </button>
          </div>
        )}
      </div>

      {/* 🍛 MENU */}
      <h2 style={{ marginTop: "20px" }}>Menu</h2>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "20px",
        padding: "20px"
      }}>
        {foods.map(food => (
          <div key={food.id} style={{
            border: "1px solid #ddd",
            borderRadius: "10px",
            padding: "15px",
            backgroundColor: "#fff",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
          }}>
            <img src={food.image} alt={food.name} style={{
              width: "100%",
              height: "150px",
              objectFit: "cover",
              borderRadius: "10px"
            }} />

            <h3>{food.name}</h3>
            <p>₹{food.price}</p>

            <button
              onClick={() => {
                if (!user) return alert("Please login first");
                addToCart(food);
              }}
              style={buttonStyle}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      {/* 🛒 CART */}
      <h2>Cart</h2>

      <div style={{
        maxWidth: "400px",
        margin: "auto",
        background: "#fff",
        padding: "15px",
        borderRadius: "10px"
      }}>
        {cart.length === 0 && <p>No items</p>}

        {cart.map(item => (
          <div key={item.id} style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "10px"
          }}>
            <span>{item.name}</span>

            <div>
              <button onClick={() => decreaseQty(item.id)}>-</button>
              <span style={{ margin: "0 10px" }}>{item.qty}</span>
              <button onClick={() => increaseQty(item.id)}>+</button>
            </div>

            <span>₹{item.price * item.qty}</span>
            <button onClick={() => removeItem(item.id)}>❌</button>
          </div>
        ))}

        <h3>Total: ₹{total}</h3>

        {user && cart.length > 0 && (
          <button onClick={placeOrder} style={buttonStyle}>
            Checkout
          </button>
        )}
      </div>

      {/* 📜 ORDER HISTORY */}
      {user && showOrders && (
<div ref={orderRef} style={{ marginTop: "40px" }}>
          <h2>Order History</h2>

          {orders.length === 0 && <p>No orders yet</p>}

          {orders.map((o, i) => (
            <div key={i}>
              Order #{o.order_id} - {o.food_name} x{o.quantity} (₹{o.total})
            </div>
          ))}
        </div>
      )}

      {/* 📌 FOOTER */}
      <hr style={{ marginTop: "50px" }} />
      <p style={{ color: "#888" }}>
        © 2026 AWS Deployment By AK 🚀
      </p>

    </div>
  );
}

export default App;
