import { useEffect, useState } from "react";
import axios from "axios";
import "./Invoice.css";

function Invoice({ billId, onBack }) {
  const [invoice, setInvoice] = useState(null);
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInvoice = async () => {
      try {
        const [invoiceRes, hotelRes] = await Promise.all([
          axios.get(
            `http://localhost:5000/api/billing/invoice/${billId}`
          ),
          axios.get(
            "http://localhost:5000/api/hotel"
          ),
        ]);

        setInvoice(invoiceRes.data);
        setHotel(hotelRes.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    loadInvoice();
  }, [billId]);

  if (loading) {
    return (
      <div className="invoice-page">
        <h2>Loading Invoice...</h2>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="invoice-page">
        <h2>Invoice not found</h2>

        <button onClick={onBack}>
          Back
        </button>
      </div>
    );
  }

  return (
    <div className="invoice-page">

      <div className="invoice-actions">
        <button
          className="invoice-back-btn"
          onClick={onBack}
        >
          ← Back
        </button>

        <button
          className="print-btn"
          onClick={() => window.print()}
        >
          🖨 Print Invoice
        </button>
      </div>

      <div className="invoice">

        <div className="invoice-header">

          <div>
            <h1>
              {hotel?.hotel_name || "Hotel"}
            </h1>

            <p>
              {hotel?.address || ""}
            </p>

            <p>
              GSTIN: {hotel?.gst || "Not Available"}
            </p>

            {hotel?.email && (
              <p>
                {hotel.email}
              </p>
            )}
          </div>

          <div className="invoice-title">
            <h2>INVOICE</h2>

            <p>
              <strong>
                {invoice.invoice_no}
              </strong>
            </p>

            <span className="paid-badge">
              {invoice.payment_status}
            </span>
          </div>

        </div>

        <div className="invoice-info">

          <div>
            <span>Order</span>
            <strong>
              #{invoice.order_id}
            </strong>
          </div>

          <div>
            <span>Token</span>
            <strong>
              #{invoice.token_no}
            </strong>
          </div>

          <div>
            <span>Date</span>
            <strong>
              {new Date(
                invoice.created_at
              ).toLocaleDateString("en-IN")}
            </strong>
          </div>

          <div>
            <span>Payment</span>
            <strong>
              {invoice.payment_method || "Pending"}
            </strong>
          </div>

        </div>

        <table className="invoice-table">

          <thead>
            <tr>
              <th>Item</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Amount</th>
            </tr>
          </thead>

          <tbody>

            {invoice.items.map((item) => (
              <tr key={item.item_id}>

                <td>
                  {item.item_name}
                </td>

                <td>
                  {item.quantity}
                </td>

                <td>
                  ₹{item.price}
                </td>

                <td>
                  ₹{item.amount}
                </td>

              </tr>
            ))}

          </tbody>

        </table>

        <div className="invoice-summary">

          <div>
            <span>Subtotal</span>
            <strong>
              ₹{invoice.subtotal}
            </strong>
          </div>

          <div>
            <span>GST (18%)</span>
            <strong>
              ₹{invoice.gst}
            </strong>
          </div>

          <div className="invoice-grand-total">
            <span>Total</span>
            <strong>
              ₹{invoice.total}
            </strong>
          </div>

        </div>

        <div className="invoice-footer">

          <h3>
            Thank you for dining with us!
          </h3>

          <p>
            This is a computer-generated invoice.
          </p>

        </div>

      </div>

    </div>
  );
}

export default Invoice;