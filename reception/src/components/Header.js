import { useState } from "react";

function Header({ user, readyOrders, onAcknowledge, lastToken }) {
  const [showReadyOrders, setShowReadyOrders] = useState(false);

  return (
    <div className="header">
      <div>
        <h2>Hotel POS</h2>
        <p>Reception Panel</p>
      </div>

      <div className="token-box">
  <span>Last Token</span>
  <h2>#{lastToken || "—"}</h2>
</div>

      <div className="header-right">
        <div className="ready-wrapper">
          <button
            className={
              readyOrders.length > 0
                ? "ready-indicator active"
                : "ready-indicator"
            }
            onClick={() => setShowReadyOrders(!showReadyOrders)}
          >
            🔔 {readyOrders.length} Ready
          </button>

          {showReadyOrders && (
            <div className="ready-dropdown">
              <h4>Ready Orders</h4>

              {readyOrders.length === 0 ? (
                <p className="no-ready-orders">
                  No orders are ready
                </p>
              ) : (
                readyOrders.map((order) => (
                  <div
                    className="ready-order"
                    key={order.order_id}
                  >
                    <strong>
                      Token #{order.token_no}
                    </strong>

                    <span>Ready</span>

                    <button
  onClick={() => onAcknowledge(order.order_id)}
>
  Acknowledge
</button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <div className="user-box">
          {user.full_name}
        </div>
      </div>
    </div>
  );
}

export default Header;