import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";

import Header from "../components/Header";
import CategoryBar from "../components/CategoryBar";
import MenuGrid from "../components/MenuGrid";
import Cart from "../components/Cart";
import Billing from "../components/Billing";

import "../App.css";

function ReceptionDashboard({ user }) {
  const [cart, setCart] = useState([]);
  const [page, setPage] = useState("pos");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [readyOrders, setReadyOrders] = useState([]);
  const [lastToken, setLastToken] = useState(null);

  useEffect(() => {
    const loadReadyOrders = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/orders/ready"
        );
        setReadyOrders(res.data);
      } catch (err) {
        console.log("Failed to load ready orders:", err);
      }
    };

    loadReadyOrders();

    const socket = io("http://localhost:5000");

    socket.on("orderStatusUpdated", (data) => {
      if (data.status === "Ready") {
        setReadyOrders((orders) => {
          if (orders.some((order) => order.order_id === data.order_id)) {
            return orders;
          }

          return [
            ...orders,
            {
              order_id: data.order_id,
              token_no: data.token_no,
              status: "Ready"
            }
          ];
        });
      }
    });

    socket.on("orderAcknowledged", (data) => {
      setReadyOrders((orders) =>
        orders.filter((order) => order.order_id !== data.order_id)
      );
    });

    return () => socket.disconnect();
  }, []);

  const addToCart = (item) => {
    const existing = cart.find((p) => p.item_id === item.item_id);

    if (existing) {
      setCart(
        cart.map((p) =>
          p.item_id === item.item_id
            ? { ...p, qty: p.qty + 1 }
            : p
        )
      );
    } else {
      setCart([...cart, { ...item, qty: 1 }]);
    }
  };

  const updateCartQuantity = (itemId, change) => {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.item_id === itemId
            ? { ...item, qty: item.qty + change }
            : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  const acknowledgeReadyOrder = async (orderId) => {
    try {
      const res = await axios.post(
        `http://localhost:5000/api/orders/${orderId}/acknowledge`,
        { acknowledged_by: user.user_id }
      );

      if (res.data.success) {
        setReadyOrders((orders) =>
          orders.filter((order) => order.order_id !== orderId)
        );
      }
    } catch (err) {
      alert(
        err.response?.data?.message ||
        "Failed to acknowledge order"
      );
    }
  };

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <h2>HOTEL POS</h2>
          <span>Reception</span>
        </div>

        <nav>
          <button
            className={page === "pos" ? "nav-item active" : "nav-item"}
            onClick={() => setPage("pos")}
          >
            POS
          </button>

          <button
            className={page === "billing" ? "nav-item active" : "nav-item"}
            onClick={() => setPage("billing")}
          >
            Billing
          </button>
        </nav>
      </aside>

      <main className="main-content">
        <Header
          user={user}
          readyOrders={readyOrders}
          onAcknowledge={acknowledgeReadyOrder}
          lastToken={lastToken}
        />

        {page === "pos" && (
          <div className="pos-layout">
            <section className="pos-content">
              <CategoryBar
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
              />

              <MenuGrid
                addToCart={addToCart}
                selectedCategory={selectedCategory}
              />
            </section>

            <Cart
              cart={cart}
              user={user}
              clearCart={() => setCart([])}
              updateCartQuantity={updateCartQuantity}
              onOrderSent={(token) => setLastToken(token)}
            />
          </div>
        )}

        {page === "billing" && <Billing />}
      </main>
    </div>
  );
}

export default ReceptionDashboard;