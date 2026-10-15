import { useEffect, useState } from "react";
import axios from "axios";
import Invoice from "./Invoice";

function Billing() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [bill, setBill] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("");
const [showInvoice, setShowInvoice] = useState(false);
  const loadOrders = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/billing/orders"
      );

      setOrders(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const selectOrder = async (order) => {
    setSelectedOrder(order);
    setPaymentMethod("");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/billing",
        {
          order_id: order.order_id,
        }
      );

      setBill(res.data);
    } catch (err) {
      console.log(err);
      setBill(null);
    }
  };

  const payBill = async () => {
    if (!paymentMethod) {
      alert("Please select a payment method");
      return;
    }

    try {
      const res = await axios.patch(
        "http://localhost:5000/api/billing/pay",
        {
          bill_id: bill.bill_id,
          payment_method: paymentMethod,
        }
      );

      setBill({
  ...bill,
  ...res.data,
});

loadOrders();

setShowInvoice(true);
    } catch (err) {
      console.log(err);
      alert("Payment failed");
    }
  };

if (showInvoice && bill) {
  return (
    <Invoice
      billId={bill.bill_id}
      onBack={() => setShowInvoice(false)}
    />
  );
}

  return (
    <div className="billing-page">

      <div className="billing-header">
        <div>
          <h2>Billing</h2>
          <p>Completed orders and payments</p>
        </div>
      </div>

      <div className="billing-layout">

        <div className="billing-orders-section">

          <h3>Completed Orders</h3>

          <div className="billing-orders">

            {orders.map((order) => (
              <div
                className={`billing-order-card ${
                  selectedOrder?.order_id === order.order_id
                    ? "selected"
                    : ""
                }`}
                key={order.order_id}
                onClick={() => selectOrder(order)}
              >

                <div className="order-card-top">

                  <strong>
                    Token #{order.token_no}
                  </strong>

                  <span>
                    ₹{order.total}
                  </span>

                </div>

                <p>
                  Order #{order.order_id}
                </p>

              </div>
            ))}

          </div>

        </div>

        <div className="bill-panel">

          {!selectedOrder && (
            <div className="empty-bill">

              <div className="empty-icon">
                ₹
              </div>

              <h3>
                Select an Order
              </h3>

              <p>
                Select a completed order to view the bill.
              </p>

            </div>
          )}

          {selectedOrder && !bill && (
            <div className="empty-bill">

              <h3>
                Loading Bill...
              </h3>

            </div>
          )}

          {selectedOrder && bill && (
            <>

              <div className="bill-panel-header">

                <div>

                  <span>
                    Current Bill
                  </span>

                  <h2>
                    Token #{selectedOrder.token_no}
                  </h2>

                </div>

                <span className="order-number">
                  #{selectedOrder.order_id}
                </span>

              </div>

              <div className="bill-summary">

                <div>
                  <span>
                    Subtotal
                  </span>

                  <strong>
                    ₹{bill.subtotal}
                  </strong>
                </div>

                <div>
                  <span>
                    GST (18%)
                  </span>

                  <strong>
                    ₹{bill.gst}
                  </strong>
                </div>

              </div>

              <div className="bill-total-row">

                <span>
                  Total
                </span>

                <strong>
                  ₹{bill.total}
                </strong>

              </div>

              {bill.payment_status !== "Paid" && (
                <div className="payment-section">

                  <h3>
                    Payment Method
                  </h3>

                  <div className="payment-methods">

                    <button
                      className={
                        paymentMethod === "Cash"
                          ? "payment-btn active"
                          : "payment-btn"
                      }
                      onClick={() =>
                        setPaymentMethod("Cash")
                      }
                    >
                      Cash
                    </button>

                    <button
                      className={
                        paymentMethod === "UPI"
                          ? "payment-btn active"
                          : "payment-btn"
                      }
                      onClick={() =>
                        setPaymentMethod("UPI")
                      }
                    >
                      UPI
                    </button>

                    <button
                      className={
                        paymentMethod === "Card"
                          ? "payment-btn active"
                          : "payment-btn"
                      }
                      onClick={() =>
                        setPaymentMethod("Card")
                      }
                    >
                      Card
                    </button>

                  </div>

                  <button
                    className="pay-btn"
                    onClick={payBill}
                  >
                    Pay ₹{bill.total}
                  </button>

                </div>
              )}

              {bill.payment_status === "Paid" && (
                <div className="payment-success">

                  <div className="success-icon">
                    ✓
                  </div>

                  <h3>
                    Payment Successful
                  </h3>

                  <p>
                    Invoice: {bill.invoice_no}
                  </p>

                  <p>
                    Payment: {bill.payment_method}
                  </p>

                  <span>
                    PAID
                  </span>

                </div>
              )}

            </>
          )}

        </div>

      </div>

    </div>
  );
}

export default Billing;