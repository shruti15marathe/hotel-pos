const db = require("../config/db");
const { getIO } = require("../socket");

// CREATE ORDER
exports.createOrder = (req, res) => {
  const { cart } = req.body;
  const created_by = req.user.user_id;

  const tokenSql =
    "SELECT IFNULL(MAX(token_no),1000)+1 AS token FROM orders";

  db.query(tokenSql, (err, tokenResult) => {
    if (err) {
      return res.status(500).json(err);
    }

    const token = tokenResult[0].token;

    const subtotal = cart.reduce(
      (sum, item) => sum + Number(item.price) * item.qty,
      0
    );

    const gst = +(subtotal * 0.18).toFixed(2);
    const total = subtotal + gst;

    const orderSql = `
      INSERT INTO orders
      (token_no, created_by, subtotal, gst, total)
      VALUES (?,?,?,?,?)
    `;

    db.query(
      orderSql,
      [token, created_by, subtotal, gst, total],
      (err, orderResult) => {
        if (err) {
          return res.status(500).json(err);
        }

        const orderId = orderResult.insertId;

        const values = cart.map((i) => [
          orderId,
          i.item_id,
          i.qty,
          i.price,
          i.note || ""
        ]);

        db.query(
          "INSERT INTO order_items (order_id,item_id,quantity,price,note) VALUES ?",
          [values],
          (err) => {
            if (err) {
              return res.status(500).json(err);
            }

            const io = getIO();

            io.emit("newOrder");

            res.json({
              success: true,
              token_no: token
            });
          }
        );
      }
    );
  });
};


// ACKNOWLEDGE READY ORDER
exports.acknowledgeOrder = (req, res) => {
  const { orderId } = req.params;
  const acknowledged_by = req.user.user_id;

  const selectSql = `
    SELECT
      order_id,
      token_no,
      status,
      acknowledged_by
    FROM orders
    WHERE order_id = ?
  `;

  db.query(selectSql, [orderId], (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: err.message
      });
    }

    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    const order = result[0];

    if (order.status !== "Ready") {
      return res.status(400).json({
        success: false,
        message: "Only Ready orders can be acknowledged"
      });
    }

    if (order.acknowledged_by !== null) {
      return res.status(400).json({
        success: false,
        message: "Order already acknowledged"
      });
    }

    const updateSql = `
      UPDATE orders
      SET acknowledged_by = ?,
          acknowledged_at = CURRENT_TIMESTAMP
      WHERE order_id = ?
    `;

    db.query(
      updateSql,
      [acknowledged_by, orderId],
      (err) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: err.message
          });
        }

        const io = getIO();

        io.emit("orderAcknowledged", {
          order_id: order.order_id,
          token_no: order.token_no
        });

        res.json({
          success: true,
          message: "Order acknowledged successfully",
          order_id: order.order_id,
          token_no: order.token_no
        });
      }
    );
  });
};


// GET UNACKNOWLEDGED READY ORDERS
exports.getReadyOrders = (req, res) => {
  const sql = `
    SELECT
      order_id,
      token_no,
      status,
      created_at
    FROM orders
    WHERE status = 'Ready'
      AND acknowledged_by IS NULL
    ORDER BY order_id ASC
  `;

  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: err.message
      });
    }

    res.json(result);
  });
};
