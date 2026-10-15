import { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import "../App.css";

function KitchenDashboard() {
  const [orders, setOrders] = useState([]);

  const loadOrders = () => {
    axios
      .get("http://localhost:5000/api/kitchen/orders")
      .then((res) => setOrders(res.data))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    loadOrders();

    const socket = io("http://localhost:5000");

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    socket.on("connect_error", (error) => {
      console.log("Socket connection error:", error.message);
    });

    socket.on("newOrder", () => {
      loadOrders();
    });

    socket.on("orderStatusUpdated", () => {
      loadOrders();
    });

socket.on("newOrder", () => {
  loadOrders();
});

socket.on("orderStatusUpdated", () => {
  loadOrders();
});

socket.on("orderAcknowledged", (data) => {
  console.log("Order acknowledged:", data);
  loadOrders();
});

    return () => {
      socket.disconnect();
    };
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/status/${id}`,
        { status }
      );

      loadOrders();
    } catch (err) {
      console.log(err);
    }
  };

  const getWaitingTime = (createdAt) => {
    const created = new Date(createdAt);
    const now = new Date();

    const minutes = Math.floor((now - created) / 60000);

    if (minutes < 1) {
      return "Waiting: < 1 min";
    }

    return `Waiting: ${minutes} min`;
  };

  return (
    <div className="kitchen">

      <div className="header">
        <div>
          <h2>Kitchen Display</h2>
          <p>Main Kitchen</p>
        </div>

        <div className="live">● LIVE</div>
      </div>

      <div className="columns">

        {/* NEW */}
        <div className="column">
          <h3>NEW</h3>

          {orders
            .filter((order) => order.status === "New")
            .map((order) => (
              <div className="order-card" key={order.order_id}>

                <div className="top">
                  <h2>#{order.token_no}</h2>
                </div>

                <p className="order-time">
                  {new Date(order.created_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>

                <p className="waiting-time">
                  {getWaitingTime(order.created_at)}
                </p>

                {order.items.map((item) => (
  <div key={item.item_id}>
    <p>
      {item.item_name} × {item.quantity}
    </p>

    {item.note && (
      <small>📝 {item.note}</small>
    )}
  </div>
))}

                <button
                  onClick={() =>
                    updateStatus(order.order_id, "Preparing")
                  }
                >
                  Preparing
                </button>

              </div>
            ))}
        </div>

        {/* PREPARING */}
        <div className="column">
          <h3>PREPARING</h3>

          {orders
            .filter((order) => order.status === "Preparing")
            .map((order) => (
              <div className="order-card" key={order.order_id}>

                <div className="top">
                  <h2>#{order.token_no}</h2>
                </div>

                <p className="order-time">
                  {new Date(order.created_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>

                <p className="waiting-time">
                  {getWaitingTime(order.created_at)}
                </p>

                {order.items.map((item) => (
                  <p key={item.item_id}>
                    {item.item_name} × {item.quantity}
                  </p>
                ))}

                <button
                  onClick={() =>
                    updateStatus(order.order_id, "Ready")
                  }
                >
                  Ready
                </button>

              </div>
            ))}
        </div>

        {/* READY */}
        <div className="column">
          <h3>READY</h3>

          {orders
            .filter((order) => order.status === "Ready")
            .map((order) => (
              <div className="order-card" key={order.order_id}>

                <div className="top">
                  <h2>#{order.token_no}</h2>
                </div>

                <p className="order-time">
                  {new Date(order.created_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>

                <p className="waiting-time">
                  {getWaitingTime(order.created_at)}
                </p>

                {order.items.map((item) => (
                  <p key={item.item_id}>
                    {item.item_name} × {item.quantity}
                  </p>
                ))}

              </div>
            ))}
        </div>

      </div>
    </div>
  );
}

export default KitchenDashboard;