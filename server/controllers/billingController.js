const db = require("../config/db");

exports.createBill = (req, res) => {
  const { order_id } = req.body;

  if (!order_id) {
    return res.status(400).json({
      success: false,
      message: "Order ID is required",
    });
  }

  // Check if bill already exists
  const existingBillSql = `
    SELECT
      bill_id,
      order_id,
      invoice_no,
      subtotal,
      gst,
      total,
      payment_method,
      payment_status,
      paid_at
    FROM bills
    WHERE order_id = ?
  `;

  db.query(existingBillSql, [order_id], (err, bills) => {
    if (err) {
      return res.status(500).json(err);
    }

    // Bill already exists
    if (bills.length > 0) {
      const bill = bills[0];

      return res.json({
        success: true,
        bill_id: bill.bill_id,
        invoice_no: bill.invoice_no,
        order_id: bill.order_id,
        subtotal: bill.subtotal,
        gst: bill.gst,
        total: bill.total,
        payment_method: bill.payment_method,
        payment_status: bill.payment_status,
        paid_at: bill.paid_at,
        existing: true,
      });
    }

    // Get order details
    const orderSql = `
      SELECT
        order_id,
        subtotal,
        gst,
        total
      FROM orders
      WHERE order_id = ?
    `;

    db.query(orderSql, [order_id], (err, orders) => {
      if (err) {
        return res.status(500).json(err);
      }

      if (orders.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }

      const order = orders[0];

      const invoiceNo = `INV-${Date.now()}`;

      const billSql = `
        INSERT INTO bills
        (
          order_id,
          invoice_no,
          subtotal,
          gst,
          total
        )
        VALUES (?, ?, ?, ?, ?)
      `;

      db.query(
        billSql,
        [
          order.order_id,
          invoiceNo,
          order.subtotal,
          order.gst,
          order.total,
        ],
        (err, result) => {
          if (err) {
            return res.status(500).json(err);
          }

          res.json({
            success: true,
            bill_id: result.insertId,
            invoice_no: invoiceNo,
            order_id: order.order_id,
            subtotal: order.subtotal,
            gst: order.gst,
            total: order.total,
            payment_method: null,
            payment_status: "Pending",
            paid_at: null,
            existing: false,
          });
        }
      );
    });
  });
};

exports.payBill = (req, res) => {
  const { bill_id, payment_method } = req.body;

  if (!bill_id || !payment_method) {
    return res.status(400).json({
      success: false,
      message: "Bill ID and payment method are required",
    });
  }

  const sql = `
    UPDATE bills
    SET
      payment_method = ?,
      payment_status = 'Paid',
      paid_at = NOW()
    WHERE bill_id = ?
  `;

  db.query(
    sql,
    [payment_method, bill_id],
    (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "Bill not found",
        });
      }

      res.json({
        success: true,
        message: "Payment successful",
        bill_id,
        payment_method,
        payment_status: "Paid",
      });
    }
  );
};

exports.getCompletedOrders = (req, res) => {
  const sql = `
    SELECT
      order_id,
      token_no,
      subtotal,
      gst,
      total,
      created_at
    FROM orders
    WHERE acknowledged_at IS NOT NULL
    ORDER BY order_id DESC
  `;

  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json(result);
  });
};

exports.getInvoice = (req, res) => {
  const { bill_id } = req.params;

  const billSql = `
    SELECT
      b.bill_id,
      b.invoice_no,
      b.subtotal,
      b.gst,
      b.total,
      b.payment_method,
      b.payment_status,
      b.paid_at,
      o.order_id,
      o.token_no,
      o.created_at
    FROM bills b
    JOIN orders o ON b.order_id = o.order_id
    WHERE b.bill_id = ?
  `;

  db.query(billSql, [bill_id], (err, bills) => {
    if (err) {
      return res.status(500).json(err);
    }

    if (bills.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found",
      });
    }

    const bill = bills[0];

    const itemsSql = `
      SELECT
        oi.item_id,
        m.item_name,
        oi.quantity,
        oi.price,
        (oi.quantity * oi.price) AS amount
      FROM order_items oi
      JOIN menu_items m ON oi.item_id = m.item_id
      WHERE oi.order_id = ?
      ORDER BY oi.item_id
    `;

    db.query(itemsSql, [bill.order_id], (err, items) => {
      if (err) {
        return res.status(500).json(err);
      }

      res.json({
        ...bill,
        items,
      });
    });
  });
};
