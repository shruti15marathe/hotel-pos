const db = require("../config/db");

exports.getMenu = (req, res) => {
  const sql = `
    SELECT
      m.item_id,
      m.item_name,
      m.price,
      m.image_url,
      c.category_name
    FROM menu_items m
    JOIN categories c ON m.category_id = c.category_id
    WHERE m.is_available = 1
      AND c.status = 'active'
    ORDER BY c.category_name, m.item_name
  `;
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
};

exports.addMenuItem = (req, res) => {
  const { item_name, price, category_id } = req.body;
  const image_url = req.file ? `/uploads/menu/${req.file.filename}` : null;

  if (!item_name || !price || !category_id) {
    return res.status(400).json({
      success: false,
      message: "Item name, price and category are required"
    });
  }

  const sql = `
    INSERT INTO menu_items
    (item_name, price, category_id, image_url, is_available)
    VALUES (?, ?, ?, ?, 1)
  `;

  db.query(
    sql,
    [item_name, price, category_id, image_url],
    (err, result) => {
      if (err) return res.status(500).json(err);

      res.json({
        success: true,
        message: "Menu item added successfully",
        item_id: result.insertId,
        image_url
      });
    }
  );
};

exports.getCategories = (req, res) => {
  const sql = `
    SELECT category_id, category_name, status
    FROM categories
    ORDER BY category_name
  `;
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
};

exports.updateMenuItem = (req, res) => {
  const { id } = req.params;
  const { item_name, price, category_id } = req.body;

  if (!item_name || !price || !category_id) {
    return res.status(400).json({
      success: false,
      message: "Item name, price and category are required"
    });
  }

  let sql = `
    UPDATE menu_items
    SET item_name = ?, price = ?, category_id = ?
  `;
  const values = [item_name, price, category_id];

  if (req.file) {
    sql += `, image_url = ?`;
    values.push(`/uploads/menu/${req.file.filename}`);
  }

  sql += ` WHERE item_id = ?`;
  values.push(id);

  db.query(sql, values, (err) => {
    if (err) return res.status(500).json(err);

    res.json({
      success: true,
      message: "Menu item updated successfully"
    });
  });
};

exports.deleteMenuItem = (req, res) => {
  const { id } = req.params;
  const sql = `
    UPDATE menu_items
    SET is_available = 0
    WHERE item_id = ?
  `;

  db.query(sql, [id], (err) => {
    if (err) return res.status(500).json(err);

    res.json({
      success: true,
      message: "Menu item removed successfully"
    });
  });
};

exports.addCategory = (req, res) => {
  const { category_name } = req.body;

  if (!category_name || !category_name.trim()) {
    return res.status(400).json({
      success: false,
      message: "Category name is required"
    });
  }

  const sql = `
    INSERT INTO categories (category_name, status)
    VALUES (?, 'active')
  `;

  db.query(sql, [category_name.trim()], (err, result) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(400).json({
          success: false,
          message: "Category already exists"
        });
      }
      return res.status(500).json(err);
    }

    res.json({
      success: true,
      message: "Category added successfully",
      category_id: result.insertId
    });
  });
};

exports.updateCategory = (req, res) => {
  const { id } = req.params;
  const { category_name } = req.body;

  if (!category_name || !category_name.trim()) {
    return res.status(400).json({
      success: false,
      message: "Category name is required"
    });
  }

  const sql = `
    UPDATE categories
    SET category_name = ?
    WHERE category_id = ?
  `;

  db.query(sql, [category_name.trim(), id], (err, result) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(400).json({
          success: false,
          message: "Category already exists"
        });
      }
      return res.status(500).json(err);
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Category not found"
      });
    }

    res.json({
      success: true,
      message: "Category updated successfully"
    });
  });
};

exports.updateCategoryStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["active", "inactive"].includes(status)) {
    return res.status(400).json({
      success: false,
      message: "Invalid category status"
    });
  }

  const sql = `
    UPDATE categories
    SET status = ?
    WHERE category_id = ?
  `;

  db.query(sql, [status, id], (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Category not found"
      });
    }

    res.json({
      success: true,
      message:
        status === "inactive"
          ? "Category deactivated successfully"
          : "Category activated successfully"
    });
  });
};