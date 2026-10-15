import { useState } from "react";
import axios from "axios";

function Cart({ cart, user, clearCart,updateCartQuantity, onOrderSent }) {
  const [notes, setNotes] = useState({});
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const subtotal = cart.reduce(
    (sum, item) => sum + Number(item.price) * item.qty,
    0
  );

  const gst = +(subtotal * 0.18).toFixed(2);
  const total = subtotal + gst;

  const sendOrder = async () => {
    if (!cart.length || sending) return;

    setSending(true);
    setFeedback(null);

    const orderCart = cart.map((item) => ({
      ...item,
      note: notes[item.item_id] || ""
    }));

    try {
      const res = await axios.post(
        "http://localhost:5000/api/orders",
        {
          created_by: user.user_id,
          cart: orderCart
        }
      );

      onOrderSent(res.data.token_no);
      clearCart();
      setNotes({});
      setFeedback({
        type: "success",
        message: `Order sent to the kitchen. Token #${res.data.token_no}.`
      });
    } catch (err) {
      setFeedback({
        type: "error",
        message: err.response?.data?.message || "Could not send the order. Please try again."
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="cart">
      <h3>Current Order</h3>

      {cart.map((item) => (
        <div className="cart-item" key={item.item_id}>
          <div>
            <div className="cart-item-name">
  <div>{item.item_name}</div>

  <div className="quantity-controls">
    <button
      type="button"
      onClick={() => updateCartQuantity(item.item_id, -1)}
    >
      −
    </button>

    <span>{item.qty}</span>

    <button
      type="button"
      onClick={() => updateCartQuantity(item.item_id, 1)}
    >
      +
    </button>
  </div>
</div>

            <input
              id={`order-note-${item.item_id}`}
              type="text"
              aria-label={`Note for ${item.item_name}`}
              placeholder="Add note"
              value={notes[item.item_id] || ""}
              onChange={(e) =>
                setNotes({
                  ...notes,
                  [item.item_id]: e.target.value
                })
              }
            />
          </div>

          <span>
            ₹{Number(item.price) * item.qty}
          </span>
        </div>
      ))}

      <hr />

      <p>Subtotal ₹{subtotal}</p>
      <p>GST 18% ₹{gst}</p>
      <h2>Total ₹{total}</h2>

      {feedback && (
        <p className={`cart-feedback ${feedback.type}`} role="status" aria-live="polite">
          {feedback.message}
        </p>
      )}

      <button
  className="send-btn"
  onClick={sendOrder}
  disabled={cart.length === 0 || sending}
>
  {sending ? "Sending…" : "Send to Kitchen"}
</button>
    </div>
  );
}

export default Cart;
