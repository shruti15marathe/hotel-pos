const db = require("../config/db");
const { getIO } = require("../socket");

exports.updateStatus = (req, res) => {
  const { order_id } = req.params;
  const { status } = req.body;

  // Get token number first
  db.query(
    "SELECT token_no FROM orders WHERE order_id=?",
    [order_id],
    (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }

      if (result.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }

      const token_no = result[0].token_no;

      // Update status
      db.query(
        "UPDATE orders SET status=? WHERE order_id=?",
        [status, order_id],
        (err) => {
          if (err) {
            return res.status(500).json(err);
          }

          // Notify connected clients
          const io = getIO();

          io.emit("orderStatusUpdated", {
            order_id,
            token_no,
            status,
          });

          res.json({
            success: true,
            message: "Order status updated",
          });
        }
      );
    }
  );
};