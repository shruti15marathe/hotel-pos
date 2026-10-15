const db = require("../config/db");

exports.getKitchenOrders = (req, res) => {
  const sql = `
    SELECT
      o.order_id,
      o.token_no,
      o.status,
      o.created_at,
      oi.item_id,
      oi.quantity,
      oi.note,
      m.item_name
    FROM orders o
    JOIN order_items oi ON o.order_id = oi.order_id
    JOIN menu_items m ON oi.item_id = m.item_id
   WHERE o.status IN ('New','Preparing','Ready')
  AND (o.status <> 'Ready' OR o.acknowledged_at IS NULL)
ORDER BY o.order_id DESC, oi.item_id
  `;

  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    const orders = {};

    result.forEach((item) => {
      if (!orders[item.order_id]) {
        orders[item.order_id] = {
  order_id: item.order_id,
  token_no: item.token_no,
  status: item.status,
  created_at: new Date(item.created_at).toISOString(),
  items: [],
};
      }

      orders[item.order_id].items.push({
        item_id: item.item_id,
        item_name: item.item_name,
        quantity: item.quantity,
        note: item.note
      });
    });

    res.json(Object.values(orders));
  });
};