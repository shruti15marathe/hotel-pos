const db = require("../config/db");

exports.getHotel = (req, res) => {
  const sql = `
  SELECT
    hotel_name,
    address,
    gst,
    email,
    phone,
    logo
  FROM hotel_settings
  LIMIT 1
`;

  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Hotel information not found",
      });
    }

    res.json(result[0]);
  });
};

exports.updateHotel = (req, res) => {
  const {
    hotel_name,
    address,
    gst,
    email,
    phone,
    logo
  } = req.body;

  const sql = `
    UPDATE hotel_settings
    SET
      hotel_name = ?,
      address = ?,
      gst = ?,
      email = ?,
      phone = ?,
      logo = ?
    WHERE id = 1
  `;

  db.query(
    sql,
    [
      hotel_name,
      address,
      gst,
      email,
      phone,
      logo
    ],
    (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }

      res.json({
        success: true,
        message: "Hotel information updated successfully"
      });
    }
  );
};